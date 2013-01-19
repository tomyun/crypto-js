YUI.add('sha1-test', function (Y) {
    var SHA1 = CryptoJS.SHA1;

    Y.CryptoJSTestSuite.add(new Y.Test.Case({
        name: 'SHA1',

        _should: {
            ignore: {
                // This test will hash 768MB of data; it takes a while.
                // So it's disabled by default, but can be switched on at any time.
                testUpdateAndLongMessage: true
            }
        },

        testVector1: function () {
            Y.Assert.areEqual('da39a3ee5e6b4b0d3255bfef95601890afd80709', SHA1.hash('').toString());
        },

        testVector2: function () {
            Y.Assert.areEqual('86f7e437faa5a7fce15d1ddcb9eaeaea377667b8', SHA1.hash('a').toString());
        },

        testVector3: function () {
            Y.Assert.areEqual('a9993e364706816aba3e25717850c26c9cd0d89d', SHA1.hash('abc').toString());
        },

        testVector4: function () {
            Y.Assert.areEqual('c12252ceda8be8994d5fa0290a47231c1d16aae3', SHA1.hash('message digest').toString());
        },

        testVector5: function () {
            Y.Assert.areEqual(
                '32d10c7b8cf96570ca04ce37f2a19d84240d3a89',
                SHA1.hash('abcdefghijklmnopqrstuvwxyz').toString()
            );
        },

        testVector6: function () {
            Y.Assert.areEqual(
                '761c457bf73b14d27e9e9265c46f4b4dda11f940',
                SHA1.hash('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789').toString()
            );
        },

        testVector7: function () {
            Y.Assert.areEqual(
                '50abf5706a150990a08b2c5ea40fa0e585554732',
                SHA1.hash('12345678901234567890123456789012345678901234567890123456789012345678901234567890').toString()
            );
        },

        testUpdateAndLongMessage: function () {
            var sha1 = new SHA1();
            for (var i = 0; i < 768 * 1024 * 1024 / 32; i++) {
                sha1.update('\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0');
            }

            Y.Assert.areEqual('7eb74f7d1b09557cd990232f4ad84963eb6d0226', sha1.finalize().toString());
        },

        testClone: function () {
            var sha1 = new SHA1();

            Y.Assert.areEqual(SHA1.hash('a').toString(), sha1.update('a').clone().finalize().toString());
            Y.Assert.areEqual(SHA1.hash('ab').toString(), sha1.update('b').clone().finalize().toString());
            Y.Assert.areEqual(SHA1.hash('abc').toString(), sha1.update('c').clone().finalize().toString());
        },

        testInputIntegrity: function () {
            var message = new CryptoJS.lib.WordArray([0x12345678]);
            var expected = message.toString();
            SHA1.hash(message);

            Y.Assert.areEqual(expected, message.toString());
        }
    }));
}, '$Rev$');
