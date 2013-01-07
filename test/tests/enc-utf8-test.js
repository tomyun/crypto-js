YUI.add('enc-utf8-test', function (Y) {
    var Utf8 = CryptoJS.enc.Utf8;
    var WordArray = CryptoJS.lib.WordArray;

    Y.CryptoJSTestSuite.add(new Y.Test.Case({
        name: 'Utf8',

        testStringify1: function () {
            Y.Assert.areEqual('$', Utf8.stringify(new WordArray([0x24000000], 1)));
        },

        testStringify2: function () {
            Y.Assert.areEqual('¢', Utf8.stringify(new WordArray([0xc2a20000], 2)));
        },

        testStringify3: function () {
            Y.Assert.areEqual('€', Utf8.stringify(new WordArray([0xe282ac00], 3)));
        },

        testStringify4: function () {
            Y.Assert.areEqual('𤭢', Utf8.stringify(new WordArray([0xf0a4ada2], 4)));
        },

        testParse1: function () {
            Y.Assert.areEqual((new WordArray([0x24000000], 1)).toString(), Utf8.parse('$').toString());
        },

        testParse2: function () {
            Y.Assert.areEqual((new WordArray([0xc2a20000], 2)).toString(), Utf8.parse('¢').toString());
        },

        testParse3: function () {
            Y.Assert.areEqual((new WordArray([0xe282ac00], 3)).toString(), Utf8.parse('€').toString());
        },

        testParse4: function () {
            Y.Assert.areEqual((new WordArray([0xf0a4ada2], 4)).toString(), Utf8.parse('𤭢').toString());
        }
    }));
}, '$Rev$');
