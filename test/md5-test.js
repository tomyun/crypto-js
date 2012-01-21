YUI.add('algo-md5-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'algo.MD5',

        testVector1: function () {
            Y.Assert.areEqual('d41d8cd98f00b204e9800998ecf8427e', C.MD5(''));
        },

        testVector2: function () {
            Y.Assert.areEqual('0cc175b9c0f1b6a831c399e269772661', C.MD5('a'));
        },

        testVector3: function () {
            Y.Assert.areEqual('900150983cd24fb0d6963f7d28e17f72', C.MD5('abc'));
        },

        testVector4: function () {
            Y.Assert.areEqual('f96b697d7cb7938d525a2f31aaf161d0', C.MD5('message digest'));
        },

        testVector5: function () {
            Y.Assert.areEqual('c3fcd3d76192e4007dfb496cca67e13b', C.MD5('abcdefghijklmnopqrstuvwxyz'));
        },

        testVector6: function () {
            var actual = C.MD5('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');

            Y.Assert.areEqual('d174ab98d277d9f5a5611c2c9f419d9f', actual);
        },

        testVector7: function () {
            var actual = C.MD5('12345678901234567890123456789012345678901234567890123456789012345678901234567890');

            Y.Assert.areEqual('57edf4a22be3c955ac49da2e2107b67a', actual);
        },

        testLongMessage: function () {
            var md5 = C.algo.MD5.create();
            for (var i = 0; i < 100; i++) {
                md5.update('12345678901234567890123456789012345678901234567890');
            }
            var actual = md5.compute();

            Y.Assert.areEqual('7d017545e0268a6a12f2b507871d0429', actual);
        },

        testHelper: function () {
            Y.Assert.areEqual(C.algo.MD5.create().compute('').toString(), C.MD5(''));
        },

        testHmacHelper: function () {
            var key = C.enc.Hex.fromString('0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b');
            var message = 'Hi There';

            var expected = C.algo.HMAC.create(C.algo.MD5, key).compute(message).toString();

            Y.Assert.areEqual(expected, C.HMAC_MD5(message, key));
        }
    }));
}, '$Rev$');
