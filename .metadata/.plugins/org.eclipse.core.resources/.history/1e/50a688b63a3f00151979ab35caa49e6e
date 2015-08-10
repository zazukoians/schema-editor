// Node.js periodic backup of store Turtle


var http = require('http');
var fs = require('fs');
var moment = require('../js/lib/moment');

// http://localhost:3030/foowiki/page.html?uri=http://hyperdata.it/wiki/Test%20Two

// http://localhost:3030/foowiki/sparql?query=CONSTRUCT+%7B+%3Fs+%3Fp+%3Fo+%7D++WHERE+%7B%0D%0A+++GRAPH+%3Chttp%3A%2F%2Fhyperdata.it%2Fwiki%3E+%7B%0D%0A++++++%3Fs+%3Fp+%3Fo%0D%0A+++%7D%0D%0A%7D&output=text

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function startBackup() {
    setInterval(function () {
        var options = {
            host: 'localhost',
            port: 3030,
            path: '/foowiki/sparql?query=CONSTRUCT+%7B+%3Fs+%3Fp+%3Fo+%7D++WHERE+%7B%0D%0A+++GRAPH+%3Chttp%3A%2F%2Fhyperdata.it%2Fwiki%3E+%7B%0D%0A++++++%3Fs+%3Fp+%3Fo%0D%0A+++%7D%0D%0A%7D&output=text'
        };

        console.log("Getting...\n");
        http.get(options, function (res) {
            var all = "";
            res.on('data', function (chunk) {
                try {
                    all = all + chunk;
                    // optional logging... disable after it's working
                    // console.log("chunk: " + chunk);
                } catch (err) {
                    console.log(err.message);
                }
            });
            res.on('end', function () {
                console.log("Got.");
                try {
                    //      console.log("RESPONSE: " + all);
                    saveToFile(all);
                    postToStore(all);
                } catch (err) {
                    console.log(err.message);
                }
            });
        }).on('error', function (err) {
            console.log("Error: " + err.message);
        });
    }, 30 * 60 * 1000); // load every x minutes
}

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function saveToFile(data) {

    var filename = makeFilename();
    console.log("Saving to file : " + filename);
    fs.writeFile(filename, data, function (err) {
        if (err) {
            console.log("Error : "+err);
        } else {
            console.log("The file was saved!");
        }
    });
}

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function makeFilename() {

    var filename = "../backups/" + moment().toISOString();
    return filename + ".ttl";
}

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function postToStore(data) {
    console.log("postToStore called");
    var options = {
        host: 'localhost',
        port: 3030,
        path: '/seki/sparql',
        method: 'POST',
        headers: {}
    };
    // var results = '';
    var req = http.request(options, function (res) {
        res.on('end', function () {
          console.log("POSTed.");
        });
    });

    req.on('error', function (e) {
        console.log("Error : "+e);
    });

    req.end();
}

startBackup();