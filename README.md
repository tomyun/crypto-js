CryptoJS
========

This repository is a mirror of [crypto-js](https://code.google.com/p/crypto-js/) from Google Code. Its full history has been converted with [svn2git](https://github.com/nirvdrum/svn2git), yet it is not guaranteed to track more recent changes.  Other than that, `seed` branch has been created for working on some extra stuffs.

SEED
----

[SEED-128](http://en.wikipedia.org/wiki/SEED) is a block cipher which shows extensive and exclusive use in South Korea. It features a so-called Feistel network seemingly not very different from other predecessors like DES. If necessary, various options including IV, block modes, and/or padding, can be specified as original CryptoJS syntax.

```html
<script src="https://raw.github.com/tomyun/crypto-js/seed-3.1.2/build/rollups/seed.js"></script>
<script>
    var encrypted = CryptoJS.SEED.encrypt("Message", "Secret Passphrase");
    var decrypted = CryptoJS.SEED.decrypt(encrypted, "Secret Passphrase");
</script>
```

CP949
-----

[CP949](http://en.wikipedia.org/wiki/Code_page_949) is a character encoding for Korean language. In the current UTF-8 era, it still has widespread adoption among many domestic corporate sites. In short, there are plenty of `seed`-encrypted packets whose source is in CP949. Be cautious of its insane filesize: ~170 kB

```html
<script src="https://raw.github.com/tomyun/crypto-js/seed-3.1.2/build/components/enc-cp949.js"></script>
<script>
    var words = CryptoJS.enc.CP949.parse('뷁햏');
    var cp949 = CtyptoJS.enc.CP949.stringify(words);
</script>
```

PBKDF1
------

[PBKDF1](http://tools.ietf.org/html/rfc2898) is a key derivation function superseded by more robust [PBKDF2](http://en.wikipedia.org/wiki/PBKDF2). While any supported hash functions can be used, keys longer than the hash digest cannot be derived.

```html
<script src="https://raw.github.com/tomyun/crypto-js/seed-3.1.2/build/rollups/pbkdf1.js"></script>
<script>
    var salt = CryptoJS.lib.WordArray.random(128/8);
    var sha1 = CryptoJS.algo.SHA1;
    var key = CryptoJS.PBKDF1("Secret Passphrase", salt, { keySize: 128/32, hasher: sha1, iterations: 1000 });
</script>
```
