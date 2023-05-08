import * as THREE from './three.js-master/build/three.module.js';

const vertShader=`
    uniform float amplitude; //animates face/raingle verticess movement

    attribute vec3 customColor;//vertex color
    attribute vec3 vel;//vertex velocity

    varying vec3 vNormal;//vertex direction
    varying vec3 vColor;//vertex color

    void main(){

        vNormal = normal;
        vColor = customColor;

        //add velocity to position of verticess
        vec3 newPosition = position + vel * amplitude;

        gl_Position = projectionMatrix * modelViewMatrix * vec4 (newPosition,1.0);
    }
`

const fragShader= `
    varying vec3 vNormal;
    varying vec3 vColor;

    void main(){
        
        const float ambient = 0.4;//non directional light

        vec3 light = vec3(1.0);//directional light(shadowss)
        light= normalize(light);

        //how is directional light pointing to surface (vNormal)??
        float directional = max( dot(vNormal,light),0.0);

        //combine directional and nondirecitonal lighting effects to color of oobject
        gl_FragColor =vec4( (directional + ambient) * vColor, 1.0);

    }
`

const uniforms={
    amplitude: { value: 0.0},
}
export {vertShader,fragShader,uniforms};