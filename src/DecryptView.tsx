import { useEffect, useState } from "react";
import {
  dataToBytes,
  decrypt,
  deriveEncryptionKeyFromCryptoKey,
} from "./crypto";
import Error from "./Error";
import { AES_MODES_VALUES } from "./App";

const REGEX_FOR_EXTRACTING_TEXT_FROM_INPUT = /\[(.*)\]/;

const DecyrptView = ({ mode }: { mode: AES_MODES_VALUES }) => {
  const sanitizeInput = (
    input: string,
    type: "Encrypted Text" | "Initialization Vector"
  ) => {
    const val = input.match(REGEX_FOR_EXTRACTING_TEXT_FROM_INPUT)?.[1].trim();
    if (!val) {
      setError(`Invalid input for ${type}`);
      return "";
    }
    return val.split(",");
  };
  const { encryptedText: initialEncryptedText = "" } =
    window.data?.decrypt ?? {};
  const [encryptedText, setEncryptedText] = useState(initialEncryptedText);
  const { cryptoKey, iv } = window.data?.encrypt ?? {};

  const [error, setError] = useState<string | null>(null);
  const [decryptedText, setDecryptedText] = useState("");

  useEffect(() => {
    return () => {
      window.data = {
        ...window.data,
        decrypt: {
          encryptedText,
        },
      };
    };
  }, [encryptedText]);
  return (
    <div className="flex flex-col align-items-center justify-content-center">
      <div className="flex flex-col" style={{ width: "50%" }}>
        <label htmlFor="encryptedText">Paste the Encrypted Content</label>
        <textarea
          id="encryptedText"
          rows={4}
          className="flex-item "
          onChange={(event) => setEncryptedText(event.target.value)}
          value={encryptedText}
        ></textarea>

        <button
          className="flex-item decrypt-btn"
          onClick={async () => {
            try {
              const encryptedBuffer = dataToBytes(
                sanitizeInput(encryptedText, "Encrypted Text")
              );
              const encryptionKey = await deriveEncryptionKeyFromCryptoKey(
                cryptoKey
              );
              console.log("DECRYPT ", encryptionKey);
              const data = await decrypt(encryptedBuffer, cryptoKey, iv, mode);
              setDecryptedText(data);
              setError(null);
            } catch (err) {
              setError("Error while decrypting");
              console.error(err);
              setDecryptedText("");
            }
          }}
        >
          {" "}
          Decrypt
        </button>
        {decryptedText && (
          <div className="flex-item decrypt-text">{decryptedText} </div>
        )}
      </div>

      {error && <Error error={error} />}
    </div>
  );
};

export default DecyrptView;
