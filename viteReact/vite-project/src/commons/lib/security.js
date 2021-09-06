import { encodeBase64 } from './utils';

const RSA_PUB_KEY =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDI0HEVU9YCrKf0FcWPmTA4eQ30wc6Kmo/Z2GIaghgv7phKVckju303qwaEYu0duLV4PjAaoqMeqKDAfP63mu8W2htdoWmcVrCyk7XIx1DPNETdY0XdYuYXyY8bTt/66ArM2hLNBjyOifAMN9AwPZUfz2GGSPC35zJRntxKz0ahVQIDAQAB';

let encrypt;
/**
 * DH（密钥交换协议/算法(Diffie-Hellman)简称，RSA加密算法实现了它
 * RSA 加密，加密前会统一base64一次
 * 需要注意RSA算法本身要求加密内容也就是明文长度m必须0<m<密钥长度n，如果小于这个长度就需要进行padding，因为如果没有padding，就无法确定解密后内容的真实长度，字符串之类的内容问题还不大，以0作为结束符，但对二进制数据就很难，因为不确定后面的0是内容还是内容结束符。而只要用到padding，那么就要占用实际的明文长度，于是实际明文长度需要减去padding字节长度。我们一般使用的padding标准有NoPPadding、OAEPPadding、PKCS1Padding等，其中PKCS#1建议的padding就占用了11个字节。
 * 这样，对于1024长度的密钥。128字节（1024bits）-减去11字节正好是117字节，但对于RSA加密来讲，padding也是参与加密的，所以，依然按照1024bits去理解，但实际的明文只有117字节了。
 * 所以如果要对任意长度的数据进行加密，就需要将数据分段后进行逐一加密，并将结果进行拼接。同样，解码也需要分段解码，并将结果进行拼接。
 * 故此：超长可能需要分段，或者先对称加密后使用非对称加密来加密对称加密的密钥等方法处理
 * @param {*} val 数据
 * @returns
 */
export function RSAEncrypt(val) {
  if (val == null) {
    return null;
  }
  const JSEncrypt = window.JSEncrypt;
  if (JSEncrypt == null) {
    throw new Error('Can not found JSEncrypt');
  }
  if (encrypt == null) {
    // 内含小于长度的padding处理
    encrypt = new window.JSEncrypt();
    encrypt.setPublicKey(RSA_PUB_KEY);
  }
  return encrypt.encrypt(encodeBase64(val));
}
