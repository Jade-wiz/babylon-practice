import React, { useState, useEffect } from "react";
import { Engine, Scene, Skybox } from "react-babylonjs";
import {
  Vector3,
  Color3,
  VirtualJoystick,
  Mesh,
  StandardMaterial,
  SceneLoader
} from "@babylonjs/core";
import { AdvancedDynamicTexture, Button } from "@babylonjs/gui";
import { randomBetween } from "../utils.js";
import "./Game.css";

const STATE = {
  START: 0,
  GAME: 1,
  FAIL: 2
};

function Game() {
  const MOVE_SPEED = 5;
  const UFO_COUNT = 3;
  const UFO_DISTANCE = 20;
  const UFO_SPEED = 0.15;
  const OUT_OF_SCENE = -10;

  // const [state, setState] = useState(STATE.GAME);

  let sphere;
  let ufos = [];
  let ufoTimeouts = [];
  let leftJoystick;
  let rightJoystick;
  let tryAgainButton;

  let scene;

  useEffect(() => {
    const resize = () => {
      scene?.getEngine().resize();
    };

    if (window) {
      window.addEventListener("resize", resize);
    }

    return () => {
      scene?.getEngine().dispose();
      if (window) {
        window.removeEventListener("resize", resize);
      }
    };
  });

  function onSceneMount(e) {
    scene = e.scene;

    buildGame();

    scene.getEngine().runRenderLoop(() => {
      if (scene) {
        scene.render();
      }
    });
  }

  function manageUfos() {
    ufos.forEach(ufo => {
      ufoMove(ufo);
      checkIntersection(ufo);
    });
  }

  function ufoMove(ufo) {
    if (ufo.isDisposed()) {
      return;
    }

    ufo.position.z -= UFO_SPEED;

    // UFO OUT OF SCENE
    if (ufo.position.z < OUT_OF_SCENE) {
      ufo.position = new Vector3(
        randomBetween(-5, 5),
        randomBetween(-4, 1),
        UFO_DISTANCE
      );
    }
  }

  function checkIntersection(ufo) {
    if (ufo.isDisposed()) {
      return;
    }

    // UFO-SPHERE INTERSECTION
    if (ufo.intersectsMesh(sphere, false)) {
      gameOver();
    }
  }

  function buildGame() {
    // Create a sphere that we will be moved
    sphere = Mesh.CreateSphere("sphere1", 8, 1.5, scene);
    sphere.position = new Vector3(0, -2, 0);
    let sphereMat = new StandardMaterial("redMaterial", scene);
    sphereMat.diffuseColor = Color3.Red();
    sphereMat.specularColor = Color3.Black();
    sphere.material = sphereMat;

    // Create joystick
    leftJoystick = new VirtualJoystick(true);
    rightJoystick = new VirtualJoystick(false);
    VirtualJoystick.Canvas.style.zIndex = "4";

    // Game/Render loop
    scene.onBeforeRenderObservable.add(handleJoystick);

    // Create UFOs
    for (let i = 0; i < UFO_COUNT; i++) {
      ufoTimeouts.push(
        setTimeout(() => {
          importUfo();
        }, 10000 * i)
      );
    }
    scene.registerBeforeRender(manageUfos);
  }

  function importUfo() {
    SceneLoader.ImportMeshAsync(
      "",
      `${process.env.PUBLIC_URL}/scenes/`,
      "ufo.glb",
      scene
    ).then(result => {
      const root = result.meshes[0];
      root.isVisible = false;
      // //body is our actual player mesh
      const body = root;
      // body.parent = outer;
      body.isPickable = false; //so our raycasts dont hit ourself
      body.getChildMeshes().forEach(m => {
        m.isPickable = false;
      });

      // ufo.position = new Vector3(0, -2, UFO_DISTANCE);
      body.position = new Vector3(
        randomBetween(-5, 5),
        randomBetween(-4, 1),
        UFO_DISTANCE
      );
      body.scaling = new Vector3(3, 3, 3);

      ufos.push(body);
    });
  }

  function gameOver() {
    scene.unregisterBeforeRender(manageUfos);
    ufoTimeouts.forEach(timeout => {
      clearTimeout(timeout);
    });
    ufos.forEach(ufo => {
      ufo.dispose();
    });
    ufos = [];

    if (sphere) {
      sphere.dispose();
      sphere = null;
    }

    // Try Again Button
    let advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("FailUI");
    tryAgainButton = Button.CreateSimpleButton("tryAgainButton", "Try Again");
    tryAgainButton.zIndex = "10";
    tryAgainButton.width = 0.2;
    tryAgainButton.height = 0.1;
    tryAgainButton.color = "red";
    tryAgainButton.background = "black";
    tryAgainButton.isPointerBlocker = true;
    tryAgainButton.onPointerClickObservable.add(() => {
      tryAgain();
    });
    VirtualJoystick.Canvas.style.zIndex = "-1";
    tryAgainButton.zIndex = 10;
    advancedTexture.addControl(tryAgainButton);
  }

  function tryAgain() {
    tryAgainButton.dispose();
    buildGame();
  }

  function handleJoystick() {
    if (!sphere) {
      return;
    }

    if (leftJoystick.pressed) {
      let moveX =
        leftJoystick.deltaPosition.x *
        (scene.getEngine().getDeltaTime() / 1000) *
        MOVE_SPEED;
      let moveZ =
        leftJoystick.deltaPosition.y *
        (scene.getEngine().getDeltaTime() / 1000) *
        MOVE_SPEED;
      sphere.position.x += moveX;
      sphere.position.z += moveZ;
    }
    if (rightJoystick.pressed) {
      let moveY =
        rightJoystick.deltaPosition.y *
        (scene.getEngine().getDeltaTime() / 1000) *
        MOVE_SPEED;
      sphere.position.y += moveY;
    }
  }

  return (
    <div className="Container">
      <Engine antialias={true} adaptToDeviceRatio={true} canvasId="game-canvas">
        <Scene onSceneMount={onSceneMount} collisionsEnabled={true}>
          <hemisphericLight
            name="hemi-light"
            intensity={0.9}
            direction={Vector3.Up()}
          />
          <Skybox rootUrl={`${process.env.PUBLIC_URL}/textures/space`} />
          <freeCamera
            name="camera1"
            position={new Vector3(0, 5, -10)}
            setTarget={[Vector3.Zero()]}
            checkCollisions={true}
            ellipsoid={new Vector3(100, 100, 1)}
          />
        </Scene>
      </Engine>
    </div>
  );
}

export default Game;
