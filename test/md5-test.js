YUI.add('md5-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'MD5',

        testVector1: function () {
            var expected = 'd41d8cd98f00b204e9800998ecf8427e';

            var message = '';
            var actual = C.MD5.compute(message);

            Y.Assert.areEqual(expected, actual);
        },

        testVector2: function () {
            var expected = '0cc175b9c0f1b6a831c399e269772661';

            var message = 'a';
            var actual = C.MD5.compute(message);

            Y.Assert.areEqual(expected, actual);
        },

        testVector3: function () {
            var expected = '900150983cd24fb0d6963f7d28e17f72';

            var message = 'abc';
            var actual = C.MD5.compute(message);

            Y.Assert.areEqual(expected, actual);
        },

        testVector4: function () {
            var expected = 'f96b697d7cb7938d525a2f31aaf161d0';

            var message = 'message digest';
            var actual = C.MD5.compute(message);

            Y.Assert.areEqual(expected, actual);
        },

        testVector5: function () {
            var expected = 'c3fcd3d76192e4007dfb496cca67e13b';

            var message = 'abcdefghijklmnopqrstuvwxyz';
            var actual = C.MD5.compute(message);

            Y.Assert.areEqual(expected, actual);
        },

        testVector6: function () {
            var expected = 'd174ab98d277d9f5a5611c2c9f419d9f';

            var message = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var actual = C.MD5.compute(message);

            Y.Assert.areEqual(expected, actual);
        },

        testVector7: function () {
            var expected = '57edf4a22be3c955ac49da2e2107b67a';

            var message = '12345678901234567890123456789012345678901234567890123456789012345678901234567890';
            var actual = C.MD5.compute(message);

            Y.Assert.areEqual(expected, actual);
        },

        testLongMessage: function () {
            var expected = '7d017545e0268a6a12f2b507871d0429';

            var md5 = C.MD5.create();
            for (var i = 0; i < 100; i++) {
                md5.update('12345678901234567890123456789012345678901234567890');
            }
            var actual = md5.compute();

            Y.Assert.areEqual(expected, actual);
        }
    }));
}, '$Rev$');
