YUI.add('pbkdf2-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'PBKDF2',

        testVectorKeySize128: function () {
            var expected = 'cdedb5281bb2f801565a1122b2563515';

            var password = 'password';
            var salt = 'ATHENA.MIT.EDUraeburn';
            var cfg = { keySize: 128/32 };
            var actual = C.PBKDF2.compute(password, salt, cfg);

            Y.Assert.areEqual(expected, actual);
        },

        testVectorKeySize256: function () {
            var expected = 'cdedb5281bb2f801565a1122b25635150ad1f7a04bb9f3a333ecc0e2e1f70837';

            var password = 'password';
            var salt = 'ATHENA.MIT.EDUraeburn';
            var cfg = { keySize: 256/32 };
            var actual = C.PBKDF2.compute(password, salt, cfg);

            Y.Assert.areEqual(expected, actual);
        },

        testVectorKeySize128Iterations2: function () {
            var expected = '01dbee7f4a9e243e988b62c73cda935d';

            var password = 'password';
            var salt = 'ATHENA.MIT.EDUraeburn';
            var cfg = { keySize: 128/32, iterations: 2 };
            var actual = C.PBKDF2.compute(password, salt, cfg);

            Y.Assert.areEqual(expected, actual);
        },

        testVectorKeySize256Iterations2: function () {
            var expected = '01dbee7f4a9e243e988b62c73cda935da05378b93244ec8f48a99e61ad799d86';

            var password = 'password';
            var salt = 'ATHENA.MIT.EDUraeburn';
            var cfg = { keySize: 256/32, iterations: 2 };
            var actual = C.PBKDF2.compute(password, salt, cfg);

            Y.Assert.areEqual(expected, actual);
        },

        testVectorKeySize128Iterations1200: function () {
            var expected = '5c08eb61fdf71e4e4ec3cf6ba1f5512b';

            var password = 'password';
            var salt = 'ATHENA.MIT.EDUraeburn';
            var cfg = { keySize: 128/32, iterations: 1200 };
            var actual = C.PBKDF2.compute(password, salt, cfg);

            Y.Assert.areEqual(expected, actual);
        },

        testVectorKeySize256Iterations1200: function () {
            var expected = '5c08eb61fdf71e4e4ec3cf6ba1f5512ba7e52ddbc5e5142f708a31e2e62b1e13';

            var password = 'password';
            var salt = 'ATHENA.MIT.EDUraeburn';
            var cfg = { keySize: 256/32, iterations: 1200 };
            var actual = C.PBKDF2.compute(password, salt, cfg);

            Y.Assert.areEqual(expected, actual);
        },

        testVectorKeySize128Iterations5: function () {
            var expected = 'd1daa78615f287e6a1c8b120d7062a49';

            var password = 'password';
            var salt = C.lib.WordArray.create([0x12345678, 0x78563412]);
            var cfg = { keySize: 128/32, iterations: 5 };
            var actual = C.PBKDF2.compute(password, salt, cfg);

            Y.Assert.areEqual(expected, actual);
        },

        testVectorKeySize256Iterations5: function () {
            var expected = 'd1daa78615f287e6a1c8b120d7062a493f98d203e6be49a6adf4fa574b6e64ee';

            var password = 'password';
            var salt = C.lib.WordArray.create([0x12345678, 0x78563412]);
            var cfg = { keySize: 256/32, iterations: 5 };
            var actual = C.PBKDF2.compute(password, salt, cfg);

            Y.Assert.areEqual(expected, actual);
        },

        testVectorKeySize128Iterations1200PassPhraseEqualsBlockSize: function () {
            var expected = '139c30c0966bc32ba55fdbf212530ac9';

            var password = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
            var salt = 'pass phrase equals block size';
            var cfg = { keySize: 128/32, iterations: 1200 };
            var actual = C.PBKDF2.compute(password, salt, cfg);

            Y.Assert.areEqual(expected, actual);
        },

        testVectorKeySize256Iterations1200PassPhraseEqualsBlockSize: function () {
            var expected = '139c30c0966bc32ba55fdbf212530ac9c5ec59f1a452f5cc9ad940fea0598ed1';

            var password = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
            var salt = 'pass phrase equals block size';
            var cfg = { keySize: 256/32, iterations: 1200 };
            var actual = C.PBKDF2.compute(password, salt, cfg);

            Y.Assert.areEqual(expected, actual);
        },

        testVectorKeySize128Iterations1200PassPhraseExceedsBlockSize: function () {
            var expected = '9ccad6d468770cd51b10e6a68721be61';

            var password = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
            var salt = 'pass phrase exceeds block size';
            var cfg = { keySize: 128/32, iterations: 1200 };
            var actual = C.PBKDF2.compute(password, salt, cfg);

            Y.Assert.areEqual(expected, actual);
        },

        testVectorKeySize256Iterations1200PassPhraseExceedsBlockSize: function () {
            var expected = '9ccad6d468770cd51b10e6a68721be611a8b4d282601db3b36be9246915ec82a';

            var password = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
            var salt = 'pass phrase exceeds block size';
            var cfg = { keySize: 256/32, iterations: 1200 };
            var actual = C.PBKDF2.compute(password, salt, cfg);

            Y.Assert.areEqual(expected, actual);
        },

        testVectorKeySize128Iterations50: function () {
            var expected = '6b9cf26d45455a43a5b8bb276a403b39';

            var password = C.lib.WordArray.create([0xf09d849e]);
            var salt = 'EXAMPLE.COMpianist';
            var cfg = { keySize: 128/32, iterations: 50 };
            var actual = C.PBKDF2.compute(password, salt, cfg);

            Y.Assert.areEqual(expected, actual);
        },

        testVectorKeySize256Iterations50: function () {
            var expected = '6b9cf26d45455a43a5b8bb276a403b39e7fe37a0c41e02c281ff3069e1e94f52';

            var password = C.lib.WordArray.create([0xf09d849e]);
            var salt = 'EXAMPLE.COMpianist';
            var cfg = { keySize: 256/32, iterations: 50 };
            var actual = C.PBKDF2.compute(password, salt, cfg);

            Y.Assert.areEqual(expected, actual);
        },

        testInputIntegrity: function () {
            var password = C.lib.WordArray.create([0x48656c6c, 0x6f2c2057, 0x6f726c64, 0x21000000], 13);
            var salt = C.lib.WordArray.create([0x48656c6c, 0x6f2c2057, 0x6f726c64, 0x21000000], 13);

            var expectedPassword = password.toString();
            var expectedSalt = salt.toString();

            C.PBKDF2.compute(password, salt);

            Y.Assert.areEqual(expectedPassword, password);
            Y.Assert.areEqual(expectedSalt, salt);
        }
    }));
}, '$Rev$');
