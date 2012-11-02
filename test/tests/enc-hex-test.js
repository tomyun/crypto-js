YUI.add('enc-hex-test', function (Y) {
    var C = CryptoJS;

    Y.CryptoJSTestSuite.add(new Y.Test.Case({
        name: 'Hex',

        _should: {
            error: {
                testParseInvalidOctet: true
            }
        },

        testStringify: function () {
            Y.Assert.areEqual('12345678', C.enc.Hex.stringify(C.lib.WordArray.create([0x12345678])));
        },

        testParse: function () {
            Y.Assert.areEqual(C.lib.WordArray.create([0x12345678]).toString(), C.enc.Hex.parse('12345678').toString());
        },

        testParseInvalidOctet: function () {
            C.enc.Hex.parse('1234567');
        }
    }));
}, '$Rev$');
