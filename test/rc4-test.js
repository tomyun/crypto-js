YUI.add('rc4-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'RC4',

        testVector1: function () {
            var expected = '7494c2e7104b0879';

            var message = C.lib.WordArray.create([0x00000000, 0x00000000]);
            var key = C.lib.WordArray.create([0x01234567, 0x89abcdef]);
            var actual = C.RC4.encrypt(message, key, { drop: 0 }).rawCiphertext;

            Y.Assert.areEqual(expected, actual);
        },

        testVector2: function () {
            var expected = 'f13829c9de';

            var message = C.lib.WordArray.create([0xdcee4cf9, 0x2c000000], 5);
            var key = C.lib.WordArray.create([0x618a63d2, 0xfb000000], 5);
            var actual = C.RC4.encrypt(message, key, { drop: 0 }).rawCiphertext;

            Y.Assert.areEqual(expected, actual);
        },

        testDrop: function () {
            var message = C.lib.WordArray.create([0x00000000, 0x00000000, 0x00000000, 0x00000000]);
            var key = C.lib.WordArray.create([0x01234567, 0x89abcdef]);

            var rawCiphertext = C.RC4.encrypt(message, key, { drop: 0 }).rawCiphertext;
            var expected = C.lib.WordArray.create(rawCiphertext.words.slice(2)).toString();

            var message = C.lib.WordArray.create([0x00000000, 0x00000000]);
            var actual = C.RC4.encrypt(message, key, { drop: 2 }).rawCiphertext;

            Y.Assert.areEqual(expected, actual);
        }
    }));
});
