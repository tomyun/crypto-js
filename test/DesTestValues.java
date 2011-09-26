import org.bouncycastle.jce.provider.BouncyCastleProvider;

import javax.crypto.Cipher;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.SecretKeySpec;

import java.security.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;


public class DesTestValues {

    /** The character to use for each 6-bit block */
    private final static char[] BASE64CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".toCharArray();

    /** The pad character for 6-bit encoding */
    private final static char BASE64PAD = '=';

    /** The 6-bit block to use for each character. */
    private final static byte[] BASE64BLOCKS = new byte[127];

    /** Initialise the BASE64BLOCKS */
    static {
        for(int i = 0;i < 127;i++) {
            BASE64BLOCKS[i] = (byte) -1;
        }
        for(int i = 0;i < 64;i++) {
            BASE64BLOCKS[BASE64CHARS[i]] = (byte) i;
        }
    }


    /**
     * Encode the provided binary data in a textual form.
     * 
     * @param bytes
     *            binary data
     * @return textual representation
     */
    protected static String encode(byte[] bytes) {
        // every three bytes requires 4 characters of output
        int fullBlocks = bytes.length / 3;
        int extraBytes = bytes.length - 3 * fullBlocks;

        char[] output = new char[4 * fullBlocks + ((extraBytes == 0) ? 0 : 4)];

        for(int i = 0;i < fullBlocks;i++) {
            int j = i * 3;
            getBlock64(output, i * 4, bytes[j], bytes[j + 1], bytes[j + 2]);
        }

        int i = fullBlocks * 4;
        int j = fullBlocks * 3;
        switch (extraBytes) {
        case 0:
            break;
        case 1:
            getBlock64(output, i, bytes[j], (byte) 0, (byte) 0);
            output[i + 2] = BASE64PAD;
            output[i + 3] = BASE64PAD;
            break;
        case 2:
            getBlock64(output, i, bytes[j], bytes[j + 1], (byte) 0);
            output[i + 3] = BASE64PAD;
            break;
        }

        return new String(output);
    }


    private final static void getBlock64(char[] output, int offset, byte b0,
            byte b1, byte b2) {
        int v = ((0xff & b0) << 16) | ((0xff & b1) << 8) | (0xff & b2);
        output[offset] = BASE64CHARS[((0xfc0000) & v) >> 18];
        output[offset + 1] = BASE64CHARS[((0x03f000) & v) >> 12];
        output[offset + 2] = BASE64CHARS[((0x000fc0) & v) >> 6];
        output[offset + 3] = BASE64CHARS[((0x00003f) & v) >> 0];
    }

    public static final String TEXT = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

    public static final byte[] DATA = new byte[256];

    static {
        // build test data
        for(int i = 0;i < DATA.length;i++) {
            DATA[i] = (byte) ((i * 7) % 256);
        }
    }


    private static void format(String var, byte[] data) {
        String bytes = encode(data);
        StringBuilder buf = new StringBuilder();
        buf.append("        ").append(var).append(
                " = Crypto.util.base64ToBytes(");
        if (buf.length() + bytes.length() < 76) {
            buf.append("\"").append(bytes).append("\");");
            System.out.println(buf.toString());
            return;
        }

        int p = 0;
        while( p < bytes.length() ) {
            if (p != 0) buf.append('+');
            buf.append("\n            \"");
            int e = Math.min(bytes.length(), p+60);
            buf.append(bytes.substring(p,e));
            buf.append("\"");
            p+=60;
        }
        buf.append(");\n");

        System.out.println(buf.toString());
        return;
    }
    
    private static String format(byte[] data) {
        String bytes = encode(data);
        StringBuilder buf = new StringBuilder();
        buf.append("            Crypto.util.base64ToBytes(");
        if (buf.length() + bytes.length() < 76) {
            buf.append("\"").append(bytes).append("\")");
            return buf.toString();
        }

        int p = 0;
        while( p < bytes.length() ) {
            if (p != 0) buf.append('+');
            buf.append("\n                \"");
            int e = Math.min(bytes.length(), p+56);
            buf.append(bytes.substring(p,e));
            buf.append("\"");
            p+=56;
        }
        buf.append(")");

        return buf.toString();
    }

	/**
	 * @param args
	 * @throws NoSuchPaddingException 
	 * @throws NoSuchAlgorithmException 
	 * @throws GeneralSecurityException 
	 */
	public static void main(String[] args) throws GeneralSecurityException {
	    Provider prov = new BouncyCastleProvider();
        Security.addProvider(prov);        
        Cipher cipher = Cipher.getInstance("DES/ECB/NoPadding",prov);
        
        Random rand = new Random(1234567890123457890l);
        List<byte[]> data = new ArrayList<byte[]>(100);
        
        byte[] key = new byte[8];
        byte[] inp = new byte[8];
        data.add(key.clone());
        data.add(inp.clone());
        Key k = new SecretKeySpec(key,"DES");
        cipher.init(Cipher.ENCRYPT_MODE,k,(SecureRandom) null);
        data.add(cipher.doFinal(inp));
       
        for(int i=0;i<50;i++) {
            rand.nextBytes(key);
            rand.nextBytes(inp);
            data.add(key.clone());
            data.add(inp.clone());
            k = new SecretKeySpec(key,"DES");
            cipher.init(Cipher.ENCRYPT_MODE,k,(SecureRandom) null);
            data.add(cipher.doFinal(inp));
        }
        
        
        for(byte[] d : data) {
            System.out.println("    \""+encode(d)+"\",");
        }
	}

}
