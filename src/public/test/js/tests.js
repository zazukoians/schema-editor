/*
QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});
*/

    //  "foaf": "http://xmlns.com/foaf/0.1/",
QUnit.asyncTest("test SEUtils prefix/namespace mapping", function (assert) {
    assert.expect(2);

    var callback = function () {
        var prefix = "foaf";
        var namespace = "http://xmlns.com/foaf/0.1/";

        var result = SEUtils.getNamespaceForPrefix(prefix);
        assert.equal(result, namespace, "foaf => http://xmlns.com/foaf/0.1/");

        result = SEUtils.getPrefixForNamespace(namespace);
        assert.equal(result, prefix, "http://xmlns.com/foaf/0.1/ => foaf");
    }

    SEUtils.initPrefixes(callback);










});
