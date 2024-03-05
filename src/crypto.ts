import { AES_MODES_VALUES } from "./App";

const cryptoSubtle = window.crypto.subtle;

export const encode = (text: string) => {
  return new TextEncoder().encode(text);
};

export const generateCryptoKey = async (algo: AES_MODES_VALUES) => {
  const key = await window.crypto.subtle.generateKey(
    {
      name: algo,
      length: 128,
    },
    true,
    ["encrypt", "decrypt"]
  );
  return key;
};
export const encrypt = async (
  text: string,
  cryptoKey: CryptoKey,
  algo: AES_MODES_VALUES
) => {
  let iv, encryptedBuffer;
  console.log(algo);
  switch (algo) {
    case "AES-CBC":
      iv = crypto.getRandomValues(new Uint8Array(16));
      encryptedBuffer = await cryptoSubtle.encrypt(
        {
          name: "AES-CBC",
          iv,
        },
        cryptoKey,
        encode(text)
      );

      return { encryptedBuffer, cryptoKey, iv };
    case "AES-GCM":
      iv = crypto.getRandomValues(new Uint8Array(12));
      encryptedBuffer = await cryptoSubtle.encrypt(
        {
          name: "AES-GCM",
          iv,
        },
        cryptoKey,
        encode(text)
      );

      return { encryptedBuffer, cryptoKey, iv };
    case "AES-CTR":
      iv = crypto.getRandomValues(new Uint8Array(16));
      encryptedBuffer = await cryptoSubtle.encrypt(
        {
          name: "AES-CTR",
          counter: iv,
          length: 64,
        },
        cryptoKey,
        encode(text)
      );
      return { encryptedBuffer, cryptoKey, iv };
    default:
      break;
  }
};

export const deriveEncryptionKeyFromCryptoKey = async (
  cryptoKey: CryptoKey
): Promise<string | undefined> => {
  const exportedkey = await window.crypto.subtle.exportKey("jwk", cryptoKey);
  return exportedkey.k;
};
export const deriveCryptoKeyfromEncryptionKey = async (
  encryptionKey: string
) => {
  const cryptoKey = await window.crypto.subtle.importKey(
    "jwk",
    {
      alg: "A128CBC",
      ext: true,
      k: encryptionKey,
      key_ops: ["encrypt", "decrypt"],
      kty: "oct",
    },
    {
      name: "AES-CBC",
      length: 128,
    },
    false,
    ["decrypt"]
  );
  return cryptoKey;
};

export const dataToBytes = (data: string | Array<string>) => {
  const arr = Array.from(data) as unknown as ArrayBuffer;
  const bytes = new Uint8Array(arr);

  return bytes;
};

export const decrypt = async (
  encryptedData: Uint8Array,
  cryptoKey: CryptoKey,
  iv: Uint8Array,
  algo: AES_MODES_VALUES
) => {
  let decryptedBuffer;
  switch (algo) {
    case "AES-CBC":
      decryptedBuffer = await cryptoSubtle.decrypt(
        {
          name: "AES-CBC",
          iv,
        },
        cryptoKey,
        encryptedData
      );
      break;

    case "AES-GCM":
      decryptedBuffer = await cryptoSubtle.decrypt(
        {
          name: "AES-GCM",
          iv,
        },
        cryptoKey,
        encryptedData
      );
      break;
    case "AES-CTR":
    default:
      decryptedBuffer = await cryptoSubtle.decrypt(
        {
          name: "AES-CTR",
          counter: iv,
          length: 64,
        },
        cryptoKey,
        encryptedData
      );
  }

  const decryptedData = new TextDecoder().decode(decryptedBuffer);
  return decryptedData;
};
