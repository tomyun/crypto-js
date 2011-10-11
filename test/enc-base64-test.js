YUI.add('enc-base64-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'enc.Base64',

        testToString0: function () {
            var expected = '';

            var data = C.lib.WordArray.create([0x666f6f62, 0x61720000], 0);
            var actual = C.enc.Base64.toString(data);

            Y.Assert.areEqual(expected, actual);
        },

        testToString1: function () {
            var expected = 'Zg==';

            var data = C.lib.WordArray.create([0x666f6f62, 0x61720000], 1);
            var actual = C.enc.Base64.toString(data);

            Y.Assert.areEqual(expected, actual);
        },

        testToString2: function () {
            var expected = 'Zm8=';

            var data = C.lib.WordArray.create([0x666f6f62, 0x61720000], 2);
            var actual = C.enc.Base64.toString(data);

            Y.Assert.areEqual(expected, actual);
        },

        testToString3: function () {
            var expected = 'Zm9v';

            var data = C.lib.WordArray.create([0x666f6f62, 0x61720000], 3);
            var actual = C.enc.Base64.toString(data);

            Y.Assert.areEqual(expected, actual);
        },

        testToString4: function () {
            var expected = 'Zm9vYg==';

            var data = C.lib.WordArray.create([0x666f6f62, 0x61720000], 4);
            var actual = C.enc.Base64.toString(data);

            Y.Assert.areEqual(expected, actual);
        },

        testToString5: function () {
            var expected = 'Zm9vYmE=';

            var data = C.lib.WordArray.create([0x666f6f62, 0x61720000], 5);
            var actual = C.enc.Base64.toString(data);

            Y.Assert.areEqual(expected, actual);
        },

        testToString6: function () {
            var expected = 'Zm9vYmFy';

            var data = C.lib.WordArray.create([0x666f6f62, 0x61720000], 6);
            var actual = C.enc.Base64.toString(data);

            Y.Assert.areEqual(expected, actual);
        },

        testToString15: function () {
            var expected = 'Pj4+Pz8/Pj4+Pz8/PS8r';

            var data = C.lib.WordArray.create([0x3e3e3e3f, 0x3f3f3e3e, 0x3e3f3f3f, 0x3d2f2b00], 15);
            var actual = C.enc.Base64.toString(data);

            Y.Assert.areEqual(expected, actual);
        },

        testFromString0: function () {
            var expected = C.lib.WordArray.create([0x666f6f62, 0x61720000], 0).toString();

            var data = '';
            var actual = C.enc.Base64.fromString(data);

            Y.Assert.areEqual(expected, actual);
        },

        testFromString1: function () {
            var expected = C.lib.WordArray.create([0x666f6f62, 0x61720000], 1).toString();

            var data = 'Zg==';
            var actual = C.enc.Base64.fromString(data);

            Y.Assert.areEqual(expected, actual);
        },

        testFromString2: function () {
            var expected = C.lib.WordArray.create([0x666f6f62, 0x61720000], 2).toString();

            var data = 'Zm8=';
            var actual = C.enc.Base64.fromString(data);

            Y.Assert.areEqual(expected, actual);
        },

        testFromString3: function () {
            var expected = C.lib.WordArray.create([0x666f6f62, 0x61720000], 3).toString();

            var data = 'Zm9v';
            var actual = C.enc.Base64.fromString(data);

            Y.Assert.areEqual(expected, actual);
        },

        testFromString4: function () {
            var expected = C.lib.WordArray.create([0x666f6f62, 0x61720000], 4).toString();

            var data = 'Zm9vYg==';
            var actual = C.enc.Base64.fromString(data);

            Y.Assert.areEqual(expected, actual);
        },

        testFromString5: function () {
            var expected = C.lib.WordArray.create([0x666f6f62, 0x61720000], 5).toString();

            var data = 'Zm9vYmE=';
            var actual = C.enc.Base64.fromString(data);

            Y.Assert.areEqual(expected, actual);
        },

        testFromString6: function () {
            var expected = C.lib.WordArray.create([0x666f6f62, 0x61720000], 6).toString();

            var data = 'Zm9vYmFy';
            var actual = C.enc.Base64.fromString(data);

            Y.Assert.areEqual(expected, actual);
        },

        testFromString15: function () {
            var expected = C.lib.WordArray.create([0x3e3e3e3f, 0x3f3f3e3e, 0x3e3f3f3f, 0x3d2f2b00], 15).toString();

            var data = 'Pj4+Pz8/Pj4+Pz8/PS8r';
            var actual = C.enc.Base64.fromString(data);

            Y.Assert.areEqual(expected, actual);
        }
    }));
}, '$Rev$');
