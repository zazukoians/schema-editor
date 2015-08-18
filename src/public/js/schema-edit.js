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

        /* may be needed
        init: function() {
          SparqlConnector.init();
        },
        */

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
            var listElement = $("<ul class='list-block'/>");
            target.append(listElement);
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

            var map = {
                graphURI: SparqlConnector.getGraphURI(),
                uri: uri
            };

            var getResourceUrl = SchemaEdit.generateGetUrl(
                getResourceSparqlTemplate,
                map);

            var buildEditor = function (json) {
                    // console.log("json = " + JSON.stringify(json, null, 4));
                    // return;
                    for (var i = 0; i < json.length; i++) {
                        var current = json[i];
                        var node = $("<div></div>");

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

                        var deleteButton = $("<button class='delete'>x</button>");
                        var triple = "<" + SparqlConnector.getCurrentResource() + "> "; // subject
                        triple += "<" + p + "> "; // predicate/property
                        // triple += ""
                        deleteButton.attr("title", "delete this property"); // tooltip

                        property.after(deleteButton); // TWEAK was append

                        node.append($("<br/>"));

                        var value = $("<div>what default?</div>"); // needed for bnodes?

                        var o = current["o"];

                        if (current.type == "literal") {
                            // console.log("IS LITERAL");
                            //   value = $("<input type='text' value='" + current["o"] +"'></input>");
                            value = $("<textarea  rows='4' value='" + o +
                                "'></textarea>");
                            triple += "\"\"\"" + o + "\"\"\" ."; // object
                            value.text(o);
                        }
                        if (current.type == "uri") {
                            var uriText = o;
                            // console.log("o = " + o);
                            // console.log("SparqlConnector.getPrefixedUri(o) = " + SparqlConnector.getPrefixedUri(o));
                            if (SparqlConnector.getPrefixedUri(o)) {
                                uriText = SparqlConnector.getPrefixedUri(o);
                            }
                            // console.log("uriText = " + uriText);
                            value = $("<a />");

                            value.attr("href", o);
                            // console.log("IS URI");
                            var changeButton = $("<button class='inline'>Change</button>");

                            changeButton.attr("title", "change this value"); // tooltip

                            triple += " <" + o + "> ."; // object


                            node.append(changeButton);
                            value.text(uriText);
                        }
                        deleteButton.attr("data-triple", triple); // stick resource data in attribute
                        if (changeButton) {
                            changeButton.attr("data-triple", triple); // stick resource data in attribute
                        }
                        // console.log("triple setup = " + triple);
                        node.append(value);

                        //var update = $("<button>Update</button>");
                        //node.append(update);
                        // node.append wtf???
                        $("#editor").append("<br/><strong>Property</strong>").append(
                            node);
                    }
                    // console.log("in buildEditor() -  $(''.delete '').size() = " + $(".delete").size());
                    SchemaEdit.setupButtons();
                }
                //  console.log("getResourceUrl = " + getResourceUrl);
            SparqlConnector.getJsonForSparqlURL(getResourceUrl, buildEditor);

        },

        setupButtons: function () {
            console.log("Setting up buttons");
            console.log("$(''.delete '').size() = " + $(".delete").size());
            $(".delete").each(function (index) {
                console.log("each .delete " + $(this));
                console.log(index + ": " + $(this).text());
                $(this).click(function () {
                    // alert("Handler for .click() called.");
                    var triple = $(this).attr("data-triple");
                    console.log("TRIPLE on delete = " + triple);
                    var callback = function () {
                        location.reload(true);
                        console.log("callback called");
                    }
                    SparqlConnector.deleteTurtle(triple, callback);
                    // history.add("before",currentState)
                    // history.add("undo",sparql)


                    // history.add("after",currentState)
                    // history.add("item",undo button)
                });
            });

            $(".change").click(function () {
                var triple = this.attr("data-triple");
                console.log("TRIPLE on change = " + triple);

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

            // OLD
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
