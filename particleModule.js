import * as THREE from 'three'

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


class LinearSpline {
  constructor(lerp) {
    console.log("lineraSplinesss constusrctorsss:",lerp);
    /*(t, a, b) => {
        return a + t * (b - a);
    }*/
    this._points = [];
    this._lerp = lerp;
  }

  AddPoint(t, d) {
    console.log("addpointssss:",t,d);
    this._points.push([t, d]);
  }

  Get(t) {
   // console.log("this poiubsstss?? and tvaluess finding t valuess:",this._points,t);
    let p1 = 0;

    for (let i = 0; i < this._points.length; i++) {
      if (this._points[i][0] >= t) {
        break;
      }
      p1 = i;
    }
   // console.log("찾은 point1",p1);

    const p2 = Math.min(this._points.length - 1, p1 + 1);
    //console.log('this._points.length - 1,p1+1,p2 찾아낸 p2:',this._points.length - 1,p1+1,p2)
    if (p1 == p2) {
       // console.log('p1 == p2',this._points,this._points[p1][1])

      return this._points[p1][1];
    }
    //console.log("this lerpsss:",(t - this._points[p1][0]) / (this._points[p2][0] - this._points[p1][0]), this._points[p1][1], this._points[p2][1])
    return this._lerp(
        (t - this._points[p1][0]) / (
            this._points[p2][0] - this._points[p1][0]),
        this._points[p1][1], this._points[p2][1]);
   }
}


