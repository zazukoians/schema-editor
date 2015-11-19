QUnit.test("hello test", function (assert) {
    assert.ok(1 == "1", "Passed!");
});

QUnit.test("base test", function (assert) {
    var uri = "http://localhost:8888/?uri=http://b.org/b#Z&graph=http://b.org/b#";
    var expected = "http://localhost:8888/";
    var result = getBase(uri);
    assert.equal(result, expected, "http://example.org/here#");
});

QUnit.test("nameFromURI / namespace", function (assert) {
    var uri = "http://example.org/here/name";
    var expected = "name";
    var result = SEUtils.nameFromURI(uri);
    assert.equal(result, expected, "name");
});

QUnit.test("nameFromURI # namespace", function (assert) {
    var uri = "http://example.org/here#name";
    var expected = "name";
    var result = SEUtils.nameFromURI(uri);
    assert.equal(result, expected, "name");
});

QUnit.module("prefix/namespace group");

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

/*
        Config.setGraphURI("http://example.org/", false);
        console.log("Config.getGraphURI() = "+Config.getGraphURI());
        var name = "thingy";
        var result = SEUtils.resolveToURI(name);
        assert.equal(result, "http://example.org/thingy", "thingy => http://example.org/thingy");
        */
      //  done();
    }
    SEUtils.initPrefixes(resolveTests);
});

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



QUnit.test("curieFromURI: known prefix, / namespace", function (assert) {
    var uri = "http://xmlns.com/foaf/0.1/name";
    var expected = "foaf:name";
    var result = SEUtils.curieFromURI(uri);
    assert.equal(result, expected, "foaf:name");
});

QUnit.test("curieFromURI: known prefix, # namespace", function (assert) {
    var uri = "http://www.w3.org/2000/01/rdf-schema#Class";
    var expected = "rdfs:Class";
    var result = SEUtils.curieFromURI(uri);
    assert.equal(result, expected, "rdfs:Class");
});

QUnit.test("curieFromURI: unknown prefix, / namespace", function (assert) {
    var uri = "http://xxxx.org/yyy";
    var result = SEUtils.curieFromURI(uri);
    assert.equal(result, uri, "uri");
});

QUnit.test("curieFromURI: unknown prefix, # namespace", function (assert) {
    var uri = "http://xxxx.org/yyy#zzz";
    var result = SEUtils.curieFromURI(uri);
    assert.equal(result, uri, "uri");
});
