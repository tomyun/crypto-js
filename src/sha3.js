(function (Math) {
    /*global CryptoJS:true */

    'use strict';

    // Shortcuts
    var C = CryptoJS;
    var C_LIB = C.lib;
    var WordArray = C_LIB.WordArray;
    var Hasher = C_LIB.Hasher;

    // Round constants table
    var ROUND_CONSTANTS = [];

    // Compute round constants
    (function () {
        var lfsr = 0x01;
        for (var i = 0; i < 48; i += 2) {
            var roundConstantMsw = 0;
            var roundConstantLsw = 0;

            for (var j = 0; j < 7; j++) {
                if (lfsr & 0x01) {
                    var bitPosition = (1 << j) - 1;
                    if (bitPosition < 32) {
                        roundConstantLsw ^= 1 << bitPosition;
                    } else {
                        roundConstantMsw ^= 1 << (bitPosition - 32);
                    }
                }

                // Compute next LFSR state
                if (lfsr & 0x80) {
                    lfsr = (lfsr << 1) ^ 0x71;
                } else {
                    lfsr <<= 1;
                }
            }

            ROUND_CONSTANTS[i] = roundConstantMsw;
            ROUND_CONSTANTS[i + 1] = roundConstantLsw;
        }
    }());

    /**
     * SHA-3 hash algorithm.
     */
    var SHA3 = C.SHA3 = Hasher.extend({
        /**
         * Configuration options.
         *
         * @property {number} outputLength
         *   The desired number of bits in the output hash.
         *   The output length must be one of 224, 256, 384, or 512.
         *   Default: 512
         */
        cfg: Hasher.prototype.cfg.extend({
            outputLength: 512
        }),

        _doInit: function () {
            // Shortcut
            var outputLength = this.cfg.outputLength;

            // <?php if ($debug): ?>
            {
                if (
                    outputLength !== 224 && outputLength !== 256 &&
                    outputLength !== 384 && outputLength !== 512
                ) {
                    throw new OutputLengthError('The output length must be one of 224, 256, 384, or 512.');
                }
            }
            // <?php endif ?>

            this.blockSize = 50 - outputLength / 16;
        },

        _doReset: function () {
            this._state = [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ];
        },

        _doProcessBlock: function (m) {
            // Shortcut
            var s = this._state;

            // Absorb
            var blockSize = this.blockSize;
            for (var i = 0; i < blockSize; i += 2) {
                // Shortcuts
                var mi = m[i];
                var mi1 = m[i + 1];

                // Swap endian
                mi = (
                    (((mi << 8)  | (mi >>> 24)) & 0x00ff00ff) |
                    (((mi << 24) | (mi >>> 8))  & 0xff00ff00)
                );
                mi1 = (
                    (((mi1 << 8)  | (mi1 >>> 24)) & 0x00ff00ff) |
                    (((mi1 << 24) | (mi1 >>> 8))  & 0xff00ff00)
                );

                // Absorb message into state
                s[i] ^= mi1;
                s[i + 1] ^= mi;
            }

            // Shortcuts
            var AbaMsw = s[0];
            var AbaLsw = s[1];
            var AbeMsw = s[2];
            var AbeLsw = s[3];
            var AbiMsw = s[4];
            var AbiLsw = s[5];
            var AboMsw = s[6];
            var AboLsw = s[7];
            var AbuMsw = s[8];
            var AbuLsw = s[9];
            var AgaMsw = s[10];
            var AgaLsw = s[11];
            var AgeMsw = s[12];
            var AgeLsw = s[13];
            var AgiMsw = s[14];
            var AgiLsw = s[15];
            var AgoMsw = s[16];
            var AgoLsw = s[17];
            var AguMsw = s[18];
            var AguLsw = s[19];
            var AkaMsw = s[20];
            var AkaLsw = s[21];
            var AkeMsw = s[22];
            var AkeLsw = s[23];
            var AkiMsw = s[24];
            var AkiLsw = s[25];
            var AkoMsw = s[26];
            var AkoLsw = s[27];
            var AkuMsw = s[28];
            var AkuLsw = s[29];
            var AmaMsw = s[30];
            var AmaLsw = s[31];
            var AmeMsw = s[32];
            var AmeLsw = s[33];
            var AmiMsw = s[34];
            var AmiLsw = s[35];
            var AmoMsw = s[36];
            var AmoLsw = s[37];
            var AmuMsw = s[38];
            var AmuLsw = s[39];
            var AsaMsw = s[40];
            var AsaLsw = s[41];
            var AseMsw = s[42];
            var AseLsw = s[43];
            var AsiMsw = s[44];
            var AsiLsw = s[45];
            var AsoMsw = s[46];
            var AsoLsw = s[47];
            var AsuMsw = s[48];
            var AsuLsw = s[49];

            // Rounds
            for (var round = 0; round < 48; round += 4) {
                // Inline round 1
                {
                    var BCaMsw = AbaMsw ^ AgaMsw ^ AkaMsw ^ AmaMsw ^ AsaMsw;
                    var BCaLsw = AbaLsw ^ AgaLsw ^ AkaLsw ^ AmaLsw ^ AsaLsw;
                    var BCeMsw = AbeMsw ^ AgeMsw ^ AkeMsw ^ AmeMsw ^ AseMsw;
                    var BCeLsw = AbeLsw ^ AgeLsw ^ AkeLsw ^ AmeLsw ^ AseLsw;
                    var BCiMsw = AbiMsw ^ AgiMsw ^ AkiMsw ^ AmiMsw ^ AsiMsw;
                    var BCiLsw = AbiLsw ^ AgiLsw ^ AkiLsw ^ AmiLsw ^ AsiLsw;
                    var BCoMsw = AboMsw ^ AgoMsw ^ AkoMsw ^ AmoMsw ^ AsoMsw;
                    var BCoLsw = AboLsw ^ AgoLsw ^ AkoLsw ^ AmoLsw ^ AsoLsw;
                    var BCuMsw = AbuMsw ^ AguMsw ^ AkuMsw ^ AmuMsw ^ AsuMsw;
                    var BCuLsw = AbuLsw ^ AguLsw ^ AkuLsw ^ AmuLsw ^ AsuLsw;

                    var DaMsw = BCuMsw ^ ((BCeMsw << 1) | (BCeLsw >>> 31));
                    var DaLsw = BCuLsw ^ ((BCeLsw << 1) | (BCeMsw >>> 31));
                    var DeMsw = BCaMsw ^ ((BCiMsw << 1) | (BCiLsw >>> 31));
                    var DeLsw = BCaLsw ^ ((BCiLsw << 1) | (BCiMsw >>> 31));
                    var DiMsw = BCeMsw ^ ((BCoMsw << 1) | (BCoLsw >>> 31));
                    var DiLsw = BCeLsw ^ ((BCoLsw << 1) | (BCoMsw >>> 31));
                    var DoMsw = BCiMsw ^ ((BCuMsw << 1) | (BCuLsw >>> 31));
                    var DoLsw = BCiLsw ^ ((BCuLsw << 1) | (BCuMsw >>> 31));
                    var DuMsw = BCoMsw ^ ((BCaMsw << 1) | (BCaLsw >>> 31));
                    var DuLsw = BCoLsw ^ ((BCaLsw << 1) | (BCaMsw >>> 31));

                    var AbaMsw = AbaMsw ^ DaMsw;
                    var AbaLsw = AbaLsw ^ DaLsw;
                    var BCaMsw = AbaMsw;
                    var BCaLsw = AbaLsw;
                    var AgeMsw = AgeMsw ^ DeMsw;
                    var AgeLsw = AgeLsw ^ DeLsw;
                    var BCeMsw = (AgeMsw >>> 20) | (AgeLsw << 12);
                    var BCeLsw = (AgeLsw >>> 20) | (AgeMsw << 12);
                    var AkiMsw = AkiMsw ^ DiMsw;
                    var AkiLsw = AkiLsw ^ DiLsw;
                    var BCiMsw = (AkiMsw >>> 21) | (AkiLsw << 11);
                    var BCiLsw = (AkiLsw >>> 21) | (AkiMsw << 11);
                    var AmoMsw = AmoMsw ^ DoMsw;
                    var AmoLsw = AmoLsw ^ DoLsw;
                    var BCoMsw = (AmoMsw << 21) | (AmoLsw >>> 11);
                    var BCoLsw = (AmoLsw << 21) | (AmoMsw >>> 11);
                    var AsuMsw = AsuMsw ^ DuMsw;
                    var AsuLsw = AsuLsw ^ DuLsw;
                    var BCuMsw = (AsuMsw << 14) | (AsuLsw >>> 18);
                    var BCuLsw = (AsuLsw << 14) | (AsuMsw >>> 18);
                    var EbaMsw = BCaMsw ^ (~BCeMsw & BCiMsw) ^ ROUND_CONSTANTS[round];
                    var EbaLsw = BCaLsw ^ (~BCeLsw & BCiLsw) ^ ROUND_CONSTANTS[round + 1];
                    var EbeMsw = BCeMsw ^ (~BCiMsw & BCoMsw);
                    var EbeLsw = BCeLsw ^ (~BCiLsw & BCoLsw);
                    var EbiMsw = BCiMsw ^ (~BCoMsw & BCuMsw);
                    var EbiLsw = BCiLsw ^ (~BCoLsw & BCuLsw);
                    var EboMsw = BCoMsw ^ (~BCuMsw & BCaMsw);
                    var EboLsw = BCoLsw ^ (~BCuLsw & BCaLsw);
                    var EbuMsw = BCuMsw ^ (~BCaMsw & BCeMsw);
                    var EbuLsw = BCuLsw ^ (~BCaLsw & BCeLsw);

                    var AboMsw = AboMsw ^ DoMsw;
                    var AboLsw = AboLsw ^ DoLsw;
                    var BCaMsw = (AboMsw << 28) | (AboLsw >>> 4);
                    var BCaLsw = (AboLsw << 28) | (AboMsw >>> 4);
                    var AguMsw = AguMsw ^ DuMsw;
                    var AguLsw = AguLsw ^ DuLsw;
                    var BCeMsw = (AguMsw << 20) | (AguLsw >>> 12);
                    var BCeLsw = (AguLsw << 20) | (AguMsw >>> 12);
                    var AkaMsw = AkaMsw ^ DaMsw;
                    var AkaLsw = AkaLsw ^ DaLsw;
                    var BCiMsw = (AkaMsw << 3) | (AkaLsw >>> 29);
                    var BCiLsw = (AkaLsw << 3) | (AkaMsw >>> 29);
                    var AmeMsw = AmeMsw ^ DeMsw;
                    var AmeLsw = AmeLsw ^ DeLsw;
                    var BCoMsw = (AmeMsw >>> 19) | (AmeLsw << 13);
                    var BCoLsw = (AmeLsw >>> 19) | (AmeMsw << 13);
                    var AsiMsw = AsiMsw ^ DiMsw;
                    var AsiLsw = AsiLsw ^ DiLsw;
                    var BCuMsw = (AsiMsw >>> 3) | (AsiLsw << 29);
                    var BCuLsw = (AsiLsw >>> 3) | (AsiMsw << 29);
                    var EgaMsw = BCaMsw ^ (~BCeMsw & BCiMsw);
                    var EgaLsw = BCaLsw ^ (~BCeLsw & BCiLsw);
                    var EgeMsw = BCeMsw ^ (~BCiMsw & BCoMsw);
                    var EgeLsw = BCeLsw ^ (~BCiLsw & BCoLsw);
                    var EgiMsw = BCiMsw ^ (~BCoMsw & BCuMsw);
                    var EgiLsw = BCiLsw ^ (~BCoLsw & BCuLsw);
                    var EgoMsw = BCoMsw ^ (~BCuMsw & BCaMsw);
                    var EgoLsw = BCoLsw ^ (~BCuLsw & BCaLsw);
                    var EguMsw = BCuMsw ^ (~BCaMsw & BCeMsw);
                    var EguLsw = BCuLsw ^ (~BCaLsw & BCeLsw);

                    var AbeMsw = AbeMsw ^ DeMsw;
                    var AbeLsw = AbeLsw ^ DeLsw;
                    var BCaMsw = (AbeMsw << 1) | (AbeLsw >>> 31);
                    var BCaLsw = (AbeLsw << 1) | (AbeMsw >>> 31);
                    var AgiMsw = AgiMsw ^ DiMsw;
                    var AgiLsw = AgiLsw ^ DiLsw;
                    var BCeMsw = (AgiMsw << 6) | (AgiLsw >>> 26);
                    var BCeLsw = (AgiLsw << 6) | (AgiMsw >>> 26);
                    var AkoMsw = AkoMsw ^ DoMsw;
                    var AkoLsw = AkoLsw ^ DoLsw;
                    var BCiMsw = (AkoMsw << 25) | (AkoLsw >>> 7);
                    var BCiLsw = (AkoLsw << 25) | (AkoMsw >>> 7);
                    var AmuMsw = AmuMsw ^ DuMsw;
                    var AmuLsw = AmuLsw ^ DuLsw;
                    var BCoMsw = (AmuMsw << 8) | (AmuLsw >>> 24);
                    var BCoLsw = (AmuLsw << 8) | (AmuMsw >>> 24);
                    var AsaMsw = AsaMsw ^ DaMsw;
                    var AsaLsw = AsaLsw ^ DaLsw;
                    var BCuMsw = (AsaMsw << 18) | (AsaLsw >>> 14);
                    var BCuLsw = (AsaLsw << 18) | (AsaMsw >>> 14);
                    var EkaMsw = BCaMsw ^ (~BCeMsw & BCiMsw);
                    var EkaLsw = BCaLsw ^ (~BCeLsw & BCiLsw);
                    var EkeMsw = BCeMsw ^ (~BCiMsw & BCoMsw);
                    var EkeLsw = BCeLsw ^ (~BCiLsw & BCoLsw);
                    var EkiMsw = BCiMsw ^ (~BCoMsw & BCuMsw);
                    var EkiLsw = BCiLsw ^ (~BCoLsw & BCuLsw);
                    var EkoMsw = BCoMsw ^ (~BCuMsw & BCaMsw);
                    var EkoLsw = BCoLsw ^ (~BCuLsw & BCaLsw);
                    var EkuMsw = BCuMsw ^ (~BCaMsw & BCeMsw);
                    var EkuLsw = BCuLsw ^ (~BCaLsw & BCeLsw);

                    var AbuMsw = AbuMsw ^ DuMsw;
                    var AbuLsw = AbuLsw ^ DuLsw;
                    var BCaMsw = (AbuMsw << 27) | (AbuLsw >>> 5);
                    var BCaLsw = (AbuLsw << 27) | (AbuMsw >>> 5);
                    var AgaMsw = AgaMsw ^ DaMsw;
                    var AgaLsw = AgaLsw ^ DaLsw;
                    var BCeMsw = (AgaMsw >>> 28) | (AgaLsw << 4);
                    var BCeLsw = (AgaLsw >>> 28) | (AgaMsw << 4);
                    var AkeMsw = AkeMsw ^ DeMsw;
                    var AkeLsw = AkeLsw ^ DeLsw;
                    var BCiMsw = (AkeMsw << 10) | (AkeLsw >>> 22);
                    var BCiLsw = (AkeLsw << 10) | (AkeMsw >>> 22);
                    var AmiMsw = AmiMsw ^ DiMsw;
                    var AmiLsw = AmiLsw ^ DiLsw;
                    var BCoMsw = (AmiMsw << 15) | (AmiLsw >>> 17);
                    var BCoLsw = (AmiLsw << 15) | (AmiMsw >>> 17);
                    var AsoMsw = AsoMsw ^ DoMsw;
                    var AsoLsw = AsoLsw ^ DoLsw;
                    var BCuMsw = (AsoMsw >>> 8) | (AsoLsw << 24);
                    var BCuLsw = (AsoLsw >>> 8) | (AsoMsw << 24);
                    var EmaMsw = BCaMsw ^ (~BCeMsw & BCiMsw);
                    var EmaLsw = BCaLsw ^ (~BCeLsw & BCiLsw);
                    var EmeMsw = BCeMsw ^ (~BCiMsw & BCoMsw);
                    var EmeLsw = BCeLsw ^ (~BCiLsw & BCoLsw);
                    var EmiMsw = BCiMsw ^ (~BCoMsw & BCuMsw);
                    var EmiLsw = BCiLsw ^ (~BCoLsw & BCuLsw);
                    var EmoMsw = BCoMsw ^ (~BCuMsw & BCaMsw);
                    var EmoLsw = BCoLsw ^ (~BCuLsw & BCaLsw);
                    var EmuMsw = BCuMsw ^ (~BCaMsw & BCeMsw);
                    var EmuLsw = BCuLsw ^ (~BCaLsw & BCeLsw);

                    var AbiMsw = AbiMsw ^ DiMsw;
                    var AbiLsw = AbiLsw ^ DiLsw;
                    var BCaMsw = (AbiMsw >>> 2) | (AbiLsw << 30);
                    var BCaLsw = (AbiLsw >>> 2) | (AbiMsw << 30);
                    var AgoMsw = AgoMsw ^ DoMsw;
                    var AgoLsw = AgoLsw ^ DoLsw;
                    var BCeMsw = (AgoMsw >>> 9) | (AgoLsw << 23);
                    var BCeLsw = (AgoLsw >>> 9) | (AgoMsw << 23);
                    var AkuMsw = AkuMsw ^ DuMsw;
                    var AkuLsw = AkuLsw ^ DuLsw;
                    var BCiMsw = (AkuMsw >>> 25) | (AkuLsw << 7);
                    var BCiLsw = (AkuLsw >>> 25) | (AkuMsw << 7);
                    var AmaMsw = AmaMsw ^ DaMsw;
                    var AmaLsw = AmaLsw ^ DaLsw;
                    var BCoMsw = (AmaMsw >>> 23) | (AmaLsw << 9);
                    var BCoLsw = (AmaLsw >>> 23) | (AmaMsw << 9);
                    var AseMsw = AseMsw ^ DeMsw;
                    var AseLsw = AseLsw ^ DeLsw;
                    var BCuMsw = (AseMsw << 2) | (AseLsw >>> 30);
                    var BCuLsw = (AseLsw << 2) | (AseMsw >>> 30);
                    var EsaMsw = BCaMsw ^ (~BCeMsw & BCiMsw);
                    var EsaLsw = BCaLsw ^ (~BCeLsw & BCiLsw);
                    var EseMsw = BCeMsw ^ (~BCiMsw & BCoMsw);
                    var EseLsw = BCeLsw ^ (~BCiLsw & BCoLsw);
                    var EsiMsw = BCiMsw ^ (~BCoMsw & BCuMsw);
                    var EsiLsw = BCiLsw ^ (~BCoLsw & BCuLsw);
                    var EsoMsw = BCoMsw ^ (~BCuMsw & BCaMsw);
                    var EsoLsw = BCoLsw ^ (~BCuLsw & BCaLsw);
                    var EsuMsw = BCuMsw ^ (~BCaMsw & BCeMsw);
                    var EsuLsw = BCuLsw ^ (~BCaLsw & BCeLsw);
                }

                // Inline round 2
                {
                    var BCaMsw = EbaMsw ^ EgaMsw ^ EkaMsw ^ EmaMsw ^ EsaMsw;
                    var BCaLsw = EbaLsw ^ EgaLsw ^ EkaLsw ^ EmaLsw ^ EsaLsw;
                    var BCeMsw = EbeMsw ^ EgeMsw ^ EkeMsw ^ EmeMsw ^ EseMsw;
                    var BCeLsw = EbeLsw ^ EgeLsw ^ EkeLsw ^ EmeLsw ^ EseLsw;
                    var BCiMsw = EbiMsw ^ EgiMsw ^ EkiMsw ^ EmiMsw ^ EsiMsw;
                    var BCiLsw = EbiLsw ^ EgiLsw ^ EkiLsw ^ EmiLsw ^ EsiLsw;
                    var BCoMsw = EboMsw ^ EgoMsw ^ EkoMsw ^ EmoMsw ^ EsoMsw;
                    var BCoLsw = EboLsw ^ EgoLsw ^ EkoLsw ^ EmoLsw ^ EsoLsw;
                    var BCuMsw = EbuMsw ^ EguMsw ^ EkuMsw ^ EmuMsw ^ EsuMsw;
                    var BCuLsw = EbuLsw ^ EguLsw ^ EkuLsw ^ EmuLsw ^ EsuLsw;

                    var DaMsw = BCuMsw ^ ((BCeMsw << 1) | (BCeLsw >>> 31));
                    var DaLsw = BCuLsw ^ ((BCeLsw << 1) | (BCeMsw >>> 31));
                    var DeMsw = BCaMsw ^ ((BCiMsw << 1) | (BCiLsw >>> 31));
                    var DeLsw = BCaLsw ^ ((BCiLsw << 1) | (BCiMsw >>> 31));
                    var DiMsw = BCeMsw ^ ((BCoMsw << 1) | (BCoLsw >>> 31));
                    var DiLsw = BCeLsw ^ ((BCoLsw << 1) | (BCoMsw >>> 31));
                    var DoMsw = BCiMsw ^ ((BCuMsw << 1) | (BCuLsw >>> 31));
                    var DoLsw = BCiLsw ^ ((BCuLsw << 1) | (BCuMsw >>> 31));
                    var DuMsw = BCoMsw ^ ((BCaMsw << 1) | (BCaLsw >>> 31));
                    var DuLsw = BCoLsw ^ ((BCaLsw << 1) | (BCaMsw >>> 31));

                    var EbaMsw = EbaMsw ^ DaMsw;
                    var EbaLsw = EbaLsw ^ DaLsw;
                    var BCaMsw = EbaMsw;
                    var BCaLsw = EbaLsw;
                    var EgeMsw = EgeMsw ^ DeMsw;
                    var EgeLsw = EgeLsw ^ DeLsw;
                    var BCeMsw = (EgeMsw >>> 20) | (EgeLsw << 12);
                    var BCeLsw = (EgeLsw >>> 20) | (EgeMsw << 12);
                    var EkiMsw = EkiMsw ^ DiMsw;
                    var EkiLsw = EkiLsw ^ DiLsw;
                    var BCiMsw = (EkiMsw >>> 21) | (EkiLsw << 11);
                    var BCiLsw = (EkiLsw >>> 21) | (EkiMsw << 11);
                    var EmoMsw = EmoMsw ^ DoMsw;
                    var EmoLsw = EmoLsw ^ DoLsw;
                    var BCoMsw = (EmoMsw << 21) | (EmoLsw >>> 11);
                    var BCoLsw = (EmoLsw << 21) | (EmoMsw >>> 11);
                    var EsuMsw = EsuMsw ^ DuMsw;
                    var EsuLsw = EsuLsw ^ DuLsw;
                    var BCuMsw = (EsuMsw << 14) | (EsuLsw >>> 18);
                    var BCuLsw = (EsuLsw << 14) | (EsuMsw >>> 18);
                    var AbaMsw = BCaMsw ^ (~BCeMsw & BCiMsw) ^ ROUND_CONSTANTS[round + 2];
                    var AbaLsw = BCaLsw ^ (~BCeLsw & BCiLsw) ^ ROUND_CONSTANTS[round + 3];
                    var AbeMsw = BCeMsw ^ (~BCiMsw & BCoMsw);
                    var AbeLsw = BCeLsw ^ (~BCiLsw & BCoLsw);
                    var AbiMsw = BCiMsw ^ (~BCoMsw & BCuMsw);
                    var AbiLsw = BCiLsw ^ (~BCoLsw & BCuLsw);
                    var AboMsw = BCoMsw ^ (~BCuMsw & BCaMsw);
                    var AboLsw = BCoLsw ^ (~BCuLsw & BCaLsw);
                    var AbuMsw = BCuMsw ^ (~BCaMsw & BCeMsw);
                    var AbuLsw = BCuLsw ^ (~BCaLsw & BCeLsw);

                    var EboMsw = EboMsw ^ DoMsw;
                    var EboLsw = EboLsw ^ DoLsw;
                    var BCaMsw = (EboMsw << 28) | (EboLsw >>> 4);
                    var BCaLsw = (EboLsw << 28) | (EboMsw >>> 4);
                    var EguMsw = EguMsw ^ DuMsw;
                    var EguLsw = EguLsw ^ DuLsw;
                    var BCeMsw = (EguMsw << 20) | (EguLsw >>> 12);
                    var BCeLsw = (EguLsw << 20) | (EguMsw >>> 12);
                    var EkaMsw = EkaMsw ^ DaMsw;
                    var EkaLsw = EkaLsw ^ DaLsw;
                    var BCiMsw = (EkaMsw << 3) | (EkaLsw >>> 29);
                    var BCiLsw = (EkaLsw << 3) | (EkaMsw >>> 29);
                    var EmeMsw = EmeMsw ^ DeMsw;
                    var EmeLsw = EmeLsw ^ DeLsw;
                    var BCoMsw = (EmeMsw >>> 19) | (EmeLsw << 13);
                    var BCoLsw = (EmeLsw >>> 19) | (EmeMsw << 13);
                    var EsiMsw = EsiMsw ^ DiMsw;
                    var EsiLsw = EsiLsw ^ DiLsw;
                    var BCuMsw = (EsiMsw >>> 3) | (EsiLsw << 29);
                    var BCuLsw = (EsiLsw >>> 3) | (EsiMsw << 29);
                    var AgaMsw = BCaMsw ^ (~BCeMsw & BCiMsw);
                    var AgaLsw = BCaLsw ^ (~BCeLsw & BCiLsw);
                    var AgeMsw = BCeMsw ^ (~BCiMsw & BCoMsw);
                    var AgeLsw = BCeLsw ^ (~BCiLsw & BCoLsw);
                    var AgiMsw = BCiMsw ^ (~BCoMsw & BCuMsw);
                    var AgiLsw = BCiLsw ^ (~BCoLsw & BCuLsw);
                    var AgoMsw = BCoMsw ^ (~BCuMsw & BCaMsw);
                    var AgoLsw = BCoLsw ^ (~BCuLsw & BCaLsw);
                    var AguMsw = BCuMsw ^ (~BCaMsw & BCeMsw);
                    var AguLsw = BCuLsw ^ (~BCaLsw & BCeLsw);

                    var EbeMsw = EbeMsw ^ DeMsw;
                    var EbeLsw = EbeLsw ^ DeLsw;
                    var BCaMsw = (EbeMsw << 1) | (EbeLsw >>> 31);
                    var BCaLsw = (EbeLsw << 1) | (EbeMsw >>> 31);
                    var EgiMsw = EgiMsw ^ DiMsw;
                    var EgiLsw = EgiLsw ^ DiLsw;
                    var BCeMsw = (EgiMsw << 6) | (EgiLsw >>> 26);
                    var BCeLsw = (EgiLsw << 6) | (EgiMsw >>> 26);
                    var EkoMsw = EkoMsw ^ DoMsw;
                    var EkoLsw = EkoLsw ^ DoLsw;
                    var BCiMsw = (EkoMsw << 25) | (EkoLsw >>> 7);
                    var BCiLsw = (EkoLsw << 25) | (EkoMsw >>> 7);
                    var EmuMsw = EmuMsw ^ DuMsw;
                    var EmuLsw = EmuLsw ^ DuLsw;
                    var BCoMsw = (EmuMsw << 8) | (EmuLsw >>> 24);
                    var BCoLsw = (EmuLsw << 8) | (EmuMsw >>> 24);
                    var EsaMsw = EsaMsw ^ DaMsw;
                    var EsaLsw = EsaLsw ^ DaLsw;
                    var BCuMsw = (EsaMsw << 18) | (EsaLsw >>> 14);
                    var BCuLsw = (EsaLsw << 18) | (EsaMsw >>> 14);
                    var AkaMsw = BCaMsw ^ (~BCeMsw & BCiMsw);
                    var AkaLsw = BCaLsw ^ (~BCeLsw & BCiLsw);
                    var AkeMsw = BCeMsw ^ (~BCiMsw & BCoMsw);
                    var AkeLsw = BCeLsw ^ (~BCiLsw & BCoLsw);
                    var AkiMsw = BCiMsw ^ (~BCoMsw & BCuMsw);
                    var AkiLsw = BCiLsw ^ (~BCoLsw & BCuLsw);
                    var AkoMsw = BCoMsw ^ (~BCuMsw & BCaMsw);
                    var AkoLsw = BCoLsw ^ (~BCuLsw & BCaLsw);
                    var AkuMsw = BCuMsw ^ (~BCaMsw & BCeMsw);
                    var AkuLsw = BCuLsw ^ (~BCaLsw & BCeLsw);

                    var EbuMsw = EbuMsw ^ DuMsw;
                    var EbuLsw = EbuLsw ^ DuLsw;
                    var BCaMsw = (EbuMsw << 27) | (EbuLsw >>> 5);
                    var BCaLsw = (EbuLsw << 27) | (EbuMsw >>> 5);
                    var EgaMsw = EgaMsw ^ DaMsw;
                    var EgaLsw = EgaLsw ^ DaLsw;
                    var BCeMsw = (EgaMsw >>> 28) | (EgaLsw << 4);
                    var BCeLsw = (EgaLsw >>> 28) | (EgaMsw << 4);
                    var EkeMsw = EkeMsw ^ DeMsw;
                    var EkeLsw = EkeLsw ^ DeLsw;
                    var BCiMsw = (EkeMsw << 10) | (EkeLsw >>> 22);
                    var BCiLsw = (EkeLsw << 10) | (EkeMsw >>> 22);
                    var EmiMsw = EmiMsw ^ DiMsw;
                    var EmiLsw = EmiLsw ^ DiLsw;
                    var BCoMsw = (EmiMsw << 15) | (EmiLsw >>> 17);
                    var BCoLsw = (EmiLsw << 15) | (EmiMsw >>> 17);
                    var EsoMsw = EsoMsw ^ DoMsw;
                    var EsoLsw = EsoLsw ^ DoLsw;
                    var BCuMsw = (EsoMsw >>> 8) | (EsoLsw << 24);
                    var BCuLsw = (EsoLsw >>> 8) | (EsoMsw << 24);
                    var AmaMsw = BCaMsw ^ (~BCeMsw & BCiMsw);
                    var AmaLsw = BCaLsw ^ (~BCeLsw & BCiLsw);
                    var AmeMsw = BCeMsw ^ (~BCiMsw & BCoMsw);
                    var AmeLsw = BCeLsw ^ (~BCiLsw & BCoLsw);
                    var AmiMsw = BCiMsw ^ (~BCoMsw & BCuMsw);
                    var AmiLsw = BCiLsw ^ (~BCoLsw & BCuLsw);
                    var AmoMsw = BCoMsw ^ (~BCuMsw & BCaMsw);
                    var AmoLsw = BCoLsw ^ (~BCuLsw & BCaLsw);
                    var AmuMsw = BCuMsw ^ (~BCaMsw & BCeMsw);
                    var AmuLsw = BCuLsw ^ (~BCaLsw & BCeLsw);

                    var EbiMsw = EbiMsw ^ DiMsw;
                    var EbiLsw = EbiLsw ^ DiLsw;
                    var BCaMsw = (EbiMsw >>> 2) | (EbiLsw << 30);
                    var BCaLsw = (EbiLsw >>> 2) | (EbiMsw << 30);
                    var EgoMsw = EgoMsw ^ DoMsw;
                    var EgoLsw = EgoLsw ^ DoLsw;
                    var BCeMsw = (EgoMsw >>> 9) | (EgoLsw << 23);
                    var BCeLsw = (EgoLsw >>> 9) | (EgoMsw << 23);
                    var EkuMsw = EkuMsw ^ DuMsw;
                    var EkuLsw = EkuLsw ^ DuLsw;
                    var BCiMsw = (EkuMsw >>> 25) | (EkuLsw << 7);
                    var BCiLsw = (EkuLsw >>> 25) | (EkuMsw << 7);
                    var EmaMsw = EmaMsw ^ DaMsw;
                    var EmaLsw = EmaLsw ^ DaLsw;
                    var BCoMsw = (EmaMsw >>> 23) | (EmaLsw << 9);
                    var BCoLsw = (EmaLsw >>> 23) | (EmaMsw << 9);
                    var EseMsw = EseMsw ^ DeMsw;
                    var EseLsw = EseLsw ^ DeLsw;
                    var BCuMsw = (EseMsw << 2) | (EseLsw >>> 30);
                    var BCuLsw = (EseLsw << 2) | (EseMsw >>> 30);
                    var AsaMsw = BCaMsw ^ (~BCeMsw & BCiMsw);
                    var AsaLsw = BCaLsw ^ (~BCeLsw & BCiLsw);
                    var AseMsw = BCeMsw ^ (~BCiMsw & BCoMsw);
                    var AseLsw = BCeLsw ^ (~BCiLsw & BCoLsw);
                    var AsiMsw = BCiMsw ^ (~BCoMsw & BCuMsw);
                    var AsiLsw = BCiLsw ^ (~BCoLsw & BCuLsw);
                    var AsoMsw = BCoMsw ^ (~BCuMsw & BCaMsw);
                    var AsoLsw = BCoLsw ^ (~BCuLsw & BCaLsw);
                    var AsuMsw = BCuMsw ^ (~BCaMsw & BCeMsw);
                    var AsuLsw = BCuLsw ^ (~BCaLsw & BCeLsw);
                }
            }

            // Update state
            s[0]  = AbaMsw;
            s[1]  = AbaLsw;
            s[2]  = AbeMsw;
            s[3]  = AbeLsw;
            s[4]  = AbiMsw;
            s[5]  = AbiLsw;
            s[6]  = AboMsw;
            s[7]  = AboLsw;
            s[8]  = AbuMsw;
            s[9]  = AbuLsw;
            s[10] = AgaMsw;
            s[11] = AgaLsw;
            s[12] = AgeMsw;
            s[13] = AgeLsw;
            s[14] = AgiMsw;
            s[15] = AgiLsw;
            s[16] = AgoMsw;
            s[17] = AgoLsw;
            s[18] = AguMsw;
            s[19] = AguLsw;
            s[20] = AkaMsw;
            s[21] = AkaLsw;
            s[22] = AkeMsw;
            s[23] = AkeLsw;
            s[24] = AkiMsw;
            s[25] = AkiLsw;
            s[26] = AkoMsw;
            s[27] = AkoLsw;
            s[28] = AkuMsw;
            s[29] = AkuLsw;
            s[30] = AmaMsw;
            s[31] = AmaLsw;
            s[32] = AmeMsw;
            s[33] = AmeLsw;
            s[34] = AmiMsw;
            s[35] = AmiLsw;
            s[36] = AmoMsw;
            s[37] = AmoLsw;
            s[38] = AmuMsw;
            s[39] = AmuLsw;
            s[40] = AsaMsw;
            s[41] = AsaLsw;
            s[42] = AseMsw;
            s[43] = AseLsw;
            s[44] = AsiMsw;
            s[45] = AsiLsw;
            s[46] = AsoMsw;
            s[47] = AsoLsw;
            s[48] = AsuMsw;
            s[49] = AsuLsw;
        },

        _doFinalize: function () {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;
            var nBitsLeft = data.sigBytes * 8;
            var blockSizeBits = this.blockSize * 32;

            // Add padding
            dataWords[nBitsLeft >>> 5] |= 0x1 << (24 - nBitsLeft % 32);
            dataWords[((Math.ceil((nBitsLeft + 1) / blockSizeBits) * blockSizeBits) >>> 5) - 1] |= 0x80;
            data.sigBytes = dataWords.length * 4;

            // Hash final blocks
            this._process();

            // Shortcuts
            var s = this._state;
            var outputLengthBytes = this.cfg.outputLength / 8;
            var outputLengthLanes2 = outputLengthBytes / 8 * 2;

            // Squeeze
            var hashWords = [];
            for (var i = 0; i < outputLengthLanes2; i += 2) {
                // Shortcuts
                var laneMsw = s[i];
                var laneLsw = s[i + 1];

                // Swap endian
                laneMsw = (
                    (((laneMsw << 8)  | (laneMsw >>> 24)) & 0x00ff00ff) |
                    (((laneMsw << 24) | (laneMsw >>> 8))  & 0xff00ff00)
                );
                laneLsw = (
                    (((laneLsw << 8)  | (laneLsw >>> 24)) & 0x00ff00ff) |
                    (((laneLsw << 24) | (laneLsw >>> 8))  & 0xff00ff00)
                );

                // Squeeze state to retrieve hash
                hashWords.push(laneLsw);
                hashWords.push(laneMsw);
            }

            // Return final computed hash
            return new WordArray(hashWords, outputLengthBytes);
        },

        clone: function () {
            var clone = SHA3.$super.prototype.clone.call(this);
            clone._state = clone._state.slice(0);

            return clone;
        },

        // The block size varies depending on the output length
        blockSize: null
    });

    // <?php if ($debug): ?>
    {
        // Shortcut
        var C_ERR = C.err;

        /**
         * Output length error.
         */
        var OutputLengthError = C_ERR.OutputLengthError = Hasher.extend.call(Error);
    }
    // <?php endif ?>
}(Math));
