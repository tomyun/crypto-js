YUI.add('cipher-mode-cbc-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'cipher.mode.CBC',

        testVector: function () {
            Y.Assert.fail();
        }
    }));
}, '$Rev$');
