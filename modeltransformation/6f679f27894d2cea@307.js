import define1 from "./e93997d5089d7165@2285.js";
import define2 from "./2180fcbe75883db9@102.js";
import define3 from "./10023e7d8ddc32bc@90.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Mesh Rendering using WebGL/REGL`
)});
  main.variable(observer()).define(["md"], function(md){return(
md` ## Assignment 3 Carter Albrecht ca845545`
)});
  main.variable(observer("viewof model")).define("viewof model", ["radio"], function(radio){return(
radio({
   description: 'Choose the model',
   options: ['teapot', 'boy', 'teddy', 'cow', 'windmill'],
   value: 'cow'
})
)});
  main.variable(observer("model")).define("model", ["Generators", "viewof model"], (G, _) => G.input(_));
  main.variable(observer("viewof translate")).define("viewof translate", ["columns","slider"], function(columns,slider){return(
columns({
  x: slider({min: -0.5, max: 0.5, step: 0.1, title: "Translate along X-axis", value: 0}),
  y: slider({min: -0.5, max: 0.5, step: 0.1, title: "Translate along Y-axis", value: 0}),
  z: slider({min: -0.5, max: 0.5, step: 0.1, title: "Translate along Z-axis", value: 0})
})
)});
  main.variable(observer("translate")).define("translate", ["Generators", "viewof translate"], (G, _) => G.input(_));
  main.variable(observer("viewof rotation")).define("viewof rotation", ["columns","slider"], function(columns,slider){return(
columns({
  x: slider({min: 0, max: 360, step: 1, title: "Rotation around X-axis", value: 0}),
  y: slider({min: 0, max: 360, step: 1, title: "Rotation around Y-axis", value: 0}),
  z: slider({min: 0, max: 360, step: 1, title: "Rotation around Z-axis", value: 0})
})
)});
  main.variable(observer("rotation")).define("rotation", ["Generators", "viewof rotation"], (G, _) => G.input(_));
  main.variable(observer("viewof scale")).define("viewof scale", ["columns","slider"], function(columns,slider){return(
columns({
  x: slider({min: 0, max: 2, title: "Scale along X-axis", value: 1}),
  y: slider({min: 0, max: 2, title: "Scale along Y-axis", value: 1}),
  z: slider({min: 0, max: 2, title: "Scale along Z-axis", value: 1})
})
)});
  main.variable(observer("scale")).define("scale", ["Generators", "viewof scale"], (G, _) => G.input(_));
  main.variable(observer()).define(["DOM","createRegl","primitive","frag","vert","modelChosen","modelMatrix"], function(DOM,createRegl,primitive,frag,vert,modelChosen,modelMatrix)
{
const myCanvas = DOM.canvas(760,400);
const regl = createRegl({canvas:myCanvas});
regl.clear({color: [0.5, 0.5, 0.6, 1]});

const render = regl({
primitive: primitive,
  
frag: frag,
  
vert: vert,

attributes: 
{
  position: modelChosen.positions,
  normal: modelChosen.normals
},
  
uniforms:
  {
    aspect: ctx => [ctx.viewportWidth /ctx.viewportHeight, 1],
    modelMatrix: modelMatrix
  },

elements: modelChosen.cells
})
  
render();
  
return myCanvas;
}
);
  main.variable(observer("viewof primitive")).define("viewof primitive", ["radio"], function(radio){return(
radio({
   description: 'Choose render mode',
   options: ["points","triangles"],
   value: 'triangles'
})
)});
  main.variable(observer("primitive")).define("primitive", ["Generators", "viewof primitive"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function(md){return(
md `## Matricies`
)});
  main.variable(observer("translationMatrix")).define("translationMatrix", ["glMatrix","translate"], function(glMatrix,translate){return(
glMatrix.mat4.fromTranslation([], Object.values(translate))
)});
  main.variable(observer("scalingMatrix")).define("scalingMatrix", ["glMatrix","scale"], function(glMatrix,scale){return(
glMatrix.mat4.fromScaling([], Object.values(scale))
)});
  main.variable(observer("xRotationMatrix")).define("xRotationMatrix", ["rotation"], function(rotation)
{
  let theta = rotation.x * (Math.PI / 180);

  return [1,               0,                 0,  0,
          0, Math.cos(theta),  -Math.sin(theta),  0,
          0, Math.sin(theta),   Math.cos(theta),  0,
          0,               0,                  0, 1,];
}
);
  main.variable(observer("yRotationMatrix")).define("yRotationMatrix", ["rotation"], function(rotation)
{
  let theta = rotation.y * (Math.PI / 180);
  
  return [Math.cos(theta),    0,    Math.sin(theta),   0,
                        0,    1,                  0,   0,
         -Math.sin(theta),    0,    Math.cos(theta),   0,
                        0,    0,                  0,   1,];
}
);
  main.variable(observer("zRotationMatrix")).define("zRotationMatrix", ["rotation"], function(rotation)
{
  let theta = rotation.z * (Math.PI / 180);
  
  return [Math.cos(theta),       -Math.sin(theta),             0,          0,
          Math.sin(theta),        Math.cos(theta),             0,          0,
                        0,                      0,             1,          0,
                        0,                      0,             0,          1,];
}
);
  main.variable(observer("rotationMatrix")).define("rotationMatrix", ["glMatrix","zRotationMatrix","yRotationMatrix","xRotationMatrix"], function(glMatrix,zRotationMatrix,yRotationMatrix,xRotationMatrix){return(
glMatrix.mat4.multiply([], glMatrix.mat4.multiply([], zRotationMatrix, yRotationMatrix), xRotationMatrix)
)});
  main.variable(observer("modelMatrix")).define("modelMatrix", ["glMatrix","translationMatrix","rotationMatrix","scalingMatrix"], function(glMatrix,translationMatrix,rotationMatrix,scalingMatrix){return(
glMatrix.mat4.multiply([], glMatrix.mat4.multiply([], translationMatrix, rotationMatrix), scalingMatrix)
)});
  main.variable(observer()).define(["md"], function(md){return(
md `## Shader Code and important variables`
)});
  main.variable(observer("vert")).define("vert", function(){return(
`
precision mediump float;
attribute vec3 position;
attribute vec3 normal;
uniform mat4 view
uniform mat4 projection;
varying vec3 fragNormal;
void main()
{
  
  mat4 model = mat4(1);
  fragNormal = abs(modelMatrix * vec4(normal, 0)).xyz;
  gl_PointSize = 2.0;
  gl_Position = projection * view * model * vec4(position, 1);
}
`
)});
  main.variable(observer("frag")).define("frag", function(){return(
`
precision mediump float;
varying vec3 fragNormal;
void main()
{
  gl_FragColor = vec4(abs(fragNormal), 1);
}
`
)});
  main.variable(observer("modelChosen")).define("modelChosen", ["model","teapot","boy","teddy","cow","windmill"], function(model,teapot,boy,teddy,cow,windmill)
{
  switch(model)
  {
    case 'teapot': return teapot; break;
    case 'boy': return boy; break;
    case 'teddy': return teddy; break;
    case 'cow': return cow; break;
    case 'windmill': return windmill; break;
  }
}
);
  main.variable(observer("createRegl")).define("createRegl", ["require"], function(require){return(
require("regl")
)});
  main.variable(observer("glMatrix")).define("glMatrix", ["require"], function(require){return(
require('https://bundle.run/gl-matrix@3.3.0')
)});
  main.variable(observer()).define(["md"], function(md){return(
md `## Imports `
)});
  const child1 = runtime.module(define1);
  main.import("slider", child1);
  main.import("radio", child1);
  const child2 = runtime.module(define2);
  main.import("scaledTeapot", "teapot", child2);
  main.import("scaledBoy", "boy", child2);
  main.import("scaledTeddy", "teddy", child2);
  main.import("scaledCow", "cow", child2);
  main.import("scaledWindmill", "windmill", child2);
  const child3 = runtime.module(define3);
  main.import("columns", child3);
  return main;
}
