// TODO normalize naming SchemaEdit -> SchemaEditor
// TODO use console.log()s for tests, then remove
/**
 * The SchemaEdit module
 * Provides UI for SchemaEditor
 */
var SchemaEdit = (function () {
    "use strict";
    /**
     * This is the public interface of the SchemaEdit module.
     */
    var SchemaEdit = {
        /**
         * Initialises SchemaEdit UI
         */
        init: function () {
            $("#endpointHost").val(Config.sparqlServerHost);
            $("#updatePath").val(Config.sparqlUpdateEndpoint);
            $("#queryPath").val(Config.sparqlQueryEndpoint);

            SchemaEdit.populatePropertiesCombobox();
            SchemaEdit.populateResourcesCombobox($("#resourceChooser"), "resource");
            SchemaEdit.populateResourcesCombobox($("#propertyUriValue"), "uriValue");
            //  SchemaEdit.populateClassesCombobox(); // adds anything?
        },

        setCurrentResource: function (uri) {
            SparqlConnector.setCurrentResource(uri);
        },

        populateWithResource: function (uri) { //  callback??
            SchemaEdit.makeAddProperty(uri);

            var map = {
                graphURI: SparqlConnector.getGraphURI(),
                uri: uri
            };

            var getResourceUrl = SchemaEdit.generateGetUrl(getResourceSparqlTemplate, map);

            var makePropertyBlocks = function (json) {
                // console.log("makePropertyBlocks json \n"+JSON.stringify(json, false, 4));
                for(var i = 0; i < json.length; i++) {
                    var current = json[i];
                    var propertyItem = $("<div class='propertyItem'></div>");
                    var property = $("<a/>");
                    var p = current["p"];
                    property.attr("href", p);

                    var pText = p;
                    if(SparqlConnector.getPrefixedUri(p) != null) {
                        pText = SparqlConnector.getPrefixedUri(p);
                    }
                    property.text(pText);

                    var propertyWrapper = $("<div class='predicate'></div>");
                    propertyWrapper.append(property);
                    propertyItem.append(propertyWrapper);

                    var deleteButton = SchemaEdit.makeDeleteButton();
                    var triple = "<" + SparqlConnector.getCurrentResource() + "> "; // subject
                    triple += "<" + p + "> "; // predicate/property
                    // triple += ""
                    //  property.after(deleteButton);
                    var value = $("<div>what default?</div>"); // needed for bpropertyItems?
                    var o = current["o"];
                    if(current.type == "literal") { // as returned from SPARQL
                        var language = current["language"];
                        // console.log("language = " + language);
                        var value = $("<div class='literalObject' contenteditable='true' title='click to edit'>" + o + "</div>");

                        // valueWrapper.append(value);
                        // value.text(o);
                        if(!language || language == "") {
                            triple += "\"\"\"" + o + "\"\"\" ."; // object
                        } else {
                            triple += "\"\"\"" + o + "\"\"\"@" + language + " ."; // object
                        }

                        if(!language || language == "") { // sensible default
                            language = "en";
                        } // TODO best approach? see above
                    }
                    if(current.type == "uri") { // as returned from SPARQL
                        var uriText = o;
                        if(SparqlConnector.getPrefixedUri(o)) {
                            uriText = SparqlConnector.getPrefixedUri(o);
                        }

                        value = $("<a />");
                        value.attr("href", o);
                        var value = $("<div class='uriObject' title='click to view target'><a href=''" + o + "'>" + uriText + "</a></div>");

                        triple += " <" + o + "> ."; // object

                        /*
                         * functionality is already available via Add Property/ Delete
                         * leaving here for now during evaluation
                         */
                        //  propertyItem.append(SchemaEdit.makeChangePredicateButton(triple));

                        //    value.text(uriText);

                    }
                    deleteButton.attr("data-triple", triple); // stick resource data in attribute

                    var propertyBlock = $("<p class='propertyBlock'/>");
                    propertyBlock.append("<strong>Property</strong>").append(propertyItem);
                    propertyItem.append(value);
                    if(current.type == "literal") { // TODO refactor
                        propertyItem.append(SchemaEdit.makeLanguageButton(uri, p, o, language));
                        propertyItem.append($("<br/>"));
                        // console.log("value = \n" + value.html());
                        propertyItem.append(SchemaEdit.makeUpdateButton(uri, p, o, language));
                        //  property.after(deleteButton);
                    }
                    propertyItem.append(deleteButton);
                    propertyBlock.append("<hr/>");
                    $("#editor").append(propertyBlock);
                }
                SchemaEdit.setupButtons();
            }
            SparqlConnector.getJsonForSparqlURL(getResourceUrl, makePropertyBlocks);
        },

        /**
         * Loads list of properties from SPARQL store into combo box(es)
         */
        populateResourcesCombobox: function (target, id) {
            var callback = function (json) {
                // console.log("populateResourcesCombobox json = \n" + JSON.stringify(json, false, 4));
                var chooser = SchemaEdit.makeChooser(json);
                chooser.appendTo(target);
                var combobox = chooser.combobox();
                combobox.combobox("setInputId", id);
                $("#chooseResourceButton").click(function () {
                    var newResource = $("#resource").val();
                    // SchemaEdit.setCurrentResource(newResource);

                    // move to new page
                    var split = window.location.href.split("?");
                    window.location.href = split[0] + "?uri=" + encodeURI(newResource);
                });
            };
            SparqlConnector.listResources(callback);
        },

        //  populatePropertyUriValueCombobox:

        /**
         * Loads list of properties from SPARQL store into combo box(es)
         */
        populatePropertiesCombobox: function () {
            var callback = function (json) {
                // SchemaEdit.makeListBlock(json, $("#properties"));
            }
            var propertiesList = SparqlConnector.listProperties(callback); // TODO this is called again below, cache somewhere?
            var chooser = SchemaEdit.makeTypedChooser("rdf:Property");
            $("#propertyChooser").append($("<label for='addProperty'>Add Property</label>"));
            chooser.appendTo($("#propertyChooser"));

            var combobox = chooser.combobox();
            combobox.combobox("setInputId", "addProperty");

            $("#addPropertyButton").click(function () {
                var subject = SparqlConnector.getCurrentResource();
                var predicate = $("#propertyChooser").find("input").val();
                var object = $("#propertyLiteralValue").val();
                var isLiteral = true;
                if(!object || object == "") {
                    object = $("#uriValue").val();
                    alert("OBJECT = "+object);
                    isLiteral = false;
                }
                var language = "en";
                var callback = function (msg) {
                    alert(msg);
                    window.location.reload();
                };
                // alert("predicate = " + predicate);
                if(isLiteral) {
                    SparqlConnector.updateLiteralTriple(subject, predicate, object, language, callback);
                } else {
                    SparqlConnector.updateUriTriple(subject, predicate, object, language, callback);
                }

            });
        },

        // NOT USED
        populateClassesCombobox: function () {
            var callback = function (json) {
                // SchemaEdit.makeListBlock(json, $("#properties"));
            }
            var classedList = SparqlConnector.listProperties(callback); // TODO this is called again below, cache somewhere?
            var chooser = SchemaEdit.makeTypedChooser("rdfs:Class");
            chooser.appendTo($("#classChooser"));
            chooser.combobox();
            $("#addClassButton").click(function () {
                var subject = SparqlConnector.getCurrentResource();
                var predicate = $("#classChooser").find("input").val();
                var object = "dummy object";
                var language = "en";
                var callback = function () {
                    refresh();
                };
                //  alert(predicate);
                SparqlConnector.updateTriple(subject, predicate, object, language, callback);
            });
        },

        makeChooser: function (valueList) {
            // console.log("type = " + type);
            var choices = $("<select></select>");

            for(var i = 0; i < valueList.length; i++) {
                var listItem = valueList[i];
                // console.log("type : " + type);
                //     <option value="ActionScript">ActionScript</option>
                var option = $("<option class='choice'></option>");
                option.attr("value", listItem);
                option.text(listItem);
                // var last = $(".typeChoice").last();
                // last.after(option);
                choices.append(option);
                // console.log("choices =\n" + choices.html());
            }
            return choices;
        },

        makeTypedChooser: function (type) { // TODO getResourcesOfTypeSparqlTemplate is used elsewhere, refactor
            // console.log("type = " + type);
            var choices = $("<select></select>");
            var map = {
                "graphURI": SparqlConnector.getGraphURI(),
                "type": type
            };

            var getTypesUrl = SchemaEdit.generateGetUrl(getResourcesOfTypeSparqlTemplate, map);
            var callback = function (typesArray) {
                // {"type":"uri","uri":"http://data.admin.ch/def/hgv/longName","range":"http://www.w3.org/2000/01/rdf-schema#Literal"},
                for(var i = 0; i < typesArray.length; i++) {
                    var type = typesArray[i]["uri"];
                    // console.log("type : " + type);
                    //     <option value="ActionScript">ActionScript</option>
                    var option = $("<option class='choice'></option>");
                    option.attr("value", type);
                    option.text(type);
                    // var last = $(".typeChoice").last();
                    // last.after(option);
                    choices.append(option);
                    // console.log("choices =\n" + choices.html());
                }
            };
            SparqlConnector.getJsonForSparqlURL(getTypesUrl, callback);
            return choices;
        },

        // NOT USED
        makeClassesList: function () {
            var callback = function (json) {
                SchemaEdit.makeListBlock(json, $("#classes"));
            }
            var classList = SparqlConnector.listClasses(callback);
        },

        /**
         * Comment template. TODO fill me in
         * @param {string} foo This is a param with a description too long to fit in
         *     one line.
         * @return {number} This returns something that has a description too long to
         *     fit in one line.
         */
        makePropertiesList: function () {
            var callback = function (json) {
                SchemaEdit.makeListBlock(json, $("#properties"));
            }
            var propertiesList = SparqlConnector.listProperties(callback); // TODO refactor, as used above
        },

        makeListBlock: function (json, target) {
            // nest the list-block inside a <div> container
            var listContainer = $("<div class='list-container'></div>");
            var listElement = $("<ul class='list-block'/>");

            listContainer.append(listElement);
            target.append(listContainer); // TODO consider returning the block instead, let the caller decide what to do with it

            for(var i = 0; i < json.length; i++) {
                var uri = json[i]["uri"];
                var split = uri.split("/");
                var name = split[split.length - 1];
                var itemElement = $("<li></li>");
                var split = window.location.href.split("?");
                var url = split[0] + "?uri=" + encodeURI(uri);
                var aElement = $("<a/>").attr("href", url);
                if(name.length > 5) {
                    //   name = name.substring(0, 5); // TODO remove
                    aElement.text(name);
                    itemElement.append(aElement);
                    listElement.append(itemElement);
                }
            }
        },

        makeLanguageButton: function (subject, predicate, object, language) {
            var languageButton = $("<button class='language'></button>");
            languageButton.text(language);
            languageButton.click(function () {
                //    alert("Handler for .click() called.");
                var languageChoices = $("#language-radio").html();
                var dialog = $("#dialog");
                // dialog.buttonset(); // jQueryUI
                dialog.addClass("show");
                dialog.html(languageChoices);
                var updateHandler = function () {
                    var language;
                    $('.language-radio').each(function () {
                        if(this.type == 'radio' && this.checked) {
                            console.log("here " + this.name + " = " + $(this).val() + " = " + $(this).attr("id") +
                                " = " +
                                $(this).text());
                            language = $(this).val()
                        }
                    });
                    // console.log("lang = "+language);
                    $(this).dialog("close");
                    SparqlConnector.updateTriple(subject, predicate, object, language, callback);
                    location.reload(true);
                };
                dialog.dialog({
                    resizable: false,
                    modal: true,
                    buttons: {
                        "Update Value": updateHandler,
                        Cancel: function () {
                            $(this).dialog("close");
                        }
                    }
                });
                var callback = function (msg) {
                    //    console.log("callback called");
                }
            });
            return languageButton;
        },

        makeUpdateButton: function (subject, predicate, object, language) {
            console.log("makeUpdateButton object = " + object);
            var updateButton = $("<button>Update</button>");
            updateButton.attr("title", "update this literal value"); // tooltip
            var tripleAttribute = SchemaEdit.makeTripleAttribute(subject, predicate, object, true);
            updateButton.attr("data-triple", tripleAttribute); // stick resource data in attribute
            updateButton.click(function () {

                var newContent = updateButton.parent().find(".literalObject").text();

                // newContent = newContent.replace(/<button.+button>/g, ""); // TODO get button placed better, remove this
                // var timestamp = ?????
                // historyBefore("update"+timestamp)
                // historyAfter("update"+timestamp)
                // history.add("before",currentState)
                // history.add("undo",sparql)
                // history.add("after",currentState)
                // history.add("item",undo button)
                var callback = function () {
                    $("#dialog").html(newContent);
                    $("#dialog").dialog({
                        close: function (event, ui) {
                            location.reload(true);
                        }
                    });
                    console.log("callback called");
                }
                SparqlConnector.updateTriple(subject, predicate, newContent, language, callback);
            });
            return updateButton;
        },

        makeDeleteButton: function () {
            var deleteButton = $("<button class='delete'>Delete</button>");
            deleteButton.attr("title", "delete this property"); // tooltip
            //  deleteButton.append("<br/>");
            deleteButton.click(function () {
                //    alert("Handler for .click() called.");
                var triple = deleteButton.attr("data-triple");
                // console.log("TRIPLE on delete = " + triple);
                var callback = function (msg) {
                    $("#dialog").html(msg);
                    $("#dialog").dialog({
                        close: function (event, ui) {
                            location.reload(true);
                        }
                    });
                }
                SparqlConnector.deleteTurtle(triple, callback);
                // history.add("before",currentState)
                // history.add("undo",sparql)
                // history.add("after",currentState)
                // history.add("item",undo button)
            });
            return deleteButton;
        },

        /*
         * NOT USED
         * functionality is already available via Add Property/ Delete
         * leaving here for now during evaluation
         */
        makeChangePredicateButton: function (triple) {
            var changePredicateButton = $("<button class='inline'>Change</button>");
            changePredicateButton.attr("title", "change this value"); // tooltip

            changePredicateButton.attr("data-triple", triple); // stick resource data in attribute

            changePredicateButton.click(function () {
                // alert("Handler for .click() called.");
                var triple = changePredicateButton.attr("data-triple");
                // console.log("TRIPLE on delete = " + triple);
                var callback = function (msg) {
                    $("#dialog").html(msg);
                    $("#dialog").dialog({
                        close: function (event, ui) {
                            location.reload(true);
                        }
                    });
                };
                SparqlConnector.updateTriple(triple, callback);
                // history.add("before",currentState)
                // history.add("undo",sparql)
                // history.add("after",currentState)
                // history.add("item",undo button)
            });
            return changePredicateButton;
        },

        makeTripleAttribute: function (subject, predicate, object, isLiteral) {
            var triple = "<" + subject + "> <" + predicate + "> ";
            if(isLiteral) {
                triple += "\"\"\"" + object + "\"\"\" .";
            } else {
                triple += " <" + object + "> .";
            }
            return triple;
        },

        setupButtons: function () { // TODO refactor - move local to buttons?

            $("#turtle").click(function () {
                location.href = SparqlConnector.getTurtleUrl();
            });

            $("#newPageButton").click(function () {
                var newPageName = $("#newPageName").val();
                window.location.href = window.location.href = Config.serverRootPath + "edit.html?uri=" + Config.graphURI + "/" +
                    newPageName;
            });

            $("#upload-button").click(function () {
                var data = new FormData($("#upload-file").val());
                $.ajax({
                    url: Config.sparqlUpdateEndpoint,
                    type: 'POST',
                    data: ({
                        update: data
                    }),
                    processData: false,
                    contentType: false
                });
                //    e.preventDefault();
            });
        },

        makeAddProperty: function (uri) {
            var updatePropertyButton = $("<button id='updateProperty'>Add this property</button>");
            // updatePropertyButton.append($("<hr/>"));
            var updateClassButton = $("<button id='updateClass'>Add this class</button>");
            //  updateClassButton.append($("<hr/>"));
            $("#newProperty").append(updatePropertyButton);
            $("#newClass").append(updateClassButton);
            // $("#newProperty") is <input>
            updatePropertyButton.click(function () {

            });
            updateClassButton.click(function () {});
        },

        makePropertyChooser: function () {
            var map = {
                graphURI: SparqlConnector.getGraphURI(),
            };
            var getAllPropertiesUrl = SchemaEdit.generateGetUrl(getPropertyListSparqlTemplate, map);
            var callback = function (propertiesArray) {
                // {"type":"uri","uri":"http://data.admin.ch/def/hgv/longName","range":"http://www.w3.org/2000/01/rdf-schema#Literal"},
                for(var i = 0; i < propertiesArray.length; i++) {
                    var property = propertiesArray[i]["uri"];
                    console.log("property : " + property);
                    //     <option value="ActionScript">ActionScript</option>
                    var option = $("<option class='propertychoice'></option>");
                    option.attr("value", property);
                    option.text(property);
                    var last = $(".propertyChoice").last();
                    last.after(option);
                }
            };
            SparqlConnector.getJsonForSparqlURL(getAllPropertiesUrl, callback);
        },

        makeAddClass: function (uri) {
            var addPropertyButton = $("<button id='addClass'>Add Class</button>");
            $("#editor").prepend(addClassButton);
            addClassButton.click(function () {});
            var chooser = SchemaEdit.makeClassChooser(uri);
        },

        generateGetUrl: function (sparqlTemplate, map) {
            var sparql = sparqlTemplater(sparqlTemplate, map);
            //  console.log("generateGetUrl sparql = " + sparql);
            return Config.sparqlServerHost + Config.sparqlQueryEndpoint + encodeURIComponent(sparql);
        },

        deleteResource: function (resourceURI) {
                var map = {
                    "graphURI": SchemaEdit.getGraphURI(),
                    "resourceURI": resourceURI
                };
                var sparql = sparqlTemplater(deleteResourceSparqlTemplate, map);
                console.log("SPARQL for delete = " + sparql);
                postData(sparql);
            }
            /*
             * naive ntriples-based CONSTRUCT logging/diff for now sparqlLog.add
             * sparqlLog.takeSnapshot sparqlLog.diff(snapshotBefore, snapshotAfter)
             */
    };

    return SchemaEdit;
}());
