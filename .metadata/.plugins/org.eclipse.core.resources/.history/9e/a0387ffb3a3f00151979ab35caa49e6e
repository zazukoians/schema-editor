// TODO use this (add timer) in edit.tml

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */

$(document).ready(function () {

    ///////////////////////
    //
    // Recovery Below
    //
    ///////////////////////

    // Retrieve the object from storage onReady
    var autosave = localStorage.getItem('file');

    // parses the string (btw. its UTF-8)
    var text = JSON.parse(autosave);

    //modifies the textarea with the id="inputTextArea"
    $("textarea#inputTextArea").val(text);

    ////////////////////////
    //
    // Autosaver below
    //
    ////////////////////////

    // Autosave on keystroke works in offline mode
    $("textarea#inputTextArea").change(function () {

        // pulls the value from the textaream/.j
        var file = $('textarea#inputTextArea').val();

        // sets the file string to hold the data
        localStorage.setItem('file', JSON.stringify(file));
    });

});