import { useState } from "react";
import "./App.scss";
import DecyrptView from "./DecryptView";
import EncryptView from "./EncryptView";
import clsx from "clsx";
import GitHubCorner from "./GitHubCorner";
const VIEW = {
  ENCRYPT: 0,
  DECRYPT: 1,
};

export const AES_MODES = {
  CBC: "AES-CBC",
  GCM: "AES-GCM",
  CTR: "AES-CTR",
};

export type AES_MODES_VALUES = (typeof AES_MODES)[keyof typeof AES_MODES];

function App() {
  const [activeView, setActiveView] = useState(VIEW.ENCRYPT);
  const [mode, setMode] = useState<AES_MODES_VALUES>(AES_MODES.CTR);
  return (
    <div className="App">
      <GitHubCorner />
      <h1>AES MODES </h1>
      <div>
        <button
          className={clsx("encrypt", { active: activeView === VIEW.ENCRYPT })}
          onClick={() => setActiveView(VIEW.ENCRYPT)}
        >
          Encrypt
        </button>
        <button
          className={clsx("decrypt", { active: activeView === VIEW.DECRYPT })}
          onClick={() => setActiveView(VIEW.DECRYPT)}
        >
          Decrypt
        </button>
      </div>
      <fieldset className="aes-options">
        <legend>AES Modes</legend>
        <div className="flex">
          <input
            type="radio"
            id="aes-ctr"
            name="aes-ctr"
            value="AES-CTR"
            checked={mode === AES_MODES.CTR}
            onChange={() => setMode(AES_MODES.CTR)}
            disabled={activeView === VIEW.DECRYPT}
          />
          <label htmlFor="aes-ctr">AES-CTR</label>

          <input
            type="radio"
            id="aes-cbc"
            name="aes-cbc"
            value="AES-CBC"
            checked={mode === AES_MODES.CBC}
            onChange={() => setMode(AES_MODES.CBC)}
            disabled={activeView === VIEW.DECRYPT}
          />
          <label htmlFor="aes-cbc">AES-CBC</label>

          <input
            type="radio"
            id="aes-gcm"
            name="aes-gcm"
            value="aes-gcm"
            checked={mode === AES_MODES.GCM}
            onChange={() => setMode(AES_MODES.GCM)}
            disabled={activeView === VIEW.DECRYPT}
          />
          <label htmlFor="aes-gcm">AES-GCM</label>
        </div>
      </fieldset>
      {activeView === VIEW.ENCRYPT ? (
        <EncryptView mode={mode} />
      ) : (
        <DecyrptView mode={mode} />
      )}
    </div>
  );
}

export default App;
