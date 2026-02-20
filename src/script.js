import './style.css';
import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; 
import * as dat from 'dat.gui';

// texture
// const image = new Image();
// const texture = new THREE.Texture(image);
// image.onload = () => {
//     texture.needsUpdate = true; // 让纹理更新，这样它就会使用新的图像了
// };
// image.src = '/textures/door/color.jpg';
// 后面对const materials = new THREE.MeshBasicMaterial({ map: texture }); 做了处理

// texture2
// 加一个loading manager来管理纹理的加载状态，这样我们就可以在加载完成后执行一些操作了，比如显示一个加载完成的提示或者隐藏一个加载中的动画。
// const loadingManager = new THREE.LoadingManager();
// loadingManager.onStart = () => {
//     console.log('开始加载纹理');
// };
// loadingManager.onLoad = () => {
//     console.log('纹理加载完成');
// };  
// loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
//     console.log(`正在加载纹理：${url}，已加载 ${itemsLoaded} / ${itemsTotal}`);
// };
// loadingManager.onError = (url) => {
//     console.log(`纹理加载错误：${url}`);
// };

// const textureLoader = new THREE.TextureLoader(loadingManager);
const textureLoader = new THREE.TextureLoader();
// 直接加载纹理，纹理加载器会自动处理图像的加载和更新，所以我们不需要手动创建一个Image对象了,可以添加多个纹理
const texture = textureLoader.load('/textures/door/color.jpg'); 
// 可以在路径后加3个问号来设置纹理的参数，比如：
// const texture = textureLoader.load('/textures/door/color.jpg???minFilter=NearestFilter&magFilter=NearestFilter&wrapS=RepeatWrapping&wrapT=RepeatWrapping');

// texture.repeat.x = 2; // 设置纹理在x轴上的重复次数，这样它就会在x轴上重复两次了
// texture.repeat.y = 3;
// texture.wrapS = THREE.RepeatWrapping; // 设置纹理在x轴上的重复模式，这样它就会在x轴上重复了
// texture.wrapT = THREE.RepeatWrapping; // 设置纹理在y轴上的重复模式，这样它就会在y轴上重复了

// texture.offset.x = 0.5; // 设置纹理在x轴上的偏移量，这样它就会在x轴上偏移了
// texture.offset.y = 0.5; // 设置纹理在y轴上的偏移量，这样它就会在y轴上偏移了

// texture.rotation = Math.PI / 4; // 设置纹理的旋转角度，这样它就会旋转45度了
// texture.center.x = 0.5; // 设置纹理的旋转中心点，这样它就会以纹理的中心为旋转中心了
// texture.center.y = 0.5;


// 滤镜和贴图映射
// 纹理的minFilter和magFilter属性分别控制纹理在缩小和放大时的过滤方式。常见的过滤方式有：NearestFilter（最近点过滤），LinearFilter（线性过滤），MipMapFilter（多级渐远纹理过滤）。不同的过滤方式会影响纹理的清晰度和性能，具体选择哪种过滤方式取决于你的应用场景和需求。
// mip mappping 用一个方形贴图时,会有多个大小的贴图,当物体离相机远时,使用小的贴图,当物体离相机近时,使用大的贴图,这样可以提高性能和视觉效果. mip mappping 需要纹理的宽高是2的幂次方,比如256x256,512x512等. 如果纹理的宽高不是2的幂次方,就不能使用mip mappping了,只能使用NearestFilter或LinearFilter了.
// minification filter（缩小过滤）控制纹理在物体离相机较远时的显示效果，常用的选项有：NearestFilter（最近点过滤）和 LinearFilter（线性过滤）。当物体离相机较远时，使用 NearestFilter 会让纹理看起来更模糊，而使用 LinearFilter 会让纹理看起来更平滑。对于性能要求较高的应用，可以选择 NearestFilter，而对于视觉效果要求较高的应用，可以选择 LinearFilter。
// magnification filter（放大过滤）控制纹理在物体离相机较近时的显示效果，常用的选项有：NearestFilter（最近点过滤）和 LinearFilter（线性过滤）。当物体离相机较近时，使用 NearestFilter 会让纹理看起来更模糊，而使用 LinearFilter 会让纹理看起来更平滑。对于性能要求较高的应用，可以选择 NearestFilter，而对于视觉效果要求较高的应用，可以选择 LinearFilter。
// 如果用minFilter,那么就不需要mipmap
texture.generateMipmaps = false; // 关闭mip mappping，这样就不会生成多个大小的贴图了
texture.minFilter = THREE.NearestFilter; // 设置纹理的缩小过滤方式，这样它在物体离相机较远时就会使用最近点过滤了
texture.magFilter = THREE.NearestFilter; // 设置纹理的放大过滤方式，这样物体放大时会更清晰
//  使用纹理的注意事项
// 1.纹理的大小 jpg 有损压缩,但是小 png 无损压缩,但是大  用一些软件压缩图片到合适的位置,博主推荐TinyPNG
// 2.图像的尺寸  纹理的宽高最好是2的幂次方，比如256x256、512x512等，这样可以更好地利用GPU的性能和内存。如果纹理的宽高不是2的幂次方，可能会导致性能下降或者无法使用某些功能，比如mip mappping。
// 3.纹理中的数据 透明纹理应用到材料的颜色属性,看是否需要设置alphaTest属性来控制透明度的阈值,如果纹理中有透明区域,但是没有正确设置alphaTest属性,可能会导致这些区域显示为黑色或者完全透明了,
// 法线纹理应用到材料的法线属性,看是否需要设置normalScale属性来控制法线纹理的强度,如果纹理中的法线数据过于强烈或者过于微弱,可能会导致物体表面的光照效果不自然了,环境贴图应用到材料的环境映射属性,看是否需要设置envMapIntensity属性来控制环境贴图的强度,如果纹理中的环境数据过于强烈或者过于微弱,可能会导致物体表面的反射效果不自然了
// 可以把data分别用 红 绿 蓝 透明通道 来存储不同的信息，比如：颜色信息可以存储在红绿蓝通道中，透明度信息可以存储在透明通道中，法线信息可以存储在红绿通道中，环境映射信息可以存储在蓝通道中等等。这样我们就可以在一个纹理中存储多种信息了，提高了效率和性能。
// 地形图在photoshop里做的
// texture在哪找 poliigon 3dtextures arroway-textures cc0textures 还有一些免费的纹理网站，像是Texture Haven、CC0 Textures、3DTextures.me等，这些网站提供了大量的免费纹理资源，可以用于个人和商业项目。你可以根据自己的需求选择合适的纹理，并且注意查看它们的使用许可和版权信息，以确保合法使用这些资源。




