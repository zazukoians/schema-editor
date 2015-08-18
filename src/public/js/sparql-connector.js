/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 *
 * see also http://www.w3.org/TR/sparql11-update/
 */
var SparqlConnector = (function() {
      "use strict";

      var currentResource = "http://example.org/dummy";
      var knownPrefixes = {};

      // This is the public interface of the Module.
      var SparqlConnector = {
        setCurrentResource: function(uri) {
          currentResource = uri;
        },

        getCurrentResource: function() {
          return currentResource;
        },

        getGraphURI: function() {
          return Config.graphURI;
        },

        setGraphURI: function(uri) {
          Config.graphURI = uri;
          return Config.graphURI;
        },
        // API, based on spec
        // initial implementations based on foowiki Ajax - with templating

        setQueryEndpoint: function(url) {
          Config.sparqlQueryEndpoint = url;
          return getQueryEndpoint();
        },

        getQueryEndpoint: function() {
          return Config.sparqlQueryEndpoint
        },

        setUpdateEndpoint: function(url) {
          return getUpdateEndpoint();
        },

        getUpdateEndpoint: function() {
          return Config.sparqlUpdateEndpoint
        },

        setEndpoint: function(graphURI) {
          return graphURI;
        },

        listResourcesOfType: function(type, callback) {
          var resources = [];
          var getResourceListSparql = sparqlTemplater(
            getResourcesOfTypeSparqlTemplate, {
              "graphURI": SparqlConnector.getGraphURI(),
              "type": type
            });
          var getResourcesUrl = Config.sparqlServerHost + Config.sparqlQueryEndpoint +
            encodeURIComponent(getResourceListSparql) + "&output=xml";

          // getClassListSparqlTemplate
          //  console.log("getClassesUrl = " + getResourcesUrl);
          var json = SparqlConnector.getJsonForSparqlURL(getResourcesUrl,
            callback); // is in sparql-connector.js
          //    console.log("json =" + json);
          return resources;
        },

        listClasses: function(callback) {
          return SparqlConnector.listResourcesOfType("rdfs:Class", callback);
        },

        listProperties: function(callback) {
          return SparqlConnector.listResourcesOfType("rdf:Property",
            callback);
        },

        listPropertiesForClass: function(graphURI, classURI) {
          var properties = [];
          return properties;
        },

        listClassesForProperty: function(graphURI, propertyURI) {
          var classes = [];
          return classes;
        },

        preloadKnownPrefixes: function() {
          knownPrefixes =
            PREFIX schema: < http: //schema.org/> \n\
            PREFIX rdfs: < http: //www.w3.org/2000/01/rdf-schema#> \n\
            PREFIX dc: < http: //purl.org/dc/terms/> \n\
            PREFIX owl: < http: //www.w3.org/2002/07/owl#> \n\
            PREFIX rdf: < http: //www.w3.org/1999/02/22-rdf-syntax-ns#> \n\
            PREFIX foaf: < http: //xmlns.com/foaf/0.1/> \n\
            PREFIX dcat: < http: //www.w3.org/ns/dcat#> \n\
            PREFIX void: < http: //rdfs.org/ns/void#> \n\
            PREFIX bibo: < http: //purl.org/ontology/bibo/> \n\
            \n\
          PREFIX dctype: < http: //purl.org/dc/dcmitype/> \n\
            PREFIX sioc: < http: //rdfs.org/sioc/ns#>  \n\
            PREFIX wiki: < http: //purl.org/stuff/wiki#>  \n\

            /* connector low-level utilities */
            postData: function(data) {
              $.ajax({
                type: "POST",
                url: Config.sparqlUpdateEndpoint,
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
                      map["type"] = $(this).children().prop("tagName")
                        .toLowerCase();
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
