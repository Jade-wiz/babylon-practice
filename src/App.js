import React, { useState } from "react";
import { Helmet } from "react-helmet";
import "./App.css";

import GameContainer from "./Game/GameContainer";
import Game from "./Game/Game";
import End from "./Game/End";
import { Engine } from "react-babylonjs";

function App() {
  const STATE = {
    START: 0,
    GAME: 1,
    FAIL: 2
  };

  const [gameState, setGameState] = useState(STATE.GAME);

  return (
    <div className="App">
      <Helmet>
        {/* For detecting touch input on mobile */}
        <script src="https://code.jquery.com/pep/0.4.3/pep.js"></script>
      </Helmet>
      <Engine
        antialias={true}
        adaptToDeviceRatio={true}
        canvasId="sample-canvas"
      >
        {/* {gameState === STATE.GAME && <Game />}
        {gameState === STATE.FAIL && <End />} */}
        <Game />
        {/* <End /> */}
      </Engine>
    </div>
  );
}

export default App;
