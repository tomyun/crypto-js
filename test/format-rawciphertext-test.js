YUI.add('format-rawciphertext-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'format.RawCiphertext',
        
        testToStringPassedEncoder: function () {
            var cipherParams = C.lib.CipherParams.create({
                rawCiphertext: C.lib.WordArray.create([0x48656c6c, 0x6f2c2057, 0x6f726c64, 0x21000000], 13)
            });

            Y.Assert.areEqual('Hello, World!', C.format.RawCiphertext.toString(cipherParams, C.enc.Latin1));
        },

        testToStringDefaultEncoder: function () {
            var cipherParams = C.lib.CipherParams.create({
                rawCiphertext: C.lib.WordArray.create([0x48656c6c, 0x6f2c2057, 0x6f726c64, 0x21000000], 13)
            });

            Y.Assert.areEqual('48656c6c6f2c20576f726c6421', C.format.RawCiphertext.toString(cipherParams));
        },
        
        testFromStringPassedEncoder: function () {
            var actual = C.format.RawCiphertext.fromString('Hello, World!', C.enc.Latin1).rawCiphertext;
        
            Y.Assert.areEqual('48656c6c6f2c20576f726c6421', actual);
        },
        
        testFromStringDefaultEncoder: function () {
            var actual = C.format.RawCiphertext.fromString('48656c6c6f2c20576f726c6421').rawCiphertext;
        
            Y.Assert.areEqual('48656c6c6f2c20576f726c6421', actual);
        }
    }));
}, '$Rev$');
