import React, { useState } from "react";
import logo from "./assets/mini-url.png";
import "./App.css";
import validUrl from "valid-url";

async function requestMinifiedUrl(longUrl) {
  const response = await fetch(process.env.REACT_APP_BASE_URL + "/minifyUrl", {
    method: "POST",
    body: JSON.stringify({
      long_url: longUrl,
    }),
  });
  const body = await response.json();

  if (!response.ok) {
    throw body;
  }

  return body.short_url;
}

function validateUrl(inputUrl) {
  validUrl.isWebUri(inputUrl);
}

const errorMessageMap = {
  ERROR_INVALID_URL: "Please provide a valid URL",
  ERROR_UNKNOWN: "Unknown server error",
};

function App() {
  const [inputUrl, setInputUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setInputUrl(e.target.value);
    setResultUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResultUrl(null);
    setLoading(true);

    if (!validateUrl(inputUrl)) {
      handleError("ERROR_INVALID_URL");
      return;
    }

    try {
      const miniUrl = await requestMinifiedUrl(inputUrl);
      setResultUrl(miniUrl);
      setLoading(false);
    } catch (e) {
      handleError(e.code || "ERROR_UNKNOWN");
    }
  };

  const handleError = (code) => {
    setLoading(false);
    setError(errorMessageMap[code] || errorMessageMap["ERROR_UNKNOWN"]);
  };

  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <h1 className="title">Mini URL</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="URL"
          type="text"
          value={inputUrl}
          onChange={handleChange}
          disabled={loading}
        />
        <button className="button">OK</button>
      </form>
      <div className="result">
        {loading && <p>Loading...</p>}
        {resultUrl && (
          <a target="_blank" rel="noopener noreferrer" href={resultUrl}>
            {resultUrl}
          </a>
        )}
        {error && <p>{error}</p>}
      </div>
    </div>
  );
}

export default App;
