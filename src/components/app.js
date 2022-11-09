import { h } from "preact";
import { Router } from "preact-router";
import "@vidstack/player/hydrate.js";
import { SnackbarProvider } from "notistack";

import Home from "../routes/home";
import Mason from "../routes/mason";
import Mobile from "./mobile";

const App = () => {
  const isMobile = Math.min(window.screen.width, window.screen.height) < 719;
  return (
    <SnackbarProvider maxSnack={3}>
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
    </SnackbarProvider>
  );
};

export default App;
