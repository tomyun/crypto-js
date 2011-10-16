YUI.add('enc-utf8-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'enc.Utf8',

        testToString1: function () {
            Y.Assert.areEqual('$', C.enc.Utf8.toString(C.lib.WordArray.create([0x24000000], 1)));
        },

        testToString2: function () {
            Y.Assert.areEqual('¢', C.enc.Utf8.toString(C.lib.WordArray.create([0xc2a20000], 2)));
        },

        testToString3: function () {
            Y.Assert.areEqual('€', C.enc.Utf8.toString(C.lib.WordArray.create([0xe282ac00], 3)));
        },

        testToString4: function () {
            Y.Assert.areEqual('𤭢', C.enc.Utf8.toString(C.lib.WordArray.create([0xf0a4ada2], 4)));
        },

        testFromString1: function () {
            Y.Assert.areEqual(C.lib.WordArray.create([0x24000000], 1).toString(), C.enc.Utf8.fromString('$'));
        },

        testFromString2: function () {
            Y.Assert.areEqual(C.lib.WordArray.create([0xc2a20000], 2).toString(), C.enc.Utf8.fromString('¢'));
        },

        testFromString3: function () {
            Y.Assert.areEqual(C.lib.WordArray.create([0xe282ac00], 3).toString(), C.enc.Utf8.fromString('€'));
        },

        testFromString4: function () {
            Y.Assert.areEqual(C.lib.WordArray.create([0xf0a4ada2], 4).toString(), C.enc.Utf8.fromString('𤭢'));
        }
    }));
}, '$Rev$');
