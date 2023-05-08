  
import * as THREE from 'three';

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "./three.js-master/examples/jsm/loaders/GLTFLoader.js"
import rigidBodies from './physics/RigidBodies.js';

import Stats from './three.js-master/examples/jsm/libs/stats.module.js';
import {RGBELoader} from './three.js-master/examples/jsm/loaders/RGBELoader.js';
import groundCollision from './physics/GroundCollision.js';
import  {TessellateModifier} from './three.js-master/examples/jsm/modifiers/TessellateModifier.js';
import { vertShader,fragShader,uniforms } from './shaders.js';

//import Enemy from './enemyClass.js';
import enemys from './enemys.js';import farenemys from './farenemys.js';import humanenemys from './humanenemys.js'; import anothercharacters from './anothercharacters.js';

import EnemyGLTF from './enemyGLTFClass.js';
import EnemyGLTF2 from './enemyGLTFClass2.js';
import AnotherCharacterGLTF from './AnotherCharacterGLTF.js'

import ParticleSystem from './particleModule.js';
import LineParticle from './RasierLineParticles.js';
import SphereParticle from './SphereParticle.js';
import SphereParticleYVertical from './SphereParticleYVertical.js';

class App {
    constructor() {
        //맵 씬 위치로드관련(캐릭터,카메라)
        console.log("PAGE로드시점에!!!:",location.search);
        //let formdatalist=document.getElementsByClassName("formdata");
        let character_object=JSON.parse(localStorage.getItem("characterdatabase"));
        localStorage.removeItem("characterdatabase");
        let datastore_object={};

        //암호화관련변경 start 20230506
        let characterface=document.getElementById("characterface");
        let charactername=document.getElementById("charactername");
        console.log("characerojbect:",character_object)
        for(let f in character_object){
            let form_item=character_object[f];
            console.log("form_item:",f,form_item);
            let originform=form_item;
           // var decrypt=CryptoJS.enc.Base64.parse(originform);
           // var hashData=decrypt.toString(CryptoJS.enc.Utf8);
            //originform=hashData;//암호화해제.
            console.log("orifinForm:",originform);
            let formvalue;
            if(originform.indexOf("{")!=-1){
                let JSON_parse=JSON.parse(originform);
                console.log("JSON PARSE:",JSON_parse);
                formvalue=JSON_parse;
            }else{
                formvalue=originform;
            }
            if(f==='face'){
                characterface.src=originform;
            }
            if(f==='cname'){
                charactername.innerText=originform;
            }
            datastore_object[f]=formvalue;
            //form_item.value="";
        }
        this.datastore_object=datastore_object;
         //암호화관련변경 start 20230506 
        //페이지로드관련(모든에셋들 몬스터,지형,캐릭터등등..)
        console.log("datastore_objectstatusss:",datastore_object);
        this.pageLoader=document.getElementById("pageLoader");
        this.loadmodels=[];


        this.threejsScene_animated=true;
        this.clock=new THREE.Clock();
        this.Time=new Date();
       // this.rigidBodies=[];
        this.meshes=[];
        this.meshMap= new WeakMap();

       
        /*
        캐릭터별 인자:hp,speed,무기기본공격력,basepower(곱량),폭발물기본공격력(발사체,폭발오브젝트자체콜리션 충돌뎀지),원격레이저기본공격력,defense,웨폰url,캐릭터트랜스폼url,캐릭터볼url,캐릭터폭발물url,캐릭터모델본 url,캐릭터emssive 컨셉색상(원격조준,변신기등등,폭발물등등)
        사운드:폭발사운드,무기사운드,레이저사운드,변신기사운드,캐릭터죽을떄&맞을때 등 사운드
        */
       this.type=datastore_object['type'];
       
       this.characterSrc=datastore_object['characterSrc'];
       this.characterTransformSrc=datastore_object['characterTransformSrc'];
       this.characterballExplodeSrc=datastore_object['characterballExplodeSrc'];
       this.characterballSrc=datastore_object['characterballSrc'];
       this.characterdefense=parseFloat(datastore_object['characterdefense']);
       this.characterhp=parseFloat(datastore_object['characterhp']);
       this.characterpower=parseFloat(datastore_object['characterpower']);
       this.characterspeed=parseFloat(datastore_object['characterspeed']);
       this.explodeObjectColor=datastore_object['explodeObjectColor'];
       this.explodepower=parseFloat(datastore_object['explodepower']);
       this.explosionSoundSrc=datastore_object['explosionSoundSrc'];
       this.explosion_effectColor=datastore_object['explosion_effectColor'];
       this.explosion_particleSize=parseFloat(datastore_object['explosion_particleSize']);
       this.explosion_particleSrc=datastore_object['explosion_particleSrc'];
       this.loadposx=parseFloat(datastore_object['loadposx']);
       this.loadposy=parseFloat(datastore_object['loadposy']);
       this.loadposz=parseFloat(datastore_object['loadposz']);
       this.mass=parseFloat(datastore_object['mass']);
       this.rasierSoundSrc=datastore_object['rasierSoundSrc'];
       this.rasier_effectColor=datastore_object['rasier_effectColor'];
       this.rasier_particleSrc=datastore_object['rasier_particleSrc'];
       this.rasierpower=parseFloat(datastore_object['rasierpower']);
        this.rasierexplode_particleSrc=datastore_object['rasierexplode_particleSrc'];
        this.rasierexplode_particleSize=parseFloat(datastore_object['rasierexplode_particleSize']);
        this.rasierParticleSize=parseFloat(datastore_object['rasierParticleSize']);
        
       this.transformSoundSrc=datastore_object['transformSoundSrc'];
       this.transform_effectColorend=datastore_object['transform_effectColorend'];
       this.transform_effectColorstart=datastore_object['transform_effectColorstart'];
       this.transform_emissiveColor=datastore_object['transform_emissiveColor'];
       this.transform_particleSrc=datastore_object['transform_particleSrc'];
       this.transform_particleSize=parseFloat(datastore_object['transform_particleSize']);
       this.weaponpowerflag=parseFloat(datastore_object['weaponpowerflag'])
       this.rasierpowerflag=parseFloat(datastore_object['rasierpowerflag'])

       this.transformpower=parseFloat(datastore_object['transformpower']);
       this.weaponSoundSrc=datastore_object['weaponSoundSrc'];
       this.weaponSrc=datastore_object['weaponSrc'];
       this.weapon_effectColor=datastore_object['weapon_effectColor'];

       this.weapon_particleSize=parseFloat(datastore_object['weapon_particleSize']);
       this.weapon_particleSrc=datastore_object['weapon_particleSrc'];
       this.weapon_xTanFlag=parseFloat(datastore_object['weapon_xTanFlag']);
       this.weapon_xamountshape=parseFloat(datastore_object['weapon_xamountshape']);
       this.weapon_ySinFlag=parseFloat(datastore_object['weapon_ySinFlag']);
       this.weapon_yamountshape=parseFloat(datastore_object['weapon_yamountshape']);
       this.weapon_zCosFlag=parseFloat(datastore_object['weapon_zCosFlag']);
       this.weapon_zamountshape=parseFloat(datastore_object['weapon_zamountshape']);
       this.weaponpower=parseFloat(datastore_object['weaponpower']);

        this.characterindex=parseInt(datastore_object['characterindex']);
        this.recoverpower=parseInt(datastore_object['recoverpower']);

       this.createRenderer()
       this.createScene()
       this.createCamera()
       this.createLights()
       this.startAmmo();
       this.setupControls();
       //this.setupBackground();
       this.pointer=new THREE.Vector2();

       window.onresize= this.onResize.bind(this);
       this.onResize()
        /*this.characterhp=15000; this.characterspeed=0.9; this.characterdefense=120; this.characterpower=1.5;
        this.weaponpower=520; this.explodepower=800; this.rasierpower=640;
         this.transformpower=140; this.mass=30;

         this.weapon_xamountshape;this.weapon_yamountshape;this.weapon_zamountshape;
         this.weapon_xTanFlag;this.weapon_ySinFlag;this.weapon_zCosFlag; this.weapon_particleSize;
         this.weapon_EffectColor; 
         this.explodeObject_color={
            'r': { value:0,addonRandom:0},
            'g': { value:0,addonRandom:0},
            'b': { value:0,addonRandom:0}
         }
         this.explosionEffect_color={
            'r':1,
            'g':0.3, 
            'b':1,
         }
         this.characterSrc; this.characterTransformSrc;this.characterballSrc;
         this.characterballexplodeSrc; this.weaponSrc;*/

       //충돌관련
        this.cbContactResult=null;

        //공용스킬 healingsound
        const audioListenerheal=new THREE.AudioListener();
        const healSound=new THREE.Audio(audioListenerheal);
        this.healSound=healSound;
        const audioLoaderheal=new THREE.AudioLoader();
        //'data/character1/explosion2.mp3'
        audioLoaderheal.load('https://sinjaesung.github.io/3DASSET/healsound.mp3',function(buffer){//폭발사운드 캐릭별 다르게
            healSound.setBuffer(buffer);
            healSound.setLoop(false);
            healSound.setVolume(3.6);
        });

        //스킬폭발관련
        this.explodesMaterials=[];//폭발물자체 전반적정보
        this.explodeTriggerMaterials=[];//폭발물트리거(캐릭터볼) 메시
        this.ExplodeEffectMaterials=[];//폭발충돌발생시 발생지점에 생길 폭발관련주변이펙트관련이펙트파티클
       
        const audioListener=new THREE.AudioListener();
        const explosionSound=new THREE.Audio(audioListener);
        this.explosionSound=explosionSound;
        const audioLoader=new THREE.AudioLoader();
        //'data/character1/explosion2.mp3'
        audioLoader.load(this.explosionSoundSrc,function(buffer){//폭발사운드 캐릭별 다르게
            explosionSound.setBuffer(buffer);
            explosionSound.setLoop(false);
            explosionSound.setVolume(0.9);
        });
        this._previousExplosionSound=0;

        //레이케스터 원격조준
        this.lineTriggerMaterials=[];
        const audioListener2=new THREE.AudioListener();
        const rasierSound=new THREE.Audio(audioListener2);
        this.rasierSound=rasierSound;
        const audioLoader2=new THREE.AudioLoader();
        //data/character1/fireSounds.mp3
        audioLoader2.load(this.rasierSoundSrc,function(buffer){//레이저사운드 다르게
            rasierSound.setBuffer(buffer);
            rasierSound.setLoop(false);
            rasierSound.setVolume(0.9);
        });

        //무기사운드관련(Fartype에겐 레이저사운드같이 어떠한 원격조준 형태 카메라캐릭터볼형태임)
        const audioListener3=new THREE.AudioListener();
        const WeaponSound=new THREE.Audio(audioListener3);
        this.WeaponSound=WeaponSound;
        const audioLoader3=new THREE.AudioLoader();
        //data/character1/fireWeaponsound.mp3
        audioLoader3.load(this.weaponSoundSrc,function(buffer){//무기공격성공시사운드 다르게
            WeaponSound.setBuffer(buffer);
            WeaponSound.setLoop(false);
            WeaponSound.setVolume(0.9);
        });
        //변신사운드
        const audioListener4=new THREE.AudioListener();
        const transformSound=new THREE.Audio(audioListener4);
        this.transformSound=transformSound;
        const audioLoader4=new THREE.AudioLoader();
        //data/character1/FireTransformSound.mp3
        audioLoader4.load(this.transformSoundSrc,function(buffer){//무기공격성공시사운드 다르게
            transformSound.setBuffer(buffer);
            transformSound.setLoop(false);
            transformSound.setVolume(2);
        });

        //몬스터관련
        this.monsterAnimData=[];//체크1.

        //this.monsterballbodyList=[];//체크2
        this.monsterCreatedBallList=[];//생성 몬스터볼(매번생성 삼초마다) 리스트.

        this.lineTriggerMaterialsMonster=[];//체크
        this.ExplodeEffectMaterialsMonster=[];//체크
        this.EnemyBuildingMaterials=[];//체크
        
        //프랜즈 관련
        this.friendsAnimData=[];


        //무기 회전량 관련
        this.x=0;this.y=0;this.z=0;
        this.WeaponCollisionTriggerMaterials=[];//체크


         //캐릭터 파워포스관련
         this.power_y=0;
        this.characterStatus=document.getElementById("characterstatus");
        this.hpstatus=document.getElementById("hpstatus");
        this.characterface=document.getElementById("characterface");

        this.Yskill=document.getElementById('Yskill')

        //포탈관련
        this.MoveAgree=true;
    }
    _onMouseMove(event){//raycaster원격조준관련
        const width=this._divContainer.clientWidth;
        const height=this._divContainer.clientHeight;

        const x=(event.offsetX / width) *2 -1;//-1~1범위 -1이면 좌측끝단,일이면 우측끝단
        const y=-(event.offsetY / height) *2 +1;//-1~1범위 -1이면 화면밑 1이면 화면상단(높은고도)

        //console.log("hahahahah monMousemove x,y mousepOisitionsss 노말라이즈:",x,y);
        //this._raycaster.cursorNormalizedPosition = {x,y};
        this.pointer.x = x;
        this.pointer.y = y;
    }  
    setupPicking(){//원격조준관련
        const raycaster=new THREE.Raycaster();

        this._divContainer.addEventListener("mousemove",this._onMouseMove.bind(this))
        //this._divContainer.addEventListener("mousedown",this._onMouseDown.bind(this))
        //this._divContainer.addEventListener("mouseup",this._onMouseUp.bind(this))

        this._raycaster=raycaster;
    }
   
    setupControls(){
        const stats=new Stats();
        this._divContainer.appendChild(stats.dom);
        this._fps=stats;

        this.controls= new OrbitControls(this.camera,this.renderer.domElement)
        this.controls.target.set(10,0,0);
        this.controls.enablePan=false;
        this.controls.enableDamping=true;

        this._pressedKeys={};

        document.addEventListener("keydown",(event)=>{
            if(event.key==='q' || event.key==='g' || /*event.key==='f' ||*/ event.key==='y' || event.key==='r'){
                this._pressedKeys[event.key.toLowerCase()]=false;
                this._pressedKeys[event.keyCode]=false;
            }else{
                this._pressedKeys[event.key.toLowerCase()]=true;
                this._pressedKeys[event.keyCode]=true;
            }
            this.processAnimation(event);    
        });
        document.addEventListener("keyup",(event)=>{
            if(event.key==='q' || event.key==='g' || /*event.key==='f' ||*/ event.key==='y'|| event.key==='r'){
                this._pressedKeys[event.key.toLowerCase()]=true;
                this._pressedKeys[event.keyCode]=true;
            }else{
                this._pressedKeys[event.key.toLowerCase()]=false;
                this._pressedKeys[event.keyCode]=false;
            }
           
            this.processAnimation(event);
        });

        this.setupPicking();//원거리 조준형 raycaster카메라
    }

