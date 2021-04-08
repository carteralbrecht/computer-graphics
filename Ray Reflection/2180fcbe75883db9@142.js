// https://observablehq.com/@spattana/scaled-teapot@142
import define1 from "./ebae0c172bd689cc@102.js";
import define2 from "./4999f76212508574@211.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["teapot.obj",new URL("./files/d1652511080b6593a3eb5e9ce6dc9aa886a65015ba49b361ea5583e91aa9ffe76b822c494cee5f6f0bfefba9ff76ce8f55e9fbf170f816e02707f9edeccf96e0",import.meta.url)],["BoyOBJ.obj",new URL("./files/60f4958fe3739037c4330662b193a0651d3cec40746c44cd3c047e6b359b755b44c5fef73b71ec2be9945fdbcad9cfce0cbe9463c25acbb2aa8f08e608fe914d",import.meta.url)],["teddy.obj",new URL("./files/ac9cf416616bff050e042f9d4b03ef219077b0f748d2cf66bcd13558f65c819dce4e038a550119a5170a4fbf422bd581ea0a4a076036b75f0d8afe3e95b4f0e6",import.meta.url)],["cow.obj",new URL("./files/b34711587ec641e2f8d86172546d0a6d128e7e8d6dfbcf112070ffcb9fcd93016345283a6f9f6c385b962c1d3cc1e93e87fed62ab8eb37b882022596502faa61",import.meta.url)],["cessna.obj",new URL("./files/7048ae3b7c9b25b1e47942fdc61babc099bf8ea76925ce6c22b3f4965d44f549bfd5f88113220ced6753b86210824457193899dc095f5fe7255b726327597964",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Scaled Objects from OBJ models
Here are a couple of modesl that I have parsed from OBJ models and scaled to fit into WebGL ClipBox (the coordinate ranges within -1 to +1). They are:   
*scaledTeapot*, *scaledCow*, *scaledTeddy*, *scaledBoy*, *scaledWindmill*.  
You may download OBJ model files from web and attach to you notebook and use the following steps to get you data.  
*scaledSC(obj2sc(await FileAttachment("teapot.obj").text()))*   
  Replace *teapot.obj* by your .obj file.  
Make sure that you have imported *scaledSC* and *obj2sc* by adding the following import statements to your notebook.  
*import {scaledSC} from "@spattana/ply-data-for-regl"*  
*import {obj2sc} from "@spattana/obj-parser-obj2sc"*  
You may also try to use URL (note that not all URLs allow download access through from webpage! You will know that if you get "TypeError: Failed to fetch") as follows.  
*scaledSC(obj2sc(await d3.text("https://threejsfundamentals.org/threejs/resources/models/windmill/windmill.obj")))*  
Use your url in place as the argument to *d3.text* method.

**Note**: Scaled models are to get started on WebGL programming. Once we learn about Camera and related transformations we do not need any prescaling or our mesh geometry. You can then simply use *obj2sc* functions to parse .obj files. No need of *scaledSC* method.
`
)});
  main.variable(observer("scaledTeapot")).define("scaledTeapot", ["scaledSC","teapot"], function(scaledSC,teapot){return(
scaledSC(teapot)
)});
  main.variable(observer("teapot")).define("teapot", ["obj2sc","FileAttachment","computeNormals"], async function(obj2sc,FileAttachment,computeNormals)
{
  const obj = obj2sc(await FileAttachment("teapot.obj").text());
  if (!obj.normals) obj.normals = computeNormals(obj.cells,obj.positions);
  return obj
}
);
  main.variable(observer("cow")).define("cow", ["obj2sc","FileAttachment","computeNormals"], async function(obj2sc,FileAttachment,computeNormals)
{
  const obj = obj2sc(await FileAttachment("cow.obj").text());
  if (!obj.normals) obj.normals = computeNormals(obj.cells,obj.positions);
  return obj;
}
);
  main.variable(observer("scaledCow")).define("scaledCow", ["scaledSC","cow"], function(scaledSC,cow){return(
scaledSC(cow)
)});
  main.variable(observer("cesna")).define("cesna", ["obj2sc","FileAttachment","computeNormals"], async function(obj2sc,FileAttachment,computeNormals)
{
  const obj = obj2sc(await FileAttachment("cessna.obj").text());
  if (!obj.normals) obj.normals = computeNormals(obj.cells,obj.positions);
  return obj;
}
);
  main.variable(observer("scaledCesna")).define("scaledCesna", ["scaledSC","cesna"], function(scaledSC,cesna){return(
scaledSC(cesna)
)});
  main.variable(observer("teddy")).define("teddy", ["obj2sc","FileAttachment","computeNormals"], async function(obj2sc,FileAttachment,computeNormals)
{
  const obj = obj2sc(await FileAttachment("teddy.obj").text());
  if (!obj.normals) obj.normals = computeNormals(obj.cells,obj.positions);
  return obj;
}
);
  main.variable(observer("scaledTeddy")).define("scaledTeddy", ["scaledSC","teddy"], function(scaledSC,teddy){return(
scaledSC(teddy)
)});
  main.variable(observer("scaledWindmill")).define("scaledWindmill", ["scaledSC","obj2sc","d3"], async function(scaledSC,obj2sc,d3){return(
scaledSC(obj2sc(await d3.text("https://threejsfundamentals.org/threejs/resources/models/windmill/windmill.obj")))
)});
  main.variable(observer("teapotObj")).define("teapotObj", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("teapot.obj").text()
)});
  main.variable(observer("scaledBoy")).define("scaledBoy", ["scaledSC","boy"], function(scaledSC,boy){return(
scaledSC(boy)
)});
  main.variable(observer("boy")).define("boy", ["obj2sc","boyObj"], function(obj2sc,boyObj){return(
obj2sc(boyObj)
)});
  main.variable(observer("boyObj")).define("boyObj", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("BoyOBJ.obj").text()
)});
  main.variable(observer("computeNormals")).define("computeNormals", ["require"], function(require){return(
require('https://bundle.run/angle-normals@1.0.0')
)});
  const child1 = runtime.module(define1);
  main.import("obj2sc", child1);
  const child2 = runtime.module(define2);
  main.import("scaledSC", child2);
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  main.variable(observer("threejs")).define("threejs", ["require"], function(require){return(
require("three")
)});
  return main;
}
