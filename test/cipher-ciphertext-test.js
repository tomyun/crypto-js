YUI.add('cipher-ciphertext-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'cipher.Ciphertext',

        testToStringPassedEncoder: function () {
            var rawCiphertext = C.lib.WordArray.create([0x48656c6c, 0x6f2c2057, 0x6f726c64, 0x21000000], 13);

            var expected = rawCiphertext.toString(C.enc.Base64);

            var ciphertext = C.cipher.Ciphertext.create(rawCiphertext);
            var actual = ciphertext.toString(C.cipher.format.OpenSSL);

            Y.Assert.areEqual(expected, actual);
        },

        testToStringDefaultEncoder: function () {
            var rawCiphertext = C.lib.WordArray.create([0x48656c6c, 0x6f2c2057, 0x6f726c64, 0x21000000], 13);

            var expected = rawCiphertext.toString(C.enc.Base64);

            var ciphertext = C.cipher.Ciphertext.create(rawCiphertext, {
                formatter: C.cipher.format.OpenSSL
            });
            var actual = ciphertext.toString();

            Y.Assert.areEqual(expected, ciphertext);
        }
    }));
}, '$Rev$');
