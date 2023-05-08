import * as THREE from 'three';
import {OrbitControls} from './three.js-master/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from './three.js-master/examples/jsm/loaders/GLTFLoader';

class animBase{
    constructor(characterSrc){
        const divContainer=document.querySelector('#character');
        this._divContainer=divContainer;

        const renderer=new THREE.WebGLRenderer({antialias:true});
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement);
        this._renderer=renderer;

        const scene=new THREE.Scene();
        this._scene=scene;

        this._setupCamera();
        this._setupLight();
        this._setupModel(characterSrc);
        this._setupControls();
        window.onresize= this.resize.bind(this);
        this.resize();

        requestAnimationFrame(this.render.bind(this));
    }
    _setupCamera(){
        const width=this._divContainer.clientWidth;
        const height=this._divContainer.clientHeight;

        const camera=new THREE.PerspectiveCamera(
            40,
            width / height,
            0.1,
            10000
        );
        camera.position.set(0,0,5)
        this._camera = camera;
    }
    _addPointLight(x,y,z,helperColor){
        const color=0xffffff;
        const intensity=0.5;

        const pointLight=new THREE.PointLight(color,intensity,2000);
        pointLight.position.set(x,y,z);

        this._scene.add(pointLight);

        const pointLightHelper=new THREE.PointLightHelper(pointLight,10,helperColor);
        this._scene.add(pointLightHelper);

    }
    _setupLight(){
        const ambientLight=new THREE.AmbientLight(0xffffff,0.8);
        this._scene.add(ambientLight);

       this._addPointLight(500,150,500,0xff0000);
       this._addPointLight(-500,150,500,0xffff00);
       this._addPointLight(-500,150,-500,0x00ff00);
       this._addPointLight(500,150,-500,0x0000ff);
       this._addPointLight(0,0,0,0x0000ff);

       const shadowLight=new THREE.DirectionalLight(0x80ef20,0.2);
       shadowLight.position.set(200,500,200);
       shadowLight.target.position.set(0,-100,0);
       const directionalLightHelper=new THREE.DirectionalLightHelper(shadowLight,10);
       this._scene.add(directionalLightHelper);

       this._scene.add(shadowLight);
       this._scene.add(shadowLight.target);

       shadowLight.castShadow=true;
       shadowLight.shadow.mapSize.width=1024;
       shadowLight.shadow.mapSize.height=1024;
       shadowLight.shadow.camera.top=shadowLight.shadow.camera.right=700;
       shadowLight.shadow.camera.bottom=shadowLight.shadow.camera.left=-700;
        shadowLight.shadow.camera.near=100;
        shadowLight.shadow.camera.far=900;
        shadowLight.shadow.radius=5;
        const shadowCameraHelper=new THREE.CameraHelper(shadowLight.shadow.camera);
        this._scene.add(shadowCameraHelper);
    }
    _setupControls(){
        new OrbitControls(this._camera,this._divContainer);
    }
    _setupModel(characterSrc){
        /*const geometry= new THREE.BoxGeometry(1,1,1);

        const material=new THREE.MeshPhongMaterial({color:0x44a88});
        const cube=new THREE.Mesh(geometry,material);

        this._scene.add(cube);
        this._cube = cube;*/
        const loader=new GLTFLoader();
        let mixer;
       
      
        loader.load(characterSrc,(gltf)=>{
            const model=gltf.scene;
            this._scene.add(model);

            console.log("gltf info:",gltf);
            mixer=new THREE.AnimationMixer(model);
            const clips=gltf.animations;
            const animationMaps={};
            console.log("animtaaitonss:",clips);
           // const clip=THREE.AnimationClip.findByName(clips,'HeadAction');
           // const action=mixer.clipAction(clip);
            //this._mixer=mixer;
            //action.play();
            this._mixer=mixer;
            clips.forEach(function(clip){
                console.log("{anim clip:",clip);
                const name=clip.name;
                console.log("what?:",mixer.clipAction(clip));
                animationMaps[name]=mixer.clipAction(clip);

                //const action=mixer.clipAction(clip);
                //action.play();
            });
            console.log("animationMaps:",animationMaps);
            const alwaysAnimationAction=animationMaps['idle'];
            console.log("alwaasgjasgasg:",alwaysAnimationAction)
            alwaysAnimationAction.play()
        },undefined,function(error){
            console.log('load error:',error);
        });
       
    }
    resize(){
        const width=this._divContainer.clientWidth;
        const height=this._divContainer.clientHeight;

        this._camera.aspect=width/height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width,height);
    }
    render(time){
        this._renderer.render(this._scene,this._camera);
        this.update(time);
        requestAnimationFrame(this.render.bind(this));
    }
    update(time){

        time *= 0.001; //second unit
       // console.log("update cubeingss:",time)
        //this._cube.rotation.x=time;
        //this._cube.rotation.y=time;
        if(this._mixer){
            const deltaTime=time - this._previousTime;
            this._mixer.update(deltaTime);
        }

        this._previousTime=time;
    }
}
export default animBase;
/*window.onload=function(){
    new App();
}*/