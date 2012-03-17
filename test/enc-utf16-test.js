YUI.add('enc-utf16-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Utf16',

        testStringify1: function () {
            Y.Assert.areEqual('z', C.enc.Utf16.stringify(C.lib.WordArray.create([0x007a0000], 2)));
        },

        testStringify2: function () {
            Y.Assert.areEqual('水', C.enc.Utf16.stringify(C.lib.WordArray.create([0x6c340000], 2)));
        },

        testStringify3: function () {
            Y.Assert.areEqual('𐀀', C.enc.Utf16.stringify(C.lib.WordArray.create([0xd800dc00], 4)));
        },

        testStringify4: function () {
            Y.Assert.areEqual('𝄞', C.enc.Utf16.stringify(C.lib.WordArray.create([0xd834dd1e], 4)));
        },

        testStringify5: function () {
            Y.Assert.areEqual('􏿽', C.enc.Utf16.stringify(C.lib.WordArray.create([0xdbffdffd], 4)));
        },

        testParse1: function () {
            Y.Assert.areEqual(C.lib.WordArray.create([0x007a0000], 2).toString(), C.enc.Utf16.parse('z'));
        },

        testParse2: function () {
            Y.Assert.areEqual(C.lib.WordArray.create([0x6c340000], 2).toString(), C.enc.Utf16.parse('水'));
        },

        testParse3: function () {
            Y.Assert.areEqual(C.lib.WordArray.create([0xd800dc00], 4).toString(), C.enc.Utf16.parse('𐀀'));
        },

        testParse4: function () {
            Y.Assert.areEqual(C.lib.WordArray.create([0xd834dd1e], 4).toString(), C.enc.Utf16.parse('𝄞'));
        },

        testParse5: function () {
            Y.Assert.areEqual(C.lib.WordArray.create([0xdbffdffd], 4).toString(), C.enc.Utf16.parse('􏿽'));
        }
    }));
}, '$Rev$');
