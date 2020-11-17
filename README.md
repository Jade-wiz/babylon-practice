# A Simple 3D Game made with Babylon.js

조이스틱으로 조작해 날아오는 UFO를 피하는 게임.

- 화면 왼쪽: X축, Y축 이동
- 화면 오른쪽: Z축 이동

## Aim

Babylon.js API와 매커니즘에 익숙해지기 위함.

## How To Run

`yarn install`  
`yarn start`

## Structure

- create-react-app + react-babylonjs
- Game 컴포넌트에 Babylon Engine과 Scene 구현
- 단일 Scene 사용, buildGame()과 gameOver() 함수를 사용해 장면 구성 및 모드 전환
- 에셋(UFO Mesh와 Skybox material 파일)은 public/scenes, public/textures에

## What I Learned

- Babylon.js 개발 시 유의사항

  - 씬/오브젝트는 불필요해지면 `dispose`로 삭제
  - render loop는 최대한 가볍게

- 여러 개의 동일한 Mesh를 사용하는 방법

  - Clone
  - Instance : Material 공유, GPU Feature, Very Fast Render, Scene Graph에는 존재
  - Thin Instance : Scene Graph에 존재하지 않음. 충돌, Pick 불가능.
  - 속도 : Clone < Instance < Thin Instance
  - Instance 사용하려면 Mesh에 Geometry가 포함되어야 함.
  - import한 glb 모델을 복제하면 애니메이션 등 누락 요소가 생김 -> 각각 새로 임포트, 캐시를 사용하면 좋음.

- 두 Mesh가 닿는 경우의 처리

  - Intersect : 교차 상태; 특정 Mesh에게 어떤 Mesh와 닿았는지 여부를 확인 가능.
  - Collision : 충돌; 단순한 형태의 Collider Mesh를 추가로 생성, isVible = false, checkCollision = true 처리.

- React와 Babylon.js

  - Component 형태로 코드 없이 선언적으로 구현할 수 있지만 Engine, Scene reference를 인식하지 못하는 등 불편한 요소 있음.
  - canvas만 있으면 React에서도 Engine과 Scene부터 모두 코드로 구현 가능.
  - Scene Component 사용 시 onSceneMount props를 사용하여 scene 구성 코드를 지정.
  - state에 따른 씬 전환 구현해보려 했으나 React의 render 시점에 scene이 다시 mount 되지 않는 등 쉽지 않음.

- Others
  - Camera와의 충돌이 필요한 경우 FreeCamera 사용.
  - Skybox Material은 X, Y, Z 방향의 +, - 방향에 대한 각각의 총 6장의 분리된 이미지로 구성.
  - Canvas size는 Babylon.js과 무관하게 CSS로 조절 가능.
