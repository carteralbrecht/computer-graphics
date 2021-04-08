import define1 from "./ebae0c172bd689cc@102.js";
import define2 from "./fe416d2046e29a11@321.js";
import define3 from "./e93997d5089d7165@2303.js";
import define4 from "./10023e7d8ddc32bc@90.js";
import define5 from "./3a8f1066d585d16c@549.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["rayman.json",new URL("./files/21f3e037905a3f3fb1af5e4f830c0d7efdd48f1266f6913625bacc61e7ad6541527cc753125d7a5d1dd1642a03afbe26cca76639b01a54b5d41c2b939d1f3c83",import.meta.url)],["Rayman.png",new URL("./files/0e7b80379c6272e6e0431669f855b19032a3d1e856b7900215569c92218c31a22c0c6906e2ce2c56dcd68608bd566170744724d008d59d8cf04fa3803f318a54",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Assignment 10: Mirror Reflection`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Carter Albrecht ca845545`
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
  main.variable(observer("viewof clipping")).define("viewof clipping", ["radio"], function(radio){return(
radio({
  description: 'Choose if there should be clipping',
  options: [
   {value: true, label: "yes"}, {value: false, label: "no"}
    ],
  value: true
})
)});
  main.variable(observer("clipping")).define("clipping", ["Generators", "viewof clipping"], (G, _) => G.input(_));
  main.variable(observer("myCanvas")).define("myCanvas", ["html","canvasWidth","canvasHeight"], function(html,canvasWidth,canvasHeight){return(
html `<canvas width=${canvasWidth}, height=${canvasHeight}/>`
)});
  main.variable(observer("viewof alpha")).define("viewof alpha", ["slider"], function(slider){return(
slider({
    title: "Mirror Alpha",
    value: 0.5,
    step: 0.1
  })
)});
  main.variable(observer("alpha")).define("alpha", ["Generators", "viewof alpha"], (G, _) => G.input(_));
  main.variable(observer("canvasWidth")).define("canvasWidth", function(){return(
760
)});
  main.variable(observer("canvasHeight")).define("canvasHeight", function(){return(
400
)});
  main.variable(observer()).define(["regl","mirrorShapeRenderable","raymanObject","makeReflectedRaymanRenderable","mirrorRenderable","makeRaymanRenderable"], function(regl,mirrorShapeRenderable,raymanObject,makeReflectedRaymanRenderable,mirrorRenderable,makeRaymanRenderable)
{
  
  regl.clear({color: [0.5, 0.5, 0.6, 1]});
  
  //render plane mirror shape into stencil buffer
  var renderMirror = regl(mirrorShapeRenderable);
  renderMirror();
  
  // use stencil test and render reflected version of object into color buffer
  for (var i = 0; i < raymanObject.length; i++)
  {
    var item = raymanObject[i];
    var render = regl(makeReflectedRaymanRenderable(item.sc));
    render();
  }
  
  // render and blend mirror shape into color buffer
  var renderRealMirror = regl(mirrorRenderable);
  renderRealMirror();
  
  // render objects into color buffer
  for (var i = 0; i < raymanObject.length; i++)
  {
    var item = raymanObject[i];
    var render = regl(makeRaymanRenderable(item.sc));
    render();
  }
  
  return `Main Rendering`
}
);
  main.variable(observer("mirrorShapeRenderable")).define("mirrorShapeRenderable", ["mirrorSC","viewMatrix","perspectiveMatrix"], function(mirrorSC,viewMatrix,perspectiveMatrix)
{
  var renderable = ({
    frag: 
      `precision mediump float;

      varying vec3 fragNormal;
      varying vec3 fragPosition;
      varying vec2 fragUV;

     void main () 
     {
        gl_FragColor = vec4(0.5, 0.1, 0.9, 1);
     }`,
     vert:
      `precision mediump float;
      attribute vec3 position;
      attribute vec3 normal;
      attribute vec2 uv;

      uniform mat4 viewMatrix; // Constants that must be set before the render call.
      uniform mat4 projectionMatrix;

      varying vec3 fragNormal; // Data Sent to Fragment shader
      varying vec3 fragPosition;
      varying vec2 fragUV;

      void main () {
        gl_PointSize = 2.0;
        vec4 mPosition = vec4(position, 1);
        fragPosition   = mPosition.xyz;
        fragNormal  = normalize(normal);
        fragUV = uv;
        gl_Position = projectionMatrix * viewMatrix * mPosition;
        }`,
    attributes: {
          position: mirrorSC.positions,
          normal:   mirrorSC.normals,
          uv: mirrorSC.uvs,
        },
    elements: mirrorSC.cells,
    uniforms: 
    {
          viewMatrix: viewMatrix,
          projectionMatrix: perspectiveMatrix,
    },
    stencil: {
      enable: true,
      mask: 0xff,
      func: {
        cmp: 'always',
        ref: 1,
        mask: 0xff
      },
      opFront: {
        fail: 'replace',
        zfail: 'replace',
        zpass: 'replace'
      }
    },
    // we want to write only to the stencil buffer,
    // so disable these masks.
    colorMask: [false, false, false, false],
    depth: {
      enable: true,
      mask: false
    },
    blend: {
      enable: false
    }
  });

    return renderable;
}
);
  main.variable(observer("mirrorRenderable")).define("mirrorRenderable", ["mirrorSC","viewMatrix","perspectiveMatrix","alpha"], function(mirrorSC,viewMatrix,perspectiveMatrix,alpha)
{
  var renderable = ({
    frag: 
      `precision mediump float;
       uniform float alpha;

      varying vec3 fragNormal;
      varying vec3 fragPosition;
      varying vec2 fragUV;

     void main () 
     {
        gl_FragColor = vec4(0.5, 0.1, 0.9, alpha);
     }`,
     vert:
      `precision mediump float;
      attribute vec3 position;
      attribute vec3 normal;
      attribute vec2 uv;

      uniform mat4 viewMatrix; // Constants that must be set before the render call.
      uniform mat4 projectionMatrix;

      varying vec3 fragNormal; // Data Sent to Fragment shader
      varying vec3 fragPosition;
      varying vec2 fragUV;

      void main () {
        gl_PointSize = 2.0;
        vec4 mPosition = vec4(position, 1);
        fragPosition   = mPosition.xyz;
        fragNormal  = normalize(normal);
        fragUV = uv;
        gl_Position = projectionMatrix * viewMatrix * mPosition;
        }`,
    attributes: {
          position: mirrorSC.positions,
          normal:   mirrorSC.normals,
          uv: mirrorSC.uvs,
        },
    elements: mirrorSC.cells,
    uniforms: 
    {
          viewMatrix: viewMatrix,
          projectionMatrix: perspectiveMatrix,
          alpha: alpha,
    },
    blend: {
    enable: true,
    func: {
      src: 'src alpha',
      dst: 'one minus src alpha'
    }
  }
  });

    return renderable;
}
);
  main.variable(observer("makeRaymanRenderable")).define("makeRaymanRenderable", ["viewMatrix","perspectiveMatrix","raymanTexture"], function(viewMatrix,perspectiveMatrix,raymanTexture){return(
(sc) => {
    var renderable = ({
      vert: 
      `precision mediump float;
      attribute vec3 position;
      attribute vec3 normal;
      attribute vec2 uv;

      uniform mat4 viewMatrix; // Constants that must be set before the render call.
      uniform mat4 projectionMatrix;

      varying vec3 fragNormal; // Data Sent to Fragment shader
      varying vec3 fragPosition;
      varying vec2 fragUV;

      void main () {
        gl_PointSize = 2.0;
        vec4 mPosition = vec4(position, 1);
        fragPosition   = mPosition.xyz;
        fragNormal  = normalize(normal);
        fragUV = uv;
        gl_Position = projectionMatrix * viewMatrix * mPosition;
    }`
      ,
        frag: 
        `precision mediump float;
         uniform sampler2D tex;

        varying vec3 fragNormal;
        varying vec3 fragPosition;
        varying vec2 fragUV;

          vec3 computeColor(){
            return texture2D(tex, fragUV).rgb;
          }

          void main () {
            vec3 color = computeColor();
            gl_FragColor = vec4(color, 1);
          }`,
      
        attributes: {
          position: sc.positions,
          normal:   sc.normals,
          uv: sc.uvs,
        },
        count: sc.positions.length,
        uniforms: {
          viewMatrix: viewMatrix,
          projectionMatrix: perspectiveMatrix,
          tex: raymanTexture,
        }
      });

    return renderable;
  }
)});
  main.variable(observer("makeReflectedRaymanRenderable")).define("makeReflectedRaymanRenderable", ["viewMatrix","perspectiveMatrix","raymanTexture","mirrorSC","enableClipping"], function(viewMatrix,perspectiveMatrix,raymanTexture,mirrorSC,enableClipping){return(
(sc) => {
    var renderable = ({
      vert: 
      `precision mediump float;
      attribute vec3 position;
      attribute vec3 normal;
      attribute vec2 uv;

      uniform mat4 viewMatrix; // Constants that must be set before the render call.
      uniform mat4 projectionMatrix;
      uniform vec3 Q;
      uniform vec3 n;

      varying vec3 fragNormal; // Data Sent to Fragment shader
      varying vec3 fragPosition;
      varying vec2 fragUV;

      void main () {
        gl_PointSize = 2.0;
        vec3 refPosition = position - 2.0 * n * dot(position - Q, n);
        vec4 mPosition = vec4(refPosition, 1);

        fragNormal  = normalize(normal);
        fragUV = uv;
        gl_Position = projectionMatrix * viewMatrix * mPosition;
    }`
      ,
        frag: 
        `precision mediump float;
         uniform sampler2D tex;

        varying vec3 fragNormal;
        varying vec2 fragUV;

          vec3 computeColor(){
            return texture2D(tex, fragUV).rgb;
          }

          void main () {
            vec3 color = computeColor();
            gl_FragColor = vec4(color, 1);
          }`,
      
        attributes: {
          position: sc.positions,
          normal:   sc.normals,
          uv: sc.uvs,
        },
        count: sc.positions.length,
        uniforms: {
          viewMatrix: viewMatrix,
          projectionMatrix: perspectiveMatrix,
          tex: raymanTexture,
          Q: mirrorSC.positions[0],
          n: mirrorSC.normals[0],
        },
          stencil: {
      enable: enableClipping,
      mask: 0xff,
      func: {
        cmp: 'equal',
        ref: 1,
        mask: 0xff
      }
    }
    });

    return renderable;
  }
)});
  main.variable(observer("enableClipping")).define("enableClipping", ["clipping"], function(clipping)
{
  switch (clipping)
  {
    case "true":
      return true;
    case "false":
      return false;
  }
}
);
  main.variable(observer()).define(["md"], function(md){return(
md `## Object and Texture`
)});
  main.variable(observer("raymanObject")).define("raymanObject", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("rayman.json").json()
)});
  main.variable(observer("objectDimensions")).define("objectDimensions", ["getSCSdimensions","raymanObject"], function(getSCSdimensions,raymanObject){return(
getSCSdimensions(raymanObject)
)});
  main.variable(observer("mirrorSC")).define("mirrorSC", ["objectDimensions","vec3"], function(objectDimensions,vec3)
{
  const D = 1.2*objectDimensions.radius; // Slightly larger than the bounding sphere radius
  const center = objectDimensions.center;
  
  return {
    positions: [[-D, -D, -D], [D, -D, -D], [D, D, -D], [-D, D, -D]].map(d=>vec3.add([], d, center)),
    normals: [[0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]],
    uvs: [[0, 0], [0, 0], [0, 0], [0, 0]],
    cells: [[0, 1, 2], [2, 3, 0]]
  }
}
);
  main.variable(observer("raymanTextureImage")).define("raymanTextureImage", ["image_from_URL","FileAttachment"], async function(image_from_URL,FileAttachment){return(
image_from_URL(await FileAttachment("Rayman.png").url())
)});
  main.variable(observer("raymanTexture")).define("raymanTexture", ["regl","raymanTextureImage"], function(regl,raymanTextureImage){return(
regl.texture({
    data: raymanTextureImage,
    flipY: true,
  })
)});
  main.variable(observer()).define(["md"], function(md){return(
md `## Camera Matrices`
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
  main.variable(observer("regl")).define("regl", ["createRegl","myCanvas"], function(createRegl,myCanvas)
{
  const regl = createRegl({
    canvas: myCanvas,
    attributes: { 
      stencil: true
    }
  });
  return regl;
}
);
  main.variable(observer("drawNormal")).define("drawNormal", ["regl"], function(regl){return(
regl({
  stencil: {
    enable: false
  },
  blend: {
    enable: false
  }
})
)});
  main.variable(observer("disableBlend")).define("disableBlend", ["regl"], function(regl){return(
regl({
  blend: {
    enable: false
  },
})
)});
  main.variable(observer("enableBlend")).define("enableBlend", ["regl"], function(regl){return(
regl({
  blend: {
    enable: true
  },
  depth: {
    enable: false
  },
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## External Libraries and Functions`
)});
  const child1 = runtime.module(define1);
  main.import("getSCSdimensions", child1);
  const child2 = runtime.module(define2);
  main.import("image_from_URL", child2);
  const child3 = runtime.module(define3);
  main.import("slider", child3);
  main.import("radio", child3);
  main.import("color", child3);
  const child4 = runtime.module(define4);
  main.import("columns", child4);
  const child5 = runtime.module(define5);
  main.import("drawMask", child5);
  main.import("drawStenciled", child5);
  main.variable(observer("glMatrix")).define("glMatrix", ["require"], function(require){return(
require('https://bundle.run/gl-matrix@3.3.0')
)});
  main.variable(observer("createRegl")).define("createRegl", ["require"], function(require){return(
require("regl")
)});
  return main;
}
