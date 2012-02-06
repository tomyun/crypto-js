YUI.add('format-rawciphertext-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'RawCiphertext',

        testToStringPassedEncoder: function () {
            var cipherParams = C.lib.CipherParams.create({
                rawCiphertext: C.lib.WordArray.create([0x12345678])
            });

            Y.Assert.areEqual('\x12\x34\x56\x78', C.format.RawCiphertext.toString(cipherParams, C.enc.Latin1));
        },

        testToStringDefaultEncoder: function () {
            var cipherParams = C.lib.CipherParams.create({
                rawCiphertext: C.lib.WordArray.create([0x12345678])
            });

            Y.Assert.areEqual('12345678', C.format.RawCiphertext.toString(cipherParams));
        },

        testFromStringPassedEncoder: function () {
            var cipherParams = C.format.RawCiphertext.fromString('\x12\x34\x56\x78', C.enc.Latin1);

            Y.Assert.areEqual('12345678', cipherParams.rawCiphertext);
        },

        testFromStringDefaultEncoder: function () {
            var cipherParams = C.format.RawCiphertext.fromString('12345678');

            Y.Assert.areEqual('12345678', cipherParams.rawCiphertext);
        }
    }));
}, '$Rev$');
