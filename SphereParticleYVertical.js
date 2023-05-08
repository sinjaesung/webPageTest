//import * as THREE from '../three.js-master/build/three.module.js';
//import { OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

const _VS = `
uniform float pointMultiplier;
attribute float size;
attribute float angle;
attribute vec4 colour;
varying vec4 vColour;
varying vec2 vAngle;
void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = size * pointMultiplier / gl_Position.w;
  vAngle = vec2(cos(angle), sin(angle));
  vColour = colour;
}`;

const _FS = `
uniform sampler2D diffuseTexture;
varying vec4 vColour;
varying vec2 vAngle;
void main() {
  vec2 coords = (gl_PointCoord - 0.5) * mat2(vAngle.x, vAngle.y, -vAngle.y, vAngle.x) + 0.5;
  gl_FragColor = texture2D(diffuseTexture, coords) * vColour;
}`;
class SphereParticleYVertical{
    //폭발형은 y좌표높이로 길게 늘어진 형태 사용
    constructor(texturesrc,xamountshape,yamountshape,zamountshape,x_origin,y_origin,z_origin,color,xSinFlag,yTanFlag,zCosFlag,particleSize,step){  
        console.log("SphereParticle생성요구!!:",texturesrc,xamountshape,yamountshape,zamountshape,x_origin,y_origin,z_origin,color,xSinFlag,yTanFlag,zCosFlag,particleSize,step);
        this._setupModel(texturesrc,xamountshape,yamountshape,zamountshape,x_origin,y_origin,z_origin,color,xSinFlag,yTanFlag,zCosFlag,particleSize,step);
    }
    _setupModel(texturesrc,xamountshape=40,yamountshape=10,zamountshape=20,x_origin,y_origin,z_origin,color,xSinFlag,yTanFlag,zCosFlag,particleSize,step){
      
        const uniforms = {
            diffuseTexture: {
                //value: new THREE.TextureLoader().load('./resources/enery1.jpg')
                value: new THREE.TextureLoader().load(texturesrc)
                //value: new THREE.TextureLoader().load(startparams.particleTexture)
            },
            pointMultiplier: {
                value: window.innerHeight / (2.0 * Math.tan(0.5 * 60.0 * Math.PI / 180.0))//1/6라디안 30도개념치 60도개념치에 대한 화며높이비율
            }
        };  
        this._material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: _VS,
            fragmentShader: _FS,
            blending: THREE.AdditiveBlending,//NormalBlending,NoBlending
            depthTest: true,
            depthWrite: false,
            transparent: true,
            vertexColors: true
        });

        this._particles = [];

        this._geometry = new THREE.BufferGeometry();
        this._geometry.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
        this._geometry.setAttribute('size', new THREE.Float32BufferAttribute([], 1));
        this._geometry.setAttribute('colour', new THREE.Float32BufferAttribute([], 4));
        this._geometry.setAttribute('angle', new THREE.Float32BufferAttribute([], 1));

        this._points = new THREE.Points(this._geometry, this._material);
        this._points.userData.ObjectType='Particles';

        this._AddParticles(xamountshape,yamountshape,zamountshape,x_origin,y_origin,z_origin,color,xSinFlag,yTanFlag,zCosFlag,particleSize,step);
        this._UpdateGeometry();
    }
    
    _AddParticles(xamountshape,yamountshape,zamountshape,x_origin,y_origin,z_origin,color,xSinFlag,yTanFlag,zCosFlag,particleSize,step) {
       // let x_distance=420;
        //let z_distance=670;
        //let y_distance=85;
        //let x_start=0;
        //let z_start=0;
        //let y_start=0;

        for (let i = 0; i <= step; i++) {
           // let color=new THREE.Color();
           // color.setRGB(Math.random(),Math.random(),Math.random())
          
            this._particles.push({
                position: new THREE.Vector3(
                    //(Math.random() * 4 - 1) * 1.0,//-1~0.99999   (Math.random() * updateparams.xDistance - 1) * 1.0
                    //(Math.random() * 4- 1) * 1.0,//-1~8.999999 (Math.random() * updateparams.yDistance - 1) * 1.0
                    //(Math.random() * 4 - 1) * 1.0),  //(Math.random() * updateparams.zDistance - 1) * 1.0
                    x_origin + (xamountshape*Math.sin(xSinFlag*i)),//-40~40 40*-1~1
                    y_origin + (yamountshape*Math.tan(yTanFlag*i)),//-10~10
                    z_origin + (zamountshape*Math.cos(zCosFlag*i)),//fixed
                ),
              // size: (Math.random() * 0.5 + 0.5) * 4.0,//0.5~1  2~4
               size:particleSize,
                colour: color,
                alpha: 1,
            // life: life,
            //  maxLife: life,
                rotation: Math.random() * 2.0 * Math.PI,//0~2파이
                //velocity: new THREE.Vector3(updateparams.velocityX,updateparams.velocityY,updateparams.velocityZ),//updateparams.velocityX,updateparams.velocityY,updateparams.velocityZ,
            });
        }
    }
    _UpdateGeometry() {
        const positions = [];
        const sizes = [];
        const colours = [];
        const angles = [];
    
        //console.log("updateGeomerysss:",this._UpdateGeometry);
        for (let p of this._particles) {
          console.log("p.position.x, p.position.y, p.position.z",p.position.x, p.position.y, p.position.z)
          console.log("p.colour.r, p.colour.g, p.colour.b, p.alpha",p.colour.r, p.colour.g, p.colour.b, p.alpha)
          console.log("p.size",p.size)
          console.log("p.rotation",p.rotation)
    
          positions.push(p.position.x, p.position.y, p.position.z);
          colours.push(p.colour.r, p.colour.g, p.colour.b, p.alpha);
          sizes.push(p.size);
          angles.push(p.rotation);
        }
        //console.log("update informatiosnsss pos,colors,size,angless",positions,colours,sizes,angles);
    
        this._geometry.setAttribute(
            'position', new THREE.Float32BufferAttribute(positions, 3));
        this._geometry.setAttribute(
            'size', new THREE.Float32BufferAttribute(sizes, 1));
        this._geometry.setAttribute(
            'colour', new THREE.Float32BufferAttribute(colours, 4));
        this._geometry.setAttribute(
            'angle', new THREE.Float32BufferAttribute(angles, 1));
      
        this._geometry.attributes.position.needsUpdate = true;
        this._geometry.attributes.size.needsUpdate = true;
        this._geometry.attributes.colour.needsUpdate = true;
        this._geometry.attributes.angle.needsUpdate = true;
      }
}
export default SphereParticleYVertical;