// dat.gui是一个轻量级的JavaScript库，可以帮助你快速创建一个用户界面来控制你的应用程序中的变量。它非常适合用于调试和开发阶段，让你可以实时调整参数并观察效果。在Three.js中，dat.gui常常被用来控制相机位置、物体属性、材质颜色等。
const gui = new dat.GUI();
const parameters = {
    color: 0xff0000,
    spin: () => {
        gsap.to(cube.rotation, { duration: 1, y: cube.rotation.y + Math.PI * 2 });
    }
}

// cursor的位置
const cursor = {
    x: 0,
    y: 0
}   
window.addEventListener('mousemove', (event) => {
    // event.clientX和event.clientY分别表示鼠标相对于浏览器窗口左上角的水平和垂直坐标。通过将它们除以窗口的宽度和高度，并减去0.5，我们可以将坐标范围从0到1转换为-0.5到0.5，这样就可以更方便地在Three.js中使用这些坐标来控制物体的位置或旋转。
    cursor.x = event.clientX / sizes.width - 0.5;   
    cursor.y = -(event.clientY / sizes.height - 0.5);
    // console.log(cursor);
});

const canvas = document.querySelector('.webgl');

/*
 +Y  ↑  上
            |
            |
            |______ +X  →  右
           /
          /
   +Z   朝向你（屏幕外
*/
// Create a scene
const scene = new THREE.Scene();
// 创建一个立方体，默认情况下，BoxGeometry会创建一个宽度、高度和深度都为1的立方体，并且在每个维度上分段数为1，这意味着每个面只有一个矩形。通过增加分段数，我们可以让立方体的表面更平滑，因为它会有更多的顶点和面来近似曲面。
// const geometry = new THREE.BufferGeometry(); // 创建一个空的几何体，我们将使用它来定义立方体的顶点和面

// const count = 50
// const positionsArray = new Float32Array(count * 3 * 3); // 每个三角形有3个顶点，每个顶点有3个坐标（x, y, z），所以总共有count * 3 * 3个坐标值
// for (let i = 0; i < count * 3 * 3; i++) {
//     positionsArray[i] = (Math.random() - 0.5) * 4; // 随机生成一个在-2到2之间的坐标值，这样我们就可以在一个范围内创建随机的三角形了
// }
// geometry.setAttribute('position', new THREE.BufferAttribute(positionsArray, 3)); // 将positionsArray作为几何体的position属性，第二个参数3表示每个顶点有3个坐标值
// const materials = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }); // wireframe: true表示只渲染线框，这样我们就可以看到立方体的边界线了


