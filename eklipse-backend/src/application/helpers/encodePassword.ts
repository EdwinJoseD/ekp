import { enc, MD5 } from 'crypto-js';

export class EncodePassword {
  encode(password: string) {
    return enc.Base64.stringify(MD5(enc.Utf16LE.parse(password)));
  }
}
