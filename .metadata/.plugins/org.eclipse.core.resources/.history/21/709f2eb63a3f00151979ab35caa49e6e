var Entry = {
    /*
    function () {
        return this;
    },

    function (FooWiki.graphURI, uri) {
        this.setId(FooWiki.graphURI, uri)
        return this;
    },
    */

    setId: function (graphURI, uri) {
        this.graphURI = graphURI;
        this.uri = uri;
        return this;
    },

    populate: function (json) {
        this.title = json.title;
        this.content = json.content;
        this.nick = json.nick;
        this.created = json.created;
        this.modified = json.modified;
        return this;
    },

    create: function () {
        //this.title = decodeURI(title);
        this.title = "";
        this.content = "";
        this.nick = "danja";
        var now = (new Date()).toISOString();
        this.created = now;
        this.modified = now;
        return this;
    }


};

/**
 * Comment template.
 * @param {string} uri URI of target page.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function getResource(uri, entryHandler) {
    // console.log("getresource " + uri);
    var type = queryString["type"];
            console.log("TYPE="+type);
    // http://localhost:3030/foowiki/page.html?uri=http://hyperdata.it/wiki/1unnamed.jpg&type=image

    var entry = Entry.setId(FooWiki.graphURI, uri);

    
    
    if (type == "image") {
        handleImageRequest(uri);
        return;
    }

    if (type == "markdown") {
        handleMarkdownRequest(uri);
        return;
    }

    if (type == "turtle") {
        handleTurtleRequest(entry);
        return;
    }


    var getPageUrl = generateGetUrl(getPageSparqlTemplate, entry);

    var handleEntry = function (entryJSON) {
        console.log("handleEntry " + JSON.stringify(entryJSON));
        entryHandler(entry, entryJSON);
    };
    console.log("getPageUrl = " + getPageUrl);
    getJsonForSparqlURL(getPageUrl, handleEntry);
    // getDataForURL(handleEntry, getPageUrl);
}

//function generateGetUrl(sparqlTemplate, entry) {
    
//}

function generateGetUrl(sparqlTemplate, entry, typeHint) {
    typeHint = typeHint ? typeHint :  "xml"; // Fuseki convention
    var sparql = sparqlTemplater(sparqlTemplate, entry);
    return FooWiki.sparqlQueryEndpoint + encodeURIComponent(sparql) + "&output="+typeHint;
}

function handleImageRequest(uri) {
  //  var fliptoImage = function (src) {
   //     window.location.href = src;
  //  };
    getImage(uri, redirectTo(target));
    return;
}

function handleMarkdownRequest(uri) {
    // TODO
}

function handleTurtleRequest(entry) {
    var getPageUrl = generateGetUrl(getTurtleSparqlTemplate, entry,"text"); // hopefully will return text/turtle
     redirectTo(getPageUrl);
}

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function getImage(imageURI, callback) {
    var pageMap = {
        "imageURI": imageURI,
        "graphURI": FooWiki.graphURI
    };

    var getPageSparql = sparqlTemplater(getImageSparqlTemplate, pageMap);
    var getPageUrl = FooWiki.sparqlQueryEndpoint + encodeURIComponent(getPageSparql) + "&output=xml";

    var makeDataURL = function (entryJSON) {
            //   console.log("BBB");
            //   var entryXmlNames = ["base64"];
            // var entryJSON = sparqlXMLtoJSON(xml);
            var src = "data:image/jpeg;base64," + entryJSON[0]["base64"];
            callback(src);
        }
        //   console.log("getPageUrl=" + getPageUrl);
        //  getDataForURL(makeDataURL, getPageUrl);
    getJsonForSparqlURL(getPageUrl, makeDataURL);
}

// see similar examples around http://stackoverflow.com/questions/18550151/posting-base64-data-javascript-jquery

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function setupImageUploading() {
    $('#fileSelector').change(function (event) {
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = function (event) {
            storeImage(reader.result);
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
// pushes image data to SPARQL store
function storeImage(dataURL) {

    //    console.log("base64 = " + base64);
    var file = $('#fileSelector')[0].files[0]
        //if(file){
        // console.log(file.name);
        // }
    var imageLabel = file.name;

    var BASE64_MARKER = ';base64,';
    //    if (dataURL.indexOf(BASE64_MARKER) == -1) {
    var parts = dataURL.split(',');
    var contentType = parts[0].split(':')[1];
    var raw = parts[1];
    //     } ;

    // ADD MEDIA TYPE
    var map = {
        "graphURI": FooWiki.graphURI,
        "imageURI": FooWiki.pagesBaseURI + imageLabel,
        "imageLabel": imageLabel,
        "imageData": raw
    };
    var data = sparqlTemplater(postImageSparqlTemplate, map, true);
    $.ajax({
        type: "POST",
        url: FooWiki.sparqlUpdateEndpoint,
        data: ({
            update: data
        })
    }).done(function () {});
    $('#original_image').attr('src', dataURL);
    $('#original_image').attr('name', imageLabel);
}

// image uploading
/*
 function dataURLToBlob(dataURL) {
     var BASE64_MARKER = ';base64,';
     if (dataURL.indexOf(BASE64_MARKER) == -1) {
         var parts = dataURL.split(',');
         var contentType = parts[0].split(':')[1];
         var raw = parts[1];

         return new Blob([raw], {
             type: contentType
         });
     } else {
         var parts = dataURL.split(BASE64_MARKER);
         var contentType = parts[0].split(':')[1];
         var raw = window.atob(parts[1]);
         var rawLength = raw.length;

         var uInt8Array = new Uint8Array(rawLength);

         for (var i = 0; i < rawLength; ++i) {
             uInt8Array[i] = raw.charCodeAt(i);
         }

         return new Blob([uInt8Array], {
             type: contentType
         });
     }
 }
*/
// SEARCH --------------------------

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function setupSearch(searchContainer) {

    //  $(searchContainer).append("<button id='searchButton'>Search</button>");
    //  $(searchContainer).append(entryTableTemplate);

    var renderTags = function (tags) {
        //  var tags = tagsXmlToJson(xml);
        var tagButtons = $(searchContainer + " #tagButtons");

        for (var i = 0; i < tags.length; i++) {
            var uri = tags[i]["topicURI"];
            var label = tags[i]["topicLabel"];
            //  <input type="checkbox" id="check1"><label for="check1">B</label>
            $(tagButtons).append("<input type='checkbox' id='tagButton" + i + "' name='" + label + "'><label for='tagButton" + i + "'>" + label + "</label> ");
        }
        $(tagButtons).buttonset();

        $("#searchButton").click(function () {
            doSearch();
        });
    }
    getAllTags(renderTags);
}

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function doSearch() {
    var regex = $("#searchText").val();

    var searchMap = {
        "graphURI": FooWiki.graphURI,
        "regex": regex
    };

    // $.extend(searchMap, entryXmlNames); // merges maps

    var checkedTags = [];

    $("#tagButtons label").each(function () {
        if ($(this).hasClass("ui-state-active")) {
            //     console.log("Checked = " + $(this).text());
            var checkedTag = {
                "topicLabel": $(this).text()
            };
            checkedTags.push(checkedTag);
        }
    });

    searchMap["tags"] = checkedTags;

    //  console.log("searchMap = " + JSON.stringify(searchMap));

    var searchSparql = sparqlTemplater(searchSparqlTemplate, searchMap);
    var searchUrl = FooWiki.sparqlQueryEndpoint + encodeURIComponent(searchSparql) + "&output=xml";

    var renderSearchResults = function (json) {
            //    console.log("entriesJSON = " + JSON.stringify(entriesJSON));
            var results = makeLinkListHTML(json);
            $("#results").empty();
            $("#results").append(results);
            //   console.log("HERE" + results);
            $('html, body').animate({
                scrollTop: $("#results").offset().top
            }, 250); // milliseconds
        }
        //    getDataForURL(renderSearchResults, searchUrl);
    getJsonForSparqlURL(searchUrl, renderSearchResults);
}

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function makeRecentChangesList() { // refactor with doSearch()

    var searchMap = {
        "graphURI": FooWiki.graphURI,
    };

    // $.extend(searchMap, entryXmlNames); // merges maps

    var searchSparql = sparqlTemplater(getRecentChangesSparqlTemplate, searchMap);
    //   console.log("getRecentChangesSparqlTemplate = " + getRecentChangesSparqlTemplate);
    var searchUrl = FooWiki.sparqlQueryEndpoint + encodeURIComponent(searchSparql) + "&output=xml";
    var renderRecentChanges = function (json) {

            var results = makeLinkListHTML(json);
            //   console.log("results = " + results);
            //     $("#results").empty();
            $("#recentChanges").append(results);
            //  console.log("HERE" + results);
        }
        //  getDataForURL(renderRecentChanges, searchUrl);
    getJsonForSparqlURL(searchUrl, renderRecentChanges);
}

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
// for search results
function makeLinkListHTML(entryArray) {
    var links = "";
    //  var entryArray = sparqlXMLtoJSON(xml);

    for (var i = 0; i < entryArray.length; i++) {
        var entry = entryArray[i];
        entry.uri = "page.html?uri=" + entry.uri;
        var link = templater(resultTemplate, entry);
        links += link;
    }
    return links;
}

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
// for index page
function makeEntryListHTML(entryArray, showContent) {
    var rows = "";
    //  var entryArray = sparqlXMLtoJSON(xml);

    for (var i = 0; i < entryArray.length; i++) {
        rows += formatRow(entryArray[i]);
    }
    return rows;
}

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
// for makeResourceListHTML page
function makeResourceListHTML(entryArray, showContent) {
    var rows = "";
    //  var entryArray = sparqlXMLtoJSON(xml);

    for (var i = 0; i < entryArray.length; i++) {
        rows += formatResourceRow(entryArray[i]);
    }
    return rows;
}

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function formatRow(entry) { // content, 
    //  entry.uri = "page.html?uri=" + entry.uri;
    entry.modified = moment(entry.modified).format("dddd, MMMM Do YYYY, h:mm:ss a");
    var row = templater(rowTemplate, entry);
    return row;
}

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function formatResourceRow(entry) { // content, 
    // console.log("ENTRY/RESOURCE= "+JSON.stringify(entry));
    var row = templater(resourceTemplate, entry);
    return row;
}

