YUI.add('algo-rabbit-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'algo.Rabbit',

        testVector1: function () {
            var message = C.enc.Hex.fromString('00000000000000000000000000000000');
            var key = C.enc.Hex.fromString('00000000000000000000000000000000');
            var actual = C.algo.Rabbit.encrypt(message, key);

            Y.Assert.areEqual('02f74a1c26456bf5ecd6a536f05457b1', actual);
        },

        testVector2: function () {
            var message = C.enc.Hex.fromString('00000000000000000000000000000000');
            var key = C.enc.Hex.fromString('dc51c3ac3bfc62f12e3d36fe91281329');
            var actual = C.algo.Rabbit.encrypt(message, key);

            Y.Assert.areEqual('9c51e28784c37fe9a127f63ec8f32d3d', actual);
        },

        testVector3: function () {
            var message = C.enc.Hex.fromString('00000000000000000000000000000000');
            var key = C.enc.Hex.fromString('c09b0043e9e9ab0187e0c73383957415');
            var actual = C.algo.Rabbit.encrypt(message, key);

            Y.Assert.areEqual('9b60d002fd5ceb32accd41a0cd0db10c', actual);
        },

        testVector4: function () {
            var message = C.enc.Hex.fromString('00000000000000000000000000000000');
            var key = C.enc.Hex.fromString('00000000000000000000000000000000');
            var iv = C.enc.Hex.fromString('0000000000000000');
            var actual = C.algo.Rabbit.encrypt(message, key, { iv: iv });

            Y.Assert.areEqual('edb70567375dcd7cd89554f85e27a7c6', actual);
        },

        testVector5: function () {
            var message = C.enc.Hex.fromString('00000000000000000000000000000000');
            var key = C.enc.Hex.fromString('00000000000000000000000000000000');
            var iv = C.enc.Hex.fromString('597e26c175f573c3');
            var actual = C.algo.Rabbit.encrypt(message, key, { iv: iv });

            Y.Assert.areEqual('6d7d012292ccdce0e2120058b94ecd1f', actual);
        },

        testVector6: function () {
            var message = C.enc.Hex.fromString('00000000000000000000000000000000');
            var key = C.enc.Hex.fromString('00000000000000000000000000000000');
            var iv = C.enc.Hex.fromString('2717f4d21a56eba6');
            var actual = C.algo.Rabbit.encrypt(message, key, { iv: iv });

            Y.Assert.areEqual('4d1051a123afb670bf8d8505c8d85a44', actual);
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
            var expected = C.algo.PBE.encrypt(C.algo.Rabbit, message, password).toString();

            // Test
            Y.Assert.areEqual(expected, C.Rabbit.encrypt(message, password));

            // Restore random method
            C.lib.WordArray.random = random_;
        }
    }));
}, '$Rev$');
