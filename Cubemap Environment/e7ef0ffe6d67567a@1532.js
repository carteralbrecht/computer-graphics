import define1 from "./55faae595525622e@211.js";
import define2 from "./2180fcbe75883db9@142.js";
import define3 from "./ebae0c172bd689cc@102.js";
import define4 from "./e93997d5089d7165@2303.js";
import define5 from "./10023e7d8ddc32bc@90.js";
import define6 from "./dd5e3bdbece67f4e@210.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["nz.png",new URL("./files/c6370649349beec31d057871044f0e85f9911a4b3d8d8e708a05855f84f610759f327b19d58c5487866822fef6da6410451f5c548343b1f98081affef9617213",import.meta.url)],["pz.png",new URL("./files/63df00e9376941905a35f1d1fe155aee9b14bf9003447672a685f646f1f14e86c35a204d4ea894c3920498ea8ccd727068cd91db76328bb69e66994c5e1b8159",import.meta.url)],["ny.png",new URL("./files/8e8f576f6276b12a3550a6e8cead53661c9927ad770f59db6026e7657a221e27d25018865efa8993925e13c5165311bf2814c1ff2f83489a9f50bcbe2eb1cb76",import.meta.url)],["py.png",new URL("./files/047c4a544ed6eece5e2e78434b25056ffdbc1e802fc3cd67477821ab8f3f6383f70b49d9fbe163fb358c83b61839ca287869464f70eb7e5a5fb1238be0afffa6",import.meta.url)],["nx.png",new URL("./files/7d2158cfe59147fabd895dfeca896b0f22f9880607c354c39ad59fe74e52ee43b7b2e80202cf5a341f83f62ea42661c0122efd4776113a7433b48fbc537687b6",import.meta.url)],["px.png",new URL("./files/40ffcd6e45439bf76517f3b593b8d7258ce0e072bd9f92cdeb3fb77de4a02dddaff1f33e56f5abdab472542f9835fb282bb2f58098adebf810b6d3b5408dca26",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Environment Mapping Using Cubemap`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Carter Albrecht Assignment 9`
)});
  main.variable(observer("viewof model")).define("viewof model", ["radio"], function(radio){return(
radio({
  description: 'Choose Model',
  options: [
   {value: 0, label: "ground"}, {value: 1, label: "teapot"}, {value: 2, label: "cube"}, {value: 3, label: "boy"}, {value: 4, label: "teddy"}, {value: 5, label: "cow"}, {value: 6, label: "sphereLowRes"}],
  value: 1
})
)});
  main.variable(observer("model")).define("model", ["Generators", "viewof model"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function(md){return(
md `### Choose Camera parameters`
)});
  main.variable(observer("viewof viewParameters")).define("viewof viewParameters", ["columns","slider"], function(columns,slider){return(
columns({
  fov: slider({
    min: 15, 
    max: 120, 
    step: 1, 
    value: 45, 
    title: "Vertical FOV in Degrees",
  }),
  xAngle: slider({
    min: -89, 
    max: 89, 
    step: 1, 
    value: 0, 
    title: "Rotation Around X-axis in degrees",
    description: "Camera Orbiting around the scene center."
  }),
  yAngle : slider({
    min: -180, 
    max: 180, 
    step: 1, 
    value: 0, 
    title: "Rotation around Y-axis in degrees",
    description: "Camera Orbiting around the scene center."
  }),
   eyeDistance: slider({
    min: 0.1, 
    max: 10, 
    step: 0.1, 
    value: 3, 
    title: "Eye Distance from the Scene Center",
    description: "Distance relative to Scene Dimension"
  })
})
)});
  main.variable(observer("viewParameters")).define("viewParameters", ["Generators", "viewof viewParameters"], (G, _) => G.input(_));
  main.variable(observer("myCanvas")).define("myCanvas", ["html","canvasWidth","canvasHeight"], function(html,canvasWidth,canvasHeight){return(
html `<canvas width=${canvasWidth}, height=${canvasHeight}/>`
)});
  main.variable(observer("canvasWidth")).define("canvasWidth", function(){return(
760
)});
  main.variable(observer("canvasHeight")).define("canvasHeight", function(){return(
400
)});
  main.variable(observer("regl")).define("regl", ["createRegl","myCanvas"], function(createRegl,myCanvas){return(
createRegl({canvas:myCanvas})
)});
  main.variable(observer()).define(["regl","renderSkybox","renderObject"], function(regl,renderSkybox,renderObject)
{
  regl.clear({
    color: [0.5, 0.5, 0.6, 1],
    depth: 1
  });

  renderSkybox(); 
  renderObject();
  
  return `Main Rendering`
}
);
  main.variable(observer()).define(["md"], function(md){return(
md `## Renderables`
)});
  main.variable(observer("renderSkybox")).define("renderSkybox", ["regl","cubemapTexture","inverseViewProjectionMatrix"], function(regl,cubemapTexture,inverseViewProjectionMatrix){return(
regl({
  vert: `
  precision mediump float;
  attribute vec2 position;
  varying vec2 fragPosition;
  void main() {
    fragPosition = position;
    gl_Position = vec4(position, 0, 1);
  }`,
  frag: `
    precision mediump float;
    uniform samplerCube envmap;
    varying vec2 fragPosition;
    uniform mat4 viewProjectionInverse;
    void main () {
      vec4 direction = viewProjectionInverse * vec4(fragPosition, 1, 1);
      gl_FragColor = textureCube(envmap, normalize(direction.xyz/direction.w));
    }
    `,
  attributes: {
    position: [
      [-1, -1],
      [ 1, -1],
      [ 1,  1],
      [-1,  1]
    ]
  },
  elements: [
    [0,1,2],
    [2,3,0]
  ],
  uniforms: {
    envmap: cubemapTexture,
    viewProjectionInverse: inverseViewProjectionMatrix
  },
  depth: {
    mask: false,
    enable: false
  }
})
)});
  main.variable(observer("renderObject")).define("renderObject", ["regl","object","viewMatrix","perspectiveMatrix","hex2rgb","eyePosition","cubemapTexture"], function(regl,object,viewMatrix,perspectiveMatrix,hex2rgb,eyePosition,cubemapTexture){return(
regl(
  {
  vert: `
    precision mediump float;
    attribute vec3 position, normal;
    uniform mat4 projection, view;
    varying vec3 fragNormal;
    varying vec3 fragPosition;
    void main() {
      vec4 mPosition = vec4(position, 1);
      fragPosition   = mPosition.xyz;
      fragNormal = normalize(normal);
      gl_Position = projection * view * mPosition;
    }`,
  frag: `
    precision mediump float;
    uniform vec3 skyColor, groundColor;
    uniform vec3 eyePosition;
    uniform samplerCube cubemapTex;
    varying vec3 fragNormal;
    varying vec3 fragPosition;
    void main () {
      vec3 N = normalize(fragNormal);
      vec3 V = normalize(eyePosition - fragPosition);
      vec3 R = reflect(-V, N);
      vec3 envColor = textureCube(cubemapTex, R).rgb;
      gl_FragColor = vec4(envColor, 1);
    }
    `, 
  attributes: {
    position: object.positions,
    normal: object.normals
  },
  elements: object.cells,
  uniforms: {
    view: viewMatrix,
    projection: perspectiveMatrix,
    skyColor : hex2rgb("#285f9f"), // This is Cubemap dependent. The value is for the current Cube map. 
    groundColor: hex2rgb("#5b5243"), //     The value is for the current Cube map. 
    eyePosition: eyePosition,
    cubemapTex: cubemapTexture,
  },
  cull: {
    enable: false,
   // face: 'front'
  }
}
)
)});
  main.variable(observer("object")).define("object", ["objects","model"], function(objects,model){return(
objects[+model]
)});
  main.variable(observer("objectDimensions")).define("objectDimensions", ["getScDimensions","object"], function(getScDimensions,object){return(
getScDimensions(object)
)});
  main.variable(observer()).define(["md"], function(md){return(
md `## Camera Matrices`
)});
  main.variable(observer("viewMatrix")).define("viewMatrix", ["computeViewMatrix","viewParameters","objectDimensions"], function(computeViewMatrix,viewParameters,objectDimensions){return(
computeViewMatrix([viewParameters.xAngle,viewParameters.yAngle], objectDimensions.center, objectDimensions.radius)
)});
  main.variable(observer("eyePosition")).define("eyePosition", ["computeEye","viewParameters","objectDimensions"], function(computeEye,viewParameters,objectDimensions){return(
computeEye([viewParameters.xAngle,viewParameters.yAngle], objectDimensions.center, objectDimensions.radius)
)});
  main.variable(observer("perspectiveMatrix")).define("perspectiveMatrix", ["computePerspectiveMatrix","objectDimensions","viewParameters","canvasWidth","canvasHeight"], function(computePerspectiveMatrix,objectDimensions,viewParameters,canvasWidth,canvasHeight){return(
computePerspectiveMatrix(objectDimensions.radius, viewParameters.fov, canvasWidth/canvasHeight)
)});
  main.variable(observer("inverseViewProjectionMatrix")).define("inverseViewProjectionMatrix", ["glMatrix","viewMatrix","perspectiveMatrix"], function(glMatrix,viewMatrix,perspectiveMatrix)
{
  const viewDirectionMatrix = glMatrix.mat4.copy([],viewMatrix);
  viewDirectionMatrix[12] = 
    viewDirectionMatrix[13] = 
    viewDirectionMatrix[14] = 0;
  return glMatrix.mat4.invert([],glMatrix.mat4.mul([],perspectiveMatrix,viewDirectionMatrix))
}
);
  main.variable(observer()).define(["md"], function(md){return(
md `## Utility Functions`
)});
  main.variable(observer("toRadian")).define("toRadian", ["glMatrix"], function(glMatrix){return(
glMatrix.glMatrix.toRadian
)});
  main.variable(observer("vec3")).define("vec3", ["glMatrix"], function(glMatrix){return(
glMatrix.vec3
)});
  main.variable(observer("mat4")).define("mat4", ["glMatrix"], function(glMatrix){return(
glMatrix.mat4
)});
  main.variable(observer("hex2rgb")).define("hex2rgb", function(){return(
hex => (hex = hex.replace('#', '')).match(new RegExp('(.{' + hex.length/3 + '})', 'g')).map(l =>  parseInt(hex.length%2 ? l+l : l, 16)/255)
)});
  main.variable(observer("lookAt")).define("lookAt", ["mat4"], function(mat4){return(
mat4.lookAt
)});
  main.variable(observer("perspective")).define("perspective", ["mat4"], function(mat4){return(
mat4.perspective
)});
  main.variable(observer("computeViewMatrix")).define("computeViewMatrix", ["mat4","glMatrix"], function(mat4,glMatrix){return(
(angles, center, radius) => {
  //const center = objectDimensions.center;
  const distance = 5*radius;//objectDimensions.radius;
  const xRotationMatrix = mat4.fromXRotation([],angles[0]*Math.PI/180);
  const yRotationMatrix = mat4.fromYRotation([],angles[1]*Math.PI/180);
  const rotationMatrix = mat4.multiply([],yRotationMatrix,xRotationMatrix);
  const viewDirection = glMatrix.vec3.transformMat4([],[0,0,distance],rotationMatrix);
  const eye = [center[0]+viewDirection[0], center[1]+viewDirection[1], center[2]+viewDirection[2]];
  const up = [0, 1, 0];
  return mat4.lookAt([], eye, center,[0,1,0])
}
)});
  main.variable(observer("computeEye")).define("computeEye", ["mat4","glMatrix"], function(mat4,glMatrix){return(
(angles, center, radius) => {
  //const center = objectDimensions.center;
  const distance = 5*radius;//objectDimensions.radius;
  const xRotationMatrix = mat4.fromXRotation([],angles[0]*Math.PI/180);
  const yRotationMatrix = mat4.fromYRotation([],angles[1]*Math.PI/180);
  const rotationMatrix = mat4.multiply([],yRotationMatrix,xRotationMatrix);
  const viewDirection = glMatrix.vec3.transformMat4([],[0,0,distance],rotationMatrix);
  const eye = [center[0]+viewDirection[0], center[1]+viewDirection[1], center[2]+viewDirection[2]];
  return eye;
}
)});
  main.variable(observer("computePerspectiveMatrix")).define("computePerspectiveMatrix", ["perspective","toRadian"], function(perspective,toRadian){return(
function(D, FOV, aspect){
  const near = 0.001*D;
  const far = 10*D;
  return perspective([], toRadian(FOV), aspect, near, far)
}
)});
  main.variable(observer("cameraControl")).define("cameraControl", ["vec3"], function(vec3){return(
function (canvas, refresh) {
// 
// Simple trackball controls. Attaches listeners to the canvas
// and calls refresh (mat4) anytime the user drags the mouse.
// Adapted from https://observablehq.com/@esperanc/stencil-buffer
//
  let damping = 5;
  let mouse = null;
  let xAngle = 0, yAngle = 0
  canvas.oncontextmenu = (e) => {
    e.preventDefault();
    e.stopPropagation()
  }
  canvas.onmousedown = (e) => {
    mouse = vec3.fromValues(e.offsetX,e.offsetY,0)
  }
  canvas.onmouseup = (e) => { 
    mouse = null
  }
  canvas.onmousemove = (e) => {
    if (mouse) {
      let newMouse = vec3.fromValues(e.offsetX,e.offsetY,0);
      xAngle += (newMouse[1]-mouse[1])/damping; 
      if (xAngle > 360) xAngle -= 360;
      else if (xAngle < 0) xAngle += 360;
      yAngle +=  (newMouse[0]-mouse[0])/damping;
      if (yAngle > 360) yAngle -= 360;
      else if (yAngle < 0) yAngle += 360;
      refresh ([xAngle, yAngle]);
      mouse = newMouse
    }
  }
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Create Cubemap Texture`
)});
  main.variable(observer("cubemapTexture")).define("cubemapTexture", ["regl","px","nx","py","ny","pz","nz"], function(regl,px,nx,py,ny,pz,nz){return(
regl.cube(px, nx, py, ny, pz, nz)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Load Cubemap Images.
You can use the images like you did in Texture mapping assignment.
Here is another way to load images (using getImageData). Use either of the methods.`
)});
  main.variable(observer("px")).define("px", ["getImageData","FileAttachment"], async function(getImageData,FileAttachment){return(
getImageData(await FileAttachment("px.png").blob())
)});
  main.variable(observer("nx")).define("nx", ["getImageData","FileAttachment"], async function(getImageData,FileAttachment){return(
getImageData(await FileAttachment("nx.png").blob())
)});
  main.variable(observer("py")).define("py", ["getImageData","FileAttachment"], async function(getImageData,FileAttachment){return(
getImageData(await FileAttachment("py.png").blob())
)});
  main.variable(observer("ny")).define("ny", ["getImageData","FileAttachment"], async function(getImageData,FileAttachment){return(
getImageData(await FileAttachment("ny.png").blob())
)});
  main.variable(observer("pz")).define("pz", ["getImageData","FileAttachment"], async function(getImageData,FileAttachment){return(
getImageData(await FileAttachment("pz.png").blob())
)});
  main.variable(observer("nz")).define("nz", ["getImageData","FileAttachment"], async function(getImageData,FileAttachment){return(
getImageData(await FileAttachment("nz.png").blob())
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## External Libraries and Functions`
)});
  main.variable(observer("objects")).define("objects", ["ground","teapot","cube","boy","teddy","cow","sphereLowRes"], function(ground,teapot,cube,boy,teddy,cow,sphereLowRes){return(
[
   ground, teapot, cube, boy, teddy, cow, sphereLowRes
  ]
)});
  const child1 = runtime.module(define1);
  main.import("sphereLowRes", child1);
  main.import("cube", child1);
  main.import("ground", child1);
  const child2 = runtime.module(define2);
  main.import("teapot", child2);
  main.import("boy", child2);
  main.import("teddy", child2);
  main.import("cow", child2);
  const child3 = runtime.module(define3);
  main.import("getScDimensions", child3);
  const child4 = runtime.module(define4);
  main.import("slider", child4);
  main.import("radio", child4);
  main.import("color", child4);
  const child5 = runtime.module(define5);
  main.import("columns", child5);
  const child6 = runtime.module(define6);
  main.import("getImageData", child6);
  main.variable(observer("glMatrix")).define("glMatrix", ["require"], function(require){return(
require('https://bundle.run/gl-matrix@3.3.0')
)});
  main.variable(observer("createRegl")).define("createRegl", ["require"], function(require){return(
require("regl")
)});
  return main;
}
