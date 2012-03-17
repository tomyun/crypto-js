YUI.add('lib-cipherparams-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Cipher.Params',

        setUp: function () {
            this.data = {};

            this.data.ciphertext = C.enc.Hex.parse('69c4e0d86a7b0430d8cdb78070b4c55a');
            this.data.key = C.enc.Hex.parse('00112233445566778899aabbccddeeff');
            this.data.iv = C.enc.Hex.parse('000102030405060708090a0b0c0d0e0f');
            this.data.salt = C.enc.Hex.parse('1011121314151617');
            this.data.algorithm = C.algo.AES;
            this.data.mode = C.mode.CBC;
            this.data.padding = C.pad.PKCS7;
            this.data.blockSize = this.data.algorithm._blockSize;
            this.data.formatter = C.format.OpenSSL;

            this.data.cipherParams = C.lib.Cipher.Params.create({
                ciphertext: this.data.ciphertext,
                key: this.data.key,
                iv: this.data.iv,
                salt: this.data.salt,
                algorithm: this.data.algorithm,
                mode: this.data.mode,
                padding: this.data.padding,
                blockSize: this.data.blockSize,
                formatter: this.data.formatter
            });
        },

        testInit: function () {
            Y.Assert.areEqual(this.data.ciphertext, this.data.cipherParams.ciphertext);
            Y.Assert.areEqual(this.data.key, this.data.cipherParams.key);
            Y.Assert.areEqual(this.data.iv, this.data.cipherParams.iv);
            Y.Assert.areEqual(this.data.salt, this.data.cipherParams.salt);
            Y.Assert.areEqual(this.data.algorithm, this.data.cipherParams.algorithm);
            Y.Assert.areEqual(this.data.mode, this.data.cipherParams.mode);
            Y.Assert.areEqual(this.data.padding, this.data.cipherParams.padding);
            Y.Assert.areEqual(this.data.blockSize, this.data.cipherParams.blockSize);
            Y.Assert.areEqual(this.data.formatter, this.data.cipherParams.formatter);
        },

        testToString0: function () {
            Y.Assert.areEqual(C.format.OpenSSL.stringify(this.data.cipherParams), this.data.cipherParams.toString());
        },

        testToString1: function () {
            var JsonFormatter = {
                stringify: function (cipherParams) {
                    return '{ ct: ' + cipherParams.ciphertext + ', iv: ' + cipherParams.iv + ' }';
                }
            };

            Y.Assert.areEqual(JsonFormatter.stringify(this.data.cipherParams), this.data.cipherParams.toString(JsonFormatter));
        }
    }));
}, '$Rev$');
