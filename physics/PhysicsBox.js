import * as THREE from 'three';
import createParalellepiped from './CreateParalellepiped.js';

const addPhysicBox = (scene)=>{
    const pos=new THREE.Vector3();
    const quat=new THREE.Quaternion();
    pos.set(6,5,2);
    quat.set(0,0,0,1);

    const box=createParalellepiped(scene,10,10,10,600,pos,quat,new THREE.MeshPhongMaterial({color:0xffff00}));

    box.castShadow=true;
    box.receiveShadow=true;

    return box;
}
export default addPhysicBox;