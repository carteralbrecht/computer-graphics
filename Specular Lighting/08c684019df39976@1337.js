import define1 from "./55faae595525622e@211.js";
import define2 from "./2180fcbe75883db9@142.js";
import define3 from "./ebae0c172bd689cc@102.js";
import define4 from "./e93997d5089d7165@2303.js";
import define5 from "./10023e7d8ddc32bc@90.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Diffuse + Specular + Ambient Lighting`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Carter Albrecht ca845545 Assignment 7`
)});
  main.variable(observer("viewof model")).define("viewof model", ["radio"], function(radio){return(
radio({
  description: 'Choose Model',
  options: [{value: 0, label: "ground"}, {value: 1, label: "house"}, {value: 2, label: "teapot"}],
  value: 2
})
)});
  main.variable(observer("model")).define("model", ["Generators", "viewof model"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function(md){return(
md `### Choose Camera parameters`
)});
  main.variable(observer("viewof viewParameters")).define("viewof viewParameters", ["columns","slider"], function(columns,slider){return(
columns({
 eyeDistance: slider({
    min: 0.1, 
    max: 10, 
    step: 0.1, 
    value: 3, 
    title: "Eye Distance from the Scene Center",
    description: "Distance relative to Scene Dimension"
  }),
  xAngle: slider({
    min: -89, 
    max: 89, 
    step: 1, 
    value: -45, 
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
  fov: slider({
    min: 15, 
    max: 120, 
    step: 1, 
    value: 45, 
    title: "Vertical FOV in Degrees",
  })
})
)});
  main.variable(observer("viewParameters")).define("viewParameters", ["Generators", "viewof viewParameters"], (G, _) => G.input(_));
  main.variable(observer("viewof colorReflectionShiny")).define("viewof colorReflectionShiny", ["columns","color","slider"], function(columns,color,slider){return(
columns({
  materialColor: color({
    value: "#ffffff",
    description:"Material Color"
  }),
  specularColor: color({
    value: "#a21515",
    description:"Specular Color"
  }),
  k_s: slider({
    min: 0.1, 
    max: 1, 
    step: 0.1, 
    value: 0.4, 
    title: "k_s",
    description: "Fraction of reflection due to Specular Property"
  }),
  shininess: slider({
    min: 1, 
    max: 50, 
    step: 1, 
    value: 22, 
    title: "Shininess"
  }),
})
)});
  main.variable(observer("colorReflectionShiny")).define("colorReflectionShiny", ["Generators", "viewof colorReflectionShiny"], (G, _) => G.input(_));
  main.variable(observer("myCanvas")).define("myCanvas", ["html","canvasWidth","canvasHeight"], function(html,canvasWidth,canvasHeight){return(
html `<canvas width=${canvasWidth}, height=${canvasHeight}/>`
)});
  main.variable(observer("viewof lightParameters")).define("viewof lightParameters", ["columns","slider"], function(columns,slider){return(
columns({
  lightOrientation : slider({
    min: -90, 
    max: 90, 
    step: 1, 
    value: 0, 
    description: "Orientation of Light Position/Direction"
  }),
  lightDistance : slider({
    min: 0, 
    max: 2, 
    step: 0.1, 
    value: 0.5, 
    description: "Relative Distance of Point Light from the Center"
  })
})
)});
  main.variable(observer("lightParameters")).define("lightParameters", ["Generators", "viewof lightParameters"], (G, _) => G.input(_));
  main.variable(observer("canvasWidth")).define("canvasWidth", function(){return(
760
)});
  main.variable(observer("canvasHeight")).define("canvasHeight", function(){return(
400
)});
  main.variable(observer()).define(["createRegl","myCanvas","renderableObject"], function(createRegl,myCanvas,renderableObject)
{
  const regl = createRegl({canvas:myCanvas});
  regl.clear({color: [0.5, 0.5, 0.6, 1]});

  const renderObject = regl(renderableObject);

  renderObject();
  
  return `Main Rendering`
}
);
  main.variable(observer("renderableObject")).define("renderableObject", ["object","hex2rgb","colorReflectionShiny","lightPosition","viewMatrix","perspectiveMatrix","eyePosition"], function(object,hex2rgb,colorReflectionShiny,lightPosition,viewMatrix,perspectiveMatrix,eyePosition){return(
{
  vert: `precision mediump float;

    attribute vec3 position;
    attribute vec3 normal;

    uniform mat4 viewMatrix; // Constants that must be set before the render call.
    uniform mat4 projectionMatrix;

    varying vec3 fragNormal; // Data Sent to Fragment shader
    varying vec3 fragPosition;

    void main () {
      gl_PointSize = 2.0;
      vec4 mPosition = vec4(position, 1); // modelMatrix*vec4(position, 1); 
      fragPosition   = mPosition.xyz;
      fragNormal  = normalize(normal); // normalize(normalMatrix*normal)
                                       // You must normalize it here before sending to Fragment shader.
      gl_Position = projectionMatrix * viewMatrix * mPosition;
    }`,
  frag: `precision mediump float;

    uniform vec3 materialColor; // Constants that must be set before the render call.
    uniform vec4 light;
    uniform vec3 specularColor;
    uniform float shininess;
    uniform vec3 eyePosition;
    uniform float k_s;

    varying vec3 fragNormal; // Data Received from Vertex Shader. Gets interpolated on the way by Rasterizer.
    varying vec3 fragPosition;

    vec3 computeColor(){
      vec3 N = normalize(fragNormal); // You must normalize fragNormal in Fragment shader before using it.
      vec3 L = normalize(light.xyz - fragPosition);
      vec3 V = normalize(eyePosition - fragPosition);
      vec3 H = normalize(L + V);
      
      vec3 colorDueToSpecularReflection = specularColor * pow(clamp(dot(N, H), 0., 1.), shininess);
      vec3 colorDueToDiffuseReflection = materialColor*clamp(dot(L,N),0.,1.);
      vec3 colorDueToAmbientLightReflection = 0.1 * materialColor;

      return colorDueToAmbientLightReflection + (1. - k_s)*colorDueToDiffuseReflection + k_s*colorDueToSpecularReflection;
    }
    void main () {
      vec3 color = computeColor();
      gl_FragColor = vec4(color, 1);
    }`,
  attributes: {
    position: object.positions, // Mesh data. 
    normal:   object.normals    // Only vertex shader can receive this data.
  },
  elements: object.cells,
  uniforms:{  // All the Uniform constants used in Shader program must be set here before making a render call.
    materialColor: hex2rgb(colorReflectionShiny.materialColor),
    light: [...lightPosition,1],
    viewMatrix: viewMatrix,
    projectionMatrix: perspectiveMatrix,
    shininess: colorReflectionShiny.shininess,
    k_s: colorReflectionShiny.k_s,
    eyePosition: eyePosition,
    specularColor: hex2rgb(colorReflectionShiny.specularColor),
  }
}
)});
  main.variable(observer("lightDirection")).define("lightDirection", ["glMatrix","toRadian","lightParameters"], function(glMatrix,toRadian,lightParameters){return(
glMatrix.vec3.rotateZ([],[0,1,0],[0,0,0],toRadian(lightParameters.lightOrientation))
)});
  main.variable(observer("lightPosition")).define("lightPosition", ["lightParameters","objectDimensions","glMatrix","lightDirection"], function(lightParameters,objectDimensions,glMatrix,lightDirection)
{
  const D = lightParameters.lightDistance*objectDimensions.radius;
  return glMatrix.vec3.scaleAndAdd([], objectDimensions.center, lightDirection, D);
}
);
  main.variable(observer("lightModelMatrix")).define("lightModelMatrix", ["objectDimensions","mat4","lightPosition"], function(objectDimensions,mat4,lightPosition)
{
  const s = objectDimensions.radius/20;
  const scaleMatrix = mat4.fromScaling([],[s,s,s]);
  const translationMatrix = mat4.fromTranslation([],lightPosition);
  //return translationMatrix
  return mat4.mul([],translationMatrix,scaleMatrix); // Light is centered at origin.
}
);
  main.variable(observer()).define(["md"], function(md){return(
md `## Rendered Object`
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
  main.variable(observer("lightObject")).define("lightObject", ["sphereLowRes"], function(sphereLowRes){return(
sphereLowRes
)});
  main.variable(observer("viewMatrix")).define("viewMatrix", ["objectDimensions","viewParameters","vec3","rotationMatrix","lookAt"], function(objectDimensions,viewParameters,vec3,rotationMatrix,lookAt)
{
  const center = objectDimensions.center;
  const D = viewParameters.eyeDistance*objectDimensions.radius;
  const viewDirection = vec3.transformMat4([],[0,0,1],rotationMatrix);
  const eye = vec3.scaleAndAdd([],center,viewDirection, D);
  const up = [0, 1, 0];
  return lookAt([], eye, center, [0,1,0])
}
);
  main.variable(observer("eyePosition")).define("eyePosition", ["objectDimensions","viewParameters","vec3","rotationMatrix"], function(objectDimensions,viewParameters,vec3,rotationMatrix)
{
  const center = objectDimensions.center;
  const D = viewParameters.eyeDistance*objectDimensions.radius;
  const viewDirection = vec3.transformMat4([],[0,0,1],rotationMatrix);
  const eye = vec3.scaleAndAdd([],center,viewDirection, D);
  return eye
}
);
  main.variable(observer("rotationMatrix")).define("rotationMatrix", ["mat4","yRotationMatrix","xRotationMatrix"], function(mat4,yRotationMatrix,xRotationMatrix){return(
mat4.multiply([],yRotationMatrix,xRotationMatrix)
)});
  main.variable(observer("yRotationMatrix")).define("yRotationMatrix", ["mat4","toRadian","viewParameters"], function(mat4,toRadian,viewParameters){return(
mat4.fromYRotation([],toRadian(viewParameters.yAngle))
)});
  main.variable(observer("xRotationMatrix")).define("xRotationMatrix", ["mat4","toRadian","viewParameters"], function(mat4,toRadian,viewParameters){return(
mat4.fromXRotation([],toRadian(viewParameters.xAngle))
)});
  main.variable(observer("perspectiveMatrix")).define("perspectiveMatrix", ["canvasWidth","canvasHeight","objectDimensions","perspective","toRadian","viewParameters"], function(canvasWidth,canvasHeight,objectDimensions,perspective,toRadian,viewParameters)
{
  const aspect = canvasWidth/canvasHeight;
  const radius = objectDimensions.radius;
  const near = 0.001*radius;
  const far = 10*radius;
  return perspective([], toRadian(viewParameters.fov), aspect, near, far)
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
  main.variable(observer()).define(["md"], function(md){return(
md`## External Libraries and Functions`
)});
  main.variable(observer("objects")).define("objects", ["ground","house","teapot","cube","beachHouse","dollHouse","watchTower","boy","teddy","cow"], function(ground,house,teapot,cube,beachHouse,dollHouse,watchTower,boy,teddy,cow){return(
[
   ground, house, teapot, cube, beachHouse, dollHouse, watchTower, boy, teddy, cow
  ]
)});
  const child1 = runtime.module(define1);
  main.import("sphereLowRes", child1);
  main.import("cube", child1);
  main.import("beachHouse", child1);
  main.import("dollHouse", child1);
  main.import("house", child1);
  main.import("watchTower", child1);
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
  main.variable(observer("glMatrix")).define("glMatrix", ["require"], function(require){return(
require('https://bundle.run/gl-matrix@3.3.0')
)});
  main.variable(observer("createRegl")).define("createRegl", ["require"], function(require){return(
require("regl")
)});
  return main;
}
