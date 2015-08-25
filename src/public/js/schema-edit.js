// TODO normalize naming SchemaEdit -> SchemaEditor
// TODO use console.log()s for tests, then remove

/**
 * Comment template. TODO fill me in
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
var SchemaEdit = (function () {
    "use strict";

    // This is the public interface of the SchemaEditor module.
    var SchemaEdit = {

        init: function () {
            $("#endpointHost").val(Config.sparqlServerHost);

            $("#updatePath").val(Config.sparqlUpdateEndpoint);
            $("#queryPath").val(Config.sparqlQueryEndpoint);

            $( "#combobox" ).combobox();
        },

        makeClassesList: function () {
            var callback = function (json) {
                SchemaEdit.makeListBlock(json, $("#classes"));
            }
            var classList = SparqlConnector.listClasses(callback);
        },

        makePropertiesList: function () {
            var callback = function (json) {
                SchemaEdit.makeListBlock(json, $("#properties"));
            }
            var propertiesList = SparqlConnector.listProperties(callback);
        },

        makeListBlock: function (json, target) {
            // nest the list-block inside a <div> container
            var listContainer = $("<div class='list-container'></div>");
            var listElement = $("<ul class='list-block'/>");
            listContainer.append(listElement);
            // add it wherever required
            target.append(listContainer); // TODO consider returning the block instead, let the caller decide what to do with it

            for (var i = 0; i < json.length; i++) {
                var uri = json[i]["uri"];
                var split = uri.split("/");
                var name = split[split.length - 1];
                var itemElement = $("<li></li>");
                var split = window.location.href.split("?");
                var url = split[0] + "?uri=" + encodeURI(uri);
                var aElement = $("<a/>").attr("href", url);
                if (name.length > 5) {
                    //   name = name.substring(0, 5); // TODO remove
                    aElement.text(name);
                    itemElement.append(aElement);
                    listElement.append(itemElement);
                }
            }
        },

        populateWithResource: function (uri) { //  callback??
            //  console.log("getresource " + uri);
            // var type = queryString["type"];
            // console.log("TYPE=" + type);
            SchemaEdit.makeAddProperty(uri);

            var map = {
                graphURI: SparqlConnector.getGraphURI(),
                uri: uri
            };

            var getResourceUrl = SchemaEdit.generateGetUrl(getResourceSparqlTemplate, map);

            var buildEditor = function (json) {

                    // console.log("json = " + JSON.stringify(json, null, 4));
                    // return;
                    for (var i = 0; i < json.length; i++) {
                        var current = json[i];
                        var node = $("<div class='propertyItem'></div>");

                        var property = $("<a/>");
                        var p = current["p"];
                        property.attr("href", p);
                        var pText = p;

                        // console.log("p = " + p);
                        // console.log("SparqlConnector.getPrefixedUri(p) = " + SparqlConnector.getPrefixedUri(p));
                        // console.log("pNamespace = " + pNamespace);

                        if (SparqlConnector.getPrefixedUri(p)) {
                            pText = SparqlConnector.getPrefixedUri(p);
                        }
                        property.text(pText);
                        node.append(property);

                        var deleteButton = SchemaEdit.makeDeleteButton();

                        var triple = "<" + SparqlConnector.getCurrentResource() + "> "; // subject
                        triple += "<" + p + "> "; // predicate/property
                        // triple += ""

                        property.after(deleteButton);

                        var value = $("<div>what default?</div>"); // needed for bnodes?

                        var o = current["o"];


                        if (current.type == "literal") { // as returned from SPARQL
                            value = $("<div id='literalEditor' contenteditable='true' title='click to edit'>" + o + "</div>");
                            triple += "\"\"\"" + o + "\"\"\" ."; // object
                            value.text(o);
                            var language = current["language"];
                            console.log("language = " + language);
                            if(!language || language == ""){
                                language = "en";
                            }
                            value.append(SchemaEdit.makeLanguageButton(uri, p, o, language));
                            console.log("value = \n" + value.html());
                            value.append(SchemaEdit.makeUpdateButton(uri, p, o, language));
                        }

                        if (current.type == "uri") { // as returned from SPARQL
                            var uriText = o;
                            if (SparqlConnector.getPrefixedUri(o)) {
                                uriText = SparqlConnector.getPrefixedUri(o);
                            }
                            value = $("<a />");

                            value.attr("href", o);

                            var changePredicateButton = $("<button class='inline'>Change</button>");

                            changePredicateButton.attr("title", "change this value"); // tooltip

                            triple += " <" + o + "> ."; // object

                            changePredicateButton.attr("data-triple", triple); // stick resource data in attribute
                            node.append(changePredicateButton);

                            value.text(uriText);
                        }
                        deleteButton.attr("data-triple", triple); // stick resource data in attribute
                        node.append(value);

                        var propertyBlock = $("<p class='propertyBlock'/>");
                        propertyBlock.append("<hr/><strong>Property</strong>").append(node);
                        $("#editor").append(propertyBlock);
                    }
                    // console.log("in buildEditor() -  $(''.delete '').size() = " + $(".delete").size());
                    SchemaEdit.setupButtons();
                }
                //  console.log("getResourceUrl = " + getResourceUrl);
            SparqlConnector.getJsonForSparqlURL(getResourceUrl, buildEditor);

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
                    //    var language = $("input[name=radioName]:checked");
                    var language;

                    $('.language-radio').each(function () {
                        if (this.type == 'radio' && this.checked) {
                            console.log("here " + this.name + " = " + $(this).val() + " = " + $(this).attr("id") + " = " + $(
                                this).text());
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
                // console.log("TRIPLE on delete = " + triple);
                var callback = function (msg) {


                        //    console.log("callback called");
                    }
                    //    SparqlConnector.deleteTurtle(triple, callback);
            });

            return languageButton;
        },

        makeUpdateButton: function (subject, predicate, object, language) {
            var updateButton = $("<button>Update</button>");
            updateButton.attr("title", "update this literal value"); // tooltip
            var tripleAttribute = SchemaEdit.makeTripleAttribute(subject, predicate, object, true);
            updateButton.attr("data-triple", tripleAttribute); // stick resource data in attribute

            updateButton.click(function () {
                var newContent = updateButton.parent().html();
                newContent = newContent.replace(/<button.+button>/g, ""); // TODO get button placed better, remove this
                // alert(newContent);

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
            deleteButton.append("<br/>");
            return deleteButton;
        },

        makeTripleAttribute: function (subject, predicate, object, isLiteral) {
            var triple = "<" + subject + "> <" + predicate + "> ";
            if (isLiteral) {
                triple += "\"\"\"" + object + "\"\"\" .";
            } else {
                triple += " <" + object + "> .";
            }
            return triple;
        },

        setupButtons: function () {
            //console.log("Setting up buttons");
            //console.log("$(''.delete '').size() = " + $(".delete").size());
            $(".delete").each(function (index) {
                //console.log("each .delete " + $(this));
                //console.log(index + ": " + $(this).text());
                $(this).click(function () {
                    //    alert("Handler for .click() called.");
                    var triple = $(this).attr("data-triple");
                    // console.log("TRIPLE on delete = " + triple);
                    var callback = function (msg) {

                        $("#dialog").html(msg);
                        $("#dialog").dialog({
                            close: function (event, ui) {
                                location.reload(true);
                            }
                        });
                        //    console.log("callback called");
                    }
                    SparqlConnector.deleteTurtle(triple, callback);
                    // history.add("before",currentState)
                    // history.add("undo",sparql)


                    // history.add("after",currentState)
                    // history.add("item",undo button)
                });
            });

            $(".change").each(function (index) {
                //console.log("each .delete " + $(this));
                //console.log(index + ": " + $(this).text());
                $(this).click(function () {
                    alert("Handler for .click() called.");
                    var triple = $(this).attr("data-triple");
                    // console.log("TRIPLE on delete = " + triple);
                    var callback = function (msg) {

                        $("#dialog").html(msg);
                        $("#dialog").dialog({
                            close: function (event, ui) {
                                location.reload(true);
                            }
                        });
                        //    console.log("callback called");
                    }
                    SparqlConnector.changeTurtle(triple, callback);
                    // history.add("before",currentState)
                    // history.add("undo",sparql)


                    // history.add("after",currentState)
                    // history.add("item",undo button)
                });
            });

            $("#turtle").click(function () {
                var query = "CONSTRUCT {?s ?p ?o } WHERE {?s ?p ?o}";
                var turtleURL = Config.sparqlServerHost + Config.sparqlQueryEndpoint +
                    encodeURIComponent(query) + "&output=text";
                location.href = turtleURL;
            });

            $("#newPageButton").click(function () {
                var newPageName = $("#newPageName").val();
                window.location.href = window.location.href = Config.serverRootPath +
                    "edit.html?uri=" + Config.graphURI + "/" + newPageName;
            });

            $("#upload-button").click(function () {
                var data = new FormData($("#upload-file").val());
                // console.log("DATA = " + data);
                $.ajax({
                    url: Config.sparqlUpdateEndpoint,
                    type: 'POST',
                    data: ({
                        update: data
                    }),
                    //    contentType: "application/sparql-update",
                    processData: false,
                    contentType: false
                });
                //    e.preventDefault();
            });
        },

        makeAddProperty: function (uri) {
            var updatePropertyButton = $("<button id='updateProperty'>Add this property</button>");
            updatePropertyButton.append($("<hr/>"));
            var updateClassButton = $("<button id='updateClass'>Add this class</button>");
            updateClassButton.append($("<hr/>"));
            // $("#editor").prepend(addPropertyButton);
            $("#newProperty").append(updatePropertyButton);
            $("#newClass").append(updateClassButton);
            // $("#newProperty") is <input>
            updatePropertyButton.click(function () {

            });
            updateClassButton.click(function () {

            });
            var chooser = SchemaEdit.makePropertyChooser(uri);

        },

        makePropertyChooser: function (uri) {
            var map = {
                graphURI: SparqlConnector.getGraphURI(),
            };
            var getAllPropertiesUrl = SchemaEdit.generateGetUrl(getPropertyListSparqlTemplate, map);
            var callback = function (json) {
                // console.log("schema-edit.js PropertyChooser JSON = " + JSON.stringify(json));
            };
            SparqlConnector.getJsonForSparqlURL(getAllPropertiesUrl, callback);
        },

        makeAddClass: function (uri) {
            var addPropertyButton = $("<button id='addClass'>Add Class</button>");
            $("#editor").prepend(addClassButton);
            addClassButton.click(function () {

            });
            var chooser = SchemaEdit.makePropertyChooser(uri);

        },

        makeClassChooser: function (uri) {
            var map = {
                graphURI: SparqlConnector.getGraphURI(),
            };
            var getAllClassesUrl = SchemaEdit.generateGetUrl(getClassListSparqlTemplate, map);
            var callback = function (json) {
                console.log("schema-edit.js ClassChooser JSON = " + JSON.stringify(json));
            };
            SparqlConnector.getJsonForSparqlURL(getAllclassesUrl, callback);
        },

        generateGetUrl: function (sparqlTemplate, map) {
            var sparql = sparqlTemplater(sparqlTemplate, map);
            return Config.sparqlServerHost + Config.sparqlQueryEndpoint +
                encodeURIComponent(sparql);
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

    // privateFunction is completely hidden
    // from the outside.
    function privateFunction() {
        return "privateFunction cannot";
    }

    return SchemaEdit;
}());
