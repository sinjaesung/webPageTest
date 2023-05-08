import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from './three.js-master/examples/jsm/loaders/GLTFLoader.js';
import rigidBodies from './physics/RigidBodies.js';

class AnotherCharacterGLTF{
    mesh=null;
    pbody=null;
    
    constructor(characterbox,mesh,mesh_pureSkin,pos,Ammo=this.ammoClone,physicsWorld,hp,power,type,speed,mass,name,SKILLmesh,defense,quataddon,diedSound){

        let quat={x:0,y:0,z:0,w:1};
        if(quataddon){
            quat=quataddon;
        }
        let masss=mass;
        //console.log('AnotherCharacterGLTF mesh and pureSkin',mesh,mesh_pureSkin,characterbox);

        let characterObject,character;

        character=characterObject=mesh;//object3d (bone,skinmehses모두포함) emshpureskin skinmehsess

        mesh.position.set(pos.x,pos.y,pos.z);

        //mesh.castShadow=true;
        //mesh.receiveShadow=true;
        mesh.userData.tag=type?type:'anothercharacter';
        mesh.userData.hp=hp;
        mesh.userData.power=power;
        mesh.userData.type=type;
        mesh.userData.speed=speed;
        mesh.userData.name=name;
        mesh.userData.mass=mass;
        mesh.userData.defense=defense?defense:0;
        mesh.userData.ballChildMeshmodel=SKILLmesh;
        mesh.userData.diedSound=diedSound;

        //mesh.userData.is_air_limit=is_air_limit;
        //mesh.userData.attackSound=attackSound;

        //ammosjs sections
        let transform=new Ammo.btTransform();
        transform.setIdentity()
        transform.setOrigin(new Ammo.btVector3(pos.x,pos.y,pos.z));
        transform.setRotation(new Ammo.btQuaternion(quat.x,quat.y,quat.z,quat.w));

        let motionState=new Ammo.btDefaultMotionState(transform)

        let localInertia = new Ammo.btVector3( 0, 0, 0 );
        let calc_x=characterbox.max.x - characterbox.min.x
        let calc_y=characterbox.max.y - characterbox.min.y
        let calc_z=characterbox.max.z - characterbox.min.z;
        let max_size=Math.max(calc_x,calc_y,calc_z);
        //console.log("계산된 characterbox크기:",calc_x,calc_y,calc_z,max_size);

        const colshape=new Ammo.btBoxShape(new Ammo.btVector3(max_size*0.5,max_size*0.5,max_size*0.5));
        colshape.getMargin(0.05);
        colshape.calculateLocalInertia(masss,localInertia);
        //console.log("meshgeometry btBoxShape shape모양정보:monstergltf",colshape);
        let rigidBodyInfo=new Ammo.btRigidBodyConstructionInfo(masss,motionState,colshape,localInertia);
        let rBody= new Ammo.btRigidBody(rigidBodyInfo);
    
        rBody.setFriction(0.9);//4
       rBody.setRollingFriction(0.05);//10
        //rbody.setRestitution(0.9);
        //ballbody.setFriction(0.5);
        //ballbody.setRollingFriction(0.05);
        // ballbody.setRestitution(0.9);
        rBody.setActivationState(4)//STATE.DISABLE_DEACTIVATION
        //console.log("지정바디정보:",rBody);
        physicsWorld.addRigidBody(rBody);


        rigidBodies.push(character);
        character.userData.physicsBody = rBody;
        rBody.threeObject = character;

        this.mesh=character;
        this.pbody=rBody;
    }

}
export default AnotherCharacterGLTF;