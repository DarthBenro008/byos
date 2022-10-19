import { h } from "preact";
import { Router } from "preact-router";

import Home from "../routes/home";
import Mason from "../routes/mason";

const App = () => (
  <div id="app">
    <Router>
      <Home path="/" />
      <Mason path="/:id/" id="me" />
    </Router>
  </div>
);

export default App;
