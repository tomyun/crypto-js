YUI.add('algo-blake256-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'BLAKE256',

        testVector8: function () {
            Y.Assert.areEqual('0ce8d4ef4dd7cd8d62dfded9d4edb0a774ae6a41929a74da23109e8f11139c87', C.BLAKE256('\0'));
        },

        testVector512: function () {
            Y.Assert.areEqual(
                '6d994042954f8dc5633626cd50b2bc66d733a313d67fd9702c5a8149a8028c98',
                C.BLAKE256('\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0')
            );
        },

        testVector576: function () {
            Y.Assert.areEqual(
                'd419bad32d504fb7d44d460c42c5593fe544fa4c135dec31e21bd9abdcc22d41',
                C.BLAKE256('\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0')
            );
        },

        testVector576Salted: function () {
            Y.Assert.areEqual(
                'e7731f40029e24d8fca93aca9ff30860efa80d25753ef4ca8a372a44798fc053',
                C.BLAKE256(
                    '\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0',
                    { salt: C.enc.Hex.fromString('000102030405060708090a0b0c0d0e0f') }
                )
            );
        },

        testUpdateAndLongMessage: function () {
            var blake256 = C.algo.BLAKE256.create();
            for (var i = 0; i < 100; i++) {
                blake256.update('12345678901234567890123456789012345678901234567890');
            }
            var actual = blake256.compute();

            Y.Assert.areEqual('092e0edd979ec15698e4e45321193eeeb3f046389e22e7e4cd451d972f24656a', actual);
        },

        testHelper: function () {
            Y.Assert.areEqual(C.algo.BLAKE256.create().compute('').toString(), C.BLAKE256(''));
        },

        testHmacHelper: function () {
            var key = C.enc.Hex.fromString('0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b');
            var message = 'Hi There';

            var expected = C.algo.HMAC.create(C.algo.BLAKE256, key).compute(message).toString();

            Y.Assert.areEqual(expected, C.HMAC_BLAKE256(message, key));
        }
    }));
}, '$Rev$');
