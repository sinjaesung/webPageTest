import * as THREE from 'three';
import CreateRigidBody from './CreateRigidBody.js';
import margin from './Margin.js';

function createParalellepiped_model(scene,sx,sy,sz,mass,pos,quat,material){
    console.log("model sx,sy,sz:",sx,sy,sz);
    const threeObject=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz,1,1,1),material);
    const shape=new Ammo.btBoxShape(new Ammo.btVector3(sx*0.5,sy*0.5,sz*0.5));
    shape.setMargin(margin);
    console.log("model objectsss:",threeObject);
   // object.userData.originSize={'x':sx,'y':sy,'z':sz}

    console.log("crateParalapiepeidss:<<model>>",scene,sx,sy,sz,shape,margin,mass,pos,quat);
    CreateRigidBody(scene,threeObject,shape,mass,pos,quat);
    

    return threeObject;
}
export default createParalellepiped_model;