/**
 * Functions associated with edit.html
 */

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
var populateEditPage = function (entry, entryJSON) {

    console.log("populateEditPage " + JSON.stringify(entryJSON));
    var uri = getCurrentPageURI();
    if (!entryJSON[0]) {
        var split = uri.split("/");
        var rawTitle = split[split.length - 1];
        var entry = Entry.create();
        entry.title = decodeURI(rawTitle);
    } else {
        var entry = Entry.populate(entryJSON[0]);
    }

    var entryHTML = templater(editEntryTemplate, entry);

    $("#entry").replaceWith(entryHTML);
    $("#format option").each(
        function () {
            this.selected = ($(this).attr("value") == entry.format);

        });
    // put data in versioned here

    var pageMap = {
        "uri": uri,
        "graphURI": FooWiki.graphURI
    };
    setupTags("#maintagscontainer", pageMap, false);
    $("textarea").autoGrow();
    $("#maintagscontainer").addClass("editable"); // not working 
};

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function setupPosting() {
    $('#cancel').click(function () {
        return flipToViewPage();
    });

    $('#submit').click(function () {
        var uri = getCurrentPageURI();
        var entry = Entry.setId(FooWiki.graphURI, uri);
        entry = populateEntryFromHTML(entry);
        entry.modified = (new Date()).toISOString();
        entry.maker = FooWiki.graphURI+"/people/"+entry.nick; // mint a uri
        storeEntry(entry);
    });

    var storeEntry = function (entry) {
        //     var entry = extractEntry(FooWiki.graphURI, uri);
        // console.log("ENTRY = "+JSON.stringify(entry));
        var data = sparqlTemplater(postPageSparqlTemplate, entry, true);

        //     var afterPostEntry = function () {

        //   }

        var postNewData = function () {
            $.ajax({
                type: "POST",
                url: FooWiki.sparqlUpdateEndpoint,
                data: ({
                    update: data
                })
            }).done(function () {
                var fliptoViewPage = function () {
                    window.location.href = window.location.href.replace("edit.html", "page.html");
                };
                submitOutlinks(FooWiki.graphURI, uri, entry.content);
                submitTags(FooWiki.graphURI, uri, fliptoViewPage);


            }).fail(function () {
                alert("error"); // use error banner
            });
        }
        var uri = getCurrentPageURI();
        deleteResource(FooWiki.graphURI, uri, postNewData);
        return false;
    }

    var flipToViewPage = function () {
        window.location.href = window.location.href.replace("edit.html", "page.html");
        return false;
    }

    //  var fliptoIndexPage = function () {
    //     window.location.href = "index.html";
    //  };

    $('#delete').click(function () {
        //   console.log("HERW"+JSON.stringify(entry)); NOT DEFINED
        var uri = getCurrentPageURI();
        return deleteResource(FooWiki.graphURI, uri, redirectTo("index.html"));
    });
}



/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function populateEntryFromHTML(entry) {
    console.log("ENTRY = " + JSON.stringify(entry));
    /*
    var entry = {
        "FooWiki.graphURI": FooWiki.graphURI,
        "uri": uri,
        "date": (new Date()).toISOString(),
        "modified": (new Date()).toISOString()
    };
    */
    //  var entry = Entry.create();
    //  entry.setId(FooWiki.graphURI, uri);

    entry.title = $('#title').val(); /// can this lot use a convention, HTML id = entry field name??? idHtmlToJSON??
    entry.nick = $('#nick').val();
    entry.created = $('#createdISO').val();
    entry.content = $('#content').val();
    entry.content = escapeXml(entry.content);
    entry.format = $('#format').val();
    return entry;
}

/**
 * Deletes references to a resource
 * see sparql-templates.deleteResourceSparqlTemplate
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function deleteResource(graphURI, uri, callback) {
    var entry = Entry.setId(graphURI, uri);
    var data = sparqlTemplater(deleteResourceSparqlTemplate, entry, true);
    $.ajax({
        type: "POST",
        url: FooWiki.sparqlUpdateEndpoint,
        data: ({
            update: data
        })
    }).done(function () {
        callback();
    }).fail(function (jqXHR, textStatus) {
        alert("Error " + textStatus); // function( jqXHR, textStatus )
    });
    return false;
}

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function submitOutlinks(graphURI, uri, content) {
    var matches = content.match(/\[([^\[]*)\]\(([^\)]*)\)/g);
    console.log("MATCHESreg=" + JSON.stringify(matches));
}

// TAGS ----------------------------------------------
/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function submitTags(graphURI, uri, callback) {

    var tagsCommas = $("#maintagscontainer").tagit("assignedTags");
    console.log("tagsCommas=" + tagsCommas);
    var tagStrings = tagsCommas; //.split(",");
    var tags = [];
    for (var i = 0; i < tagStrings.length; i++) {
        var tag = {
            "topicURI": "http://hyperdata.it/tags/" + tagStrings[i].toLowerCase(),
            "topicLabel": tagStrings[i].toLowerCase()
        };
        tags.push(tag);
    }

    var templateMap = {
        "graphURI": graphURI,
        "uri": uri,
        "tags": tags
    };

    //    console.log("templateMap=" + JSON.stringify(templateMap));
    var data = sparqlTemplater(postTagsSparqlTemplate, templateMap, true);
    //     console.log("postTagsSparqlTemplate=" + postTagsSparqlTemplate);
    //     console.log("DATA=" + data);

    $.ajax({
        type: "POST",
        url: FooWiki.sparqlUpdateEndpoint,
        data: ({
            update: data
        })
    }).done(function () {
        callback();
    });
}