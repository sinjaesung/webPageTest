import * as THREE from 'three';

import rigidBodies from './physics/RigidBodies.js';
import enemys from './enemys.js';

class EnemyGLTF2{
    mesh=null;
    pbody=null;
    
    constructor(monsterbox,mesh,mesh_pureSkin,pos,Ammo=this.ammoClone,physicsWorld,hp,power,type,speed,mass,name,SKILLmesh,defense,distanceamount,isAir,attackRangeAmount,attackParticlesrc,attackSound,attackColor,isAirChase,steps=2,airAmountflag=1,diedSound){

        let quat={x:0,y:0,z:0,w:1};
        let masss=mass;
        console.log('monster mesh and pureSkin',mesh,mesh_pureSkin,monsterbox);

        let enemyObject,enemy;

        enemy=enemyObject=mesh;//object3d (bone,skinmehses모두포함) emshpureskin skinmehsess

        mesh.position.set(pos.x,pos.y,pos.z);

        //mesh.castShadow=true;
        //mesh.receiveShadow=true;
        mesh.userData.tag='enemy_passivebodyGLTF';
        mesh.userData.hp=hp;
        mesh.userData.power=power;
        mesh.userData.type=type;
        mesh.userData.speed=speed;
        mesh.userData.name=name;
        mesh.userData.mass=mass;
        mesh.userData.defense=defense?defense:0;
        mesh.userData.ballChildMeshmodel=SKILLmesh;
        mesh.userData.isAir=isAir;
        mesh.userData.distanceamount=distanceamount;
        mesh.userData.attackRangeAmount=attackRangeAmount;
        mesh.userData.attackParticlesrc=attackParticlesrc;
        mesh.userData.attackSound=attackSound;
        mesh.userData.attackColor=attackColor;
        mesh.userData.isAirChase=isAirChase;
        mesh.userData.steps=steps;
        mesh.userData.airAmountflag=airAmountflag;
        mesh.userData.diedSound=diedSound;


        //ammosjs sections
        let transform=new Ammo.btTransform();
        transform.setIdentity()
        transform.setOrigin(new Ammo.btVector3(pos.x,pos.y,pos.z));
        transform.setRotation(new Ammo.btQuaternion(quat.x,quat.y,quat.z,quat.w));

        let motionState=new Ammo.btDefaultMotionState(transform)

        let localInertia = new Ammo.btVector3( 0, 0, 0 );
        let calc_x=monsterbox.max.x - monsterbox.min.x
        let calc_y=monsterbox.max.y - monsterbox.min.y
        let calc_z=monsterbox.max.z - monsterbox.min.z;
        let max_size=Math.max(calc_x,calc_y,calc_z);
        console.log("계산된 monsterbox크기:",calc_x,calc_y,calc_z,max_size);

        const colshape=new Ammo.btBoxShape(new Ammo.btVector3(max_size*0.5,max_size*0.5,max_size*0.5));
        colshape.getMargin(0.05);
        colshape.calculateLocalInertia(masss,localInertia);
        console.log("meshgeometry btBoxShape shape모양정보:monstergltf",colshape);
        let rigidBodyInfo=new Ammo.btRigidBodyConstructionInfo(masss,motionState,colshape,localInertia);
        let rBody= new Ammo.btRigidBody(rigidBodyInfo);
    
        rBody.setFriction(0.9);//4
       rBody.setRollingFriction(0.05);//10
        //rbody.setRestitution(0.9);
        //ballbody.setFriction(0.5);
        //ballbody.setRollingFriction(0.05);
        // ballbody.setRestitution(0.9);
        rBody.setActivationState(4)//STATE.DISABLE_DEACTIVATION
        console.log("지정바디정보:",rBody);
        physicsWorld.addRigidBody(rBody);


        rigidBodies.push(enemy);
        enemy.userData.physicsBody = rBody;
        rBody.threeObject = enemy;

        this.mesh=enemy;
        this.pbody=rBody;
    }

}
export default EnemyGLTF2;