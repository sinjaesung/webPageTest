import * as THREE from 'three';

import {physicsWorld} from './InitPhysics.js';
import rigidBodies from './RigidBodies.js';

function createRigidBody(scene,threeObject,physicShape,mass,pos,quat){
    console.log("threeeObjectsss: craete rigibibody",threeObject.position,threeObject.quaternion);
    console.log("carateBody physicShape:",physicShape)
    threeObject.position.copy(pos);
    threeObject.quaternion.copy(quat);

    const transform=new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(pos.x,pos.y,pos.z));
    transform.setRotation(new Ammo.btQuaternion(quat.x,quat.y,quat.z,quat.w));
    const motionState=new Ammo.btDefaultMotionState(transform);

    const localInertia=new Ammo.btVector3(0,0,0);
    physicShape.calculateLocalInertia(mass,localInertia);

    const rbInfo=new Ammo.btRigidBodyConstructionInfo(mass,motionState,physicShape,localInertia);
    const body=new Ammo.btRigidBody(rbInfo);

    threeObject.userData.physicsBody=body;
    console.log("threeObjectsss: userdata?가능?:",threeObject.userData);


    scene.add(threeObject);

    console.log("createRigidbodysss:",threeObject,transform,motionState,localInertia,physicShape);
    console.log("phyiscssinfo: and phyiscswWOrld add rigidboidess:",body);
    if(mass > 0){
        rigidBodies.push(threeObject);//active형 threeobject들 
        body.setActivationState(4);
    }
    body.setActivationState(4);//mass:0 passive형 rigidbody들
    physicsWorld.addRigidBody(body);
}
export default createRigidBody;