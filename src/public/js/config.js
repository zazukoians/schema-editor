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
        serverRootPath: "/schema-edit/",
        sparqlQueryEndpoint: "/schema-edit/sparql?query=", // move ? part ??
        sparqlUpdateEndpoint: "/schema-edit/update"

    };

    // privateFunction is completely hidden
    // from the outside.
    function privateFunction() {
        return "privateFunction cannot";
    }

    return Config;
}());
