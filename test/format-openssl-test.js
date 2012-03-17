YUI.add('format-openssl-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'OpenSSLFormatter',

        testSaltedToString: function () {
            var ciphertext = C.lib.WordArray.create([0x00010203, 0x04050607, 0x08090a0b, 0x0c0d0e0f]);
            var salt = C.lib.WordArray.create([0x01234567, 0x89abcdef]);

            Y.Assert.areEqual(C.enc.Latin1.parse('Salted__').concat(salt).concat(ciphertext).toString(C.enc.Base64), C.format.OpenSSL.stringify(C.lib.Cipher.Params.create({ ciphertext: ciphertext, salt: salt })));
        },

        testUnsaltedToString: function () {
            var ciphertext = C.lib.WordArray.create([0x00010203, 0x04050607, 0x08090a0b, 0x0c0d0e0f]);

            Y.Assert.areEqual(ciphertext.toString(C.enc.Base64), C.format.OpenSSL.stringify(C.lib.Cipher.Params.create({ ciphertext: ciphertext })));
        },

        testSaltedFromString: function () {
            var ciphertext = C.lib.WordArray.create([0x00010203, 0x04050607, 0x08090a0b, 0x0c0d0e0f]);
            var salt = C.lib.WordArray.create([0x01234567, 0x89abcdef]);
            var openSslStr = C.format.OpenSSL.stringify(C.lib.Cipher.Params.create({ ciphertext: ciphertext, salt: salt }));

            var cipherParams = C.format.OpenSSL.parse(openSslStr);

            Y.Assert.areEqual(ciphertext.toString(), cipherParams.ciphertext);
            Y.Assert.areEqual(salt.toString(), cipherParams.salt);
        },

        testUnsaltedFromString: function () {
            var ciphertext = C.lib.WordArray.create([0x00010203, 0x04050607, 0x08090a0b, 0x0c0d0e0f]);
            var openSslStr = C.format.OpenSSL.stringify(C.lib.Cipher.Params.create({ ciphertext: ciphertext }));

            var cipherParams = C.format.OpenSSL.parse(openSslStr);

            Y.Assert.areEqual(ciphertext.toString(), cipherParams.ciphertext);
        }
    }));
}, '$Rev$');
