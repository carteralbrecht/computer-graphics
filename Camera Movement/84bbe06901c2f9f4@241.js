import define1 from "./e93997d5089d7165@2303.js";
import define2 from "./55faae595525622e@211.js";
import define3 from "./10023e7d8ddc32bc@90.js";
import define4 from "./ebae0c172bd689cc@102.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Using the REGL Camera`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Carter Albrecht ca845545 Assignment 5`
)});
  main.variable(observer("viewof model")).define("viewof model", ["radio"], function(radio){return(
radio({
   description: 'Choose which model you would like to use',
   options: ['beachHouse', 'dollHouse', 'house', 'watchTower'],
   value: 'watchTower'
})
)});
  main.variable(observer("model")).define("model", ["Generators", "viewof model"], (G, _) => G.input(_));
  main.variable(observer("viewof fov_distance")).define("viewof fov_distance", ["columns","slider"], function(columns,slider){return(
columns({
  fov: slider({min: 15, max: 100, step: 1, title: "Vertical Field of View", value: 15}),
  eye_distance: slider({min: 0, max: 10, step: 0.1, title: "Eye Distance from Center", value: 6})
})
)});
  main.variable(observer("fov_distance")).define("fov_distance", ["Generators", "viewof fov_distance"], (G, _) => G.input(_));
  main.variable(observer()).define(["DOM","canvasHeight","canvasWidth","createRegl","createCamera","objectDimensions","fov_distance","glMatrix","primitive","frag","vert","modelChosen","invalidation"], function(DOM,canvasHeight,canvasWidth,createRegl,createCamera,objectDimensions,fov_distance,glMatrix,primitive,frag,vert,modelChosen,invalidation)
{
  const myCanvas = DOM.canvas(canvasHeight, canvasWidth);
  const regl = createRegl({canvas:myCanvas});
  regl.clear({color: [0.5, 0.5, 0.6, 1]});
  
  const camera = createCamera(regl, {
    center: objectDimensions.center,
    distance: fov_distance.eye_distance * objectDimensions.radius,
    fovy: glMatrix.glMatrix.toRadian(fov_distance.fov),
    noScroll: true,
    });

  const render = regl({
    primitive: primitive,

    frag: frag,
    vert: vert,

    attributes: {
      position: modelChosen.positions,
      normal: modelChosen.normals
    },
    
    elements: modelChosen.cells
  });

  const frame = regl.frame(() => {
     camera((state) => {
          if (!state.dirty) return;
          regl.clear({color: [0.5, 0.5, 0.6, 1]})
          render();
     })
  })
  invalidation.then(() => frame.cancel());

  return myCanvas;
}
);
  main.variable(observer("viewof primitive")).define("viewof primitive", ["radio"], function(radio){return(
radio({
  description: 'Choose primitive',
  options: ['triangles', 'points'],
  value: 'triangles'
})
)});
  main.variable(observer("primitive")).define("primitive", ["Generators", "viewof primitive"], (G, _) => G.input(_));
  main.variable(observer("vert")).define("vert", function(){return(
`
precision mediump float;
attribute vec3 position;
attribute vec3 normal;
uniform mat4 view;
uniform mat4 projection;
varying vec3 fragNormal;
void main()
{
  fragNormal = abs(mat4(1) * vec4(normal, 0)).xyz;
  gl_PointSize = 2.0;
  gl_Position = projection * view * mat4(1) * vec4(position, 1);
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
  main.variable(observer("objectDimensions")).define("objectDimensions", ["getScDimensions","modelChosen"], function(getScDimensions,modelChosen){return(
getScDimensions(modelChosen)
)});
  main.variable(observer("modelChosen")).define("modelChosen", ["model","beachHouse","dollHouse","house","watchTower"], function(model,beachHouse,dollHouse,house,watchTower)
{
  switch(model)
  {
    case 'beachHouse': return beachHouse; break;
    case 'dollHouse': return dollHouse; break;
    case 'house': return house; break;
    case 'watchTower': return watchTower; break;
  }
}
);
  main.variable(observer("createCamera")).define("createCamera", ["require"], function(require){return(
require('https://bundle.run/regl-camera@2.1.1')
)});
  main.variable(observer("canvasHeight")).define("canvasHeight", function(){return(
760
)});
  main.variable(observer("canvasWidth")).define("canvasWidth", function(){return(
400
)});
  main.variable(observer("glMatrix")).define("glMatrix", ["require"], function(require){return(
require('https://bundle.run/gl-matrix@3.3.0')
)});
  main.variable(observer("createRegl")).define("createRegl", ["require"], function(require){return(
require("regl")
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Imports`
)});
  const child1 = runtime.module(define1);
  main.import("slider", child1);
  main.import("radio", child1);
  const child2 = runtime.module(define2);
  main.import("beachHouse", child2);
  main.import("dollHouse", child2);
  main.import("house", child2);
  main.import("watchTower", child2);
  const child3 = runtime.module(define3);
  main.import("columns", child3);
  const child4 = runtime.module(define4);
  main.import("getScDimensions", child4);
  return main;
}