class ParticleSystem {
  constructor(startparams) {

    console.log("parysticleSysmte parmsss: and pointMultiperss:",startparams,window.innerHeight / (2.0 * Math.tan(0.5 * 60.0 * Math.PI / 180.0)));

    const uniforms = {
        diffuseTexture: {
           // value: new THREE.TextureLoader().load('./resources/fire2.jpg')
            value: new THREE.TextureLoader().load(startparams.particleTexture)
        },
        pointMultiplier: {
            value: window.innerHeight / (2.0 * Math.tan(0.5 * 60.0 * Math.PI / 180.0))//1/6라디안 30도개념치 60도개념치에 대한 화며높이비율
        }
    };

    this._material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: _VS,
        fragmentShader: _FS,
        blending: THREE.AdditiveBlending,//normalBlending,NoBlending
        depthTest: true,
        depthWrite: false,
        transparent: true,
        vertexColors: true
    });

    this._camera = startparams.camera;
    this._particles = [];

    this._geometry = new THREE.BufferGeometry();
    this._geometry.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
    this._geometry.setAttribute('size', new THREE.Float32BufferAttribute([], 1));
    this._geometry.setAttribute('colour', new THREE.Float32BufferAttribute([], 4));
    this._geometry.setAttribute('angle', new THREE.Float32BufferAttribute([], 1));

    this._points = new THREE.Points(this._geometry, this._material);
    this._points.userData.ObjectType='Particles';
    startparams.parent.add(this._points);

    this._alphaSpline = new LinearSpline((t, a, b) => {
       // console.log("alphsapineslinss??what??",t,a,b);
        //console.log("alphsapineslinss??what??  a + t * (b - a)", a + t * (b - a));

      return a + t * (b - a);
    });
    //this._alphaSpline.AddPoint(0.0, 0.0);
    //this._alphaSpline.AddPoint(0.1, 1.0);
    this._alphaSpline.AddPoint(0.6, 1.0);
    this._alphaSpline.AddPoint(1.0, 0.0);

    this._colourSpline = new LinearSpline((t, a, b) => {
       // console.log("_colourSpline??what??",t,a,b);

      const c = a.clone();
      return c.lerp(b, t);
    });
    this._colourSpline.AddPoint(0.0, new THREE.Color(startparams.startColor));
    this._colourSpline.AddPoint(1.0, new THREE.Color(startparams.endColor));
    //this._colourSpline.AddPoint(0.0, new THREE.Color(0xfe0000));
    //this._colourSpline.AddPoint(1.0, new THREE.Color(0xff8020));
    this._sizeSpline = new LinearSpline((t, a, b) => {
      //  console.log("_sizeSpline??what??",t,a,b);
      //  console.log("_sizeSpline??what??  a + t * (b - a)", a + t * (b - a));

      return a + t * (b - a);
    });
    this._sizeSpline.AddPoint(0.0, 1.0);
    this._sizeSpline.AddPoint(0.5, 5.0);
    this._sizeSpline.AddPoint(1.0, 1.0);

    //document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
  
    this._UpdateGeometry();
  }

  _onKeyUp(event) {
    switch(event.keyCode) {
      case 32: // SPACE
        this._AddParticles();
        break;
    }
  }

  _AddParticles(timeElapsed,updateparams) {
   // console.log("addPartiless:",timeElapsed);
    let particleSize=updateparams.particleSize
    if (!this.gdfsghk) {
      this.gdfsghk = 0.0;
    }
    this.gdfsghk += timeElapsed;
    const n = Math.floor(this.gdfsghk * 3);
    this.gdfsghk -= n / 3;

    //console.log("this gfsdfsgsjtss and N",this.gdfsghk,n);

    for (let i = 0; i < n; i++) {
      const life = (Math.random() * 0.75 + 0.25) * 10.0;
      //console.log("particle lisffsss:",i,life);
      this._particles.push({
          position: new THREE.Vector3(
              (Math.random() * updateparams.xDistance - 1) * 1.0,//-1~0.99999   (Math.random() * updateparams.xDistance - 1) * 1.0
              (Math.random() * updateparams.yDistance- 1) * 1.0,//-1~8.999999 (Math.random() * updateparams.yDistance - 1) * 1.0
              (Math.random() * updateparams.zDistance - 1) * 1.0),  //(Math.random() * updateparams.zDistance - 1) * 1.0
          size: (Math.random() * 0.5 + 0.5) * particleSize,//0.5~1  2~4

          colour: new THREE.Color(),
          alpha: 1,
          life: life,
          maxLife: life,
         rotation: Math.random() * 2.0 * Math.PI,//0~2파이
         //rotation:0,
          velocity: new THREE.Vector3(updateparams.velocityX,updateparams.velocityY,updateparams.velocityZ),//updateparams.velocityX,updateparams.velocityY,updateparams.velocityZ,
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
      //console.log("p.position.x, p.position.y, p.position.z",p.position.x, p.position.y, p.position.z)
      //console.log("p.colour.r, p.colour.g, p.colour.b, p.alpha",p.colour.r, p.colour.g, p.colour.b, p.alpha)
      //console.log("p.currentSize",p.currentSize)
      //console.log("p.rotation",p.rotation)

      positions.push(p.position.x, p.position.y, p.position.z);
      colours.push(p.colour.r, p.colour.g, p.colour.b, p.alpha);
      sizes.push(p.currentSize);
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

  _UpdateParticles(timeElapsed) {
    //console.log("==========update Particlesss:===============================",timeElapsed);
    for (let p of this._particles) {
       // console.log("=========leave particlesss lifesss:=============",p.life);
      p.life -= timeElapsed;
    }

    this._particles = this._particles.filter(p => {
      return p.life > 0.0;
    });
    //console.log("=========남은 particless상황:=============",this._particles);

    let s=0;
    for (let p of this._particles) {
      const t = 1.0 - p.life / p.maxLife;
       //console.log("1.0 - p.life / p.maxLife:", 1.0 - p.life / p.maxLife,s)
       //console.log("this._alphaSpline.Get", this._alphaSpline.Get(t),s)
       //console.log("this._sizeSpline.Get(t)", p.size,this._sizeSpline.Get(t),s)
       //console.log("this._colourSpline.Get(t)", this._colourSpline.Get(t),s)
       //console.log("p.velocity.clone().multiplyScalar(timeElapsed)", p.velocity.clone().multiplyScalar(timeElapsed),s)

      p.rotation += timeElapsed * 0.5;
      p.alpha = this._alphaSpline.Get(t);
      p.currentSize = p.size * this._sizeSpline.Get(t);
      p.colour.copy(this._colourSpline.Get(t));

      p.position.add(p.velocity.clone().multiplyScalar(timeElapsed));

      const drag = p.velocity.clone();
      drag.multiplyScalar(timeElapsed * 0.1);
      drag.x = Math.sign(p.velocity.x) * Math.min(Math.abs(drag.x), Math.abs(p.velocity.x));
      drag.y = Math.sign(p.velocity.y) * Math.min(Math.abs(drag.y), Math.abs(p.velocity.y));
      drag.z = Math.sign(p.velocity.z) * Math.min(Math.abs(drag.z), Math.abs(p.velocity.z));
     // console.log("drag xyz",Math.sign(p.velocity.x) * Math.min(Math.abs(drag.x), Math.abs(p.velocity.x)), Math.sign(p.velocity.y) * Math.min(Math.abs(drag.y), Math.abs(p.velocity.y)), Math.sign(p.velocity.z) * Math.min(Math.abs(drag.z), Math.abs(p.velocity.z)));

      p.velocity.sub(drag);
    }

    this._particles.sort((a, b) => {
       // console.log("particles ssoartss:",a,b);
      const d1 = this._camera.position.distanceTo(a.position);
      const d2 = this._camera.position.distanceTo(b.position);

      if (d1 > d2) {
        return -1;
      }

      if (d1 < d2) {
        return 1;
      }

      return 0;
    });
    //console.log("===================now paritclessss:=================================",this._particles);
  }

  Step(timeElapsed,updateparams) {
    this._AddParticles(timeElapsed,updateparams);
    this._UpdateParticles(timeElapsed);
    this._UpdateGeometry();
  }
}
export default ParticleSystem;