    processAnimation(event){//이는 키다운,키업때만 호출된다.update 백그라운드 호출은 아니다!
        const previousAnimationAction=this._currentAnimationAction;
        const transformpreviousAnimationAction=this.charactertransform_mixer_currentAnimationAction;
        //const transformpreviousAnimationAction2=this.charactertransform_mixer_currentAnimationAction2;
        //const transformpreviousAnimationAction3=this.charactertransform_mixer_currentAnimationAction3;

      //  console.log("prcessAnimationsss:",this.character_move_status,previousAnimationAction)
      let myfriends=this.friendsAnimData;
        if(this.character_move_status=='normal' && groundCollision['value']==true){
            if(this._pressedKeys['w'] || this._pressedKeys['a'] || this._pressedKeys['s'] || this._pressedKeys['d']){
               // console.log("wsad키 누른경우");
                if(this._pressedKeys['shift']){
                    //console.log(`달리기한경우로 ${previousAnimationAction&&previousAnimationAction._clip.name?previousAnimationAction._clip.name:null}에서 run으로 변경`);
                    this._currentAnimationAction=this._animationMap['run']?this._animationMap['run']:this._animationMap['idle'];
                    this.charactertransform_mixer_currentAnimationAction=this.charactertransform_mixer_animationMap['run']?this.charactertransform_mixer_animationMap['run']:this.charactertransform_mixer_animationMap['idle'];
                    //this.charactertransform_mixer_currentAnimationAction2=this.charactertransform_mixer_animationMap2['run']?this.charactertransform_mixer_animationMap2['run']:this.charactertransform_mixer_animationMap2['idle'];
                    //this.charactertransform_mixer_currentAnimationAction3=this.charactertransform_mixer_animationMap3['run']?this.charactertransform_mixer_animationMap3['run']:this.charactertransform_mixer_animationMap3['idle'];
                    
                    for(let f=0; f<myfriends.length; f++){
                        let item=myfriends[f];
                        let previous_AnimAction=item.currentAnimAction;
                        let current_AnimAction=item.animMap['run']?item.animMap['run']:item.animMap['idle'];

                        //previous_AnimAction.fadeOut(0.5);
                        //let now_AnimAction=item.animMap['jumpFly'];
                        //now_AnimAction.reset().fadeIn(0.5).play();
                       // item.currentAnimAction=now_AnimAction;
                       console.log("previousAnimaction,currentAnimAction:",previous_AnimAction,current_AnimAction);

                        if(previous_AnimAction !== current_AnimAction){
                            console.log("기존Anim상태 폐기:",previous_AnimAction)

                            previous_AnimAction.fadeOut(0.5);
                            current_AnimAction.reset().fadeIn(0.5).play();
                        }  
                        item.currentAnimAction=current_AnimAction;
                    }
                }else{
                    //console.log(`걷기하는경우로 ${previousAnimationAction&&previousAnimationAction._clip.name?previousAnimationAction._clip.name:null}에서 walk으로 변경`);
                    this._currentAnimationAction=this._animationMap['walk']?this._animationMap['walk']:this._animationMap['idle'];
                    this.charactertransform_mixer_currentAnimationAction=this.charactertransform_mixer_animationMap['walk']?this.charactertransform_mixer_animationMap['walk']:this.charactertransform_mixer_animationMap['idle'];
                    //this.charactertransform_mixer_currentAnimationAction2=this.charactertransform_mixer_animationMap2['walk']?this.charactertransform_mixer_animationMap2['walk']:this.charactertransform_mixer_animationMap2['idle'];
                    //this.charactertransform_mixer_currentAnimationAction3=this.charactertransform_mixer_animationMap3['walk']?this.charactertransform_mixer_animationMap3['walk']:this.charactertransform_mixer_animationMap3['idle'];

                    for(let f=0; f<myfriends.length; f++){
                        let item=myfriends[f];
                        let previous_AnimAction=item.currentAnimAction;
                        let current_AnimAction=item.animMap['walk']?item.animMap['walk']:item.animMap['idle'];

                        //previous_AnimAction.fadeOut(0.5);
                        //let now_AnimAction=item.animMap['jumpFly'];
                        //now_AnimAction.reset().fadeIn(0.5).play();
                       // item.currentAnimAction=now_AnimAction;
                       console.log("previousAnimaction,currentAnimAction:",previous_AnimAction,current_AnimAction);

                        if(previous_AnimAction !== current_AnimAction){
                            console.log("기존Anim상태 폐기:",previous_AnimAction)

                            previous_AnimAction.fadeOut(0.5);
                            current_AnimAction.reset().fadeIn(0.5).play();
                        }  
                        item.currentAnimAction=current_AnimAction;
                    }
                }
                this.isdanceTime=false;//댄싱타임해제.
            }else{
                if(this.isdanceTime){
                    console.log(`아무것도 안누른경우로써 dancingtime또한 true`,this.isdanceTime);
                    this._currentAnimationAction=this._animationMap['rest'];
                    //this.charactertransform_mixer_currentAnimationAction2=this.charactertransform_mixer_animationMap2['idle']?this.charactertransform_mixer_animationMap2['idle']:this.charactertransform_mixer_animationMap2['idle'];
                    // this.charactertransform_mixer_currentAnimationAction3=this.charactertransform_mixer_animationMap3['idle']?this.charactertransform_mixer_animationMap3['idle']:this.charactertransform_mixer_animationMap3['idle'];
                    for(let f=0; f<myfriends.length; f++){
                        let item=myfriends[f];
                        let previous_AnimAction=item.currentAnimAction;
                        let current_AnimAction=item.animMap['rest']?item.animMap['rest']:item.animMap['idle'];

                        //previous_AnimAction.fadeOut(0.5);
                        //let now_AnimAction=item.animMap['jumpFly'];
                        //now_AnimAction.reset().fadeIn(0.5).play();
                        // item.currentAnimAction=now_AnimAction;
                        console.log("previousAnimaction,currentAnimAction:",previous_AnimAction,current_AnimAction);

                        if(previous_AnimAction !== current_AnimAction){
                            console.log("기존Anim상태 폐기:",previous_AnimAction)
                            previous_AnimAction.fadeOut(0.5);
                            current_AnimAction.reset().fadeIn(0.5).play();
                        }  
                        item.currentAnimAction=current_AnimAction;
                    }
                }else{
                    console.log(`아무것도 안누른경우로써 ${previousAnimationAction&&previousAnimationAction._clip.name?previousAnimationAction._clip.name:null}에서 idle으로 변경 dancingtime또한 false`,this.isdanceTime);
                    this._currentAnimationAction=this._animationMap['idle'];
                    this.charactertransform_mixer_currentAnimationAction=this.charactertransform_mixer_animationMap['idle']?this.charactertransform_mixer_animationMap['idle']:this.charactertransform_mixer_animationMap['idle'];
                    //this.charactertransform_mixer_currentAnimationAction2=this.charactertransform_mixer_animationMap2['idle']?this.charactertransform_mixer_animationMap2['idle']:this.charactertransform_mixer_animationMap2['idle'];
                    // this.charactertransform_mixer_currentAnimationAction3=this.charactertransform_mixer_animationMap3['idle']?this.charactertransform_mixer_animationMap3['idle']:this.charactertransform_mixer_animationMap3['idle'];
                    for(let f=0; f<myfriends.length; f++){
                        let item=myfriends[f];
                        let previous_AnimAction=item.currentAnimAction;
                        let current_AnimAction=item.animMap['idle']?item.animMap['idle']:item.animMap['idle'];

                        //previous_AnimAction.fadeOut(0.5);
                        //let now_AnimAction=item.animMap['jumpFly'];
                        //now_AnimAction.reset().fadeIn(0.5).play();
                        // item.currentAnimAction=now_AnimAction;
                        console.log("previousAnimaction,currentAnimAction:",previous_AnimAction,current_AnimAction);

                        if(previous_AnimAction !== current_AnimAction){
                            console.log("기존Anim상태 폐기:",previous_AnimAction)
                            previous_AnimAction.fadeOut(0.5);
                            current_AnimAction.reset().fadeIn(0.5).play();
                        }  
                        item.currentAnimAction=current_AnimAction;
                    }
                }
                
            }

        }

        if(this._pressedKeys['q'] && !this._pressedKeys['shift']){
            //console.log("&&&캐릭터 기술 발사체 발사!!######");//원거리 투척형
            //console.log(`${previousAnimationAction&&previousAnimationAction._clip.name?previousAnimationAction._clip.name:null}에서 shot으로 변경`,eventtype);
            this._currentAnimationAction=this._animationMap['shot']?this._animationMap['shot']:this._animationMap['idle'];
            this.charactertransform_mixer_currentAnimationAction=this.charactertransform_mixer_animationMap['shot']?this.charactertransform_mixer_animationMap['shot']:this.charactertransform_mixer_animationMap['idle'];
            //this.charactertransform_mixer_currentAnimationAction2=this.charactertransform_mixer_animationMap2['shot']?this.charactertransform_mixer_animationMap2['shot']:this.charactertransform_mixer_animationMap2['idle'];
            //this.charactertransform_mixer_currentAnimationAction3=this.charactertransform_mixer_animationMap3['shot']?this.charactertransform_mixer_animationMap3['shot']:this.charactertransform_mixer_animationMap3['idle'];
             
            this._createSkill();

            this.isdanceTime=false;
        }
        if(this._pressedKeys['f']){
            //console.log("&&&캐릭터 기술 발사체 발사!!######");//원거리 투척형
            //console.log(`${previousAnimationAction&&previousAnimationAction._clip.name?previousAnimationAction._clip.name:null}에서 shot으로 변경`,eventtype);
            this._currentAnimationAction=this._animationMap['shot']?this._animationMap['shot']:this._animationMap['idle'];
            this.charactertransform_mixer_currentAnimationAction=this.charactertransform_mixer_animationMap['shot']?this.charactertransform_mixer_animationMap['shot']:this.charactertransform_mixer_animationMap['idle'];
            //this.charactertransform_mixer_currentAnimationAction2=this.charactertransform_mixer_animationMap2['shot']?this.charactertransform_mixer_animationMap2['shot']:this.charactertransform_mixer_animationMap2['idle'];
           // this.charactertransform_mixer_currentAnimationAction3=this.charactertransform_mixer_animationMap3['shot']?this.charactertransform_mixer_animationMap3['shot']:this.charactertransform_mixer_animationMap3['idle'];
           
            this._createSkillFar();

            this.isdanceTime=false;

        }if(this._pressedKeys['t']){
            //console.log("&&&캐릭터 무기 공격!!######");//근거리형
            //console.log(`${previousAnimationAction&&previousAnimationAction._clip.name?previousAnimationAction._clip.name:null}에서 weapon으로 변경`,eventtype);
            if(!this.type || this.type!='Far'){
                this._currentAnimationAction=this._animationMap['weapon']?this._animationMap['weapon']:this._animationMap['idle'];
                this.charactertransform_mixer_currentAnimationAction=this.charactertransform_mixer_animationMap['weapon']?this.charactertransform_mixer_animationMap['weapon']:this.charactertransform_mixer_animationMap['idle'];
                //this.charactertransform_mixer_currentAnimationAction2=this.charactertransform_mixer_animationMap2['weapon']?this.charactertransform_mixer_animationMap2['weapon']:this.charactertransform_mixer_animationMap2['idle'];
               // this.charactertransform_mixer_currentAnimationAction3=this.charactertransform_mixer_animationMap3['weapon']?this.charactertransform_mixer_animationMap3['weapon']:this.charactertransform_mixer_animationMap3['idle'];
            }
            this.isdanceTime=false;
        }
       
        if(this._pressedKeys['g'] && event.key==='g'){
            console.log("&&&캐릭터 변신각성!!######");//근거리형
            //console.log(`${previousAnimationAction&&previousAnimationAction._clip.name?previousAnimationAction._clip.name:null}에서 weapon으로 변경`,eventtype);
            //this._currentAnimationAction=this._animationMap['weapon']?this._animationMap['weapon']:this._animationMap['idle'];

            if(this.character_isOverpower){
                this.character_isOverpower=false;
            }else{
                if(this.transformSound.isPlaying){
                    this.transformSound.offset=0;
                    this.transformSound.play();
                }else{
                    this.transformSound.pause();
                    this.transformSound.offset=0;
        
                    this.transformSound.play();
                }
                this.character_isOverpower=true;
            }
             this.isdanceTime=false;
        }
    
        if(this._pressedKeys['y'] && event.key==='y'){
            console.log("withg프렌즈 !!:",this.friendsAnimData,this.character_withfriends);

            if(this.friendsAnimData.length>=1){
                console.log("친구추가처리가 된 맵에 대해서만 한해서 관련 기능 처리: 토글링ㅇ로써 껏다가 켰다가 할수있고 이게 그러함.");
                if(this.character_withfriends){
                    this.character_withfriends=false;
                }else{
                    this.character_withfriends=true;
                }
            }else{
                console.log("친구추가되어있지 않은 맵 상황에선 해당 기능 처리하지않음!!!!");
            }
            console.log("처리된 charactwerithfirendss:",this.character_withfriends);

        }
       
        if(this._pressedKeys['r'] && event.key==='r'){
            console.log("===============================모든 동작 초기화 reset w,s,a,d,32키 눌렸떤것으로 인해 오작동하는 여러 특정상황에서의 저절로 멋대로 움직이고 점프하는것 초기화:=====================")
            this._pressedKeys['w']=false;
            this._pressedKeys['s']=false;
            this._pressedKeys['a']=false;
            this._pressedKeys['d']=false;
            this._pressedKeys[32]=false;
            this.isjumping=false;

            let charactertransform1=this.charactertransform;
            //let charactertransform2=this.charactertransform2;
            //let charactertransform3=this.charactertransform3;

            charactertransform1.position.set(150,30,30);
            //charactertransform2.position.set(150,30,30);
            //charactertransform3.position.set(150,30,30);

            console.log("&&&캐릭터 댄싱타임!!######");//근거리형
            //console.log(`${previousAnimationAction&&previousAnimationAction._clip.name?previousAnimationAction._clip.name:null}에서 weapon으로 변경`,eventtype);
            //this._currentAnimationAction=this._animationMap['weapon']?this._animationMap['weapon']:this._animationMap['idle'];

            if(this.healSound.isPlaying){
                this.healSound.offset=0;
                this.healSound.play();
            }else{
                this.healSound.pause();
                this.healSound.offset=0;
    
                this.healSound.play();
            }
            
            if(this.isdanceTime){
                //댄스타임 해제하려고 다시 r눌렀으면
                this.isdanceTime=false;
                this._currentAnimationAction=this._animationMap['idle'];
                //this.charactertransform_mixer_currentAnimationAction2=this.charactertransform_mixer_animationMap2['idle']?this.charactertransform_mixer_animationMap2['idle']:this.charactertransform_mixer_animationMap2['idle'];
                // this.charactertransform_mixer_currentAnimationAction3=this.charactertransform_mixer_animationMap3['idle']?this.charactertransform_mixer_animationMap3['idle']:this.charactertransform_mixer_animationMap3['idle'];
                for(let f=0; f<myfriends.length; f++){
                    let item=myfriends[f];
                    let previous_AnimAction=item.currentAnimAction;
                    let current_AnimAction=item.animMap['idle']?item.animMap['idle']:item.animMap['idle'];

                    //previous_AnimAction.fadeOut(0.5);
                    //let now_AnimAction=item.animMap['jumpFly'];
                    //now_AnimAction.reset().fadeIn(0.5).play();
                    // item.currentAnimAction=now_AnimAction;
                    console.log("previousAnimaction,currentAnimAction:",previous_AnimAction,current_AnimAction);

                    if(previous_AnimAction !== current_AnimAction){
                        console.log("기존Anim상태 폐기:",previous_AnimAction)
                        previous_AnimAction.fadeOut(0.5);
                        current_AnimAction.reset().fadeIn(0.5).play();
                    }  
                    item.currentAnimAction=current_AnimAction;
                }
            }else{
                this.isdanceTime=true;
                this._currentAnimationAction=this._animationMap['rest'];
                //this.charactertransform_mixer_currentAnimationAction2=this.charactertransform_mixer_animationMap2['idle']?this.charactertransform_mixer_animationMap2['idle']:this.charactertransform_mixer_animationMap2['idle'];
                // this.charactertransform_mixer_currentAnimationAction3=this.charactertransform_mixer_animationMap3['idle']?this.charactertransform_mixer_animationMap3['idle']:this.charactertransform_mixer_animationMap3['idle'];
                for(let f=0; f<myfriends.length; f++){
                    let item=myfriends[f];
                    let previous_AnimAction=item.currentAnimAction;
                    let current_AnimAction=item.animMap['rest']?item.animMap['rest']:item.animMap['idle'];

                    //previous_AnimAction.fadeOut(0.5);
                    //let now_AnimAction=item.animMap['jumpFly'];
                    //now_AnimAction.reset().fadeIn(0.5).play();
                    // item.currentAnimAction=now_AnimAction;
                    console.log("previousAnimaction,currentAnimAction:",previous_AnimAction,current_AnimAction);

                    if(previous_AnimAction !== current_AnimAction){
                        console.log("기존Anim상태 폐기:",previous_AnimAction)
                        previous_AnimAction.fadeOut(0.5);
                        current_AnimAction.reset().fadeIn(0.5).play();
                    }  
                    item.currentAnimAction=current_AnimAction;
                }
            }
            console.log('====적용dancingtime:',this.isdanceTime);
        }
        
        if(previousAnimationAction !== this._currentAnimationAction){
            previousAnimationAction.fadeOut(0.5);
            this._currentAnimationAction.reset().fadeIn(0.5).play();
            //키다운,키업으로 직접 걷기에서 달리기,달리기 걷기,걷기 아이들,달리기 아이들,점프한경우,캐릭터기술발사 등의 경우엔 수동적으로 애니메이션전환 action,play 능동실행한다. 그외에는 passive적인 상태변경으로 인한 currenationAcdtionAction변경으로인한 자동수행.
        }
        if(transformpreviousAnimationAction !== this.charactertransform_mixer_currentAnimationAction){
            transformpreviousAnimationAction.fadeOut(0.5);
            this.charactertransform_mixer_currentAnimationAction.reset().fadeIn(0.5).play();
            
            //키다운,키업으로 직접 걷기에서 달리기,달리기 걷기,걷기 아이들,달리기 아이들,점프한경우,캐릭터기술발사 등의 경우엔 수동적으로 애니메이션전환 action,play 능동실행한다. 그외에는 passive적인 상태변경으로 인한 currenationAcdtionAction변경으로인한 자동수행.
        }   

    }
    //걷기,달리기->점프스타트, 점프스타트->점프업(전환)/점프업->점프다운(전환)/점프다운->
    _createSkill(Ammo=this.ammoClone) {
       
        console.log("캐릭터가 바라보고있는방향벡터:",this.walkDirection,this.cameraDirection,this.physicsWorld);
        console.log("캐릭터 위치:",this.character1.position.x,this.character1.position.y,this.character1.position.z);
        let character_pos_origin={
            'x':this.character1.position.x,
            'y':this.character1.position.y,
            'z':this.character1.position.z
        }
        const quat = { x: 0, y: 0, z: 0, w: 1 };
        const mass = 1.5;
        
        //================================================
       // const mesh2= new THREE.BoxGeometry(3.6,3.6,3.6);  
        // const mesh2= new THREE.BoxGeometry(3.6,3.6,3.6);  
        let ball2 = this.characterballMesh.clone();//캐릭마다 다른 볼메시
        this.characterballMeshUpdated=ball2;
        const characterballbox=(new THREE.Box3).setFromObject(ball2);
        console.log("characterblalbox??:",characterballbox);
        this.scene.add(ball2);

       let calc_x=characterballbox.max.x- characterballbox.min.x;
       let calc_y=characterballbox.max.y- characterballbox.min.y;
       let calc_z=characterballbox.max.z- characterballbox.min.z;
       let max_size=Math.max(calc_x,calc_y,calc_z);
        console.log("계산된 캐릭터볼박스크기:",calc_x,calc_y,calc_z);
        //const material2=new THREE.MeshPhongMaterial({color:0xfe1010});
       // const ball2=new THREE.Mesh(mesh2,material2);
       

       //const rotateQuaternion=new THREE.Quaternion();
       //let angleBallDirectionAxisY = Math.atan2(ball2.position.x - this.character1.position.x, ball2.position.z - this.character1.position.z);
       //angleBallDirectionAxisY= angleBallDirectionAxisY - Math.PI
       /*rotateQuaternion.setFromAxisAngle(
           new THREE.Vector3(0,1,0),angleBallDirectionAxisY
       );
       ball2.quaternion.rotateTowards(rotateQuaternion,THREE.MathUtils.degToRad(5))*/


        let fake_uniforms2={
            amplitude: { value: 0.0}
        }
    
        ball2.position.set(character_pos_origin.x, character_pos_origin.y+6+(calc_y*2), character_pos_origin.z+(this.walkDirection.z*10));
        const transform2 = new Ammo.btTransform();
        transform2.setIdentity();
        transform2.setOrigin(new Ammo.btVector3(character_pos_origin.x, character_pos_origin.y+6+(calc_y*2), character_pos_origin.z+(this.walkDirection.z*10)));
        //transform2.setOrigin(new Ammo.btVector3(0,0,0));

        transform2.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));

        const motionState2 = new Ammo.btDefaultMotionState(transform2);
       // const colShape = this._createAmmoShapeFromMesh2(ball,character_pos_origin,quat,null,Ammo);
       const colShape2=new Ammo.btBoxShape(new Ammo.btVector3(calc_x*0.5,calc_y*0.5,calc_z*0.5));

        console.log("creating colShapess:!: and createBall",colShape2,ball2)

        colShape2.setMargin(0.01);
        const localInertia2 = new Ammo.btVector3(0,0,0);
        colShape2.calculateLocalInertia(mass, localInertia2);
      
        const rbInfo2 = new Ammo.btRigidBodyConstructionInfo(mass, motionState2, colShape2, localInertia2);
        const ballbody2 = new Ammo.btRigidBody(rbInfo2);
       
        this.physicsWorld.addRigidBody(ballbody2);

        ballbody2.setFriction(1);
        ballbody2.setRollingFriction(0.8);
        ballbody2.setRestitution(0.9);
        ballbody2.setActivationState(4);

        ball2.userData.physicsBody = ballbody2;
        ball2.userData.type='characterballcamera';
        ball2.userData.tag='characterballcamera';
        ball2.userData.ObjectType='characterballcamera';
        ball2.userData.isExplode='no';

        ballbody2.threeObject=ball2;


        console.log("skill볼생성 시간:",new Date().getTime());
        ball2.userData.createTime=new Date().getTime();
        rigidBodies.push(ball2);
        this.explodeTriggerMaterials.push({
            'mesh':ball2,//userData.physicsBody
            //'uniforms':local_uniforms,
            'fakeuniforms':fake_uniforms2,
            'create':new Date().getTime()
        });

       // const force = new Ammo.btVector3(character_pos_origin.x, 0, character_pos_origin.z);
       // console.log("캐릭터 서있는 오리진위치로부터의 힘발사로 진행:",character_pos_origin.x, character_pos_origin.y+5, character_pos_origin.z,force);
     
        //카메라방향형
        let pos_target_x2=this.cameraDirection.x * 80;
        let pos_target_z2=this.cameraDirection.z * 80;
        let pos_target_y2=this.cameraDirection.y * 70;
        console.log("targetPos2::cameraDirection",pos_target_x2,pos_target_y2,pos_target_z2);
        ballbody2.setLinearVelocity(new Ammo.btVector3(pos_target_x2,pos_target_y2,pos_target_z2));
        //ballbody2.applyForce(targetforcecamera,forcecamera);
       // ballbody2.setLinearVelocity(new Ammo.btVector3(pos_target_x2,pos_target_y2,pos_target_z2));

        this.chracterballbody2=ballbody2;//카메라뷰방향형

    }
   
    _createSkillFar(Ammo=this.ammoClone) {
       
        console.log("캐릭터가 바라보고있는방향벡터:",this.walkDirection,this.cameraDirection,this.physicsWorld);
        console.log("캐릭터 위치:",this.character1.position.x,this.character1.position.y,this.character1.position.z);
        let character_pos_origin={
            'x':this.character1.position.x,
            'y':this.character1.position.y,
            'z':this.character1.position.z
        }
     
        console.log("캐릭터 원거리폭발조준 스킬형태 발생시에 레이케스터 하하하히히히히호호호:",this._raycaster,this.pointer);
        this._raycaster.setFromCamera(this.pointer,this.camera);
        let intersects=this._raycaster.intersectObjects(this.scene.children);//모든 scene이 자식들중에서의 상호작용상태.
        console.log("raycaster 현재 카메라사상반영 차원뷰정보에서의 intersects정보:",intersects);

        let first_respond_force={};
        let user_rasier_power=this.character1&&this.character1.userData&&this.character1.userData.rasierpower;
        let rasierpowerflag=this.character1&&this.character1.userData&&this.character1.userData.rasierpowerflag;
        
        user_rasier_power=user_rasier_power*rasierpowerflag;//원거리형은 무기공격(t)불가한 대신에 조준공격강하게
        let user_base_power=this.character1&&this.character1.userData&&this.character1.userData.power;
        let powerflag= this.character_isOverpower ? 3 : 1;

        for(let i=0; i<intersects.length; i++){
            let intersect_objects=intersects[i];
            //가장 앞엥  있는게 현재 화면에서 뷰차원에서 가장 가까이 있는 존재이고 가장 뒤에있는게 가장 멀리 있는 대상체일것이다. 이들중에서 타입을 기준으로판별
            let distance=intersect_objects.distance;
            let object_real=intersect_objects.object;
            let object_real_position=object_real.position;
            let object_type=object_real.userData.ObjectType;
            let object_primitivetype=object_real.type;
            let intersects_point=intersect_objects.point;
           
            if(object_type==='terrain'||object_type==='enemybody' || object_type==='anothercharacter' || object_type=== 'GLTF_EnemyDestroyBuilding' || object_type==='anothercharacterStatic'){
                console.log('=============================================raycaster interscectss sstartssssss===================')
                console.log("하하 반응요소들중에서 가장 앞에있는것은 가장가까운반응체,뒤에있는게 가장 멀리있는 반응체이다:",object_real.userData,object_real.type);
                console.log("object_real_pos:",object_real_position);
                console.log("오브젝트와의 현재 거리:",distance);
                console.log("캐릭터 현재 위치??:",this.character1.position.x,this.character1.position.y,this.character1.position.z);
                console.log("반응한 오브젝트의 타입형태:",object_type,object_primitivetype);
                console.log("raycaster가 반응한 poiints지점 이 지점까지 캐릭터위치에서 직선 생성해서 그 위치로",intersects_point);
                //line drawingsss!!!!!

                let color=new THREE.Color();//캐릭별로 색상,레이저파티클다르게.레이저(원격조준)사운드도 다르게
                //color.setRGB(1,0.3,0);
                color.setRGB(this.rasier_effectColor['r'],this.rasier_effectColor['g'],this.rasier_effectColor['b']);

                const material= new THREE.LineBasicMaterial( { 
                    color: color ,
                    linewidth: 1,
                });
                let pos_target_x=intersects_point['x'];
                let pos_target_z=intersects_point['z'];
                let pos_target_y=intersects_point['y'];
                const points = [];
                points.push( new THREE.Vector3( character_pos_origin.x,character_pos_origin.y,character_pos_origin.z ) );
                points.push( new THREE.Vector3( pos_target_x,pos_target_y,pos_target_z ) );
                const geometry = new THREE.BufferGeometry().setFromPoints( points );
                const line = new THREE.Line( geometry, material );

                first_respond_force['x']=pos_target_x
                first_respond_force['y']=pos_target_y
                first_respond_force['z']=pos_target_z

                let x_distance=pos_target_x - character_pos_origin.x;
                let y_distance=pos_target_y - character_pos_origin.y;
                let z_distance=pos_target_z - character_pos_origin.z;
                let x_start=character_pos_origin.x;
                let y_start=character_pos_origin.y;
                let z_start=character_pos_origin.z;
             
                this.scene.add( line );

                let fake_uniforms={
                    amplitude: { value: 0.0}
                }
               
                let size=this.rasierParticleSize;//this.rasierParticleSize=6
                //./resources/character1/fire.jpg
                let linePoints=new LineParticle(this.rasier_particleSrc,x_distance,y_distance,z_distance,x_start,y_start,z_start,color,size);//원격조준과 폭발은 공통으로 가고, 무기이펙만 다르게!!
                console.log("linePoinstss??:",linePoints,linePoints._points)
                this.scene.add(linePoints._points)

                this.lineTriggerMaterials.push({
                    'mesh':line,//userData.physicsBody
                    //'uniforms':local_uniforms,
                    'fakeuniforms':fake_uniforms,
                    'create':new Date().getTime()
                }); 
                this.lineTriggerMaterials.push({
                    'mesh':linePoints._points,//userData.physicsBody
                    //'uniforms':local_uniforms,
                    'fakeuniforms':fake_uniforms,
                    'create':new Date().getTime()
                });
                break;//가장 첫 반응한것 하나에 대해서만 찾아서 그 위치에 관련해서 하나만 라인트리거생성.
            }
        }
        let firstRespond_around_rangeStartx=first_respond_force['x']-10;
        let firstRespond_around_rangeEndx=first_respond_force['x']+10;
        let firstRespond_around_rangeStarty=first_respond_force['y']-10;
        let firstRespond_around_rangeEndy=first_respond_force['y']+10;
        let firstRespond_around_rangeStartz=first_respond_force['z']-10;
        let firstRespond_around_rangeEndz=first_respond_force['z']+10;//최초반응한 intsersdt지점을 중심으로 101010이 정육면체바운딩박스공간 안에 속하는 모든 몬스터들 조회
        let fake_uniforms={
            amplitude: { value: 0.0}
        }
        /*       
        console.log("반응지점 중심으로 20,20,20크기의 정육면체바운딩박스 시각화생성");
        let virtual_boundingbox=new THREE.Mesh(new THREE.BoxGeometry(20,20,20),new THREE.MeshLambertMaterial({
            color:0xa4a4a4,
            transparent:true,opacity:0.7
        }));
        virtual_boundingbox.castShadow=true;
        virtual_boundingbox.receiveShadow=true;
        virtual_boundingbox.position.set(first_respond_force['x'],first_respond_force['y'],first_respond_force['z']);
       
        this.scene.add(virtual_boundingbox);
        this.lineTriggerMaterials.push({
            'mesh':virtual_boundingbox,
            //'uniforms':local_uniforms,
            'fakeuniforms':fake_uniforms,
            'create':new Date().getTime()
        }); */

        let xamountshape=10;
        let yamountshape=10;
        let zamountshape=10;
        let x_origin=first_respond_force['x'];
        let y_origin=first_respond_force['y']+10;
        let z_origin=first_respond_force['z'];

        let xSinFlag2=27;
        let yTanFlag2=11;
        let zCosFlag2=24;
        let particleSize=20*this.rasierexplode_particleSize;
        let step=15;
        let explodescolor=new THREE.Color();
        
        explodescolor.setRGB(this.rasier_effectColor['r'],this.rasier_effectColor['g'],this.rasier_effectColor['b']);
        let SpherePoints=new SphereParticleYVertical(this.rasierexplode_particleSrc,xamountshape,yamountshape,zamountshape,x_origin,y_origin,z_origin,explodescolor,xSinFlag2,yTanFlag2,zCosFlag2,particleSize,step);
        console.log("SpherePoints??: exploisosnsss!",SpherePoints,SpherePoints._points)
        this.scene.add(SpherePoints._points);
        let fake_uniformsexplode={
            amplitude: { value: 0.0}
        }
        this.ExplodeEffectMaterials.push({//소규모폭발
            'mesh':SpherePoints._points,
            'fakeuniforms':fake_uniformsexplode,
            'create':new Date().getTime()
        });
        //광선이 투사된 그 순간때이 이벤트때에만 처리된다. 즉 지속적 뎀지는 아님(폭발형은 지속뎀임)폭발오브젝트가 지속될동안 계속 지속되는 엄청난 데미지.
        for(let e=0; e<enemys.length; e++){
            if(enemys[e]){
                let closetypemonster=enemys[e]['mesh'];
                //console.log("근접 타입 모든 몬스터들과 그 위치:",closetypemonster,closetypemonster.position);
                let unit_position_x=closetypemonster.position.x;
                let unit_position_y=closetypemonster.position.y;
                let unit_position_z=closetypemonster.position.z;

                if((unit_position_x >= firstRespond_around_rangeStartx && unit_position_x <= firstRespond_around_rangeEndx) && (unit_position_y >= firstRespond_around_rangeStarty && unit_position_y <= firstRespond_around_rangeEndy) && (unit_position_z >= firstRespond_around_rangeStartz && unit_position_z <= firstRespond_around_rangeEndz)){
                    console.log("소규모원거리조준폭발 범위에 있던경우에 한해서 그 몬스터들에게 데미지를 입힌다.",closetypemonster)
                    let target_monster=closetypemonster;
                    if(closetypemonster && closetypemonster.userData){
                        closetypemonster.userData.isAttacked=true;
                        let prev_hp=target_monster.userData.hp;
                        let monster_defense=target_monster.userData.defense;
                        
                        let damage=(user_rasier_power *user_base_power*powerflag) - monster_defense;
                        damage= damage <=0 ? 0 : damage;
                        console.log("기존 prevhp와 입힐 데미지:",prev_hp,damage);
                        prev_hp= prev_hp - damage;
                        target_monster.userData.hp=prev_hp;
                        let prev_speed=target_monster.userData.speed;
                        prev_speed = prev_speed-0.1<=0.2?0.2:prev_speed-0.1;//0.2까지만 감소.
                        target_monster.userData.speed=prev_speed;
                    }
                
                }
            }
        }
        for(let e=0; e<farenemys.length; e++){
            if(farenemys[e]){
                let fartypemonster=farenemys[e]['mesh'];
                //console.log("근접 타입 모든 몬스터들과 그 위치:",closetypemonster,closetypemonster.position);
                let unit_position_x=fartypemonster.position.x;
                let unit_position_y=fartypemonster.position.y;
                let unit_position_z=fartypemonster.position.z;

                if((unit_position_x >= firstRespond_around_rangeStartx && unit_position_x <= firstRespond_around_rangeEndx) && (unit_position_y >= firstRespond_around_rangeStarty && unit_position_y <= firstRespond_around_rangeEndy) && (unit_position_z >= firstRespond_around_rangeStartz && unit_position_z <= firstRespond_around_rangeEndz)){
                    console.log("소규모원거리조준폭발 범위에 있던경우에 한해서 그 몬스터들에게 데미지를 입힌다.",fartypemonster)
                    let target_monster=fartypemonster;
                    if(fartypemonster && fartypemonster.userData){
                        fartypemonster.userData.isAttacked=true;
                        let prev_hp=target_monster.userData.hp;
                        let monster_defense=target_monster.userData.defense;
                        
                        let damage=(user_rasier_power *user_base_power*powerflag) - monster_defense;
                        damage= damage <=0 ? 0 : damage;
                        console.log("기존 prevhp와 입힐 데미지:",prev_hp,damage);
                        prev_hp= prev_hp - damage;
                        target_monster.userData.hp=prev_hp;
                        let prev_speed=target_monster.userData.speed;
                        prev_speed = prev_speed-0.1<=0.2?0.2:prev_speed-0.1;//0.2까지만 감소.
                        target_monster.userData.speed=prev_speed;
                    }
                
                }
            }
        }
        for(let e=0; e<humanenemys.length; e++){
            if(humanenemys[e]){
                let humantypemonster=humanenemys[e]['mesh'];
                let unit_position_x=humantypemonster.position.x;
                let unit_position_y=humantypemonster.position.y;
                let unit_position_z=humantypemonster.position.z;

                if((unit_position_x >= firstRespond_around_rangeStartx && unit_position_x <= firstRespond_around_rangeEndx) && (unit_position_y >= firstRespond_around_rangeStarty && unit_position_y <= firstRespond_around_rangeEndy) && (unit_position_z >= firstRespond_around_rangeStartz && unit_position_z <= firstRespond_around_rangeEndz)){
                    console.log("소규모원거리조준폭발 범위에 있던경우에 한해서 그 몬스터들에게 데미지를 입힌다.",humantypemonster)
                    let target_monster=humantypemonster;
                    if(humantypemonster && humantypemonster.userData){
                        humantypemonster.userData.isAttacked=true;
                        let prev_hp=target_monster.userData.hp;
                        let monster_defense=target_monster.userData.defense;
                        
                        let damage=(user_rasier_power *user_base_power*powerflag) - monster_defense;
                        damage= damage <=0 ? 0 : damage;
                        console.log("기존 prevhp와 입힐 데미지:",prev_hp,damage);
                        prev_hp= prev_hp - damage;
                        target_monster.userData.hp=prev_hp;
                        let prev_speed=target_monster.userData.speed;
                        prev_speed = prev_speed-0.1<=0.2?0.2:prev_speed-0.1;//0.2까지만 감소.
                        target_monster.userData.speed=prev_speed;
                    }
                
                }
            }
        }
        for(let e=0; e<anothercharacters.length; e++){
            if(anothercharacters[e]){
                let targets=anothercharacters[e]['mesh'];
                let unit_position_x=targets.position.x;
                let unit_position_y=targets.position.y;
                let unit_position_z=targets.position.z;

                if((unit_position_x >= firstRespond_around_rangeStartx && unit_position_x <= firstRespond_around_rangeEndx) && (unit_position_y >= firstRespond_around_rangeStarty && unit_position_y <= firstRespond_around_rangeEndy) && (unit_position_z >= firstRespond_around_rangeStartz && unit_position_z <= firstRespond_around_rangeEndz)){
                    console.log("소규모원거리조준폭발 범위에 있던경우에 한해서 그 대상들에게 데미지를 입힌다.",targets)
                    let target_monster=targets;
                    if(targets && targets.userData){
                        targets.userData.isAttacked=true;
                        let prev_hp=target_monster.userData.hp;
                        let monster_defense=target_monster.userData.defense;
                        
                        let damage=(user_rasier_power *user_base_power*powerflag) - monster_defense;
                        damage= damage <=0 ? 0 : damage;
                        console.log("기존 prevhp와 입힐 데미지:",prev_hp,damage);
                        prev_hp= prev_hp - damage;
                        target_monster.userData.hp=prev_hp;
                        
                    }
                
                }
            }
        }
        let EnemyBuildingMaterials=this.EnemyBuildingMaterials;
        let intersects_buildingCount=0;
        let enemyBuildingCount=EnemyBuildingMaterials.length;
        for(let e=0; e<EnemyBuildingMaterials.length; e++){
            let e_item=EnemyBuildingMaterials[e];
           // console.log("EneinyBuidling materialsss건물상태와 어떠한 위치공간정보 광선폭발범위가 건물의 위치공간 /startxyz,endxyz와 intersects교차공간이 있는지 여부 검사알고리즘",e_item);
            //console.log("=======================starts===========================================");
            let buildingMesh3Dobject=e_item.mesh;
            let buildingbox=(new THREE.Box3).setFromObject(buildingMesh3Dobject);
            //console.log("buidlingbox setFromOobject관련 공간 좌표정보:",buildingbox);

            let BSTARTX=buildingbox.min.x; let BENDX=buildingbox.max.x;
            let BSTARTY=buildingbox.min.y; let BENDY=buildingbox.max.y;
            let BSTARTZ=buildingbox.min.z; let BENDZ=buildingbox.max.z;

           // console.log("광선폭파범위:x",firstRespond_around_rangeStartx,firstRespond_around_rangeEndx);
           // console.log("광선폭파범위:y",firstRespond_around_rangeStarty,firstRespond_around_rangeEndy);
           // console.log("광선폭파범위:z",firstRespond_around_rangeStartz,firstRespond_around_rangeEndz);
           // console.log("건물위치공간범위:x",BSTARTX,BENDX);
            //console.log("건물위치공간범위:y",BSTARTY,BENDY);
            //console.log("건물위치공간범위:z",BSTARTZ,BENDZ);
            if((firstRespond_around_rangeEndx > BSTARTX && firstRespond_around_rangeStartx < BENDX) && (firstRespond_around_rangeEndz > BSTARTZ && firstRespond_around_rangeStartz < BENDZ) && (firstRespond_around_rangeEndy > BSTARTY && firstRespond_around_rangeStarty < BENDY)){
                console.log("폭발범위가 xyz공간에 대해서 모두 건물범위와 intersects를 하는 경우가 사실상 폭발범위가 건물과 접촉포함intersect되고있다고할수있다 하나라도 안되는 경우는 폭발범위가 건물범위와 intersect하고있지 않는 경우이다!![폭발범위와 건물범위Intersectss]]");
                console.log("교차건물 오브젝트:",buildingMesh3Dobject);
                intersects_buildingCount++;

                let target_monster=buildingMesh3Dobject;
                if(target_monster && target_monster.userData){
                    target_monster.userData.isAttacked=true;
                    let prev_hp=target_monster.userData.hp;
                    let monster_defense=target_monster.userData.defense;
                    
                    let damage=(user_rasier_power *user_base_power*powerflag) - monster_defense;
                    damage= damage <=0 ? 0 : damage;
                    console.log("기존 prevhp와 입힐 데미지:",prev_hp,damage);
                    prev_hp= prev_hp - damage;
                    target_monster.userData.hp=prev_hp;
                    
                }
            }else{
                //console.log("폭발범위가 건물범위와 intersect전혀 하고 있지 않는 경우!!");
            }
           // console.log("=======================endsss===========================================");
        }
        console.log(`Enemnybuildnigi inersects카운트:${intersects_buildingCount}/${enemyBuildingCount}`);
        
        if(this.rasierSound.isPlaying){
            this.rasierSound.offset=0;
            this.rasierSound.play();
        }else{
            this.rasierSound.pause();
            this.rasierSound.offset=0;

            this.rasierSound.play();
        }
        
    }
    createRenderer(){
        this.renderer=new THREE.WebGLRenderer({
            alpha:true,
            antialias:true
        });
        this.renderer.setSize(window.innerWidth,window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio || 1);
        this.renderer.autoClear=true;
        this.renderer.toneMapping=THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure=1;
        this.renderer.setClearColor(0x000015);
        this.renderer.shadowMap.enabled=true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        const divContainer=document.querySelector('#webgl-container');
        this._divContainer=divContainer;
        divContainer.appendChild(this.renderer.domElement);

        console.log("this REnderder domELemnetss:",this._divContainer);

        requestAnimationFrame(this.render.bind(this));
    }

    createCamera(){
        this.camera=new THREE.PerspectiveCamera(40,window.innerWidth/window.innerHeight, 0.1,100000);
        if(!isNaN(this.loadposx) && !isNaN(this.loadposy) && !isNaN(this.loadposz)){
            this.camera.position.set(this.loadposx,this.loadposy+0,this.loadposz+5)
        }else if(isNaN(this.loadposx) || isNaN(this.loadposy) || isNaN(this.loadposy)){
            this.camera.position.set(0,12+0,10+5);//캐릭터와 항상 z축만 5씩 차이나게.
        }else{
            this.camera.position.set(0,12+0,10+5);//캐릭터와 항상 z축만 5씩 차이나게.
        }

         //캐릭터 각성상태anim실행 및 관련된 처리
         /*this.character_particles = new ParticleSystem({//물리효과존재 전방존재
            parent: this.scene,
            camera: this.camera,
            particleTexture: './resources/fire.jpg',
            startColor:"#8020ef",
            endColor:"#fe8010"
        });
        this.character_particles._points.position.set(150,12,5)*/
        this.character_particlesFollowTransform1 = new ParticleSystem({//물리효과x 이펙트만 보여줌
            parent: this.scene,
            camera: this.camera,
            particleTexture: this.transform_particleSrc,
            /*"#fe20ef",
            endColor:"#fefe40" */
            startColor:this.transform_effectColorstart,
            endColor:this.transform_effectColorend
        });
       /* this.character_particlesFollowTransform2 = new ParticleSystem({//물리효과x 이펙트만 보여줌
            parent: this.scene,
            camera: this.camera,
            particleTexture:this.transform_particleSrc,
            startColor:this.transform_effectColorstart,
            endColor:this.transform_effectColorend
        });
        this.character_particlesFollowTransform3 = new ParticleSystem({//물리효과x 이펙트만 보여줌
            parent: this.scene,
            camera: this.camera,
            particleTexture: this.transform_particleSrc,
            startColor:this.transform_effectColorstart,
            endColor:this.transform_effectColorend
        });*/
       /* this.character_particles2 = new ParticleSystem({//물리효과존재 후방존재
            parent: this.scene,
            camera: this.camera,
            particleTexture: './resources/fire.jpg',
            startColor:"#8020ef",
            endColor:"#fe8010"
        });*/
         /**/
        this.update_particle_params_character={
            xDistance:3,yDistance:3,zDistance:3,
            velocityX:0,velocityY:2,velocityZ:0,
            particleSize:this.transform_particleSize?this.transform_particleSize:0.5
        } 
      
    }
    createScene(){
        this.scene=new THREE.Scene();

        const axisHelper=new THREE.AxesHelper(1000);
        this.scene.add(axisHelper);
    }
    /*createEnemy(Ammo=this.ammoClone,pos){
        console.log("enemy생성테스트:",Enemy,Ammo,this.physicsWorld);

        let enemy=new Enemy(this.scene,pos,Ammo,this.physicsWorld);
        console.log("생성된 eneenyinstace정보:",enemy);
        enemys.push(enemy)
    }*/
    createEnemyGLTF(Ammo=this.ammoClone,pos,src,physicsParmam,index,hp,power,type,speed,mass,name,defense,is_air_limit,attackSound,diedSound){
     
        //console.log("enemeyglTf생성테스트:",EnemyGLTF,Ammo,this.physicsWorld);
        let added_loadmodel={};
        added_loadmodel['src']=src;
        added_loadmodel['isloaded']=false;
        this.loadmodels.push(added_loadmodel);

        this.loader=new GLTFLoader()
        this.loader.load(src,(gltf)=>{
           // console.log("hahahahaha load gltf model info monser!!!:",gltf,gltf.scene,is_air_limit);
            
            const model=gltf.scene;
            const mesh=model.children[0];//object3d
            const mesh_pureSkin=mesh.children[0];

            mesh.position.set(pos.x,pos.y,pos.z);
            mesh.castShadow=true;
            mesh.receiveShadow=true;
            this.scene.add(mesh);
            mesh.userData.ObjectType='enemybody';
            //console.log("model존재?:",model,mesh);
            mesh.traverse(child=>{
                //console.log("mesh glb traverse탐방scene:",child);
                if(child instanceof THREE.Mesh){
                   // console.log("mesh type들!!:",child);
                    child.castShadow=true;
                    child.receiveShadow=true;
                    child.userData.ObjectType='enemybody';

                    child.frustumCulled=false;
                }
            })
            const monsterbox=(new THREE.Box3).setFromObject(mesh);
            const monsterboxHelper=new THREE.BoxHelper(mesh);
            this.scene.add(monsterboxHelper);

           /* let calc_x=monsterbox.max.y - monsterbox.min.y;
            let calc_y=monsterbox.max.y - monsterbox.min.y;
            let calc_z=monsterbox.max.y - monsterbox.min.y;
            console.log("계산된 monsterbox크기:",calc_x,calc_y,calc_z);*/

             //animationss
             const animationClips= gltf.animations;
             const mixer=new THREE.AnimationMixer(mesh);
             const animationsMap={};
             animationClips.forEach(function(clip){
                 const name=clip.name;
                 animationsMap[name]=mixer.clipAction(clip);
                // console.log("whasss:",mixer.clipAction(clip));
                 const action=mixer.clipAction(clip);
                 //action.play();
             });
            // this._monsteranimMixer=mixer;
            // console.log('this animationsCLipsss:',animationsMap);
             const alwaysAnimationAction=animationsMap['default'];
            // console.log("alwasysaniamationActions:",alwaysAnimationAction);
             let animData={
                'src': src,
                'alwaysAnimationAction':alwaysAnimationAction,
                'mixer':mixer,
                'index':index,
                'boxhelper':monsterboxHelper,
                'meshDistinct':mesh
             };
             this.monsterAnimData.push(animData);
             alwaysAnimationAction.play();

             let enemyGlTF=new EnemyGLTF(monsterbox,mesh,mesh_pureSkin,pos,Ammo,this.physicsWorld,hp,power,type,speed,mass,name,null,defense,is_air_limit,attackSound,diedSound)
             //console.log("생성된 enemyGlTF instance정보:",enemyGlTF);

             enemys.push(enemyGlTF)

             added_loadmodel['isloaded']=true;
        });
    }
    /*createEnemyGLTF2(Ammo=this.ammoClone,pos,src,physicsParmam,index,hp,power,type,speed,mass,name,skillSrc,skillpos,womanVer,defense,is_air_limit=false,attackSound){
     
        console.log("enemeyglTf생성테스트22:",EnemyGLTF,Ammo,this.physicsWorld);
        
        this.loader=new GLTFLoader()
        this.loader.load(src,(gltf)=>{
            console.log("hahahahaha load gltf model info monser!!!:(원거리형유닛)",gltf,gltf.scene,is_air_limit);
           
            const model=gltf.scene;
            const mesh=model.children[0];//object3d
            const mesh_pureSkin=mesh.children[0];

            mesh.position.set(pos.x,pos.y,pos.z);
            mesh.castShadow=true;
            mesh.receiveShadow=true;
            this.scene.add(mesh);
            mesh.userData.ObjectType='enemybody'
            console.log("model존재?:",model,mesh);
            mesh.traverse(child=>{
                //console.log("mesh glb traverse탐방scene:",child);
                if(child instanceof THREE.Mesh){
                    //console.log("mesh type들!!:",child);
                    child.castShadow=true;
                    child.receiveShadow=true;
                    child.userData.ObjectType='enemybody'

                    child.frustumCulled=false;
                }
            })
            const monsterbox=(new THREE.Box3).setFromObject(mesh);
            const monsterboxHelper=new THREE.BoxHelper(mesh);
            this.scene.add(monsterboxHelper);
            let calc_x=monsterbox.max.x- monsterbox.min.x;
            let calc_y=monsterbox.max.y - monsterbox.min.y;
            let calc_z=monsterbox.max.z - monsterbox.min.z;
            console.log("계산된 monsterbox크기:",calc_x,calc_y,calc_z);
            let maxsize=Math.max(calc_x,calc_y,calc_z);
            console.log("가장큰 폭값:",maxsize);

             //animationss
             const animationClips= gltf.animations;
             const mixer=new THREE.AnimationMixer(mesh);
             const animationsMap={};
             animationClips.forEach(function(clip){
                 const name=clip.name;
                 animationsMap[name]=mixer.clipAction(clip);
                 console.log("whasss:",mixer.clipAction(clip));
                 const action=mixer.clipAction(clip);
                 //action.play();
             });
             this._monsteranimMixer=mixer;
             console.log('this animationsCLipsss:',animationsMap);
             let alwaysAnimationAction;

             if(womanVer){
                alwaysAnimationAction=animationsMap['default'+womanVer];
             }else{
                alwaysAnimationAction=animationsMap['default'];
             }
             console.log("alwasysaniamationActions:",alwaysAnimationAction);
             let animData={
                'src': src,
                'alwaysAnimationAction':alwaysAnimationAction,
                'mixer':mixer,
                'index':index,
                'boxhelper':monsterboxHelper,    
                'meshDistinct':mesh
             };
             this.monsterAnimData.push(animData);
             alwaysAnimationAction.play();

             this.loader.load(skillSrc,(gltf)=>{
                console.log("hahahahaha skillEffects gltf model info monser!!!:",gltf,gltf.scene);
               
                const model=gltf.scene;
                const SKILLmesh=model.children[0];//object3d
                const mesh_pureSkin=mesh.children[0];
    
                const skillCorebox=(new THREE.Box3).setFromObject(SKILLmesh);
    
                let calc_x=skillCorebox.max.x - skillCorebox.min.x;
                let calc_y=skillCorebox.max.y - skillCorebox.min.y;
                let calc_z=skillCorebox.max.z - skillCorebox.min.z;
                let max_size=Math.max(calc_x,calc_y,calc_z)
                console.log("계산된 skillCorebox:",calc_x,calc_y,calc_z,max_size);
    
                 let enemyGlTF=new EnemyGLTF(monsterbox,mesh,mesh_pureSkin,pos,Ammo,this.physicsWorld,hp,power,type,speed,mass,name,SKILLmesh,defense,is_air_limit,attackSound)
                 console.log("생성된 enemyGlTF instance정보:",enemyGlTF);
    
                 farenemys.push(enemyGlTF);

            });
        });
    }*/
    createEnemyGLTF3(Ammo=this.ammoClone,pos,src,physicsParmam,index,hp,power,type,speed,mass,name,skillSrc,skillpos,womanVer,defense,distanceamount,isAir,attackRangeAmount,attackParticlesrc,attackSound,attackColor,isAirChase,steps,airAmountflag=1,diedSound){
     
       // console.log("enemeyglTf생성테스트22:",EnemyGLTF,Ammo,this.physicsWorld);
        
        this.loader=new GLTFLoader();
        let added_loadmodel={};
        added_loadmodel['src']=src;
        added_loadmodel['isloaded']=false;
        this.loadmodels.push(added_loadmodel);

        this.loader.load(src,(gltf)=>{
            //console.log("hahahahaha load gltf model info monser!!!:(createEnemyGLTF3)",gltf,gltf.scene,distanceamount,isAir);
           
            const model=gltf.scene;
            const mesh=model.children[0];//object3d
            const mesh_pureSkin=mesh.children[0];

            mesh.position.set(pos.x,pos.y,pos.z);
            mesh.castShadow=true;
            mesh.receiveShadow=true;
            this.scene.add(mesh);
            mesh.userData.ObjectType='enemybody'
            //console.log("model존재?:",model,mesh);
            mesh.traverse(child=>{
                //console.log("mesh glb traverse탐방scene:",child);
                if(child instanceof THREE.Mesh){
                    //console.log("mesh type들!!:",child);
                    child.castShadow=true;
                    child.receiveShadow=true;
                    child.userData.ObjectType='enemybody'

                    child.frustumCulled=false;
                }
            })
            const monsterbox=(new THREE.Box3).setFromObject(mesh);
            const monsterboxHelper=new THREE.BoxHelper(mesh);
            this.scene.add(monsterboxHelper);
            let calc_x=monsterbox.max.x- monsterbox.min.x;
            let calc_y=monsterbox.max.y - monsterbox.min.y;
            let calc_z=monsterbox.max.z - monsterbox.min.z;
            //console.log("계산된 monsterbox크기:",calc_x,calc_y,calc_z);
            let maxsize=Math.max(calc_x,calc_y,calc_z);
           // console.log("가장큰 폭값:",maxsize);

             //animationss
             const animationClips= gltf.animations;
             const mixer=new THREE.AnimationMixer(mesh);
             const animationsMap={};
             animationClips.forEach(function(clip){
                 const name=clip.name;
                 animationsMap[name]=mixer.clipAction(clip);
                 //console.log("whasss:",mixer.clipAction(clip));
                 const action=mixer.clipAction(clip);
                 //action.play();
             });
             this._monsteranimMixer=mixer;
            // console.log('this animationsCLipsss:',animationsMap);
             let alwaysAnimationAction;

            alwaysAnimationAction=animationsMap['default'];
             
             //console.log("alwasysaniamationActions:",alwaysAnimationAction);
             let animData={
                'src': src,
                'alwaysAnimationAction':alwaysAnimationAction,
                'mixer':mixer,
                'index':index,
                'boxhelper':monsterboxHelper,    
                'meshDistinct':mesh
             };
             this.monsterAnimData.push(animData);
             alwaysAnimationAction.play();

             this.loader.load(skillSrc,(gltf)=>{
               // console.log("hahahahaha skillEffects gltf model info monser!!!:",gltf,gltf.scene);
               
                const model=gltf.scene;
                const SKILLmesh=model.children[0];//object3d
                const mesh_pureSkin=mesh.children[0];
    
                const skillCorebox=(new THREE.Box3).setFromObject(SKILLmesh);
    
                let calc_x=skillCorebox.max.x - skillCorebox.min.x;
                let calc_y=skillCorebox.max.y - skillCorebox.min.y;
                let calc_z=skillCorebox.max.z - skillCorebox.min.z;
                let max_size=Math.max(calc_x,calc_y,calc_z)
                //console.log("계산된 skillCorebox:",calc_x,calc_y,calc_z,max_size);
    
                 let enemyGlTF=new EnemyGLTF2(monsterbox,mesh,mesh_pureSkin,pos,Ammo,this.physicsWorld,hp,power,type,speed,mass,name,SKILLmesh,defense,distanceamount,isAir,attackRangeAmount,attackParticlesrc,attackSound,attackColor,isAirChase,steps,airAmountflag,diedSound)
                 //console.log("생성된 enemyGlTF instance정보:",enemyGlTF);
    
                 humanenemys.push(enemyGlTF);

                 added_loadmodel['isloaded']=true;
            });
        });
    }
    createAnotherCharacterGLTF(Ammo=this.ammoClone,pos,src,physicsParmam,index,hp,power,type,speed,mass,name,defense,isWoman,quataddon,diedSound){
     
        //console.log("createAnotherCharacterGLTF 생성테스트:",Ammo,this.physicsWorld,diedSound);
        let added_loadmodel={};
        added_loadmodel['src']=src;
        added_loadmodel['isloaded']=false;
        this.loadmodels.push(added_loadmodel);

        this.loader=new GLTFLoader()
        this.loader.load(src,(gltf)=>{
           // console.log("hahahahaha load gltf model info createAnotherCharacterGLTF!!!:",gltf,gltf.scene);
           
            const model=gltf.scene;
            const mesh=model.children[0];//object3d
            const mesh_pureSkin=mesh.children[0];

            mesh.position.set(pos.x,pos.y,pos.z);
            mesh.castShadow=true;
            mesh.receiveShadow=true;
            this.scene.add(mesh);
            mesh.userData.ObjectType=type;
           // console.log("model존재?:",model,mesh,mesh.add);
         
            mesh.traverse(child=>{
                //console.log("mesh glb traverse탐방scene:",child);
                if(child instanceof THREE.Mesh){
                   // console.log("mesh type들!!:",child);
                    child.castShadow=true;
                    child.receiveShadow=true;
                    child.userData.ObjectType=type;

                    child.frustumCulled=false;
                }
            })
            const characterbox=(new THREE.Box3).setFromObject(mesh);
            const characterboxboxHelper=new THREE.BoxHelper(mesh);
            this.scene.add(characterboxboxHelper);

           /* let calc_x=monsterbox.max.y - monsterbox.min.y;
            let calc_y=monsterbox.max.y - monsterbox.min.y;
            let calc_z=monsterbox.max.y - monsterbox.min.y;
            console.log("계산된 monsterbox크기:",calc_x,calc_y,calc_z);*/

             //animationss
             const animationClips= gltf.animations;
             const mixer=new THREE.AnimationMixer(mesh);
             const animationsMap={};
             animationClips.forEach(function(clip){
                 const name=clip.name;
                 animationsMap[name]=mixer.clipAction(clip);
                 //console.log("whasss:",mixer.clipAction(clip));
                 const action=mixer.clipAction(clip);
                 //action.play();
             });
            // this._monsteranimMixer=mixer;
             //console.log('this animationsCLipsss:',animationsMap);
             const alwaysAnimationAction=animationsMap[`default${isWoman}`];
            // console.log("alwasysaniamationActions:",alwaysAnimationAction);
             let animData={
                'src': src,
                'alwaysAnimationAction':alwaysAnimationAction,
                'mixer':mixer,
                'index':index,
                'boxhelper':characterboxboxHelper,
                'meshDistinct':mesh
             };
             this.monsterAnimData.push(animData);//monsterAnd anohtercHCarctersss
             alwaysAnimationAction.play();

             let AnotherCharacterGlTF=new AnotherCharacterGLTF(characterbox,mesh,mesh_pureSkin,pos,Ammo,this.physicsWorld,hp,power,type,speed,mass,name,null,defense,quataddon,diedSound)
             //console.log("생성된 AnotherCharacterGlTF instance정보:",AnotherCharacterGlTF);

             anothercharacters.push(AnotherCharacterGlTF)
            
             added_loadmodel['isloaded']=true;

        });
    }
    RepeatEnemysAction(){//근거리형타입들만.
        if(enemys){
            //console.log("ths enemys??:",enemys);
            //캐릭터 주변 -2~2범위의 상당히 작은 규모의 캐릭터와 밀착된 구조로 상위반구 구조
            let x_flag;
            let y_flag;
            let z_flag;
            let unit;
            let enemysList=[];
            for(let e=0; e<enemys.length; e++){
                //0:x,1:x,2:undfeindd(제거된),3:x,/...이런구조로 할것이기에 존재하고있는 삭제되지 않은 유닛들에 대해서만 돌것이고, 행동한다. 다 삭제되면 배열모든요솓는 다 undefined로 비어있을것이다.
                if(enemys[e]){
                    let enemy_item=enemys[e];
                    let enemy_threeobject=enemy_item.mesh;   
                    if(enemy_threeobject.userData && enemy_threeobject.userData.isAttacked){
                        if(e%2==0){
                            unit=-1;
                        }else{
                            unit=1;
                        }
                        let monster_speed=enemy_threeobject.userData&&enemy_threeobject.userData.speed
                        let is_air_limit=enemy_threeobject.userData.is_air_limit;

                        x_flag=Math.ceil(10*Math.random())*unit*0.2*Math.cos(3*e);//0~9*0~-9.999 -9.999~9.9999*0.2 -2~2*0~ -2~2범위 더양화
                        y_flag=Math.ceil(10*Math.random())*1*0.2*Math.cos(3*e);//0~10*0.5=0~5*-1=1*cos or sin 캐릭터상위 2*cos 0~2범위다양함.
                        z_flag=Math.ceil(10*Math.random())*unit*0.2*Math.sin(3*e);//-2~2*0~ -2~2범위 더양화 캐릭터주위 -2~2범위 xz축 다양화
                        //console.log('x,ly,z flagss:',x_flag,y_flag,z_flag)
                    
                        //console.log("각각의 적들 취할 행동:",enemy_item,enemy_threeobject);
                        let enemy_physicsbody=enemy_item&&enemy_item.pbody;
                    
                        if(this.character1){
                            //console.log("enemey위치:",enemy_threeobject.position.x,enemy_threeobject.position.y,enemy_threeobject.position.z,enemy_physicsbody);
                            //console.log("각각이 적들 상태:",enemy_threeobject.userData)
                            let distance_x=(this.character1.position.x + x_flag)- enemy_threeobject.position.x;//origin+0~0.5 or -0~0.5
                            let distance_z=(this.character1.position.z + z_flag)- enemy_threeobject.position.z;//origni+0~0.5 or -0~0.5
                            let distance_y=(this.character1.position.y + y_flag )- enemy_threeobject.position.y;//origin+0~0.5 or -0~0.5
        
                            //console.log("캐릭터와의 위치격차:",distance_x,distance_z,distance_y);
        
                        // console.log("적용하게될힘의 캐릭터근처위치",this.character1.position.x + x_flag,this.character1.position.y + y_flag,this.character1.position.z + z_flag );
                        // console.log("캐릭터위치?:",this.character1.position);
                            if(!is_air_limit){
                                let resultantimpulse=new Ammo.btVector3(distance_x,distance_y,distance_z);
                                resultantimpulse.op_mul(monster_speed);
                            // console.log("가해질힘:",resultantimpulse);
                                
                                enemy_physicsbody.setLinearVelocity(resultantimpulse)    
                            }else{
                                let resultantimpulse=new Ammo.btVector3(distance_x,0,distance_z);
                                resultantimpulse.op_mul(monster_speed);
                                //console.log("is air limit이 있는 유닛의 경우 y수직공중방향으론 힘이 안 가해짐 가해질힘:",resultantimpulse);
                                
                                enemy_physicsbody.setLinearVelocity(resultantimpulse)   
                            }
                        }
                       
                    } 
                
                    if(enemy_threeobject.userData.hp <=0){
                        let enemy_physicsbody=enemy_item&&enemy_item.pbody;
                        console.log("hp가 0이하로 떨어진 존재가 발견되었으면 enemys에서 제거",enemy_threeobject,enemy_threeobject.userData.physicsBody,enemy_physicsbody==enemy_threeobject.userData.physicsBody);
                        console.log("해당 제거할 몬스터enemey인덱스??:",e);
                        enemys[e]=undefined;//eneemys enemy MESHDATA배열에서 제거
                        //enemys.splice(e,1);

                        //died 사운드이펙트넣기20230424 
                        let diedSound=enemy_threeobject.userData.diedSound;     
                        console.log("diedSound처리!!!!",diedSound)

                        if(diedSound){
                            if(diedSound.isPlaying){
                                diedSound.offset=0;
                                diedSound.play();
                            }else{
                                diedSound.pause();
                                diedSound.offset=0;
                    
                                diedSound.play();
                            }
                        
                        }
                        
                        //this.monsterAnimData.splice(e,1);//해당 animData제거
                        let monsterAnimData=this.monsterAnimData;
                        for(let a=0; a<monsterAnimData.length; a++){
                            let anim=monsterAnimData[a];
                            if(anim){
                                if(anim['meshDistinct']===enemy_threeobject){
                                    //animData에 몬스터별 고유object3d mesh에 대응연결된 애니메이션데이터, threeobject별로 enemy별로 ㄱ animdata대조하여 비교하여 삭제할 enemyMEsh 3d object dat와 매칭되는 animData관련 index null로 처리,splice로 하면 안됨. 구조가 어그러짐.
                                    console.log("제겋될 meshDmdistinct animDATA:",anim,a);
                                    monsterAnimData[a]=undefined;//animData자체를 다 지워서 mixerUpdate안되게.
                                }
                            }
                          
                        }
                        this.scene.remove(enemy_threeobject);
                        
                        for(let r=0; r<rigidBodies.length; r++){
                            let rigidItem=rigidBodies[r];
                            if(rigidItem === enemy_threeobject){
                                console.log("제거할 몬스터 enemyThreeojbec rigidBodmesh:",rigidItem,r);
                                rigidBodies[r]=undefined;
                            }
                        }
                        this.physicsWorld.removeRigidBody(enemy_physicsbody);
                     
                    }

                    
                }
                
            }   
        }
    }

    RepeatAnotherCharacterAction(){
        if(anothercharacters){
            for(let e=0; e<anothercharacters.length; e++){
                if(anothercharacters[e]){
                    let character_item=anothercharacters[e];
                    let character_threeobject=character_item&&character_item.mesh;   
                    
                    //console.log("repeatANohtercahtaersAdtionsss:",character_item)
                    if(character_threeobject&&character_threeobject.userData.hp <=0){
                        let character_physicsbody=character_item&&character_item.pbody;
                        console.log("hp가 0이하로 떨어진 존재가 발견되었으면 enemys에서 제거",character_physicsbody,character_threeobject.userData.physicsBody,character_physicsbody==character_threeobject.userData.physicsBody);
                        console.log("해당 제거할 character_physicsbody인덱스??:",e);
                        anothercharacters[e]=undefined;//eneemys enemy MESHDATA배열에서 제거
                        //enemys.splice(e,1);

                        //died 사운드이펙트넣기20230424 
                        let diedSound=character_threeobject.userData.diedSound;                        console.log("diedSound처리!!!!",diedSound)

                        if(diedSound){
                            if(diedSound.isPlaying){
                                diedSound.offset=0;
                                diedSound.play();
                            }else{
                                diedSound.pause();
                                diedSound.offset=0;
                    
                                diedSound.play();
                            }
                        
                        }
                       

                        //this.monsterAnimData.splice(e,1);//해당 animData제거
                        let monsterAnimData=this.monsterAnimData;
                        for(let a=0; a<monsterAnimData.length; a++){
                            let anim=monsterAnimData[a];
                            if(anim){
                                if(anim['meshDistinct']===character_threeobject){
                                    //animData에 대상별 고유object3d mesh에 대응연결된 애니메이션데이터, threeobject별로 enemy별로 ㄱ animdata대조하여 비교하여 삭제할 enemyMEsh 3d object dat와 매칭되는 animData관련 index null로 처리,splice로 하면 안됨. 구조가 어그러짐.
                                    console.log("제겋될 meshDmdistinct animDATA:",anim,a);
                                    monsterAnimData[a]=undefined;//animData자체를 다 지워서 mixerUpdate안되게.
                                }
                            }
                          
                        }
                        this.scene.remove(character_threeobject)
                        for(let r=0; r<rigidBodies.length; r++){
                            let rigidItem=rigidBodies[r];
                            if(rigidItem === character_threeobject){
                                console.log("제거할 character_threeobject rigidBodmesh:",rigidItem,r);
                                rigidBodies[r]=undefined;
                            }
                        }
                        this.physicsWorld.removeRigidBody(character_physicsbody);
                     
                    }
                }
                
            }   
        }
    }
    _createSkill_FarMonster(Ammo=this.ammoClone,unit,unit_grade) {
       
       // console.log("몬스터 위치:",unit.position.x,unit.position.y,unit.position.z);
        let monster_speed=unit.userData&&unit.userData.speed;
        let unit_pos_origin={
            'x':unit.position.x,
            'y':unit.position.y,
            'z':unit.position.z
        }
        let unitselfbounding=(new THREE.Box3).setFromObject(unit);
        //console.log("하하 unitFar발사체형 모델로부터 얻어낸 바운딩박스정보",unitselfbounding);
        let unitselfbounding_calcx=unitselfbounding.max.x-unitselfbounding.min.x;
        let unitselfbounding_calcy=unitselfbounding.max.y-unitselfbounding.min.y;
        let unitselfbounding_calcz=unitselfbounding.max.z-unitselfbounding.min.z;
        let unitselfbounding_maxsize=Math.max(unitselfbounding_calcx,unitselfbounding_calcy,unitselfbounding_calcz);


        const quat = { x: 0, y: 0, z: 0, w: 1 };
       
        let mass=2;

        if(unit_grade=='Boss'){
            mass = mass*2;//4
        }else if(unit_grade=='king'){
            mass = mass*4;//8
        }else if(unit_grade==='god'){
            mass = mass*8;//16
        }else{
            mass = mass*1;
        }
        
        let unit_direction=new THREE.Vector3();
        unit.getWorldDirection(unit_direction);
        //console.log("유닛이 바라보고있는 방향:",unit_direction);
        let unit_direction_x=unit_direction.x;
        let unit_direction_z=unit_direction.z;

        const ball=unit.userData.ballChildMeshmodel;//far생성형 생성모델메시
        ball.castShadow=true;
        ball.receiveShadow=true;
        ball.traverse(child=>{
            //console.log("monsterball glb traverse탐방scene:",child);
            if(child instanceof THREE.Mesh){
               // console.log("mesh type들!!:",child);
                child.castShadow=true;
                child.receiveShadow=true;
            }
        })
        let bounding=(new THREE.Box3).setFromObject(ball);
       // console.log("하하 몬스터볼모델로부터 얻어낸 바운딩박스정보",bounding);
        let ball_calcx=bounding.max.x-bounding.min.x;
        let ball_calcy=bounding.max.y-bounding.min.y;
        let ball_calcz=bounding.max.z-bounding.min.z;
        let ball_maxsize=Math.max(ball_calcx,ball_calcy,ball_calcz);

        //ball.position.set(unit_pos_origin.x+unit_direction_x*3, unit_pos_origin.y+4, unit_pos_origin.z+unit_direction_z*3);
        ball.position.set(unit_pos_origin.x+(0*3),unit_pos_origin.y + unitselfbounding_maxsize*2, unit_pos_origin.z+(0*3))
       // console.log("몬스터볼생성위치::",unit_pos_origin.x+(0*3),unit_pos_origin.y + unitselfbounding_maxsize*2, unit_pos_origin.z+(0*3));
        this.scene.add(ball);

    
        const transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(unit_pos_origin.x+(0*3),unit_pos_origin.y + unitselfbounding_maxsize*2, unit_pos_origin.z+(0*3)));
        transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));

        const motionState = new Ammo.btDefaultMotionState(transform);
       // const colShape = this._createAmmoShapeFromMesh2(ball,character_pos_origin,quat,null,Ammo);
       const colShape=new Ammo.btBoxShape(new Ammo.btVector3(ball_calcx*0.5,ball_calcy*0.5,ball_calcz*0.5));

       // console.log("creating colShapess:!: and createBall",colShape,ball)

        colShape.setMargin(0.01);
        const localInertia = new Ammo.btVector3(0,0,0);
        colShape.calculateLocalInertia(mass, localInertia);
      
        const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
        const ballbody = new Ammo.btRigidBody(rbInfo);
       
        this.physicsWorld.addRigidBody(ballbody);

        ballbody.setFriction(1);
        ballbody.setRollingFriction(0.8);
        ballbody.setRestitution(0.9);
        ballbody.setActivationState(4);

        ball.userData.physicsBody = ballbody;
        ball.userData.type='monsterballCreated';
        ball.userData.tag='monsterballCreated';
        ball.userData.mother=unit;
        ball.userData.distinctId=`${unit.userData&&unit.userData.name}-${new Date().getTime()}`;

        ballbody.threeObject=ball;
        unit.userData.tando_createdTime=new Date().getTime();

        rigidBodies.push(ball);
    
      // console.log("유닛이 현재 있는 오리진위치로부터의 힘발사로 진행:",unit_pos_origin.x+(0*3),unit_pos_origin.y + unitselfbounding_maxsize*2, unit_pos_origin.z+(0*3));
      // console.log("캐릭터 현재 위치???:",this.character1.position.x,this.character1.position.y,this.character1.position.z);

       let distance_x= this.character1.position.x - (unit_pos_origin.x+(0*3))
       let distance_y= this.character1.position.y -(unit_pos_origin.y + unitselfbounding_maxsize*2);
       let distance_z= this.character1.position.z - (unit_pos_origin.z+(0*3));
      // console.log("force distance_xyz:",distance_x,distance_y,distance_z)

       let resultantimpulse=new Ammo.btVector3(distance_x,distance_y,distance_z);
       resultantimpulse.op_mul(monster_speed*4);//spped가 약할수록 수직방향에 대해서 중력에 영향을 더 강하게 받아서 위로는 잘 못올라옴 0.4~0.8 몬스터 속도 최저값은 0.4로 규정
        ballbody.setLinearVelocity(resultantimpulse);
        let fake_uniforms={
            amplitude: { value: 0.0}
        }
        this.monsterCreatedBallList.push({
            'mesh':ball,
            'fakeuniforms':fake_uniforms,
            'create':new Date().getTime()
        });

    }
    /*_FarEnemyCreateSkill(Ammo=this.ammoClone,unit,unit_grade){
        //console.log("몬스터 최초 볼생성???@@@:")
        let unit_pos_origin={
            'x':unit.position.x,
            'y':unit.position.y,
            'z':unit.position.z
        }
        //console.log("현재시점 각 원거리유닛 위치:",unit,unit_pos_origin);
        let unit_direction=new THREE.Vector3();
        unit.getWorldDirection(unit_direction);
        console.log("유닛이 바라보고있는 방향:",unit_direction);
        let unit_direction_x=unit_direction.x;
        let unit_direction_z=unit_direction.z;
        const quat={x:0,y:0,z:0,w:1};

        let mass=2;

        if(unit_grade=='Boss'){
            mass = mass*2;//4
        }else if(unit_grade=='king'){
            mass = mass*4;//8
        }else if(unit_grade==='god'){
            mass = mass*8;//16
        }else{
            mass = mass*1;
        }

        console.log("unit?",unit.userData.ballChildMeshmodel);

        const ball=unit.userData.ballChildMeshmodel;
        ball.castShadow=true;
        ball.receiveShadow=true;
        ball.traverse(child=>{
            //console.log("monsterball glb traverse탐방scene:",child);
            if(child instanceof THREE.Mesh){
               // console.log("mesh type들!!:",child);
                child.castShadow=true;
                child.receiveShadow=true;
            }
        })
        let bounding=(new THREE.Box3).setFromObject(ball);
        console.log("하하 몬스터볼모델로부터 얻어낸 바운딩박스정보",bounding);
        let ball_calcx=bounding.max.x-bounding.min.x;
        let ball_calcy=bounding.max.y-bounding.min.y;
        let ball_calcz=bounding.max.z-bounding.min.z;
        let ball_maxsize=Math.max(ball_calcx,ball_calcy,ball_calcz);

        ball.position.set(unit_pos_origin.x+unit_direction_x*3, unit_pos_origin.y+4, unit_pos_origin.z+unit_direction_z*3);
        console.log("몬스터볼생성위치::",unit_pos_origin.x+unit_direction_x*3, unit_pos_origin.y+4, unit_pos_origin.z+unit_direction_z*3);
        this.scene.add(ball);
  
        const transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(unit_pos_origin.x+unit_direction_x*3, unit_pos_origin.y+4, unit_pos_origin.z+unit_direction_z*3));
        transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));

        const motionState = new Ammo.btDefaultMotionState(transform);
       // const colShape = this._createAmmoShapeFromMesh2(ball,character_pos_origin,quat,null,Ammo);
       const colShape=new Ammo.btBoxShape(new Ammo.btVector3(ball_calcx*0.5,ball_calcy*0.5,ball_calcz*0.5));

        console.log("creating colShapess:!: and createBall",colShape,ball)

        colShape.setMargin(0.01);
        const localInertia = new Ammo.btVector3(0,0,0);
        colShape.calculateLocalInertia(mass, localInertia);
      
        const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
        const ballbody = new Ammo.btRigidBody(rbInfo);
       
        this.physicsWorld.addRigidBody(ballbody);

        ballbody.setFriction(1);
        ballbody.setRollingFriction(0.8);
        ballbody.setRestitution(0.9);
        ballbody.setActivationState(4);

        ball.userData.physicsBody = ballbody;
        ball.userData.type='monsterball';
        ball.userData.tag='monsterball';
        ball.userData.mother=unit;
        ball.userData.distinctId=`${unit.userData&&unit.userData.name}-${new Date().getTime()}`;

        ballbody.threeObject=ball;
        unit.userData.isCreated=true;
        unit.userData.ballChild=ball

        rigidBodies.push(ball);
    

       console.log("유닛이 현재 있는 오리진위치로부터의 힘발사로 진행:",unit_pos_origin.x, unit_pos_origin.y, unit_pos_origin.z);
       console.log("캐릭터 현재 위치???:",this.character1.position.x,this.character1.position.y,this.character1.position.z);
       //let distance_x= this.character1.position.x - unit_pos_origin.x;
       //let distance_y= this.character1.position.y -unit_pos_origin.y ;
       //let distance_z= this.character1.position.z - unit_pos_origin.z ;
     
        ballbody.setLinearVelocity(0,0,0);

        this.monsterballbodyList.push(ballbody);

    }
    RepeatEnemysActionFar(){//원거리형타입들만.
        if(farenemys){
            //console.log("ths enemys??:",enemys);
            let x_flag;
            let y_flag;
            let z_flag;
            let unit;

            for(let e=0; e<farenemys.length; e++){
                //캐릭터주변 -48~48거리형태의 상위반구 형태.
                if(farenemys[e]){
                    let enemy_item=farenemys[e];
                    let enemy_threeobject=enemy_item.mesh;  
                    
                    if(enemy_threeobject.userData&&enemy_threeobject.userData.isAttacked){
                        if(e%2==0){
                            unit=-1;
                        }else{
                            unit=1;
                        }
                        let monster_speed= enemy_threeobject.userData&&enemy_threeobject.userData.speed;

                        //console.log("각각의 적들 취할 행동:",enemy_item,enemy_threeobject);
                        let enemy_physicsbody=enemy_item&&enemy_item.pbody;
                        let far_mul_option;
                        
                        let unit_grade=enemy_threeobject.userData.type;//farEnemy,boss,king,god
                       
                        far_mul_option=monster_speed*30;
                            
                        x_flag=Math.ceil(10*Math.random())*unit*0.2*Math.cos(3*e);//-2~2*0~1 -2~2다양화 xz범위 원형형태 xz구조 이차원, 
                        y_flag=Math.ceil(10*Math.random())*1*0.2*Math.cos(3*e);//0~2*0~1 xz범위와 합쳐지면 반구형태의 상위반구형태의 구조.캐릭터주변을 중심으로 상위반구형태기본형.(근거리,원거리형모두)
                        z_flag=Math.ceil(10*Math.random())*unit*0.2*Math.sin(3*e);//0~2
                        //console.log('x,ly,z flagss:원거리',x_flag,y_flag,z_flag)
                        
                        let ballchild_physicsbody;
                        if(this.character1){
                            let farunit_monsterball_isCreated=enemy_threeobject.userData.isCreated?enemy_threeobject.userData.isCreated:false;
        
                            // console.log("마지막 몬스터볼 생성시간 및 현재시간",now_farunitPer_time,farunit_monsterball_lastCreateTime,ballcreate_distanceTime);
        
                            //console.log("farenemey위치:",enemy_threeobject.position.x,enemy_threeobject.position.y,enemy_threeobject.position.z,enemy_physicsbody);
                            //console.log("각각이 적들 상태:",enemy_threeobject.userData) x,z,yfalg기본 거리범위에서 faruloption 원거리의 경우 최저6~24거리곱만큼 -2~2*6~24 -48~48범위까지 갈수있음.캐릭터주변로부터 -48~48범위에 존재할수있음(xz)y의 경우 0~2*6~24 캐릭터주변 상위반구 0~48범위까지 존재가능.threejs에서의 거리범위 -48~48범위를 표현한ㄴ 반구형태구조로 존재가능.
                            let distance_x=(this.character1.position.x + (x_flag*far_mul_option))- enemy_threeobject.position.x;//origin+0~0.5 or -0~0.5
                            let distance_z=(this.character1.position.z + (z_flag*far_mul_option))- enemy_threeobject.position.z;//origni+0~0.5 or -0~0.5
                            let distance_y=(this.character1.position.y +  (y_flag) )- enemy_threeobject.position.y;//origin+0~0.5 or -0~0.5
        
                            //console.log("캐릭터와의 위치격차:원거리",distance_x,distance_z,distance_y);
                            //console.log("====================================================================================units startsss")
        
                            //console.log("적용하게될힘의 캐릭터근처위치원거리",(this.character1.position.x + (x_flag*far_mul_option)),(this.character1.position.z + (z_flag*far_mul_option)),(this.character1.position.y +  (y_flag*far_mul_option)) );
                            //console.log("캐릭터위치?:",this.character1.position.x,this.character1.position.z,this.character1.position.y);
                            //console.log("xfalgfarmulotpinos,yz(원거리),",x_flag*far_mul_option,z_flag*far_mul_option,y_flag*far_mul_option)
                            //console.log("enemy_threeobject.position.xzy,",enemy_threeobject.position.x,enemy_threeobject.position.z,enemy_threeobject.position.y)
        
                            let resultantimpulse=new Ammo.btVector3(distance_x,distance_y,distance_z);
                            resultantimpulse.op_mul(monster_speed);//spped가 약할수록 수직방향에 대해서 중력에 영향을 더 강하게 받아서 위로는 잘 못올라옴 0.4~0.8 몬스터 속도 최저값은 0.4로 규정
                            
                            //console.log("적용할 힘(몬스터):",distance_x,distance_z,distance_y);
                            
                            enemy_physicsbody.setLinearVelocity(resultantimpulse)
        
                            if(!farunit_monsterball_isCreated){
                                this._FarEnemyCreateSkill(this.ammoClone,enemy_threeobject,unit_grade)
                            }
        
                            let ballchild=enemy_threeobject.userData&&enemy_threeobject.userData.ballChild;
                            ballchild_physicsbody=ballchild.userData&&ballchild.userData.physicsBody;
                            let ballchild_prev_moveposRate=ballchild.userData.movePosRate?ballchild.userData.movePosRate:1;
        
                            //console.log("farunit의 ballchild:",ballchild,ballchild_physicsbody,ballchild_prev_moveposRate)
        
                            let flagpos_x=(x_flag*far_mul_option)*ballchild_prev_moveposRate;//farmuliopotion0~0.2~0.8 *30 0~24 0.2*30 6 0.3*30 9위치까지 가능.캐릭터로부터 거리6~9,24거리가능.왔다갔다.
                            let flagpos_y=(y_flag*far_mul_option)*ballchild_prev_moveposRate;
                            let flagpos_z=(z_flag*far_mul_option)*ballchild_prev_moveposRate;
                            // let flagpos_x=(x_flag*far_mul_option)*0;
                            //let flagpos_y=(y_flag*far_mul_option)*0;
                            //let flagpos_z=(z_flag*far_mul_option)*0;
                            
                            //console.log("xfalgfarmulotpinos,yz(원거리 볼),",flagpos_x,flagpos_z,flagpos_y,ballchild_prev_moveposRate)
        
                            let distance_x_monsterball=(this.character1.position.x + (flagpos_x))- ballchild.position.x;//origin+0~0.5 or -0~0.5
                            let distance_z_monsterball=(this.character1.position.z + (flagpos_z))- ballchild.position.z;//origni+0~0.5 or -0~0.5
                            let distance_y_monsterball=(this.character1.position.y +  (flagpos_y) )- ballchild.position.y;//origin+0~0.5 or -0~0.5
                            //console.log("적용하게될힘의 캐릭터근처위치원거리(몬스터볼)",this.character1.position.x + (0),(this.character1.position.z + (0)),(this.character1.position.y +  (0) ) );
                            //console.log("ballchild.position.xzy,",ballchild.position.x,ballchild.position.z,ballchild.position.y)
                            //console.log("적용할 힘:(monsterball)",distance_x_monsterball,distance_z_monsterball,distance_y_monsterball); 
                            //결과적으론 몬스터볼motherunit위치와 캐릭터 위치를 번갈아가면서 미묘하게 왔다갔다 하는형태 2곱의 힘으로 왔다갔다 콜리션 발생하는 구도
        
                            ballchild_prev_moveposRate -= 0.01;//0일수록 캐릭터에게 가까운 위치로 이동,1일수록 캐릭터 주변의 반타원구형 주변위치xyz위치로 이동, 그 사이공간을 반복해서 왔다갔다 하는 구조형태
                            ballchild_prev_moveposRate=ballchild_prev_moveposRate.toFixed(2);
                            if(ballchild_prev_moveposRate <0){
                                ballchild_prev_moveposRate=1;
                            }
                            ballchild.userData.movePosRate= ballchild_prev_moveposRate;
                            //console.log("====================================================================================units Ends")
                            let resultantimpulse_ball=new Ammo.btVector3(distance_x_monsterball,distance_y_monsterball,distance_z_monsterball);
                            resultantimpulse_ball.op_mul(monster_speed*6);//몬스터볼은 유닛의 위치와 관계없이 캐릭터와의 위치를 상호작용하고있을뿐.그 언급한 왔다갔다 하는 속도가 점점 몬스터마더와 같이 느려질뿐.항상 원거리 몬스터속도의 10배 0.2가최저이니까 2까지는 속도 그래도 갈수있음. 0.8*6 인격우 4.8이나 된는 엄청난 속도 속도가 빠를수록 피해량은 더커지는경향
                            ballchild_physicsbody.setLinearVelocity(resultantimpulse_ball);
                        }
                    }
                
                    if(enemy_threeobject.userData.hp <=0){
                        let enemy_physicsbody=enemy_item&&enemy_item.pbody;
                        let ballchild=enemy_threeobject.userData&&enemy_threeobject.userData.ballChild;
                        let ballchild_physicsbody=ballchild.userData&&ballchild.userData.physicsBody;

                        let bodylist=this.monsterballbodyList;
                        let remove_ballbody;let remove_ballbody_index;
                        for(let b=0; b<bodylist.length; b++){
                            let body_item=bodylist[b];
                            if(body_item==ballchild_physicsbody){
                                remove_ballbody=body_item;
                                remove_ballbody_index=b;
                            }
                        }
                        if(remove_ballbody&& remove_ballbody.threeObject) this.scene.remove(remove_ballbody.threeObject);
                        if(remove_ballbody) this.physicsWorld.removeRigidBody(remove_ballbody);
                        for(let r=0; r<rigidBodies.length; r++){
                            let rigidItem=rigidBodies[r];
                            if(rigidItem === remove_ballbody.threeObject){
                                console.log("제거할 몬스터볼 bodyMeshjsss :",rigidItem,r);
                                rigidBodies[r]=undefined;
                            }
                        }
                        if(remove_ballbody_index!=undefined && !isNaN(remove_ballbody_index)) this.monsterballbodyList[remove_ballbody_index]=undefined;

                        //console.log("hp가 0이하로 떨어진 존재가 발견되었으면 enemys에서 제거",e);
                        //farenemys.splice(e,1);
                        farenemys[e]=undefined;
                        // this.monsterAnimData.splice(e,1);//해당 animData제거
                        let monsterAnimData=this.monsterAnimData;
                        for(let a=0; a<monsterAnimData.length; a++){
                            let anim=monsterAnimData[a];
                            if(anim){
                                if(anim['meshDistinct']===enemy_threeobject){
                                    //animData에 몬스터별 고유object3d mesh에 대응연결된 애니메이션데이터, threeobject별로 enemy별로 ㄱ animdata대조하여 비교하여 삭제할 enemyMEsh 3d object dat와 매칭되는 animData관련 index null로 처리,splice로 하면 안됨. 구조가 어그러짐.
                                    console.log("제겋될 meshDmdistinct animDATA:",anim,a);
                                    monsterAnimData[a]=undefined;//animData자체를 다 지워서 mixerUpdate안되게.
                                }
                            }
                          
                        }
                        this.scene.remove(enemy_threeobject)
                        for(let r=0; r<rigidBodies.length; r++){
                            let rigidItem=rigidBodies[r];
                            if(rigidItem === enemy_threeobject){
                                console.log("제거할 몬스터 enemyThreeojbec rigidBodmesh:",rigidItem,r);
                                rigidBodies[r]=undefined;
                            }
                        }
                        this.physicsWorld.removeRigidBody(enemy_physicsbody);
                    }
                }
                
            }   
        }
    }*/
    RepeatEnemysActionHumans(){//발사형created타입존재들만(공중유닛air,뜨는 지상인데 발사하는 원거리형태들모두)
        if(humanenemys){
            //console.log("ths enemys??:",enemys);
            let x_flag;
            let y_flag;
            let z_flag;
            let unit;


            for(let e=0; e<humanenemys.length; e++){
                //캐릭터주변 -48~48거리형태의 상위반구 형태.
                if(humanenemys[e]){
                    let enemy_item=humanenemys[e];
                    let enemy_threeobject=enemy_item.mesh;  
                    
                    let isAirunit=enemy_threeobject.userData&&enemy_threeobject.userData.isAir;
                    let isAirChase=enemy_threeobject.userData&&enemy_threeobject.userData.isAirChase;

                    let enemy_physicsbody=enemy_item&&enemy_item.pbody;

                    if(enemy_threeobject.userData&&enemy_threeobject.userData.isAttacked){
                        if(e%2==0){
                            unit=-1;
                        }else{
                            unit=1;
                        }
                        let monster_speed= enemy_threeobject.userData&&enemy_threeobject.userData.speed;
                        let distanceamount=enemy_threeobject.userData&&enemy_threeobject.userData.distanceamount;
                        let airAmountflag=enemy_threeobject.userData&&enemy_threeobject.userData.airAmountflag?enemy_threeobject.userData.airAmountflag:1;

                        let isAir=enemy_threeobject.userData&&enemy_threeobject.userData.isAir;

                        //console.log("각각의 적들 취할 행동:",enemy_item,enemy_threeobject);
                        let far_mul_option;
                        
                        let unit_grade=enemy_threeobject.userData.type;//farEnemy,boss,king,god
                        
                        far_mul_option=monster_speed*distanceamount;
                            
                        x_flag=Math.ceil(10*Math.random())*unit*0.2*Math.cos(3*e);//-2~2*0~1 -2~2다양화 xz범위 원형형태 xz구조 이차원, 
                        y_flag=Math.ceil(10*Math.random())*1*0.2*Math.cos(3*e);//0~2*0~1 xz범위와 합쳐지면 반구형태의 상위반구형태의 구조.캐릭터주변을 중심으로 상위반구형태기본형.(근거리,원거리형모두)
                        z_flag=Math.ceil(10*Math.random())*unit*0.2*Math.sin(3*e);//0~2
                        //console.log('x,ly,z flagss:원거리',x_flag,y_flag,z_flag)
                        
                        let ballchild_physicsbody;
                        if(this.character1){
                            let farunit_monsterball_tando_createdTime=enemy_threeobject.userData&&enemy_threeobject.userData.tando_createdTime;
                            let now_time=new Date().getTime();
                            let created_distance_time;
                            if(farunit_monsterball_tando_createdTime){
                                created_distance_time=now_time - farunit_monsterball_tando_createdTime;
                            }else{
                                created_distance_time=4000
                            }

                             //console.log("마지막 몬스터볼 생성시간 및 현재시간 생성경과시간",farunit_monsterball_tando_createdTime,now_time,created_distance_time);
        
                            //console.log("farenemey위치:",enemy_threeobject.position.x,enemy_threeobject.position.y,enemy_threeobject.position.z,enemy_physicsbody);
                            //console.log("각각이 적들 상태:",enemy_threeobject.userData) x,z,yfalg기본 거리범위에서 faruloption 원거리의 경우 최저6~24거리곱만큼 -2~2*6~24 -48~48범위까지 갈수있음.캐릭터주변로부터 -48~48범위에 존재할수있음(xz)y의 경우 0~2*6~24 캐릭터주변 상위반구 0~48범위까지 존재가능.threejs에서의 거리범위 -48~48범위를 표현한ㄴ 반구형태구조로 존재가능.
                            let y_add_amount
                            //console.log("isirrAir?:",isAir);
                            if(isAir){
                                y_add_amount=y_flag*far_mul_option*airAmountflag;//default:1
                            }else{
                                y_add_amount=y_flag*1;

                            }
                            //console.log("적용 YADADDDAMOUNT:",y_flag,y_add_amount)
                            let distance_x=(this.character1.position.x + (x_flag*far_mul_option))- enemy_threeobject.position.x;//origin+0~0.5 or -0~0.5
                            let distance_z=(this.character1.position.z + (z_flag*far_mul_option))- enemy_threeobject.position.z;//origni+0~0.5 or -0~0.5
                            let distance_y=(this.character1.position.y +  (y_add_amount) )- enemy_threeobject.position.y;//origin+0~0.5 or -0~0.5
        
                            let resultantimpulse;
                            if(isAirChase){
                                resultantimpulse=new Ammo.btVector3(distance_x,distance_y,distance_z);
                            }else{
                                resultantimpulse=new Ammo.btVector3(distance_x,0,distance_z);//공중에 대해선 힘을 못가하게
                            }
                            resultantimpulse.op_mul(monster_speed);//spped가 약할수록 수직방향에 대해서 중력에 영향을 더 강하게 받아서 위로는 잘 못올라옴 0.4~0.8 몬스터 속도 최저값은 0.4로 규정
                            
                            enemy_physicsbody.setLinearVelocity(resultantimpulse)
        
                            if(created_distance_time >=4000){
                                this._createSkill_FarMonster(this.ammoClone,enemy_threeobject,unit_grade)
                            }

                        }
                     
                    }else{
                        if(isAirunit){
                            if(enemy_physicsbody){
                                enemy_physicsbody.setLinearVelocity(new Ammo.btVector3(0,0,0));//공중유닛이면 비 공격상태에서 처음 생성위치로부터 중력영향안받고존재하게끔 처리.

                            }
                        }
                    }
                
                    if(enemy_threeobject.userData.hp <=0){
                        let enemy_physicsbody=enemy_item&&enemy_item.pbody;
                       
                        //console.log("hp가 0이하로 떨어진 존재가 발견되었으면 enemys에서 제거",e);
                        //farenemys.splice(e,1);
                        humanenemys[e]=undefined;
                        // this.monsterAnimData.splice(e,1);//해당 animData제거
                        let monsterAnimData=this.monsterAnimData;
                        for(let a=0; a<monsterAnimData.length; a++){
                            let anim=monsterAnimData[a];
                            if(anim){
                                if(anim['meshDistinct']===enemy_threeobject){
                                    //animData에 몬스터별 고유object3d mesh에 대응연결된 애니메이션데이터, threeobject별로 enemy별로 ㄱ animdata대조하여 비교하여 삭제할 enemyMEsh 3d object dat와 매칭되는 animData관련 index null로 처리,splice로 하면 안됨. 구조가 어그러짐.
                                    console.log("제겋될 meshDmdistinct animDATA:",anim,a);
                                    monsterAnimData[a]=undefined;//animData자체를 다 지워서 mixerUpdate안되게.
                                }
                            }                    
                        }
                        //diedsoundEFffectsss 
                        let diedSound=enemy_threeobject.userData.diedSound;
                        if(diedSound){
                            if(diedSound.isPlaying){
                                diedSound.offset=0;
                                diedSound.play();
                            }else{
                                diedSound.pause();
                                diedSound.offset=0;
                    
                                diedSound.play();
                            }
                        }
                       

                        this.scene.remove(enemy_threeobject)
                        for(let r=0; r<rigidBodies.length; r++){
                            let rigidItem=rigidBodies[r];
                            if(rigidItem === enemy_threeobject){
                                console.log("제거할 몬스터 enemyThreeojbec rigidBodmesh:",rigidItem,r);
                                rigidBodies[r]=undefined;
                            }
                        }
                        this.physicsWorld.removeRigidBody(enemy_physicsbody);
                    }
                }
                
            }   
        }
    }
    createLights(){
        let ambLight=new THREE.AmbientLight(0xffffff,0.82);
        this.scene.add(ambLight);

        let dirLight=new THREE.DirectionalLight(0xffffff,0.8);
        dirLight.color.setHSL(0.1,1,0.95);
        dirLight.position.set(-3,2.5,1);
        dirLight.position.multiplyScalar(100);
        this.scene.add(dirLight)

        dirLight.castShadow=true

        dirLight.shadow.mapSize.width=2048;
        dirLight.shadow.mapSize.height=2048;

        let d=50;

        dirLight.shadow.camera.left=-d;
        dirLight.shadow.camera.right=d;
        dirLight.shadow.camera.top=d;
        dirLight.shadow.camera.bottom=-d;

        dirLight.shadow.camera.far=20000;

        let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        light.position.set(20, 100, 10);
        light.target.position.set(0, 0, 0);
        light.castShadow = true;
        light.shadow.bias = -0.001;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 500.0;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 500.0;
        light.shadow.camera.left = 100;
        light.shadow.camera.right = -100;
        light.shadow.camera.top = 100;
        light.shadow.camera.bottom = -100;
        this.scene.add(light);
    
    }
    onResize(){
        const windowWidth=window.innerWidth;
        const windowHeight=window.innerHeight;

        this.camera.aspect=windowWidth/windowHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(windowWidth,windowHeight);
    }
    
    update(time){
        time *= 0.001;
        //console.log("time초변환값 시간경과지연 수축값:",time);
        const deltaTime=time-this._previousTime;
        if(this.loadmodels.length >= 1){
            //DATA CHECK!
            let is_some_unloaded=0;
            //console.log("===THIS LOADED models들의 로드여부 상태!!@!!!!",this.loadmodels);
            let loadedmodels=this.loadmodels;
            for(let l=0; l<loadedmodels.length; l++){
                let item=loadedmodels[l];
                //console.log("loademodel item?:",item);
                if(!item['isloaded']){
                    //하나라도 로드안된것 대상체가 있으면 카운팅한다.
                    is_some_unloaded++;
                }
            }
           // console.log("is_some_unloaded:",is_some_unloaded);
            if(is_some_unloaded==0){
               // console.log("is_some_unloaded=0인경우는 모든 로드모델로드시에만 한한다.");
                if(this.pageLoader){
                    this.pageLoader.style.display='none';
                }
            }
        }
        if(this.camera &&  this.character1 && this.characterballMeshUpdated){
            let angleCameraDirectionAxisY=Math.atan2(this.camera.position.x - this.character1.position.x,this.camera.position.z - this.character1.position.z);
            //console.log("순수카메라 angleCamera aixsY값:",angleCameraDirectionAxisY);//기본적으로 카메라를 바라보고있게된다.
            angleCameraDirectionAxisY =angleCameraDirectionAxisY + Math.PI;
           // console.log("적용anglecamear aixsY값:",angleCameraDirectionAxisY);//카메라를 항상 등지게 되어있게된다.
           
            const rotateQuaternion=new THREE.Quaternion();
            rotateQuaternion.setFromAxisAngle(
                new THREE.Vector3(0,1,0),angleCameraDirectionAxisY
            );//항상 등지고있는상태+alpha radian degree각도값으로 처리된다.
           
           // console.log("ball2 발사방향 회전하는형태",angleCameraDirectionAxisY);
            this.characterballMeshUpdated.quaternion.rotateTowards(rotateQuaternion,THREE.MathUtils.degToRad(20));
        } 
        

        if(this.update_particle_params_character ){
            if(this.character1){
                //console.log("현재 캐릭터와 웨폰의 위치 + camera:",this.character_isOverpower);
            
                if(this.charactertransform){
                    this.character_particlesFollowTransform1._points.position.set(this.charactertransform.position.x,this.charactertransform.position.y,this.charactertransform.position.z);
                }
               /* if(this.charactertransform2){
                    this.character_particlesFollowTransform2._points.position.set(this.charactertransform2.position.x,this.charactertransform2.position.y,this.charactertransform2.position.z);
                }
                if(this.charactertransform3){
                    this.character_particlesFollowTransform3._points.position.set(this.charactertransform3.position.x,this.charactertransform3.position.y,this.charactertransform3.position.z);    
                }  */
            }
  
            if(this.character_particlesFollowTransform1){
                this.character_particlesFollowTransform1.Step(deltaTime,this.update_particle_params_character);
            }
           /* if(this.character_particlesFollowTransform2){
                this.character_particlesFollowTransform2.Step(deltaTime,this.update_particle_params_character);
            }
            if(this.character_particlesFollowTransform3){
                this.character_particlesFollowTransform3.Step(deltaTime,this.update_particle_params_character);
            }  */
        }

        if(this.character_isOverpower){
            //console.log("overpower캐릭터 상태이면 particles킨다");
            let character=this.character1;
            character.traverse(child=>{
               // console.log("character character traverse탐방scene:",child);
                if(child instanceof THREE.Mesh){
                    //console.log("mesh type들!!:",child);
                    const emssioncolor = new THREE.Color();
                    emssioncolor.setRGB(this.transform_emissiveColor['r'],this.transform_emissiveColor['g'],this.transform_emissiveColor['b']);//캐릭터별로 방출색상다르게

                    child.material['emissive']=emssioncolor;
                    child.material['emissiveIntensity']=1
                }
            })
            let charactertransform1=this.charactertransform;
            if(charactertransform1){
                charactertransform1.traverse(child=>{
                    // console.log("character character traverse탐방scene:",child);
                     if(child instanceof THREE.Mesh){
                         //console.log("mesh type들!!:",child);
                         const emssioncolor = new THREE.Color();
                         emssioncolor.setRGB(this.transform_emissiveColor['r'],this.transform_emissiveColor['g'],this.transform_emissiveColor['b']);//캐릭터별로 방출색상다르게

                         child.material['emissive']=emssioncolor;
                         child.material['emissiveIntensity']=1
                     }
                 })
            }
          
            /*let charactertransform2=this.charactertransform2;
            if(charactertransform2){
                charactertransform2.traverse(child=>{
                    // console.log("character character traverse탐방scene:",child);
                     if(child instanceof THREE.Mesh){
                         //console.log("mesh type들!!:",child);
                         const emssioncolor = new THREE.Color();
                         emssioncolor.setRGB(this.transform_emissiveColor['r'],this.transform_emissiveColor['g'],this.transform_emissiveColor['b']);//캐릭터별로 방출색상다르게

                    child.material['emissive']=emssioncolor;
                    child.material['emissiveIntensity']=1
                     }
                 })
            }
            let charactertransform3=this.charactertransform3;
            if(charactertransform3){
                charactertransform3.traverse(child=>{
                    // console.log("character character traverse탐방scene:",child);
                     if(child instanceof THREE.Mesh){
                         //console.log("mesh type들!!:",child);
                         const emssioncolor = new THREE.Color();
                         emssioncolor.setRGB(this.transform_emissiveColor['r'],this.transform_emissiveColor['g'],this.transform_emissiveColor['b']);//캐릭터별로 방출색상다르게

                         child.material['emissive']=emssioncolor;
                         child.material['emissiveIntensity']=1
                     }
                 })
            }*/
            
            if(this.character_particlesFollowTransform1){
                this.character_particlesFollowTransform1._points.visible=true;
            }
            /*if(this.character_particlesFollowTransform2){
                this.character_particlesFollowTransform2._points.visible=true;
            }
            if(this.character_particlesFollowTransform3){
                this.character_particlesFollowTransform3._points.visible=true;
            }  */
       
           if(this.charactertransform){
            this.charactertransform.visible=true;
           }
           /*if(this.charactertransform2){
            this.charactertransform2.visible=true;
           } 
           if(this.charactertransform3){
            this.charactertransform3.visible=true;
           }*/
        }else{
            //console.log("overpower캐릭터 상태가 아니면 particles끈다");
            this.transformSound.pause();

            let character=this.character1;
            if(character){
                character.traverse(child=>{
                    //console.log("character character traverse탐방scene:",child);
                    if(child instanceof THREE.Mesh){
                        //console.log("mesh type들!!:",child);
                        const emssioncolor = new THREE.Color();
                        emssioncolor.setRGB(0,0,0);//캐릭터별로 방출색상다르게
    
                        child.material['emissive']=emssioncolor;
                        child.material['emissiveIntensity']=0
                    }
                })
            }
            let charactertransform1=this.charactertransform;
            if(charactertransform1){
                charactertransform1.traverse(child=>{
                    // console.log("character character traverse탐방scene:",child);
                     if(child instanceof THREE.Mesh){
                         //console.log("mesh type들!!:",child);
                         const emssioncolor = new THREE.Color();
                         emssioncolor.setRGB(0,0,0);//캐릭터별로 방출색상다르게

                         child.material['emissive']=emssioncolor;
                         child.material['emissiveIntensity']=0
                     }
                 })
            }
          
           /* let charactertransform2=this.charactertransform2;
            if(charactertransform2){
                charactertransform2.traverse(child=>{
                    // console.log("character character traverse탐방scene:",child);
                     if(child instanceof THREE.Mesh){
                         //console.log("mesh type들!!:",child);
                         const emssioncolor = new THREE.Color();
                         emssioncolor.setRGB(0,0,0);//캐릭터별로 방출색상다르게

                        child.material['emissive']=emssioncolor;
                        child.material['emissiveIntensity']=1
                     }
                 })
            }
            let charactertransform3=this.charactertransform3;
            if(charactertransform3){
                charactertransform3.traverse(child=>{
                    // console.log("character character traverse탐방scene:",child);
                     if(child instanceof THREE.Mesh){
                         //console.log("mesh type들!!:",child);
                         const emssioncolor = new THREE.Color();
                         emssioncolor.setRGB(0,0,0);//캐릭터별로 방출색상다르게

                         child.material['emissive']=emssioncolor;
                         child.material['emissiveIntensity']=1
                     }
                 })
            }*/
          
            if(this.character_particlesFollowTransform1){
                this.character_particlesFollowTransform1._points.visible=false;
            }
            /*if(this.character_particlesFollowTransform2){
                this.character_particlesFollowTransform2._points.visible=false;
            }
            if(this.character_particlesFollowTransform3){
                this.character_particlesFollowTransform3._points.visible=false;
            } */

            if(this.charactertransform){
                this.charactertransform.visible=false;
            }
           /* if(this.charactertransform2){
                this.charactertransform2.visible=false;
            }
            if(this.charactertransform3){
                this.charactertransform3.visible=false;
            }*/
        }

        if(this._mixer){
            //console.log("애니메이션 캐릭터 믹서 상태?:",this._mixer,this._currentAnimationAction._clip.name)
            this._mixer.update(deltaTime);
        }
        if(this.charactertransform_mixer){
            this.charactertransform_mixer.update(deltaTime);
        }
        /*if(this.charactertransform_mixer2){
            this.charactertransform_mixer2.update(deltaTime);
        }
        if(this.charactertransform_mixer3){
            this.charactertransform_mixer3.update(deltaTime);
        }*/

        if(this.characterStatus){
            if(this.character1){
                this.characterStatus.innerHTML=`hp:${this.character1.userData&&this.character1.userData.hp},pos:${this.character1.position.x&&this.character1.position.x.toFixed(2)},${this.character1.position.y&&this.character1.position.y.toFixed(2)},${this.character1.position.y&&this.character1.position.z.toFixed(2)},Speed:${this.character1.userData&&this.character1.userData.speed},mass:${this.character1.userData&&this.character1.userData.mass},defense:${this.character1.userData.defense},'power':${this.character1.userData.power}<br/>`
                this.characterStatus.innerHTML+=`moveStatus:${this.character_move_status},animStatus:${this._currentAnimationAction&&this._currentAnimationAction._clip.name}, GroundCollisioninfo:${groundCollision['groundcontact']}${groundCollision['value']}} // status:${this.character1.userData.status}<br/>`
                this.characterStatus.innerHTML+=`characterballbodycamera:${this.chracterballbody2}<br/>`;
                this.characterStatus.innerHTML+=`weapon rotate XYZ::${this.x},${this.y},${this.z}<br/>`;
                this.characterStatus.innerHTML+=`weaponpower:${this.character1.userData&&this.character1.userData.weaponpower},weaponpowerflag:${this.character1.userData&&this.character1.userData.weaponpowerflag},rasierpowerflag:${this.character1.userData&&this.character1.userData.rasierpowerflag},explodepower:${this.character1.userData&&this.character1.userData.explodepower},rasierpower:${this.character1.userData&&this.character1.userData.rasierpower},recoverpower:${this.character1.userData&&this.character1.userData.recoverpower},transformpower:${this.character1.userData&&this.character1.userData.transformpower}<br/>CAMERAPOS:${this.camera.position.x.toFixed(2)},${this.camera.position.y.toFixed(2)},${this.camera.position.z.toFixed(2)}`;

                if(this.isdanceTime){
                    //rest전환 정신,육체가열 전환을 통해 모든 신체적,정신적 고통피로를 정신의힘으로 승화하여 치료한다.일정회복량만큼 회복. 
                    let recoverpower=this.character1.userData.recoverpower;
                    //console.log("캐릭터 리커버파워상태이면 계속 hp회복시킴.",recoverpower);
                    let prevhp=this.character1.userData.hp;
                    prevhp = prevhp + recoverpower;
                    this.character1.userData.hp = prevhp;
                }

            }
        }
        if(this.hpstatus){
            if(this.character1 && this.character1.userData && this.character1.userData.hp){
                this.hpstatus.innerHTML=`HP : ${this.character1.userData&&this.character1.userData.hp}`
            }
        }
      
        if(this.monsterAnimData){
             //DATA CHECK!!
          // console.log("[[[[[[[[[[[[[[[[[[[this.monsterAnimData: status",this.monsterAnimData); //CHECK
           for(let m=0; m<this.monsterAnimData.length; m++){
                if(this.monsterAnimData[m]){//존재하는 animData에 대해서만처리진행.
                    let monsteranimdata_item=this.monsterAnimData[m];
                    if(monsteranimdata_item.mixer){
                        //console.log("thismosnterAnimdata mixerss:",monsteranimdata_item.mixer)
                        monsteranimdata_item.mixer.update(deltaTime);
                    }
                    if(monsteranimdata_item.boxhelper){
                        monsteranimdata_item.boxhelper.update();
                    }
                }
            }
        }
        if(this.friendsAnimData){
           // console.log("[[[[[[[[[[[[[[[[[[[this.friendsAnimData: status",this.friendsAnimData); //CHECK
            for(let m=0; m<this.friendsAnimData.length; m++){
                 if(this.friendsAnimData[m]){//존재하는 animData에 대해서만처리진행.
                     let friendsanimdata_item=this.friendsAnimData[m];
                     if(friendsanimdata_item.mixer){
                         //console.log("thismosnterAnimdata mixerss:",monsteranimdata_item.mixer)
                         friendsanimdata_item.mixer.update(deltaTime);
                     }
                     if(friendsanimdata_item.boxhelper){
                        friendsanimdata_item.boxhelper.update();
                     }
                 }
             }

             let friendsAnimData=this.friendsAnimData;
             if(friendsAnimData.length ===0){
                this.Yskill.style.display='none';
             }else{
                this.Yskill.style.display='block';
             }
         }
        
        
        if(this.physicsWorld) {
            this.updatePhysics(time);
        }
        if(this.characterboxhelper){
          //  console.log("characterboxhelper:",this.characterboxhelper,this.characterboxhelper.update);
            this.characterboxhelper.update();
        }
        if(this.weaponboxhelper){
            //  console.log("characterboxhelper:",this.characterboxhelper,this.characterboxhelper.update);
              this.weaponboxhelper.update();
        }
       /* if(this.charactertransformboxhelper3){
            this.charactertransformboxhelper3.update()
        }
        if(this.charactertransformboxhelper2){
            this.charactertransformboxhelper2.update()
        }*/
        if(this.charactertransformboxhelper){
            this.charactertransformboxhelper.update()
        }

        if(this._fps){
           // this._fps.update();
        }
        if(this.character1){
           // console.log("thischaracter1 statj상태:",this.character1.userData&&this.character1.userData.status,this.character1.userData&&this.character1.userData.hp);

            let character_hp=this.character1.userData.hp;
            //console.log("뭔데character_hp??:",character_hp,this.character1.userData.status,this.threejsScene_animated)
            if(character_hp<=0){
                this.character1.userData.status='unlive';
                this.threejsScene_animated=false;
                //console.log("hp 0미만돌입",this.threejsScene_animated)
            }
         
         
            if((this.NextEntrance && this.NextMoveAgree ) || (this.NextEntrance2 && this.NextMoveAgree2 ) ||(this.StartEntrance && this.StartMoveAgree)){
                //포탈도달시에 애니메이팅 멈추고 맵 전환
                console.log("tjhis nextEtnrac,ess:",this.NextEntrance,this.NextMoveAgree)
                this.threejsScene_animated=false;
            }else{
                if(character_hp > 0){
                    this.threejsScene_animated=true;
                }else{
                    this.threejsScene_animated=false;
                }
            }
          

            if(this.character1.position.y <= -5000){
                this.threejsScene_animated=false;
                window.setTimeout(()=>{
                    location.reload();
                },1200);
            }
        }

        let deltaClock=time-this._previousTime;

        //DATA CHECK!!
      // console.log("폭발물 scene상태:(폭발정보처리계산량amount)",this.explodesMaterials);// CHECK
      // console.log("폭발물Triggers scene상태:",this.explodeTriggerMaterials);// CHECK
       //console.log("ExplodeEffectMaterials(폭발물포인트파티클자체) scene상태:",this.ExplodeEffectMaterials); //CHECK
       
        //console.log("원격조준 라인케스터 scene상태:",this.lineTriggerMaterials);// CHECK
        //console.log("무기콜리젼 effectParticlesss scene상태:",this.WeaponCollisionTriggerMaterials); //CHECK

        //console.log("monsterCreatedBallList",this.monsterCreatedBallList); //CHECK
       // console.log("ExplodeEffectMaterialsMonster:",this.ExplodeEffectMaterialsMonster); //CHECK
        //console.log("monster Far발사체형 라인케스터 scene 상태:",this.lineTriggerMaterialsMonster); //CHECK
        //console.log("EnemyBuildingMaterials:",this.EnemyBuildingMaterials); //CHECK

        let explodesMaterials=this.explodesMaterials;//이것은 전반적 정보를 담고있는 그릇이고 폭발material setupExplode로 생성해냏은 파편이 터지는 거대한 오브젝트 그 자체이며 그의 range크기그대로만큼의 공간에 속하고있는(비물리)발사하는 포탄만 물리적용되고 그 부딪힌 위치에 한번에 한해서?setupexlodes로 거대옵젝ㅌ 생성하고 그 오브젝트의 범위상에 있는 각 거대폭발오브젝트별로 그 범위안에이는 몬스터들이 있느경우에 한해서 몬스터에게 뎀지를 입히고, 거대오브젝트리스트는 시간이 되면 없어지고 이거 자체가 없엇으면 아예 실행할것은 없고, 반응할 몬스터ㅕ들이나 이런게 없다면 아예 돌지 않고 빨라지겠지!
        for(let e=0; e<explodesMaterials.length; e++){
            let e_item=explodesMaterials[e];
            //console.log("e_item 상태:",e_item.uniforms.amplitude,e_item.mesh,e_item.range);
         
            if(e_item.uniforms && e_item.uniforms.amplitude.value>=200){
                //console.log("200값 초과했다면??:",e_item);
                this.scene.remove(e_item.mesh);
              
                e_item.mesh=null;
                explodesMaterials.splice(e,1)
                continue;
            }

            if(this.character1&&this.character1.userData){
            
                let user_explodePower=this.character1.userData&&this.character1.userData&&this.character1.userData.explodepower?this.character1.userData.explodepower:10;
               
                let explosion_startx=e_item.range.startx;
                let explosion_endx=e_item.range.endx;
    
                let explosion_startz=e_item.range.startz;
                let explosion_endz=e_item.range.endz;
    
                let explosion_starty=e_item.range.starty;
                let explosion_endy=e_item.range.endy;
                //console.log("e_item 범위 위치 상태:xyz",e_item.range.startx,e_item.range.endx,e_item.range.startz,e_item.range.endz,e_item.range.starty,e_item.range.endy,user_explodePower);

                let powerflag= this.character_isOverpower ? 3 : 1;
                let basepower=this.character1.userData.power;

                for(let e=0; e<enemys.length; e++){
                    if(enemys[e]){
                        let closetypemonster=enemys[e]['mesh'];
                        //console.log("근접 타입 모든 몬스터들과 그 위치:",closetypemonster,closetypemonster.position);
                        let unit_position_x=closetypemonster.position.x;
                        let unit_position_y=closetypemonster.position.y;
                        let unit_position_z=closetypemonster.position.z;

                        if((unit_position_x >= explosion_startx && unit_position_x <= explosion_endx) && (unit_position_y >= explosion_starty && unit_position_y <= explosion_endy) && (unit_position_z >= explosion_startz && unit_position_z <= explosion_endz)){
                           // console.log("폭발 범위에 있던경우에 한해서 그 몬스터들에게 데미지를 입힌다.",closetypemonster)
                            let target_monster=closetypemonster;
                            if(closetypemonster && closetypemonster.userData){
                                closetypemonster.userData.isAttacked=true;
                                let prev_hp=target_monster.userData.hp;
                                let monster_defense=target_monster.userData.defense;
                                
                                let damage=(user_explodePower *basepower*powerflag) - monster_defense;
                                damage= damage <=0 ? 0 : damage;
                                //console.log("기존 prevhp와 입힐 데미지:",prev_hp,damage);
                                prev_hp= prev_hp - damage;
                                target_monster.userData.hp=prev_hp;
                            }
                        
                        }
                    }
                }
                for(let e=0; e<farenemys.length; e++){
                    if(farenemys[e]){
                        let fartypemonster=farenemys[e]['mesh'];
                        //console.log("근접 타입 모든 몬스터들과 그 위치:",closetypemonster,closetypemonster.position);
                        let unit_position_x=fartypemonster.position.x;
                        let unit_position_y=fartypemonster.position.y;
                        let unit_position_z=fartypemonster.position.z;

                        if((unit_position_x >= explosion_startx && unit_position_x <= explosion_endx) && (unit_position_y >= explosion_starty && unit_position_y <= explosion_endy) && (unit_position_z >= explosion_startz && unit_position_z <= explosion_endz)){
                            //console.log("폭발 범위에 있던경우에 한해서 그 몬스터들에게 데미지를 입힌다.",fartypemonster)
                            let target_monster=fartypemonster;
                            if(fartypemonster && fartypemonster.userData){
                                fartypemonster.userData.isAttacked=true;
                                let prev_hp=target_monster.userData.hp;
                                let monster_defense=target_monster.userData.defense;
                                
                                let damage=(user_explodePower *basepower*powerflag) - monster_defense;
                                damage= damage <=0 ? 0 : damage;
                                //console.log("기존 prevhp와 입힐 데미지:",prev_hp,damage);
                                prev_hp= prev_hp - damage;
                                target_monster.userData.hp=prev_hp;
                            }
                        
                        }
                    }
                }
                for(let e=0; e<humanenemys.length; e++){
                    if(humanenemys[e]){
                        let humantypemonster=humanenemys[e]['mesh'];
                        //console.log("근접 타입 모든 몬스터들과 그 위치:",closetypemonster,closetypemonster.position);
                        let unit_position_x=humantypemonster.position.x;
                        let unit_position_y=humantypemonster.position.y;
                        let unit_position_z=humantypemonster.position.z;

                        if((unit_position_x >= explosion_startx && unit_position_x <= explosion_endx) && (unit_position_y >= explosion_starty && unit_position_y <= explosion_endy) && (unit_position_z >= explosion_startz && unit_position_z <= explosion_endz)){
                           // console.log("폭발 범위에 있던경우에 한해서 그 몬스터들에게 데미지를 입힌다.",humantypemonster)
                            let target_monster=humantypemonster;
                            if(humantypemonster && humantypemonster.userData){
                                humantypemonster.userData.isAttacked=true;
                                let prev_hp=target_monster.userData.hp;
                                let monster_defense=target_monster.userData.defense;
                                
                                let damage=(user_explodePower *basepower*powerflag) - monster_defense;
                                damage= damage <=0 ? 0 : damage;
                                //console.log("기존 prevhp와 입힐 데미지:",prev_hp,damage);
                                prev_hp= prev_hp - damage;
                                target_monster.userData.hp=prev_hp;
                            }
                        
                        }
                    }
                }
                for(let e=0; e<anothercharacters.length; e++){
                    if(anothercharacters[e]){
                        let targets=anothercharacters[e]['mesh'];
                        let unit_position_x=targets.position.x;
                        let unit_position_y=targets.position.y;
                        let unit_position_z=targets.position.z;
        
                        if((unit_position_x >= explosion_startx && unit_position_x <= explosion_endx) && (unit_position_y >= explosion_starty && unit_position_y <= explosion_endy) && (unit_position_z >= explosion_startz && unit_position_z <= explosion_endz)){
                           // console.log("폭발 범위에 있던경우 범위에 있던경우에 한해서 그 대상들에게 데미지를 입힌다.",targets)
                            let target_monster=targets;
                            if(targets && targets.userData){
                                targets.userData.isAttacked=true;
                                let prev_hp=target_monster.userData.hp;
                                let monster_defense=target_monster.userData.defense;
                                
                                let damage=(user_explodePower *basepower*powerflag) - monster_defense;
                                damage= damage <=0 ? 0 : damage;
                               // console.log("기존 prevhp와 입힐 데미지:",prev_hp,damage);
                                prev_hp= prev_hp - damage;
                                target_monster.userData.hp=prev_hp;
                                
                            }
                        }
                    }
                }
                let EnemyBuildingMaterials=this.EnemyBuildingMaterials;
                let intersects_buildingCount=0;
                let enemyBuildingCount=EnemyBuildingMaterials.length;
                for(let e=0; e<EnemyBuildingMaterials.length; e++){
                    let e_item=EnemyBuildingMaterials[e];
                    //console.log("EneinyBuidling materialsss건물상태와 어떠한 위치공간정보 wide스킬폭발범위가 건물의 위치공간 startxyz,endxyz와 intersects교차공간이 있는지 여부 검사알고리즘",e_item);
                    //console.log("=======================starts===========================================");
                    let buildingMesh3Dobject=e_item.mesh;
                    let buildingbox=(new THREE.Box3).setFromObject(buildingMesh3Dobject);
                    //console.log("buidlingbox setFromOobject관련 공간 좌표정보:",buildingbox);
        
                    let BSTARTX=buildingbox.min.x; let BENDX=buildingbox.max.x;
                    let BSTARTY=buildingbox.min.y; let BENDY=buildingbox.max.y;
                    let BSTARTZ=buildingbox.min.z; let BENDZ=buildingbox.max.z;
        
                    //console.log("wideExplosion폭파범위:x",explosion_startx,explosion_endx);
                   // console.log("wideExplosion폭파범위:y",explosion_starty,explosion_endy);
                   // console.log("wideExplosion폭파범위:z",explosion_startz,explosion_endz);
                   // console.log("건물위치공간범위:x",BSTARTX,BENDX);
                   // console.log("건물위치공간범위:y",BSTARTY,BENDY);
                    //console.log("건물위치공간범위:z",BSTARTZ,BENDZ);
                    if((explosion_endx > BSTARTX && explosion_startx < BENDX) && (explosion_endz > BSTARTZ && explosion_startz < BENDZ) && (explosion_endy > BSTARTY && explosion_starty < BENDY)){
                        //console.log("Wide폭발범위가 xyz공간에 대해서 모두 건물범위와 intersects를 하는 경우가 사실상 폭발범위가 건물과 접촉포함intersect되고있다고할수있다 하나라도 안되는 경우는 폭발범위가 건물범위와 intersect하고있지 않는 경우이다!![[폭발범위와 건물범위Intersectss]]")
                        //console.log("교차건물 오브젝트:",buildingMesh3Dobject);
                        intersects_buildingCount++;

                        let target_monster=buildingMesh3Dobject;
                        if(target_monster && target_monster.userData){
                            target_monster.userData.isAttacked=true;
                            let prev_hp=target_monster.userData.hp;
                            let monster_defense=target_monster.userData.defense;
                            
                            let damage=(user_explodePower *basepower*powerflag) - monster_defense;
                            damage= damage <=0 ? 0 : damage;
                            //console.log("기존 prevhp와 입힐 데미지:",prev_hp,damage);
                            prev_hp= prev_hp - damage;
                            target_monster.userData.hp=prev_hp;
                            
                        }
                    }else{
                       // console.log("폭발범위가 건물범위와 intersect전혀 하고 있지 않는 경우!!");
                    }
                   // console.log("=======================endsss===========================================");
                }
                //console.log(`Enemnybuildnigi inersects카운트:${intersects_buildingCount}/${enemyBuildingCount}`);
            }   
            e_item.uniforms.amplitude.value = e_item.uniforms.amplitude.value + (deltaClock*5);
        }
        //캐릭터볼포탄트리거(발사후 폭파되지않고 남은파편들 제거) 폭파성공한것,실패한것 상관없이 push로 쌓이고 시간되면 없앨뿐이다.
        let explodeTriggerMaterials=this.explodeTriggerMaterials;
        for(let e=0; e<explodeTriggerMaterials.length; e++){
            let e_item=explodeTriggerMaterials[e];
            //console.log("e_item(triggerMaterialss)상태:",e_item.fakeuniforms.amplitude);

            if(e_item.fakeuniforms && e_item.fakeuniforms.amplitude.value>=300){
               // console.log("300값 초과했다면??:",e_item);
                let item_physics=e_item.mesh.userData.physicsBody;
                //let rigidbodies_index=rigidBodies.indexOf(e_item.mesh);
                //rigidBodies.splice(rigidbodies_index,1);
                this.scene.remove(e_item.mesh);
                for(let r=0; r<rigidBodies.length; r++){
                    let rigidItem=rigidBodies[r];
                    if(rigidItem === e_item.mesh){
                        console.log("제거할 캐릭터볼 enemyThreeojbec rigidBodmesh:",rigidItem,r);
                        rigidBodies[r]=undefined;
                    }
                }
                e_item.mesh=null;
                explodeTriggerMaterials.splice(e,1);
                this.physicsWorld.removeRigidBody(item_physics);
              
                continue;
            }
            e_item.fakeuniforms.amplitude.value = e_item.fakeuniforms.amplitude.value + (deltaClock*10);
        }
        let EnemyBuildingMaterials=this.EnemyBuildingMaterials;
        for(let e=0; e<EnemyBuildingMaterials.length; e++){
            let e_item=EnemyBuildingMaterials[e];
            //console.log("EnemyBuildingMaterials??",e_item.uniforms.amplitude.value);

            if(e_item.uniforms && e_item.uniforms.amplitude.value>=300){
                let buildling_collapseSound=e_item.mesh.userData&&e_item.mesh.userData.collapseSound
                console.log("300값 초과했다면 에너미빌딩제거한다: 빌딩 개별적으로 갖고있는 sound데이터를 실행한다.",e_item,buildling_collapseSound);
                let item_physics=e_item.mesh.userData.physicsBody;
                //let rigidbodies_index=rigidBodies.indexOf(e_item.mesh);
                //rigidBodies.splice(rigidbodies_index,1);
                this.scene.remove(e_item.mesh);
                for(let r=0; r<rigidBodies.length; r++){
                    let rigidItem=rigidBodies[r];
                    if(rigidItem === e_item.mesh){
                        console.log("제거할 건물빌딩 enemyThreeojbec rigidBodmesh:",rigidItem,r);
                        rigidBodies[r]=undefined;
                    }
                }
                e_item.mesh=null;
                EnemyBuildingMaterials.splice(e,1);
                this.physicsWorld.removeRigidBody(item_physics);
              
             
                if(buildling_collapseSound){
                    if(Array.isArray(buildling_collapseSound)){
                        //console.log("다중 사운드였떤경우!!!!!!:",buildling_collapseSound);
                        for(let a=0; a<buildling_collapseSound.length; a++){
                            let collapseSound_loca=buildling_collapseSound[a];
                            if(collapseSound_loca){
                                (function(i){

                                    if(collapseSound_loca.isPlaying){
                                        window.setTimeout(function(){
                                            collapseSound_loca.offset=0;
                                            collapseSound_loca.play();
                                        },60*(i+1));
                                      
                                    }else{
                                        window.setTimeout(function(){
                                            collapseSound_loca.pause();
                                            collapseSound_loca.offset=0;
                                
                                            collapseSound_loca.play();
                                        },60*(i+1));
                                    }
                                }(a));
                                
                            }
                        }
                    }else{
                        if(buildling_collapseSound.isPlaying){
                            buildling_collapseSound.offset=0;
                            buildling_collapseSound.play();
                        }else{
                            buildling_collapseSound.pause();
                            buildling_collapseSound.offset=0;
                
                            buildling_collapseSound.play();
                        }
                    }
                    
                }
                continue;
            }
            let building_mesh=e_item.mesh;
            let hp_status=building_mesh.userData && building_mesh.userData.hp;
           // console.log("now buildlings hp:",hp_status)
            if(hp_status<=1500 && hp_status >0){//1500이하 hp건물들은 모두 이렇게 피해를 받게 처리한다.그떄부터.
                e_item.uniforms.amplitude.value = e_item.uniforms.amplitude.value + (deltaClock*1.2);
            }else if(hp_status<=0 && hp_status >-5000){
                e_item.uniforms.amplitude.value = e_item.uniforms.amplitude.value + (deltaClock*20);
            }else if(hp_status<=-5000){
                e_item.uniforms.amplitude.value = e_item.uniforms.amplitude.value + (deltaClock*30);
            }
        }
        //발사형 몬스터가 생성한 객체정보전반적리스트.폭파되지않고,폭파성공한것 모두 시간되면 제거할뿐임.폭파성공한것은 이 리스트상에서 그자리에서 삭제함.
        let monsterCreatedBallList=this.monsterCreatedBallList;
        for(let e=0; e<monsterCreatedBallList.length; e++){
            let e_item=monsterCreatedBallList[e];
            //console.log("e_item(monsterCreatedBallList)상태:",e_item);
            if(e_item){
                if(e_item.fakeuniforms && e_item.fakeuniforms.amplitude.value>=300){
                    // console.log("300값 초과했다면??:",e_item);
                     let item_physics=e_item.mesh.userData.physicsBody;
                     //let rigidbodies_index=rigidBodies.indexOf(e_item.mesh);
                     //rigidBodies.splice(rigidbodies_index,1);
                     this.scene.remove(e_item.mesh);
                     for(let r=0; r<rigidBodies.length; r++){
                         let rigidItem=rigidBodies[r];
                         if(rigidItem === e_item.mesh){
                             console.log("제거할 몬스터볼 enemyThreeojbec rigidBodmesh:",rigidItem,r);
                             rigidBodies[r]=undefined;
                         }
                     }
                     e_item.mesh=null;
                     monsterCreatedBallList[e]=undefined;
                     this.physicsWorld.removeRigidBody(item_physics);
                   
                     continue;
                 }
                 e_item.fakeuniforms.amplitude.value = e_item.fakeuniforms.amplitude.value + (deltaClock*10);
            }
        }
    
        //광선투사(캐릭터)관련 물질들 직선,라인pointers,폭파영역박스 시간되면 지워짐
        let lineTriggerMaterials=this.lineTriggerMaterials;
        for(let e=0; e<lineTriggerMaterials.length; e++){
            let e_item=lineTriggerMaterials[e];
            //console.log("e_item(triggerMaterialss)상태:",e_item.fakeuniforms.amplitude);

            if(e_item.fakeuniforms && e_item.fakeuniforms.amplitude.value>=100){
               // console.log("300값 초과했다면??:",e_item);
                this.scene.remove(e_item.mesh);
                e_item.mesh=null;
                lineTriggerMaterials.splice(e,1);
                continue;
            }
            e_item.fakeuniforms.amplitude.value = e_item.fakeuniforms.amplitude.value + (deltaClock*20);
        }
        let WeaponCollisionTriggerMaterials=this.WeaponCollisionTriggerMaterials;
        for(let e=0; e<WeaponCollisionTriggerMaterials.length; e++){
            let e_item=WeaponCollisionTriggerMaterials[e];
            //console.log("e_item(triggerMaterialss)상태:",e_item.fakeuniforms.amplitude);

            if(e_item.fakeuniforms && e_item.fakeuniforms.amplitude.value>=100){
               // console.log("300값 초과했다면??:",e_item);
                this.scene.remove(e_item.mesh);
                e_item.mesh=null;
                WeaponCollisionTriggerMaterials.splice(e,1);
                continue;
            }
            e_item.fakeuniforms.amplitude.value = e_item.fakeuniforms.amplitude.value + (deltaClock*20);
        }
        let ExplodeEffectMaterials=this.ExplodeEffectMaterials;//충돌체발사체가 물체에 부딛혔어서 n개의 폭발오브젝트 생성시때에 한해서 그 마찰된 위치에서 폭발되는 폭발오브젝트와함꼐 생성된다!!
        for(let e=0; e<ExplodeEffectMaterials.length; e++){
            let e_item=ExplodeEffectMaterials[e];
            //console.log("e_item(triggerMaterialss)상태:",e_item.fakeuniforms.amplitude);

            if(e_item.fakeuniforms && e_item.fakeuniforms.amplitude.value>=200){
               // console.log("300값 초과했다면??:",e_item);
                this.scene.remove(e_item.mesh);
                e_item.mesh=null;
                ExplodeEffectMaterials.splice(e,1);
                continue;
            }
            e_item.fakeuniforms.amplitude.value = e_item.fakeuniforms.amplitude.value + (deltaClock*20);
        }
        
        //몬스터 가 던진 스킬관련
        let ExplodeEffectMaterialsMonster=this.ExplodeEffectMaterialsMonster;//충돌체발사체가 물체에 부딛혔어서 n개의 폭발오브젝트 생성시때에 한해서 그 마찰된 위치에서 폭발되는 폭발오브젝트와함꼐 생성된다!!
        for(let e=0; e<ExplodeEffectMaterialsMonster.length; e++){
            let e_item=ExplodeEffectMaterialsMonster[e];
            //console.log("e_item(triggerMaterialss)상태:",e_item.fakeuniforms.amplitude);

            if(e_item.fakeuniforms && e_item.fakeuniforms.amplitude.value>=100){
               // console.log("300값 초과했다면??:",e_item);
                this.scene.remove(e_item.mesh);
                e_item.mesh=null;
                ExplodeEffectMaterialsMonster.splice(e,1);
                continue;
            }
            e_item.fakeuniforms.amplitude.value = e_item.fakeuniforms.amplitude.value + (deltaClock*36);//폭발소규모 중형폭발형태(소중대 규모폭발형 다 가능)aroundamount로구현가능 다만 몬스터가 방출하는파티클수는 2개로 제한하며 최대한 적은 리소스소모가 되야함.최대한 빨리 사라지게해야함.이펙트는 랜더링성능이슈
        }
        let lineTriggerMaterialsMonster=this.lineTriggerMaterialsMonster;//폭발범위박스를 말한다.이것도 어잿든 geometry를 계속생성된것큐브가 계속 쌓이기에 속도저하 누적쌓일시발생할수있기에 빨리제거 몬스터발사체가 부딪혀서 박스 생성한 순간에만 캐릭터에게 뎀지가 들어가는것이기에 상관x
        for(let e=0; e<lineTriggerMaterialsMonster.length; e++){
            let e_item=lineTriggerMaterialsMonster[e];
            //console.log("e_item(triggerMaterialss)상태:",e_item.fakeuniforms.amplitude);

            if(e_item.fakeuniforms && e_item.fakeuniforms.amplitude.value>=100){
               // console.log("300값 초과했다면??:",e_item);
                this.scene.remove(e_item.mesh);
                e_item.mesh=null;
                lineTriggerMaterialsMonster.splice(e,1);
                continue;
            }
            e_item.fakeuniforms.amplitude.value = e_item.fakeuniforms.amplitude.value + (deltaClock*36);
        }
        if(this.ammoClone){
           // console.log("캐릭터의 현재 움직임상태??:",this.character_move_status,this._currentAnimationAction&&this._currentAnimationAction._clip.name,this.isjumping);
           //console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%캐릭터 지면 collsiison충돌감지여부:%%%%%%%%%%%%%%%%%%%",groundCollision['value'],groundCollision['groundcontact']);
            const previousAnimationAction=this._currentAnimationAction;
            const chractertransform_previousAnimationAction=this.charactertransform_mixer_currentAnimationAction;
            //const chractertransform_previousAnimationAction2=this.charactertransform_mixer_currentAnimationAction2;
           // const chractertransform_previousAnimationAction3=this.charactertransform_mixer_currentAnimationAction3;

            if(this.character_move_status=='air'){
                //console.log(`아무것도 안누른경우로써 ${previousAnimationAction&&previousAnimationAction._clip.name?previousAnimationAction._clip.name:null}에서 idle으로 변경`);

                if(this.charactertransform_mixer_currentAnimationAction && this.charactertransform_mixer_currentAnimationAction._clip.name==='jumpFly' ){
                    
                    chractertransform_previousAnimationAction.fadeOut(0.5)
                    this.charactertransform_mixer_currentAnimationAction=this.charactertransform_mixer_animationMap ['jumpDown'];//착지
                    this.charactertransform_mixer_currentAnimationAction.reset().fadeIn(0.5).play();
                } 
                else if(this.charactertransform_mixer_currentAnimationAction && this.charactertransform_mixer_currentAnimationAction._clip.name==='walk'){
                    chractertransform_previousAnimationAction.fadeOut(0.5)
                    this.charactertransform_mixer_currentAnimationAction=this.charactertransform_mixer_animationMap ['jumpDown'];//착지
                    this.charactertransform_mixer_currentAnimationAction.reset().fadeIn(0.5).play();
                }
                else if(this.charactertransform_mixer_currentAnimationAction && this.charactertransform_mixer_currentAnimationAction._clip.name==='run'){

                chractertransform_previousAnimationAction.fadeOut(0.5)
                this.charactertransform_mixer_currentAnimationAction=this.charactertransform_mixer_animationMap ['jumpDown'];//착지
                this.charactertransform_mixer_currentAnimationAction.reset().fadeIn(0.5).play();
                }


                 /*if(this.charactertransform_mixer_currentAnimationAction2 && this.charactertransform_mixer_currentAnimationAction2._clip.name==='jumpFly' ){
                    
                    chractertransform_previousAnimationAction2.fadeOut(0.5)
                    this.charactertransform_mixer_currentAnimationAction2=this.charactertransform_mixer_animationMap2 ['jumpDown'];//착지
                    this.charactertransform_mixer_currentAnimationAction2.reset().fadeIn(0.5).play();
                } 
                else if(this.charactertransform_mixer_currentAnimationAction2 && this.charactertransform_mixer_currentAnimationAction2._clip.name==='walk'){
                    chractertransform_previousAnimationAction2.fadeOut(0.5)
                    this.charactertransform_mixer_currentAnimationAction2=this.charactertransform_mixer_animationMap2 ['jumpDown'];//착지
                    this.charactertransform_mixer_currentAnimationAction2.reset().fadeIn(0.5).play();
                 }
                 else if(this.charactertransform_mixer_currentAnimationAction2 && this.charactertransform_mixer_currentAnimationAction2._clip.name==='run'){

                    chractertransform_previousAnimationAction2.fadeOut(0.5)
                    this.charactertransform_mixer_currentAnimationAction2=this.charactertransform_mixer_animationMap2 ['jumpDown'];//착지
                    this.charactertransform_mixer_currentAnimationAction2.reset().fadeIn(0.5).play();
                 }



                 if(this.charactertransform_mixer_currentAnimationAction3 && this.charactertransform_mixer_currentAnimationAction3._clip.name==='jumpFly' ){
                    
                    chractertransform_previousAnimationAction3.fadeOut(0.5)
                    this.charactertransform_mixer_currentAnimationAction3=this.charactertransform_mixer_animationMap3 ['jumpDown'];//착지
                    this.charactertransform_mixer_currentAnimationAction3.reset().fadeIn(0.5).play();
                } 
                else if(this.charactertransform_mixer_currentAnimationAction3 && this.charactertransform_mixer_currentAnimationAction3._clip.name==='walk'){
                    chractertransform_previousAnimationAction3.fadeOut(0.5)
                    this.charactertransform_mixer_currentAnimationAction3=this.charactertransform_mixer_animationMap3 ['jumpDown'];//착지
                    this.charactertransform_mixer_currentAnimationAction3.reset().fadeIn(0.5).play();
                 }
                 else if(this.charactertransform_mixer_currentAnimationAction3 && this.charactertransform_mixer_currentAnimationAction3._clip.name==='run'){

                    chractertransform_previousAnimationAction3.fadeOut(0.5)
                    this.charactertransform_mixer_currentAnimationAction3=this.charactertransform_mixer_animationMap3 ['jumpDown'];//착지
                    this.charactertransform_mixer_currentAnimationAction3.reset().fadeIn(0.5).play();
                 }*/


                if(this._currentAnimationAction && this._currentAnimationAction._clip.name==='jumpFly' ){
                    previousAnimationAction.fadeOut(0.5);
                    this._currentAnimationAction=this._animationMap ['jumpDown'];//착지
                    this._currentAnimationAction.reset().fadeIn(0.5).play();

                }else if(this._currentAnimationAction && this._currentAnimationAction._clip.name==='walk'){
                    previousAnimationAction.fadeOut(0.5);
                    this._currentAnimationAction=this._animationMap['jumpDown'];//착지
                    this._currentAnimationAction.reset().fadeIn(0.5).play();

                }else if(this._currentAnimationAction && this._currentAnimationAction._clip.name==='run'){
                    previousAnimationAction.fadeOut(0.5);
                    this._currentAnimationAction=this._animationMap['jumpDown'];//착지
                    this._currentAnimationAction.reset().fadeIn(0.5).play();
                }

                /*let myfriends=this.friendsAnimData;
                if(myfriends){
                    for(let f=0; f<myfriends.length; f++){
                        let item=myfriends[f];
                        let previous_AnimAction=item.currentAnimAction;
    
                        //previous_AnimAction.fadeOut(0.5);
                        //let now_AnimAction=item.animMap['jumpFly'];
                        //now_AnimAction.reset().fadeIn(0.5).play();
    
                        if(previous_AnimAction && previous_AnimAction._clip.name==='jumpFly'){
                            previous_AnimAction.fadeOut(0.5);
                            let now_AnimAction=item.animMap['jumpDown'];
                            now_AnimAction.reset().fadeIn(0.5).play();
                        }else if(previous_AnimAction && previous_AnimAction._clip.name==='walk'){
                            previous_AnimAction.fadeOut(0.5);
                            let now_AnimAction=item.animMap['jumpDown'];
                            now_AnimAction.reset().fadeIn(0.5).play();
                        }else if(previous_AnimAction && previous_AnimAction._clip.name==='run'){
                            previous_AnimAction.fadeOut(0.5);
                            let now_AnimAction=item.animMap['jumpDown'];
                            now_AnimAction.reset().fadeIn(0.5).play();
                        }
                    }
                }*/
               
            }
            let characterspeed=1;
            if(this.character1){
                characterspeed = this.character1.userData&&this.character1.userData.speed?this.character1.userData.speed:1;
            }
            if(this._pressedKeys['w'] || this._pressedKeys['a'] || this._pressedKeys['s'] || this._pressedKeys['d']){
                if(this._pressedKeys['shift']){
                    //  console.log("speed return 16@@@@@");
                    this.charactermovement(this.ammoClone,10*characterspeed,this.character_move_status);
                    //this._lastestspeed=10;
                }else{
                    // console.log("speed return 4@@@@@");
                    this.charactermovement(this.ammoClone,3*characterspeed,this.character_move_status)
                   // this._lastestspeed=3;
                }
            }else{
                // console.log("speed return 0");d
                this.charactermovement(this.ammoClone,0,this.character_move_status)
               // this._lastestspeed=0;
            }

            this.RepeatEnemysAction();
            //this.RepeatEnemysActionFar();
            this.RepeatEnemysActionHumans();
            this.RepeatAnotherCharacterAction();

            this.checkContact();
        }

        this._previousTime=time;
        this._pressedKeys['q']=false;
        //this._pressedKeys['f']=false;


    }
    _previousDirectionOffsetval=0;
    directionOffset(){
        //console.log("directionOffset!!!!!:",this._previousDirectionOffsetval);
        let directionOffset=0;

        if(this._pressedKeys['w']){//w->
            if(this._pressedKeys['a']){
                //wa
              //  console.log("wa누른경우로 directionOffset Math.PI/4 45도");
                directionOffset=Math.PI /4
            }else if(this._pressedKeys['d']){
                //wd
                //console.log("wd누른경우로 directionOffset -Math.pi/4 -45도");
                directionOffset=-Math.PI / 4;
            }
        }else if(this._pressedKeys['s']){//s->
            if(this._pressedKeys['a']){
                //sa
                //console.log("sa누른경우로 directionOffset Math,pi/4+math.pi 135도")
                directionOffset=Math.PI/4 + Math.PI/2;
            }else if(this._pressedKeys['d']){
                //sd
               // console.log("sd누른경우로 directionOffset -math.pi/4-mathi.pi/2 -135도");
                directionOffset=-Math.PI/4 - Math.PI/2
            }else{
                //s만누른경우
                //console.log("s만누른경우로 directionOffset 180도")
                directionOffset=Math.PI;
            }
        }else if(this._pressedKeys['a']){//a only
           // console.log("a만누른경우로 directionOffset  90도")
            directionOffset=Math.PI/2
        }else if(this._pressedKeys['d']){
           // console.log("d만누른경우로 directionOffset  -90도")
            directionOffset=-Math.PI/2;
        }else{
           // console.log("아무것도 안누른상태라면::",this._previousDirectionOffsetval);
            directionOffset = this._previousDirectionOffsetval;
        }
        this._previousDirectionOffsetval=directionOffset;
        //console.log("최종directionOffsetss:",directionOffset);
        return directionOffset;
    }
    charactermovement(Ammo=this.ammoClone,movespeed,character_move_status){
        
        //rigid공간 점프관련
        //console.log("cahractermovement Ammo?? deltaTime???:",Ammo,deltaTime);
        //캐릭터,카메라 등 직접 이동조작 부분
        if(this.controls){
            this.controls.update();
        }
        let angleCameraDirectionAxisY=0;
        if(this.camera && this.character1){
            angleCameraDirectionAxisY=Math.atan2(this.camera.position.x - this.character1.position.x,this.camera.position.z - this.character1.position.z);
            //console.log("순수카메라 angleCamera aixsY값:",angleCameraDirectionAxisY);//기본적으로 카메라를 바라보고있게된다.
            angleCameraDirectionAxisY =angleCameraDirectionAxisY+Math.PI;
           // console.log("적용anglecamear aixsY값:",angleCameraDirectionAxisY);//카메라를 항상 등지게 되어있게된다.
           
            const rotateQuaternion=new THREE.Quaternion();//캐릭터는 물리효과에 의해 위치만 변환처리되고 각도회전은 영향받지않도록 되어있기에 항상w0001 기본값상태이며 여기서 카메라위치조작에 따른 회전만가해질뿐이다.


            let directionOffset=this.directionOffset();
            rotateQuaternion.setFromAxisAngle(
                new THREE.Vector3(0,1,0),angleCameraDirectionAxisY+ directionOffset
            );//항상 등지고있는상태+alpha radian degree각도값으로 처리된다.
           // console.log("rotateQuatieriionsss:",rotateQuaternion);
            this.character1.quaternion.rotateTowards(rotateQuaternion,THREE.MathUtils.degToRad(5));//모델의 방향전체적쿼터니언방향 5도단계적으로 애니메이팅시킴처리한다.
         
            if(this.charactertransform){
                this.charactertransform.quaternion.rotateTowards(rotateQuaternion,THREE.MathUtils.degToRad(5));//모델의 방향전체적쿼터니언방향 5도단계적으로 애니메이팅시킴처리한다.
            }
            let myfriends=this.friendsAnimData;
            for(let f=0; f<myfriends.length; f++){
                let item=myfriends[f];
                let object=item.characterobject;
                if(object){
                    object.quaternion.rotateTowards(rotateQuaternion,THREE.MathUtils.degToRad(5))
                }
            }
            /*if(this.charactertransform2){
                this.charactertransform2.quaternion.rotateTowards(rotateQuaternion,THREE.MathUtils.degToRad(5));//모델의 방향전체적쿼터니언방향 5도단계적으로 애니메이팅시킴처리한다.
            }
            if(this.charactertransform3){
                this.charactertransform3.quaternion.rotateTowards(rotateQuaternion,THREE.MathUtils.degToRad(5));//모델의 방향전체적쿼터니언방향 5도단계적으로 애니메이팅시킴처리한다.
            }*/
            const walkDirection=new THREE.Vector3();
            this.camera.getWorldDirection(walkDirection);//카메라가 바라보는 방향벡터를 담음

            walkDirection.y=0;
            walkDirection.normalize();
            walkDirection.applyAxisAngle(new THREE.Vector3(0,1,0),directionOffset);
            //console.log("walkingDirection:",walkDirection);
            this.walkDirection=walkDirection;

            if(this.weapon){
                if(!(this._pressedKeys['t'])){
                   this.weapon.quaternion.rotateTowards(rotateQuaternion,THREE.MathUtils.degToRad(5));//무기의 방향전체적쿼터니언방향 5도단계적으로 애니메이팅시킴처리한다.
               }
            }
            const cameraDirection=new THREE.Vector3();
            this.camera.getWorldDirection(cameraDirection);
            this.cameraDirection=cameraDirection;
            //console.log("cameraDirection:",cameraDirection);

            //console.log("현재 스피드 thisSpeed:",movespeed);
            let jump_speed=0;
            
            let velocity_x=0;
            let velocity_z=0;
            let velocity_y=0;

            if(this._pressedKeys['w'] || this._pressedKeys['a'] || this._pressedKeys['s'] || this._pressedKeys['d']){
                velocity_x=walkDirection.x *  movespeed;
                velocity_z=walkDirection.z *  movespeed;
                if(this._pressedKeys[32] && !this.isjumping){
                    console.log("이동키와 점프키 같이 동시에 누른경우??:((기본 속도:이동방향*이동속도) 대신점프파워는 단순점프보단 약하게한다",velocity_x,velocity_z);
                    let model_character=this.character1;

                    let rbody=model_character.userData.physicsBody;
                    let speed=model_character.userData.speed?model_character.userData.speed:1;

                    jump_speed=1*speed;
                    velocity_y = jump_speed*19;
                    velocity_x = velocity_x * jump_speed*3;
                    velocity_z = velocity_z *  jump_speed*3;
                    console.log("적용 velocityxyz:(이동,점프동시에누른경우,수평이동속도에 점프속도를 곱하여 가속시킴)",velocity_x,velocity_y,velocity_z);
                    rbody.setLinearVelocity(new Ammo.btVector3(velocity_x,velocity_y,velocity_z));

                    const previousAnimationAction=this._currentAnimationAction;
                    previousAnimationAction.fadeOut(0.5);
                    this._currentAnimationAction=this._animationMap['jumpFly'];
                    this._currentAnimationAction.reset().fadeIn(0.5).play();

                    const charactertransform_previousAnimationAction=this.charactertransform_mixer_currentAnimationAction;
                    charactertransform_previousAnimationAction.fadeOut(0.5);
                    this.charactertransform_mixer_currentAnimationAction=this.charactertransform_mixer_animationMap['jumpFly'];
                    this.charactertransform_mixer_currentAnimationAction.reset().fadeIn(0.5).play();

                    for(let f=0; f<myfriends.length; f++){
                        let item=myfriends[f];
                        let previous_AnimAction=item.currentAnimAction;

                        previous_AnimAction.fadeOut(0.5);
                        let now_AnimAction=item.animMap['jumpDown'];
                        now_AnimAction.reset().fadeIn(0.5).play();
                        item.currentAnimAction=now_AnimAction;
                    }
                    /*const charactertransform_previousAnimationAction2=this.charactertransform_mixer_currentAnimationAction2;
                    charactertransform_previousAnimationAction2.fadeOut(0.5);
                    this.charactertransform_mixer_currentAnimationAction2=this.charactertransform_mixer_animationMap2['jumpFly'];
                    this.charactertransform_mixer_currentAnimationAction2.reset().fadeIn(0.5).play();

                    const charactertransform_previousAnimationAction3=this.charactertransform_mixer_currentAnimationAction3;
                    charactertransform_previousAnimationAction3.fadeOut(0.5);
                    this.charactertransform_mixer_currentAnimationAction3=this.charactertransform_mixer_animationMap3['jumpFly'];
                    this.charactertransform_mixer_currentAnimationAction3.reset().fadeIn(0.5).play();*/

                    groundCollision['value']=false;
                    groundCollision['groundcontact']=false;

                    this.isjumping=true;
                    this.isdanceTime=false;

                }else if(!this._pressedKeys[32]){
                    console.log("이동키만 누른경우?:", velocity_x,velocity_z)
                    
                    let model_character=this.character1;

                    let rbody=model_character.userData.physicsBody;

                    console.log("적용 velocityxyz:(이동만누른경우,이동방향*속도 곱만 이뤄진 형태로 연산)",velocity_x,velocity_y,velocity_z);
                    rbody.setLinearVelocity(new Ammo.btVector3(velocity_x,0,velocity_z));
                    this.isdanceTime=false;

                }
            }else{
                if(this._pressedKeys[32] && !this.isjumping){
                    console.log("점프키만 누른경우!!!",velocity_x,velocity_z);
                    let model_character=this.character1;

                    let rbody=model_character.userData.physicsBody;
                    let speed=model_character.userData.speed?model_character.userData.speed:1;

                    jump_speed=1*speed;
                    velocity_y = jump_speed*28;//characterSpeed적용*
                    console.log("적용 velocityxyz:(점프만누른경우",velocity_x,velocity_y,velocity_z);

                    rbody.setLinearVelocity(new Ammo.btVector3(0,velocity_y,0));

                    const previousAnimationAction=this._currentAnimationAction;
                    previousAnimationAction.fadeOut(0.5);
                    this._currentAnimationAction=this._animationMap['jumpFly'];
                    this._currentAnimationAction.reset().fadeIn(0.5).play();

                    const charactertransform_previousAnimationAction=this.charactertransform_mixer_currentAnimationAction;
                    charactertransform_previousAnimationAction.fadeOut(0.5);
                    this.charactertransform_mixer_currentAnimationAction=this.charactertransform_mixer_animationMap['jumpFly'];
                    this.charactertransform_mixer_currentAnimationAction.reset().fadeIn(0.5).play();

                    /*const charactertransform_previousAnimationAction2=this.charactertransform_mixer_currentAnimationAction2;
                    charactertransform_previousAnimationAction2.fadeOut(0.5);
                    this.charactertransform_mixer_currentAnimationAction2=this.charactertransform_mixer_animationMap2['jumpFly'];
                    this.charactertransform_mixer_currentAnimationAction2.reset().fadeIn(0.5).play();

                    const charactertransform_previousAnimationAction3=this.charactertransform_mixer_currentAnimationAction3;
                    charactertransform_previousAnimationAction3.fadeOut(0.5);
                    this.charactertransform_mixer_currentAnimationAction3=this.charactertransform_mixer_animationMap3['jumpFly'];
                    this.charactertransform_mixer_currentAnimationAction3.reset().fadeIn(0.5).play();*/

                    for(let f=0; f<myfriends.length; f++){
                        let item=myfriends[f];
                        let previous_AnimAction=item.currentAnimAction;

                        previous_AnimAction.fadeOut(0.5);
                        let now_AnimAction=item.animMap['jumpDown'];
                        now_AnimAction.reset().fadeIn(0.5).play();
                        item.currentAnimAction=now_AnimAction;
                    }

                    groundCollision['value']=false;
                    groundCollision['groundcontact']=false;

                    this.isjumping=true;
                    this.isdanceTime=false;

                } else{
                   // console.log("아무것도 안누르고있는경우!!",velocity_x,velocity_y,velocity_z)
                }
            }
           
            //console.log("카메라현재위치:",this.camera.position.x,this.camera.position.y,this.camera.position.z);
            //console.log("캐릭터현재위치:",this.character1.position.x,this.character1.position.y,this.character1.position.z);
        }
    }
    render(time){
       // console.log("render timess:",time);
        this.renderer.render(this.scene,this.camera);

        if(this.threejsScene_animated){
            this.update(time);
            requestAnimationFrame(this.render.bind(this));
        }else{
            if(this.character1){
                if(this.character1.userData.hp <= 0){
                    //console.log("캐릭터 hp상태?:",this.character1.userData.hp)
                    if(this.character1.userData.status=='unlive' || this.character1.userData.hp<=0){
                        if(window.confirm("캐릭터가 죽었습니다")){
                            window.setTimeout(function(){
                                 location.reload();
                             },2000);
                         }
                    }
                }else if(this.character1.userData.hp >0){
                    //====맵별로 다르게 할 부분 이곳도!!!!20230408 포탈이동시에
                    if(this.NextEntrance){
                        window.setTimeout(()=>{
                            //form.submit이동 데이터post형태의 이동(안전하게secure) 타깃맵으로이동
                            console.log("타깃맵으로 안전하게 이동!:");
                            // http://localhost:5501/study/AmmoRigidBaseMetaWorld.html?pos={x:714,y:3645,z:-3.2}
                            //location.href='AmmoRigidBaseMetaWorldOpenWorldNight.html?pos={x:-333,y:7,z:2220}';
                           // let mapMoveForm=document.getElementById("mapMoveForm");
                            //console.log("이동타깃맵과 보낼 인자pos값 기존캐릭터관련 모든 파라메터들!:","AmmoRigidBaseMetaWorldOpenWorldNight.php",{x:-333,y:7,z:2220},mapMoveForm.children);
                            let moveForm_parameters=this.datastore_object;
                            for(let s in moveForm_parameters){
                                let parameter=s;
                                if(s==='loadposx'){
                                   // var key=CryptoJS.enc.Utf8.parse('-333');//원본밸류의 key값만듬.
                                    //console.log("각문자열에 대한 경우의수별 랜덤한 key값!:",key);
                                    //var base64=CryptoJS.enc.Base64.stringify(key);

                                    moveForm_parameters['loadposx']='-262';
                                }else if(s==='loadposy'){
                                    moveForm_parameters['loadposy']='22';
                                    //var key=CryptoJS.enc.Utf8.parse('7');//원본밸류의 key값만듬.
                                    //console.log("각문자열에 대한 경우의수별 랜덤한 key값!:",key);
                                    //var base64=CryptoJS.enc.Base64.stringify(key);
                                    //parameter.value=base64;

                                }else if(s==='loadposz'){
                                    moveForm_parameters['loadposz']='926';
                                      //var key=CryptoJS.enc.Utf8.parse('2220');//원본밸류의 key값만듬.
                                      //console.log("각문자열에 대한 경우의수별 랜덤한 key값!:",key);
                                      //var base64=CryptoJS.enc.Base64.stringify(key);
                                      //parameter.value=base64;
                                }else if(s!='gamebg'){
                                    console.log("paraemtername:",parameter.name,this.datastore_object);
                                    if(moveForm_parameters[s]){
                                        let originvalue=moveForm_parameters[s];
                                        console.log("각 원본값:",originvalue);
                                        if(typeof(originvalue)==='object'){
                                            originvalue=JSON.stringify(originvalue);
                                        }
                                        console.log("적용원본값:",originvalue);
                                        //var key=CryptoJS.enc.Utf8.parse(originvalue);//원본밸류의 key값만듬.
                                        //var base64=CryptoJS.enc.Base64.stringify(key); 
                                        moveForm_parameters[s]=originvalue;
                                    }
                                    
                                }
                            }
                            //mapMoveForm.action='AmmoRigidBaseMetaWorldOpenWorldNight.php';
                            console.log("조정된 mapMoveFOrm:",moveForm_parameters);
                            //mapMoveForm.submit();
                            localStorage.setItem("characterdatabase",JSON.stringify(moveForm_parameters));
                            location.href='AmmoRigidBaseMetaWorldevilControlTower.html';
                        },200);
                    }
                    else if(this.StartEntrance){
                        window.setTimeout(()=>{
                            //form.submit이동 데이터post형태의 이동(안전하게secure) 타깃맵으로이동
                            console.log("타깃맵으로 안전하게 이동!:");
                            
                            let moveForm_parameters=this.datastore_object;
                            for(let s in moveForm_parameters){
                                let parameter=s;
                                if(s==='loadposx'){
                                   // var key=CryptoJS.enc.Utf8.parse('-333');//원본밸류의 key값만듬.
                                    //console.log("각문자열에 대한 경우의수별 랜덤한 key값!:",key);
                                    //var base64=CryptoJS.enc.Base64.stringify(key);

                                    moveForm_parameters['loadposx']='394';
                                }else if(s==='loadposy'){
                                    moveForm_parameters['loadposy']='20';
                                    //var key=CryptoJS.enc.Utf8.parse('7');//원본밸류의 key값만듬.
                                    //console.log("각문자열에 대한 경우의수별 랜덤한 key값!:",key);
                                    //var base64=CryptoJS.enc.Base64.stringify(key);
                                    //parameter.value=base64;

                                }else if(s==='loadposz'){
                                    moveForm_parameters['loadposz']='593';
                                      //var key=CryptoJS.enc.Utf8.parse('2220');//원본밸류의 key값만듬.
                                      //console.log("각문자열에 대한 경우의수별 랜덤한 key값!:",key);
                                      //var base64=CryptoJS.enc.Base64.stringify(key);
                                      //parameter.value=base64;
                                }else if(s!='gamebg'){
                                    console.log("paraemtername:",parameter.name,this.datastore_object);
                                    if(moveForm_parameters[s]){
                                        let originvalue=moveForm_parameters[s];
                                        console.log("각 원본값:",originvalue);
                                        if(typeof(originvalue)==='object'){
                                            originvalue=JSON.stringify(originvalue);
                                        }
                                        console.log("적용원본값:",originvalue);
                                        //var key=CryptoJS.enc.Utf8.parse(originvalue);//원본밸류의 key값만듬.
                                        //var base64=CryptoJS.enc.Base64.stringify(key); 
                                        moveForm_parameters[s]=originvalue;
                                    }
                                    
                                }
                            }
                            //mapMoveForm.action='AmmoRigidBaseMetaWorldOpenWorldNight.php';
                            console.log("조정된 mapMoveFOrm:",moveForm_parameters);
                            //mapMoveForm.submit();
                            localStorage.setItem("characterdatabase",JSON.stringify(moveForm_parameters));
                            location.href='AmmoRigidBaseMetaWorldevilcity.html';
                        },200);
                    } 
                    //맵별로 다르게 할부분 endsss`
                }
            }
        }
    }
    updatePhysics(delta){
       // console.log("updatePhyioscss deltaTime:",delta);
        if(delta!==0){
            if(this.physicsWorld){
                this.physicsWorld.stepSimulation(delta,10);
            }
        } 
        //DATA CHECK!
        //console.log("=========================@@@###rigidBodies현재 상태???@@@@@@@@@####+====================",rigidBodies);
       // let rigidBody_htmlList=[];
        for(let i=0; i<rigidBodies.length; i++){
            if(rigidBodies[i]){
                let threeObject=rigidBodies[i];
                let ammoObject=threeObject.userData.physicsBody;
                let ms;
            
                //rigidBody_htmlList[i]=JSON.stringify(threeObject.userData);

                //console.log("amoObjectss:",ammoObject);
                ms=ammoObject.getMotionState();
                
                //console.log("각 threeObject와 관련된 phyisBOdy ms state정보데이타:",threeObject,threeObject&&threeObject.userData,ammoObject,ms);
                if(ms){
                    ms.getWorldTransform(this.tempTransform)
                    let pos=this.tempTransform.getOrigin();
                    let quat=this.tempTransform.getRotation();
                
                    if(threeObject===this.character1){
                        //charactermoving processs
                    
                        let previousCharacterpos=threeObject.position.clone();
                        // console.log("카메라 기존 위치대비 이동량:(캐릭터가 이동한량만큼 항상이동)",pos.x() - previousCharacterpos.x, pos.y()-previousCharacterpos.y, pos.z()- previousCharacterpos.z);
                        // console.log("groundCollisison관련상태값:groundCollision['groundcontact'],groundCollision['value']",groundCollision['groundcontact'],groundCollision['value'])
                        threeObject.position.set(pos.x(),pos.y(),pos.z());//캐릭터는 중력에 의한 위치만 영향받게.
                        //threeObject.quaternion.set(quat.x(),quat.y(),quat.z(),quat.w());

                        let charactermove_x=pos.x() - previousCharacterpos.x;
                        let charactermove_y=pos.y() - previousCharacterpos.y;
                        let charactermove_z=pos.z() - previousCharacterpos.z;
                        
                        /*if(charactermove_y >= 0.002){
                        console.log("캐릭터가 위로 상승중!@@@@@@ 점프직후,점프이후높이상승중");
                        if(groundCollision['groundcontact']){
                            this.character_move_status='groundascend';
                        }else{
                            this.character_move_status='airascend';
                        }
                        groundCollision['groundcontact']=false;
                        
                        }if(charactermove_y <= -0.005 ){
                            console.log("캐릭터가 밑으로 하강중!@@@@@@ 점s프최고점이후 높이하강중");
                            if(groundCollision['groundcontact']){
                                this.character_move_status='grounddowntoward';
                            }else{
                                this.character_move_status='airdowntoward';
                            }
                            groundCollision['groundcontact']=false;
                            
                        }*/
                        if(!groundCollision['value']){
                        //  console.log("캐릭터가 바닥에 닿아있지 않은상태로 간주됨!")
                            this.character_move_status='air'
                        }
                        else{
                        // console.log("캐릭터의 바닥에 뭔가에 밟고있는 상태로 간주 걷기,평지달리기");
                            this.character_move_status='normal';//평지달리기,평지걷기
                        }
                        if(this.camera){
                            this.camera.position.x += charactermove_x;
                            this.camera.position.y += charactermove_y;
                            this.camera.position.z += charactermove_z;

                            this.controls.target.set(
                                threeObject.position.x,
                                threeObject.position.y,
                                threeObject.position.z
                            );
                        }
                    }else if(threeObject.userData.tag=='enemy_passivebodyGLTF' || threeObject.userData.tag=='anothercharacter' ||  threeObject.userData.tag=='anothercharacterStatic'){
                        threeObject.position.set(pos.x(),pos.y(),pos.z());//gltf몬스터모델 등은 중력에 의한 위치만 영향받게.
                        //console.log("하하 계산된 updatephYISCS THREEOBJECT대상체의 매번 위치,회전값: monster",threeObject,pos.x(),pos.y(),pos.z());

                        //threeObject.quaternion.set(0,0,quat.y(),quat.w());
                        let origin_monster_direction=new THREE.Vector3();
                        threeObject.getWorldDirection(origin_monster_direction)
                        //console.log("각 몬스터가 바라보고있는 현재방향:",origin_monster_direction)
                        let angleMonsterDirectionAxisY =0;
                        if(this.character1){
                            angleMonsterDirectionAxisY = Math.atan2(threeObject.position.x - this.character1.position.x, threeObject.position.z - this.character1.position.z);
                        // console.log("순수 몬스터위치에서의  DISTNACE캐릭터 각도angle값:",angleMonsterDirectionAxisY);
                            angleMonsterDirectionAxisY=angleMonsterDirectionAxisY+Math.PI
                            const rotateQuaternion=new THREE.Quaternion();
                            rotateQuaternion.setFromAxisAngle(
                                new THREE.Vector3(0,1,0),angleMonsterDirectionAxisY
                            );
                            //console.log("monstoer적용 rotateQUATERIONS:",rotateQuaternion);
                            threeObject.quaternion.rotateTowards(rotateQuaternion,THREE.MathUtils.degToRad(5))

                            if(threeObject.userData.type==='farType'){
                                let ballChild=threeObject.userData&&threeObject.userData.ballChild;
                                if(ballChild){
                                    ballChild.quaternion.rotateTowards(rotateQuaternion,THREE.MathUtils.degToRad(5))

                                }
                            }
                        }

                    }else if(threeObject.userData.tag=='characterweapon'){
                        threeObject.position.set(pos.x(),pos.y(),pos.z());//gltf위치는 영향받게 해야한다.
                    
                        if(this.character1){
                            let weaponPhysicsBody=threeObject.userData.physicsBody;
                        
                            let dir_x=0;
                            let dir_z=0;

                            if(this.walkDirection){
                                dir_x=this.walkDirection.x;
                                dir_z=this.walkDirection.z;
                            }
                        
                            let distance_x=(this.character1.position.x +(-dir_x*5))- threeObject.position.x;//origin+0~0.5 or -0~0.5
                            let distance_z=(this.character1.position.z +(-dir_z*5))- threeObject.position.z;//origni+0~0.5 or -0~0.5
                            let distance_y=(this.character1.position.y + 0 )- threeObject.position.y;//origin+0~0.5 or -0~0.5
        
                            //console.log("캐릭터 걷기바라보는방향xz:",dir_x*1,dir_z*1);
                            let resultantimpulse=new Ammo.btVector3(distance_x,distance_y,distance_z);
                            resultantimpulse.op_mul(1);
                            // console.log("가해질힘 weaponSet linaewrvelocitysss",resultantimpulse);
                            weaponPhysicsBody.setLinearVelocity(resultantimpulse);
                            
                            if(this._pressedKeys['t']){
                                distance_x=(this.character1.position.x +(dir_x*5))- threeObject.position.x;//origin+0~0.5 or -0~0.5
                                distance_z=(this.character1.position.z +(dir_z*5))- threeObject.position.z;//origni+0~0.5 or -0~0.5

                                distance_y=(this.character1.position.y +0.8 )- threeObject.position.y;//origin+0~0.5 or -0~0.5
                                resultantimpulse=new Ammo.btVector3(distance_x,distance_y,distance_z);
                                resultantimpulse.op_mul(3);
                                weaponPhysicsBody.setLinearVelocity(resultantimpulse);

                                let adapt_y;
                                let adapt_y_temp;
                            
                                adapt_y=this.y>=0&&this.y<=180?this.y:0;//0->180

                                //console.log("adapt xyz:",0,adapt_y,0);
                                threeObject.rotation.y=adapt_y;
                                // threeObject.rotation.x=adapt_x;
                                //threeObject.rotation.z=adapt_z;
        
                                //let adapt_w_temp=adapt_w - 0.05;//1,0.8,0.6,0.4,0.2,0,1,0.8,0.6,0.4,0.2,0,...
                                adapt_y_temp=adapt_y + 4.5//0.045,0.45,d4.5,45,90,.. 
                                //0.45**,45***,0.2,0.3
                                this.y=adapt_y_temp;
                            }
                        }
                    }
                    else if(threeObject.userData.tag==='friends'){
                        threeObject.position.set(pos.x(),pos.y(),pos.z());

                        if(this.character1){    
                           // console.log("왜그러나??:",this.character_withfriends)
                            if(this.character_withfriends){
                                let friendsPhysicsBody=threeObject.userData.physicsBody;
                                let friends_index=threeObject.userData.characterindex;
                                //console.log("friends캐릭터의 index고유값:",friends_index);

                                if(friends_index || !isNaN(friends_index)){
                                    let dir_x=0;
                                    let dir_z=0;
            
                                    if(this.walkDirection){
                                        //console.log("this.walkDirection.x:",this.walkDirection.x,this.walkDirection.z);
            
                                        dir_x=this.walkDirection.x;
                                        dir_z=this.walkDirection.z;
                                    }
                                // console.log("적용각도 x distance 곱 cos,sin degree값:",45*friends_index)
                                    let distance_x=(this.character1.position.x +(dir_x*4*Math.cos(45*friends_index)))- threeObject.position.x;//origin+0~0.5 or -0~0.5
                                    let distance_z=(this.character1.position.z +(dir_z*4*Math.sin(45*friends_index)))- threeObject.position.z;//origni+0~0.5 or -0~0.5
                                    let distance_y=(this.character1.position.y)- threeObject.position.y;//origin+0~0.5 or -0~0.5
                    
                                    let resultantimpulse=new Ammo.btVector3(distance_x,distance_y,distance_z);
                                    resultantimpulse.op_mul(1.1);
                                    //console.log("가해질힘 friends 캐릭터 주위로 가해질힘 linaewrvelocitysss",resultantimpulse);
                                    friendsPhysicsBody.setLinearVelocity(resultantimpulse);
                                }
                            }else{
                                let friendsPhysicsBody=threeObject.userData.physicsBody;

                                friendsPhysicsBody.setLinearVelocity(new Ammo.btVector3(0,0,0));
                                threeObject.position.set(150,30,30);
                            }
                        
                        }
                    }
                    else if(threeObject.userData.tag=='charactertransform' ){
                        threeObject.position.set(pos.x(),pos.y(),pos.z());//gltf위치는 영향받게 해야한다.

                        if(this.character1){                          
                            let charactertransformPhysicsBody=threeObject.userData.physicsBody;

                            if(this.character_isOverpower){
                                let dir_x=0;
                                let dir_z=0;
        
                                if(this.walkDirection){
                                    //console.log("this.walkDirection.x:",this.walkDirection.x,this.walkDirection.z);
        
                                    dir_x=this.walkDirection.x;
                                    dir_z=this.walkDirection.z;
                                }
        
                                let distance_x=(this.character1.position.x +(dir_x*8*Math.cos(0)))- threeObject.position.x;//origin+0~0.5 or -0~0.5
                                let distance_z=(this.character1.position.z +(dir_z*8*Math.sin(0)))- threeObject.position.z;//origni+0~0.5 or -0~0.5
                                let distance_y=(this.character1.position.y+2)- threeObject.position.y;//origin+0~0.5 or -0~0.5
                
                                let resultantimpulse=new Ammo.btVector3(distance_x,distance_y,distance_z);
                                resultantimpulse.op_mul(1);
                                // console.log("가해질힘 weaponSet linaewrvelocitysss",resultantimpulse);
                                charactertransformPhysicsBody.setLinearVelocity(resultantimpulse);
                                
                            }else{
                                charactertransformPhysicsBody.setLinearVelocity(new Ammo.btVector3(0,0,0));
                                threeObject.position.set(150,30,30);
                            }
                        
                        }
                    }
                    else if(threeObject.userData.tag=='monsterball'){
                        threeObject.position.set(pos.x(),pos.y(),pos.z());
                    }
                    else if(threeObject.userData.tag=='characterballcamera'){
                        threeObject.position.set(pos.x(),pos.y(),pos.z());
                    }
                    else{
                        //console.log("하하 계산된 updatephYISCS THREEOBJECT대상체의 매번 위치,회전값: 기타등등",threeObject.name,pos.x(),pos.y(),pos.z());
                        threeObject.position.set(pos.x(),pos.y(),pos.z());
                        threeObject.quaternion.set(quat.x(),quat.y(),quat.z(),quat.w());
                    }
                }
            }
        }
        
    }
    setupContactResultCallback(Ammo=this.ammoClone){
        this.cbContactResult=new Ammo.ConcreteContactResultCallback();
        this.cbContactResult.addSingleResult=(cp,colObj0Wrap,partId0,index0, colObj1Wrap,partId1,index1)=>{
           // console.log("============================================================================Collsiision distinct@@@@@=============================================startss")
           //console.log("cbContactReulstss========>>whatsss::",cp,colObj0Wrap,partId0,index0, colObj1Wrap,partId1,index1);
            let contactPoint=Ammo.wrapPointer(cp,Ammo.btManifoldPoint);
           // console.log("cbContactReultssss=================>contactPintss??:",contactPoint,Ammo.btManifoldPoint);

            const distance=contactPoint.getDistance();
            //console.log("cbContractReultswsstts====>>contactPpointss?:",distance);

            if(distance > 0) {
                return;
            }

            let colWrapper0 = Ammo.wrapPointer(colObj0Wrap,Ammo.btCollisionObjectWrapper);
            let rb0=Ammo.castObject(colWrapper0.getCollisionObject(),Ammo.btRigidBody);

            let colWrapper1 = Ammo.wrapPointer(colObj1Wrap,Ammo.btCollisionObjectWrapper);
            let rb1 = Ammo.castObject( colWrapper1.getCollisionObject(), Ammo.btRigidBody );
            let threeObject0 = rb0.threeObject;
            let threeObject1 = rb1.threeObject;

           // console.log("colwarpper0,rb0:",colWrapper0,rb0,threeObject0.userData.tag);
            //console.log("caolWrapper1,rb1:",colWrapper1,rb1,threeObject1.userData.tag);
            let tag, localPos, worldPos

            if( threeObject0.userData.tag == "character" &&  (threeObject1.userData.tag!='character' && threeObject1.userData.tag!='charactertransform'&&threeObject1.userData.tag!='charactertransform2'&&threeObject1.userData.tag!='charactertransform3'&&threeObject1.userData.tag!='characterweapon'&&threeObject1.userData.tag!='enemy_passivebodyGLTF'&&threeObject1.userData.tag!='monsterball')){
                //캐릭터가 지형지물 밟고있는지 어떠한 임의의 대상과 접촉이 일어나고있다면 공중위는 아닐가능성 크다.뭔가와 밟고있다면 지면충돌 밟고있는지여부체크 주검사자 캐릭터(유일),반응자:캐릭터제외모두(캐릭터소유물,몬스터관련된것들제외모든 지형지물 대상체들)
                if(threeObject1.userData){
                    tag = threeObject1.userData && threeObject1.userData.tag;
                    localPos = contactPoint.get_m_localPointA();
                    worldPos = contactPoint.get_m_positionWorldOnA();
                    //console.log("threeojbect0,1",threeObject0.userData.tag,threeObject1.userData.tag);
                    let localPosDisplay = {x: localPos.x(), y: localPos.y(), z: localPos.z()};
                    let worldPosDisplay = {x: worldPos.x(), y: worldPos.y(), z: worldPos.z()};

                     //console.log('=======hahaaaaaahaa contactrulstsss========================');
                    //console.log( { tag, localPosDisplay, worldPosDisplay } );
                    //console.log(tag,localPosDisplay.x,localPosDisplay.y,localPosDisplay.z);
                   // console.log(tag,worldPosDisplay.x,worldPosDisplay.y,worldPosDisplay.z);
                    //console.log("ㅇ============================================================================Collsiision distinct@@@@@=============================================endsss")
                }
                groundCollision['value']=true;
                groundCollision['groundcontact']=true;
                this.isjumping=false;
            }
            if( threeObject0.userData.tag == "character" &&  (threeObject1.userData.tag=='enemy_passivebody' ||threeObject1.userData.tag=='enemy_passivebodyGLTF')){
                //캐릭터가 적들과(특히 근접)하고 있는지 여부 검사.원거리,근거리할것없이 모두 접촉하고있을때 반응한다. 주검사자는 캐릭터이며,반응자는 몬스터들이다. 주검사자:캐릭터유일,반응자:몬스터들
                if(threeObject1.userData){
                    tag = threeObject1.userData && threeObject1.userData.tag;
                    localPos = contactPoint.get_m_localPointA();
                    worldPos = contactPoint.get_m_positionWorldOnA();
                  //  console.log("threeojbect0,1",threeObject0.userData.tag,threeObject1.userData.tag);
                    let localPosDisplay = {x: localPos.x(), y: localPos.y(), z: localPos.z()};
                    let worldPosDisplay = {x: worldPos.x(), y: worldPos.y(), z: worldPos.z()};


                    let unit_type=threeObject1.userData.type;
                    let unit_isAttacked=threeObject1.userData.isAttacked;
                    console.log("closeType이고 attacking상태일떄!",unit_type,unit_isAttacked)

                    if(unit_type==='closeType' && unit_isAttacked){
                        //근거리인 유닛이 공격모드상태인 근거리유닛에게만 닿을시 뎀지 받게금. 원거리형유닛등에겐 마찰해도 뎀지 안달음.
                        let monsterPower=threeObject1.userData.power;
                        let character_defense=threeObject0.userData&&threeObject0.userData.defense?threeObject0.userData.defense:0
                         //console.log('=======hahaaaaaahaa contactrulstsss========================');
                       // console.log( { tag, localPosDisplay, worldPosDisplay } );
                        //console.log(tag,localPosDisplay.x,localPosDisplay.y,localPosDisplay.z);
                       // console.log(tag,worldPosDisplay.x,worldPosDisplay.y,worldPosDisplay.z);
                        //console.log("ㅇ============================================================================Collsiision distinct@@@@@=============================================endsss")
                        let damage=(monsterPower - character_defense);
                        damage= damage < 0 ? 0 : damage;
                        let prev_hp= threeObject0.userData.hp ;
                        prev_hp = prev_hp - damage;
                        threeObject0.userData.hp=prev_hp;


                        //closeType이고 attacekd attacking상태였을경우에 한해서 공격사운드 넣음.
                        let attackSound=threeObject1.userData.attackSound;
                        if(attackSound){
                            if(attackSound.isPlaying){
                                attackSound.offset=0;
                                attackSound.play();
                            }else{
                                attackSound.pause();
                                attackSound.offset=0;
                    
                                attackSound.play();
                            }
                        }
                    }
                }
            }
            if( threeObject0.userData.tag == "NextPORTAL" &&  (threeObject1.userData.tag=='character')){
                //캐릭터가 poortal에 접근했는지 접촉했는지 여부
                if(threeObject1.userData){
                    tag = threeObject1.userData && threeObject1.userData.tag;
                    localPos = contactPoint.get_m_localPointA();
                    worldPos = contactPoint.get_m_positionWorldOnA();
                  //  console.log("threeojbect0,1",threeObject0.userData.tag,threeObject1.userData.tag);
                    let localPosDisplay = {x: localPos.x(), y: localPos.y(), z: localPos.z()};
                    let worldPosDisplay = {x: worldPos.x(), y: worldPos.y(), z: worldPos.z()};

                   console.log("캐릭터가 portal에 접촉함!~!!!!!!!!");
                   this.NextEntrance=true;
                   this.NextMoveAgree=true;
                }
            }      
            if( threeObject0.userData.tag == "NextPORTAL2" &&  (threeObject1.userData.tag=='character')){
                //캐릭터가 poortal에 접근했는지 접촉했는지 여부
                if(threeObject1.userData){
                    tag = threeObject1.userData && threeObject1.userData.tag;
                    localPos = contactPoint.get_m_localPointA();
                    worldPos = contactPoint.get_m_positionWorldOnA();
                //  console.log("threeojbect0,1",threeObject0.userData.tag,threeObject1.userData.tag);
                    let localPosDisplay = {x: localPos.x(), y: localPos.y(), z: localPos.z()};
                    let worldPosDisplay = {x: worldPos.x(), y: worldPos.y(), z: worldPos.z()};

                console.log("캐릭터가 portal에 접촉함!~!!!!!!!!");
                this.NextEntrance2=true;
                this.NextMoveAgree2=true;
                }
            }
            if( threeObject0.userData.tag == "StartPORTAL" &&  (threeObject1.userData.tag=='character')){
                //캐릭터가 poortal에 접근했는지 접촉했는지 여부
                if(threeObject1.userData){
                    tag = threeObject1.userData && threeObject1.userData.tag;
                    localPos = contactPoint.get_m_localPointA();
                    worldPos = contactPoint.get_m_positionWorldOnA();
                  //  console.log("threeojbect0,1",threeObject0.userData.tag,threeObject1.userData.tag);
                    let localPosDisplay = {x: localPos.x(), y: localPos.y(), z: localPos.z()};
                    let worldPosDisplay = {x: worldPos.x(), y: worldPos.y(), z: worldPos.z()};

                   console.log("캐릭터가 portal에 접촉함!~!!!!!!!!");
                   this.StartEntrance=true;
                   this.StartMoveAgree=true;
                }
            }
            
            if( threeObject0.userData.tag == "characterweapon" &&  (threeObject1.userData.tag=='enemy_passivebody' ||threeObject1.userData.tag=='enemy_passivebodyGLTF' || threeObject1.userData.tag=='GLTF_EnemyDestroyBuilding' || threeObject1.userData.tag==='anothercharacter' ||  threeObject1.userData.tag==='anothercharacterStatic' )){
                //캐릭터웨폰이 적들(원거리,근거리)에 마찰닿았을때 반응,주검사자:캐릭터웨폰(유일), 반응자:몬스터들
                if(threeObject1.userData){
                    if(this._pressedKeys['t'] && this.type!='Far'){
                        //무기를 휘두르고있는경우에만 무기가 전방으로 휘둘려지고있는경우에만 데미지충돌처리
                        tag = threeObject1.userData && threeObject1.userData.tag;
                        localPos = contactPoint.get_m_localPointA();
                        worldPos = contactPoint.get_m_positionWorldOnA();
                        console.log("threeojbect0,1",threeObject0.userData.tag,threeObject1.userData.tag);
                        let localPosDisplay = {x: localPos.x(), y: localPos.y(), z: localPos.z()};
                        let worldPosDisplay = {x: worldPos.x(), y: worldPos.y(), z: worldPos.z()};
    
                         console.log('=======hahaaaaaahaa contactrulstsss========================');
                        console.log( { tag, localPosDisplay, worldPosDisplay } );
                        console.log(tag,localPosDisplay.x,localPosDisplay.y,localPosDisplay.z);
                        console.log(tag,worldPosDisplay.x,worldPosDisplay.y,worldPosDisplay.z);
                        console.log("ㅇ============================================================================Collsiision distinct@@@@@=============================================endsss")
    
                        if(this.WeaponSound.isPlaying){
                            this.WeaponSound.offset=0;
                            this.WeaponSound.play();
                        }else{
                            this.WeaponSound.pause();
                            this.WeaponSound.offset=0;
                
                            this.WeaponSound.play();
                        }
                        //캐릭마다 무기이펙트 모양 다를수있음(파라미터 필요)
                        //검휘두르는 이펙트(타격성공시에한해 생기는 타격성공지점에)
                        let xamountshape=2;//tan영향 가로로 무한히 긴개념.가로길이 의 폭량
                        let yamountshape=5;//sin영향 유한성 이펙트 세로높이모양
                        let zamountshape=3//cos영향 유한성 깊이모양
                        let x_origin=worldPosDisplay.x;
                        let y_origin=worldPosDisplay.y;
                        let z_origin=worldPosDisplay.z;  
                        let xTanFlag=2;//가로선형방향의 전반적모양 작을수록 다양성커짐
                        let ySinFlag=27;//세로사인방향전반적모양
                        let zCosFlag=24;//깊이코사인방향전반적모양
                        let particleSize=6;
                        let step=15;
                        let color=new THREE.Color();
                       // color.setRGB(1,0.5,0)
                        color.setRGB(this.weapon_effectColor['r'],this.weapon_effectColor['g'],this.weapon_effectColor['b']);


                        //enery2.jpg,enery1.jpg,fire.jpg,fire3.jpg,fire2.jpg,thunder.jpg,thunder2.jpg
                        let SpherePoints=new SphereParticle(this.weapon_particleSrc,this.weapon_xamountshape,this.weapon_yamountshape,this.weapon_zamountshape,x_origin,y_origin,z_origin,color,this.weapon_xTanFlag,this.weapon_ySinFlag,this.weapon_zCosFlag,this.weapon_particleSize,step);
                        console.log("SpherePoints??:",SpherePoints,SpherePoints._points)
                        this.scene.add(SpherePoints._points);
                        let fake_uniforms={
                            amplitude: { value: 0.0}
                        }
                        this.WeaponCollisionTriggerMaterials.push({
                            'mesh':SpherePoints._points,
                            'fakeuniforms':fake_uniforms,
                            'create':new Date().getTime()
                        });

                        let powerflag= this.character_isOverpower ? 3 : 1;
    
                        let monster_defense=threeObject1.userData.defense?threeObject1.userData.defense:0;
                        let character_basePower=this.character1&&this.character1.userData&&this.character1.userData.power?this.character1.userData.power:1;

                        let weaponpower=this.character1&&this.character1.userData&&this.character1.userData.weaponpower;
                        let weaponpowerflag=this.character1&&this.character1.userData&&this.character1.userData.weaponpowerflag;
                        weaponpower= weaponpower*weaponpowerflag;

                        if((threeObject1.userData.tag=='enemy_passivebody' ||threeObject1.userData.tag=='enemy_passivebodyGLTF' || threeObject1.userData.tag=='GLTF_EnemyDestroyBuilding' || threeObject1.userData.tag==='anothercharacter' ||  threeObject1.userData.tag==='anothercharacterStatic')){
                            console.log("반응한 오브젝트가 enemy passviebody or GLTF_EnemyDestroyBuilding 였을경우에만 그녀석 hp를 내린다",threeObject1,monster_defense);
                            let prev_hp= threeObject1.userData.hp;//캐릭터무기기본데미지(캐릭마다다름)*베이스파워(캐릭마다다름*파워플레크(모두동일)
                            let damage=(weaponpower*powerflag*character_basePower - monster_defense);
                            damage = damage<0 ? 0 : damage;
                            prev_hp = prev_hp - damage;
                            threeObject1.userData.hp = prev_hp;
    
                            threeObject1.userData.isAttacked=true;
                        }
                    }  
                }
            } 
            if( (threeObject0.userData.tag == "charactertransform" || threeObject0.userData.tag == "charactertransform2" ||  threeObject0.userData.tag == "charactertransform3" )&&  (threeObject1.userData.tag=='enemy_passivebody' ||threeObject1.userData.tag=='enemy_passivebodyGLTF' ||  threeObject1.userData.tag=='GLTF_EnemyDestroyBuilding' || threeObject1.userData.tag==='anothercharacter'  ||  threeObject1.userData.tag==='anothercharacterStatic')){
                //캐릭터파워웨이브이 적들(원거리,근거리)에 마찰닿았을때 반응,주검사자:캐릭터파워웨이브(1,2,3), 반응자:몬스터들
                if(threeObject1.userData){
                    if(this.character_isOverpower){
                        tag = threeObject1.userData && threeObject1.userData.tag;
                        localPos = contactPoint.get_m_localPointA();
                        worldPos = contactPoint.get_m_positionWorldOnA();
                        console.log("threeojbect0,1",threeObject0.userData.tag,threeObject1.userData.tag);
                        let localPosDisplay = {x: localPos.x(), y: localPos.y(), z: localPos.z()};
                        let worldPosDisplay = {x: worldPos.x(), y: worldPos.y(), z: worldPos.z()};

                        console.log('=======hahaaaaaahaa contactrulstsss characterPower========================');
                        console.log( { tag, localPosDisplay, worldPosDisplay } );
                        console.log(tag,localPosDisplay.x,localPosDisplay.y,localPosDisplay.z);
                        console.log(tag,worldPosDisplay.x,worldPosDisplay.y,worldPosDisplay.z);
                        console.log("ㅇ============================================================================Collsiision distinct@@@@@=============================================endsss")

                        let transformpower=this.character1&&this.character1.userData&&this.character1.userData.transformpower;
                        let powerflag= this.character_isOverpower ? 3 : 1;
                        let monster_defense=threeObject1.userData.defense?threeObject1.userData.defense:0;
                        let character_basePower=this.character1&&this.character1.userData&&this.character1.userData.power?this.character1.userData.power:1;

                        if((threeObject1.userData.tag=='enemy_passivebody' ||threeObject1.userData.tag=='enemy_passivebodyGLTF' || threeObject1.userData.tag=='GLTF_EnemyDestroyBuilding' || threeObject1.userData.tag=='anothercharacter' ||  threeObject1.userData.tag==='anothercharacterStatic')){
                            console.log("반응한 오브젝트가 enemy passviebody or destroyeneminybuildnigs 였을경우에만 그녀석 hp를 내린다",threeObject1);
                            let prev_hp= threeObject1.userData.hp;
                            let damage= (transformpower*powerflag*character_basePower - monster_defense);//캐릭터변신기기본파워(변신분신한개당,캐릭마다다름)*베이스파워(캐릭마다다름)*파워플레그(공통)
                            damage=damage<0?0:damage;
                            prev_hp = prev_hp -damage;
                            threeObject1.userData.hp = prev_hp;

                            threeObject1.userData.isAttacked=true;
                        }
                    }
                }
            }
        
            if( threeObject0.userData.tag == "characterballcamera" && (threeObject1.userData.tag!='character'&&threeObject1.userData.tag!='characterballcamera'&&threeObject1.userData.tag!='characterball' && threeObject1.userData.tag!='charactertransform'&&threeObject1.userData.tag!='charactertransform2'&&threeObject1.userData.tag!='charactertransform3'&&threeObject1.userData.tag!='characterweapon'&&threeObject1.userData.tag!='friends')){
                //주검사자:캐릭터볼(비유일,매번갱신 매번갱신되는 새로운 한개의 캐릭터볼 카메라형 생성대상자),반응자:캐릭터볼들제외모든대상(캐릭터관련 대상들 모두제외)
                if(threeObject1.userData.tag){
                    tag = threeObject1.userData && threeObject1.userData.tag;
                    localPos = contactPoint.get_m_localPointA();
                    worldPos = contactPoint.get_m_positionWorldOnA();
                    console.log("threeojbect0,1",threeObject0.userData.tag,threeObject1.userData.tag);
                    let localPosDisplay = {x: localPos.x(), y: localPos.y(), z: localPos.z()};
                    let worldPosDisplay = {x: worldPos.x(), y: worldPos.y(), z: worldPos.z()};

                    //console.log('=======hahaaaaaahaa contactrulstsss========================');
                    console.log( { tag, localPosDisplay, worldPosDisplay } );
                    console.log(tag,localPosDisplay.x,localPosDisplay.y,localPosDisplay.z);
                    console.log(tag,worldPosDisplay.x,worldPosDisplay.y,worldPosDisplay.z);
                    //console.log("============================================================================Collsiision distinct@@@@@=============================================endsss");
                    console.log("this_setupExplodess??:",this._setupExplodes);
                    if(this._setupExplodes){

                        if(threeObject0.userData.tag=='characterballcamera'){
                            
                            console.log("특정 대상위치에 처음으로 반응한 즉시 해당 오브젝트 관련 모두 없애기",worldPosDisplay,'지점에 폭발오브젝트생성하고');
                            console.log("this.chracterballbody:",this.chracterballbody2,'존재하냐??');
                            let threeObject_physicsBody=threeObject0.userData.physicsBody;
                            console.log("@@@@해당characterball scene에서 삭제:",threeObject0,this.scene.remove,this.physicsWorld.removeRigidBody);
                            console.log("삭제할 피직스 바디:",threeObject_physicsBody);
                            for(let r=0; r<rigidBodies.length; r++){
                                let item=rigidBodies[r];
                                if(item==threeObject0){
                                    rigidBodies[r]=undefined;
                                    console.log("제거된 characterball:",item);
                                }
                            }
                            this.scene.remove(threeObject0);//매번한개씩 갱신되며 생성되는 캐릭터볼을 반응할즉시 씬에서삭제,삭제,피직스월드에서 삭제.

                            this.physicsWorld.removeRigidBody(threeObject_physicsBody)
                            this.chracterballbody2=null;
                            //threeObject0.userData.isExplode='yes'
                            this._setupExplodes(worldPosDisplay);//폭발발생,폭발물관련처리.

                            let explodepower=this.character1&&this.character1.userData&&this.character1.userData.explodepower;
                            let powerflag= this.character_isOverpower ? 3 : 1;//세지는 정도는 모든 캐릭별 동일하게
                            let monster_defense=threeObject1.userData.defense?threeObject1.userData.defense:0;
                            let character_basePower=this.character1&&this.character1.userData&&this.character1.userData.power?this.character1.userData.power:1;

                            if((threeObject1.userData.tag=='enemy_passivebody' ||threeObject1.userData.tag=='enemy_passivebodyGLTF' ||  threeObject1.userData.tag=='GLTF_EnemyDestroyBuilding' || threeObject1.userData.tag==='anothercharacter'  ||  threeObject1.userData.tag==='anothercharacterStatic')){
                                console.log("반응한 오브젝트가 enemy passviebody opr destroyEneminbuidlgns 였을경우에만 그녀석 hp를 내린다",threeObject1);
                                let prev_hp= threeObject1.userData.hp;
                                let damage= (explodepower*powerflag*character_basePower - monster_defense);//폭발물뎀지(캐릭별다름)*베이스파워(캐릭별다름)*파워플래그(공통)
                                damage=damage<0?0:damage;
                                prev_hp = prev_hp - damage;
                                threeObject1.userData.hp = prev_hp;
                                threeObject1.userData.isAttacked=true;
                            }
                        }
                    }
                }
            }
          
           if( threeObject0.userData.tag == "monsterball" && threeObject1.userData.tag=='character' ){
            //주검사자:몬스터볼(몬스터별 갖고있는 하나씩의 몬스터볼:유일) 각몬스터별 몬스터볼,반응자:캐릭터 몬스터볼은 원거리유닛의 공격수단으로 중요하다.
                if(threeObject1.userData.tag){
                    tag = threeObject1.userData && threeObject1.userData.tag;
                    let distinctId=threeObject0.userData.distinctId;

                    localPos = contactPoint.get_m_localPointA();
                    worldPos = contactPoint.get_m_positionWorldOnA();
                    console.log("threeojbect0,1",threeObject0.userData.tag,threeObject1.userData.tag);
                    let localPosDisplay = {x: localPos.x(), y: localPos.y(), z: localPos.z()};
                    let worldPosDisplay = {x: worldPos.x(), y: worldPos.y(), z: worldPos.z()};

                    console.log('=======hahaaaaaahaa contactrulstsss========================');
                    console.log( { tag, localPosDisplay, worldPosDisplay } );
                    console.log(tag,localPosDisplay.x,localPosDisplay.y,localPosDisplay.z);
                    console.log(tag,worldPosDisplay.x,worldPosDisplay.y,worldPosDisplay.z);
                    console.log("monsterball Id:",distinctId);
                    let monster_motherunit=threeObject0.userData.mother;
                    console.log("monsterball mother unitss과 그 파워:",monster_motherunit,monster_motherunit.userData&&monster_motherunit.userData.power)
                    console.log("============================================================================Collsiision distinct@@@@@=============================================endsss");

                    let character_defense=threeObject1.userData.defense;
                    if(threeObject0.userData.tag=='monsterball'){
                        let attackSound=monster_motherunit.userData.attackSound;
                        if(attackSound){
                            if(attackSound.isPlaying){
                                attackSound.offset=0;
                                attackSound.play();
                            }else{
                                attackSound.pause();
                                attackSound.offset=0;
                    
                                attackSound.play();
                            }
                        }
                        if((threeObject1.userData.tag=='character')){
                            console.log("반응한 오브젝트가 character였을경우에만 캐릭터 hp를 내린다,character_defense",threeObject1,threeObject1.userData.hp,character_defense);
                            let damage=monster_motherunit.userData.power - character_defense;
                            damage = damage < 0 ? 0 : damage;
                            let prev_hp= threeObject1.userData.hp;
                            prev_hp = prev_hp - damage;
                            threeObject1.userData.hp = prev_hp;
                            
                        }
                    }
                }
            }
            if( threeObject0.userData.tag == "monsterballCreated" ){
                if(threeObject1.userData.tag){
                    tag = threeObject1.userData && threeObject1.userData.tag;
                    //let distinctId=threeObject0.userData.distinctId;

                    localPos = contactPoint.get_m_localPointA();
                    worldPos = contactPoint.get_m_positionWorldOnA();
                    console.log("threeojbect0,1",threeObject0.userData.tag,threeObject1.userData.tag);
                    let localPosDisplay = {x: localPos.x(), y: localPos.y(), z: localPos.z()};
                    let worldPosDisplay = {x: worldPos.x(), y: worldPos.y(), z: worldPos.z()};

                    console.log('=======hahaaaaaahaa contactrulstsss monsterballCreated========================');
                    console.log( { tag, localPosDisplay, worldPosDisplay } );
                    console.log(tag,localPosDisplay.x,localPosDisplay.y,localPosDisplay.z);
                    console.log(tag,worldPosDisplay.x,worldPosDisplay.y,worldPosDisplay.z);
                    console.log("============================================================================Collsiision distinct@@@@@=============================================endsss");
                    //몬스터볼이 닿은 폭발위치 주변에 가상 어라운드 박스

                    let threeObject_physicsBody=threeObject0.userData.physicsBody;
                    let monster_motherunit=threeObject0.userData.mother;
                    let attackRangeAmount=monster_motherunit.userData.attackRangeAmount;//영역은 무조건 정육면체로한다.
                    let attackParticlesrc=monster_motherunit.userData.attackParticlesrc;
                    let attackSound=monster_motherunit.userData.attackSound;
                    let attackColor=monster_motherunit.userData.attackColor;
                    let explodeParticleSteps=monster_motherunit.userData.steps;

                    console.log("monsterballCreated mother unitss과 그 파워:",monster_motherunit,monster_motherunit.userData&&monster_motherunit.userData.power)
                    console.log("enemyhuman unit rangeamount와 particlesrc",attackRangeAmount,attackParticlesrc,attackSound,attackColor)

                    console.log("@@@@해당monsterball scene에서 삭제:",threeObject0,this.scene.remove,this.physicsWorld.removeRigidBody);
                    console.log("삭제할 피직스 바디:",threeObject_physicsBody);
                    for(let r=0; r<rigidBodies.length; r++){
                        let item=rigidBodies[r];
                        if(item==threeObject0){
                            rigidBodies[r]=undefined;
                            console.log("제거된 monserBallCreated:",item);
                        }
                    }
                    let monsterCreatedBallList=this.monsterCreatedBallList;
                    for(let e=0; e<monsterCreatedBallList.length; e++){
                        let e_item=monsterCreatedBallList[e];
                        console.log("e_item(monsterCreatedBallList)상태:",e_item);

                        if(e_item && e_item.mesh == threeObject0){
                            e_item.mesh=null;
                            monsterCreatedBallList[e]=undefined;
                        }
                    }
                    this.scene.remove(threeObject0);//매번한개씩 갱신되며 생성되는 몬스터볼을 반응할즉시 씬에서삭제,삭제,피직스월드에서 삭제.
                    this.physicsWorld.removeRigidBody(threeObject_physicsBody)

                    if(threeObject0.userData.tag=='monsterballCreated'){
                        if(attackSound){
                            if(Array.isArray(attackSound)){
                                console.log("다중 사운드였떤경우!!!!!!:",attackSound);
                                for(let a=0; a<attackSound.length; a++){
                                    let attackSound_loca=attackSound[a];
                                    if(attackSound_loca){
                                        (function(i){

                                            if(attackSound_loca.isPlaying){
                                                window.setTimeout(function(){
                                                    attackSound_loca.offset=0;
                                                    attackSound_loca.play();
                                                },60*(i+1));
                                              
                                            }else{
                                                window.setTimeout(function(){
                                                    attackSound_loca.pause();
                                                    attackSound_loca.offset=0;
                                        
                                                    attackSound_loca.play();
                                                },60*(i+1));
                                            }
                                        }(a));
                                        
                                    }
                                }
                            }else{
                                if(attackSound.isPlaying){
                                    attackSound.offset=0;
                                    attackSound.play();
                                }else{
                                    attackSound.pause();
                                    attackSound.offset=0;
                        
                                    attackSound.play();
                                }
                            }
                            
                        }
                    
                    
                        console.log("반응지점 중심으로 n,n,n범위 크기의 정육면체바운딩박스 시각화생성");
                        let virtual_boundingbox=new THREE.Mesh(new THREE.BoxGeometry(attackRangeAmount*2,attackRangeAmount*2,attackRangeAmount*2),new THREE.MeshLambertMaterial({
                            color:0xfe1020,
                            transparent:true,opacity:0.2
                        }));
                        virtual_boundingbox.castShadow=true;
                        virtual_boundingbox.receiveShadow=true;
                        virtual_boundingbox.position.set(worldPosDisplay['x'],worldPosDisplay['y'],worldPosDisplay['z']);
                        let fake_uniforms={
                            amplitude: { value: 0.0}
                        }
                        this.scene.add(virtual_boundingbox);
                        this.lineTriggerMaterialsMonster.push({//몬스터가 공격으로 생성한 공격주변 범위박스와 공격범위이펙트
                            'mesh':virtual_boundingbox,
                            //'uniforms':local_uniforms,
                            'fakeuniforms':fake_uniforms,
                            'create':new Date().getTime()
                        }); 
                        let xamountshape=attackRangeAmount
                        let yamountshape=attackRangeAmount;
                        let zamountshape=attackRangeAmount;
                        let x_origin=worldPosDisplay['x'];
                        let y_origin=worldPosDisplay['y']+attackRangeAmount/2;
                        let z_origin=worldPosDisplay['z'];

                        let xSinFlag2=27;
                        let yTanFlag2=11;
                        let zCosFlag2=24;
                        let particleSize=attackRangeAmount*2*1.1;//몬스터별 파티클사이즈랑 이펙트만 달리하게(범위랑 저런 모양형태는 동일하게) attackRange가 곧 particleSize결정한다
                        let step=explodeParticleSteps;
                        //let explodescolor=new THREE.Color();
                        //explodescolor.setRGB(1,0.3,0);
                        let SpherePoints=new SphereParticleYVertical(attackParticlesrc,xamountshape,yamountshape,zamountshape,x_origin,y_origin,z_origin,attackColor,xSinFlag2,yTanFlag2,zCosFlag2,particleSize,step);
                        console.log("SpherePoints??: exploisosnsss!",SpherePoints,SpherePoints._points)
                        this.scene.add(SpherePoints._points);
                        let fake_uniformsexplode={
                            amplitude: { value: 0.0}
                        }
                        this.ExplodeEffectMaterialsMonster.push({//소규모폭발+몬스터가 생성한 형태,캐릭이 생성한것 같이 존재.시간이 지나면 지울뿐이다.
                            'mesh':SpherePoints._points,
                            'fakeuniforms':fake_uniformsexplode,
                            'create':new Date().getTime()
                        });

                        let ballRespond_around_rangeStartx=worldPosDisplay['x']-attackRangeAmount;
                        let ballRespond_around_rangeEndx=worldPosDisplay['x']+attackRangeAmount;
                        let ballRespond_around_rangeStarty=worldPosDisplay['y']-attackRangeAmount;
                        let ballRespond_around_rangeEndy=worldPosDisplay['y']+attackRangeAmount;
                        let ballRespond_around_rangeStartz=worldPosDisplay['z']-attackRangeAmount;
                        let ballRespond_around_rangeEndz=worldPosDisplay['z']+attackRangeAmount;//worldPosDisplayintsersdt 지점을 중심으로 101010이 정육면체바운딩박스공간 안에 캐릭터가 속하는지?

                        if(this.character1){
                            //console.log("근접 타입 모든 몬스터들과 그 위치:",closetypemonster,closetypemonster.position);
                            let target_position_x=this.character1.position.x;
                            let target_position_y=this.character1.position.y;
                            let target_position_z=this.character1.position.z;
            
                            if((target_position_x >= ballRespond_around_rangeStartx && target_position_x <= ballRespond_around_rangeEndx) && (target_position_y >= ballRespond_around_rangeStarty && target_position_y <= ballRespond_around_rangeEndy) && (target_position_z >= ballRespond_around_rangeStartz && target_position_z <= ballRespond_around_rangeEndz)){
                                console.log("소중대규모 원거리 발사 터치반응지점주변 조준폭발 범위에 있던경우에 한해서캐릭터에게  데미지를 입힌다.",this.character1)
                                
                                if(this.character1.userData){
                                    let prev_hp=this.character1.userData.hp;
                                    let character_defense=this.character1.userData.defense;
                                    
                                    let damage=(monster_motherunit.userData.power) - character_defense;
                                    damage= damage <=0 ? 0 : damage;
                                    console.log("기존 prevhp와 입힐 데미지:",prev_hp,damage);
                                    prev_hp= prev_hp - damage;
                                    this.character1.userData.hp=prev_hp;
                                  
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    _setupExplodes(pos){
        let now_time=new Date().getTime()/1000;
        let time_distance=now_time- this._previousExplosionSound;
        console.log("이전 폭발음으로부터 걸린시간:",time_distance,this.explosionSound.isPlaying)

        if(this.explosionSound.isPlaying){
            this.explosionSound.offset=0;
            this.explosionSound.play();
        }else{
            this.explosionSound.pause();
            this.explosionSound.offset=0;

            this.explosionSound.play();
        }

        console.log("해당 위치에 캐릭터폭발물설치!!:",pos);
       // let geometry=new THREE.BoxGeometry(6,6,6);
        //let geometry=new THREE.SphereGeometry(15,32,16);
        //let material=new THREE.MeshPhongMaterial({color:0xfe1050})

        let geo_mesh = this.characterballMeshTest.clone();//캐릭마다 폭발물의 모양 구조형태 다 다름.
        //breakup up object into traingales args:maxEdgeLength,maxIterationsss
        console.log("SkillBall explodesss geomesh:",geo_mesh);
        const tessellatemodifer=new TessellateModifier(8,6);
        let geometry=tessellatemodifer.modify(geo_mesh.geometry);
        console.log("tesselemosfifeㄱ가능?:",geometry)
        //buffergeoetry attributess
        const numFaces=geometry.attributes.position.count / 3;

        const colors=new Float32Array(numFaces *3 *3);//color of each facess
        const vel=new Float32Array(numFaces * 3 *3);//veloeicty ofg each facess

        const color = new THREE.Color();
    
        for(let f=0; f<numFaces; f++){
            const index= 9*f;//3 pintsss * [x,y,z] per triangless faces  0~8/9~17/18~26/27~35/,.....
            //onst h=0.5+Math.random(0.5); //hues
           //const r=0.8+Math.random(0.3);
           //const g=0.2+Math.random(0.3);
           //const b=0;
           const r=this.explodeObjectColor['r'];
           const g=this.explodeObjectColor['g'];
           const b=this.explodeObjectColor['b'];

           //console.log("randomRgb:",r,g,b);
            //color.setHSL(h,s,l);
            color.setRGB(r,g,b);//캐릭터별로 색상다르게(지금은 랜덤인데,그 색상폭발물 다르게)캐릭터별로 폭발물의색상형태다르게(형태는 블랜더모델링으로 형태만잡고,재질은 THREEJS에서 색상등만 해서 다르게 하여 진행) / 캐릭터별로 캐릭터볼발사체 BLENDER GLTF로 모양 다르게.gltf모델 클론해서 생성하여 매번 발사하는 형태로!1
            //velocity of points of facess
            let dirX = Math.random()*2 -1 ;
            let dirY = Math.random()*2 - 1;
            let dirZ = Math.random()*2 - 1;

            for(let i=0; i<3; i++){//삼각형 면(총 9개포인트) 0+0,0+1,0+2,0+3,0+4,0+5,0+6,0+7,0+8/ ||  9+0/9+1,9+2,./////
                //give vertcies of each face a color
                colors[index + (3 * i)]=color.r;
                colors[index + (3*i)+1] = color.g;
                colors[index+ (3*i) + 2] = color.b; //한 루프가 삼각면의 한꼭지점을 의미.꼭지점x,yz좌표별 컬러지정

                //give vertcies of each face a random velociy
                vel[index+(3*i)]=dirX;
                vel[index+(3*i)+1]=dirY;
                vel[index+(3*i)+2]=dirZ;

            }
        }//하나의 루프가 한개의 삼각면의미.

        geometry.setAttribute("customColor",new THREE.BufferAttribute(colors,3));
        geometry.setAttribute("vel",new THREE.BufferAttribute(vel,3));

        let local_uniforms={
            amplitude: { value: 0.0}
        }
        let fake_uniforms={
            amplitude: { value: 0.0}
        }
        
        const shaderMaterial=new THREE.ShaderMaterial({
            uniforms:local_uniforms,
            vertexShader:vertShader,
            fragmentShader:fragShader,
        });

  
        const explosionBox=(new THREE.Box3).setFromObject(geo_mesh);
        console.log("explosisonBox size??:",explosionBox);

        let calc_x=explosionBox.max.x- explosionBox.min.x;
        let calc_y=explosionBox.max.y- explosionBox.min.y;
        let calc_z=explosionBox.max.z- explosionBox.min.z;
        let max_size=Math.max(calc_x,calc_y,calc_z);

        const mesh=new THREE.Mesh(geometry,shaderMaterial);
        mesh.position.set(pos.x,pos.y,pos.z);
        this.scene.add(mesh);

        console.log("계산된 explosionbox크기:",max_size,max_size,max_size);

        let range={
            'startx':pos.x - max_size/2,'endx':pos.x + max_size/2,
            'startz':pos.z - max_size/2 ,'endz':pos.z + max_size/2,
            'starty':pos.y ,'endy':pos.y + max_size,
        }
        console.log("폭발범위!!!:",range);
        this.explodesMaterials.push({
            'range':range,
            'mesh':mesh,
            'uniforms':local_uniforms,
            'fake_uniforms':fake_uniforms,
            'create':new Date().getTime()
        });

        //폭발이펙트폭발주변이펙트(폭발주면 이펙트:캐릭마다 다름) 캐릭의 폭발물이나 구조에 따라 캐릭마다 폭발이펙트다르게
        let xamountshape=max_size*0.5;//sin영향 가로로 유한히 긴개념.가로길이 의 폭량 공통값으로!
        let yamountshape=max_size*0.01;//세로무한높이 공통값으로!
        let zamountshape=max_size*0.5//cos영향 유한성 깊이모양 폭발물의 콜리젼 모양과 동일하게 범위를 생성 x폭은  공통값으로! 탄젠트이기에 매우 광할하기에 작게 그만큼 맞추고, y와 깊이z코사인은 적절히 폭발물콜리션크기의 4배로 
        let x_origin=pos.x;
        let y_origin=pos.y+max_size/2;//정확히 파티클은 폭발오브젝트의 중앙지점이라고할수이다(반운딩박스 가상공간기준maxsize로 모두 동일한 정육면체형태 가상공간내부의 정확히 가운데이고, 그 가운데에서 이펙트가기준으로 처리된다.)
        let z_origin=pos.z
        //폭발발생위치+폭발물체의가장큰 바운딩박스는 높이기준으로항상 모델링하고 ㄱ 높이값가운데 기준으로 오리진이 /잡혀있고, 그 가운데 오리진 은 max-size/2위치를 그 폭발위치반응위치에 더한것 만ㅋㅁ 하면 그 폭발위칠ㄹ 중ㅅ미으로 모델별로하여금 기준점생김(이 기준점이 폭발)리지드바디의 기준생성위치이기도하고 생성위치이기도하고, 폭발이펙트팥키클이 시작 위치이기도하다.

        let xSinFlag2=27;//가로sin방향의 
        let yTanFlag2=11;//세로tan방향전반적모양
        let zCosFlag2=24;//깊이코사인방향전반적모양
        let particleSize=max_size*this.explosion_particleSize;//화염이 경우 sin,yan,cos플래그랑 폭발위치등,웨폰오리진 위치등은 모두 공통여야함.스탭이랑.. 파티클사이즈만 차별점있게끔(이펙색상)
        let step=30;//스탭이랑 저 모양 형태는 공통일수밖에없음. 웨폰도 마찬가지..
        let explodescolor=new THREE.Color();
        console.log("폭발컬러 설정!!:",this.explosion_effectColor)
        explodescolor.setRGB(this.explosion_effectColor['r'],this.explosion_effectColor['g'],this.explosion_effectColor['b'])

        //enery2.jpg,enery1.jpg,fire.jpg,fire3.jpg,fire2.jpg,thunder.jpg,thunder2.jpg
        let SpherePoints=new SphereParticleYVertical(this.explosion_particleSrc,xamountshape,yamountshape,zamountshape,x_origin,y_origin,z_origin,explodescolor,xSinFlag2,yTanFlag2,zCosFlag2,particleSize,step);
        console.log("SpherePoints??: exploisosnsss!",SpherePoints,SpherePoints._points)
        this.scene.add(SpherePoints._points);
        let fake_uniformsexplode={
            amplitude: { value: 0.0}
        }
        this.ExplodeEffectMaterials.push({
            'mesh':SpherePoints._points,
            'fakeuniforms':fake_uniformsexplode,
            'create':new Date().getTime()
        });
        console.log("local unfiorsm_clone and unfirosmss originlass:",local_uniforms);

        this._previousExplosionSound=new Date().getTime()/1000;
     }

    setupContactPairResultCallback(Ammo=this.ammoClone){  //안쓰임
    
        this.cbContactPairResult = new Ammo.ConcreteContactResultCallback();
        this.cbContactPairResult.hasContact = false;
        this.cbContactPairResult.addSingleResult = function(cp, colObj0Wrap, partId0, index0, colObj1Wrap, partId1, index1){
            console.log("cbContactPairResult cp, colObj0Wrap, partId0, index0, colObj1Wrap, partId1, index1",cp, colObj0Wrap, partId0, index0, colObj1Wrap, partId1, index1)
            let contactPoint = Ammo.wrapPointer( cp, Ammo.btManifoldPoint );
            console.log("caontact pointsssss contactpairrulsetss:",contactPoint)
            const distance = contactPoint.getDistance();
            console.log("contact distancess:",distance);
            if( distance > 0 ) return;
    
            this.hasContact = true;
        }
    }
    checkContact(){
        if(this.physicsWorld && this.physicsWorld.contactTest){
           // console.log("this.phihisswolrd contactTest???:",this.physicsWorld.contactTest);
            if(this.character1 && this.character1.userData && this.cbContactResult){

                this.physicsWorld.contactTest(this.character1.userData.physicsBody, this.cbContactResult);//캐릭터와 모든것(몬스터와,캐릭터관련:무기,캐릭터볼들,트랜스폼들 제외)에 마찰여부검사(지면충돌콜리션여부)

               if(this.chracterballbody2){//카메라형(2),raycaster(마우스커서조준,카메라맵핑방향:1)
                    //console.log("thisCharadterballbody2존재할때만 검사!:",this.chracterballbody2);
                    this.physicsWorld.contactTest(this.chracterballbody2, this.cbContactResult)
                }
                /*if(this.chracterballbody){//카메라형(2),raycaster(마우스커서조준,카메라맵핑방향:1)
                    console.log("thisCharadterballbody존재할때만 검사!:",this.chracterballbody);
                    this.physicsWorld.contactTest(this.chracterballbody, this.cbContactResult)
                }*/
                if(this.character_isOverpower){
                    if(this.charactertransform){
                        //console.log("characterParticleMesh존재할때만 검사!:",this.characterParticlePhysicsBody);
                        if(this.charactertransform.userData && this.charactertransform.userData.physicsBody){
                            this.physicsWorld.contactTest(this.charactertransform.userData.physicsBody, this.cbContactResult)
                        }
                    }  
                    /*if(this.charactertransform2){
                        if(this.charactertransform2.userData && this.charactertransform2.userData.physicsBody){
                            this.physicsWorld.contactTest(this.charactertransform2.userData.physicsBody, this.cbContactResult)
                        }
                    }  
                    if(this.charactertransform3){
                        if(this.charactertransform3.userData && this.charactertransform3.userData.physicsBody){
                            this.physicsWorld.contactTest(this.charactertransform3.userData.physicsBody, this.cbContactResult)
                        }
                    }*/
                }
                if(this.weapon){
                    this.physicsWorld.contactTest(this.weapon.userData.physicsBody, this.cbContactResult)
                }
                if(this.nextfortal){
                    this.physicsWorld.contactTest(this.nextfortal.userData.physicsBody, this.cbContactResult)
                } 
                if(this.nextfortal2){
                    this.physicsWorld.contactTest(this.nextfortal2.userData.physicsBody, this.cbContactResult)
                } 
                
                if(this.startfortal){
                    this.physicsWorld.contactTest(this.startfortal.userData.physicsBody, this.cbContactResult)
                }
                
                if(this.monsterCreatedBallList){
                    for(let m=0; m<this.monsterCreatedBallList.length; m++){
                        let monsterball_item_indiviual=this.monsterCreatedBallList[m];
                       // console.log("this indiviual mosnerball:",monsterball_item_indiviual,monsterball_item_indiviual.threeObject,[monsterball_item_indiviual.threeObject.position.x,monsterball_item_indiviual.threeObject.position.y,monsterball_item_indiviual.threeObject.position.z])
                       if(monsterball_item_indiviual){
                        let meshitem=monsterball_item_indiviual.mesh;
                        let indiviaul_pbody=meshitem.userData.physicsBody;

                         this.physicsWorld.contactTest(indiviaul_pbody, this.cbContactResult)
                       }
                    }
                }
               
            }
        }
    }
    
    startAmmo(){
        Ammo().then((Ammo)=>{
            Ammo=Ammo;
            this.ammoClone = Ammo;
            console.log('Ammo:',Ammo);
            this.createAmmo(Ammo);
        })
    }
    createAmmo(Ammo=this.ammoClone,){
        this.tempTransform=new Ammo.btTransform()

        this.setUpPhysicsWorld(Ammo)


       this.createGLTFGroup('https://sinjaesung.github.io/3DASSET/terrain/evil/evilCoreBase.glb',Ammo,null,{x:0,y:0,z:0,w:1},0,{
            'shapeType':'convexTriangle'
        });
    
        //포탈!!(맵간 이동) 별도 파라미터 넣지않으면 이동시 맵의 초기설정위치에서 로드,pos넣을시 그 post에 관련된 위치에서 카메라랑,캐릭터랑 해서 로드
        this.NextPORTAL('https://sinjaesung.github.io/3DASSET/terrain/evil/evilCore_Nextfortal.glb',Ammo,null,{x:0,y:0,z:0,w:1},0,{
            'shapeType':'convexTriangle'
        });
        this.StartPORTAL('https://sinjaesung.github.io/3DASSET/terrain/evil/evilCore_Startfortal.glb',Ammo,null,{x:0,y:0,z:0,w:1},0,{
            'shapeType':'convexTriangle'
        });  
    
        //애너미 빌딩passive형태
        let buildlingColor=new THREE.Color();
        buildlingColor.setRGB(0.9,0.7,0.1); 

        let collapseSounds=[];
        for(let a=0; a<2; a++){
            let audioListener_buildlingTest=new THREE.AudioListener();
            let collapseSound=new THREE.Audio(audioListener_buildlingTest);
            let audioLoader_buildingTest=new THREE.AudioLoader();
            audioLoader_buildingTest.load('https://sinjaesung.github.io/3DASSET/mob/normalBuildingCollapse.mp3',function(buffer){//무기공격성공시사운드 다르게
                collapseSound.setBuffer(buffer);
                collapseSound.setLoop(false);
                collapseSound.setVolume(2.9);
            });
            collapseSounds.push(collapseSound);
        }
        this.createGLTF_EnemyBuildinggroup('https://sinjaesung.github.io/3DASSET/terrain/evil/evilCore_destroyBuildings.glb',Ammo,null,{x:0,y:0,z:0,w:1},0,24000,125,buildlingColor,collapseSounds)
        
        // 몬스터
        for(let e=0; e<20; e++){//humanBad created Types (메카닉:전투기계들,바이오닉,사이보그)
            let unit=e%2==0?-1:1;
            let x=Math.random()*150+300; // 300~450
            let y=180;//항상양수
            let z=Math.random()*380-180//0~400 -180~200
            let pos={'x':x,'y':y,'z':z}
            let hp=15000;
            let power=0;
            let speed=0.1;//max값 1.2 0~36벙뮈 36거리곱범위 매우 먼 범위
            let mass=80;
            let defense=6;

            let audioListener=new THREE.AudioListener();
            let diedSound=new THREE.Audio(audioListener);
            let audioLoader_local2=new THREE.AudioLoader();
            audioLoader_local2.load('https://sinjaesung.github.io/3DASSET/mob/enemyhuman_diedsound.mp3',function(buffer){
                diedSound.setBuffer(buffer);
                diedSound.setLoop(false);
                diedSound.setVolume(1);
            });

            this.createAnotherCharacterGLTF(Ammo,pos,"https://sinjaesung.github.io/3DASSET/terrain/evil/evilCoreman.glb",null,e,hp,power,'anothercharacter',speed,mass,'evilCoreman',defense,'',null,diedSound);
        }
        for(let e=0; e<20; e++){//humanBad created Types (메카닉:전투기계들,바이오닉,사이보그)
            let unit=e%2==0?-1:1;
            let x=Math.random()*80*unit; //-500~500범위가능
            let y=Math.random()*3+70;//항상양수
            let z=Math.random()*80*unit

            let pos={'x':x,'y':y,'z':z}
            let skillPos={'x':40,'y':6,'z':6}

            let hp=10500;
            let power=400;
            let speed=0.3;//max값 1.2 0~36벙뮈 36거리곱범위 매우 먼 범위
            let mass=80;
            let defense=50;
            let distanceamount=36;
            let isAir=false;
            let isAirChase=true;

            let attackRangeAmount=4;
            let attackParticlesrc='https://sinjaesung.github.io/3DASSET/mob/fire2.jpg';
            let attackColor=new THREE.Color();
            attackColor.setRGB(1,0.1,0); 

            let audioListener_individual=new THREE.AudioListener();
            let attackSound=new THREE.Audio(audioListener_individual);
            let audioLoader_local=new THREE.AudioLoader();
            audioLoader_local.load('https://sinjaesung.github.io/3DASSET/mob/gunSounds.mp3',function(buffer){//무기공격성공시사운드 다르게
                attackSound.setBuffer(buffer);
                attackSound.setLoop(false);
                attackSound.setVolume(0.3);
            });

            
            let audioListener=new THREE.AudioListener();
            let diedSound=new THREE.Audio(audioListener);
            let audioLoader_local2=new THREE.AudioLoader();
            audioLoader_local2.load('https://sinjaesung.github.io/3DASSET/mob/enemyhuman_diedsound.mp3',function(buffer){
                diedSound.setBuffer(buffer);
                diedSound.setLoop(false);
                diedSound.setVolume(1);
            });

            this.createEnemyGLTF3(Ammo,pos,"https://sinjaesung.github.io/3DASSET/mob/HumanTypeGunMan.glb",null,e,hp,power,'farType',speed,mass,'GunManHuman','https://sinjaesung.github.io/3DASSET/mob/HumanTypeGunMan_ballchild.glb',skillPos,null,defense,distanceamount,isAir,attackRangeAmount,attackParticlesrc,attackSound,attackColor,isAirChase,2,1,diedSound);
        }
        for(let e=0; e<10; e++){//humanBad created Types (메카닉:전투기계들,바이오닉,사이보그)
            let unit=e%2==0?-1:1;
            let x=Math.random()*80*unit; //-500~500범위가능
            let y=Math.random()*3+70;//항상양수
            let z=Math.random()*80*unit

            let pos={'x':x,'y':y,'z':z}
            let skillPos={'x':40,'y':6,'z':6}

            let hp=19500;
            let power=500;
            let speed=0.3;//max값 1.2 0~36벙뮈 36거리곱범위 매우 먼 범위
            let mass=80;
            let defense=100;
            let distanceamount=60;
            let isAir=false;
            let isAirChase=true;

            let attackRangeAmount=5;
            let attackParticlesrc='https://sinjaesung.github.io/3DASSET/mob/fire2.jpg';
            let attackColor=new THREE.Color();
            attackColor.setRGB(0.5,0.2,0.8); 

            let audioListener_individual=new THREE.AudioListener();
            let attackSound=new THREE.Audio(audioListener_individual);
            let audioLoader_local=new THREE.AudioLoader();
            audioLoader_local.load('https://sinjaesung.github.io/3DASSET/mob/pistol.mp3',function(buffer){//무기공격성공시사운드 다르게
                attackSound.setBuffer(buffer);
                attackSound.setLoop(false);
                attackSound.setVolume(0.3);
            });

            let audioListener=new THREE.AudioListener();
            let diedSound=new THREE.Audio(audioListener);
            let audioLoader_local2=new THREE.AudioLoader();
            audioLoader_local2.load('https://sinjaesung.github.io/3DASSET/mob/enemyhuman_diedsound.mp3',function(buffer){
                diedSound.setBuffer(buffer);
                diedSound.setLoop(false);
                diedSound.setVolume(1);
            });

            this.createEnemyGLTF3(Ammo,pos,"https://sinjaesung.github.io/3DASSET/mob/HumanTypePistolMan.glb",null,e,hp,power,'farType',speed,mass,'pistolManHuman','https://sinjaesung.github.io/3DASSET/mob/HumanTypePistolMan_ballchild.glb',skillPos,null,defense,distanceamount,isAir,attackRangeAmount,attackParticlesrc,attackSound,attackColor,isAirChase,2,1,diedSound);
        }
        for(let e=0; e<10; e++){
            let unit=e%2==0?-1:1;
            let x=Math.random()*80*unit; //-500~500범위가능
            let y=Math.random()*3+70;//항상양수
            let z=Math.random()*80*unit

            let pos={'x':x,'y':y,'z':z}

            //monster knife맨
            let hp=24000;
            let power=420;
            let speed=0.7;
            let mass=80;
            let defense=120;
            let is_air_limit=false;

            let audioListener_individual=new THREE.AudioListener();
            let attackSound=new THREE.Audio(audioListener_individual);
            let audioLoader_local=new THREE.AudioLoader();
            audioLoader_local.load('https://sinjaesung.github.io/3DASSET/mob/knifeSounds.mp3',function(buffer){//무기공격성공시사운드 다르게
                attackSound.setBuffer(buffer);
                attackSound.setLoop(false);
                attackSound.setVolume(0.3);
            });

            let audioListener=new THREE.AudioListener();
            let diedSound=new THREE.Audio(audioListener);
            let audioLoader_local2=new THREE.AudioLoader();
            audioLoader_local2.load('https://sinjaesung.github.io/3DASSET/mob/enemyhuman_diedsound.mp3',function(buffer){
                diedSound.setBuffer(buffer);
                diedSound.setLoop(false);
                diedSound.setVolume(1);
            });

            this.createEnemyGLTF(Ammo,pos,"https://sinjaesung.github.io/3DASSET/mob/HumanTypeKnifeMan.glb",null,e,hp,power,'closeType',speed,mass,'knifeManHuman',defense,is_air_limit,attackSound,diedSound);//근거리형유닛
        }

        for(let e=0; e<10; e++){
            let unit=e%2==0?-1:1;
            let x=Math.random()*80*unit; //-500~500범위가능
            let y=Math.random()*3+70;//항상양수
            let z=Math.random()*80*unit

            let pos={'x':x,'y':y,'z':z}

            let hp=60000;
            let power=700;
            let speed=0.6;
            let mass=180;
            let defense=360;
            let is_air_limit=false;

            
            let audioListener_individual=new THREE.AudioListener();
            let attackSound=new THREE.Audio(audioListener_individual);
            let audioLoader_local=new THREE.AudioLoader();
            audioLoader_local.load('https://sinjaesung.github.io/3DASSET/mob/SwordSounds.mp3',function(buffer){//무기공격성공시사운드 다르게
                attackSound.setBuffer(buffer);
                attackSound.setLoop(false);
                attackSound.setVolume(0.3);
            });

            let audioListener=new THREE.AudioListener();
            let diedSound=new THREE.Audio(audioListener);
            let audioLoader_local2=new THREE.AudioLoader();
            audioLoader_local2.load('https://sinjaesung.github.io/3DASSET/mob/enemyhuman_diedsound.mp3',function(buffer){
                diedSound.setBuffer(buffer);
                diedSound.setLoop(false);
                diedSound.setVolume(1);
            });

            this.createEnemyGLTF(Ammo,pos,"https://sinjaesung.github.io/3DASSET/mob/HumanTypeSwordMan.glb",null,e,hp,power,'closeType',speed,mass,'SwordManHuman',defense,is_air_limit,attackSound,diedSound);
        }

        //eval(function_string);

        console.log("this.loadposx,this.loadposy,this.loadposz??:",this.loadposx,this.loadposy,this.loadposz)
        if(!isNaN(this.loadposx)&& !isNaN(this.loadposy) && !isNaN(this.loadposz)){
             //캐릭터관련
             console.log("character_load_pos: allright",this.loadposx,this.loadposy,this.loadposz);
            this.createModel(Ammo,{x:this.loadposx,y:this.loadposy,z:this.loadposz},{x:0,y:0,z:0,w:1},this.mass,{//캐릭터 바운딩3box박스cubebox모델로 shapoe처리
                'activationState':4,
                'Firection':1,
                'RollingFriction':0.05,
                'Restitution':1
            },this.characterhp,this.characterdefense,this.characterspeed,this.characterpower,this.weaponpower,this.explodepower,this.rasierpower,this.transformpower,this.weaponpowerflag,this.rasierpowerflag,this.recoverpower)
        }else if(isNaN(this.loadposx) || isNaN(this.loadposy) || isNaN(this.loadposz)){
            console.log("character_load_pos: isNan포함",this.loadposx,this.loadposy,this.loadposz);

            this.createModel(Ammo,{x:0,y:12,z:6},{x:0,y:0,z:0,w:1},this.mass,{//캐릭터 바운딩3box박스cubebox모델로 shapoe처리
                'activationState':4,
                'Firection':1,
                'RollingFriction':0.05,
                'Restitution':1
            } ,this.characterhp,this.characterdefense,this.characterspeed,this.characterpower,this.weaponpower,this.explodepower,this.rasierpower,this.transformpower,this.weaponpowerflag,this.rasierpowerflag,this.recoverpower)
        }else{
            console.log("character_load_pos: isNan포함",this.loadposx,this.loadposy,this.loadposz);

            this.createModel(Ammo,{x:0,y:12,z:6},{x:0,y:0,z:0,w:1},this.mass,{//캐릭터 바운딩3box박스cubebox모델로 shapoe처리
                'activationState':4,
                'Firection':1,
                'RollingFriction':0.05,
                'Restitution':1
            } ,this.characterhp,this.characterdefense,this.characterspeed,this.characterpower,this.weaponpower,this.explodepower,this.rasierpower,this.transformpower,this.weaponpowerflag,this.rasierpowerflag,this.recoverpower)
        }
       
        if(!this.type || this.type!='Far'){
            this.createWeapon(Ammo,{x:120,y:33,z:0},{x:0,y:0,z:0,w:1},2,{//cubebox바운딩박스 shape처리
                'activationState':4,
                'Firection':1,
                'RollingFriction':0.05,
                'Restitution':1
            } )
        }   
       /* console.log("=====>>CREATEAMMO함수 호출ENDS시점 이후 WINDOWsETTIMEOUT 4초뒤 실행함수에서 관련 로드처리=========");
        window.setTimeout(function(){
            console.log("===>>createAmmo함수 호출이후 7초뒤에 실행될 익명함수 실행scopes starts=============>>>");
            console.log("this pageLoader참조!!:",this.pageLoader);

            if(this.pageLoader){
                this.pageLoader.style.display='none';
            }
            console.log("===>>createAmmo함수 호출이후 7초뒤에 실행될 익명함수 실행scopes ends=============>>>");

        },7000)*/
    }
   
    setUpPhysicsWorld(Ammo){
        let collisionConfiguration=new Ammo.btDefaultCollisionConfiguration();
        let dispatcher=new Ammo.btCollisionDispatcher(collisionConfiguration);
        let overlappingPairCache=new Ammo.btDbvtBroadphase()
        let solver=new Ammo.btSequentialImpulseConstraintSolver();

        this.physicsWorld=new Ammo.btDiscreteDynamicsWorld(dispatcher,overlappingPairCache,solver,collisionConfiguration);
        this.physicsWorld.setGravity(new Ammo.btVector3(0,-10,0));
        console.log("phyiscss World initss");

        this.setupContactResultCallback(Ammo);
        this.setupContactPairResultCallback(Ammo);
    }
    
    createPlane(Ammo=this.ammoClone){
        let pos={x:0,y:0,z:0},
        scale={x:1000,y:10,z:1000},
        quat={x:0,y:0,z:0,w:1},
        mass=0;

        let blockPlane=new THREE.Mesh(new THREE.BoxGeometry(scale.x,scale.y,scale.z),new THREE.MeshLambertMaterial({
            color:0x101020,
            transparent:true,opacity:1
        }))

        blockPlane.position.set(pos.x,pos.y,pos.z);

        blockPlane.castShadow=true;
        blockPlane.receiveShadow=true;

        this.scene.add(blockPlane);
        blockPlane.userData.tag='baseGround';
        blockPlane.userData.ObjectType='terrain'
        //phyisscs in ammojs
        let transform=new Ammo.btTransform();
        transform.setIdentity()
        transform.setOrigin(new Ammo.btVector3(pos.x,pos.y,pos.z));
        transform.setRotation(new Ammo.btQuaternion(quat.x,quat.y,quat.z,quat.w));

        let motionState=new Ammo.btDefaultMotionState(transform);

        let localIntertia=new Ammo.btVector3(0,0,0);

        let shape=new Ammo.btBoxShape(new Ammo.btVector3(scale.x*0.5,scale.y*0.5,scale.z*0.5));
        shape.setMargin(0.05);
        shape.calculateLocalInertia(mass,localIntertia);

        let rigidBodyInfo=new Ammo.btRigidBodyConstructionInfo(mass,motionState,shape,localIntertia);
        let rBody=new Ammo.btRigidBody(rigidBodyInfo);
        rBody.threeObject=blockPlane;

        this.physicsWorld.addRigidBody(rBody);
    }
    createBox(Ammo=this.ammoClone,pos,quat,mass){
        console.log("createBoxxxx:",Ammo,pos,quat,mass)
        let box=new THREE.Mesh(new THREE.BoxGeometry(8,16,20),new THREE.MeshPhongMaterial({color:0x525252}));
        let box_btshape=new Ammo.btBoxShape(new Ammo.btVector3(4,8,10));

        box.position.set(pos.x,pos.y,pos.z);
        box.castShadow=true;
        box.receiveShadow=true;

        this.scene.add(box);
        box.userData.tag='normalBox';
        box.userData.ObjectType='terrain'

        //phyiscss in ammojs
        let transform=new Ammo.btTransform();
        transform.setIdentity()
        transform.setOrigin(new Ammo.btVector3(pos.x,pos.y,pos.z));
        transform.setRotation(new Ammo.btQuaternion(quat.x,quat.y,quat.z,quat.w));

        let motionState=new Ammo.btDefaultMotionState(transform);

        let localIntertia=new Ammo.btVector3(0,0,0);
        box_btshape.setMargin(0.05);
        box_btshape.calculateLocalInertia(mass,localIntertia);

        let rigidBodyInfo=new Ammo.btRigidBodyConstructionInfo(mass,motionState,box_btshape,localIntertia);
        let rBody=new Ammo.btRigidBody(rigidBodyInfo);

        rBody.setActivationState(4);

        this.physicsWorld.addRigidBody(rBody);
        box.userData.physicsBody=rBody;
        rBody.threeObject=box;
        this._pbox=box;
        rigidBodies.push(box);
    }
    createGong(Ammo= this.ammoClone,pos,radius,quat,mass){
        //let pos={x:0,y:20,z:0},
        //radius=2,
       // quat={x:0,y:0,z:0,w:1},
       // mass=1;

        //ball in the threejs
        let ball=new THREE.Mesh(new THREE.SphereGeometry(radius),new THREE.MeshPhongMaterial({color:0xff0000}));
        ball.position.set(pos.x,pos.y,pos.z);

        ball.castShadow=true;
        ball.receiveShadow=true;

        this.scene.add(ball);
        ball.userData.tag='normalSphere';
        ball.userData.ObjectType='terrain';

        //phyiscss in ammojs
         let transform=new Ammo.btTransform();
         transform.setIdentity()
         transform.setOrigin(new Ammo.btVector3(pos.x,pos.y,pos.z));
         transform.setRotation(new Ammo.btQuaternion(quat.x,quat.y,quat.z,quat.w));
 
         let motionState=new Ammo.btDefaultMotionState(transform);

         let localIntertia=new Ammo.btVector3(0,0,0);

         let shape=new Ammo.btSphereShape(radius);
         shape.setMargin(0.05);
         shape.calculateLocalInertia(mass,localIntertia);

         let rigidBodyInfo=new Ammo.btRigidBodyConstructionInfo(mass,motionState,shape,localIntertia);
        let rBody=new Ammo.btRigidBody(rigidBodyInfo);

        rBody.setActivationState(4);//이걸 값을 명시적으로 해줘야만 추가적으로 사용자이 움직임 제어에 대해 작동하게됨!
        rBody.setFriction(1);   
        rBody.setRollingFriction(0.05);
        rBody.setRestitution(1);
       // rBody.setDamping(0.1);

        this.physicsWorld.addRigidBody(rBody);
        ball.userData.physicsBody=rBody;
        rBody.threeObject=ball;
        rigidBodies.push(ball);
    }
    createGLTF(src,Ammo=this.ammoClone,pos,quat,mass,physicParam,matterialParam){
        let added_loadmodel={};
        added_loadmodel['src']=src;
        added_loadmodel['isloaded']=false;
        this.loadmodels.push(added_loadmodel);

        this.loader=new GLTFLoader()
       // const dracoLoader=new DRACOLoader()
        this.loader.load(src,(gltf)=>{
           const model=gltf.scene.children[0];
           if(pos){
               console.log("원래 모델이 위치공간은?? 오브젝트위치공간은?:",model,pos);
              model.position.set(pos)
           }else{
              console.log("포지션 지정하지 않은경우에 원래 본채 갖고있던 오브젝트위치공간은?:",model);
              pos=model.position;
           }
           model.castShadow=true;
           model.receiveShadow=true;
           model.userData.tag='GLTFMODEL';
           model.userData.ObjectType='terrain';

           if(matterialParam){
                let newMaterial=new THREE.MeshLambertMaterial({
                    color:matterialParam['color']?matterialParam['color']:0xefefef,
                    transparent:matterialParam['transparent']?matterialParam['transparent']:false,
                    opacity:matterialParam['opacity']?matterialParam['opacity']:1
                })
                model.material=newMaterial;
            }
            this.scene.add(gltf.scene)
            console.log("hahahahaha load gltf model info!!!:",gltf,gltf.scene);
            //const geometry=gltf.scene.children[0].geometry;
           // const material=gltf.scene.children[0].material;
            //console.log('히히히히 suz모델 geometry,material:',geometry,material);
            //this.createInstances(geometry,material,Ammo);
            //pos 0 5 0 
            let shapeGet;
            if(physicParam['shapeType']==='cubeBox'){
                let bounding=(new THREE.Box3).setFromObject(model);
                console.log("하하 모델로부터 얻어낸 바운딩박스정보",bounding);
                let calc_x=bounding.max.x-bounding.min.x;
                let calc_z=bounding.max.z-bounding.min.z;
                let calc_y=bounding.max.y-bounding.min.y;
                console.log("얻어낸 박스 크기",calc_x,calc_z,calc_y)
                shapeGet=new Ammo.btBoxShape(new Ammo.btVector3(calc_x*0.5,calc_y*0.5,calc_z*0.5));
                
                let transform=new Ammo.btTransform();
                transform.setIdentity()
                transform.setOrigin(new Ammo.btVector3(pos.x,pos.y,pos.z));
                transform.setRotation(new Ammo.btQuaternion(quat.x,quat.y,quat.z,quat.w));

                let motionState=new Ammo.btDefaultMotionState(transform);

                let localIntertia=new Ammo.btVector3(0,0,0);
                shapeGet.setMargin(0.05);
                shapeGet.calculateLocalInertia(mass,localIntertia);

                let rigidBodyInfo=new Ammo.btRigidBodyConstructionInfo(mass,motionState,shapeGet,localIntertia);
                let rBody=new Ammo.btRigidBody(rigidBodyInfo);

                rBody.setActivationState(4);

                this.physicsWorld.addRigidBody(rBody);
                model.userData.physicsBody=rBody;
                rBody.threeObject=model;
                rigidBodies.push(model);
            } else if(physicParam['shapeType']=='convexHall'){
                shapeGet=this._createAmmoShapeFromMesh(model,pos,quat,mass,physicParam,Ammo);
                console.log("convexHall this._createAmmoShapeFromMesh",this._createAmmoShapeFromMesh)
            }
            else if(physicParam['shapeType']=='convexTriangle'){
                console.log("convexTraianglessss this._createAmmoShapeFromMesh2",this._createAmmoShapeFromMesh2)
                shapeGet=this._createAmmoShapeFromMesh2(model,pos,quat,mass,physicParam,Ammo);
            }
            
            console.log("모델에게서 받아낸 shapeGet정보:",shapeGet);
            added_loadmodel['isloaded']=true;
        });
    }
    createGLTF_EnemyBuilding(src,Ammo=this.ammoClone,pos,quat,mass,hp,defense,color,collapseSound){
        let added_loadmodel={};
        added_loadmodel['src']=src;
        added_loadmodel['isloaded']=false;
        this.loadmodels.push(added_loadmodel);

        this.loader=new GLTFLoader()
       // const dracoLoader=new DRACOLoader()
        this.loader.load(src,(gltf)=>{
           const model=gltf.scene.children[0];
           if(pos){
               console.log("원래 모델이 위치공간은?? 오브젝트위치공간은?:",model,pos);
              model.position.set(pos)
           }else{
              console.log("포지션 지정하지 않은경우에 원래 본채 갖고있던 오브젝트위치공간은?: createGLTF_EnemyBuilding",model);
              pos=model.position;
           }
          
           // this.scene.add(gltf.scene)
            console.log("hahahahaha load gltf model info!!!:",gltf,gltf.scene);
            //const geometry=gltf.scene.children[0].geometry;
           // const material=gltf.scene.children[0].material;
            //console.log('히히히히 suz모델 geometry,material:',geometry,material);
            //this.createInstances(geometry,material,Ammo);
            //pos 0 5 0 
           
            let geo_mesh = model;

            //breakup up object into traingales args:maxEdgeLength,maxIterationsss
            console.log("Enemy Destroy explodesss geomesh: ",geo_mesh,geo_mesh.geometry);
            const tessellatemodifer=new TessellateModifier(8,6);
            let geometry=tessellatemodifer.modify(geo_mesh.geometry);
            console.log("tesselemosfifeㄱ가능?:",geometry)
            //buffergeoetry attributess
            const numFaces=geometry.attributes.position.count / 3;

            const colors=new Float32Array(numFaces *3 *3);//color of each facess
            const vel=new Float32Array(numFaces * 3 *3);//veloeicty ofg each facess

            //const color = new THREE.Color();
            for(let f=0; f<numFaces; f++){
                const index= 9*f;//3 pintsss * [x,y,z] per triangless faces  0~8/9~17/18~26/27~35/,.....
                //onst h=0.5+Math.random(0.5); //hues
              // const r=0.2
               //const g=0.2
               //const b=0.2;
               //console.log("randomRgb:",r,g,b);
                //color.setHSL(h,s,l);
                //color.setRGB(r,g,b);//캐릭터별로 색상다르게(지금은 랜덤인데,그 색상폭발물 다르게)캐릭터별로 폭발물의색상형태다르게(형태는 블랜더모델링으로 형태만잡고,재질은 THREEJS에서 색상등만 해서 다르게 하여 진행) / 캐릭터별로 캐릭터볼발사체 BLENDER GLTF로 모양 다르게.gltf모델 클론해서 생성하여 매번 발사하는 형태로!1
                //velocity of points of facess
                let dirX = Math.random()*0.2 -0.1 ;
                let dirY = -0.02;
                let dirZ = Math.random()*0.2 - 0.1;
    
                for(let i=0; i<3; i++){//삼각형 면(총 9개포인트) 0+0,0+1,0+2,0+3,0+4,0+5,0+6,0+7,0+8/ ||  9+0/9+1,9+2,./////
                    //give vertcies of each face a color
                    colors[index + (3 * i)]=color.r;
                    colors[index + (3*i)+1] = color.g;
                    colors[index+ (3*i) + 2] = color.b; //한 루프가 삼각면의 한꼭지점을 의미.꼭지점x,yz좌표별 컬러지정
    
                    //give vertcies of each face a random velociy
                    vel[index+(3*i)]=dirX;
                    vel[index+(3*i)+1]=dirY;
                    vel[index+(3*i)+2]=dirZ;
    
                }
            }//하나의 루프가 한개의 삼각면의미.
    
            geometry.setAttribute("customColor",new THREE.BufferAttribute(colors,3));
            geometry.setAttribute("vel",new THREE.BufferAttribute(vel,3));
            let local_uniforms={
                amplitude: { value: 0.0}
            }
            let fake_uniforms={
                amplitude: { value: 0.0}
            }
            
            const shaderMaterial=new THREE.ShaderMaterial({
                uniforms:local_uniforms,
                vertexShader:vertShader,
                fragmentShader:fragShader,
            });
            const building_mesh=new THREE.Mesh(geometry,shaderMaterial);//여기에 빌딩메시랑 모델 본래모델이랑은 다르다 원래모델을 클론해서 가져온 geometry새정보와 쉐이더정보로 새로 threejs에서 그 해당본래위치공간으로 지정하여 생성한 오브젝트이기에 다른 존재이다.
            building_mesh.castShadow=true;
            building_mesh.receiveShadow=true;
            this.scene.add(building_mesh);
            building_mesh.position.set(pos.x,pos.y,pos.z);

            
            building_mesh.userData.tag='GLTF_EnemyDestroyBuilding';
            building_mesh.userData.ObjectType='GLTF_EnemyDestroyBuilding';
            building_mesh.userData.hp=hp;
            building_mesh.userData.defense=defense;
            building_mesh.userData.collapseSound=collapseSound;
            this.EnemyBuildingMaterials.push({
                'mesh':building_mesh,
                'uniforms':local_uniforms,
                'fake_uniforms':fake_uniforms,
                'create':new Date().getTime()
            });

            let transform=new Ammo.btTransform();
            transform.setIdentity()
            transform.setOrigin(new Ammo.btVector3(pos.x,pos.y,pos.z));
            transform.setRotation(new Ammo.btQuaternion(quat.x,quat.y,quat.z,quat.w));

            let motionState=new Ammo.btDefaultMotionState(transform)

            let localInertia=new Ammo.btVector3(0,0,0);
            console.log("buildilgnsmehsss??:",building_mesh);
            let verticesPos= building_mesh.geometry.getAttribute("position").array;
            let triangles=[];
            for(let i=0; i<verticesPos.length; i+=3){
                triangles.push({
                    x:verticesPos[i],
                    y:verticesPos[i+1],
                    z:verticesPos[i+2]
                })
            }
            let triangle,triangle_mesh=new Ammo.btTriangleMesh();
            let vecA = new Ammo.btVector3(0,0,0);
            let vecB = new Ammo.btVector3(0,0,0);
            let vecC = new Ammo.btVector3(0,0,0);

            for(let i=0; i<triangles.length-3; i+=3){
                vecA.setX(triangles[i].x);
                vecA.setY(triangles[i].y);
                vecA.setZ(triangles[i].z);

                vecB.setX(triangles[i+1].x);
                vecB.setY(triangles[i+1].y);
                vecB.setZ(triangles[i+1].z);

                vecC.setX(triangles[i+2].x);
                vecC.setY(triangles[i+2].y);
                vecC.setZ(triangles[i+2].z);
                triangle_mesh.addTriangle(vecA,vecB,vecC,true);
            }
            Ammo.destroy(vecA);      
            Ammo.destroy(vecB);
            Ammo.destroy(vecC);
            console.log("해당메시 traingleMesh정보!!:",triangle_mesh);

            const shape=new Ammo.btConvexTriangleMeshShape(triangle_mesh,true);
            building_mesh.verticesNeedUpdate=true;
            shape.getMargin(0.05);
            shape.calculateLocalInertia(mass,localInertia);
            console.log("meshgeometry btConvexTriangelMeshShape shape모양정보:",shape);

            let rigidBodyInfo=new Ammo.btRigidBodyConstructionInfo(mass,motionState,shape,localInertia);
            let rBody= new Ammo.btRigidBody(rigidBodyInfo);

            //rBody.setActivationState(physicParam['activationState']?physicParam['activationState']:4);
        // rBody.setFriction(physicParam['Friction']?physicParam['Friction']:0.5);
            //rBody.setRollingFriction(physicParam['RollingFriction']?physicParam['RollingFriction']:0.05);
            //rBody.setRestitution(physicParam['Restituion']?physicParam['Restituion']:0.5);
            rBody.setActivationState(4);

            this.physicsWorld.addRigidBody(rBody);
            building_mesh.userData.physicsBody=rBody;
            rBody.threeObject=building_mesh;
            console.log("rigidBodies thressjs and phiscsBOdy: building_mesh",building_mesh,rBody);
            rigidBodies.push(building_mesh);

            console.log("모델에게서 받아낸 shapeGet정보: building_mesh",shape);

            added_loadmodel['isloaded']=true;
        });
    }
    createGLTF_EnemyBuildinggroup(src,Ammo=this.ammoClone,pos,quat,mass,hp,defense,color,collapseSound){
        this.loader=new GLTFLoader()
       // const dracoLoader=new DRACOLoader()
       let added_loadmodel={};
       added_loadmodel['src']=src;//groupping item srcs...!
       added_loadmodel['isloaded']=false;
       this.loadmodels.push(added_loadmodel);

        this.loader.load(src,(gltf)=>{
            const modelgroups=gltf.scene;
            console.log("enemybuildinggroup mdoel groupsss:",modelgroups);
            for(let g=0; g<modelgroups.children.length; g++){

                let model_groupitem=modelgroups.children[g];

                pos=model_groupitem.position;
                console.log("각모델의 블랜더공간에서이 threejs확장위치: enemybuildingg",pos,model_groupitem);
                model_groupitem.castShadow=true;
                model_groupitem.receiveShadow=true;
                //model_groupitem.userData.tag='GLTF_EnemyDestroyBuilding';
                //model_groupitem.userData.ObjectType='GLTF_EnemyDestroyBuilding';

                let geo_mesh = model_groupitem;

                //breakup up object into traingales args:maxEdgeLength,maxIterationsss
                console.log("Enemy Destroy explodesss geomesh: ",geo_mesh,geo_mesh.geometry);
                const tessellatemodifer=new TessellateModifier(8,6);
                let geometry=tessellatemodifer.modify(geo_mesh.geometry);
                console.log("tesselemosfifeㄱ가능?:",geometry)
                //buffergeoetry attributess
                const numFaces=geometry.attributes.position.count / 3;
    
                const colors=new Float32Array(numFaces *3 *3);//color of each facess
                const vel=new Float32Array(numFaces * 3 *3);//veloeicty ofg each facess
    
                //const color = new THREE.Color();
                for(let f=0; f<numFaces; f++){
                    const index= 9*f;//3 pintsss * [x,y,z] per triangless faces  0~8/9~17/18~26/27~35/,.....
                    //onst h=0.5+Math.random(0.5); //hues
                    // const r=0.2
                    //const g=0.2
                    //const b=0.2;
                    //console.log("randomRgb:",r,g,b);
                    //color.setHSL(h,s,l);
                    //color.setRGB(r,g,b);//캐릭터별로 색상다르게(지금은 랜덤인데,그 색상폭발물 다르게)캐릭터별로 폭발물의색상형태다르게(형태는 블랜더모델링으로 형태만잡고,재질은 THREEJS에서 색상등만 해서 다르게 하여 진행) / 캐릭터별로 캐릭터볼발사체 BLENDER GLTF로 모양 다르게.gltf모델 클론해서 생성하여 매번 발사하는 형태로!1
                    //velocity of points of facess
                    let dirX = Math.random()*0.2 -0.1;
                    let dirY = -0.02;
                    let dirZ = Math.random()*0.2 - 0.1;
        
                    for(let i=0; i<3; i++){//삼각형 면(총 9개포인트) 0+0,0+1,0+2,0+3,0+4,0+5,0+6,0+7,0+8/ ||  9+0/9+1,9+2,./////
                        //give vertcies of each face a color
                        colors[index + (3 * i)]=color.r;
                        colors[index + (3*i)+1] = color.g;
                        colors[index+ (3*i) + 2] = color.b; //한 루프가 삼각면의 한꼭지점을 의미.꼭지점x,yz좌표별 컬러지정
        
                        //give vertcies of each face a random velociy
                        vel[index+(3*i)]=dirX;
                        vel[index+(3*i)+1]=dirY;
                        vel[index+(3*i)+2]=dirZ;
            
                    }//하나의 루프가 한개의 삼각면의미.
                }
                geometry.setAttribute("customColor",new THREE.BufferAttribute(colors,3));
                geometry.setAttribute("vel",new THREE.BufferAttribute(vel,3));
                let local_uniforms={
                    amplitude: { value: 0.0}
                }
                let fake_uniforms={
                    amplitude: { value: 0.0}
                }
                    
                const shaderMaterial=new THREE.ShaderMaterial({
                    uniforms:local_uniforms,
                    vertexShader:vertShader,
                    fragmentShader:fragShader,
                });
                const building_mesh=new THREE.Mesh(geometry,shaderMaterial);//여기에 빌딩메시랑 모델 본래모델이랑은 다르다 원래모델을 클론해서 가져온 geometry새정보와 쉐이더정보로 새로 threejs에서 그 해당본래위치공간으로 지정하여 생성한 오브젝트이기에 다른 존재이다.
                building_mesh.castShadow=true;
                building_mesh.receiveShadow=true;
                this.scene.add(building_mesh);
                console.log("enememynbnjuildgn mesh group added scene:",building_mesh)
                building_mesh.position.set(pos.x,pos.y,pos.z);
    
                
                building_mesh.userData.tag='GLTF_EnemyDestroyBuilding';
                building_mesh.userData.ObjectType='GLTF_EnemyDestroyBuilding';
                building_mesh.userData.hp=hp;
                building_mesh.userData.defense=defense;
                building_mesh.userData.collapseSound=collapseSound;
                this.EnemyBuildingMaterials.push({
                    'mesh':building_mesh,
                    'uniforms':local_uniforms,
                    'fake_uniforms':fake_uniforms,
                    'create':new Date().getTime()
                });
    
                let transform=new Ammo.btTransform();
                transform.setIdentity()
                transform.setOrigin(new Ammo.btVector3(pos.x,pos.y,pos.z));
                transform.setRotation(new Ammo.btQuaternion(quat.x,quat.y,quat.z,quat.w));
    
                let motionState=new Ammo.btDefaultMotionState(transform)
        
                let localInertia=new Ammo.btVector3(0,0,0);
                console.log("buildilgnsmehsss??:",building_mesh);
                let verticesPos= building_mesh.geometry.getAttribute("position").array;
                let triangles=[];
                for(let i=0; i<verticesPos.length; i+=3){
                    triangles.push({
                        x:verticesPos[i],
                        y:verticesPos[i+1],
                        z:verticesPos[i+2]
                    })
                }
                let triangle,triangle_mesh=new Ammo.btTriangleMesh();
                let vecA = new Ammo.btVector3(0,0,0);
                let vecB = new Ammo.btVector3(0,0,0);
                let vecC = new Ammo.btVector3(0,0,0);
    
                for(let i=0; i<triangles.length-3; i+=3){
                    vecA.setX(triangles[i].x);
                    vecA.setY(triangles[i].y);
                    vecA.setZ(triangles[i].z);
    
                    vecB.setX(triangles[i+1].x);
                    vecB.setY(triangles[i+1].y);
                    vecB.setZ(triangles[i+1].z);
    
                    vecC.setX(triangles[i+2].x);
                    vecC.setY(triangles[i+2].y);
                    vecC.setZ(triangles[i+2].z);
                    triangle_mesh.addTriangle(vecA,vecB,vecC,true);
                }
                Ammo.destroy(vecA);      
                Ammo.destroy(vecB);
                Ammo.destroy(vecC);
                console.log("해당메시 traingleMesh정보!!:",triangle_mesh);
    
                const shape=new Ammo.btConvexTriangleMeshShape(triangle_mesh,true);
                building_mesh.verticesNeedUpdate=true;
                shape.getMargin(0.05);
                shape.calculateLocalInertia(mass,localInertia);
                console.log("meshgeometry btConvexTriangelMeshShape shape모양정보:",shape);
    
                let rigidBodyInfo=new Ammo.btRigidBodyConstructionInfo(mass,motionState,shape,localInertia);
                let rBody= new Ammo.btRigidBody(rigidBodyInfo);
    
                //rBody.setActivationState(physicParam['activationState']?physicParam['activationState']:4);
                    // rBody.setFriction(physicParam['Friction']?physicParam['Friction']:0.5);
                //rBody.setRollingFriction(physicParam['RollingFriction']?physicParam['RollingFriction']:0.05);
                //rBody.setRestitution(physicParam['Restituion']?physicParam['Restituion']:0.5);
                rBody.setActivationState(4);
    
                this.physicsWorld.addRigidBody(rBody);
                building_mesh.userData.physicsBody=rBody;
                rBody.threeObject=building_mesh;
                console.log("rigidBodies thressjs and phiscsBOdy: building_mesh",building_mesh,rBody);
                rigidBodies.push(building_mesh);
    
                console.log("모델에게서 받아낸 shapeGet정보: building_mesh",shape);
            }
            added_loadmodel['isloaded']=true;
            
        });
    }
    createGLTFGroup(src,Ammo=this.ammoClone,pos,quat,mass,physicParam,matterialParam){
        let added_loadmodel={};
        added_loadmodel['src']=src;
        added_loadmodel['isloaded']=false;
        this.loadmodels.push(added_loadmodel);

        this.loader=new GLTFLoader()
       // const dracoLoader=new DRACOLoader()
        this.loader.load(src,(gltf)=>{
           const modelgroups=gltf.scene;
           console.log("gltfmodelgroups!!!!!!:",modelgroups);
           for(let g=0; g<modelgroups.children.length; g++){
             let model_groupitem=modelgroups.children[g];

             pos = model_groupitem.position;
            console.log("각 모델 및 matterailParam상태??:",matterialParam);
             console.log("각모델의 블랜더공간에서이 threejs확장위치:",pos);
             model_groupitem.castShadow=true;
             model_groupitem.receiveShadow=true;
             model_groupitem.userData.tag='GLTFMODEL';
             model_groupitem.userData.ObjectType='terrain';

            if(matterialParam){
                let newMaterial=new THREE.MeshLambertMaterial({
                    color:matterialParam['color']?matterialParam['color']:0xefefef,
                    transparent:matterialParam['transparent']?matterialParam['transparent']:false,
                    opacity:matterialParam['opacity']?matterialParam['opacity']:1
                })
                model_groupitem.material=newMaterial;
            }
             let shapeGet;
             if(physicParam['shapeType']=='cubeBox'){
                 let bounding=(new THREE.Box3).setFromObject(model_groupitem);
                 console.log("하하 모델로부터 얻어낸 바운딩박스정보",bounding);
                 let calc_x=bounding.max.x-bounding.min.x;
                 let calc_z=bounding.max.z-bounding.min.z;
                 let calc_y=bounding.max.y-bounding.min.y;
                 console.log("얻어낸 박스 크기",calc_x,calc_z,calc_y)
                 shapeGet=new Ammo.btBoxShape(new Ammo.btVector3(calc_x*0.5,calc_y*0.5,calc_z*0.5));
                 
                 let transform=new Ammo.btTransform();
                 transform.setIdentity()
                 transform.setOrigin(new Ammo.btVector3(pos.x,pos.y,pos.z));
                 transform.setRotation(new Ammo.btQuaternion(quat.x,quat.y,quat.z,quat.w));
 
                 let motionState=new Ammo.btDefaultMotionState(transform);
 
                 let localIntertia=new Ammo.btVector3(0,0,0);
                 shapeGet.setMargin(0.05);
                 shapeGet.calculateLocalInertia(mass,localIntertia);
 
                 let rigidBodyInfo=new Ammo.btRigidBodyConstructionInfo(mass,motionState,shapeGet,localIntertia);
                 let rBody=new Ammo.btRigidBody(rigidBodyInfo);
 
                 rBody.setActivationState(4);
 
                 this.physicsWorld.addRigidBody(rBody);
                 model_groupitem.userData.physicsBody=rBody;
                 rBody.threeObject=model_groupitem;
                 rigidBodies.push(model_groupitem);
             }else if(physicParam['shapeType']=='convexHall'){
                console.log("convexHall this._createAmmoShapeFromMesh",this._createAmmoShapeFromMesh)
                shapeGet=this._createAmmoShapeFromMesh(model_groupitem,pos,quat,mass,physicParam,Ammo);
             }else if(physicParam['shapeType']=='convexTriangle'){
                console.log("convexTriangle this._createAmmoShapeFromMesh2",this._createAmmoShapeFromMesh2)

                shapeGet=this._createAmmoShapeFromMesh2(model_groupitem,pos,quat,mass,physicParam,Ammo);
             }
             console.log("모델에게서 받아낸 shapeGet정보:",shapeGet);
 
           }
           this.scene.add(modelgroups);

           added_loadmodel['isloaded']=true;
        });
    }
    NextPORTAL(src,Ammo=this.ammoClone,pos,quat,mass,physicParam){
        let added_loadmodel={};
        added_loadmodel['src']=src;
        added_loadmodel['isloaded']=false;
        this.loadmodels.push(added_loadmodel);

        this.loader=new GLTFLoader()
       // const dracoLoader=new DRACOLoader()
        this.loader.load(src,(gltf)=>{
           const model=gltf.scene.children[0];
           if(pos){
               console.log("PORTAL 위치공간은?? 오브젝트위치공간은?:",model,pos);
              model.position.set(pos)
           }else{
              console.log("포지션 지정하지 않은경우에 원래 본채 갖고있던 PORTAL위치공간은?:",model);
              pos=model.position;
           }
           model.castShadow=true;
           model.receiveShadow=true;
           model.userData.tag='NextPORTAL';
           model.userData.ObjectType='terrain';

            this.scene.add(gltf.scene)
            console.log("hahahahaha load PORTAL model info!!!:",gltf,gltf.scene);
            //const geometry=gltf.scene.children[0].geometry;
           // const material=gltf.scene.children[0].material;
            //console.log('히히히히 suz모델 geometry,material:',geometry,material);
            //this.createInstances(geometry,material,Ammo);
            //pos 0 5 0 
            let shapeGet;

            this.nextfortal=model;
            if(physicParam['shapeType']==='cubeBox'){
                let bounding=(new THREE.Box3).setFromObject(model);
                console.log("하하 모델로부터 얻어낸 바운딩박스정보",bounding);
                let calc_x=bounding.max.x-bounding.min.x;
                let calc_z=bounding.max.z-bounding.min.z;
                let calc_y=bounding.max.y-bounding.min.y;
                console.log("얻어낸 박스 크기",calc_x,calc_z,calc_y)
                shapeGet=new Ammo.btBoxShape(new Ammo.btVector3(calc_x*0.5,calc_y*0.5,calc_z*0.5));
                
                let transform=new Ammo.btTransform();
                transform.setIdentity()
                transform.setOrigin(new Ammo.btVector3(pos.x,pos.y,pos.z));
                transform.setRotation(new Ammo.btQuaternion(quat.x,quat.y,quat.z,quat.w));

                let motionState=new Ammo.btDefaultMotionState(transform);

                let localIntertia=new Ammo.btVector3(0,0,0);
                shapeGet.setMargin(0.05);
                shapeGet.calculateLocalInertia(mass,localIntertia);

                let rigidBodyInfo=new Ammo.btRigidBodyConstructionInfo(mass,motionState,shapeGet,localIntertia);
                let rBody=new Ammo.btRigidBody(rigidBodyInfo);

                rBody.setActivationState(4);

                this.physicsWorld.addRigidBody(rBody);
                model.userData.physicsBody=rBody;
                rBody.threeObject=model;
                rigidBodies.push(model);

            } else if(physicParam['shapeType']=='convexHall'){
                shapeGet=this._createAmmoShapeFromMesh(model,pos,quat,mass,physicParam,Ammo);
                console.log("convexHall this._createAmmoShapeFromMesh",this._createAmmoShapeFromMesh)
            }
            else if(physicParam['shapeType']=='convexTriangle'){
                console.log("convexTraianglessss this._createAmmoShapeFromMesh2",this._createAmmoShapeFromMesh2)
                shapeGet=this._createAmmoShapeFromMesh2(model,pos,quat,mass,physicParam,Ammo);
            }
            
            console.log("모델에게서 받아낸 shapeGet정보:",shapeGet);

            added_loadmodel['isloaded']=true;
        });
    }
    NextPORTAL2(src,Ammo=this.ammoClone,pos,quat,mass,physicParam){
        let added_loadmodel={};
        added_loadmodel['src']=src;
        added_loadmodel['isloaded']=false;
        this.loadmodels.push(added_loadmodel);

        this.loader=new GLTFLoader()
       // const dracoLoader=new DRACOLoader()
        this.loader.load(src,(gltf)=>{
           const model=gltf.scene.children[0];
           if(pos){
               console.log("PORTAL 위치공간은?? 오브젝트위치공간은?:",model,pos);
              model.position.set(pos)
           }else{
              console.log("포지션 지정하지 않은경우에 원래 본채 갖고있던 PORTAL위치공간은?:",model);
              pos=model.position;
           }
           model.castShadow=true;
           model.receiveShadow=true;
           model.userData.tag='NextPORTAL2';
           model.userData.ObjectType='terrain';

            this.scene.add(gltf.scene)
            console.log("hahahahaha load PORTAL model info!!!:",gltf,gltf.scene);
            //const geometry=gltf.scene.children[0].geometry;
           // const material=gltf.scene.children[0].material;
            //console.log('히히히히 suz모델 geometry,material:',geometry,material);
            //this.createInstances(geometry,material,Ammo);
            //pos 0 5 0 
            let shapeGet;

            this.nextfortal2=model;
            if(physicParam['shapeType']==='cubeBox'){
                let bounding=(new THREE.Box3).setFromObject(model);
                console.log("하하 모델로부터 얻어낸 바운딩박스정보",bounding);
                let calc_x=bounding.max.x-bounding.min.x;
                let calc_z=bounding.max.z-bounding.min.z;
                let calc_y=bounding.max.y-bounding.min.y;
                console.log("얻어낸 박스 크기",calc_x,calc_z,calc_y)
                shapeGet=new Ammo.btBoxShape(new Ammo.btVector3(calc_x*0.5,calc_y*0.5,calc_z*0.5));
                
                let transform=new Ammo.btTransform();
                transform.setIdentity()
                transform.setOrigin(new Ammo.btVector3(pos.x,pos.y,pos.z));
                transform.setRotation(new Ammo.btQuaternion(quat.x,quat.y,quat.z,quat.w));

                let motionState=new Ammo.btDefaultMotionState(transform);

                let localIntertia=new Ammo.btVector3(0,0,0);
                shapeGet.setMargin(0.05);
                shapeGet.calculateLocalInertia(mass,localIntertia);

                let rigidBodyInfo=new Ammo.btRigidBodyConstructionInfo(mass,motionState,shapeGet,localIntertia);
                let rBody=new Ammo.btRigidBody(rigidBodyInfo);

                rBody.setActivationState(4);

                this.physicsWorld.addRigidBody(rBody);
                model.userData.physicsBody=rBody;
                rBody.threeObject=model;
                rigidBodies.push(model);

            } else if(physicParam['shapeType']=='convexHall'){
                shapeGet=this._createAmmoShapeFromMesh(model,pos,quat,mass,physicParam,Ammo);
                console.log("convexHall this._createAmmoShapeFromMesh",this._createAmmoShapeFromMesh)
            }
            else if(physicParam['shapeType']=='convexTriangle'){
                console.log("convexTraianglessss this._createAmmoShapeFromMesh2",this._createAmmoShapeFromMesh2)
                shapeGet=this._createAmmoShapeFromMesh2(model,pos,quat,mass,physicParam,Ammo);
            }
            
            console.log("모델에게서 받아낸 shapeGet정보:",shapeGet);

            added_loadmodel['isloaded']=true;
        });
    }
    StartPORTAL(src,Ammo=this.ammoClone,pos,quat,mass,physicParam){
        let added_loadmodel={};
        added_loadmodel['src']=src;
        added_loadmodel['isloaded']=false;
        this.loadmodels.push(added_loadmodel);

        this.loader=new GLTFLoader()
       // const dracoLoader=new DRACOLoader()
        this.loader.load(src,(gltf)=>{
           const model=gltf.scene.children[0];
           if(pos){
               console.log("PORTAL 위치공간은?? 오브젝트위치공간은?:",model,pos);
              model.position.set(pos)
           }else{
              console.log("포지션 지정하지 않은경우에 원래 본채 갖고있던 PORTAL위치공간은?:",model);
              pos=model.position;
           }
           model.castShadow=true;
           model.receiveShadow=true;
           model.userData.tag='StartPORTAL';
           model.userData.ObjectType='terrain';

            this.scene.add(gltf.scene)
            console.log("hahahahaha load PORTAL model info!!!:",gltf,gltf.scene);
            //const geometry=gltf.scene.children[0].geometry;
           // const material=gltf.scene.children[0].material;
            //console.log('히히히히 suz모델 geometry,material:',geometry,material);
            //this.createInstances(geometry,material,Ammo);
            //pos 0 5 0 
            let shapeGet;

            this.startfortal=model;
            if(physicParam['shapeType']==='cubeBox'){
                let bounding=(new THREE.Box3).setFromObject(model);
                console.log("하하 모델로부터 얻어낸 바운딩박스정보",bounding);
                let calc_x=bounding.max.x-bounding.min.x;
                let calc_z=bounding.max.z-bounding.min.z;
                let calc_y=bounding.max.y-bounding.min.y;
                console.log("얻어낸 박스 크기",calc_x,calc_z,calc_y)
                shapeGet=new Ammo.btBoxShape(new Ammo.btVector3(calc_x*0.5,calc_y*0.5,calc_z*0.5));
                
                let transform=new Ammo.btTransform();
                transform.setIdentity()
                transform.setOrigin(new Ammo.btVector3(pos.x,pos.y,pos.z));
                transform.setRotation(new Ammo.btQuaternion(quat.x,quat.y,quat.z,quat.w));

                let motionState=new Ammo.btDefaultMotionState(transform);

                let localIntertia=new Ammo.btVector3(0,0,0);
                shapeGet.setMargin(0.05);
                shapeGet.calculateLocalInertia(mass,localIntertia);

                let rigidBodyInfo=new Ammo.btRigidBodyConstructionInfo(mass,motionState,shapeGet,localIntertia);
                let rBody=new Ammo.btRigidBody(rigidBodyInfo);

                rBody.setActivationState(4);

                this.physicsWorld.addRigidBody(rBody);
                model.userData.physicsBody=rBody;
                rBody.threeObject=model;
                rigidBodies.push(model);

            } else if(physicParam['shapeType']=='convexHall'){
                shapeGet=this._createAmmoShapeFromMesh(model,pos,quat,mass,physicParam,Ammo);
                console.log("convexHall this._createAmmoShapeFromMesh",this._createAmmoShapeFromMesh)
            }
            else if(physicParam['shapeType']=='convexTriangle'){
                console.log("convexTraianglessss this._createAmmoShapeFromMesh2",this._createAmmoShapeFromMesh2)
                shapeGet=this._createAmmoShapeFromMesh2(model,pos,quat,mass,physicParam,Ammo);
            }
            
            console.log("모델에게서 받아낸 shapeGet정보:",shapeGet);

            added_loadmodel['isloaded']=true;
        });
    }
    createModel(Ammo=this.ammoClone,pos,quat,mass,physicParam,hp=600,defense=40,speed=1,power=1,weaponpower,explodepower,rasierpower,transformpower,weaponpowerflag,rasierpowerflag,recoverpower){
        let added_loadmodel={};
        added_loadmodel['src']=this.characterSrc;
        added_loadmodel['isloaded']=false;
        this.loadmodels.push(added_loadmodel);

        this.loader=new GLTFLoader()
        this.loader.load(this.characterSrc,(gltf)=>{
            const character1=gltf.scene.children[0];
            this.scene.add(gltf.scene);
            console.log("hahahahaha load gltf characdtermodel info!!!: charactermodel load poss!!!!",gltf,gltf.scene);
            character1.position.set(pos.x,pos.y,pos.z);
            //const character1_pure_body=character1.children[0];//charactderbody
            //let weapon;
            character1.traverse(child=>{
                //console.log("character1 glb traverse탐방scene:",child);
                if(child instanceof THREE.Mesh){
                   // console.log("mesh type들!!:",child);
                    child.castShadow=true;
                    child.receiveShadow=true;
                    child.userData.ObjectType='characterbodys';

                    child.frustumCulled=false;
                }
            })
            const characterbox=(new THREE.Box3).setFromObject(character1);
            const characterboxHelper=new THREE.BoxHelper(character1);
            this.scene.add(characterboxHelper);
            characterboxHelper.userData.ObjectType='boxHelper';
            this.characterboxhelper=characterboxHelper;
            character1.userData.tag='character';
            character1.userData.hp=hp?hp:600;
            character1.userData.status='live';
            character1.userData.defense=defense;
            character1.userData.speed=speed;//점프스피드
            character1.userData.power=power;
            character1.userData.weaponpower=weaponpower;
            character1.userData.explodepower=explodepower;
            character1.userData.rasierpower=rasierpower;
            character1.userData.transformpower=transformpower;
            character1.userData.mass=mass;
            character1.userData.weaponpowerflag=weaponpowerflag;
            character1.userData.rasierpowerflag=rasierpowerflag;
            character1.userData.recoverpower=recoverpower;


            //character가상 borderbox에 피직스바디active적용
            let calc_x=characterbox.max.x - characterbox.min.x;
            let calc_y=characterbox.max.y - characterbox.min.y;
            let calc_z=characterbox.max.z - characterbox.min.z;
            let maxsize=Math.max(calc_x,calc_y,calc_z);
            console.log("계산된 캐릭터박스크기:",calc_x,calc_y,calc_z,maxsize);

            //phyiscss in ammojs
            let pshape=new Ammo.btBoxShape(new Ammo.btVector3(maxsize*0.5,maxsize*0.5,maxsize*0.5));
            
            let transform=new Ammo.btTransform();
            transform.setIdentity()
            transform.setOrigin(new Ammo.btVector3(pos.x,pos.y,pos.z));
            transform.setRotation(new Ammo.btQuaternion(quat.x,quat.y,quat.z,quat.w));

            let motionState=new Ammo.btDefaultMotionState(transform);

            let localIntertia=new Ammo.btVector3(0,0,0);
            pshape.setMargin(0.05);
            pshape.calculateLocalInertia(mass,localIntertia);

            let rigidBodyInfo=new Ammo.btRigidBodyConstructionInfo(mass,motionState,pshape,localIntertia);
            let rBody=new Ammo.btRigidBody(rigidBodyInfo);

            rBody.setActivationState(4);
            rBody.threeObject=character1;

            this.physicsWorld.addRigidBody(rBody);
            character1.userData.physicsBody=rBody;
            this.character1=character1;
            rigidBodies.push(character1);

    
            //animationss
            const animationClips= gltf.animations;
            const mixer=new THREE.AnimationMixer(character1);
            const animationsMap={};
            animationClips.forEach(clip=>{
                const name=clip.name;
                animationsMap[name]=mixer.clipAction(clip);
            });
            console.log('this animationsCLipsss:',animationsMap);
            this._mixer=mixer;
            this._animationMap=animationsMap;
            this._currentAnimationAction=animationsMap['idle'];
            this._currentAnimationAction.play();

            added_loadmodel['isloaded']=true;
        })
        this.loader.load(this.characterballExplodeSrc,(gltf)=>{
            const chracterballMesh=gltf.scene.children[0];
           // this.scene.add(gltf.scene);
            console.log("캐릭터볼 익스플루전?:",chracterballMesh);

            this.characterballMeshTest=chracterballMesh;
        })
        this.loader.load(this.characterballSrc,(gltf)=>{
            const chracterballMesh=gltf.scene.children[0];
            //chracterballMesh.rotation.y=180
            this.scene.add(gltf.scene);
            console.log("캐릭터볼 매시?:",chracterballMesh);

           // let emissivecolor=new THREE.Color();//캐릭터마다 레이저색상다르게 하듯이 적용emsisivecolor도 다르게한다.
            //emissivecolor.setRGB(1,0.9,0);
    
            //chracterballMesh.material['emissive']=emissivecolor
            //chracterballMesh.material['emissiveIntensity']=0.1

            this.characterballMesh=chracterballMesh;
        })
        this.loader.load(this.characterTransformSrc,(gltf)=>{
            const charactertransform=gltf.scene.children[0];
            this.scene.add(gltf.scene);
            console.log("hahahahaha load gltf character1_transform2 info!!!:",gltf,gltf.scene);
            charactertransform.position.set(150,30,30);
            //const character1_pure_body=character1.children[0];//charactderbody
            //let weapon;
            charactertransform.traverse(child=>{
                //console.log("charactertransform glb traverse탐방scene:",child);
                if(child instanceof THREE.Mesh){
                    console.log("mesh type들!!:",child);
                    child.castShadow=true;
                    child.receiveShadow=true;
                    child.userData.ObjectType='characterbodys'

                    child.frustumCulled=false;
                }
            })
            const characterbox=(new THREE.Box3).setFromObject(charactertransform);
            const characterboxHelper=new THREE.BoxHelper(charactertransform);
            this.scene.add(characterboxHelper);
            this.charactertransformboxhelper=characterboxHelper;
            charactertransform.userData.tag='charactertransform';
            charactertransform.userData.ObjectType='charactertransform';
            //character1.userData.hp=600;
           // character1.userData.status='live';
            //character가상 borderbox에 피직스바디active적용
            let calc_x=characterbox.max.x - characterbox.min.x;
            let calc_y=characterbox.max.y - characterbox.min.y;
            let calc_z=characterbox.max.z - characterbox.min.z;
            let maxsize=Math.max(calc_x,calc_y,calc_z);
            console.log("계산된 캐릭터박스크기:",calc_x,calc_y,calc_z);

            //phyiscss in ammojs
            let pshape=new Ammo.btBoxShape(new Ammo.btVector3(maxsize*0.5,maxsize*0.5,maxsize*0.5));
            
            let transform=new Ammo.btTransform();
            transform.setIdentity()
            transform.setOrigin(new Ammo.btVector3(pos.x,pos.y,pos.z));
            transform.setRotation(new Ammo.btQuaternion(quat.x,quat.y,quat.z,quat.w));

            let motionState=new Ammo.btDefaultMotionState(transform);

            let localIntertia=new Ammo.btVector3(0,0,0);
            pshape.setMargin(0.05);
            pshape.calculateLocalInertia(mass/4,localIntertia);

            let rigidBodyInfo=new Ammo.btRigidBodyConstructionInfo(mass/4,motionState,pshape,localIntertia);
            let rBody=new Ammo.btRigidBody(rigidBodyInfo);

            rBody.setActivationState(4);
            rBody.threeObject=charactertransform;

            this.physicsWorld.addRigidBody(rBody);
            charactertransform.userData.physicsBody=rBody;
            this.charactertransform=charactertransform;
            rigidBodies.push(charactertransform);

    
            //animationss
            const animationClips= gltf.animations;
            const mixer=new THREE.AnimationMixer(charactertransform);
            const animationsMap={};
            animationClips.forEach(clip=>{
                const name=clip.name;
                animationsMap[name]=mixer.clipAction(clip);
            });
            console.log('this animationsCLipsss:',animationsMap);
            this.charactertransform_mixer=mixer;
            this.charactertransform_mixer_animationMap=animationsMap;
            this.charactertransform_mixer_currentAnimationAction=animationsMap['idle'];
            this.charactertransform_mixer_currentAnimationAction.play();
        })
    }
    createFriendGroup(Ammo){
        console.log("hhaaaa=a=a===createFriend sGourp한번실행으로 creatFriends여러번 실행!!",this.characterindex,Ammo);

        let character_database=[
            {
                'name':'핑키',
                'index':1,
                'src':'https://sinjaesung.github.io/3DASSET/character1/character1DanceRestFire3-3.glb'
            },
            {
                'name':'윈디',
                'index':2,
                'src':'https://sinjaesung.github.io/3DASSET/character2/character2danceRest9.glb'
            },
            {
                'name':'푸키',
                'index':3,
                'src':'https://sinjaesung.github.io/3DASSET/character3/character3DanceRest3.glb'
            },
            {
                'name':'린린',
                'index':4,
                'src':'https://sinjaesung.github.io/3DASSET/character4/character4DanceRest3-1.glb'
            },
            {
                'name':'카이',
                'index':5,
                'src':'https://sinjaesung.github.io/3DASSET/character5/character5DanceRest2.glb'
            },
            {
                'name':'로이드',
                'index':6,
                'src':'https://sinjaesung.github.io/3DASSET/character6/character6DanceRest5.glb'
            },
            {
                'name':'레이',
                'index':7,
                'src':'https://sinjaesung.github.io/3DASSET/character7/character7DanceRest2.glb'
            },
            {
                'name':'미미',
                'index':8,
                'src':'https://sinjaesung.github.io/3DASSET/character8/character8DanceRest.glb'
            },
            {
                'name':'스미스',
                'index':9,
                'src':'https://sinjaesung.github.io/3DASSET/character0another/character0Human2.glb'
            }
        ]
        for(let c=0; c<character_database.length; c++){
            let character_item=character_database[c];
            if(character_item['index']!=this.characterindex){
                console.log("선택된 캐릭터가 아닌것들에대해서만 craetFriends실행")
                let charactersrc=character_item['src'];
                let characterindex=character_item['index'];

                this.createFriends(Ammo,{x:this.loadposx,y:this.loadposy,z:this.loadposz},{x:0,y:0,z:0,w:1},3,{
                    'activationState':4,
                    'Firection':1,
                    'RollingFriction':0.05,
                    'Restitution':1
                },charactersrc,characterindex);
            }else{
                console.log("해당 아이템은 현재 선택된 캐릭터로써 미처리:",character_item);

            }
        }
    }
    createFriends(Ammo=this.ammoClone,pos,quat,mass,physicParam,characterSrc,characterindex){
        let added_loadmodel={};
        added_loadmodel['src']=characterSrc;
        added_loadmodel['isloaded']=false;
        this.loadmodels.push(added_loadmodel);

        this.loader=new GLTFLoader()
        this.loader.load(characterSrc,(gltf)=>{
            const character=gltf.scene.children[0];
            this.scene.add(gltf.scene);
            //console.log("hahahahaha craeteFriedns character modelsss",characterindex,gltf,gltf.scene);
            character.position.set(pos.x,pos.y,pos.z);
            //const character1_pure_body=character1.children[0];//charactderbody
            //let weapon;
            character.traverse(child=>{
                //console.log("character1 glb traverse탐방scene:",child);
                if(child instanceof THREE.Mesh){
                   // console.log("mesh type들!!:",child);
                    child.castShadow=true;
                    child.receiveShadow=true;
                    child.userData.ObjectType='characterbodys';

                    child.frustumCulled=false;
                }
            })
            const characterbox=(new THREE.Box3).setFromObject(character);
            const characterboxHelper=new THREE.BoxHelper(character);
            this.scene.add(characterboxHelper);
            characterboxHelper.userData.ObjectType='boxHelper';
            //this.characterboxhelper=characterboxHelper;
            character.userData.tag='friends';
            character.userData.characterindex=characterindex;

            /*character.userData.hp=hp?hp:600;
            character.userData.status='live';
            character.userData.defense=defense;
            character.userData.speed=speed;//점프스피드
            character.userData.power=power;
            character.userData.weaponpower=weaponpower;
            character.userData.explodepower=explodepower;
            character.userData.rasierpower=rasierpower;
            character.userData.transformpower=transformpower;
            character.userData.mass=mass;
            character.userData.weaponpowerflag=weaponpowerflag;
            character.userData.rasierpowerflag=rasierpowerflag;*/


            //character가상 borderbox에 피직스바디active적용
            let calc_x=characterbox.max.x - characterbox.min.x;
            let calc_y=characterbox.max.y - characterbox.min.y;
            let calc_z=characterbox.max.z - characterbox.min.z;
            let maxsize=Math.max(calc_x,calc_y,calc_z);
            //console.log("계산된 캐릭터박스크기(friends캐릭터별):",calc_x,calc_y,calc_z,maxsize);

            //phyiscss in ammojs
            let pshape=new Ammo.btBoxShape(new Ammo.btVector3(maxsize*0.5,maxsize*0.5,maxsize*0.5));
            
            let transform=new Ammo.btTransform();
            transform.setIdentity()
            transform.setOrigin(new Ammo.btVector3(pos.x,pos.y,pos.z));
            transform.setRotation(new Ammo.btQuaternion(quat.x,quat.y,quat.z,quat.w));

            let motionState=new Ammo.btDefaultMotionState(transform);

            let localIntertia=new Ammo.btVector3(0,0,0);
            pshape.setMargin(0.05);
            pshape.calculateLocalInertia(mass,localIntertia);

            let rigidBodyInfo=new Ammo.btRigidBodyConstructionInfo(mass,motionState,pshape,localIntertia);
            let rBody=new Ammo.btRigidBody(rigidBodyInfo);

            rBody.setActivationState(4);
            rBody.threeObject=character;

            this.physicsWorld.addRigidBody(rBody);
            character.userData.physicsBody=rBody;
            rigidBodies.push(character);

    
            //animationss
            const animationClips= gltf.animations;
            const mixer=new THREE.AnimationMixer(character);
            const animationsMap={};
            animationClips.forEach(clip=>{
                const name=clip.name;
                animationsMap[name]=mixer.clipAction(clip);
            });
          //  console.log('this animationsCLipsss:',animationsMap);
            //this._mixer=mixer;
            //this._animationMap=animationsMap;
            //this._currentAnimationAction=animationsMap['idle'];
            //this._currentAnimationAction.play();
            let currentAnimAction=animationsMap['idle'];
            let animData={
                
                'currentAnimAction':currentAnimAction,
                'mixer':mixer,
                'src':characterSrc,
                'boxhelper':characterboxHelper,
                'index':characterindex,
                'characterobject':character,
                'animMap':animationsMap
            };
            this.friendsAnimData.push(animData);
            currentAnimAction.play();

            added_loadmodel['isloaded']=true;
        })
    }
    createWeapon(Ammo=this.ammoClone,pos,quat,mass,physicParam){
        let added_loadmodel={};
        added_loadmodel['src']=this.weaponSrc;
        added_loadmodel['isloaded']=false;
        this.loadmodels.push(added_loadmodel);

        this.loader=new GLTFLoader()
        this.loader.load(this.weaponSrc,(gltf)=>{
            const weapon=gltf.scene;
            this.scene.add(weapon);
            console.log("hahahahaha load gltf weapon info!!!:",gltf,gltf.scene);
            weapon.position.set(pos.x,pos.y,pos.z);
           // weapon.scale.set(3,3,3);
            //const character1_pure_body=character1.children[0];//charactderbody
            //let weapon;
        
            console.log("weaponss??:",weapon);
            //let calc_x=weaponGeometry.max.x- weaponGeometry.min.x;
            //let calc_y=weaponGeometry.max.y- weaponGeometry.min.y;
            //let calc_z=weaponGeometry.max.z- weaponGeometry.min.z;

            const weaponbox=(new THREE.Box3).setFromObject(weapon);
            const weaponboxHelper=new THREE.BoxHelper(weapon);
            this.scene.add(weaponboxHelper);
            this.weaponboxhelper=weaponboxHelper;
            weapon.userData.tag='characterweapon';
            weapon.userData.ObjectType='characterweapon'
            //character가상 borderbox에 피직스바디active적용
            let calc_x=weaponbox.max.x - weaponbox.min.x;
            let calc_y=weaponbox.max.y - weaponbox.min.y;
            let calc_z=weaponbox.max.z - weaponbox.min.z;

            console.log("계산된 웨폰박스크기:",calc_x,calc_y,calc_z);

           // let threeObject=new THREE.Mesh(new THREE.BoxGeometry(calc_x,calc_y,calc_z,1,1,1),new THREE.MeshPhongMaterial({color:0xffff00}));
           // phyiscss in ammojs
            let pshape=new Ammo.btBoxShape(new Ammo.btVector3(calc_x*0.5,calc_y*3,calc_z*0.5));
            
            let transform=new Ammo.btTransform();
            transform.setIdentity()
            transform.setOrigin(new Ammo.btVector3(pos.x,pos.y,pos.z));
            transform.setRotation(new Ammo.btQuaternion(quat.x,quat.y,quat.z,quat.w));

            let motionState=new Ammo.btDefaultMotionState(transform);

            let localIntertia=new Ammo.btVector3(0,0,0);
            pshape.setMargin(0.05);
            pshape.calculateLocalInertia(mass,localIntertia);

            let rigidBodyInfo=new Ammo.btRigidBodyConstructionInfo(mass,motionState,pshape,localIntertia);
            let rBody=new Ammo.btRigidBody(rigidBodyInfo);

            rBody.setActivationState(4);
            rBody.threeObject=weapon;

            this.physicsWorld.addRigidBody(rBody);
            weapon.userData.physicsBody=rBody;
            this.weapon=weapon;
            rigidBodies.push(weapon);

            added_loadmodel['isloaded']=true;
        })
    }
    _createAmmoShapeFromMesh2(mesh,pos,quat,mass,physicParam,Ammo=this.ammoClone) {    
        console.log("####careateAmmoShpaeFromMesh2??####:",mesh,pos,quat,mass,Ammo,physicParam);
        let transform=new Ammo.btTransform();
        transform.setIdentity()
        transform.setOrigin(new Ammo.btVector3(pos.x,pos.y,pos.z));
        transform.setRotation(new Ammo.btQuaternion(quat.x,quat.y,quat.z,quat.w));

        let motionState=new Ammo.btDefaultMotionState(transform)

        let localInertia=new Ammo.btVector3(0,0,0);

        let verticesPos= mesh.geometry.getAttribute("position").array;
        let triangles=[];
        for(let i=0; i<verticesPos.length; i+=3){
            triangles.push({
                x:verticesPos[i],
                y:verticesPos[i+1],
                z:verticesPos[i+2]
            })
        }
        let triangle,triangle_mesh=new Ammo.btTriangleMesh();
        let vecA = new Ammo.btVector3(0,0,0);
        let vecB = new Ammo.btVector3(0,0,0);
        let vecC = new Ammo.btVector3(0,0,0);

        for(let i=0; i<triangles.length-3; i+=3){
            vecA.setX(triangles[i].x);
            vecA.setY(triangles[i].y);
            vecA.setZ(triangles[i].z);

            vecB.setX(triangles[i+1].x);
            vecB.setY(triangles[i+1].y);
            vecB.setZ(triangles[i+1].z);

            vecC.setX(triangles[i+2].x);
            vecC.setY(triangles[i+2].y);
            vecC.setZ(triangles[i+2].z);
            triangle_mesh.addTriangle(vecA,vecB,vecC,true);
        }
        Ammo.destroy(vecA);      
        Ammo.destroy(vecB);
        Ammo.destroy(vecC);
        console.log("해당메시 traingleMesh정보!!:",triangle_mesh);

        const shape=new Ammo.btConvexTriangleMeshShape(triangle_mesh,true);
        mesh.geometry.verticesNeedUpdate=true;
        shape.getMargin(0.05);
        shape.calculateLocalInertia(mass,localInertia);
        console.log("meshgeometry btConvexTriangelMeshShape shape모양정보:",shape);

        let rigidBodyInfo=new Ammo.btRigidBodyConstructionInfo(mass,motionState,shape,localInertia);
        let rBody= new Ammo.btRigidBody(rigidBodyInfo);

        //rBody.setActivationState(physicParam['activationState']?physicParam['activationState']:4);
       // rBody.setFriction(physicParam['Friction']?physicParam['Friction']:0.5);
        //rBody.setRollingFriction(physicParam['RollingFriction']?physicParam['RollingFriction']:0.05);
        //rBody.setRestitution(physicParam['Restituion']?physicParam['Restituion']:0.5);
        rBody.setActivationState(4);

        this.physicsWorld.addRigidBody(rBody);
        mesh.userData.physicsBody=rBody;
        rBody.threeObject=mesh;
        console.log("rigidBodies thressjs and phiscsBOdy:",mesh,rBody);
        rigidBodies.push(mesh);

        return shape;
    }
    
    _createAmmoShapeFromMesh(mesh,pos,quat,mass,physicParam,Ammo=this.ammoClone) {    
        console.log("####_createAmmoShapeFromMesh??####:",mesh,pos,quat,mass,Ammo,physicParam);

        let transform=new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(pos.x,pos.y,pos.z));
        transform.setRotation(new Ammo.btQuaternion(quat.x,quat.y,quat.z,quat.w));

        let motionState=new Ammo.btDefaultMotionState(transform);

        let localInertia=new Ammo.btVector3(0,0,0);

        // new ammo vectors
        const vectA = new Ammo.btVector3(0,0,0);
        const vectB = new Ammo.btVector3(0,0,0);
        const vectC = new Ammo.btVector3(0,0,0);
        
        // new empty ammo shape
        const shape = new Ammo.btConvexHullShape();
        
        mesh.traverse(child => {
            if(child.isMesh) {
               // console.log("childMesh:",child);
                // retrieve vertices positions from object
                const verticesPos = child.geometry.getAttribute("position").array;
               // console.log("veitcesPosss=>",verticesPos)
                const triangles = [];
                for (let i = 0; i < verticesPos.length; i += 3) {//0,1,2|3,4,5|6,7,8|9,10,11,....
                    triangles.push({ x:verticesPos[i], y:verticesPos[i+1], z:verticesPos[i+2] })
                }
                //console.log("related triangelsss:",triangles);
                // use triangles data to draw ammo shape
                for (let i = 0; i < triangles.length-3; i += 3) {//0,1,2|3,4,5|6,7,8|,....
                    vectA.setX(triangles[i].x);
                    vectA.setY(triangles[i].y);
                    vectA.setZ(triangles[i].z);
                    shape.addPoint(vectA, true);

                    vectB.setX(triangles[i+1].x);
                    vectB.setY(triangles[i+1].y);
                    vectB.setZ(triangles[i+1].z);
                    shape.addPoint(vectB, true);

                    vectC.setX(triangles[i+2].x);
                    vectC.setY(triangles[i+2].y);
                    vectC.setZ(triangles[i+2].z);
                    shape.addPoint(vectC, true);
                }                
            }
        });

        Ammo.destroy(vectA);
        Ammo.destroy(vectB);
        Ammo.destroy(vectC);

        console.log("해당메시 convexHallShpamemesh정보",shape);

        shape.getMargin(0.05);
        shape.calculateLocalInertia(mass,localInertia);

        let rigidBodyInfo=new Ammo.btRigidBodyConstructionInfo(mass,motionState,shape,localInertia);
        let rBody=new Ammo.btRigidBody(rigidBodyInfo);

       // rBody.setActivationState(4);

       this.physicsWorld.addRigidBody(rBody);
       mesh.userData.physicsBody=rBody;
       rBody.threeObject=mesh;
       console.log("rigibidBOifdes threejss and prhsiysBOdyss:",mesh,rBody);
       rigidBodies.push(mesh);

        return shape;
    }
}

window.onload = function () {
    new App();
}