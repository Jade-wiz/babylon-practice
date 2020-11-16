import React, { useState } from "react";

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
