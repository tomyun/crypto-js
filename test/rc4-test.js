YUI.add('algo-rc4-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'algo.RC4',

        testVector1: function () {
            var message = C.enc.Hex.fromString('0000000000000000');
            var key = C.enc.Hex.fromString('0123456789abcdef');
            var actual = C.RC4.encrypt(message, key, { drop: 0 });

            Y.Assert.areEqual('7494c2e7104b0879', actual);
        },

        testVector2: function () {
            var message = C.enc.Hex.fromString('dcee4cf92c');
            var key = C.enc.Hex.fromString('618a63d2fb');
            var actual = C.RC4.encrypt(message, key, { drop: 0 });

            Y.Assert.areEqual('f13829c9de', actual);
        },

        testDrop: function () {
            var key = C.enc.Hex.fromString('0123456789abcdef');

            var message = C.enc.Hex.fromString('00000000000000000000000000000000');
            var ciphertext = C.RC4.encrypt(message, key, { drop: 0 });
            var expected = ciphertext.toString().substr(16);

            var message = C.enc.Hex.fromString('0000000000000000');
            var actual = C.RC4.encrypt(message, key, { drop: 2 });

            Y.Assert.areEqual(expected, actual);
        },

        testHelper: function () {
            // Save original random method
            var random_ = C.lib.WordArray.random;

            // Replace random method with one that returns a predictable value
            C.lib.WordArray.random = function (nBytes) {
                var words = [];
                for (var i = 0; i < nBytes; i += 4) {
                    words.push([0x11223344]);
                }

                return this.create(words, nBytes);
            };

            // Expected
            var message = 'Hi There';
            var password = 'Jefe';
            var expected = C.algo.PBE.encrypt(C.algo.RC4, message, password).toString();

            // Test
            Y.Assert.areEqual(expected, C.RC4.encrypt(message, password));

            // Restore random method
            C.lib.WordArray.random = random_;
        }
    }));
}, '$Rev$');
