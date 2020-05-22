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
    setResultUrl(null);
    setLoading(true);
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
        {resultUrl && <a href={resultUrl}>{resultUrl}</a>}
      </div>
    </div>
  );
}

export default App;
