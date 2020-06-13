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
  return body.short_url;
}

function validateUrl(inputUrl) {
  return validUrl.isWebUri(inputUrl);
}

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
      setLoading(false);
      setError("Please provide a valid URL");
      return;
    }
    const miniUrl = await requestMinifiedUrl(inputUrl);
    setResultUrl(miniUrl);
    setLoading(false);
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
