/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */


var SparqlConnector = (function() {
  "use strict";

  // This is the public interface of the Module.
  var SparqlConnector = {
    // publicFunction can be called externally
    publicFunction: function() {
      return "publicFunction can be invoked " + "externally but " +
        privateFunction();
    },

    postData: function(data) {
      $.ajax({
        type: "POST",
        url: SchemaEdit.config.sparqlUpdateEndpoint,
        data: ({
          update: data
        })
      }).done(function() {}).fail(function() {
        alert("error"); // use error banner
      });
    },

    getJsonForSparqlURL: function(pageURL, callback) {
      $.ajax({
        url: pageURL,
        accept: {
          xml: 'application/xml;charset=UTF-8',
          sparql: 'sparql-results+xml;charset=UTF-8'
        },
        headers: { // belt and braces
          'Accept': 'sparql-results+xml;charset=UTF-8'
            //   'Accept-Charset': 'UTF-8' unsafe
        }
      }).done(function(xml) {
        var json = SparqlConnector.sparqlXMLtoJSON(xml);
        // console.log("JSON = "+JSON.stringify(json));
        callback(json);
        // $(window).trigger('resize');
      }).fail(function() {
        alert("error");
      });
    },

    sparqlXMLtoJSON: function(xml) {

      var xmlString = (new XMLSerializer()).serializeToString(xml);

      // workaround for wrong interpretation of charset
      xmlString = xmlString.replace(/[^\u0000-\u007F]/g, '');
      // maybe force to ISO-8859-1, also known as Latin-1 instead?

      var $xml = $(xmlString);
      // console.log(xmlString);
      var variables = $xml.find("variable");

      if (variables.length == 0) {
        return false;
      }
      var jsonVariables = [];

      variables.each(function() {
        jsonVariables.push($(this).attr("name"));
      });

      var results = $xml.find("result");

      if (results.length == 0) {
        return false;
      }
      var jsonResults = [];

      results.each(function() {
        var map = {};
        for (var i = 0; i < jsonVariables.length; i++) {
          var name = jsonVariables[i];
          // console.log("NAME=" + name);
          $(this).find("binding[name='" + name + "']").each(
            function() {
              //  entry[name] = $(this).text().trim();
              // console.log("entry[name]=" + entry[name]);$( "div span:first-child" )
              map["type"] = $(this).children().prop("tagName").toLowerCase();
              map[name] = $(this).text().trim();
            });
        }
        jsonResults.push(map);
      });

      //  console.log("RESULTS = "+JSON.stringify(jsonResults));
      return jsonResults;
    }
  }
  return SparqlConnector;
}());
