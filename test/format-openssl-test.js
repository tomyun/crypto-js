YUI.add('format-openssl-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'format.OpenSSL',

        testSaltedToString: function () {
            var rawCiphertext = C.lib.WordArray.create([0x01234567, 0x89abcdef, 0xfedcba98, 0x76543210]);
            var salt = C.lib.WordArray.create([0xfedcba98, 0x76543210]);

            var prefix = C.enc.Latin1.fromString('Salted__');
            var expected = prefix.concat(salt).concat(rawCiphertext).toString(C.enc.Base64);

            var cipherParams = C.lib.CipherParams.create({ rawCiphertext: rawCiphertext, salt: salt });
            var actual = C.format.OpenSSL.toString(cipherParams);

            Y.Assert.areEqual(expected, actual);
        },

        testUnsaltedToString: function () {
            var rawCiphertext = C.lib.WordArray.create([0x01234567, 0x89abcdef, 0xfedcba98, 0x76543210]);

            var expected = rawCiphertext.toString(C.enc.Base64);

            var cipherParams = C.lib.CipherParams.create({ rawCiphertext: rawCiphertext });
            var actual = C.format.OpenSSL.toString(cipherParams);

            Y.Assert.areEqual(expected, actual);
        },

        testSaltedFromString: function () {
            var rawCiphertext = C.lib.WordArray.create([0x01234567, 0x89abcdef, 0xfedcba98, 0x76543210]);
            var salt = C.lib.WordArray.create([0xfedcba98, 0x76543210]);
            var cipherParams = C.lib.CipherParams.create({ rawCiphertext: rawCiphertext, salt: salt });
            var formatted = C.format.OpenSSL.toString(cipherParams);

            var actual = C.format.OpenSSL.fromString(formatted);

            Y.Assert.areEqual(rawCiphertext.toString(), actual.rawCiphertext);
            Y.Assert.areEqual(salt.toString(), actual.salt);
        },

        testUnsaltedFromString: function () {
            var rawCiphertext = C.lib.WordArray.create([0x01234567, 0x89abcdef, 0xfedcba98, 0x76543210]);
            var cipherParams = C.lib.CipherParams.create({ rawCiphertext: rawCiphertext });
            var formatted = C.format.OpenSSL.toString(cipherParams);

            var actual = C.format.OpenSSL.fromString(formatted);

            Y.Assert.areEqual(rawCiphertext.toString(), actual.rawCiphertext);
        }
    }));
}, '$Rev$');
