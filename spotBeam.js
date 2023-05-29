import * as THREE from 'three';
import  {OrbitControls}  from 'three/examples/jsm/controls/OrbitControls';
import {RGBELoader} from '../three.js-master/examples/jsm/loaders/RGBELoader.js';
import {GLTFLoader} from '../three.js-master/examples/jsm/loaders/GLTFLoader.js';          

class App{
    constructor(){
        this._setupThreeJs();
        this._setupCamera();
        this._setupLight();
        this._setupModel();
        this._setupControls();
        this._setupEvents();
        this._setupBackground()
    }
    _setupBackground(){
        new RGBELoader().load("https://sinjaesung.github.io/3DASSETtest/hansaplatz_4k.hdr",(texture)=>{
            texture.mapping=THREE.EquirectangularReflectionMapping;
            this._scene.background=texture;
            this._scene.environment=texture;

        });
    }
    _setupThreeJs(){
        const divContainer=document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const renderer=new THREE.WebGLRenderer({antialias: true});
        renderer.shadowMap.enabled=true;
        renderer.shadowMap.type = THREE.PCFShadowMap;

        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement);

        this._renderer=renderer;

        const scene=new THREE.Scene();
        this._scene=scene;

        const axisHelper=new THREE.AxesHelper(1000);
        scene.add(axisHelper);
    }
    _setupCamera(){
        
        const camera=new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            10000
        );

        camera.position.set(30,5,0)
        this._camera = camera;
    }
    _setupLight(){
        let ambLight=new THREE.AmbientLight(0x20dfdf,0.82);
        this._scene.add(ambLight);
        let cubebox=new THREE.Mesh(
            new THREE.BoxGeometry(2,2,2),
            new THREE.MeshPhongMaterial({color: 0x202020})
        );
        cubebox.position.set(20,20,20)
        cubebox.receiveShadow=true;

        const spotLight=new THREE.SpotLight(0x20dfdf,20);//default light target 0,0,0
        spotLight.position.set(25,40,0);
        spotLight.target=cubebox;
        spotLight.angle = Math.PI / 4;
        spotLight.penumbra= 2;
        spotLight.decay=1.2;
        spotLight.distance = 100;

        spotLight.castShadow= true;
        spotLight.shadow.mapSize.width=1024;
        spotLight.shadow.mapSize.height=1024;
        /*
        dirLight는 내부적카메라 오소그래픽카메라사용,spotLight는 퍼스펙티브카메라사용
        spotLight.shadow.camera.top=spotLight.shadow.camera.right=100;
        spotLight.shadow.camera.bottom=spotLight.shadow.camera.left=-100;*/
        spotLight.shadow.camera.near= 20;
        spotLight.shadow.camera.far = 200;
        spotLight.shadow.camera.fov = 50;//0~180사이추천.90넘어가면 이상함.

        spotLight.shadow.radius=3;
        spotLight.shadow.bias = -0.0005;

        this._scene.add(spotLight);
        this._scene.add(spotLight.target)
        const spotLightHelper=new THREE.SpotLightHelper(spotLight,'#fff');
        this._scene.add(spotLightHelper);
        const spotLightShadowcameraHelper=new THREE.CameraHelper(spotLight.shadow.camera);
        this._scene.add(spotLightShadowcameraHelper);
        window.onclick = ()=>{
            const video = document.getElementById("video");

            if(video.paused){
                video.play();
                const texture = new THREE.VideoTexture(video);
                spotLight.map = texture;
            }
        }

        this._spotLight=spotLight;
     }
    _setupModel(){
        new GLTFLoader().load("https://sinjaesung.github.io/3DASSETtest/character0another/character0HumanTransform.glb",(gltf)=>{
            const model = gltf.scene;

            if(model.children && model.children[0]){
                let model_3dObject=model.children[0];
                console.log("이건 어떠네?:",model_3dObject)
                model_3dObject.traverse(child=>{
                    console.log("childs는??:ㅣ",child)
                    if(child instanceof THREE.Mesh){
                        child.castShadow=true;
                        child.receiveShadow=true;

                        child.frustumCulled=false
                    }
                })
            }
           // model.scale.set(10,10,10);
          //  model.rotation.y = Math.PI / 2;
            this._scene.add(model);
        });

        const floor=new THREE.Mesh(
            new THREE.BoxGeometry(100,2,100),
            new THREE.MeshPhongMaterial({color: 0x202020})
        );
        floor.receiveShadow=true;
        floor.frustumCulled=false;//어떠한 차이점은 발견되지않음.랜더링되지않는카메라각도개념과좀 다른개념. 즉 지형에라가 쓰는것은 그럴필요없을듯.
        this._scene.add(floor);
        floor.position.set(0,-10,0)
    }
    _setupControls(){
        this._orbitControls= new OrbitControls(this._camera,this._divContainer);
        this._orbitControls.target.set(0,10,0)
    }
    _setupEvents(){
        window.onresize= this.resize.bind(this);
        this.resize();

        this._clock = new THREE.Clock();
        requestAnimationFrame(this.render.bind(this));
    }
    update(){
        const delta=this._clock.getDelta();
        this._orbitControls.update();

        //const time=this._clock.oldTime / 5000;
       // this._spotLight.position.x = Math.cos(time) * 50;
        //this._spotLight.position.z = Math.sin(time) * 50;
    }
    render(){
        this._renderer.render(this._scene,this._camera);
        this.update();

        requestAnimationFrame(this.render.bind(this));
    }
    resize(){
        const width=this._divContainer.clientWidth;
        const height=this._divContainer.clientHeight;

        this._camera.aspect= width/height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width,height);
    }
}

window.onload=function(){
    new App();
}