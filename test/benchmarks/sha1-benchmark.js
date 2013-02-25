YUI.add('sha1-benchmark', function (Y) {
    Y.CryptoJSTestSuite.add(new Y.Test.Case({
        name: 'SHA1',

        testBenchmark: function () {
            var suite = new Benchmark.Suite();

            suite.add('CryptoJS 4', function () {
                var hash = CryptoJS.SHA1.hash('abc') + '';
            });

            suite.add('CryptoJS 3', function () {
                var hash = Y.CryptoJS3.SHA1('abc') + '';
            });

            suite.add('CryptoJS 2', function () {
                var hash = Y.CryptoJS2.SHA1('abc') + '';
            });

            suite.add('Paj', function () {
                var hash = Y.PajSHA1('abc') + '';
            });

            suite.add('jsSHA', function () {
                var hash = (new Y.JsSHA('abc', 'TEXT')).getHash('SHA-1', 'HEX') + '';
            });

            suite.add('Forge', function () {
                var hasher = Y.Forge.md.sha1.create();
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
