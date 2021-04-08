// https://observablehq.com/@spattana/obj-parser-obj2sc@102
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# OBJ Parser: obj2sc
Code credit: Mikola Lysenko  
Code source: https://github.com/mikolalysenko/obj2sc`
)});
  main.variable(observer("obj2sc")).define("obj2sc", function(){return(
(objString)=>{
  const lineArray = objString.split("\n");
  const str = []
  const verts = []
  const vt = []
  const vn = []
  const faces = []
  const uv = []
  const normals = []
  lineArray.forEach(line=>{
    var toks = line.split(/\s+/)
    if (toks[0] === 'v') {
      verts.push(toks.slice(1).map((x) => +x))
    } else if (toks[0] === 'vt') {
      vt.push(toks.slice(1).map((x) => +x))
    } else if (toks[0] === 'vn') {
      vn.push(toks.slice(1).map((x) => +x))
    } else if (toks[0] === 'f') {
      var f = []
      for (var i = 1; i < toks.length; i++) {
        var vtn = toks[i].split('/')
        var vi = (vtn[0]-1)|0
        f.push(vi)
        if (vtn[1]) uv[vi] = vt[(vtn[1]-1)|0] // texture index
        if (vtn[2]) normals[vi] = vn[(vtn[2]-1)|0] // normal index
      }
      if (f.length === 3) faces.push(f)
      else {
        for (var i = 2; i < f.length; i++) {
          faces.push([f[0],f[i-1],f[i]])
        }
      }
    }
  })

  const data = {
    positions: verts,
    cells: faces
  }
  if (uv.length) {
    data.uv = uv
  }
  if (normals.length) {
    data.normals = normals
  }
  return data;
}
)});
  main.variable(observer("getScDimensions")).define("getScDimensions", ["reglScExtent"], function(reglScExtent){return(
scObject => {
  const extent = reglScExtent(scObject);
  const size = [
      (extent[0][1]-extent[0][0]),
      (extent[1][1]-extent[1][0]),
      (extent[2][1]-extent[2][0])
    ];
  return {
    box : size,
    center : [
      0.5*(extent[0][1]+extent[0][0]),
      0.5*(extent[1][1]+extent[1][0]),
      0.5*(extent[2][1]+extent[2][0])
    ],
    extent: extent,
    radius : 0.5*Math.sqrt(size[0]*size[0]+size[1]*size[1]+size[2]*size[2])
  };  
}
)});
  main.variable(observer("getSCSdimensions")).define("getSCSdimensions", ["reglScExtent","vec3"], function(reglScExtent,vec3){return(
scs =>{
  const min = [Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE];
  const max = [Number.MIN_VALUE,Number.MIN_VALUE,Number.MIN_VALUE];
  scs.forEach(d=>{
    const sc = d.sc;
    const e = reglScExtent(sc);
    const M = d.modelMatrix;
    const part_min = vec3.transformMat4([],[e[0][0],e[1][0],e[2][0]],M);
    const part_max = vec3.transformMat4([],[e[0][1],e[1][1],e[2][1]],M);

    [0,1,2].forEach((index) => {
      min[index] = Math.min(min[index],part_min[index]);
      max[index] = Math.max(max[index],part_max[index]);
    })
  })
  const extent = [];
  [0,1,2].forEach((index) => extent[index] = [min[index],max[index]]);

  //return extent
  const size = [
      (extent[0][1]-extent[0][0]),
      (extent[1][1]-extent[1][0]),
      (extent[2][1]-extent[2][0])
    ];

  return {
    center : [
      0.5*(extent[0][1]+extent[0][0]),
      0.5*(extent[1][1]+extent[1][0]),
      0.5*(extent[2][1]+extent[2][0])
    ],
    extent: extent,
    radius : 0.5*Math.sqrt(size[0]*size[0]+size[1]*size[1]+size[2]*size[2])
  }; 
}
)});
  main.variable(observer("array2Darray")).define("array2Darray", function(){return(
(A,n)=>Array.from(A).reduce((a, c, i,data) => {
        return i % n === 0 ? a.concat([data.slice(i, i + n)]) : a;
      }, [])
)});
  main.variable(observer("reglScExtent")).define("reglScExtent", ["d3"], function(d3){return(
sc => {
  const getExtent = i =>sc.positions[0][i]?d3.extent(sc.positions.map(d=>d[i])):[0,0];
  return new Array(3).fill().map((d,i)=>getExtent(i))
}
)});
  main.variable(observer("computeNormals")).define("computeNormals", ["require"], function(require){return(
require('https://bundle.run/angle-normals@1.0.0')
)});
  main.variable(observer("vec3")).define("vec3", ["glMatrix"], function(glMatrix){return(
glMatrix.vec3
)});
  main.variable(observer("mat4")).define("mat4", ["glMatrix"], function(glMatrix){return(
glMatrix.mat4
)});
  main.variable(observer("glMatrix")).define("glMatrix", ["require"], function(require){return(
require('https://bundle.run/gl-matrix@3.3.0')
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3")
)});
  return main;
}
