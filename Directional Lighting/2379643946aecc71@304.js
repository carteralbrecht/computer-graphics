import define1 from "./e93997d5089d7165@2303.js";
import define2 from "./55faae595525622e@211.js";
import define3 from "./10023e7d8ddc32bc@90.js";
import define4 from "./ebae0c172bd689cc@102.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Assignment 6 Directional/Point Lighting`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Carter Albrecht ca845545`
)});
  main.variable(observer("viewof rotation")).define("viewof rotation", ["columns","slider"], function(columns,slider){return(
columns({
  x_rotation: slider({min: -90, max: 90, step: 1, title: "Rotation around X-axis", value: 0}),
  y_rotation: slider({min: -90, max: 90, step: 1, title: "Rotation around Y-axis", value: 0}),
  // z_rotation: slider({min: -180, max: 180, step: 1, title: "Up angle", value: 0})
})
)});
  main.variable(observer("rotation")).define("rotation", ["Generators", "viewof rotation"], (G, _) => G.input(_));
  main.variable(observer("viewof fov_distance_up")).define("viewof fov_distance_up", ["columns","slider"], function(columns,slider){return(
columns({
  fov: slider({min: 15, max: 100, step: 1, title: "Vertical Field of View", value: 15}),
  eye_distance: slider({min: 0, max: 10, step: 0.1, title: "Eye Distance from Center", value: 6}),
  up: slider({min: -90, max: 90, step: 1, title: "Up angle (Z-rotation)", value: 0})
})
)});
  main.variable(observer("fov_distance_up")).define("fov_distance_up", ["Generators", "viewof fov_distance_up"], (G, _) => G.input(_));
  main.variable(observer("viewof lightPositionDirection")).define("viewof lightPositionDirection", ["slider"], function(slider){return(
slider({min: -90, max: 90, step: 1, title: "Light Position/Direction", value: 0})
)});
  main.variable(observer("lightPositionDirection")).define("lightPositionDirection", ["Generators", "viewof lightPositionDirection"], (G, _) => G.input(_));
  main.variable(observer("viewof lightingMode")).define("viewof lightingMode", ["radio"], function(radio){return(
radio({
   description: 'Choose Lighting Mode',
   options: ["Directional", "Point"],
   value: "Directional"
})
)});
  main.variable(observer("lightingMode")).define("lightingMode", ["Generators", "viewof lightingMode"], (G, _) => G.input(_));
  main.variable(observer("viewof materialColor")).define("viewof materialColor", ["color"], function(color){return(
color({
  value: "#97e7c1",
  description: "Material Color"
})
)});
  main.variable(observer("materialColor")).define("materialColor", ["Generators", "viewof materialColor"], (G, _) => G.input(_));
  main.variable(observer()).define(["DOM","canvasHeight","canvasWidth","createRegl","frag","vert","modelChosen","viewMatrix","perspectiveMatrix","hex2rgb","materialColor","lightVector"], function(DOM,canvasHeight,canvasWidth,createRegl,frag,vert,modelChosen,viewMatrix,perspectiveMatrix,hex2rgb,materialColor,lightVector)
{
  const myCanvas = DOM.canvas(canvasHeight, canvasWidth);
  const regl = createRegl({canvas:myCanvas});
  regl.clear({color: [0.5, 0.5, 0.6, 1]});

  const render = regl({
    primitive: 'triangles',

    frag: frag,
    vert: vert,

    attributes: {
      position: modelChosen.positions,
      normal: modelChosen.normals
    },

    uniforms: {
      viewMatrix: viewMatrix,
      projectionMatrix: perspectiveMatrix,
      materialColor: hex2rgb(materialColor),
      light: lightVector
    },

    elements: modelChosen.cells
  })

  render();

  return myCanvas;
}
);
  main.variable(observer("canvasHeight")).define("canvasHeight", function(){return(
760
)});
  main.variable(observer("canvasWidth")).define("canvasWidth", function(){return(
400
)});
  main.variable(observer("lightPosition")).define("lightPosition", ["lightPositionDirection"], function(lightPositionDirection){return(
[0, lightPositionDirection, 0]
)});
  main.variable(observer("lightVector")).define("lightVector", ["lightingMode","glMatrix","lightPositionDirection"], function(lightingMode,glMatrix,lightPositionDirection)
{
  if (lightingMode == "Directional")
  {
    var vec3 = glMatrix.vec3.rotateZ([], [0, 1, 0], [0, 0, 0], glMatrix.glMatrix.toRadian(lightPositionDirection));
    vec3.push(0);
    return vec3;
  }
  else
    return [0, 400 + lightPositionDirection, 0, 1];
}
);
  main.variable(observer("frag")).define("frag", function(){return(
`
precision mediump float;
varying vec3 fragNormal;
varying vec3 fragPosition;
uniform vec3 materialColor;
uniform vec4 light;
vec3 computeColor(){
  vec3 lightVector = light.xyz;
  if (light.w > 0.) lightVector = light.xyz - fragPosition;
  return materialColor * clamp(dot(normalize(lightVector), normalize(fragNormal)), 0., 1.);
}
void main()
{
  vec3 color = computeColor();
  gl_FragColor = vec4(color, 1);
}
`
)});
  main.variable(observer("vert")).define("vert", function(){return(
`
attribute vec3 position;
attribute vec3 normal;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
varying vec3 fragNormal, fragPosition;
void main()
{
  vec4 mPosition = vec4(position, 1.0);
  fragPosition = mPosition.xyz;
  fragNormal = normalize(normal);
  gl_Position = projectionMatrix * viewMatrix * mPosition;
}
`
)});
  main.variable(observer("modelChosen")).define("modelChosen", ["house"], function(house){return(
house
)});
  main.variable(observer("objectDimensions")).define("objectDimensions", ["getScDimensions","modelChosen"], function(getScDimensions,modelChosen){return(
getScDimensions(modelChosen)
)});
  main.variable(observer("viewMatrix")).define("viewMatrix", ["objectDimensions","fov_distance_up","glMatrix","rotationMatrix"], function(objectDimensions,fov_distance_up,glMatrix,rotationMatrix)
{
  const center = objectDimensions.center;
  const distance = fov_distance_up.eye_distance * objectDimensions.radius;
  const viewDirection = glMatrix.vec3.transformMat4([], [0, 0, distance], rotationMatrix);
  const eye = [center[0] + viewDirection[0], center[1] + viewDirection[1], center[2] + viewDirection[2]];
  const up = glMatrix.vec3.rotateZ([], [0,1,0], [0,0,0], glMatrix.glMatrix.toRadian(fov_distance_up.up));
  return glMatrix.mat4.lookAt([], eye, center, up);
}
);
  main.variable(observer("yRotationMatrix")).define("yRotationMatrix", ["rotation"], function(rotation)
{
  let theta = rotation.y_rotation * (Math.PI / 180);
  
  return [Math.cos(theta),    0,    Math.sin(theta),   0,
                        0,    1,                  0,   0,
         -Math.sin(theta),    0,    Math.cos(theta),   0,
                        0,    0,                  0,   1,];
}
);
  main.variable(observer("xRotationMatrix")).define("xRotationMatrix", ["rotation"], function(rotation)
{
  let theta = rotation.x_rotation * (Math.PI / 180);

  return [1,               0,                 0,  0,
          0, Math.cos(theta),  -Math.sin(theta),  0,
          0, Math.sin(theta),   Math.cos(theta),  0,
          0,               0,                  0, 1,];
}
);
  main.variable(observer("perspectiveMatrix")).define("perspectiveMatrix", ["canvasHeight","canvasWidth","objectDimensions","glMatrix","fov_distance_up"], function(canvasHeight,canvasWidth,objectDimensions,glMatrix,fov_distance_up)
{
  let aspect = canvasHeight / canvasWidth;
  let radius = objectDimensions.radius;
  return glMatrix.mat4.perspective([], glMatrix.glMatrix.toRadian(fov_distance_up.fov), aspect, 0.001 * radius, 10 * radius);
}
);
  main.variable(observer("rotationMatrix")).define("rotationMatrix", ["glMatrix","yRotationMatrix","xRotationMatrix"], function(glMatrix,yRotationMatrix,xRotationMatrix){return(
glMatrix.mat4.multiply([], yRotationMatrix, xRotationMatrix)
)});
  main.variable(observer("hex2rgb")).define("hex2rgb", function(){return(
hex => (hex = hex.replace('#', '')).match(new RegExp('(.{' + hex.length/3 + '})', 'g')).map(l =>  parseInt(hex.length%2 ? l+l : l, 16)/255)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Imports`
)});
  const child1 = runtime.module(define1);
  main.import("slider", child1);
  main.import("radio", child1);
  main.import("color", child1);
  const child2 = runtime.module(define2);
  main.import("beachHouse", child2);
  main.import("dollHouse", child2);
  main.import("house", child2);
  main.import("watchTower", child2);
  const child3 = runtime.module(define3);
  main.import("columns", child3);
  const child4 = runtime.module(define4);
  main.import("getScDimensions", child4);
  main.variable(observer("glMatrix")).define("glMatrix", ["require"], function(require){return(
require('https://bundle.run/gl-matrix@3.3.0')
)});
  main.variable(observer("createRegl")).define("createRegl", ["require"], function(require){return(
require("regl")
)});
  return main;
}