const geometry = new THREE.BoxGeometry(1, 1, 1,2,2,2); // 创建一个立方体几何体，参数分别是宽度、高度、深度，以及在每个维度上的分段数。分段数越多，立方体的表面就越平滑，但也会增加渲染的计算量。
// const materials = [
//     new THREE.MeshBasicMaterial({ color: 0xff0000 }), // 右 → 红
//     new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // 左 → 绿
//     new THREE.MeshBasicMaterial({ color: 0x0000ff }), // 上 → 蓝
//     new THREE.MeshBasicMaterial({ color: 0xffff00 }), // 下 → 黄
//     new THREE.MeshBasicMaterial({ color: 0xff00ff }), // 前 → 紫
//     new THREE.MeshBasicMaterial({ color: 0x00ffff }),  // 后 → 青
    
// ];
// const materials = new THREE.MeshBasicMaterial({ map: texture }); 

// shaders 
// 你可以使用ShaderMaterial来创建一个自定义的材质，这样你就可以编写自己的顶点着色器和片段着色器了。顶点着色器负责处理每个顶点的变换和属性，而片段着色器负责处理每个像素的颜色和光照效果。通过编写自己的着色器，你可以实现一些特殊的视觉效果，比如水面波纹、火焰效果、粒子系统等等。
/*
Object
*/
// const materials = new THREE.MeshBasicMaterial({color:0xff0000});
// const materials = new THREE.MeshBasicMaterial()
// materials.map = texture
// materials.color = new THREE.Color(0xff0000)
// materials.wireframe = true
// 透明度 alpha
// materials.opacity = 0.5
// materials.transparent = true
// alphamap 白色显示，黑色不显示
// materials.alphaMap = texture
// materials.side = THREE.DoubleSide

// const materials = new THREE.MeshNormalMaterial()
// materials.wireframe = true
// materials.flatShading = true

// const materials = new THREE.MeshMatcapMaterial()
// materials.matcap = texture

// const materials = new THREE.MeshDepthMaterial()

// const materials = new THREE.MeshLambertMaterial()

// const materials = new THREE.MeshPhongMaterial()
// materials.shininess =100
// materials.specular= new THREE.Color(0xff0000)

// const materials = new THREE.MeshToonMaterial()
// materials.gradientMap = texture 
const materials = new THREE.MeshStandardMaterial()
materials.metalness = 0.45
materials.roughness = 0.65
materials.map = texture
// 加深阴影部分
// materials.aoMap = texture1
// materials.aoMapIntensity = 2
// materials.displacementMap = texture2
// materials.displacementScale = 0.05 
// materials.metalnessMap = texture3
// materials.roughnessMap = texture4
// 增加细节
// materials.normalMap = texture5
// materials.normalScale.set(0.5,0.5)
materials.transparent = true
// 透明度
// materials.alphaMap = text6

// // 反射环境 HDRIHaven matheowis来变成多视角
// const textenv = cube.load([
//     '/textures/door/px.jpg',
//     '/textures/door/nx.jpg',
//     '/textures/door/py.jpg',
//     '/textures/door/ny.jpg',
//     '/textures/door/pz.jpg',
//     '/textures/door/nz.jpg',
// ])
// const materails = new THREE.MeshStandardMaterial()
// materails.metalness =0.7
// materails.roughness = 0.2
// materails.envMap = textenv


gui.add(materials,"metalness").min(0).max(1).step(0.0001)
gui.add(materials,"roughness").min(0).max(1).step(0.0001)



const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), materials);
sphere.position.x = -1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1,1),materials)

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3,0.2,16,32),materials)

torus.position.x =1.5
scene.add(sphere,plane,torus); 

// 光照
const amblight = new THREE.AmbientLight(0xffffff,1)
scene.add(amblight)
const pointLight = new THREE.PointLight(0xffffff,100)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)





// // geometry的库里有很多几何体，可以直接使用，比如：SphereGeometry（球体），PlaneGeometry（平面），TorusGeometry（圆环），等等。你也可以自己创建几何体，或者从外部文件加载几何体。
// const cube = new THREE.Mesh(geometry, materials);

// // gui设定一些属性的范围和步长，这样我们就可以在dat.gui的界面上调整这些属性了。比如，cube.position.x表示立方体在x轴上的位置，min(-3)表示最小值是-3，max(3)表示最大值是3，step(0.01)表示每次调整的步长是0.01，name('cube x position')表示在界面上显示的名称是'cube x position'。
// gui.add(cube.position, 'x').min(-3).max(3).step(0.01).name('cube x position'); 
// gui.add(cube.position, 'y').min(-3).max(3).step(0.01).name('cube y position'); 
// gui.add(cube.position, 'z').min(-3).max(3).step(0.01).name('cube z position'); 

// gui.add(cube,'visible').name('cube visible'); // 控制立方体的可见性
// // gui.add(materials,'wireframe').name('cube wireframe'); // 控制立方体的线框模式  

// gui.addColor(parameters, 'color').name('cube color').onChange(() => {
//     materials.forEach(material => {
//         material.color.set(parameters.color);
//     });
// });   

// gui.add(parameters, 'spin').name('cube spin'); // 控制立方体的旋转动画



