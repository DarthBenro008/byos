import { h } from "preact";
import { Router } from "preact-router";
import "@vidstack/player/hydrate.js";

import Home from "../routes/home";
import Mason from "../routes/mason";
import Mobile from "./mobile";

const App = () => {
  const isMobile =
    Math.min(window.screen.width, window.screen.height) < 768 ||
    navigator.userAgent.indexOf("Mobi") > -1;
  return (
    <div id="app">
      {isMobile ? (
        Mobile()
      ) : (
        <Router>
          <Home path="/" />
          <Mason path="/:id/" id="me" />
        </Router>
      )}
    </div>
  );
};

export default App;
