YUI.add('hmac-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'HMAC',

        testVector1: function () {
            var expected = '9294727a3638bb1c13f48ef8158bfc9d';

            var message = 'Hi There';
            var key = C.lib.WordArray.create([0x0b0b0b0b, 0x0b0b0b0b, 0x0b0b0b0b, 0x0b0b0b0b]);
            var actual = C.HMAC.compute(C.MD5, message, key);

            Y.Assert.areEqual(expected, actual);
        },

        testVector2: function () {
            var expected = '750c783e6ab0b503eaa86e310a5db738';

            var message = 'what do ya want for nothing?';
            var key = 'Jefe';
            var actual = C.HMAC.compute(C.MD5, message, key);

            Y.Assert.areEqual(expected, actual);
        },

        testVector3: function () {
            var expected = '56be34521d144c88dbb8c733f0e8b3f6';

            var message = C.lib.WordArray.create([0xdddddddd, 0xdddddddd, 0xdddddddd, 0xdddddddd, 0xdddddddd, 0xdddddddd, 0xdddddddd, 0xdddddddd, 0xdddddddd, 0xdddddddd, 0xdddddddd, 0xdddddddd, 0xdddd0000], 50);
            var key = C.lib.WordArray.create([0xaaaaaaaa, 0xaaaaaaaa, 0xaaaaaaaa, 0xaaaaaaaa]);
            var actual = C.HMAC.compute(C.MD5, message, key);

            Y.Assert.areEqual(expected, actual);
        },

        testUpdate: function () {
            var key = C.lib.WordArray.create([0xaaaaaaaa, 0xaaaaaaaa, 0xaaaaaaaa, 0xaaaaaaaa]);

            var message = C.lib.WordArray.create([0xdddddddd, 0xdddddddd, 0xdddddddd, 0xdddddddd, 0xdddddddd, 0xdddddddd, 0xdddddddd, 0xdddddddd, 0xdddddddd, 0xdddddddd, 0xdddddddd, 0xdddddddd, 0xdddd0000], 50);
            var expected = C.HMAC.compute(C.MD5, message, key).toString();

            var messagePart1 = C.lib.WordArray.create([0xdddddddd, 0xdddddddd, 0xdddddddd, 0xdddddddd, 0xdddddddd, 0xdddddddd]);
            var messagePart2 = C.lib.WordArray.create([0xdddddddd, 0xdddddddd, 0xdddddddd, 0xdddd0000], 14);
            var messagePart3 = C.lib.WordArray.create([0xdddddddd, 0xdddddddd, 0xdddddddd]);
            var hmac = C.HMAC.create(C.MD5, key);
            hmac.update(messagePart1);
            hmac.update(messagePart2);
            var actual = hmac.compute(messagePart3);

            Y.Assert.areEqual(expected, actual);
        },

        testInputIntegrity: function () {
            var message = C.lib.WordArray.create([0x48656c6c, 0x6f2c2057, 0x6f726c64, 0x21000000], 13);
            var key = C.lib.WordArray.create([0x48656c6c, 0x6f2c2057, 0x6f726c64, 0x21000000], 13);

            var expectedMessage = message.toString();
            var expectedKey = key.toString();

            C.HMAC.compute(C.MD5, message, key);

            Y.Assert.areEqual(expectedMessage, message);
            Y.Assert.areEqual(expectedKey, key);
        }
    }));
}, '$Rev$');
