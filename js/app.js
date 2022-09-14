/*
My WebGL App
*/
// Import modules
import * as THREE from "./mods/three.module.js"
import Stats from "./mods/stats.module.js"
import { OrbitControls } from "./mods/OrbitControls.js"
// import * as dat from "dat.gui"

// const dat = require("dat.gui")

// Global variables
let mainContainer = null
let fpsContainer = null
let stats = null
let camera = null
let renderer = null
let scene = null

let camControls = null

let plane, garageBox, box, floor, ambientLight, dirLight, cone, light
box, floor, (cone = null)

//debugging

function init() {
  fpsContainer = document.querySelector("#fps")
  mainContainer = document.querySelector("#webgl-scene")
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)
  // scene.background = new THREE.Color("black")

  createStats()
  createCamera()
  createControls()
  createAmbientLight()
  // createLights()
  createDirectionalLight()
  createMeshes()
  createRenderer()
  renderer.setAnimationLoop(() => {
    update()
    render()
  })
}
function createAmbientLight() {
  // If the want to make the whole scene lighter or add some mood, usually it should be some grey tone
  ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(new THREE.AmbientLight(0xffffff, 0.5))
}
// Animations
function update() {
  camControls.update(1)
}

// Statically rendered content
function render() {
  stats.begin()
  renderer.render(scene, camera)
  renderer.shadowMap.enabled = true
  stats.end()
}

// FPS counter
function createStats() {
  stats = new Stats()
  stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
  fpsContainer.appendChild(stats.dom)
}

// Camera object
function createCamera() {
  const fov = 28
  const aspect = window.innerWidth / window.innerHeight
  const near = 0.1
  const far = 300 // meters
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far)

  camera.position.set(-42, 20, 20)
  camera.lookAt(scene.position)
}

// Interactive controls
function createControls() {
  camControls = new OrbitControls(camera, mainContainer)
  camControls.autoRotate = false
}

// Light objects
function createLights() {
  const sLight = new THREE.SpotLight(0xf6f50b, 1)
  sLight.position.set(-60, -17.5, 0)
  sLight.castShadow = true
  sLight.distance = 100
  sLight.target.position.set(2, 4, 6)
  sLight.angle = Math.PI * 0.2
  sLight.shadow.camera.near = 0.1
  sLight.shadow.camera.far = 100
  sLight.shadow.mapSize.width = 1048
  sLight.shadow.mapSize.height = 1048

  scene.add(sLight)
}
function createDirectionalLight() {
  const color = 0xffffff
  const intensity = 10
  light = new THREE.DirectionalLight(color, intensity)
  light.position.set(20, 20, 20)
  light.target.position.set(0, 0, 0)
  light.castShadow = true
  light.shadow.bias = -0.001
  light.shadow.mapSize.width = 2048 // default
  light.shadow.mapSize.height = 2048 // default
  light.shadow.camera.near = 1 // default
  light.shadow.camera.far = 500.0 // default
  light.shadow.camera.left = 500
  light.shadow.camera.right = -500
  light.shadow.camera.top = 500
  light.shadow.camera.bottom = 500
  scene.add(light)
}

function createPlane() {
  const grassGeometry = new THREE.PlaneGeometry(50, 50)
  const texture = new THREE.TextureLoader().load("../img/grass.jpg")
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(5, 5)
  const grassMaterial = new THREE.MeshBasicMaterial({ map: texture })
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: "gray",
    // color: 0xbdbcb9,
    side: THREE.DoubleSide,
  })

  plane = new THREE.Mesh(grassGeometry, planeMaterial)
  plane.receiveShadow = true

  plane.rotation.x = -0.5 * Math.PI
  plane.position.x = 0
  plane.position.y = 0
  plane.position.z = 0

  scene.add(plane)
}

function createFloor() {
  const geometry = new THREE.PlaneGeometry(16, 16)
  const texture = new THREE.TextureLoader().load("../img/wood.jpg")
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 2)
  const material = new THREE.MeshBasicMaterial({ map: texture })
  const floor = new THREE.Mesh(geometry, material)
  floor.receiveShadow = true
  floor.rotation.x = -0.5 * Math.PI
  floor.position.y = 0
  floor.position.z = 0
  scene.add(floor)
}

function createSideWall() {
  const shape = new THREE.Shape()
  shape.moveTo(-8, 0)
  shape.lineTo(8, 0)
  shape.lineTo(8, 8)
  shape.lineTo(0, 18)
  shape.lineTo(-8, 8)
  shape.lineTo(-8, 0)
  const extrudeGeometry = new THREE.ExtrudeGeometry(shape)
  const texture = new THREE.TextureLoader().load("../img/wall.jpg")
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(0.1, 0.05)
  const material = new THREE.MeshBasicMaterial({ map: texture })
  const sideWall = new THREE.Mesh(extrudeGeometry, material)
  sideWall.receiveShadow = true
  sideWall.castShadow = true
  scene.add(sideWall)
  return sideWall
}
function createBackWall() {
  const shape = new THREE.Shape()
  shape.moveTo(-8.5, 0)
  shape.lineTo(8.5, 0)
  shape.lineTo(8.5, 8.5)
  shape.lineTo(-8.5, 8.5)
  const extrudeGeometry = new THREE.ExtrudeGeometry(shape)
  const texture = new THREE.TextureLoader().load("../img/wall.jpg")
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(0.1, 0.05)
  const material = new THREE.MeshBasicMaterial({ map: texture })
  const backWall = new THREE.Mesh(extrudeGeometry, material)
  backWall.position.z = 0.5
  backWall.position.x = 8
  backWall.rotation.y = Math.PI * 0.5
  scene.add(backWall)
}

