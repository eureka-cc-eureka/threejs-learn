import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
/**
 * 基础设置
 */
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)
const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.7,
    metalness: 0
})

/**
 * 字体加载与文字创建
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.castShadow = true
sphere.position.y = 0.6
const plane = new THREE.Mesh(new THREE.PlaneGeometry(5,5),material)
plane.position.y =0
plane.rotation.x = - Math.PI * 0.5
plane.receiveShadow = true
scene.add(sphere,plane); 

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.position.set(2, 2,-1)
scene.add(directionalLight)

directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.near = 2
directionalLight.shadow.camera.far =9
// const directionalLightHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLightHelper)

const spotLight = new THREE.SpotLight(0xffffff,10,10,Math.PI*0.3)
spotLight.castShadow = true
spotLight.position.set(0,2,2)
scene.add(spotLight)
scene.add(spotLight.target)

const spotLightHelper = new THREE.CameraHelper(spotLight.shadow.camera)
// scene.add(spotLightHelper)
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.fov= 30
spotLight.shadow.camera.near= 1
spotLight.shadow.camera.far =6

const pointLight = new THREE.PointLight(0xffffff,0.3)
pointLight.castShadow = true
pointLight.position .set(-1,1,1)
scene.add(pointLight)

const pointLightHelper = new THREE.CameraHelper(pointLight.shadow.camera)
scene.add(pointLight,pointLightHelper)


// shadow maps texture with shadow



/**
 * 窗口尺寸
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * 相机：调整位置以匹配教程的俯视视角
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(1, 1, 2) // 侧上方观察
scene.add(camera)

/**
 * 控制器与渲染器
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap

/**
 * 动画循环
 */
const tick = () => {
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()