// cube.position.set(0, 1, 0);
// cube.position.y = 1;
// scene.add(cube);
// cube.position.normalize(); // 让它的长度为1，保持它的朝向不变

// // 坐标轴辅助器
// const axesHelper = new THREE.AxesHelper(2);
// scene.add(axesHelper);

// 缩放物体的大小
// cube.scale.set(2, 1, 1); // x轴放大2倍，y轴和z轴不变

// 旋转物体
// 旋转顺序默认是 'XYZ'，先绕X轴旋转，再绕Y轴旋转，最后绕Z轴旋转。你可以通过cube.rotation.reorder('YXZ')来改变旋转顺序。
// cube.rotation.reorder('YXZ'); 
// // 旋转角度是以弧度为单位的，Math.PI / 2表示90度，Math.PI表示180度，Math.PI * 2表示360度。
// cube.rotation.x = Math.PI / 2; 
// cube.rotation.set(0,Math.PI / 2,  0);

// cube.rotation.z = Math.PI *2; 

// cube.rotation.x += 0.5;
// cube.rotation.z += 0.5;


// 旋转物体的另一种方式是使用四元数（quaternion）。四元数是一种数学表示方法，可以避免万向锁（gimbal lock）问题。
// cube.quaternion.setFromEuler(new THREE.Euler(Math.PI / 2, Math.PI / 2, Math.PI / 2));


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// 监听窗口大小变化，更新相机和渲染器的尺寸
window.addEventListener('resize', () => {
    // 更新尺寸
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;  
    // 更新相机
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    // 更新渲染器
    renderer.setSize(sizes.width, sizes.height);
    // 像素比 1,1个像素点，像素比 2，4个像素点
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 限制像素比，防止在高分辨率屏幕上渲染过慢
});

window.addEventListener('dblclick', () => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;       
    if (!fullscreenElement) {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen();
        }
    } else {        
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }       
    }
});

const aspectRatio = sizes.width / sizes.height;
// Create a camera 透视相机；数组相机 不同视角的渲染，多人游戏；立体相机 用2个相机渲染深度效果，模拟人眼，VR之类的；立方相机 6个方向的渲染，环境贴图之类的；正交相机 没有透视效果，物体远近看起来一样大，2D游戏之类的。
// perspective camera的参数：fov（视场角，单位是度，默认值是50），aspect（宽高比，默认值是1），near（近裁剪面，默认值是0.1），far（远裁剪面，默认值是2000）。只有在near和far之间的物体才会被渲染出来。
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
// orthographic camera的参数：left（左边界），right（右边界），top（上边界），bottom（下边界），near（近裁剪面），far（远裁剪面）。只有在near和far之间的物体才会被渲染出来。
// const camera = new THREE.OrthographicCamera(-6*aspectRatio, 6*aspectRatio, 6, -6, 0.1, 1000); 
scene.add(camera);
// camera.position.set(0, 0, 5);除非你改变它的朝向，否则它会一直朝向-z。camera.lookAt(cube.position) // 让相机一直朝向立方体
camera.position.z = 5;
// camera.position.y = 1;
// camera.position.x = 1;

// controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; // 让控制器有惯性，这样它就会在你停止操作后继续移动一段时间，感觉更自然
// controls.target.y = 1; // 让控制器的目标点在y轴上，默认是(0, 0, 0)，也就是立方体的位置，这样相机就会一直朝向立方体
// controls.update(); // 更新控制器，这样它就会根据新的目标点来调整相机的位置和朝向 

// Create a renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

//clock
const clock = new THREE.Clock();
// 旋转动画 npm install --save gsap@3.5.1 可以用来做动画的库，gsap.to()方法可以让你在一定时间内改变一个对象的属性值。
// gsap.to(cube.position, { duration: 1, delay: 1, x: 2 });
// gsap.to(cube.position, { duration: 1, delay: 2, x: 0 });
// gsap.to(cube.rotation, { duration: 1, delay: 3, y: Math.PI * 2 });
// 动画
function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 5; // 乘以5是为了放大效果，让相机移动更明显
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 5;
    // camera.position.y = cursor.y * 8; // 乘以5是为了放大效果，让相机移动更明显
    // camera.lookAt(cube.position); // 让相机一直朝向立方体

    // 直接调用类来 b

    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    // cube.rotation.z += 0.01;
    // cube.rotation.x = Math.sin(elapsedTime);

    sphere.rotation.y = 0.1*elapsedTime
    plane.rotation.y = 0.1*elapsedTime
    torus.rotation.y = 0.1*elapsedTime

    sphere.rotation.x = 0.15*elapsedTime
    plane.rotation.x = 0.15*elapsedTime
    torus.rotation.x = 0.15*elapsedTime


    renderer.render(scene, camera);
}
animate();