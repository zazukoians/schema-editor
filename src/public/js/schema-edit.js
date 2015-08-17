// TODO move into module below

/* see http://www.w3.org/TR/sparql11-update/ */



var SchemaEdit = (function() {
  "use strict";

  var config = {

    pagesBaseURI: "http://hyperdata.it/wiki/",
    graphURI: "http://schema.org/terms/",

    sparqlServerHost: "http://localhost:3333",
    serverRootPath: "/schema-edit/",
    sparqlQueryEndpoint: "/schema-edit/sparql?query=", // move ? part ??
    sparqlUpdateEndpoint: "/schema-edit/update"
  };



  // This is the public interface of the SchemaEditor module.
  var SchemaEdit = {

    populateWithResource: function(uri, callback) { // buildEditor is callback
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

      var buildEditor = function(json) {
          // console.log("json = " + JSON.stringify(json, null, 4));
          // return;
          for (var i = 0; i < json.length; i++) {
            var current = json[i];
            var node = $("<div></div>");

            var property = $("<a/>");
            property.attr("href", current["p"]);
            property.text(current["p"]);
            node.append(property);

            var deleteButton = $("<button class='delete'>x</button>");
            var triple = "<" + SparqlConnector.getCurrentResource() +
              "> "; // subject
            triple += "<" + current["p"] + "> "; // predicate/property

            deleteButton.attr("data-triple", triple); // stick resource data in attribute
            property.append(deleteButton);

            node.append($("<br/>"));

            var value = $("<div>what default?</div>"); // needed for bnodes?

            if (current.type == "literal") {
              console.log("IS LITERAL");
              value = $("<input type='text' value='" + current["o"] +
                "'></input>");
              triple += "\"\"\"" + current["o"] + "\"\"\" ."; // object

            }
            if (current.type == "uri") {
              value = $("<a />");
              value.attr("href", current["o"]);
              console.log("IS URI");
              node.append($("<button class='inline'>Change</button>"));
            }
            console.log("triple = " + triple);
            node.append(value);

            value.text(current["o"]);

            //var update = $("<button>Update</button>");
            //node.append(update);
            node.append
            $("#editor").append("<br/><strong>Property</strong>").append(
              node);
          }
        }
        //  console.log("getResourceUrl = " + getResourceUrl);
      SparqlConnector.getJsonForSparqlURL(getResourceUrl, buildEditor);
      // getDataForURL(handleEntry, getPageUrl);


    },



    setupButtons: function() {
      // DELETE buttons on schema-edit main page
      $(".delete").click(function() {});

      // EXPORT TURTLE buttons on schema-edit main page
      $("#turtle").click(function() {
        var query = "CONSTRUCT {?s ?p ?o } WHERE {?s ?p ?o}";
        var turtleURL = config.sparqlServerHost + config.sparqlQueryEndpoint +
          encodeURIComponent(query) + "&output=text";
        location.href = turtleURL;
      });

      $("#newPageButton").click(function() {
        var newPageName = $("#newPageName").val();
        window.location.href = window.location.href = config.serverRootPath +
          "edit.html?uri=" + config.graphURI + "/" + newPageName;
      });

      // OLD
      $("#upload-button").click(function() {
        var data = new FormData($("#upload-file").val());
        // console.log("DATA = " + data);
        $.ajax({
          url: config.sparqlUpdateEndpoint,
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

    generateGetUrl: function(sparqlTemplate, map) {
      var sparql = sparqlTemplater(sparqlTemplate, map);
      return config.sparqlServerHost + config.sparqlQueryEndpoint +
        encodeURIComponent(sparql);
    },

    deleteResource: function(resourceURI) {
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
