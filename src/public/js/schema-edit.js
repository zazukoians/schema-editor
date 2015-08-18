// TODO normalize naming SchemaEdit -> SchemaEditor

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 *
 * see also http://www.w3.org/TR/sparql11-update/
 */
var SchemaEdit = (function() {
  "use strict";

  // This is the public interface of the SchemaEditor module.
  var SchemaEdit = {

    /* may be needed
    init: function() {
      SparqlConnector.init();
    },
    */

    //   populateWithResource: function(uri, callback) {
    makeClassesList: function() {
      var callback = function(json) {
        SchemaEdit.makeListBlock(json, $("#classes"));
      }
      var classList = SparqlConnector.listClasses(callback);
    },

    makePropertiesList: function() {
      var callback = function(json) {
        SchemaEdit.makeListBlock(json, $("#properties"));
      }
      var propertiesList = SparqlConnector.listProperties(callback);
    },

    makeListBlock: function(json, target) {
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
            var p = current["p"];
            property.attr("href", p);
            var pText = p;

            console.log("p = " + p);
            console.log("SparqlConnector.getPrefixForUri(p) = " +
              SparqlConnector.getPrefixForUri(p));

            var pNamespaceIndex = p.indexOf("#");
            if (pNamespaceIndex == -1) {
              pNamespaceIndex = p.lastIndexOf("/");
            }
            console.log("pNamespaceIndex = " + pNamespaceIndex);

            var pNamespace = p.substring(0, pNamespaceIndex + 1); // TODO check length
            console.log("pNamespace = " + pNamespace);

            if (SparqlConnector.getPrefixForUri(pNamespace)) {
              console.log("getting prefix for uri = " + pNamespace);
              var name = p.substring(pNamespaceIndex + 1);
              pText = SparqlConnector.getPrefixForUri(pNamespace) + ":" +
                name;
              console.log("got prefix = " + pText);
            }
            property.text(pText);
            node.append(property);

            var deleteButton = $("<button class='delete'>x</button>");
            var triple = "<" + SparqlConnector.getCurrentResource() +
              "> "; // subject
            triple += "<" + p + "> "; // predicate/property

            deleteButton.attr("data-triple", triple); // stick resource data in attribute
            property.after(deleteButton); // TWEAK was append

            node.append($("<br/>"));

            var value = $("<div>what default?</div>"); // needed for bnodes?

            if (current.type == "literal") {
              // console.log("IS LITERAL");
              //   value = $("<input type='text' value='" + current["o"] +"'></input>");
              value = $("<textarea  rows='4' value='" + current["o"] +
                "'></textarea>");
              triple += "\"\"\"" + current["o"] + "\"\"\" ."; // object

            }
            if (current.type == "uri") {
              value = $("<a />");
              value.attr("href", current["o"]);
              // console.log("IS URI");
              node.append($("<button class='inline'>Change</button>"));
            }
            console.log("triple setup = " + triple);
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
    },

    setupButtons: function() {
      $(".delete").click(function() {
        var triple = this.attr("data-triple");
        console.log("TRIPLE on delete = " + triple);

      });

      $("#turtle").click(function() {
        var query = "CONSTRUCT {?s ?p ?o } WHERE {?s ?p ?o}";
        var turtleURL = Config.sparqlServerHost + Config.sparqlQueryEndpoint +
          encodeURIComponent(query) + "&output=text";
        location.href = turtleURL;
      });

      $("#newPageButton").click(function() {
        var newPageName = $("#newPageName").val();
        window.location.href = window.location.href = Config.serverRootPath +
          "edit.html?uri=" + Config.graphURI + "/" + newPageName;
      });

      // OLD
      $("#upload-button").click(function() {
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

    generateGetUrl: function(sparqlTemplate, map) {
      var sparql = sparqlTemplater(sparqlTemplate, map);
      return Config.sparqlServerHost + Config.sparqlQueryEndpoint +
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
