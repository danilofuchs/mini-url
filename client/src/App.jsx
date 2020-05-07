import React, { useState } from "react";
import logo from "./assets/mini-url.png";
import "./App.css";

async function requestMinifiedUrl(longUrl) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("https://bit.ly/2zlZIib");
    }, 3000);
  });
}

function App() {
  const [inputUrl, setInputUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);

  const handleChange = (e) => {
    setInputUrl(e.target.value);
    setResultUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const miniUrl = await requestMinifiedUrl(inputUrl);
    setResultUrl(miniUrl);
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Mini URL</h1>
        <form onSubmit={handleSubmit}>
          <input
            className="input"
            placeholder="URL"
            type="text"
            value={inputUrl}
            onChange={handleChange}
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            OK
          </button>
          {loading && <p>Loading...</p>}
          {resultUrl && <a href={resultUrl}>{resultUrl}</a>}
        </form>
      </header>
    </div>
  );
}

export default App;
