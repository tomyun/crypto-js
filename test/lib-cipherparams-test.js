YUI.add('lib-cipherparams-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'lib.CipherParams',

        setUp: function () {
            this.data = {};

            this.data.rawCiphertext = C.lib.WordArray.create([0x48656c6c, 0x6f2c2057, 0x6f726c64, 0x21000000], 13);
            this.data.key = C.lib.WordArray.create([0x48656c6c, 0x6f2c2057, 0x6f726c64, 0x21000000], 13);
            this.data.iv = C.lib.WordArray.create([0x48656c6c, 0x6f2c2057, 0x6f726c64, 0x21000000], 13);
            this.data.salt = C.lib.WordArray.create([0x48656c6c, 0x6f2c2057, 0x6f726c64, 0x21000000], 13);

            this.data.cipherParams = C.lib.CipherParams.create({
                rawCiphertext: this.data.rawCiphertext,
                key: this.data.key,
                iv: this.data.iv,
                salt: this.data.salt,
                formatter: C.format.RawCiphertext
            });
        },

        testInit: function () {
            Y.Assert.areEqual(this.data.rawCiphertext, this.data.cipherParams.rawCiphertext);
            Y.Assert.areEqual(this.data.key, this.data.cipherParams.key);
            Y.Assert.areEqual(this.data.iv, this.data.cipherParams.iv);
            Y.Assert.areEqual(this.data.salt, this.data.cipherParams.salt);
        },

        testToString0: function () {
            Y.Assert.areEqual(this.data.rawCiphertext.toString(), this.data.cipherParams.toString());
        },

        testToString1Parameter: function () {
            Y.Assert.areEqual(
                this.data.rawCiphertext.toString(C.enc.Base64),
                this.data.cipherParams.toString(C.enc.Base64)
            );
        },

        testToString1Formatter: function () {
            Y.Assert.areEqual(
                C.format.OpenSSL.toString(this.data.cipherParams),
                this.data.cipherParams.toString(C.format.OpenSSL)
            );
        },

        testToString2: function () {
            Y.Assert.areEqual(
                this.data.rawCiphertext.toString(C.enc.Base64),
                this.data.cipherParams.toString(C.format.RawCiphertext, C.enc.Base64)
            );
        }
    }));
}, '$Rev$');
