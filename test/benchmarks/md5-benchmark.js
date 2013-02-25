YUI.add('md5-benchmark', function (Y) {
    Y.CryptoJSTestSuite.add(new Y.Test.Case({
        name: 'MD5',

        testBenchmark: function () {
            var suite = new Benchmark.Suite();

            suite.add('CryptoJS 4', function () {
                var hash = CryptoJS.MD5.hash('abc') + '';
            });

            suite.add('CryptoJS 3', function () {
                var hash = Y.CryptoJS3.MD5('abc') + '';
            });

            suite.add('CryptoJS 2', function () {
                var hash = Y.CryptoJS2.MD5('abc') + '';
            });

            suite.add('Paj', function () {
                var hash = Y.PajMD5('abc') + '';
            });

            suite.add('JKM', function () {
                var hash = Y.JkmMD5('abc') + '';
            });

            suite.add('Forge', function () {
                var hasher = Y.Forge.md.md5.create();
                hasher.update('abc', 'utf8');
                var hash = hasher.digest().toHex();
            });

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
