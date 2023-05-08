import { physicsWorld,transformAux1 } from "./InitPhysics.js";

import rigidBodies from "./RigidBodies.js";

function updatePhysics(deltaTime){
    physicsWorld.stepSimulation(deltaTime,10);
    console.log("updatePhiscss rigidbOBidess:",physicsWorld,rigidBodies);
    for(let i=0; i<rigidBodies.length; i++){
        console.log("updatephyiscss:",rigidBodies);
        const objThree=rigidBodies[i];
        const objPhys=objThree.userData.physicsBody;
        const ms=objPhys.getMotionState();

        if(ms){
            ms.getWorldTransform(transformAux1);
            const p=transformAux1.getOrigin();
            const q=transformAux1.getRotation();
            objThree.position.set(p.x(),p.y(),p.z());
            objThree.quaternion.set(q.x(),q.y(),q.z(),q.w());
            console.log("object rigidbodies별 ms및 phyiscs정보:",ms,transformAux1,p,q);
            console.log("origin.x,y,z.:",p.x(),p.y(),p.z());
            console.log("getRoation x,y,z:",q.x(),q.y(),q.z(),q.w());
        }
    }
}
export default updatePhysics;