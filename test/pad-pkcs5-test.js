YUI.add('pad-pkcs5-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'pad.PKCS5',

        testVector: function () {
            Y.Assert.fail();
        }
    }));
}, '$Rev$');
