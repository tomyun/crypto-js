YUI.add('evpkdf-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'EvpKDF',

        testVector: function () {
            var expected = 'fdbdf3419fff98bdb0241390f62a9db35f4aba29d77566377997314ebfc709f20b5ca7b1081f94b1ac12e3c8ba87d05a';

            var password = 'password';
            var salt = 'saltsalt';
            var cfg = { keySize: (256+128)/32 };
            var actual = C.EvpKDF.compute(password, salt, cfg);

            Y.Assert.areEqual(expected, actual);
        },

        // There are no official test vectors that I could find, and the EVP implementation is short on comments.
        // Someone should use the C code to generate more test vectors.
        // The iteration count in particular needs to be tested.

        testInputIntegrity: function () {
            var password = C.lib.WordArray.create([0x48656c6c, 0x6f2c2057, 0x6f726c64, 0x21000000], 13);
            var salt = C.lib.WordArray.create([0x48656c6c, 0x6f2c2057, 0x6f726c64, 0x21000000], 13);

            var expectedPassword = password.toString();
            var expectedSalt = salt.toString();

            C.EvpKDF.compute(password, salt);

            Y.Assert.areEqual(expectedPassword, password);
            Y.Assert.areEqual(expectedSalt, salt);
        }
    }));
}, '$Rev$');
