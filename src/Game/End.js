import React, { useRef } from "react";
import { Scene, Skybox } from "react-babylonjs";
import { Vector3 } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button } from "@babylonjs/gui";

const SkyboxScenes = [
  {
    name: "sunny day",
    texture: `${process.env.PUBLIC_URL}/textures/space`
  },
  {
    name: "specular HDR",
    texture: `${process.env.PUBLIC_URL}/textures/SpecularHDR.dds`
  }
];

function End() {
  const camera = useRef(null);

  let sphere;
  let ufo;

  let scene;

  function onSceneMount(e) {
    scene = e.scene;

    gameOver();

    scene.getEngine().runRenderLoop(() => {
      if (scene) {
        scene.render();
      }
    });
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

    let advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("FailUI");
    let tryAgainButton = Button.CreateImageWithCenterTextButton(
      "tryAgainButton",
      "Try Again"
    );
    tryAgainButton.zIndex = "10";
    tryAgainButton.width = 0.2;
    tryAgainButton.height = "40px";
    tryAgainButton.color = "red";
    tryAgainButton.background = "black";
    tryAgainButton.isPointerBlocker = true;
    tryAgainButton.onPointerClickObservable.add(() => {
      tryAgain();
    });
    tryAgainButton.onPointerEnterObservable.add(() => {
      console.log("POINTER ENTER");
    });
    tryAgainButton.zIndex = "10";
    console.dir(tryAgainButton);
    advancedTexture.addControl(tryAgainButton);
  }

  function tryAgain() {
    console.log("TRY AGAIN");
  }

  return (
    <div className="Container">
      <Scene onSceneMount={onSceneMount} collisionsEnabled={true}>
        <hemisphericLight
          name="hemi-light"
          intensity={0.9}
          direction={Vector3.Up()}
        />
        <Skybox rootUrl={SkyboxScenes[0].texture} />
        <freeCamera
          ref={camera}
          name="camera1"
          position={new Vector3(0, 5, -10)}
          setTarget={[Vector3.Zero()]}
          checkCollisions={true}
          ellipsoid={new Vector3(100, 100, 1)}
        />
      </Scene>
    </div>
  );
}

export default End;
