YUI.add('enc-base64-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'enc.Base64',

        testToString0: function () {
            Y.Assert.areEqual('', C.enc.Base64.toString(C.lib.WordArray.create([0x666f6f62, 0x61720000], 0)));
        },

        testToString1: function () {
            Y.Assert.areEqual('Zg==', C.enc.Base64.toString(C.lib.WordArray.create([0x666f6f62, 0x61720000], 1)));
        },

        testToString2: function () {
            Y.Assert.areEqual('Zm8=', C.enc.Base64.toString(C.lib.WordArray.create([0x666f6f62, 0x61720000], 2)));
        },

        testToString3: function () {
            Y.Assert.areEqual('Zm9v', C.enc.Base64.toString(C.lib.WordArray.create([0x666f6f62, 0x61720000], 3)));
        },

        testToString4: function () {
            Y.Assert.areEqual('Zm9vYg==', C.enc.Base64.toString(C.lib.WordArray.create([0x666f6f62, 0x61720000], 4)));
        },

        testToString5: function () {
            Y.Assert.areEqual('Zm9vYmE=', C.enc.Base64.toString(C.lib.WordArray.create([0x666f6f62, 0x61720000], 5)));
        },

        testToString6: function () {
            Y.Assert.areEqual('Zm9vYmFy', C.enc.Base64.toString(C.lib.WordArray.create([0x666f6f62, 0x61720000], 6)));
        },

        testToString15: function () {
            var wordArray = C.lib.WordArray.create([0x3e3e3e3f, 0x3f3f3e3e, 0x3e3f3f3f, 0x3d2f2b00], 15);

            Y.Assert.areEqual('Pj4+Pz8/Pj4+Pz8/PS8r', C.enc.Base64.toString(wordArray));
        },

        testFromString0: function () {
            var expected = C.lib.WordArray.create([0x666f6f62, 0x61720000], 0).toString();
            var actual = C.enc.Base64.fromString('');

            Y.Assert.areEqual(expected, actual);
        },

        testFromString1: function () {
            var expected = C.lib.WordArray.create([0x666f6f62, 0x61720000], 1).toString();
            var actual = C.enc.Base64.fromString('Zg==');

            Y.Assert.areEqual(expected, actual);
        },

        testFromString2: function () {
            var expected = C.lib.WordArray.create([0x666f6f62, 0x61720000], 2).toString();
            var actual = C.enc.Base64.fromString('Zm8=');

            Y.Assert.areEqual(expected, actual);
        },

        testFromString3: function () {
            var expected = C.lib.WordArray.create([0x666f6f62, 0x61720000], 3).toString();
            var actual = C.enc.Base64.fromString('Zm9v');

            Y.Assert.areEqual(expected, actual);
        },

        testFromString4: function () {
            var expected = C.lib.WordArray.create([0x666f6f62, 0x61720000], 4).toString();
            var actual = C.enc.Base64.fromString('Zm9vYg==');

            Y.Assert.areEqual(expected, actual);
        },

        testFromString5: function () {
            var expected = C.lib.WordArray.create([0x666f6f62, 0x61720000], 5).toString();
            var actual = C.enc.Base64.fromString('Zm9vYmE=');

            Y.Assert.areEqual(expected, actual);
        },

        testFromString6: function () {
            var expected = C.lib.WordArray.create([0x666f6f62, 0x61720000], 6).toString();
            var actual = C.enc.Base64.fromString('Zm9vYmFy');

            Y.Assert.areEqual(expected, actual);
        },

        testFromString15: function () {
            var expected = C.lib.WordArray.create([0x3e3e3e3f, 0x3f3f3e3e, 0x3e3f3f3f, 0x3d2f2b00], 15).toString();
            var actual = C.enc.Base64.fromString('Pj4+Pz8/Pj4+Pz8/PS8r');

            Y.Assert.areEqual(expected, actual);
        }
    }));
}, '$Rev$');
