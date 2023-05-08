import * as THREE from 'three';
import createParalellepiped from './CreateParalellepiped.js';

let addGround=(octree,scene)=>{
    const pos=new THREE.Vector3();
    const quat=new THREE.Quaternion();

    pos.set(0,-200,0);
    quat.set(0,0,0,1);

    const ground=createParalellepiped(scene,1000,2,1000,0/*mass*/,pos,quat,new THREE.MeshPhongMaterial({color:0x2020ff}));
    ground.castShadow=true;
    ground.receiveShadow=true;
    octree.fromGraphNode(ground);
}
export default addGround;