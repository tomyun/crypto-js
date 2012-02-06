YUI.add('format-openssl-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'OpenSSL',

        testSaltedToString: function () {
            var rawCiphertext = C.lib.WordArray.create([0x00010203, 0x04050607, 0x08090a0b, 0x0c0d0e0f]);
            var salt = C.lib.WordArray.create([0x01234567, 0x89abcdef]);

            Y.Assert.areEqual(
                C.enc.Latin1.fromString('Salted__').concat(salt).concat(rawCiphertext).toString(C.enc.Base64),
                C.format.OpenSSL.toString(C.lib.CipherParams.create({ rawCiphertext: rawCiphertext, salt: salt }))
            );
        },

        testUnsaltedToString: function () {
            var rawCiphertext = C.lib.WordArray.create([0x00010203, 0x04050607, 0x08090a0b, 0x0c0d0e0f]);

            Y.Assert.areEqual(
                rawCiphertext.toString(C.enc.Base64),
                C.format.OpenSSL.toString(C.lib.CipherParams.create({ rawCiphertext: rawCiphertext }))
            );
        },

        testSaltedFromString: function () {
            var rawCiphertext = C.lib.WordArray.create([0x00010203, 0x04050607, 0x08090a0b, 0x0c0d0e0f]);
            var salt = C.lib.WordArray.create([0x01234567, 0x89abcdef]);
            var openSslStr = C.format.OpenSSL.toString(
                C.lib.CipherParams.create({ rawCiphertext: rawCiphertext, salt: salt })
            );

            var cipherParams = C.format.OpenSSL.fromString(openSslStr);

            Y.Assert.areEqual(rawCiphertext.toString(), cipherParams.rawCiphertext);
            Y.Assert.areEqual(salt.toString(), cipherParams.salt);
        },

        testUnsaltedFromString: function () {
            var rawCiphertext = C.lib.WordArray.create([0x00010203, 0x04050607, 0x08090a0b, 0x0c0d0e0f]);
            var openSslStr = C.format.OpenSSL.toString(C.lib.CipherParams.create({ rawCiphertext: rawCiphertext }));

            var cipherParams = C.format.OpenSSL.fromString(openSslStr);

            Y.Assert.areEqual(rawCiphertext.toString(), cipherParams.rawCiphertext);
        }
    }));
}, '$Rev$');
