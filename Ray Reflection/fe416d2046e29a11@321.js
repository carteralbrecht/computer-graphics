// https://observablehq.com/@spattana/webgl-texture-in-regl@321
import define1 from "./e93997d5089d7165@2303.js";
import define2 from "./10023e7d8ddc32bc@90.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["cubetexture.png",new URL("./files/e26f3951ea0eb8e78d10f2e99d6c6f9797a9b51b192b136d64fce8e0c63d41b160cf9e9ad2f48c2f1764f61cfa5c9a4ad1765ed2d32125d3d99eaeabbd05dd28",import.meta.url)],["cubemaps_skybox.png",new URL("./files/32c6a9ae9fea9b59ebd914bb6b3bce492af33731c821853c8a0dec3ae112767c5bdb3ebdc2b8d86252db31aff8fa148fc2e04f187108fc6e9a42e179ec3e147e",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# WebGL Texture in REGL
Texture Image used: [Mozilla Logo](https://www.mozilla.org/en-US/MPL/2.0/).`
)});
  main.variable(observer("image")).define("image", ["image_from_URL","FileAttachment"], async function(image_from_URL,FileAttachment){return(
image_from_URL(await FileAttachment("cubetexture.png").url())
)});
  main.variable(observer("viewof textureOptions")).define("viewof textureOptions", ["columns","slider","radio"], function(columns,slider,radio){return(
columns({
  scale : slider({
    min: -8, 
    max: 8, 
    step: 1, 
    value: 0, 
    title: "logtexture scale." 
  }),  
  wrap : radio({
    title: 'Wrap Options',
    options: [ "clamp", "mirror","repeat"],
    value: "repeat"
  }),
  minfilter :  radio({
    title: 'Minimization Options',
    options: [ "nearest", "linear","mipmap"],
    value: "mipmap"
  }),
  magfilter :  radio({
    title: 'Magnification Options',
    options: [ "nearest", "linear"],
    value: "linear"
  })
})
)});
  main.variable(observer("textureOptions")).define("textureOptions", ["Generators", "viewof textureOptions"], (G, _) => G.input(_));
  main.variable(observer("myCanvas")).define("myCanvas", ["DOM","canvasWidth","canvasHeight"], function(DOM,canvasWidth,canvasHeight){return(
DOM.canvas( canvasWidth,  canvasHeight)
)});
  main.variable(observer()).define(["regl","renderable"], function(regl,renderable)
{
  const render = regl(renderable);//create Draw Command
  regl.clear({color: [0.5, 0.5, 0.6, 1]});
  render();
  return 'Render Calls made here'
}
);
  main.variable(observer("renderable")).define("renderable", ["quadData","texture","aspectRatio"], function(quadData,texture,aspectRatio){return(
{
    frag: `
  precision mediump float;
  uniform sampler2D texture;
  varying vec2 fragUV;
  void main () {
    vec3 materialColor = texture2D(texture, fragUV).rgb;
    gl_FragColor = texture2D(texture, fragUV);
  }`,

    vert: `
  precision mediump float;
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 fragUV;
  uniform vec2 aspectRatio;
  void main () {
    fragUV = uv;
    gl_Position = vec4(position/aspectRatio, 0, 1.0);
  }`,

    attributes: {
      position: quadData.positions,
      uv: quadData.uvs
    },
    elements: quadData.cells,
    depth: { enable: false },

    uniforms: {
      texture: texture,
      aspectRatio: aspectRatio
    },

    //count: 3
  }
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Data`
)});
  main.variable(observer("quadData")).define("quadData", ["textureOptions"], function(textureOptions)
{
  return {
    positions: [[1,0], [0,1], [-1, 0], [0, -1]],
    uvs: [[0,1], [0,0], [1,0],[1,1]].map(d=>{
      const scale = 2**textureOptions.scale;
      return [(d[0]-0.5)*scale+0.5,(d[1]-0.5)*scale+0.5]
    }),
    cells: [[0,1,2],[2,3,0]]
  }
}
);
  main.variable(observer("aspectRatio")).define("aspectRatio", ["canvasWidth","canvasHeight"], function(canvasWidth,canvasHeight)
{
  const ar = canvasWidth / canvasHeight;
  return ar > 1 ? [ar, 1] : [1, 1 / ar];
}
);
  main.variable(observer("canvasWidth")).define("canvasWidth", ["width"], function(width){return(
width
)});
  main.variable(observer("canvasHeight")).define("canvasHeight", function(){return(
400
)});
  main.variable(observer()).define(["md"], function(md){return(
md`#### You can create texture from an image element.`
)});
  main.variable(observer("texture")).define("texture", ["regl","image","textureOptions"], function(regl,image,textureOptions){return(
regl.texture({
  data: image,
  flipY: true, 
  wrap : textureOptions.wrap,
  min : textureOptions.minfilter,
  mag : textureOptions.magfilter
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`To create texture directly from a URL use: texture_from_URL(...) with URL and appropriate parameters.`
)});
  main.variable(observer()).define(["md","url"], function(md,url){return(
md`#### You can Create Image element from URL
try:  
image = image_from_URL(${url})`
)});
  main.variable(observer("url")).define("url", function(){return(
"https://raw.githubusercontent.com/mdn/webgl-examples/gh-pages/tutorial/sample6/cubetexture.png"
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Local Functions`
)});
  main.variable(observer("texture_from_URL")).define("texture_from_URL", ["regl"], function(regl){return(
(url, wrap, min, mag) =>{
  return new Promise(resolve => {
    const im = new Image();
    im.crossOrigin = "anonymous";
    im.src = url;
    im.onload = () => resolve(
      regl.texture({data: im, flipY: true, wrap : wrap, min: min, mag: mag})
      );
    })
}
)});
  main.variable(observer("image_from_URL")).define("image_from_URL", function(){return(
(url) =>{
  return new Promise(resolve => {
    const im = new Image();
    im.crossOrigin = "anonymous";
    im.src = url;
    im.onload = () => resolve(im);
  })
}
)});
  main.variable(observer("testurl")).define("testurl", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("cubemaps_skybox.png").url()
)});
  main.variable(observer("cubemap")).define("cubemap", ["cubeimagesCroppedFromHCrossShape","testurl"], function(cubeimagesCroppedFromHCrossShape,testurl){return(
cubeimagesCroppedFromHCrossShape(testurl,128)
)});
  main.variable(observer("cubeimagesCroppedFromHCrossShape")).define("cubeimagesCroppedFromHCrossShape", ["DOM"], function(DOM){return(
(url, size) => {
  return new Promise(resolve => {
    const im = new Image();
    im.crossOrigin = "anonymous";
    im.src = url;
    im.onload = () => {
        resolve([[size*2,size],[0,size],[size,0],[size,size*2],[size,size],[size*3,size]].map(xy=>{
          const ctx = DOM.context2d(size,size);
          ctx.drawImage(im, xy[0], xy[1], size, size, 0, 0, size, size);
          return ctx.canvas;
        }))
    }
  })
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Libraries and Imports`
)});
  main.variable(observer("createREGL")).define("createREGL", ["require"], function(require){return(
require("regl")
)});
  main.variable(observer("regl")).define("regl", ["createREGL","myCanvas"], function(createREGL,myCanvas){return(
createREGL({canvas:myCanvas})
)});
  const child1 = runtime.module(define1);
  main.import("radio", child1);
  main.import("slider", child1);
  const child2 = runtime.module(define2);
  main.import("columns", child2);
  return main;
}
