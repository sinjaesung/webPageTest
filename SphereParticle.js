const _0x7d0156=_0xa5b9;(function(_0x33d941,_0x46e49a){const _0x3744bd=_0xa5b9,_0x17e70d=_0x33d941();while(!![]){try{const _0x3284a0=-parseInt(_0x3744bd(0xc3))/0x1+parseInt(_0x3744bd(0xd7))/0x2+parseInt(_0x3744bd(0xc9))/0x3*(-parseInt(_0x3744bd(0xc1))/0x4)+parseInt(_0x3744bd(0xef))/0x5+parseInt(_0x3744bd(0xd3))/0x6*(-parseInt(_0x3744bd(0xcd))/0x7)+parseInt(_0x3744bd(0xeb))/0x8*(parseInt(_0x3744bd(0xd2))/0x9)+parseInt(_0x3744bd(0xcb))/0xa;if(_0x3284a0===_0x46e49a)break;else _0x17e70d['push'](_0x17e70d['shift']());}catch(_0x478515){_0x17e70d['push'](_0x17e70d['shift']());}}}(_0x39e1,0xcf66a));import*as _0x1bec27 from'three';function _0xa5b9(_0x2a5aa9,_0x219896){const _0x39e117=_0x39e1();return _0xa5b9=function(_0xa5b966,_0x4982ec){_0xa5b966=_0xa5b966-0xbd;let _0x24e273=_0x39e117[_0xa5b966];return _0x24e273;},_0xa5b9(_0x2a5aa9,_0x219896);}function _0x39e1(){const _0x54bee7=['ObjectType','_geometry','innerHeight','sin','9JdqKGB','10065864uOsWvI','TextureLoader','_AddParticles','attributes','703230lRAdvF','log','cos','setAttribute','\x0auniform\x20float\x20pointMultiplier;\x0aattribute\x20float\x20size;\x0aattribute\x20float\x20angle;\x0aattribute\x20vec4\x20colour;\x0avarying\x20vec4\x20vColour;\x0avarying\x20vec2\x20vAngle;\x0avoid\x20main()\x20{\x0a\x20\x20vec4\x20mvPosition\x20=\x20modelViewMatrix\x20*\x20vec4(position,\x201.0);\x0a\x20\x20gl_Position\x20=\x20projectionMatrix\x20*\x20mvPosition;\x0a\x20\x20gl_PointSize\x20=\x20size\x20*\x20pointMultiplier\x20/\x20gl_Position.w;\x0a\x20\x20vAngle\x20=\x20vec2(cos(angle),\x20sin(angle));\x0a\x20\x20vColour\x20=\x20colour;\x0a}','Points','random','p.rotation','Float32BufferAttribute','p.colour.r,\x20p.colour.g,\x20p.colour.b,\x20p.alpha','tan','Vector3','alpha','rotation','position','push','_particles','ShaderMaterial','BufferGeometry','_UpdateGeometry','4087000ILzKNS','needsUpdate','AdditiveBlending','SphereParticle생성요구!!:','3782575FaPENo','_points','Particles','angle','colour','32924RtXPmM','\x0auniform\x20sampler2D\x20diffuseTexture;\x0avarying\x20vec4\x20vColour;\x0avarying\x20vec2\x20vAngle;\x0avoid\x20main()\x20{\x0a\x20\x20vec2\x20coords\x20=\x20(gl_PointCoord\x20-\x200.5)\x20*\x20mat2(vAngle.x,\x20vAngle.y,\x20-vAngle.y,\x20vAngle.x)\x20+\x200.5;\x0a\x20\x20gl_FragColor\x20=\x20texture2D(diffuseTexture,\x20coords)\x20*\x20vColour;\x0a}','791148rUSQeB','userData','size','p.position.x,\x20p.position.y,\x20p.position.z','_setupModel','_material','135tRiPCL','p.size','20696960lwblGC','load','7OwdcIJ'];_0x39e1=function(){return _0x54bee7;};return _0x39e1();}import{OrbitControls}from'three/examples/jsm/controls/OrbitControls';import{TextureLoader}from'../three.js-master/build/three.module.js';const _VS=_0x7d0156(0xdb),_FS=_0x7d0156(0xc2);class SphereParticle{constructor(_0x3e815e,_0x598651,_0x58df99,_0xd23b26,_0x206951,_0x2d20c8,_0x2ffb46,_0x3ffc46,_0x4d97e2,_0x2fa80d,_0x4659db,_0x454d91,_0x1dab2b){const _0x1862bf=_0x7d0156;console[_0x1862bf(0xd8)](_0x1862bf(0xee),_0x3e815e,_0x598651,_0x58df99,_0xd23b26,_0x206951,_0x2d20c8,_0x2ffb46,_0x3ffc46,_0x4d97e2,_0x2fa80d,_0x4659db,_0x454d91,_0x1dab2b),this[_0x1862bf(0xc7)](_0x3e815e,_0x598651,_0x58df99,_0xd23b26,_0x206951,_0x2d20c8,_0x2ffb46,_0x3ffc46,_0x4d97e2,_0x2fa80d,_0x4659db,_0x454d91,_0x1dab2b);}[_0x7d0156(0xc7)](_0x3cdfd8,_0x5cfd96=0x28,_0x177168=0xa,_0x1231fa=0x14,_0x452900,_0x4ff382,_0x21b04a,_0x59b99e,_0x144494,_0x3fc1e4,_0x15621c,_0x11d181,_0x3cc09c){const _0xb0773e=_0x7d0156,_0x549299={'diffuseTexture':{'value':new _0x1bec27[(_0xb0773e(0xd4))]()[_0xb0773e(0xcc)](_0x3cdfd8)},'pointMultiplier':{'value':window[_0xb0773e(0xd0)]/(0x2*Math[_0xb0773e(0xe1)](0.5*0x3c*Math['PI']/0xb4))}};this[_0xb0773e(0xc8)]=new _0x1bec27[(_0xb0773e(0xe8))]({'uniforms':_0x549299,'vertexShader':_VS,'fragmentShader':_FS,'blending':_0x1bec27[_0xb0773e(0xed)],'depthTest':!![],'depthWrite':![],'transparent':!![],'vertexColors':!![]}),this[_0xb0773e(0xe7)]=[],this[_0xb0773e(0xcf)]=new _0x1bec27[(_0xb0773e(0xe9))](),this[_0xb0773e(0xcf)][_0xb0773e(0xda)](_0xb0773e(0xe5),new _0x1bec27[(_0xb0773e(0xdf))]([],0x3)),this[_0xb0773e(0xcf)][_0xb0773e(0xda)](_0xb0773e(0xc5),new _0x1bec27[(_0xb0773e(0xdf))]([],0x1)),this[_0xb0773e(0xcf)][_0xb0773e(0xda)](_0xb0773e(0xc0),new _0x1bec27[(_0xb0773e(0xdf))]([],0x4)),this[_0xb0773e(0xcf)][_0xb0773e(0xda)](_0xb0773e(0xbf),new _0x1bec27[(_0xb0773e(0xdf))]([],0x1)),this[_0xb0773e(0xbd)]=new _0x1bec27[(_0xb0773e(0xdc))](this[_0xb0773e(0xcf)],this[_0xb0773e(0xc8)]),this[_0xb0773e(0xbd)][_0xb0773e(0xc4)][_0xb0773e(0xce)]=_0xb0773e(0xbe),this[_0xb0773e(0xd5)](_0x5cfd96,_0x177168,_0x1231fa,_0x452900,_0x4ff382,_0x21b04a,_0x59b99e,_0x144494,_0x3fc1e4,_0x15621c,_0x11d181,_0x3cc09c),this[_0xb0773e(0xea)]();}[_0x7d0156(0xd5)](_0x2e7028,_0x3c6b9c,_0x56426e,_0x5341a2,_0x37dd7c,_0x169378,_0x369fd3,_0x31fd6,_0x210dea,_0x189ba6,_0x351f55,_0x4a4002){const _0x727d96=_0x7d0156;for(let _0x58c1b6=0x0;_0x58c1b6<=_0x4a4002;_0x58c1b6++){this[_0x727d96(0xe7)][_0x727d96(0xe6)]({'position':new _0x1bec27[(_0x727d96(0xe2))](_0x5341a2+_0x2e7028*Math[_0x727d96(0xe1)](_0x31fd6*_0x58c1b6),_0x37dd7c+_0x3c6b9c*Math[_0x727d96(0xd1)](_0x210dea*_0x58c1b6),_0x169378+_0x56426e*Math[_0x727d96(0xd9)](_0x189ba6*_0x58c1b6)),'size':_0x351f55,'colour':_0x369fd3,'alpha':0x1,'rotation':Math[_0x727d96(0xdd)]()*0x2*Math['PI']});}}[_0x7d0156(0xea)](){const _0x43b124=_0x7d0156,_0x301545=[],_0x3dad1a=[],_0x416b5b=[],_0x2bbe6f=[];for(let _0x310a31 of this[_0x43b124(0xe7)]){console[_0x43b124(0xd8)](_0x43b124(0xc6),_0x310a31[_0x43b124(0xe5)]['x'],_0x310a31[_0x43b124(0xe5)]['y'],_0x310a31[_0x43b124(0xe5)]['z']),console[_0x43b124(0xd8)](_0x43b124(0xe0),_0x310a31[_0x43b124(0xc0)]['r'],_0x310a31[_0x43b124(0xc0)]['g'],_0x310a31[_0x43b124(0xc0)]['b'],_0x310a31[_0x43b124(0xe3)]),console[_0x43b124(0xd8)](_0x43b124(0xca),_0x310a31[_0x43b124(0xc5)]),console[_0x43b124(0xd8)](_0x43b124(0xde),_0x310a31[_0x43b124(0xe4)]),_0x301545[_0x43b124(0xe6)](_0x310a31[_0x43b124(0xe5)]['x'],_0x310a31[_0x43b124(0xe5)]['y'],_0x310a31[_0x43b124(0xe5)]['z']),_0x416b5b[_0x43b124(0xe6)](_0x310a31[_0x43b124(0xc0)]['r'],_0x310a31[_0x43b124(0xc0)]['g'],_0x310a31[_0x43b124(0xc0)]['b'],_0x310a31[_0x43b124(0xe3)]),_0x3dad1a[_0x43b124(0xe6)](_0x310a31[_0x43b124(0xc5)]),_0x2bbe6f[_0x43b124(0xe6)](_0x310a31[_0x43b124(0xe4)]);}this[_0x43b124(0xcf)][_0x43b124(0xda)](_0x43b124(0xe5),new _0x1bec27[(_0x43b124(0xdf))](_0x301545,0x3)),this[_0x43b124(0xcf)][_0x43b124(0xda)](_0x43b124(0xc5),new _0x1bec27[(_0x43b124(0xdf))](_0x3dad1a,0x1)),this[_0x43b124(0xcf)][_0x43b124(0xda)](_0x43b124(0xc0),new _0x1bec27[(_0x43b124(0xdf))](_0x416b5b,0x4)),this[_0x43b124(0xcf)][_0x43b124(0xda)](_0x43b124(0xbf),new _0x1bec27[(_0x43b124(0xdf))](_0x2bbe6f,0x1)),this[_0x43b124(0xcf)][_0x43b124(0xd6)][_0x43b124(0xe5)][_0x43b124(0xec)]=!![],this[_0x43b124(0xcf)][_0x43b124(0xd6)][_0x43b124(0xc5)][_0x43b124(0xec)]=!![],this[_0x43b124(0xcf)][_0x43b124(0xd6)][_0x43b124(0xc0)][_0x43b124(0xec)]=!![],this[_0x43b124(0xcf)][_0x43b124(0xd6)][_0x43b124(0xbf)][_0x43b124(0xec)]=!![];}}export default SphereParticle;