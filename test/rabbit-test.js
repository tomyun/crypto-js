YUI.add('rabbit-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Rabbit',

        testVector1: function () {
            var message = C.enc.Hex.fromString('00000000000000000000000000000000');
            var key = C.enc.Hex.fromString('00000000000000000000000000000000');
            var actual = C.Rabbit.encrypt(message, key).rawCiphertext;

            Y.Assert.areEqual('02f74a1c26456bf5ecd6a536f05457b1', actual);
        },

        testVector2: function () {
            var message = C.enc.Hex.fromString('00000000000000000000000000000000');
            var key = C.enc.Hex.fromString('dc51c3ac3bfc62f12e3d36fe91281329');
            var actual = C.Rabbit.encrypt(message, key).rawCiphertext;

            Y.Assert.areEqual('9c51e28784c37fe9a127f63ec8f32d3d', actual);
        },

        testVector3: function () {
            var message = C.enc.Hex.fromString('00000000000000000000000000000000');
            var key = C.enc.Hex.fromString('c09b0043e9e9ab0187e0c73383957415');
            var actual = C.Rabbit.encrypt(message, key).rawCiphertext;

            Y.Assert.areEqual('9b60d002fd5ceb32accd41a0cd0db10c', actual);
        },

        testVector4: function () {
            var message = C.enc.Hex.fromString('00000000000000000000000000000000');
            var key = C.enc.Hex.fromString('00000000000000000000000000000000');
            var iv = C.enc.Hex.fromString('0000000000000000');
            var actual = C.Rabbit.encrypt(message, key, { iv: iv }).rawCiphertext;

            Y.Assert.areEqual('edb70567375dcd7cd89554f85e27a7c6', actual);
        },

        testVector5: function () {
            var message = C.enc.Hex.fromString('00000000000000000000000000000000');
            var key = C.enc.Hex.fromString('00000000000000000000000000000000');
            var iv = C.enc.Hex.fromString('597e26c175f573c3');
            var actual = C.Rabbit.encrypt(message, key, { iv: iv }).rawCiphertext;

            Y.Assert.areEqual('6d7d012292ccdce0e2120058b94ecd1f', actual);
        },

        testVector6: function () {
            var message = C.enc.Hex.fromString('00000000000000000000000000000000');
            var key = C.enc.Hex.fromString('00000000000000000000000000000000');
            var iv = C.enc.Hex.fromString('2717f4d21a56eba6');
            var actual = C.Rabbit.encrypt(message, key, { iv: iv }).rawCiphertext;

            Y.Assert.areEqual('4d1051a123afb670bf8d8505c8d85a44', actual);
        }
    }));
}, '$Rev$');
