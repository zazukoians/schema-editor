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

            if(!SEUtils.prefixes || !(SEUtils.prefixes["loaded"] == true)) {
                SEUtils.initPrefixes();
            }

            SchemaEdit.makeNewVocabButton();
            SchemaEdit.makeNewVocabBlock();

            SchemaEdit.makeGraphChooser();
            SchemaEdit.makeResourceChooser($("#resourceChooser"), "resource");
            SchemaEdit.makeResourceChooser($("#propertyUriValue"), "uriValue");

            SchemaEdit.makeClassesList();
            SchemaEdit.makePropertiesList();

            SchemaEdit.endpointsDialog();
            //  $("#endpointHost").val(Config.getEndpointHost());
            //  $("#endpointLink").attr("href", Config.getEndpointHost());
            $("#queryEndpoint").val(Config.getQueryEndpoint());
            $("#updateEndpoint").val(Config.getUpdateEndpoint());

            SchemaEdit.makeDeleteResourceButton();

            SchemaEdit.makePropertyChooser();
            SchemaEdit.addClassHandler();
            SchemaEdit.addPropertyHandler();

            SchemaEdit.makeUploadGraphButton();
            SchemaEdit.makeTurtleButton();

            SchemaEdit.initResourceButtons();
            SchemaEdit.setupResourceButtons();

            SchemaEdit.makeAdvancedButton();

            SchemaEdit.initLangButtons();
            SchemaEdit.setupLangButtons(); // TODO does this need to be called so often?

            SchemaEdit.setupPlusButtons();

            SchemaEdit.helpMap = {};
            SchemaEdit.setupHelpButtons();

            $(".resourceButton").hide(); // for selecting skos properties etc - maybe come back to later

            SparqlConnector.init();
        },

        render: function () {
            var graph = queryString["graph"];

            // TODO use parseUri
            var uri = queryString["uri"];
            if((!uri || uri == "") && (!graph || graph == "")) {
                // alert("undefined");
                //  SchemaEdit.makeNewVocabBlock();
                return;
            }
            uri = encodeURI(uri);

            $("#currentResource").text(uri);
            $("#resource").text(uri);

            var uri = queryString["uri"];
            if(uri) { // TODO need to check if this if() is working
                uri = encodeURI(uri);
                SchemaEdit.renderTerm(uri);
            }
            refresh(); // redraws flex columns
        },

        /* ***  New Vocab Section START *** */

        makeNewVocabButton: function () {
            $("#newVocabButton").click(
                function () {
                    $("#newVocabBlock").show();
                    $("#currentResourceBlock").hide();
                    $("#currentGraphBlock").hide();
                }
            );
        },

        makeNewVocabBlock: function () {
            $("#createVocabButton").click(function () {
                var name = $("#vocabName").val();
                var graph = $("#vocabNamespace").val();
                var prefix = $("#vocabPrefix").val();
                SEUtils.prefixes[prefix] = graph;
                var callback = function () {
                        Config.setGraphURI(graph, true);
                    }
                    // mystring[mystring.length-1] === '#'
                SparqlConnector.createNewVocab(name, graph, prefix, callback);
            });
        },
        /* ***  New Vocab Section END *** */


        /* *** Current Graph & Resource Choosers START *** */

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

        /* ***  Current Graph & Resource Choosers END *** */

        /* ***  Classes & Properties (link) Lists START *** */

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
            var listContainer = $("<div></div>");
            var listElement = $("<ul/>");

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

        /* ***  Classes & Properties (link) Lists END *** */

        /* fill in main block with details of current resource */
        renderTerm: function (uri) {
            var map = {
                graphURI: Config.getGraphURI(),
                uri: uri
            };

            var getResourceUrl = SchemaEdit.generateGetUrl(getResourceSparqlTemplate, map);

            var makeTermBlocks = function (json) {
                SchemaEdit.makeTermEditBlock(json);
                SchemaEdit.setupUpdateTermButtons();
                SchemaEdit.initLangButtons();
                SchemaEdit.setupLangButtons(); // TODO does this need to be called so often?
                SchemaEdit.setupPlusButtons();
            }
            SparqlConnector.getJsonForSparqlURL(getResourceUrl, makeTermBlocks);
        },

        makeTermEditBlock: function (json) {
            var replacementMap = SchemaEdit.transformResourceJSON(json);
            var block = templater(SE_HtmlTemplates.termTemplate, replacementMap);
            $("#editor").append(block);
        },

        setupUpdateTermButtons: function () {
            $(".updateTermButton").click(
                function () {
                    // $(this).log()
                    var termEditBlock = $(this).parent();

                    var resourceName = termEditBlock.find(".resourceName").val();
                    resourceName = SEUtils.resolveToURI(resourceName);

                    var rdfType = termEditBlock.find(".rdfType").val();
                    rdfType = SEUtils.resolveToURI(rdfType);

                    var subPropertyOf = termEditBlock.find(".subPropertyOf").val();
                    if(subPropertyOf) {
                        subPropertyOf = SEUtils.resolveToURI(subPropertyOf);
                    }

                    var subClassOf = termEditBlock.find(".subClassOf").val();
                    if(subClassOf) {
                        subClassOf = SEUtils.resolveToURI(subClassOf);
                    }

                    var domain = termEditBlock.find(".domain").val();
                    if(domain) {
                        domain = SEUtils.resolveToURI(domain);
                    }

                    var range = termEditBlock.find(".range").val();
                    if(range) {
                        range = SEUtils.resolveToURI(range);
                    }

                    var labelList = [];
                    termEditBlock.find(".label").each(function () {
                        var li = {};
                            li["labelText"] = $(this).val();
                            var lang = $(this).attr("lang");
                            if(!lang || lang == ""){
                              lang = "en";
                            }
                            li["labelLang"] = lang;
                        labelList.push(li);
                    });
                  //  console.log("labelList = \n"+JSON.stringify(labelList,false,4));

                    var commentList = [];
                    termEditBlock.find(".comment").each(function () {
                        var li = {};
                            li["commentText"] = $(this).val();
                            var lang = $(this).attr("lang");
                            if(!lang || lang == ""){
                              lang = "en";
                            }
                            li["commentLang"] = lang;
                        commentList.push(li);
                    });
                  //  console.log("commentList = \n"+JSON.stringify(commentList,false,4));

                    var callback = function (msg) {}

                    var map = {
                        "graphURI": Config.getGraphURI(),
                        "rdfType": rdfType,
                        "resourceName": resourceName,
                        "subPropertyOf": subPropertyOf,
                        "subClassOf": subClassOf,
                        "domain": domain,
                        "range": range,
                        "label": labelList,
                        "comment": commentList,
                    };
                    var notifyOfUpdate = function () {
                        console.log("update done.");
                        //   window.location.reload();

                        SchemaEdit.postConfirmDialog();
                    };
                    var updateTermSparql = sparqlTemplater(
                        SE_SparqlTemplates.updateTerm, map);
                    console.log("updateTermSparql = \n" + updateTermSparql);
                    SparqlConnector.postData(updateTermSparql, notifyOfUpdate);
                }
            );
        },

        setupPlusButtons: function () {
            $(".plusButton").unbind("click");
            $(".plusButton").click(
                function () {
                    var prev = $(this).prev(".fieldBlock");
                    prev.log();
                    $(prev).after(prev.clone(true));
                    SchemaEdit.setupLangButtons(); // TODO does this need to be called so often?
                }
            );
        },

        makeAdvancedButton: function () {
            $("#advancedButton").click(
                function () {
                    $("#advancedBlock").toggle();
                }
            );
        },

        endpointsDialog: function () {

            // this is the button on the main form, not dialog
            $("#endpointButton").click(function () {
                Config.setQueryEndpoint($("#queryEndpoint").val());
                Config.setUpdateEndpoint($("#updateEndpoint").val());
                window.location.reload();
            });

            var dialog = function () {
                $("#endpoints").dialog({
                    width: 800,
                    buttons: {
                        "Clear": function () {
                            $("#endpoints input").val("");
                        },
                        "Update": function () {
                            Config.setQueryEndpoint($("#queryEndpoint").val());
                            Config.setUpdateEndpoint($("#updateEndpoint").val());
                            $(this).dialog("close");
                            window.location.reload();
                        }
                    }
                });
            }

            SparqlConnector.ping(dialog);
        },

        setupHelpButtons: function () {
            $(".helpButton").each(
                function () {
                    var id = $(this).attr("id");
                    var $dialog = $(this).next().dialog({
                        autoOpen: false,
                        width: 800
                    });
                    SchemaEdit.helpMap[id] = $dialog;
                }
            );

            $(".helpButton").click(
                function () {
                    var id = $(this).attr("id");
                    SchemaEdit.helpMap[id].dialog('open');
                }
            );
        },

        setGraphFromUrl: function () {
            var graph = parseUri(window.location.href).queryKey.graph;
            if(graph && (graph != "")) {
                if(graph[graph.length - 1] != '/') {
                    graph = graph + "#";
                }
                $("#graph").val(graph);
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
            var choices = $("<select/>");
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



        /* takes SPARQL results JSON and changes it into
         * a form that's easier to insert into template
         */
        transformResourceJSON: function (json) { // ugly, but will do for now

            var isClass = false;
            var isProperty = false;

            var rdfType = [];
            var subClassOf = [];
            var subPropertyOf = [];
            var domain = [];
            var range = [];
            var label = [];
            var comment = [];

            for(var i = 0; i < json.length; i++) {
                var current = json[i];
                // console.log("current = "+JSON.stringify(current, false, 4));
                var type = current["type"];
                var subject = current["s"];
                var predicate = current["p"];
                var object = current["o"];

                if(type == "uri") {
                    object = SEUtils.curieFromURI(object);
                }
                var language = current["language"];

                if(predicate == "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") {
                    rdfType.push(object);
                    if(object == "rdfs:Class") {
                        isClass = true;
                    }
                    if(object == "rdf:Property") {
                        isProperty = true;
                    }
                }
                if(predicate == "http://www.w3.org/2000/01/rdf-schema#subClassOf") {
                    subClassOf.push({
                        "subClassOfURI": object
                    });
                }
                if(predicate == "http://www.w3.org/2000/01/rdf-schema#subPropertyOf") {
                    subPropertyOf.push({
                        "subPropertyOfURI": object
                    });
                }
                if(predicate == "http://www.w3.org/2000/01/rdf-schema#domain") {
                    domain.push({
                        "domainURI": object
                    });
                }
                if(predicate == "http://www.w3.org/2000/01/rdf-schema#range") {
                    range.push({
                        "rangeURI": object
                    });
                }
                if(predicate == "http://www.w3.org/2000/01/rdf-schema#label") {
                    label.push({
                        "content": object,
                        "language": language
                    });
                }
                if(predicate == "http://www.w3.org/2000/01/rdf-schema#comment") {
                    comment.push({
                        "content": object,
                        "language": language
                    });
                }
            }
            if(rdfType.length == 0) {
                rdfType.push("");
            }
            if(subPropertyOf.length == 0) {
                subPropertyOf.push("");
            }
            if(domain.length == 0) {
                domain.push("");
            }
            if(range.length == 0) {
                range.push("");
            }
            if(label.length == 0) {
                label.push("");
            }
            if(comment.length == 0) {
                comment.push("");
            }

            var resourceName = SEUtils.curieFromURI(subject);

            return {
                "isClass": isClass,
                "isProperty": isProperty,
                "resourceName": resourceName,
                "rdfType": rdfType,
                "subPropertyOf": subPropertyOf,
                "subClassOf": subClassOf,
                "domain": domain,
                "range": range,
                "label": label,
                "comment": comment
            }
        },

        postConfirmDialog: function () {
            $("#postConfirmDialog").dialog({
                width: 200,
                modal: true,
                buttons: {
                    "Close": function () {
                        $(this).dialog("close");
                        window.location.reload();
                    }
                }
            });

        },

        // TODO merge with updateTerm
        addClassHandler: function () {
            var button = $("#addClassButton");
            button.click(function () {

                var callback = function (msg) {
                    SchemaEdit.postConfirmDialog();
                }

                var subClassOf = $("#subClassOf").val();
                subClassOf = SEUtils.resolveToURI(subClassOf);

                var map = {
                    "graphURI": Config.getGraphURI(),
                    "name": $("#className").val(),
                    "subClassOf": subClassOf
                }

                /* Currently looping through different values here,
                 * making a server call for each.
                 * TODO move to looping within template
                 */
                $("#addClass .classLabel").each(
                    function () {
                        map["label"] = $(this).val();
                        map["labelLang"] = $(this).attr("lang");
                        SparqlConnector.addClass(map, callback);
                    }
                );
                $("#addClass .classComment").each(
                    function () {
                        map["comment"] = $(this).val();
                        map["commentLang"] = $(this).attr("lang");
                        SparqlConnector.addClass(map, callback);
                    }
                );

            });
        },

        // TODO merge with updateTerm
        addPropertyHandler: function () {
            var button = $("#addPropertyButton");
            button.click(function () {
                var name = $("#propertyName").val();

                var domain = $("#domain").val();
                if(domain) {
                    domain = SEUtils.resolveToURI(domain);
                }

                var range = $("#range").val();
                if(range) {
                    range = SEUtils.resolveToURI(range);
                }
                var subPropertyOf = $("#subPropertyOf").val();
                if(subPropertyOf) {
                    subPropertyOf = SEUtils.resolveToURI(subPropertyOf);
                }

                var callback = function () {
                    SchemaEdit.postConfirmDialog();
                }

                var map = {
                    "graphURI": Config.getGraphURI(),
                    "name": name,
                    "domain": domain,
                    "range": range,
                    "subPropertyOf": subPropertyOf,
                    "label": "",
                    "labelLang": "",
                    "comment": "",
                    "commentLang": ""
                };

                // TODO I don't like the look of these... merge with edit term & get rid of loops
                $("#addPropertyBlock .propertyLabel").each(
                    function () {
                        //  console.log("label = " + $(this).val());
                        map["label"] = $(this).val();
                        map["labelLang"] = $(this).attr("lang");
                        SparqlConnector.addProperty(map, callback);
                    }
                );
                $("#addPropertyBlock .propertyComment").each(
                    function () {
                        map["comment"] = $(this).val();
                        map["commentLang"] = $(this).attr("lang");
                        SparqlConnector.addProperty(map, callback);
                    }
                );
                window.location.reload();
            });
        },

        /**
         * Loads list of properties from SPARQL store into combo box(es)
         */
        makePropertyChooser: function () {
            var callback = function (json) {}

            var propertiesList = SparqlConnector.listProperties(callback); // TODO this is called again below, cache somewhere?
            var chooser = SchemaEdit.makeTypedChooser("rdf:Property");
            $("#propertyChooser").append($("<label for='addPropertyValue'>Property</label>"));
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
        /*
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
        */

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

        initLangButtons: function () {
            $(".langButton").each(
                function () {
                    $(SchemaEdit.setLangButtonValue($(this)));
                }
            );
        },

        setLangButtonValue: function ($button) {
            var target = $($button).prev();
            var lang = target.attr("lang");

            if(!lang || lang == "") {
                lang = "lang";
            }

            // console.log("setLangButtonValue lang = " + lang);
            $button.text(lang);
        },

        /* language choice for literals */
        /*   alternate representations for resources */
        setupLangButtons: function () {
            $(".langButton").click(
                function () {
                    var target = $(this).prev();
                    var languageChoices = $("#languageSelect").html();
                    var dialog = $("#dialog");
                    // dialog.addClass("show");
                    dialog.html(languageChoices);

                    var changeLangHandler = function () {
                        var language;
                        $('.languageRadio').each(function () {
                            if(this.type == 'radio' && this.checked) {
                                language = $(this).val();
                            }
                        });
                        $(this).dialog("close");
                        target.attr("lang", language);
                        SchemaEdit.initLangButtons();
                    }

                    dialog.dialog({
                        title: "Choose Language",
                        resizable: false,
                        modal: true,
                        buttons: {
                            "Update": changeLangHandler,
                            Cancel: function () {
                                $(this).dialog("close");
                            }
                        }
                    });
                });
            SchemaEdit.setupAddLanguageButton();
        },

        setupAddLanguageButton: function () {
            $("#addLanguageButton").click(
                function () {
                    console.log("click");
                    $(this).prev().log();
                });
        },

        /*
        <label for="addLanguage">Add Language</label>
        <input id="addLanguage" type="text" name="addLanguage" title="enter language code"/>
        <button id="addLanguageButton">Add</button>
        */
        initResourceButtons: function () {
            $(".resourceButton").each(
                function () {
                    $(SchemaEdit.setResourceButtonValue($(this)));
                }
            );
        },

        setResourceButtonValue: function ($button) {
            var target = $($button).prev();
            $button.text("R");
        },

        /*   alternate predicates rdfs:label/skos:prefLabel etc. */
        setupResourceButtons: function () {
            $(".resourceButton").click(
                function () {
                    var target = $(this).prev();
                    var propertiesChoices = $("#propertiesSelect").html();
                    var dialog = $("#dialog");
                    // dialog.addClass("show");
                    dialog.html(propertiesChoices);

                    var changePropertiesHandler = function () {
                        //  var language;
                        $('.propertiesCheckbox').each(function () {
                            if(this.checked) {
                                //      language = $(this).val();
                            }
                        });
                        $(this).dialog("close");
                        //  target.attr("lang", language);
                        //    SchemaEdit.initLangButtons();
                    }

                    dialog.dialog({
                        title: "Choose Language",
                        resizable: false,
                        modal: true,
                        buttons: {
                            "Update": changePropertiesHandler,
                            Cancel: function () {
                                $(this).dialog("close");
                            }
                        }
                    });
                });
        },

        makeUpdateButton: function (subject, predicate, object, language) {
            var updateButton = $("<button>Update</button>");
            updateButton.attr("title", "Update this literal value"); // tooltip
            var tripleAttribute = SchemaEdit.makeTripleAttribute(subject, predicate, object, true);
            updateButton.attr("data-triple", tripleAttribute); // stick resource data in attribute
            updateButton.click(function () {

                var inputField = updateButton.parent().find(".literalObject");
                var newContent = inputField.val();
                language = inputField.attr("lang"); // TODO needs tidying up before here
                if(!language || language == "") {
                    language = "en";
                }
                var callback = function () {
                    location.reload(true);
                }
                SparqlConnector.updateLiteralTriple(subject, predicate, newContent, language, callback);
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

        /*
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
        */

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
