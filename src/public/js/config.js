/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */

var Config = (function () {
    "use strict";

    //http://sandbox.fusepool.info:8181/sparql/select
    // http://localhost:3333
    // ttp://sandbox.fusepool.info:8181/sparql/update
    // This is the public interface of the Module.

    var Config = {
        // publicFunction can be called externally

        //  graphURI: "http://data.admin.ch/def/hgv/",

        /*
                sparqlServerHost: "http://sandbox.fusepool.info:8181",
                sparqlQueryEndpoint: "/sparql/select?query=",
                sparqlUpdateEndpoint: "/sparql/update",
                sparqlUploadEndpoint: "/sparql/upload"
        */

        /*
                sparqlServerHost: "http://localhost:3333",
                sparqlQueryEndpoint: "/schema-edit/sparql?query=",
                sparqlUpdateEndpoint: "/schema-edit/update"
        */

        sparqlServerHost: "http://zazukoians.org:3030",
        sparqlQueryEndpoint: "/ontospace/sparql?query=",
        sparqlUpdateEndpoint: "/ontospace/update"

        // for foowiki
        // pagesBaseURI: "http://hyperdata.it/wiki/",
    };
    return Config;
}());
