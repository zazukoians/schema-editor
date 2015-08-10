var
  fs = require('fs'),
  marked = require('marked');


// build HTML version
var html = '<html>' +
    '<head>' +
    '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">' +
    '</head>' +
    '<body>' +
    '<div class="container">' +
    marked(fs.readFileSync('doc/primer.md').toString()) +
    '</div>' +
    '</body>' +
    '</html>';

fs.writeFileSync('doc/primer.html', html);