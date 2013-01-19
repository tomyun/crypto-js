YUI.add('sha256-test', function (Y) {
    var SHA256 = CryptoJS.SHA256;

    Y.CryptoJSTestSuite.add(new Y.Test.Case({
        name: 'SHA256',

        _should: {
            ignore: {
                // This test will hash 768MB of data; it takes a while.
                // So it's disabled by default, but can be switched on at any time.
                testUpdateAndLongMessage: true
            }
        },

        testVector1: function () {
            Y.Assert.areEqual(
                'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
                SHA256.hash('').toString()
            );
        },

        testVector2: function () {
            Y.Assert.areEqual(
                'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
                SHA256.hash('a').toString()
            );
        },

        testVector3: function () {
            Y.Assert.areEqual(
                'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
                SHA256.hash('abc').toString()
            );
        },

        testVector4: function () {
            Y.Assert.areEqual(
                'f7846f55cf23e14eebeab5b4e1550cad5b509e3348fbc4efa3a1413d393cb650',
                SHA256.hash('message digest').toString()
            );
        },

        testVector5: function () {
            Y.Assert.areEqual(
                '71c480df93d6ae2f1efad1447c66c9525e316218cf51fc8d9ed832f2daf18b73',
                SHA256.hash('abcdefghijklmnopqrstuvwxyz').toString()
            );
        },

        testVector6: function () {
            Y.Assert.areEqual(
                'db4bfcbd4da0cd85a60c3c37d3fbd8805c77f15fc6b1fdfe614ee0a7c8fdb4c0',
                SHA256.hash('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789').toString()
            );
        },

        testVector7: function () {
            Y.Assert.areEqual(
                'f371bc4a311f2b009eef952dd83ca80e2b60026c8e935592d0f9c308453c813e',
                SHA256.hash(
                    '12345678901234567890123456789012345678901234567890123456789012345678901234567890'
                ).toString()
            );
        },

        testUpdateAndLongMessage: function () {
            var sha256 = new SHA256();
            for (var i = 0; i < 768 * 1024 * 1024 / 32; i++) {
                sha256.update('\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0');
            }

            Y.Assert.areEqual(
                'd8492a624b5ded59e8a2185b0755f195a58642456e8387ba2817e46f1e05b358',
                sha256.finalize().toString()
            );
        },

        testClone: function () {
            var sha256 = new SHA256();

            Y.Assert.areEqual(SHA256.hash('a').toString(), sha256.update('a').clone().finalize().toString());
            Y.Assert.areEqual(SHA256.hash('ab').toString(), sha256.update('b').clone().finalize().toString());
            Y.Assert.areEqual(SHA256.hash('abc').toString(), sha256.update('c').clone().finalize().toString());
        },

        testInputIntegrity: function () {
            var message = new CryptoJS.lib.WordArray([0x12345678]);
            var expected = message.toString();
            SHA256.hash(message);

            Y.Assert.areEqual(expected, message.toString());
        }
    }));
}, '$Rev$');
