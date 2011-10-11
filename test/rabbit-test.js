YUI.add('rabbit-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Rabbit',

        testVector1: function () {
            var expected = '02f74a1c26456bf5ecd6a536f05457b1';

            var message = C.lib.WordArray.create([0x00000000, 0x00000000, 0x00000000, 0x00000000]);
            var key = C.lib.WordArray.create([0x00000000, 0x00000000, 0x00000000, 0x00000000]);
            var actual = C.Rabbit.encrypt(message, key).rawCiphertext;

            Y.Assert.areEqual(expected, actual);
        },

        testVector2: function () {
            var expected = '9c51e28784c37fe9a127f63ec8f32d3d';

            var message = C.lib.WordArray.create([0x00000000, 0x00000000, 0x00000000, 0x00000000]);
            var key = C.lib.WordArray.create([0xdc51c3ac, 0x3bfc62f1, 0x2e3d36fe, 0x91281329]);
            var actual = C.Rabbit.encrypt(message, key).rawCiphertext;

            Y.Assert.areEqual(expected, actual);
        },

        testVector3: function () {
            var expected = '9b60d002fd5ceb32accd41a0cd0db10c';

            var message = C.lib.WordArray.create([0x00000000, 0x00000000, 0x00000000, 0x00000000]);
            var key = C.lib.WordArray.create([0xc09b0043, 0xe9e9ab01, 0x87e0c733, 0x83957415]);
            var actual = C.Rabbit.encrypt(message, key).rawCiphertext;

            Y.Assert.areEqual(expected, actual);
        },

        testVector4: function () {
            var expected = 'edb70567375dcd7cd89554f85e27a7c6';

            var message = C.lib.WordArray.create([0x00000000, 0x00000000, 0x00000000, 0x00000000]);
            var key = C.lib.WordArray.create([0x00000000, 0x00000000, 0x00000000, 0x00000000]);
            var iv = C.lib.WordArray.create([0x00000000, 0x00000000]);
            var actual = C.Rabbit.encrypt(message, key, { iv: iv }).rawCiphertext;

            Y.Assert.areEqual(expected, actual);
        },

        testVector5: function () {
            var expected = '6d7d012292ccdce0e2120058b94ecd1f';

            var message = C.lib.WordArray.create([0x00000000, 0x00000000, 0x00000000, 0x00000000]);
            var key = C.lib.WordArray.create([0x00000000, 0x00000000, 0x00000000, 0x00000000]);
            var iv = C.lib.WordArray.create([0x597e26c1, 0x75f573c3]);
            var actual = C.Rabbit.encrypt(message, key, { iv: iv }).rawCiphertext;

            Y.Assert.areEqual(expected, actual);
        },

        testVector6: function () {
            var expected = '4d1051a123afb670bf8d8505c8d85a44';

            var message = C.lib.WordArray.create([0x00000000, 0x00000000, 0x00000000, 0x00000000]);
            var key = C.lib.WordArray.create([0x00000000, 0x00000000, 0x00000000, 0x00000000]);
            var iv = C.lib.WordArray.create([0x2717f4d2, 0x1a56eba6]);
            var actual = C.Rabbit.encrypt(message, key, { iv: iv }).rawCiphertext;

            Y.Assert.areEqual(expected, actual);
        }
    }));
});
