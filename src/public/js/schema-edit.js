/**
 * The SchemaEdit module
 * Provides UI for SchemaEditor
 */
var SchemaEdit = (function () {
    "use strict";
    /**
     * The public interface of the SchemaEdit module.
     */
    var SchemaEdit = {
        /**
         * Initialises SchemaEdit UI
         */
        init: function () {
            SchemaEdit.endpointsDialog();
            //  $("#endpointHost").val(Config.getEndpointHost());
            //  $("#endpointLink").attr("href", Config.getEndpointHost());
            $("#queryEndpoint").val(Config.getQueryEndpoint());
            $("#updateEndpoint").val(Config.getUpdateEndpoint());

            SchemaEdit.makeDeleteResourceButton();
            SchemaEdit.makeGraphChooser();
            SchemaEdit.makePropertyChooser();
            SchemaEdit.addClassHandler();
            SchemaEdit.addPropertyHandler();

            SchemaEdit.makeResourceChooser($("#resourceChooser"), "resource");
            SchemaEdit.makeResourceChooser($("#propertyUriValue"), "uriValue");
            //  SchemaEdit.populateClassesCombobox(); // adds anything?

            SchemaEdit.makeUploadGraphButton();
            SchemaEdit.makeTurtleButton();
            //  SchemaEdit.setupButtons();
            SchemaEdit.makeEndpointButton();

            SchemaEdit.makeNewVocabButton();
            SchemaEdit.makeNewVocabBlock();

            SchemaEdit.setupHelpButtons();
        },

        makeDeleteResourceButton: function () {
            $("#deleteResource").click(
                function () {
                    var resource = Config.getCurrentResource();
                    var callback = function (msg) {
                        $("#deleteResourceText").dialog();
                    }
                    SparqlConnector.deleteResource(resource, callback);
                    var split = window.location.href.split("?");
                    window.location.href = split[0] + "?graph=" + Config.getGraphURI();
                }
            );
        },

        makeNewVocabButton: function () {
            $("#newVocabButton").click(
                function () {
                    $("#newVocabBlock").show();
                    $("#currentResourceBlock").hide();
                    $("#currentGraphBlock").hide();
                }
            );
        },

        endpointsDialog: function () {
            $("#endpointClearButton").click(
                function () {
                    $("#endpoints input").val("");
                }
            );
            var dialog = function () {
                $("#endpoints").dialog({
                    width: 800
                });
            }
            SparqlConnector.ping(dialog);
        },

        setupHelpButtons: function () {
            $(".helpButton").click(
                function () {
                    $(this).next().dialog({
                        width: 800
                    });
                }
            );
            /*
            $("#overviewHelp").position({
                my: "center",
                at: "right",
                of: "#pageTitle"
            });
            $("#classesPropertiesHelpButton").position({
                my: "center",
                at: "left",
                of: "#classesTitle"
            });
            */
        },

        /* Builds graph chooser combobox/autocomplete
         * queries stores for values
         * adds to #graphChooser element
         * in header in current UI */
        makeGraphChooser: function () {
            var populateChooser = function (graphList) {
                var chooser = SchemaEdit.makeChooser(graphList, "selectGraph");
                $("#graphChooser").append(chooser);
                var combobox = chooser.combobox();

                combobox.combobox("setInputId", "graph");
                combobox.combobox({
                    select: function (event, ui) {
                        var newGraph = this.value;
                        Config.setGraphURI(newGraph);
                        var split = window.location.href.split("?");
                        window.location.href = split[0] + "?graph=" + encodeURI(newGraph);

                        // the above can sometimes leave you far down the page, so scroll up
                        $("html, body").animate({
                            scrollTop: 0
                        }, "slow");
                    }
                });
                SchemaEdit.setGraphFromUrl();
            };
            SparqlConnector.listGraphs(populateChooser);
        },

        setGraphFromUrl: function () {
            var graph = parseUri(window.location.href).queryKey.graph;
            if(graph && (graph != "")) {
                $("#graph").val(graph);
            }
        },

        /**
         * Builds Resource chooser combobox/autocomplete widget
         * queries stores for values
         * in header in current UI
         * @param {string} target the element to which the <select> will be appended
         * @param {string} id the id attribute for the <input> field
         */
        makeResourceChooser: function (target, id) {
            var callback = function (json) {
                var chooser = SchemaEdit.makeChooser(json, "selectResource");
                chooser.appendTo(target);
                var combobox = chooser.combobox();
                combobox.combobox("setInputId", id);
                combobox.combobox({
                    select: function (event, ui) {
                        //    var newResource = $("#resource").val();
                        var newResource = this.value;
                        // relocate with new URL query params
                        var split = window.location.href.split("?");
                        var graph = parseUri(window.location.href).queryKey.graph;
                        var newLocation = split[0] + "?uri=" + encodeURI(newResource);
                        if(graph && (graph != "")) {
                            newLocation = newLocation + "&graph=" + graph;
                        }
                        window.location.href = newLocation;

                        Config.getGraphURI(newResource);

                        $("html, body").animate({ // the above can sometimes leave you far down the page, so scroll up
                            scrollTop: 0
                        }, "slow");
                    }
                });
                SchemaEdit.setResourceFromUrl();
            };
            SparqlConnector.listResources(callback);
        },

        setResourceFromUrl: function () {
            var uri = parseUri(window.location.href).queryKey.uri;
            if(uri && (uri != "")) {
                $("#resource").val(uri);
            }
        },

        /**
         * Shared function for combobox/autocomplete creation
         * creates and populates a <select> block from an array of values
         * @param {Array} valueList the values to be loaded into combobox/autocomplete
         * @param {string} selectId the id attribute for the <select> block
         * @return {jQuery object} a populated <select> block
         */
        makeChooser: function (valueList, selectId) {
            valueList.sort(); // alphabetical by default
            var choices = $("<select></select>");
            choices.attr("id", selectId);
            for(var i = 0; i < valueList.length; i++) {
                var listItem = valueList[i];
                var option = $("<option class='choice'></option>");
                option.attr("value", listItem);
                option.text(listItem);
                choices.append(option);
            }
            return choices;
        },

        /* fill in main block with details of current resource */
        populateWithResource: function (uri) { //  callback??
            SchemaEdit.makeAddPropertyValue(uri);

            var map = {
                graphURI: Config.getGraphURI(),
                uri: uri
            };

            var getResourceUrl = SchemaEdit.generateGetUrl(getResourceSparqlTemplate, map);

            var makePropertyBlocks = function (json) {
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
                    var triple = "<" + Config.getCurrentResource() + "> "; // subject
                    triple += "<" + p + "> "; // predicate/property

                    var value = $("<div>what default?</div>"); // needed for bpropertyItems?
                    var o = current["o"];
                    if(current.type == "literal") { // as returned from SPARQL
                        var language = current["language"];

                        var value = $("<div class='literalObject' contenteditable='true' title='click to edit'>" + o + "</div>");

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
                        propertyItem.append(SchemaEdit.makeUpdateButton(uri, p, o, language));
                    }
                    propertyItem.append(deleteButton);
                    propertyBlock.append("<hr/>");
                    $("#editor").append(propertyBlock);
                }
            }
            SparqlConnector.getJsonForSparqlURL(getResourceUrl, makePropertyBlocks);
        },

        /* Creates list of classes in current graph
         * queries stores for values
         * in left column in current UI */
        makeClassesList: function () {
            var callback = function (json) {
                SchemaEdit.makeListBlock(json, $("#classes"));
            }
            var classList = SparqlConnector.listClasses(callback);
        },


        /* Creates list of properties in current graph
         * queries stores for values
         * in left column in current UI */
        makePropertiesList: function () {
            var callback = function (json) {
                SchemaEdit.makeListBlock(json, $("#properties"));
            }
            var propertiesList = SparqlConnector.listProperties(callback);
        },

        /**
         * Comment template. TODO fill me in
         * @param {string} foo This is a param with a description too long to fit in
         *     one line.
         * @return {number} This returns something that has a description too long to
         *     fit in one line.
         */
        makeListBlock: function (json, target) {
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
                var url = split[0] + "?uri=" + encodeURI(uri) + "&graph=" + encodeURI(Config.getGraphURI());
                var aElement = $("<a/>").attr("href", url);
                aElement.text(name);
                itemElement.append(aElement);
                listElement.append(itemElement);
            }
        },

        makeNewVocabBlock: function () {
            $("#createVocabButton").click(function () {
                var name = $("#vocabName").val();
                var graph = $("#vocabNamespace").val();
                var prefix = $("#vocabPrefix").val();
                var callback = function () {
                    Config.setGraphURI(graph);
                }
                SparqlConnector.createNewVocab(name, graph, prefix, callback);
            });
        },

        addClassHandler: function () {
            var button = $("#addClassButton");
            button.click(function () {
                var namespace = parseUri(window.location.href).queryKey.graph;
                var name = $("#className").val();
                var label = $("#classLabel").val();
                var subClassOf = $("#subClassOf").val();
                subClassOf = angleBrackets(subClassOf);
                var comment = $("#classComment").val();
                var callback = function (msg) {
                    alert(msg);
                    window.location.reload();
                }
                SparqlConnector.addClass(namespace, name, label, subClassOf, comment, callback);
            });
        },

        addPropertyHandler: function () {
            var button = $("#addPropertyButton");
            button.click(function () {
                var namespace = parseUri(window.location.href).queryKey.graph;
                var name = $("#propertyName").val();
                var label = $("#propertyLabel").val();
                var domain = $("#domain").val();
                if(domain) {
                    domain = angleBrackets(domain);
                }
                var range = $("#range").val();
                if(range) {
                    range = angleBrackets(range);
                }
                var subPropertyOf = $("#subPropertyOf").val();
                if(subPropertyOf) {
                    subPropertyOf = angleBrackets(subPropertyOf);
                }
                var comment = $("#classComment").val();
                var callback = function (msg) {
                    alert(msg);
                    window.location.reload();
                }
                SparqlConnector.addProperty(namespace, name, label, domain, range, subPropertyOf, comment, callback);
                window.location.reload();
            });
        },

        /**
         * Loads list of properties from SPARQL store into combo box(es)
         */
        makePropertyChooser: function () {
            var callback = function (json) {
                // SchemaEdit.makeListBlock(json, $("#properties"));
            }
            var propertiesList = SparqlConnector.listProperties(callback); // TODO this is called again below, cache somewhere?
            var chooser = SchemaEdit.makeTypedChooser("rdf:Property");
            $("#propertyChooser").append($("<label for='addPropertyValue'>Property : </label>"));
            chooser.appendTo($("#propertyChooser"));

            var combobox = chooser.combobox();
            combobox.combobox("setInputId", "addPropertyValue");

            $("#addPropertyValueButton").click(function () {
                var subject = Config.getCurrentResource();
                if(!Config.getCurrentResource()) {
                    $("#noResourceError").dialog();
                    return;
                }
                var predicate = $("#propertyChooser").find("input").val();

                predicate = angleBrackets(predicate);

                var object = $("#propertyLiteralValue").val();
                var isLiteral = true;
                if(!object || object == "") { // so URI object
                    isLiteral = false;
                    object = $("#uriValue").val();
                    object = angleBrackets(object);
                }
                var language = "en";
                var callback = function (msg) {
                    alert(msg);
                    window.location.reload();
                };
                if(isLiteral) { // TODO refactor
                    SparqlConnector.updateLiteralTriple(subject, predicate, object, language, callback);
                } else {
                    SparqlConnector.insertProperty(subject, predicate, object, language, callback);
                }
            });
        },

        // NOT USED?
        populateClassesCombobox: function () {
            var callback = function (json) {
                // SchemaEdit.makeListBlock(json, $("#properties"));
            }
            var classedList = SparqlConnector.listProperties(callback); // TODO this is called again below, cache somewhere?
            var chooser = SchemaEdit.makeTypedChooser("rdfs:Class");
            chooser.appendTo($("#classChooser"));
            chooser.combobox();
            $("#addClassButton").click(function () {
                var subject = Config.getCurrentResource();
                var predicate = $("#classChooser").find("input").val();
                var object = "dummy object";
                var language = "en";
                var callback = function () {
                    refresh();
                };
                SparqlConnector.updateTriple(subject, predicate, object, language, callback);
            });
        },

        makeTypedChooser: function (type) { // TODO getResourcesOfTypeSparqlTemplate is used elsewhere, refactor
            var choices = $("<select></select>");
            var map = {
                "graphURI": Config.getGraphURI(),
                "type": type
            };

            var getTypesUrl = SchemaEdit.generateGetUrl(getResourcesOfTypeSparqlTemplate, map);
            var callback = function (typesArray) {
                for(var i = 0; i < typesArray.length; i++) {
                    var type = typesArray[i]["uri"];
                    var option = $("<option class='choice'></option>");
                    option.attr("value", type);
                    option.text(type);
                    choices.append(option);
                }
            };
            SparqlConnector.getJsonForSparqlURL(getTypesUrl, callback);
            return choices;
        },

        makeLanguageButton: function (subject, predicate, object, language) {
            var languageButton = $("<button class='language'></button>");
            languageButton.text(language);
            languageButton.click(function () {
                var languageChoices = $("#language-radio").html();
                var dialog = $("#dialog");
                // dialog.buttonset(); // jQueryUI
                dialog.addClass("show");
                dialog.html(languageChoices);
                var updateHandler = function () {
                    var language;
                    $('.language-radio').each(function () {
                        if(this.type == 'radio' && this.checked) {
                            language = $(this).val();
                        }
                    });
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
                    console.log("callback msg = " + msg);
                }
            });
            return languageButton;
        },

        makeUpdateButton: function (subject, predicate, object, language) {
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
                var triple = deleteButton.attr("data-triple");
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
                var triple = changePredicateButton.attr("data-triple");
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

        /* Isn't jQuery but works well enough for now */
        makeUploadGraphButton: function () {
            function readMultipleFiles(evt) {
                //Retrieve all the files from the FileList object
                var files = evt.target.files;
                if(files) {
                    for(var i = 0, f; f = files[i]; i++) {
                        var r = new FileReader();
                        r.onload = (function (f) {
                            return function (e) {
                                var turtle = e.target.result;

                                var callback = function (msg) {
                                    Config.setGraphURI(graphURI);
                                }
                                var graphURI = $("#graphName").val();
                                SparqlConnector.uploadTurtle(graphURI, turtle, callback);
                            };
                        })(f);
                        r.readAsText(f);
                    }
                } else {
                    alert("Failed to load files");
                }
            }
            document.getElementById('uploadFilename').addEventListener('change', readMultipleFiles, false);
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

        makeEndpointButton: function () {
            $("#endpointButton").click(function () {
            //    Config.setEndpointHost($("#endpointHost").val());
                Config.setQueryEndpoint($("#queryEndpoint").val());
                Config.setUpdateEndpoint($("#updateEndpoint").val());
                window.location.reload();
            });
        },

        makeTurtleButton: function () {
            $("#turtle").click(function () {
                location.href = SparqlConnector.getTurtleUrl();
            });
        },

        setupButtons: function () { // TODO refactor - move local to buttons?

            /*
                        // TODO this button doesn't appear to exist!
                        $("#upload-button").click(function () {
                            var data = new FormData($("#upload-file").val());
                            $.ajax({
                                url: Config.getSparqlUpdatePath(),
                                type: 'POST',
                                data: ({
                                    update: data
                                }),
                                processData: false,
                                contentType: false
                            });
                            //    e.preventDefault();
                        });
                        */
        },

        makeAddPropertyValue: function (uri) {
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

        /*
                makePropertyChooser: function () {
                    var map = {
                        graphURI: Config.getGraphURI(),
                    };
                    var getAllPropertiesUrl = SchemaEdit.generateGetUrl(getPropertyListSparqlTemplate, map);
                    var callback = function (propertiesArray) {
                        // {"type":"uri","uri":"http://data.admin.ch/def/hgv/longName","range":"http://www.w3.org/2000/01/rdf-schema#Literal"},
                        for(var i = 0; i < propertiesArray.length; i++) {
                            var property = propertiesArray[i]["uri"];
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
        */

        // TODO is this used?
        makeAddClass: function (uri) {
            var addClassButton = $("<button id='addClass'>Add Class</button>");
            $("#editor").prepend(addClassButton);
            addClassButton.click(function () {});
            var chooser = SchemaEdit.makeClassChooser(uri);
        },

        generateGetUrl: function (sparqlTemplate, map) {
            var sparql = sparqlTemplater(sparqlTemplate, map);
              return Config.getQueryEndpoint() + "?query=" + encodeURIComponent(sparql) + "&output=xml";
        },

        deleteResource: function (resourceURI) {
                var map = {
                    "graphURI": Config.getGraphURI(),
                    "resourceURI": resourceURI
                };
                var sparql = sparqlTemplater(deleteResourceSparqlTemplate, map);
                postData(sparql);
            }
            /*
             * naive ntriples-based CONSTRUCT logging/diff for now sparqlLog.add
             * sparqlLog.takeSnapshot sparqlLog.diff(snapshotBefore, snapshotAfter)
             */
    };

    return SchemaEdit;
}());
