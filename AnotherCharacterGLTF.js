const _0x107ac5=_0x1252;(function(_0x4c5726,_0x11c7e8){const _0x5878e9=_0x1252,_0x430c9e=_0x4c5726();while(!![]){try{const _0x35af3a=parseInt(_0x5878e9(0xf0))/0x1+parseInt(_0x5878e9(0xfc))/0x2+parseInt(_0x5878e9(0xcf))/0x3*(parseInt(_0x5878e9(0xe4))/0x4)+parseInt(_0x5878e9(0xe9))/0x5*(-parseInt(_0x5878e9(0xf1))/0x6)+-parseInt(_0x5878e9(0xe0))/0x7+parseInt(_0x5878e9(0xe6))/0x8*(parseInt(_0x5878e9(0xd6))/0x9)+parseInt(_0x5878e9(0xdc))/0xa*(-parseInt(_0x5878e9(0xdb))/0xb);if(_0x35af3a===_0x11c7e8)break;else _0x430c9e['push'](_0x430c9e['shift']());}catch(_0x2cc1c7){_0x430c9e['push'](_0x430c9e['shift']());}}}(_0xde2c,0x85374));function _0x1252(_0x5230b1,_0x3f8127){const _0xde2c91=_0xde2c();return _0x1252=function(_0x12521c,_0x360d25){_0x12521c=_0x12521c-0xcf;let _0x230b9f=_0xde2c91[_0x12521c];return _0x230b9f;},_0x1252(_0x5230b1,_0x3f8127);}import*as _0x362ad5 from'three';import{OrbitControls}from'three/examples/jsm/controls/OrbitControls';import{GLTFLoader}from'../three.js-master/examples/jsm/loaders/GLTFLoader.js';import _0x242730 from'./physics/RigidBodies.js';class AnotherCharacterGLTF{[_0x107ac5(0xf9)]=null;[_0x107ac5(0xd8)]=null;constructor(_0x54803c,_0x1a59e1,_0x440721,_0x1c22fa,_0x128855=this[_0x107ac5(0xec)],_0x4723b0,_0x1288a7,_0x2768db,_0x5bd4f6,_0x25b5ce,_0x40a6fa,_0x4591f0,_0x106386,_0x30e274,_0x4d6946,_0x5e5ddb){const _0x792c82=_0x107ac5;let _0x17b7e0={'x':0x0,'y':0x0,'z':0x0,'w':0x1};_0x4d6946&&(_0x17b7e0=_0x4d6946);let _0x599949=_0x40a6fa,_0x24176c,_0x248724;_0x248724=_0x24176c=_0x1a59e1,_0x1a59e1[_0x792c82(0xf7)][_0x792c82(0xf8)](_0x1c22fa['x'],_0x1c22fa['y'],_0x1c22fa['z']),_0x1a59e1[_0x792c82(0xde)][_0x792c82(0xed)]=_0x5bd4f6?_0x5bd4f6:_0x792c82(0xf6),_0x1a59e1[_0x792c82(0xde)]['hp']=_0x1288a7,_0x1a59e1[_0x792c82(0xde)][_0x792c82(0xe7)]=_0x2768db,_0x1a59e1[_0x792c82(0xde)][_0x792c82(0xf3)]=_0x5bd4f6,_0x1a59e1[_0x792c82(0xde)][_0x792c82(0xd0)]=_0x25b5ce,_0x1a59e1[_0x792c82(0xde)][_0x792c82(0xea)]=_0x4591f0,_0x1a59e1[_0x792c82(0xde)][_0x792c82(0xda)]=_0x40a6fa,_0x1a59e1[_0x792c82(0xde)][_0x792c82(0xf2)]=_0x30e274?_0x30e274:0x0,_0x1a59e1[_0x792c82(0xde)][_0x792c82(0xfa)]=_0x106386,_0x1a59e1[_0x792c82(0xde)][_0x792c82(0xe1)]=_0x5e5ddb;let _0x2039a1=new _0x128855[(_0x792c82(0xd2))]();_0x2039a1[_0x792c82(0xe3)](),_0x2039a1[_0x792c82(0xdf)](new _0x128855[(_0x792c82(0xd4))](_0x1c22fa['x'],_0x1c22fa['y'],_0x1c22fa['z'])),_0x2039a1[_0x792c82(0xee)](new _0x128855[(_0x792c82(0xef))](_0x17b7e0['x'],_0x17b7e0['y'],_0x17b7e0['z'],_0x17b7e0['w']));let _0x42dd34=new _0x128855[(_0x792c82(0xd3))](_0x2039a1),_0x838c17=new _0x128855[(_0x792c82(0xd4))](0x0,0x0,0x0),_0x29183d=_0x54803c[_0x792c82(0xeb)]['x']-_0x54803c[_0x792c82(0xfb)]['x'],_0x11987d=_0x54803c[_0x792c82(0xeb)]['y']-_0x54803c[_0x792c82(0xfb)]['y'],_0x44c133=_0x54803c[_0x792c82(0xeb)]['z']-_0x54803c[_0x792c82(0xfb)]['z'],_0x2ec260=Math[_0x792c82(0xeb)](_0x29183d,_0x11987d,_0x44c133);const _0x61ed39=new _0x128855[(_0x792c82(0xd9))](new _0x128855[(_0x792c82(0xd4))](_0x2ec260*0.5,_0x2ec260*0.5,_0x2ec260*0.5));_0x61ed39[_0x792c82(0xd7)](0.05),_0x61ed39[_0x792c82(0xdd)](_0x599949,_0x838c17);let _0x392159=new _0x128855[(_0x792c82(0xd1))](_0x599949,_0x42dd34,_0x61ed39,_0x838c17),_0xc02ac8=new _0x128855[(_0x792c82(0xf5))](_0x392159);_0xc02ac8[_0x792c82(0xfd)](0.9),_0xc02ac8[_0x792c82(0xe2)](0.05),_0xc02ac8[_0x792c82(0xe8)](0x4),_0x4723b0[_0x792c82(0xd5)](_0xc02ac8),_0x242730[_0x792c82(0xf4)](_0x248724),_0x248724[_0x792c82(0xde)][_0x792c82(0xfe)]=_0xc02ac8,_0xc02ac8[_0x792c82(0xe5)]=_0x248724,this[_0x792c82(0xf9)]=_0x248724,this[_0x792c82(0xd8)]=_0xc02ac8;}}export default AnotherCharacterGLTF;function _0xde2c(){const _0x496757=['btDefaultMotionState','btVector3','addRigidBody','3213909qjGCXL','getMargin','pbody','btBoxShape','mass','12253615zSdCtk','10wijHhJ','calculateLocalInertia','userData','setOrigin','1399342rpjBJA','diedSound','setRollingFriction','setIdentity','20XtOdLW','threeObject','24LdfHft','power','setActivationState','86335MFGIRT','name','max','ammoClone','tag','setRotation','btQuaternion','185501wsuEJN','144KHqDYm','defense','type','push','btRigidBody','anothercharacter','position','set','mesh','ballChildMeshmodel','min','1808284VWXJoZ','setFriction','physicsBody','67791GyfKKB','speed','btRigidBodyConstructionInfo','btTransform'];_0xde2c=function(){return _0x496757;};return _0xde2c();}