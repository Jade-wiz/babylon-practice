import React, { useState } from 'react'
import { Engine, Scene, Skybox } from 'react-babylonjs';
import { Vector3 } from '@babylonjs/core';

let globalIndex = 0 // due to closure and how observables are assigned.
const SkyboxScenes = [{
  name: 'sunny day',
  texture: `${process.env.PUBLIC_URL}/textures/TropicalSunnyDay`
}, {
  name: 'specular HDR',
  texture: `${process.env.PUBLIC_URL}/textures/SpecularHDR.dds`
}]

function Game() {
    globalIndex = 0

    return (
        <div className="Container">
            <Engine antialias={true} adaptToDeviceRatio={true} canvasId="sample-canvas">
            <Scene>
              <hemisphericLight name="hemi-light" intensity={0.7} direction={Vector3.Up()} />
              <Skybox rootUrl={SkyboxScenes[0].texture} />
              <arcRotateCamera target={ Vector3.Zero() } radius={10}
                alpha={-Math.PI / 2} beta={(Math.PI / 2)} minZ={0.001} wheelPrecision={50}
              />
            </Scene>
          </Engine>
        </div>
    )
}

export default Game
