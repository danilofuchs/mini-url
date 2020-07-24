import React, { useState } from "react";
import logo from "./assets/mini-url.png";
import "./App.css";
import { useRef } from "react";

async function requestMinifiedUrl(longUrl) {
  const response = await fetch(process.env.REACT_APP_BASE_URL + "/minifyUrl", {
    method: "POST",
    body: JSON.stringify({
      long_url: longUrl,
    }),
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
  const body = await response.json();

  if (!response.ok) {
    throw body;
  }

  return body.short_url;
}

function validateUrl(inputUrl) {
  return /^[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/
    .test(
      inputUrl,
    );
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
  const buttonRef = useRef();

  const handleChange = (e) => {
    setInputUrl(e.target.value);
    setResultUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    buttonRef.current.focus();

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

  const resultClassName = ("result " + (() => {
    if (loading) {
      return "result-loading";
    }
    if (resultUrl) {
      return "result-success";
    }
    if (error) {
      return "result-error";
    }
    return "";
  })());

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
        <button ref={buttonRef} className="button">OK</button>
      </form>
      <div
        className={resultClassName}
      >
        {loading && <p>Loading...</p>}
        {resultUrl && (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={resultUrl}
          >
            {resultUrl}
          </a>
        )}
        {error && <p>{error}</p>}
      </div>
    </div>
  );
}

export default App;
