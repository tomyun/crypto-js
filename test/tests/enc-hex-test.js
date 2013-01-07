YUI.add('enc-hex-test', function (Y) {
    var Hex = CryptoJS.enc.Hex;
    var WordArray = CryptoJS.lib.WordArray;

    Y.CryptoJSTestSuite.add(new Y.Test.Case({
        name: 'Hex',

        _should: {
            error: {
                testOctetError: true
            }
        },

        testStringify: function () {
            Y.Assert.areEqual('12345678', Hex.stringify(new WordArray([0x12345678])));
        },

        testParse: function () {
            Y.Assert.areEqual((new WordArray([0x12345678])).toString(), Hex.parse('12345678').toString());
        },

        testOctetError: function () {
            Hex.parse('1234567');
        }
    }));
}, '$Rev$');
