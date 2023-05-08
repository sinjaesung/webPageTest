import * as THREE from 'three';
import createParalellepiped_model from './CreateParalellepiped_model.js';

const addphysicsCharacterBox = (scene,character_boxwire,object)=>{
    const pos=new THREE.Vector3();
    const quat=new THREE.Quaternion();
    pos.set(object.position.x,object.position.y,object.position.z);
    quat.set(0,0,0,1);
    console.log("add phihss characterboxx!!:초기모델위치",character_boxwire,object,object.position);

    let calc_x=character_boxwire.max.x - character_boxwire.min.x;
    let calc_y=character_boxwire.max.y - character_boxwire.min.y;
    let calc_z=character_boxwire.max.z- character_boxwire.min.z;
    console.log("계산된 캐릭터as 박스크기:",calc_x,calc_y,calc_z);
    const boxMesh=createParalellepiped_model(scene,calc_x,calc_y,calc_z,8,pos,quat,new THREE.MeshPhongMaterial({color:0xffff00}));

    boxMesh.castShadow=true;
    boxMesh.receiveShadow=true;

    return boxMesh;
}
export default addphysicsCharacterBox;