function createFrontWall() {
  const shape = new THREE.Shape()
  shape.moveTo(-8.5, 0)
  shape.lineTo(8.5, 0)
  shape.lineTo(8.5, 8.5)
  shape.lineTo(-8.5, 8.5)
  shape.lineTo(-8.5, 0)
  const window = new THREE.Path()
  window.moveTo(3, 3)
  window.lineTo(8, 3)
  window.lineTo(8, 8)
  window.lineTo(3, 8)
  window.lineTo(3, 3)
  shape.holes.push(window)
  const door = new THREE.Path()
  door.moveTo(-3, 0)
  door.lineTo(-3, 8)
  door.lineTo(-8, 8)
  door.lineTo(-8, 0)
  door.lineTo(-3, 0)
  shape.holes.push(door)
  const extrudeGeometry = new THREE.ExtrudeGeometry(shape)
  const texture = new THREE.TextureLoader().load("../img/wall.jpg")
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(0.1, 0.05)
  const material = new THREE.MeshBasicMaterial({ map: texture })
  const frontWall = new THREE.Mesh(extrudeGeometry, material)
  frontWall.position.z = 0.5
  frontWall.position.x = -9
  frontWall.rotation.y = Math.PI * 0.5
  scene.add(frontWall)
}

function createRoof() {
  const geometry = new THREE.BoxGeometry(14, 17, 1)
  const texture = new THREE.TextureLoader().load("../img/tile.jpg")
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 1)
  texture.rotation = Math.PI / 2
  const textureMaterial = new THREE.MeshBasicMaterial({ map: texture })
  const colorMaterial = new THREE.MeshBasicMaterial({ color: "grey" })
  const materials = [
    colorMaterial,
    colorMaterial,
    colorMaterial,
    colorMaterial,
    colorMaterial,
    textureMaterial,
  ]
  const roof = new THREE.Mesh(geometry, materials)

  scene.add(roof)
  roof.rotation.x = Math.PI / 2
  roof.rotation.y = (-Math.PI / 4) * 1.15
  roof.position.y = 13
  roof.position.x = 5
  roof.position.z = 0.5
}
function createRoof2() {
  const geometry = new THREE.BoxGeometry(15, 17, 1)
  const texture = new THREE.TextureLoader().load("../img/tile.jpg")
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 1)
  texture.rotation = -Math.PI / 2
  const textureMaterial = new THREE.MeshBasicMaterial({ map: texture })
  const colorMaterial = new THREE.MeshBasicMaterial({ color: "grey" })
  const materials = [
    colorMaterial,
    colorMaterial,
    colorMaterial,
    colorMaterial,
    colorMaterial,
    textureMaterial,
  ]
  const roof2 = new THREE.Mesh(geometry, materials)
  scene.add(roof2)
  roof2.rotation.x = Math.PI / 2
  roof2.rotation.y = (Math.PI / 4) * 1.1
  roof2.position.y = 13
  roof2.position.x = -4.7
  roof2.position.z = 0.5
}

function createCarpet() {
  const box9Geometry = new THREE.BoxBufferGeometry(9.5, 0.2, 5)
  const carpetMaterial = new THREE.MeshPhongMaterial({
    color: 0x540c0f,
    wireframe: false,
  })
  const texture = new THREE.TextureLoader().load("../img/grass.jpg")
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(4, 4)
  const grassCarpetMaterial = new THREE.MeshBasicMaterial({
    map: texture,
  })

  garageBox = new THREE.Mesh(box9Geometry, carpetMaterial)
  garageBox.receiveShadow = true
  garageBox.castShadow = true
  garageBox.position.x = -14
  garageBox.position.y = 0
  garageBox.position.z = 6

  scene.add(garageBox)
}

function createCylinder() {
  const geometry = new THREE.CylinderGeometry(
    0.4,
    0.4,
    5,
    35,
    8,
    false,
    0,
    6.28
  )
  const material = new THREE.MeshPhongMaterial({ color: 0x540c0f })
  const cylinder = new THREE.Mesh(geometry, material)
  scene.add(cylinder)
  cylinder.castShadow = true
  cylinder.receiveShadow = true

  cylinder.position.x = -9.5
  cylinder.position.y = 2.5
  cylinder.position.z = 3.1

  scene.add(cylinder)
  return cylinder
}
// Meshes and other visible objects
function createMeshes() {
  // const axes = new THREE.AxesHelper(10)
  // scene.add(axes)
  // scene.fog = new THREE.Fog(0xffffff, 10, 1500)
  createPlane()
  createFloor()
  const sideWall = createSideWall()
  const sideWall2 = createSideWall()
  sideWall.position.z = -8
  sideWall2.position.z = 8
  createBackWall()
  createFrontWall()
  createRoof()
  createRoof2()
  createCarpet()
  const cyl1 = createCylinder()
  const cyl2 = createCylinder()
  const cyl3 = createCylinder()
  const cyl4 = createCylinder()
  const cyl5 = createCylinder()
  const cyl6 = createCylinder()
  cyl1.position.z = 8.9
  cyl2.position.z = 3.1
  cyl3.position.x = -14
  cyl4.position.x = -18
  cyl5.position.z = 8.9
  cyl5.position.x = -14
  cyl6.position.z = 8.9
  cyl6.position.x = -18
}

// Renderer object and features
function createRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.shadowMap.enabled = true
  // renderer.shadowMap.type = THREE.PCFShadowMap

  renderer.setSize(mainContainer.clientWidth, mainContainer.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  mainContainer.appendChild(renderer.domElement)
}

// Auto resize window
window.addEventListener("resize", (e) => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

init()