// TAGS Stuff
/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function setupTags(containerId, pageMap, readOnly) {
    if (readOnly) {
        createTags(containerId, pageMap, readOnly);
    } else {
        setupTagsAutocomplete(containerId, function () {
            createTags(containerId, pageMap, readOnly);
        });
    }
}

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function setupTagsAutocomplete(tagsContainerId, callback) {
    var insertTagsAutocomplete = function (tags) {
        //  var tags = tagsXmlToJson(xml);
        var allTags = [];

        for (var i = 0; i < tags.length; i++) {
            var label = tags[i]["topicLabel"];
            allTags.push(label);
        }

        var tagitMap = {
            readOnly: false,
            autocomplete: {
                delay: 0,
                minLength: 1
            },
            availableTags: allTags
        };
        $(tagsContainerId).tagit(tagitMap);
        callback();
    }
    getAllTags(insertTagsAutocomplete);
}

//function tagsXmlToJson(xml) {
//  var xmlString = (new XMLSerializer()).serializeToString(xml);
//  var tagsXmlNames = ["topicURI", "topicLabel"];
//  return sparqlXMLtoJSON(xml);
//}

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function createTags(containerId, pageMap, readOnly) {
    var getTagsSparql = sparqlTemplater(getTagsSparqlTemplate, pageMap);
    var getTagsUrl = FooWiki.sparqlQueryEndpoint + encodeURIComponent(getTagsSparql) + "&output=xml";

    var renderTags = function (tags) {

            var tagitMap = {
                readOnly: readOnly
            };

            $(containerId).tagit(tagitMap);

            for (var i = 0; i < tags.length; i++) {
                var uri = tags[i]["topicURI"];
                var label = tags[i]["topicLabel"];
                //  tagitMap[uri] = label;
                $(containerId).tagit('createTag', label);

                var selector = containerId + " input[value='" + label + "']";
                $(selector).attr("name", uri);
            }
        }
        // getDataForURL(renderTags, getTagsUrl);
    getJsonForSparqlURL(getTagsUrl, renderTags);
}

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function setupTagsPanel(tagsContainerId) { // is only used by index.html, nothing yet displayed -  for tag management, what's needed? is very similar to createTags
    console.log("setupTagsPanel CALLED on " + tagsContainerId);
    var doneCallback = function (tags) {

        var tagitMap = {
            readOnly: true
        };

        $(tagsContainerId).tagit(tagitMap);

        for (var i = 0; i < tags.length; i++) {
            var uri = tags[i]["topicURI"];
            var label = tags[i]["topicLabel"];
            $(tagsContainerId).tagit('createTag', label);
        }
    }
    getAllTags(doneCallback);
}

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function getAllTags(doneCallback) {
    var map = {
        "graphURI": FooWiki.graphURI
    };
    var getAllTagsSparql = sparqlTemplater(getAllTagsSparqlTemplate, map);

    var getAllTagsUrl = FooWiki.sparqlQueryEndpoint + encodeURIComponent(getAllTagsSparql) + "&output=xml";
    //  getDataForURL(doneCallback, getAllTagsUrl);
    getJsonForSparqlURL(getAllTagsUrl, doneCallback);
}