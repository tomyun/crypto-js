YUI.add('sha256-benchmark', function (Y) {
    Y.CryptoJSTestSuite.add(new Y.Test.Case({
        name: 'SHA256',

        testBenchmark: function () {
            var suite = new Benchmark.Suite();

            suite.add('CryptoJS 4', function () {
                var hash = CryptoJS.SHA256.hash('abc') + '';
            });

            suite.add('CryptoJS 3', function () {
                var hash = Y.CryptoJS3.SHA256('abc') + '';
            });

            suite.add('CryptoJS 2', function () {
                var hash = Y.CryptoJS2.SHA256('abc') + '';
            });

            suite.add('Paj', function () {
                var hash = Y.PajSHA256('abc') + '';
            });

            suite.add('sjcl', function () {
                var hash = Y.Sjcl.codec.hex.fromBits(Y.Sjcl.hash.sha256.hash('abc')) + '';
            });

            suite.add('jsSHA', function () {
                var hash = (new Y.JsSHA('abc', 'TEXT')).getHash('SHA-256', 'HEX') + '';
            });

            suite.add('Forge', function () {
                var hasher = Y.Forge.md.sha256.create();
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
