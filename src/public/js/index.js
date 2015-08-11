/**
 * Functions associated with index.html
 */

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function setupButtons() {
    $("#turtle").click(function () {
        var turtleURL = FooWiki.sparqlQueryEndpoint + "CONSTRUCT+%7B+%3Fs+%3Fp+%3Fo+%7D++WHERE+%7B%0D%0A+++GRAPH+%3Chttp%3A%2F%2Fhyperdata.it%2Fwiki%3E+%7B%0D%0A++++++%3Fs+%3Fp+%3Fo%0D%0A+++%7D%0D%0A%7D&output=text";
        location.href = turtleURL;
    });

    $("#newPageButton").click(function () {
        var newPageName = $("#newPageName").val();

        window.location.href = window.location.href = FooWiki.serverRootPath + "edit.html?uri=" + FooWiki.graphURI + "/" + newPageName;
    });

    // OLD
    $("#upload-button").click(function () {
        var data = new FormData($("#upload-file").val());
        console.log("DATA = " + data);
        $.ajax({
            url: FooWiki.sparqlUpdateEndpoint,
            type: 'POST',
            data: ({
                update: data
            }),
            //    contentType: "application/sparql-update",
            processData: false,
            contentType: false
        });
        //    e.preventDefault();
    });
    // NEW - check with image upload
    /*
            $('#fileupload').fileupload({
                dataType: 'json',
                done: function (e, data) {
                    $.each(data.result.files, function (index, file) {
                        $('<p/>').text(file.name).appendTo(document.body);
                    });
                }
            });
            */
    setupSearch("#searchContainer");
}