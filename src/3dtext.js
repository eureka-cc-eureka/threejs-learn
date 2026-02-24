import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

/**
 * 基础设置
 */
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

/**
 * 字体加载与文字创建
 */
const fontLoader = new FontLoader()
let textMesh = null // 用来存储文字网格，方便后续清理

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        // 1. 如果热更新导致再次执行，先移除旧的文字
        if(textMesh) {
            scene.remove(textMesh)
            textMesh.geometry.dispose()
            textMesh.material.dispose()
        }

        // 2. 创建几何体 (注意：参数名在某些新版本中也叫 depth)
        const textGeometry = new TextGeometry(
            'Hello Three.js',
            {
                font: font,
                size: 0.5,
                depth   : 0.2,           // 不是height
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )

        // 3. 居中
        textGeometry.center()

        // 4. 材质与网格
        const textMaterial = new THREE.MeshNormalMaterial()
        textMaterial.wireframe = true
        textMesh = new THREE.Mesh(textGeometry, textMaterial)
        
        scene.add(textMesh)
        
        for(let i = 0; i<100;i++)
        {
            const donutGeometry = new THREE.TorusGeometry(0.3,0.2,20,45)
            const donutMaterial = new THREE.MeshNormalMaterial()
            donutMaterial.wireframe = true
            const donut =new THREE.Mesh(donutGeometry,donutMaterial)

            donut.position.x = (Math.random()-0.5)*10
            donut.position.y = (Math.random()-0.5)*10
            donut.position.z = (Math.random()-0.5)*10

            // 只需要改变2个轴，就可以看到所有样式
            donut.rotation.x = Math.random()*Math.PI
            donut.rotation.y = Math.random()*Math.PI

            // 控制缩放
            const scale = Math.random()
            donut.scale.set(scale,scale,scale)


            scene.add(donut)


        }
    }
)

/**
 * 窗口尺寸与相机
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

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 3)
scene.add(camera)

/**
 * 控制器与渲染器
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * 动画循环
 */
const tick = () => {
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()