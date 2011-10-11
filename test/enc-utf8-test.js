YUI.add('enc-utf8-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'enc.Utf8',

        testToString1: function () {
            var expected = '$';

            var data = C.lib.WordArray.create([0x24000000], 1);
            var actual = C.enc.Utf8.toString(data);

            Y.Assert.areEqual(expected, actual);
        },

        testToString2: function () {
            var expected = '¢';

            var data = C.lib.WordArray.create([0xc2a20000], 2);
            var actual = C.enc.Utf8.toString(data);

            Y.Assert.areEqual(expected, actual);
        },

        testToString3: function () {
            var expected = '€';

            var data = C.lib.WordArray.create([0xe282ac00], 3);
            var actual = C.enc.Utf8.toString(data);

            Y.Assert.areEqual(expected, actual);
        },

        testToString4: function () {
            var expected = '𤭢';

            var data = C.lib.WordArray.create([0xf0a4ada2], 4);
            var actual = C.enc.Utf8.toString(data);

            Y.Assert.areEqual(expected, actual);
        },

        testFromString1: function () {
            var expected = C.lib.WordArray.create([0x24000000], 1).toString();

            var data = '$';
            var actual = C.enc.Utf8.fromString(data);

            Y.Assert.areEqual(expected, actual);
        },

        testFromString2: function () {
            var expected = C.lib.WordArray.create([0xc2a20000], 2).toString();

            var data = '¢';
            var actual = C.enc.Utf8.fromString(data);

            Y.Assert.areEqual(expected, actual);
        },

        testFromString3: function () {
            var expected = C.lib.WordArray.create([0xe282ac00], 3).toString();

            var data = '€';
            var actual = C.enc.Utf8.fromString(data);

            Y.Assert.areEqual(expected, actual);
        },

        testFromString4: function () {
            var expected = C.lib.WordArray.create([0xf0a4ada2], 4).toString();

            var data = '𤭢';
            var actual = C.enc.Utf8.fromString(data);

            Y.Assert.areEqual(expected, actual);
        }
    }));
}, '$Rev$');
