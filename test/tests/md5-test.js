YUI.add('md5-test', function (Y) {
    var MD5 = CryptoJS.MD5;

    Y.CryptoJSTestSuite.add(new Y.Test.Case({
        name: 'MD5',

        _should: {
            ignore: {
                // This test will hash 768MB of data; it takes a while.
                // So it's disabled by default, but can be switched on at any time.
                testUpdateAndLongMessage: true
            }
        },

        testVector1: function () {
            Y.Assert.areEqual('d41d8cd98f00b204e9800998ecf8427e', MD5.hash('').toString());
        },

        testVector2: function () {
            Y.Assert.areEqual('0cc175b9c0f1b6a831c399e269772661', MD5.hash('a').toString());
        },

        testVector3: function () {
            Y.Assert.areEqual('900150983cd24fb0d6963f7d28e17f72', MD5.hash('abc').toString());
        },

        testVector4: function () {
            Y.Assert.areEqual('f96b697d7cb7938d525a2f31aaf161d0', MD5.hash('message digest').toString());
        },

        testVector5: function () {
            Y.Assert.areEqual('c3fcd3d76192e4007dfb496cca67e13b', MD5.hash('abcdefghijklmnopqrstuvwxyz').toString());
        },

        testVector6: function () {
            Y.Assert.areEqual(
                'd174ab98d277d9f5a5611c2c9f419d9f',
                MD5.hash('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789').toString()
            );
        },

        testVector7: function () {
            Y.Assert.areEqual(
                '57edf4a22be3c955ac49da2e2107b67a',
                MD5.hash('12345678901234567890123456789012345678901234567890123456789012345678901234567890').toString()
            );
        },

        testUpdateAndLongMessage: function () {
            var md5 = new MD5();
            for (var i = 0; i < 768 * 1024 * 1024 / 32; i++) {
                md5.update('\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0');
            }

            Y.Assert.areEqual('72b74a1ecec4fd35ec0c7278202130a8', md5.finalize().toString());
        },

        testClone: function () {
            var md5 = new MD5();

            Y.Assert.areEqual(MD5.hash('a').toString(), md5.update('a').clone().finalize().toString());
            Y.Assert.areEqual(MD5.hash('ab').toString(), md5.update('b').clone().finalize().toString());
            Y.Assert.areEqual(MD5.hash('abc').toString(), md5.update('c').clone().finalize().toString());
        },

        testInputIntegrity: function () {
            var message = new CryptoJS.lib.WordArray([0x12345678]);
            var expected = message.toString();
            MD5.hash(message);

            Y.Assert.areEqual(expected, message.toString());
        }
    }));
}, '$Rev$');
