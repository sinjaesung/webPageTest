const _0x46753d=_0x519f;(function(_0x169249,_0xb2f3d){const _0x1eab21=_0x519f,_0x3b90e2=_0x169249();while(!![]){try{const _0x37109=-parseInt(_0x1eab21(0x15d))/0x1*(parseInt(_0x1eab21(0x15b))/0x2)+-parseInt(_0x1eab21(0x162))/0x3+parseInt(_0x1eab21(0x160))/0x4+-parseInt(_0x1eab21(0x163))/0x5*(parseInt(_0x1eab21(0x159))/0x6)+-parseInt(_0x1eab21(0x164))/0x7+parseInt(_0x1eab21(0x15f))/0x8*(parseInt(_0x1eab21(0x15a))/0x9)+parseInt(_0x1eab21(0x161))/0xa;if(_0x37109===_0xb2f3d)break;else _0x3b90e2['push'](_0x3b90e2['shift']());}catch(_0x18545c){_0x3b90e2['push'](_0x3b90e2['shift']());}}}(_0x2953,0x21624));import*as _0x102aff from'three';function _0x2953(){const _0x14a7c6=['1019004dSoVPw','4063540cPrVGQ','484641eHLiZs','270665yvVkzO','798308vrecpD','18ytBEpf','2331OevVMp','100336VZEspY','\x0a\x20\x20\x20\x20uniform\x20float\x20amplitude;\x20//animates\x20face/raingle\x20verticess\x20movement\x0a\x0a\x20\x20\x20\x20attribute\x20vec3\x20customColor;//vertex\x20color\x0a\x20\x20\x20\x20attribute\x20vec3\x20vel;//vertex\x20velocity\x0a\x0a\x20\x20\x20\x20varying\x20vec3\x20vNormal;//vertex\x20direction\x0a\x20\x20\x20\x20varying\x20vec3\x20vColor;//vertex\x20color\x0a\x0a\x20\x20\x20\x20void\x20main(){\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20vNormal\x20=\x20normal;\x0a\x20\x20\x20\x20\x20\x20\x20\x20vColor\x20=\x20customColor;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20//add\x20velocity\x20to\x20position\x20of\x20verticess\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20newPosition\x20=\x20position\x20+\x20vel\x20*\x20amplitude;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20gl_Position\x20=\x20projectionMatrix\x20*\x20modelViewMatrix\x20*\x20vec4\x20(newPosition,1.0);\x0a\x20\x20\x20\x20}\x0a','5opmUzk','\x0a\x20\x20\x20\x20varying\x20vec3\x20vNormal;\x0a\x20\x20\x20\x20varying\x20vec3\x20vColor;\x0a\x0a\x20\x20\x20\x20void\x20main(){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20float\x20ambient\x20=\x200.4;//non\x20directional\x20light\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20light\x20=\x20vec3(1.0);//directional\x20light(shadowss)\x0a\x20\x20\x20\x20\x20\x20\x20\x20light=\x20normalize(light);\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20//how\x20is\x20directional\x20light\x20pointing\x20to\x20surface\x20(vNormal)??\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20directional\x20=\x20max(\x20dot(vNormal,light),0.0);\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20//combine\x20directional\x20and\x20nondirecitonal\x20lighting\x20effects\x20to\x20color\x20of\x20oobject\x0a\x20\x20\x20\x20\x20\x20\x20\x20gl_FragColor\x20=vec4(\x20(directional\x20+\x20ambient)\x20*\x20vColor,\x201.0);\x0a\x0a\x20\x20\x20\x20}\x0a','5080IDUFhV'];_0x2953=function(){return _0x14a7c6;};return _0x2953();}function _0x519f(_0x1354f8,_0x3cfda7){const _0x2953d4=_0x2953();return _0x519f=function(_0x519f19,_0x170d0d){_0x519f19=_0x519f19-0x159;let _0x240d07=_0x2953d4[_0x519f19];return _0x240d07;},_0x519f(_0x1354f8,_0x3cfda7);}const vertShader=_0x46753d(0x15c),fragShader=_0x46753d(0x15e),uniforms={'amplitude':{'value':0x0}};export{vertShader,fragShader,uniforms};