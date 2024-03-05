import { useEffect, useState } from "react";
import CopyToClipboard from "./CopyToClipboard";
import { encrypt, generateCryptoKey } from "./crypto";
import Placeholder from "./Placeholder";
import { AES_MODES_VALUES } from "./App";
import ErrorComp from "./Error";

declare global {
  interface Window {
    data?: any;
  }
}

const EncryptView = ({ mode }: { mode: AES_MODES_VALUES }) => {
  const {
    iv: initialIv,
    encryptedBuffer: initialEncryptedBuffer,
    cryptoKey: initialCryptoKey = null,
    message: initialMessage,
  } = window.data?.encrypt || {};

  const [message, setMessage] = useState<string>(initialMessage);
  const [encryptedBuffer, setEncryptedBuffer] = useState<ArrayBuffer | null>(
    initialEncryptedBuffer
  );
  const [iv, setIV] = useState<Uint8Array>(initialIv);
  const [cryptoKey, setCryptoKey] = useState(initialCryptoKey);
  const [error, setError] = useState<string | undefined | null>(null);

  useEffect(() => {
    return () => {
      window.data = {
        ...window.data,
        encrypt: {
          iv,
          encryptedBuffer,

          cryptoKey,
          extractable: true,
          message,
        },
      };
    };
  }, [iv, message, cryptoKey, encryptedBuffer]);

  const renderEncryptedContent = (encryptedBuffer: ArrayBuffer) => {
    return new Uint8Array(encryptedBuffer);
  };
  return (
    <div className="flex flex-col align-items-center justify-content-center">
      <div className="flex flex-col" style={{ width: "50%" }}>
        <label htmlFor="plainText">Enter the message</label>
        <textarea
          id="plainText"
          rows={4}
          className="flex-item"
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
          }}
        ></textarea>

        <button
          className="flex-item encrypt-btn"
          onClick={async () => {
            try {
              if (!message) {
                return;
              }
              const cryptoKey = await generateCryptoKey(mode);
              setCryptoKey(cryptoKey);
              const data = await encrypt(message, cryptoKey, mode);

              if (!data) {
                throw new Error("Encryption failed");
              }
              setEncryptedBuffer(data.encryptedBuffer);
              setIV(data.iv);
            } catch (err: any) {
              setError(err.message);
            }
          }}
        >
          {" "}
          Encrypt
        </button>
        <div className="flex wide-100">
          <label className="data-to-bytes wide-100">
            Encrypted Buffer
            <div className="readonly flex-item">
              {encryptedBuffer ? (
                <p className="flex-1 p-10">{`[ ${renderEncryptedContent(
                  encryptedBuffer
                )} ]`}</p>
              ) : (
                <Placeholder text="The Encrypted Buffer  will be displayed here" />
              )}{" "}
              {encryptedBuffer && (
                <CopyToClipboard
                  text={`[ ${renderEncryptedContent(encryptedBuffer)} ]`}
                />
              )}
            </div>
          </label>
        </div>
      </div>
      {error && <ErrorComp error={error} />}
    </div>
  );
};

export default EncryptView;
