YUI.add('lib-cipherparams-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'lib.CipherParams',

        testToStringPassedEncoder: function () {
            var rawCiphertext = C.lib.WordArray.create([0x48656c6c, 0x6f2c2057, 0x6f726c64, 0x21000000], 13);

            var expected = rawCiphertext.toString(C.enc.Base64);

            var cipherParams = C.lib.CipherParams.create({ rawCiphertext: rawCiphertext });
            var actual = cipherParams.toString(C.format.OpenSSL);

            Y.Assert.areEqual(expected, actual);
        },

        testToStringDefaultEncoder: function () {
            var rawCiphertext = C.lib.WordArray.create([0x48656c6c, 0x6f2c2057, 0x6f726c64, 0x21000000], 13);

            var expected = rawCiphertext.toString(C.enc.Base64);

            var cipherParams = C.lib.CipherParams.create({
                rawCiphertext: rawCiphertext,
                formatter: C.format.OpenSSL
            });

            Y.Assert.areEqual(expected, cipherParams);
        }
    }));
}, '$Rev$');
