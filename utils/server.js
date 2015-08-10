/* Fairly minimal Node.js file-serving HTTP server using Connect + middleware 
 *
 * danja 2015-06-12
 */

var connect = require('connect');
var logger = require('morgan');
var serveStatic = require('serve-static');

var port = 8888;
var serverPath = __dirname+"/../src/public";

console.log("Serving on port : "+port);
console.log("files at : "+serverPath);
connect()
    .use(logger("combined"))
    .use(serveStatic(serverPath)).listen(port);