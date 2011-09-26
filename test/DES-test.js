TestSuite.add(new YAHOO.tool.TestCase({

    test_DES_initialPermutation : function() {
        // the initial permutation is
        var ip = [ 58, 50, 42, 34, 26, 18, 10, 2, 60, 52, 44, 36, 28, 20, 12,
                4, 62, 54, 46, 38, 30, 22, 14, 6, 64, 56, 48, 40, 32, 24, 16,
                8, 57, 49, 41, 33, 25, 17, 9, 1, 59, 51, 43, 35, 27, 19, 11, 3,
                61, 53, 45, 37, 29, 21, 13, 5, 63, 55, 47, 39, 31, 23, 15, 7 ];
        var st = Crypto.DES._state;
        for ( var i = 0; i < 64; i++) {
            // set the IP(i)'th bit
            var m = [ 0, 0, 0, 0, 0, 0, 0, 0 ];
            var b = ip[i];
            var b0 = (b - 1);
            var i0 = Math.floor(b0 / 8);
            var b1 = b0 % 8;
            var b2 = 7 - b1;
            var b3 = 1 << b2;
            m[i0] += b3;
            st.initialPerm(m, 0);

            // check the i'th bit is set
            if (i < 32) {
                b3 = 1 << (31 - i);
                Assert.areEqual(st.lhs, b3, "LHS should be " + b3 + " for bit "
                        + i + ", not " + st.lhs);
                Assert.areEqual(st.rhs, 0, "RHS should be 0 for bit " + i
                        + " not " + st.rhs);
            } else {
                b3 = 1 << (63 - i);
                Assert.areEqual(st.rhs, b3, "RHS should be " + b3 + " for bit "
                        + i + ", not " + st.rhs);
                Assert.areEqual(st.lhs, 0, "LHS should be 0 for bit " + i
                        + " not " + st.lhs);
            }
        }
    },

    test_DES_finalPermutation : function() {
        var st = Crypto.DES._state;
        for ( var i = 0; i < 64; i++) {
            // set the i'th bit
            var m = [ 0, 0, 0, 0, 0, 0, 0, 0 ];
            var n = [ 0, 0, 0, 0, 0, 0, 0, 0 ];
            var b = i;
            var b0 = (b - 1);
            var i0 = Math.floor(b0 / 8);
            var b1 = b0 % 8;
            var b2 = 7 - b1;
            var b3 = 1 << b2;
            m[i0] += b3;
            st.initialPerm(m, 0);
            var t = st.lhs;
            st.lhs = st.rhs;
            st.rhs = t;
            st.finalPerm(n, 0);

            // final perm has undone the initial perm
            for ( var j = 0; j < 8; j++) {
                Assert.areEqual(m[j], n[j], "Byte " + j + " is set to " + n[j]
                        + ". Should be " + m[j] + " for bit " + i);
            }
        }
    },

    test_DES_encrypt : function() {
        var data = [ "AAAAAAAAAAA=", "AAAAAAAAAAA=", "jKZN6cGxI6c=",
                "HpSCM+JYRqY=", "iqiQm3ZGgVs=", "oCZZDeifj0Y=", "15Lu8Iv9KxU=",
                "z+Ibdv1Cpl8=", "nn7ZDOyzaaY=", "cevpCdQ6hSI=", "IZxIZK4RgRI=",
                "e3N98AabZ7E=", "2nuDqakGmuY=", "xqAwR/FDmJU=", "G7KNuqVOgI0=",
                "8EhcepqRvVQ=", "4Sw9+HTtT4E=", "1FZCOo1nOus=", "a9Og6fJD7Ls=",
                "9KU7pGI5Gck=", "W2tJ6nY07ks=", "+VZIswj4o70=", "pehFx9We6Vs=",
                "d3WxvPeGVi0=", "qlfmQNQFVQI=", "xC67lYhojPg=", "ktr+s0xD14U=",
                "jiE9gsTzn/E=", "jNHSttCDWIc=", "6xNmlFELedY=", "mx6G2NDgfMM=",
                "KGwiHszK/4Q=", "vnG3uyxF2r0=", "1CZPTcv7pss=", "eSIFj9s9zPM=",
                "g572tn8UFrA=", "qC4a2vybd+s=", "FhBq707g8uQ=", "8YZwdQJvx7g=",
                "l/fe4O3OAXU=", "lCNsU14s6/E=", "yrnaHmjVMuY=", "G6dk5YJv+GU=",
                "Bup1aGBSNRk=", "WsNpfPgZKmA=", "xWdjBkwa9vY=", "xw7YMTa36AE=",
                "rg4GNEds9sg=", "pXi88R+TX90=", "dpPheQhmBwE=", "1hMLz2taJ1c=",
                "704ZC+FvjvA=", "QQT1zTRpKqI=", "+Z9GLDBwmrA=", "2q0oDqUce98=",
                "ZiwGsoI+5mU=", "s683ebMdciI=", "y9i6l/eM+lc=", "9w6gFJzahdI=",
                "tiPWEQmWAPo=", "skNsEXkuFQ0=", "3SdLGLzvrXo=", "z9TGKQUdE5k=",
                "tGWgfK7wQeQ=", "HjkobqdrYdg=", "HB/7Hbznrl0=", "CpKEcRV2qcI=",
                "YigUsNlg+5Q=", "q++752WuwbA=", "KPvsX3nCQtk=", "srDtGgHPQU8=",
                "/hzYXWY3Q08=", "IURcKIf621k=", "g+zdc6/+9xo=", "ccNsHGYeb7Q=",
                "SUSojaAIN3U=", "8/sQwktkjrg=", "5B+VaNB+y1M=", "G+G0wfA6i7w=",
                "UUtcWUk++fo=", "xVBcjnvZPGo=", "XSLog78uOiw=", "4z0kvppilow=",
                "a09xSM0eaRw=", "guSIbAedl4M=", "4kCrd2XvnYU=", "pIq2fDcUg4s=",
                "Ts1rN0XciDM=", "yYoQgPbSIEY=", "RDsN+DvyifA=", "wGZoMJQrukQ=",
                "zgrluPZeUy4=", "m0EiR5pnMmo=", "K4RKd/YadZs=", "sEyhdNxaEQE=",
                "2PKN0T4VQ2w=", "pVWSNfWkBAQ=", "s1SvmKNJbIk=", "WNcYBRzmkrk=",
                "pc2XSGrNSFw=", "6LdnNb3W6ws=", "uA/e1OZ6BKA=", "5zzMZJzZ5PY=",
                "snSRUUaeM9o=", "Zu9SM1bf2g4=", "k0gfjYx1kEc=", "hE/ocX3EQDs=",
                "DlOcB+iUTks=", "nZ46go5axec=", "77clg28QpaY=", "32OmPfNVOWo=",
                "bgyayhtLiMQ=", "23lE6vR9TOU=", "UO0ez9vOY40=", "xNu7TOV3pZI=",
                "FL93y996tRE=", "gnnowxva+xQ=", "1pn/cSyipZs=", "CCXSCHBDUys=",
                "e5oMZRvAHdY=", "u6yHGVCPQkQ=", "zuohBg0SVTA=", "9jEneIdOehU=",
                "C1vUmKahdto=", "antTJDEWhJ0=", "tB1j3YF0SGc=", "xikV2o6qrN4=",
                "T9j746RmlSg=", "qP4PcaQuQJE=", "dLSXsMRJUgY=", "JKjAOOxibFU=",
                "AFXN6ahfb74=", "jmOJePdtYCc=", "y+1rVgM4na0=", "GPh5aMMcmVs=",
                "HKWzapfKkmk=", "nqvV8El8Rlo=", "jTbMKji3N7A=", "nosw/fNWQOw=",
                "+/at2bwWVFY=", "qoT4f2OMAYU=", "MPePoYIqVEQ=", "AkDWLmXlrIE=",
                "4n2Jj9ZnWzs=", "6KzD/YBKBx4=", "ndGgARXX718=", "n4g7yLYyDN4=",
                "ggCr0bw88Q4=", "wM0531FsfAY=", "HsbYYaX2OUE=", "P/R8bbBzDng=",
                "8SntzIrTzag=", "/RyRQI1zr4Q=" ];

        for ( var i = 0; i < data.length; i += 3) {
            var key = Crypto.util.base64ToBytes(data[i]);
            var inp = Crypto.util.base64ToBytes(data[i + 1]);
            var out = Crypto.util.base64ToBytes(data[i + 2]);
            Crypto.DES._init(key);
            Crypto.DES._encryptBlock(inp, 0);
            Assert.areEqual(inp.toString(), out.toString());
        }
    },

    test_DES_encrypt_decrypt : function() {
        for(var i=0;i<100;i++) {
            var key = Crypto.util.randomBytes(8);
            var inp = Crypto.util.randomBytes(8);

            Crypto.DES._init(key);
            var out = inp.slice(0);
            Crypto.DES._encryptBlock(out, 0);
            Crypto.DES._decryptBlock(out, 0);
            Assert.areEqual(inp.toString(), out.toString(),
                    "DES E(D(x) failed: " + inp.toString() + " became "
                            + out.toString());
        }
    }

}));
