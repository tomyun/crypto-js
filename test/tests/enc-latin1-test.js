YUI.add('enc-latin1-test', function (Y) {
    var Latin1 = CryptoJS.enc.Latin1;
    var WordArray = CryptoJS.lib.WordArray;

    Y.CryptoJSTestSuite.add(new Y.Test.Case({
        name: 'Latin1',

        testStringify: function () {
            Y.Assert.areEqual('\x12\x34\x56\x78', Latin1.stringify(new WordArray([0x12345678])));
        },

        testParse: function () {
            Y.Assert.areEqual((new WordArray([0x12345678])).toString(), Latin1.parse('\x12\x34\x56\x78').toString());
        }
    }));
}, '$Rev$');
