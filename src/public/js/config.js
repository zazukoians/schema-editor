/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */

var Config = (function () {
    "use strict";

    // This is the public interface of the Module.
    var Config = {
        // publicFunction can be called externally
        pagesBaseURI: "http://hyperdata.it/wiki/",
        graphURI: "http://data.admin.ch/def/hgv/",

        sparqlServerHost: "http://localhost:3333",

        sparqlQueryEndpoint: "/schema-edit/sparql?query=",
        sparqlUpdateEndpoint: "/schema-edit/update"
    };
    return Config;
}());
