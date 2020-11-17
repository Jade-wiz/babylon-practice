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
  const UFO_SPEED = 0.2;
  const OUT_OF_SCENE = -10;

  const [state, setState] = useState(STATE.GAME);

  let sphere;
  let ufo;
  let leftJoystick;
  let rightJoystick;

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

    switch (state) {
      case STATE.GAME:
        {
          // Create a sphere that we will be moved
          sphere = Mesh.CreateSphere("sphere1", 8, 1.5, scene);
          sphere.position.y = -2;
          let sphereMat = new StandardMaterial("redMaterial", scene);
          sphereMat.diffuseColor = Color3.Red();
          sphereMat.specularColor = Color3.Black();
          sphere.material = sphereMat;

          // Create joystick and set z index to be below playgrounds top bar
          leftJoystick = new VirtualJoystick(true);
          rightJoystick = new VirtualJoystick(false);
          VirtualJoystick.Canvas.style.zIndex = "4";

          // Game/Render loop
          scene.onBeforeRenderObservable.add(handleJoystick);

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
            ufo = body;
            // ufo.position = new Vector3(0, -2, 0);
            ufo.position = new Vector3(
              randomBetween(-3, 3),
              -2,
              // randomBetween(-5, 2),
              UFO_DISTANCE
            );
            ufo.scaling = new Vector3(3, 3, 3);
            // for (let i = 0; i < UFO_COUNT; i++) {
            //   // let newUfo = root.createInstance("ufo" + i);
            //   let newUfo = root.clone("ufo" + i);
            //   newUfo.position = new Vector3(
            //     randomBetween(-3, 3),
            //     randomBetween(-5, 2),
            //     UFO_DISTANCE
            //   );
            //   ufos.push(newUfo);
            // }

            // return {
            //     mesh: outer as Mesh,
            // }
          });

          scene.registerBeforeRender(function() {
            if (ufo) {
              // ufos.forEach(ufo => {
              ufo.position.z -= UFO_SPEED;

              // UFO OUT OF SCENE
              if (ufo.position.z < OUT_OF_SCENE) {
                ufo.position = new Vector3(
                  randomBetween(-4, 4),
                  randomBetween(-4, 1),
                  UFO_DISTANCE
                );
              }

              // UFO-SPHERE INTERSECTION
              if (ufo.intersectsMesh(sphere, false)) {
                scene.onBeforeRenderObservable.remove(handleJoystick);
                gameOver();
              }
              // });
            }
          });
        }
        break;
      default:
        break;
    }

    scene.getEngine().runRenderLoop(() => {
      if (scene) {
        scene.render();
      }
    });

    function handleJoystick() {
      if (!sphere || !ufo) {
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
  }

  function gameOver() {
    if (ufo) {
      ufo.dispose();
      ufo = null;
    }
    if (sphere) {
      sphere.dispose();
      sphere = null;
    }

    setState(STATE.FAIL);

    let advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("FailUI");
    let tryAgainButton = Button.CreateSimpleButton(
      "tryAgainButton",
      "Try Again"
    );
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
    console.log("TRY AGAIN");
  }

  return (
    <div className="Container">
      <Engine antialias={true} adaptToDeviceRatio={true} canvasId="game-canvas">
        <Scene
          onSceneMount={onSceneMount}
          collisionsEnabled={true}
          state={state}
        >
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
