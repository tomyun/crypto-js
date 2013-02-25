YUI.add('lib-wordarray-benchmark', function (Y) {
    Y.CryptoJSTestSuite.add(new Y.Test.Case({
        name: 'WordArray',

        testConcatBenchmark: function () {
            var suite = new Benchmark.Suite();

            suite.add('CryptoJS 4', (function () {
                var wordArray3 = new CryptoJS.lib.WordArray([0x12345678], 3);
                var wordArray4 = new CryptoJS.lib.WordArray([0x12345678], 4);
                var wordArray5 = new CryptoJS.lib.WordArray([0x12345678], 5);

                return function () {
                    (new CryptoJS.lib.WordArray()).concat(wordArray3).concat(wordArray3);
                    (new CryptoJS.lib.WordArray()).concat(wordArray4).concat(wordArray3);
                    (new CryptoJS.lib.WordArray()).concat(wordArray5).concat(wordArray3);
                };
            }()));

            suite.add('CryptoJS 3', (function () {
                var wordArray3 = new Y.CryptoJS3.lib.WordArray.init([0x12345678], 3);
                var wordArray4 = new Y.CryptoJS3.lib.WordArray.init([0x12345678], 4);
                var wordArray5 = new Y.CryptoJS3.lib.WordArray.init([0x12345678], 5);

                return function () {
                    (new Y.CryptoJS3.lib.WordArray.init()).concat(wordArray3).concat(wordArray3);
                    (new Y.CryptoJS3.lib.WordArray.init()).concat(wordArray4).concat(wordArray3);
                    (new Y.CryptoJS3.lib.WordArray.init()).concat(wordArray5).concat(wordArray3);
                }
            }()));

            suite.add('CryptoJS 2', (function () {
                var byteArray3 = [0x12, 0x34, 0x56];
                var byteArray4 = [0x12, 0x34, 0x56, 0x78];
                var byteArray5 = [0x12, 0x34, 0x56, 0x78, 0x00];

                return function () {
                    [].concat(byteArray3).concat(byteArray3);
                    [].concat(byteArray4).concat(byteArray3);
                    [].concat(byteArray5).concat(byteArray3);
                };
            }()));

            suite.add('sjcl', (function () {
                var bitArray3 = [Y.Sjcl.bitArray.partial(24, 0x12345678)];
                var bitArray4 = [Y.Sjcl.bitArray.partial(32, 0x12345678)];
                var bitArray5 = [0x12345678, Y.Sjcl.bitArray.partial(8, 0)];

                return function () {
                    Y.Sjcl.bitArray.concat(Y.Sjcl.bitArray.concat([], bitArray3), bitArray3);
                    Y.Sjcl.bitArray.concat(Y.Sjcl.bitArray.concat([], bitArray4), bitArray3);
                    Y.Sjcl.bitArray.concat(Y.Sjcl.bitArray.concat([], bitArray5), bitArray3);
                };
            }()));

            suite.add('Forge', (function () {
                var byteBuffer3 = Y.Forge.util.createBuffer('\x12\x34\x56');
                var byteBuffer4 = Y.Forge.util.createBuffer('\x12\x34\x56\x78');
                var byteBuffer5 = Y.Forge.util.createBuffer('\x12\x34\x56\x78\x00');

                return function () {
                    var tempBuffer = Y.Forge.util.createBuffer();
                    tempBuffer.putBuffer(byteBuffer3);
                    tempBuffer.putBuffer(byteBuffer3);

                    var tempBuffer = Y.Forge.util.createBuffer();
                    tempBuffer.putBuffer(byteBuffer4);
                    tempBuffer.putBuffer(byteBuffer3);

                    var tempBuffer = Y.Forge.util.createBuffer();
                    tempBuffer.putBuffer(byteBuffer5);
                    tempBuffer.putBuffer(byteBuffer3);
                };
            }()));

            suite.on('cycle', function (e) {
                Y.log(e.target, 'info', 'TestRunner');
            });

            suite.on('complete', (function (testCase) {
                return function () {
                    testCase.resume(function () {
                        Y.Assert.areEqual('CryptoJS 4', suite.filter('fastest').pluck('name'));
                    });
                }
            }(this)));

            suite.run({ async: true });

            this.wait(1000000);
        }
    }));
}, '$Rev$');
