/* 
npm install findit
npm install mustache
*/

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */

var fs = require('fs');
var path = require('path');
var mustache = require('mustache');

var finder = require('findit')(process.argv[2] || '.');

/*
finder.on('directory', function (dir, stat, stop) {
    var base = path.basename(dir);
    if (base === '.git' || base === 'node_modules') stop()
    else console.log(dir + '/')
});
*/

/*
{ ...
  mtime: Sun Jan 11 2015 13:01:57 GMT+0100 (CET),
*/

var fileHandler = function (file, stat) {
    console.log(file);
    var mtime = new Date(stat["mtime"]);
    var modified = mtime.toISOString();
    console.log(modified);

    fs.readFile(file, 'utf8', function (err, content) {
        if (err) {
            return console.log(err);
        }
        console.log(content);

        var lines = content.split(/\r\n|\r|\n/g);
        var title = "Title";
        for (var line in lines) { // title is first non-blank line
            var title = lines[line].trim();
            if (title != "") break;
        }
        console.log("TITLE=" + title);
    });
};

finder.on('file', fileHandler);