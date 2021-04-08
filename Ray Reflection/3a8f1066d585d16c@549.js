// https://observablehq.com/@spattana/stenciling-example@549
import define1 from "./fe416d2046e29a11@321.js";
import define2 from "./b4c6c19b9d0b1c64@1493.js";
import define3 from "./55faae595525622e@211.js";
import define4 from "./ebae0c172bd689cc@102.js";
import define5 from "./10023e7d8ddc32bc@90.js";
import define6 from "./e93997d5089d7165@2303.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["snowFlake2D.json",new URL("./files/b1693a8734d4269c7859934324db455024fe2fe9c7b9b1edf489f2e8aab50b569ae61fae67b1964be139c812f78fb2315f2ca045fc26e9084f17637581ed5946",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Stenciling Example
Texture Image used: [Mozilla Logo](https://www.mozilla.org/en-US/MPL/2.0/).  
Stencil Produced using: [Vectorize-Text library](https://www.npmjs.com/package/vectorize-text).
WebGL rendering using: [REGL library](https://github.com/regl-project/regl).  
(See @esperanc/stencil-buffer for Projection Shadow and Mirror reflection computation using Stenciling. I have borrowed "drawMasked" and "drawStenciled" functions from that notebook.`
)});
  main.variable(observer("viewof pattern")).define("viewof pattern", ["radio"], function(radio){return(
radio ({
  options: [
    {label: "Triangle", value: 0}, 
    //{label: "Text", value: 1},
    {label: "Snow Flake", value: 2}, 
  ], 
  value:2,
  description:"Choose a Stencil Pattern"
})
)});
  main.variable(observer("pattern")).define("pattern", ["Generators", "viewof pattern"], (G, _) => G.input(_));
  main.variable(observer("viewof options")).define("viewof options", ["radio"], function(radio){return(
radio ({
  options: [
    {label: "Show Stencil Pattern", value: 0}, 
    {label: "Show Textured Cube Over the Blank Canvas", value: 1},
    {label: "Draw Textured Cube Over over the Stencil", value: 2}, 
  ], 
  value:2,
  description:"Choose render option"
})
)});
  main.variable(observer("options")).define("options", ["Generators", "viewof options"], (G, _) => G.input(_));
  main.variable(observer("myCanvas")).define("myCanvas", ["html","canvasWidth","canvasHeight"], function(html,canvasWidth,canvasHeight){return(
html `<canvas width=${canvasWidth}, height=${canvasHeight}/>`
)});
  main.variable(observer()).define(["regl","cubeRenderable","stencilRenderable","computeViewMatrix","cubeDimensions","options","drawMask","drawStenciled","cameraControl","myCanvas"], function(regl,cubeRenderable,stencilRenderable,computeViewMatrix,cubeDimensions,options,drawMask,drawStenciled,cameraControl,myCanvas)
{
  const drawCube = regl(cubeRenderable);
  const drawPattern = regl(stencilRenderable);
  const refresh = (angles=[0,0]) => {
    const view = computeViewMatrix(angles, cubeDimensions.center, cubeDimensions.radius);
    regl.clear({
        color: [0,0,0,1],
        depth: 1,
        stencil: 0
      });
    switch (+options){
      case 0: drawPattern();
        break;
      case 1: drawCube({viewMatrix: view}); 
        break;
      case 2:
        drawMask( () => {
          drawPattern();
        })
        drawStenciled( () => {
          drawCube({viewMatrix: view});
        });
        break;
    }
  }
  refresh();
  cameraControl(myCanvas,refresh);
  return `render loop`
}
);
  main.variable(observer("stencilRenderable")).define("stencilRenderable", ["patternSc","pattern","patternViewMatrix","patternProjectionMatrix"], function(patternSc,pattern,patternViewMatrix,patternProjectionMatrix)
{
  const stencilSc = patternSc[+pattern];
  const renderable = {
  frag: `
    precision mediump float;
    void main () {
      gl_FragColor = vec4(1);
    }`,

  vert: `
    attribute vec2 position;
    uniform mat4 projection, view;
    void main () {
      gl_Position = projection * view * vec4(position, 0, 1);
    }`,

  attributes: {
    position: stencilSc.positions
  },

  uniforms: {
    view: patternViewMatrix[+pattern],
    projection: patternProjectionMatrix[+pattern]
  },
    stencil: {
      enable: true,
      mask: 0xff,
      func: {
        cmp: 'equal',
        ref: 1,
        mask: 0xff
      }
    },
    blend: {
      enable: true
    }
};
if (stencilSc.cells)
  renderable.elements = stencilSc.cells
else renderable.count = stencilSc.positions.length;
return renderable;
}
);
  main.variable(observer("cubeRenderable")).define("cubeRenderable", ["cube","regl","perspectiveMatrix","texture"], function(cube,regl,perspectiveMatrix,texture){return(
{
    vert: `
      precision mediump float;
      attribute vec3 position;
      attribute vec2 uv;
      uniform mat4 projection, view;
      varying vec2 fragUV;
      void main() {
        fragUV = uv;
        gl_Position = projection * view * vec4(position, 1);
      }`,
    frag: `
      precision mediump float;
      uniform sampler2D tex;
      uniform float alpha;
      varying vec2 fragUV;
      void main () {
        gl_FragColor = vec4(texture2D(tex,fragUV).rgb,alpha);
      }
      `, 
    attributes: {
      position: cube.positions,
      uv: cube.uvs
    },
    elements: cube.cells,
    uniforms: {
      view: regl.prop("viewMatrix"),
      projection: perspectiveMatrix,
      tex: texture,
      alpha: 1
    }

  }
)});
  main.variable(observer("cubeDimensions")).define("cubeDimensions", ["getScDimensions","cube"], function(getScDimensions,cube){return(
getScDimensions(cube)
)});
  main.variable(observer("viewof fontFamily")).define("viewof fontFamily", ["select"], function(select){return(
select({
  title: "Font Family",
  options: [
    "normal",
    "serif",
    "sans-serif",
    "monospace",
    "cursive",
    "fantasy",
    "system-ui"
  ],
  value: "serif"
})
)});
  main.variable(observer("fontFamily")).define("fontFamily", ["Generators", "viewof fontFamily"], (G, _) => G.input(_));
  main.variable(observer("snowFlake2D")).define("snowFlake2D", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("snowFlake2D.json").json()
)});
  main.variable(observer("snowFlakeDimensions")).define("snowFlakeDimensions", ["getScDimensions","snowFlake2D"], function(getScDimensions,snowFlake2D){return(
getScDimensions(snowFlake2D)
)});
  main.variable(observer("patternSc")).define("patternSc", ["snowFlake2D"], function(snowFlake2D){return(
[{positions:[[0,1],[-1,-1],[1,-1]]}, snowFlake2D/*textMesh*/, snowFlake2D]
)});
  main.variable(observer("patternViewMatrix")).define("patternViewMatrix", ["mat4"], function(mat4){return(
[mat4.create(), mat4.lookAt([],[ 0, 0, -500],[0, 0, 0], [0, -1, 0]), mat4.lookAt([],[ 0, 0, 1000],[0, 0, 0], [0, 1, 0])]
)});
  main.variable(observer("patternProjectionMatrix")).define("patternProjectionMatrix", ["mat4","canvasWidth","canvasHeight"], function(mat4,canvasWidth,canvasHeight){return(
[mat4.create(),mat4.perspective([], Math.PI / 4, canvasWidth / canvasHeight, 0.01, 1000), mat4.perspective([], Math.PI / 4, canvasWidth / canvasHeight, 500, 5000)]
)});
  main.variable(observer("texture")).define("texture", ["regl","image"], function(regl,image){return(
regl.texture({
  data: image,
  flipY: true, 
  wrap : "repeat",
  min : "mipmap",
  mag : "linear"
})
)});
  main.variable(observer("perspectiveMatrix")).define("perspectiveMatrix", ["computePerspectiveMatrix","cubeDimensions","canvasWidth","canvasHeight"], function(computePerspectiveMatrix,cubeDimensions,canvasWidth,canvasHeight){return(
computePerspectiveMatrix(cubeDimensions.radius, 20, canvasWidth/canvasHeight)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Utility Functions`
)});
  main.variable(observer("drawMask")).define("drawMask", ["regl"], function(regl){return(
regl({ // drawMask function from https://observablehq.com/@esperanc/stencil-buffer
    stencil: {
      enable: true,
      mask: 0xff,
      func: {
        cmp: 'always',
        ref: 1,
        mask: 0xff
      },
      op: {
        fail: 'replace',
        zfail: 'replace',
        zpass: 'replace'
      }
    },
    colorMask: [false, false, false, false],
    depth: {
      enable: true,
      mask: false
    }
  })
)});
  main.variable(observer("drawStenciled")).define("drawStenciled", ["regl"], function(regl){return(
regl({ // drawStenciled function from https://observablehq.com/@esperanc/stencil-buffer
    stencil: {
      enable: true,
      mask: 0xff,
      func: {
        cmp: 'equal',
        ref: 1,
        mask: 0xff
      }
    },
    blend: {
      enable: true
    }
  })
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### REGL and REGL camera`
)});
  main.variable(observer("canvasWidth")).define("canvasWidth", function(){return(
700
)});
  main.variable(observer("canvasHeight")).define("canvasHeight", function(){return(
700
)});
  main.variable(observer("regl")).define("regl", ["createRegl","myCanvas"], function(createRegl,myCanvas){return(
createRegl({
    canvas: myCanvas,
    attributes: { 
      stencil: true
    }
  })
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Libraries and Imports`
)});
  const child1 = runtime.module(define1);
  main.import("image", child1);
  const child2 = runtime.module(define2);
  main.import("cameraControl", child2);
  main.import("computeViewMatrix", child2);
  main.import("computePerspectiveMatrix", child2);
  const child3 = runtime.module(define3);
  main.import("cube", child3);
  const child4 = runtime.module(define4);
  main.import("getScDimensions", child4);
  main.import("reglScExtent", child4);
  main.import("getSCSdimensions", child4);
  const child5 = runtime.module(define5);
  main.import("columns", child5);
  const child6 = runtime.module(define6);
  main.import("slider", child6);
  main.import("radio", child6);
  main.import("checkbox", child6);
  main.import("select", child6);
  main.variable(observer("mat4")).define("mat4", ["glMatrix"], function(glMatrix){return(
glMatrix.mat4
)});
  main.variable(observer("vec3")).define("vec3", ["glMatrix"], function(glMatrix){return(
glMatrix.vec3
)});
  main.variable(observer("glMatrix")).define("glMatrix", ["require"], function(require){return(
require('https://bundle.run/gl-matrix@3.3.0')
)});
  main.variable(observer("createRegl")).define("createRegl", ["require"], function(require){return(
require("regl")
)});
  return main;
}
