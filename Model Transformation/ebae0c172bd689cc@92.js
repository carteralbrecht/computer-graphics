// https://observablehq.com/@spattana/obj-parser-obj2sc@92
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
  main.variable(observer("array2Darray")).define("array2Darray", function(){return(
(A,n)=>Array.from(A).reduce((a, c, i,data) => {
        return i % n === 0 ? a.concat([data.slice(i, i + n)]) : a;
      }, [])
)});
  main.variable(observer("reglScExtent")).define("reglScExtent", ["d3"], function(d3){return(
sc => {
  const getExtent = i =>d3.extent(sc.positions.map(d=>d[i]));
  return new Array(3).fill().map((d,i)=>getExtent(i))
}
)});
  main.variable(observer("computeNormals")).define("computeNormals", ["require"], function(require){return(
require('https://bundle.run/angle-normals@1.0.0')
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3")
)});
  return main;
}
