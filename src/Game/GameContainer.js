import React, { useState } from "react";
import Game from "./Game";
import End from "./End";
import { Engine } from "react-babylonjs";

function GameContainer() {
  const STATE = {
    START: 0,
    GAME: 1,
    FAIL: 2
  };

  const [gameState, setGameState] = useState(STATE.GAME);

  return (
    <Engine antialias={true} adaptToDeviceRatio={true} canvasId="sample-canvas">
      {gameState === STATE.GAME && <Game />}
      {gameState === STATE.FAIL && <End />}
      {/* <Game /> */}
      {/* <End /> */}
    </Engine>
  );
}

export default GameContainer;
