import gravityConstant from './Gravity.js';

let physicsWorld;
let transformAux1;

function InitPhysics(thisElement){
    console.log("ammo??:",Ammo,thisElement);
    let collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration();
    let dispatcher=new Ammo.btCollisionDispatcher(collisionConfiguration);
    let broadphase=new Ammo.btDbvtBroadphase();
    let solver=new Ammo.btSequentialImpulseConstraintSolver();
    let softBodySolver = new Ammo.btDefaultSoftBodySolver();

    physicsWorld = new Ammo.btSoftRigidDynamicsWorld(dispatcher,broadphase,solver,collisionConfiguration,softBodySolver);
    physicsWorld.setGravity(new Ammo.btVector3(0,gravityConstant,0));
    physicsWorld.getWorldInfo().set_m_gravity(new Ammo.btVector3(0,gravityConstant,0));

    transformAux1 = new Ammo.btTransform();

    console.log("initPhiyiscss!@!!:",physicsWorld,transformAux1);

    thisElement._physicsWorld=physicsWorld;
}

export default InitPhysics;

export {physicsWorld,transformAux1}