QUnit.test("hello test", function (assert) {
    assert.ok(1 == "1", "Passed!");
});

QUnit.module("prefix/namespace group");
//  "foaf": "http://xmlns.com/foaf/0.1/",
QUnit.test("test SEUtils prefix/namespace mapping", function (assert) {
    assert.expect(2);
    var done = assert.async();

    var callback = function () {
        var prefix = "foaf";
        var namespace = "http://xmlns.com/foaf/0.1/";

        var result = SEUtils.getNamespaceForPrefix(prefix);
        assert.equal(result, namespace, "foaf => http://xmlns.com/foaf/0.1/");

        result = SEUtils.getPrefixForNamespace(namespace);
        assert.equal(result, prefix, "http://xmlns.com/foaf/0.1/ => foaf");
        done();
    }
    SEUtils.initPrefixes(callback);
});

QUnit.test("test SEUtils resolveToURI", function (assert) {
    assert.expect(4);
    var done = assert.async();

    var resolveTests = function () {

        var slashURI = "http://xmlns.com/foaf/0.1/name";
        var result = SEUtils.resolveToURI(slashURI);
        assert.equal(result, slashURI, "http://xmlns.com/foaf/0.1/name => http://xmlns.com/foaf/0.1/name");

        var hashURI = "http://www.w3.org/2000/01/rdf-schema#Class";
        var result = SEUtils.resolveToURI(hashURI);
        assert.equal(result, hashURI, "http://www.w3.org/2000/01/rdf-schema#Class => http://www.w3.org/2000/01/rdf-schema#Class");

        // console.log("resolveToURI SEUtils.prefixes = \n" + JSON.stringify(SEUtils.prefixes, false, 4));

        var curie = "foaf:name";
        var result = SEUtils.resolveToURI(curie);
        assert.equal(result, "http://xmlns.com/foaf/0.1/name", "foaf:name => http://xmlns.com/foaf/0.1/name");

        Config.setGraphURI("http://example.org/");
        var name = "thingy";
        var result = SEUtils.resolveToURI(name);
        assert.equal(result, "http://example.org/thingy", "thingy => http://example.org/thingy");
        done();
    }
    SEUtils.initPrefixes(resolveTests);
});
