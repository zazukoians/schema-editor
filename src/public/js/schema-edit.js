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

            SchemaEdit.makeUploadGraphButton();
            SchemaEdit.makeTurtleButton();

            SchemaEdit.setupCreateButtons();

            // SchemaEdit.makeAdvancedButton();

            //    SchemaEdit.labelLangButtons();

            SchemaEdit.setupPlusButtons();

            SchemaEdit.setupHelpElements();

            $(".resourceButton").hide(); // for selecting skos properties etc - maybe come back to later

            SparqlConnector.init();
        },

        render: function () {
            var graph = SEUtils.parameterFromLocation("graph");

            var uri = SEUtils.parameterFromLocation("uri");
            if((!uri || uri == "") && (!graph || graph == "")) {
                return;
            }
            if(!uri) {
                uri = graph;
            }
            $("#currentResource").val(uri);
            //  console.log("currentResource uri = " + uri);
            $("#resource").val(uri);

            SchemaEdit.renderTerm(uri);
            refresh(); // redraws flex columns
        },

        /* ***  New Vocab Section START *** */

        makeNewVocabButton: function () {
            $("#newVocabButton").click(
                function () {
                    $("#newVocabBlock").show();
                    $("#newVocabButton").hide();
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
                        // Config.setCurrentResource("");
                        // console.log("makeNewVocabBlock graph = " + graph);
                        Config.setGraphURI(graph, true);
                        // console.log("makeNewVocabBlock getgraph = " + Config.getGraphURI());
                        Config.setCurrentResource(graph, graph);
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
                        //  var split = window.location.href.split("?");

                      //  var graph = SEUtils.parameterFromLocation("graph");
                        // graph = SEUtils.encodeHash(graph);
                        var graph = SEUtils.encodeHash(newGraph);

                        window.location.href = getBase(window.location.href) + "?graph=" + graph + "&uri=" + graph;

                        // the above can sometimes leave you far down the page, so scroll up
                        $("html, body").animate({
                            scrollTop: 0
                        }, "slow");
                    }
                });
                var graph = SEUtils.parameterFromLocation("graph");
                if(!graph) return;
                if(!(graph.substring(graph.length - 1)) && !graph.endsWith("#")) {
                    graph = graph + "#";
                }
                console.log("newGraph = "+graph);
                $("#graph").val(graph);
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
                        // relocate with new URL query params
                        SchemaEdit.loadNewResource(this.value);
                        Config.getGraphURI(newResource);
                        $("html, body").animate({ // the above can sometimes leave you far down the page, so scroll up
                            scrollTop: 0
                        }, "slow");
                    }
                });
                var uri = SEUtils.parameterFromLocation("uri");
                if(!uri) uri = Config.getGraphURI();
                $("#resource").val(uri);
            };
            SparqlConnector.listResources(callback);
        },

        loadNewResource: function (newResource) {
            // var split = window.location.href.split("?");
            //    var graph = parseUri(window.location.href).queryKey.graph;
            var graph = SEUtils.parameterFromLocation("graph");
            graph = SEUtils.encodeHash(graph);
            newResource = SEUtils.encodeHash(newResource);
            var newLocation = getBase(window.location.href) + "?uri=" + newResource + "&graph=" + graph;
            window.location.href = newLocation;
        },

        /*
                setResourceFromUrl: function () {
                    var uri = parseUri(window.location.href).queryKey.uri;
                    if(uri && (uri != "")) {
                        $("#resource").val(uri);
                    }
                },
        */
        makeDeleteResourceButton: function () {
            $("#deleteResource").click(
                function () {
                    var resource = Config.getCurrentResource();
                    var callback = function (msg) {
                        $("#deleteResourceText").dialog();
                    }
                    SparqlConnector.deleteResource(resource, callback);
                    //  var split = window.location.href.split("?");
                    var href = getBase(window.location.href);
                    window.location.href = href + "?graph=" + Config.getGraphURI();
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
                var graph = Config.getGraphURI();
                var name = SEUtils.nameFromURI(uri);
                var itemElement = $("<li></li>");

                uri = SEUtils.encodeHash(uri);
                graph = SEUtils.encodeHash(graph);

                var url = getBase(window.location.href) + "?uri=" + uri + "&graph=" + graph;
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
            //  console.log("renderTerm map = " + JSON.stringify(map, false, 4));
            var getResourceUrl = SchemaEdit.generateGetUrl(getResourceSparqlTemplate, map);
            SparqlConnector.getJsonForSparqlURL(getResourceUrl, SchemaEdit.makeTermEditBlock);
        },

        makeTermEditBlock: function (json) {
            //  console.log("makeTermEditBlock json = " + JSON.stringify(json, false, 4));
            var replacementMap = SchemaEdit.transformResourceJSON(json);

            //    console.log("makeTermEditBlock replacementMap = " + JSON.stringify(replacementMap, false, 4));
            /* prepare empty fields for each language in use */
            var addElementsForLanguages = function (languages, langMap) {
                var label = replacementMap["label"]; // TODO make names plural
                var comment = replacementMap["comment"];

                for(var i = 0; i < languages.length; i++) {
                    var lang = languages[i];
                    if(!SchemaEdit.mapContainsLang(label, lang)) {
                        label.push({
                            "content": "",
                            "language": lang
                        });
                    }
                    if(!SchemaEdit.mapContainsLang(comment, lang)) {
                        comment.push({
                            "content": "",
                            "language": lang
                        });
                    }
                }

                var termEditBlock = templater(SE_HtmlTemplates.termTemplate, replacementMap);
                $("#editor").append(termEditBlock);

                SchemaEdit.setupUpdateTermButtons();
                //  SchemaEdit.labelLangButtons();
                SchemaEdit.labelLangButtons();
                SchemaEdit.setupLangButtons();
                SchemaEdit.setupPlusButtons();
                SchemaEdit.setupHelpElements();
                //      SchemaEdit.setupPlusButtons();
                //        console.log("makeTermBlocks");
                //    $(".updateTermButton").log();
            }
            SchemaEdit.collectLanguages(addElementsForLanguages);
        },

        /*
        [
            {
                "content": "wer",
                "language": "gr"
            },
            */
        mapContainsLang: function (list, lang) {
            for(var i = 0; i < list.length; i++) {
                if(list[i]["language"] == lang) return true;
            }
            return false;
        },

        /* on click, post to store
         */
        setupUpdateTermButtons: function () {
            $(".updateTermButton").click(

                function () {
                    //  console.log("click");
                    var termEditBlock = $(this).parent();

                    var resourceName = termEditBlock.find(".resourceName").val();
                    resourceName = SEUtils.resolveToURI(resourceName);

                    var rdfType = termEditBlock.find(".rdfType").val();
                    rdfType = SEUtils.resolveToURI(rdfType);

                    var subClassOfList = SchemaEdit.makeURITermList(termEditBlock, "subClassOf");
                    var subPropertyOfList = SchemaEdit.makeURITermList(termEditBlock, "subPropertyOf");
                    var domainList = SchemaEdit.makeURITermList(termEditBlock, "domain");
                    var rangeList = SchemaEdit.makeURITermList(termEditBlock, "range");
                    var domainIncludesList = SchemaEdit.makeURITermList(termEditBlock, "domainIncludes");
                    var rangeIncludesList = SchemaEdit.makeURITermList(termEditBlock, "rangeIncludes");

                    var labelList = SchemaEdit.makeLiteralTermList(termEditBlock, "label");
                    var commentList = SchemaEdit.makeLiteralTermList(termEditBlock, "comment");

                    var map = {
                        "graphURI": Config.getGraphURI(),
                        "rdfType": rdfType,
                        "resourceName": resourceName,
                        "subClassOf": subClassOfList,
                        "subPropertyOf": subPropertyOfList,
                        "domain": domainList,
                        "range": rangeList,
                        "domainIncludes": domainIncludesList,
                        "rangeIncludes": rangeIncludesList,
                        "label": labelList,
                        "comment": commentList
                    };

                    var updateTermSparql = sparqlTemplater(
                        SE_SparqlTemplates.updateTerm, map);
                    // console.log("updateTermSparql = \n" + updateTermSparql);
                    SparqlConnector.postData(updateTermSparql, SchemaEdit.notifyOfUpdate);
                }
            );
        },

        notifyOfUpdate: function () {
            $("#posted").show();
            setTimeout(function () {
                $("#posted").fadeOut();
            }, 1000);
        },

        /**
         * makeURITermList
         * reads values from an input block via CSS class name
         * populates an Array with values, e.g.
         *
         * [
         *   {
         *      "range": "http://test.org/false"
         *   },
         * ...
         * ]
         *
         * @param {jQuery} termEditBlock the block in the editor to address
         * @param {string} termName name of the CSS class/term
         * @return {Array} termList list of name:value mappings
         */
        makeURITermList: function (termEditBlock, termName) {
            var termList = [];
            // console.log("termName = " + termName);
            termEditBlock.find("." + termName).each(function () {
                var term = $(this).val();
                console.log("term = " + term);
                if(term && term != "") {
                    term = SEUtils.resolveToURI(term);
                    var entry = {};
                    entry[termName] = term;
                    termList.push(entry);
                }
            });
            //console.log("termList = \n" + JSON.stringify(termList, false, 4));
            return termList;
        },

        /**
         * makeLiteralTermList
         * reads values from an input block via CSS class name
         * populates an Array with values, e.g.
         * [
         *    {
         *       "commentText": "asdasd",
         *       "commentLang": "en"
         *    },
         * ...
         *
         * @param {jQuery} termEditBlock the block in the editor to address
         * @param {string} termName name of the CSS class/term
         * @return {Array} termList list of name:value mappings
         */
        makeLiteralTermList: function (termEditBlock, termName) {
            var termList = [];
            termEditBlock.find("." + termName).each(function () {
                var li = {};
                li[termName + "Text"] = $(this).val();
                var lang = $(this).attr("lang");
                if(!lang || lang == "") {
                    lang = "en";
                }
                li[termName + "Lang"] = lang;
                termList.push(li);
            });
            //console.log("termList = \n" + JSON.stringify(termList, false, 4));
            return termList;
        },

        setupPlusButtons: function () {
            $(".plusButton").unbind("click");
            $(".plusButton").click(
                function () {
                    var prev = $(this).prev(".fieldBlock");
                    // prev.log();
                    $(prev).after(prev.clone(true));
                }
            );
        },

        setupCreateButtons: function () {
            $("#createClassButton").click(
                function () {
                    var createBlock = $("#newClass");
                    SchemaEdit.createButtonHandler(createBlock, "http://www.w3.org/2000/01/rdf-schema#Class");
                }
            );
            $("#createPropertyButton").click(
                function () {
                    var createBlock = $("#newProperty");
                    SchemaEdit.createButtonHandler(createBlock, "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property");
                }
            );
        },

        /* create new class/property, post to store */
        createButtonHandler: function (createBlock, rdfType) {
            var resourceName = createBlock.find(".resourceName").val();
            resourceName = resourceName.trim();
            if(resourceName == "") {
                SchemaEdit.noValueDialog();
                return;
            }
            resourceName = SEUtils.resolveToURI(resourceName);
            var map = {
                "graphURI": Config.getGraphURI(),
                "rdfType": rdfType,
                "resourceName": resourceName
            };
            var callback = function () {
              //  SchemaEdit.postConfirmDialog();
              SchemaEdit.notifyOfUpdate();
                Config.setCurrentResource(resourceName);
                // console.log("resourceName = " + resourceName);
                SchemaEdit.loadNewResource(resourceName);
            };
            var updateTermSparql = sparqlTemplater(
                SE_SparqlTemplates.updateTerm, map);
            //  console.log("updateTermSparql = \n" + updateTermSparql);
            SparqlConnector.postData(updateTermSparql, callback);
        },

/*
        makeAdvancedButton: function () {
            $("#advancedButton").click(
                function () {
                    $("#advancedBlock").toggle();
                }
            );
        },
        */

        /* removed from endpoints dialog
        ,
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
        */

        endpointsDialog: function () {
            // button on the main form
            $("#endpointButton").click(function () {
                Config.setQueryEndpoint($("#queryEndpoint").val());
                Config.setUpdateEndpoint($("#updateEndpoint").val());
                window.location.href = getBase(window.location.href);
            });

            var dialog = function () {
                $("#endpoints").dialog({
                    width: 800
                });
            }

            SparqlConnector.ping(dialog);
        },

        setupHelpElements: function () {
            $(".hasHelp").unbind();
            $(".hasHelp").click(
                function () {
                    var id = "#" + $(this).attr("data-help-id");
                    //  console.log("help id = "+id);
                    var $dialog = $(id).dialog({
                        autoOpen: false,
                        width: 800
                    });
                    $dialog.dialog('open');
                }
            );
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
        transformResourceJSON: function (json) {
            // console.log("transformResourceJSON json = " + JSON.stringify(json, false, 4));
            var isClass = false;
            var isProperty = false;

            var rdfType = [];
            var subClassOf = [];
            var subPropertyOf = [];
            var domain = [];
            var range = [];
            var domainIncludes = [];
            var rangeIncludes = [];
            var label = [];
            var comment = [];

            var labelLanguages = [];
            var commentLanguages = [];

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
                    if(object == "rdfs:Class" || object == "http://www.w3.org/2000/01/rdf-schema#Class") {
                        isClass = true;
                    }
                    if(object == "rdf:Property" || object == "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property") {
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
                if(predicate == "http://schema.org/domainIncludes") {
                    domainIncludes.push({
                        "domainIncludesURI": object
                    });
                }
                if(predicate == "http://schema.org/rangeIncludes") {
                    rangeIncludes.push({
                        "rangeIncludesURI": object
                    });
                }
                if(predicate == "http://www.w3.org/2000/01/rdf-schema#label") {
                    if(object && object != "") {
                        label.push({
                            "content": object,
                            "language": language
                        });
                    }
                }
                if(predicate == "http://www.w3.org/2000/01/rdf-schema#comment") {
                    if(object && object != "") {
                        comment.push({
                            "content": object,
                            "language": language
                        });
                    }
                }
            }

            if(rdfType.length == 0) {
                rdfType.push("");
            }
            if(isClass) {
                if(subClassOf.length == 0) {
                    subClassOf.push("");
                }
            }
            if(isProperty) {
                if(subPropertyOf.length == 0) {
                    subPropertyOf.push("");
                }
                if(domain.length == 0) {
                    domain.push("");
                }
                if(range.length == 0) {
                    range.push("");
                }
                if(domainIncludes.length == 0) {
                    domainIncludes.push("");
                }
                if(rangeIncludes.length == 0) {
                    rangeIncludes.push("");
                }
            }
            /*
            if(label.length == 0) {
                label.push("");
            }
            if(comment.length == 0) {
                comment.push("");
            }
            */

            //    console.log("transformResourceJSON subject = " + subject);

            var resourceName = SEUtils.curieFromURI(subject);

            //    console.log("transformResourceJSON resourceName = " + resourceName);

            return {
                "isClass": isClass,
                "isProperty": isProperty,
                "resourceName": resourceName,
                "rdfType": rdfType,
                "subPropertyOf": subPropertyOf,
                "subClassOf": subClassOf,
                "domain": domain,
                "range": range,
                "domainIncludes": domainIncludes,
                "rangeIncludes": rangeIncludes,
                "label": label,
                "comment": comment
            }
        },

/*
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
*/

        noValueDialog: function () {
            $("#noValueDialog").dialog({
                width: 200,
                modal: true,
                buttons: {
                    "Close": function () {
                        $(this).dialog("close");
                    }
                }
            });
        },

        labelLangButtons: function () {
            $(".langButton").each(
                function () {
                    var target = $(this).prev();
                    var lang = target.attr("lang");
                    if(!lang || lang == "") {
                        lang = "lang";
                    };
                    $(this).text(lang);
                }
            );
        },

        addLanguageChoices: function (languages, langMap) {
            //    console.log("addLanguageChoices langMap = " + JSON.stringify(langMap, false, 4));
            var langChoices = templater(SE_HtmlTemplates.languageChoiceTemplate, langMap);
            $("#languageChooser").append($(langChoices));
        },

        /* language choice for literals */
        setupLangButtons: function () {
            SchemaEdit.collectLanguages(SchemaEdit.addLanguageChoices);
            $(".langButton").click(
                function () {

                    var target = $(this).prev();
                    // var languageChoices = $("#languageSelect").html();
                    var dialog = $("#languageSelect");
                    // dialog.html(languageChoices);

                    var changeLangHandler = function () {
                        var language;
                        $('.languageRadio').each(function () {
                            if(this.type == 'radio' && this.checked) {
                                language = $(this).val();
                            }
                        });
                        $(this).dialog("close");
                        target.attr("lang", language);
                        SchemaEdit.labelLangButtons();
                    };

                    var removeLanguageHandler = function () {
                        var language;
                        $('.languageRadio').each(function () {
                            if(this.type == 'radio' && this.checked) {
                              language = $(this).val();
                              var parent = $($(this).parent());
                              parent.log();
                              parent.remove();
                            }
                        });
                        var languages = SEUtils.getLocalStorageObject("languages");
                        if(languages){
                          var index = languages.indexOf(language);
                          if(index != -1){
                            languages.splice(index, 1);
                          }
                          SEUtils.setLocalStorageObject("languages", languages);
                        }

                    //    $(this).dialog("close");
                    //    target.attr("lang", language);
                    //    SchemaEdit.labelLangButtons();
                    };

                    var addLanguageHandler = function () {
                        var lang = $("#addLanguage").val();
                        // console.log("addLanguageHandler lang = " + lang);
                        var languages = SEUtils.getLocalStorageObject("languages");
                        if(!languages) {
                            languages = [];
                        }
                        languages.push(lang);
                        SEUtils.setLocalStorageObject("languages", languages);
                        var langMap = {
                            "langList": [{
                                "lang": lang
                            }]
                        };
                        //    console.log("addLanguageHandler langMap = " + JSON.stringify(langMap, false, 4));
                        SchemaEdit.addLanguageChoices(languages, langMap);
                    };

                    //  resizable: false,,

                    dialog.dialog({
                        title: "Choose Language",
                        modal: true,
                        width: 400,
                        buttons: {
                          "Set Language": changeLangHandler,
                          "Add Language": addLanguageHandler,
                          "Remove Language": removeLanguageHandler,
                            Cancel: function () {
                                $(this).dialog("close");
                            },
                        }
                    });
                });
        },

        languages: [],

        collectLanguages: function (callback) {
            var getLanguagesSparql = sparqlTemplater(
                SE_SparqlTemplates.getLanguages, {
                    "graphURI": Config.getGraphURI(),
                });

            var getLanguagesUrl = Config.getQueryEndpoint() + "?query=" +
                encodeURIComponent(getLanguagesSparql) + "&output=xml";

            var restructureJSON = function (json) {
                /* targets :
                languages = ["en", "de"...]

                langMap =
                {
                   "langList": [
                                 { "lang": "en" },
                                 { "lang": "de" }
                                 ...
                               ]
                }
                */
                /* seed values */
                if(!SchemaEdit.languages) SchemaEdit.languages = ["en"];
                var langMap = {
                    "langList": [{
                        "lang": "en"
                    }]
                };
                var langList = langMap["langList"];

                // TODO the same data is stored twice: languages & langMap, combine

                /* add values from localStorage : languages */
                var storedLanguages = SEUtils.getLocalStorageObject("languages");
                if(storedLanguages) {
                    for(var i = 0; i < storedLanguages.length; i++) {
                        var lang = storedLanguages[i];

                        if(lang && lang != "") {
                            var entry = {};
                            entry["lang"] = lang;

                            if(!SchemaEdit.langListContains(langList, lang)) {
                                langList.push(entry);
                            }
                            if(SchemaEdit.languages.indexOf(lang) == -1) {
                                SchemaEdit.languages.push(lang);
                            }
                        }
                    }
                }

                /* add values from localStorage : langMap */
                var storedLangMap = SEUtils.getLocalStorageObject("langMap");

                if(storedLangMap) {
                    var storedLangList = storedLangMap["langList"];
                    for(var i = 0; i < storedLangList.length; i++) {
                        var lang = storedLangList[i]["lang"];

                        if(lang && lang != "") {
                            var entry = {};
                            entry["lang"] = lang;

                            if(!SchemaEdit.langListContains(langList, lang)) {
                                langList.push(entry);
                            }
                            if(SchemaEdit.languages.indexOf(lang) == -1) {
                                SchemaEdit.languages.push(lang);
                            }
                        }
                    }
                }

                /* add values retrieved from current schema via SPARQL */
                for(var i = 0; i < json.length; i++) {
                    var lang = json[i]["language"];

                    if(lang && lang != "") {
                        var entry = {};
                        entry["lang"] = lang;

                        if(!SchemaEdit.langListContains(langList, lang)) {
                            langList.push(entry);
                        }
                        if(SchemaEdit.languages.indexOf(lang) == -1) {
                            SchemaEdit.languages.push(lang);
                        }
                    }
                }

                // langMap["langList"] = langList;
                //  langMap["langList"].concat(langList);
                langMap["langList"].sort();
                //        console.log("SchemaEdit.languages after combined = \n" + JSON.stringify(SchemaEdit.languages, false, 4));
                //      console.log("langMap after combined = \n" + JSON.stringify(langMap, false, 4));

                SEUtils.setLocalStorageObject("languages", SchemaEdit.languages);
                SEUtils.setLocalStorageObject("langMap", langMap);
                //  console.log("languages2 = \n" + JSON.stringify(SEUtils.getLocalStorageObject("languages"), false, 4));
                // console.log("langList = \n" + JSON.stringify(langMap, false, 4));
                // console.log("languages = \n" + JSON.stringify(langList, false, 4));
                if(callback) {
                    callback(SchemaEdit.languages, langMap);
                }
                //    console.log("SchemaEdit.languages in collect = " + JSON.stringify(SchemaEdit.languages));
            }
            SparqlConnector.getJsonForSparqlURL(getLanguagesUrl, restructureJSON);
        },

        /*
        [
                      { "lang": "en" },
                      { "lang": "de" }
                    ]
                    */
        langListContains: function (langList, lang) {
            for(var i = 0; i < langList.length; i++) {
                if(langList[i]["lang"] == lang) return true;
            }
            return false;
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
                                    Config.setGraphURI(graphURI, true);
                                    SchemaEdit.notifyOfUpdate();
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

        generateGetUrl: function (sparqlTemplate, map) {
            var sparql = sparqlTemplater(sparqlTemplate, map);
            //console.log("SPARQL = \n" + sparql);
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
