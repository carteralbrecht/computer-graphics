import define1 from "./c53590e002aeaa0b@55.js";
import define2 from "./e93997d5089d7165@2303.js";
import define3 from "./10023e7d8ddc32bc@90.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["clipspace.jpg",new URL("./files/7832cbebe75330327ce8635046f234731dfcc056931373d7772ba74540ceba7de5fe124f7eb9c4dcfb3ed9745c36aa0f1099ed8c65c4ff83d4443a93f4531a30",import.meta.url)],["sphere-intersect.jpg",new URL("./files/09d610f17435468aaf728254bf465ad3e7146593e067f60b3feaa1bd6629235906e406fe52ac5ac79c86ea3827de7053069d9e1b7649927f8c336f7911deb5fb",import.meta.url)],["8k_earth_daymap.jpg",new URL("./files/0939d4749c8e7e78314a8c266b6bdb86b2239a9851b897793c94ba338f00e3e39c9c21c2f293863e7b8d8b2f9e7034c5fb965bab1a61cb48dc4d613c031d7d5f",import.meta.url)],["covid19Data.txt",new URL("./files/4750835415de771e7cc45aff387becbcab28292e9f31e3c8c401747a3610c25296f1819737f2b8e5fa54a5ea576a681b1d539f328c3b56280b19a7492f225268",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# 3D Data Viewer (Final Demo)`
)});
  main.variable(observer()).define(["chosenDataset","md"], function(chosenDataset,md)
{
  return chosenDataset.title == "" ? md`## <i>Title</i>` : md`## ${chosenDataset.title}`
}
);
  main.variable(observer()).define(["chosenDataset","md"], function(chosenDataset,md)
{
   return chosenDataset.description == "" ? md`### <i>Description</i>` : md`### ${chosenDataset.description}`
}
);
  main.variable(observer()).define(["MouseXYZ","proj","view","XYZ2latlon","chosenDataset","dataRenderables","distance","md","camera"], function(MouseXYZ,proj,view,XYZ2latlon,chosenDataset,dataRenderables,distance,md,camera)
{
  var pointOnSphere = MouseXYZ(proj, view);
  var mouseLatLng = XYZ2latlon(pointOnSphere[0], pointOnSphere[1], pointOnSphere[2]);
  var minDistance = 10000000000;
  var data = chosenDataset.data;
  var lowestIdx;
  for (var i = 0; i < data.length; i++)
  {
    dataRenderables[i].active = false;
    var currentDistance = distance(mouseLatLng[0], mouseLatLng[1], parseFloat(data[i].coordinates.latitude), parseFloat(data[i].coordinates.longitude));
    if (currentDistance < minDistance)
    {
      minDistance = currentDistance;
      lowestIdx = i;
    }
  }
  
  var lowest = data[lowestIdx];
  var lowestName = (lowest == undefined) ? "" : lowest.locationName;
  var lowestVal = (lowest == undefined) ? "" : lowest.value;
  
  if (lowestName == "")
     return md`### No Data Point Selected`;
  else
  {
    dataRenderables[lowestIdx].active = true;
    // makes camera render
    camera.dirty = true;
     return md`### Closest Location: <span style="color:red">${lowestName}</span> Value: <span style="color:red">${lowestVal}</span>`;
  }
}
);
  main.variable(observer("myCanvas")).define("myCanvas", ["DOM","canvasWidth","canvasHeight"], function(DOM,canvasWidth,canvasHeight){return(
DOM.canvas(canvasWidth,canvasHeight)
)});
  main.variable(observer("viewof displayFormat")).define("viewof displayFormat", ["radio"], function(radio){return(
radio({
  description: "Choose display type",
  options: [
   {value: "Graph", label: "Varying height cylinders"}, {value: "Circle", label: "Varying radius discs"}
    ],
  value: "Graph"
})
)});
  main.variable(observer("displayFormat")).define("displayFormat", ["Generators", "viewof displayFormat"], (G, _) => G.input(_));
  main.variable(observer("viewof chooseDataset")).define("viewof chooseDataset", ["radio"], function(radio){return(
radio({
  description: 'Choose the data set',
  options: [{value: "Covid2", label: "Covid REST API"}, {value: "Covid", label: "Covid File Attachment"}, {value: "Input", label: "Cut-n-paste Manual Input"}],
  value: "Covid2"
})
)});
  main.variable(observer("chooseDataset")).define("chooseDataset", ["Generators", "viewof chooseDataset"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function(md){return(
md `### Manual Input of Data`
)});
  main.variable(observer()).define(["md"], function(md){return(
md `<i>Enter a title</i>`
)});
  main.variable(observer("viewof rawTitle")).define("viewof rawTitle", ["textarea"], function(textarea){return(
textarea({
  placeholder: "Title",
  width: "100%",
  rows: 1
})
)});
  main.variable(observer("rawTitle")).define("rawTitle", ["Generators", "viewof rawTitle"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function(md){return(
md `<i>Enter a description</i>`
)});
  main.variable(observer("viewof rawDescription")).define("viewof rawDescription", ["textarea"], function(textarea){return(
textarea({
  placeholder: "Description",
  width: "100%",
  rows: 1
})
)});
  main.variable(observer("rawDescription")).define("rawDescription", ["Generators", "viewof rawDescription"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function(md){return(
md `<i>Enter each datapoint on a new line</i>`
)});
  main.variable(observer("viewof rawInput")).define("viewof rawInput", ["textarea"], function(textarea){return(
textarea({
  placeholder: "label,latitude,longitude,value",
  width: "100%",
  rows: 10
})
)});
  main.variable(observer("rawInput")).define("rawInput", ["Generators", "viewof rawInput"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function(md){return(
md`# Report`
)});
  main.variable(observer()).define(["md"], function(md){return(
md `
### Team Name: <span style="color:red">3D Data Viewer</span>
### Team Members:<br>
<ol>
<li style="color:red">Pia Nelson (Team Lead)</li>
<li style="color:red">Carter Albrecht</li>
<li style="color:red">Yang Chen</li>
<li style="color:red">Allen Chion</li>
<li style="color:red">Mark Fuller</li>
<li style="color:red">Ryan Shavell</li>
</ol>
### Project Goals:
<ul>
<li style="color:red">Build an interactive 3D Data viewer that displays location-based data points on a rotatable globe.</li>
<li style="color:red">Show data points as discs with varying radius or cylinders with varying heights.</li>
<li style="color:red">Provide support for arbitrary data</li>
<li style="color:red">Show data values with mouse hovering</li>
<li style="color:red">Deliver demo, code, and report using an Observable notebook.</li>
</ul>

`
)});
  main.variable(observer()).define(["md"], function(md){return(
md `### Project Tasks (<span style="color:red">with divisions of labor</span>):
<ol>
<li>Create discord server for team communications <span style="color:red">(Allen)</span></li>
<li>Paid subscription to Observable Teams for notebook collaboration <span style="color:red">(Pia)</span></li>
<li>Model Selection <span style="color:red">(Mark, Carter)</span></li>
<p>Models were needed to represent the earth (sphere), discs, and cylinders. Free earth models were examined from various websites including [Model 1](https://free3d.com/3d-model/earth-v1--590680.html#), [Model2](https://free3d.com/3d-model/ultra-realistic-sci-fi-earth-high-res-textures-low-end-textures-made-with-blender-279b-959150.html#), [Model 3](https://www.artstation.com/marketplace/p/Pvor/free-earth-planet-3d-model-all-format), and [Model 4](https://www.cgtrader.com/items/2408222/download-page). Each of the models had issues when loaded with the provided Object file loader. The final model selected for the earth was a sphere generated from THREE.js and D3 libraries provided by Dr. Sumantta Pattanaik, but using the texture found in model 3 listed above.</p>
<li>Identify REST API Data Set for COVID-19 Deaths and obtain initial data <span style="color:red">(Carter, Ryan)</span></li>
<li>Render Earth using REGL Camera Controls <span style="color:red">(Allen)</span></li>
<li>Render Data Points on model by Latitude and Longitude as GL Points <span style="color:red">(Yang, Mark)</span></li>
<li>Create disc with varying radius instead of GL Points <span style="color:red">(Yang, Ryan)</span></li>
<p>Create disc use THREE.js circle buffer, then make a model matrix use quaternion to rotate the disc to the correct position and direction.</p>
<li>Change color based on values <span style="color:red">(Ryan, Yang)</span></li>
<p>Our data points needed to be colored based off of the value they represented in the dataset. We used the D3 library to make a three-color scale (Purple -> Yellow -> Blue, from least to greatest) and applied the colors to each of our rendered discs.</p>
<li>Capture mouse canvas coordinates and convert to clip plane coordinates <span style="color:red">(Mark)</span>
<p> Mouse coordinates on the canvas are provided in range 0 to canvas height/width as (X,Y). These coordinates were converted to the clipspace range of -1 to +1.</p>
</li>
</ol>`
)});
  main.variable(observer()).define(["FileAttachment"], function(FileAttachment){return(
FileAttachment("clipspace.jpg").image()
)});
  main.variable(observer()).define(["md"], function(md){return(
md `
<ol start="10">
<li>Use ray tracing for mouse coordinates (X,Y) to sphere intersection points (X,Y,Z) <span style="color:red">(Pia, Mark)</li>
<li>Convert intersection points (X,Y,Z) back to lattitude and longitude <span style="color:red">(Mark, Pia)</span></li>
</ol>`
)});
  main.variable(observer()).define(["FileAttachment"], function(FileAttachment){return(
FileAttachment("sphere-intersect.jpg").image()
)});
  main.variable(observer()).define(["md"], function(md){return(
md `
<ol start="12">
<li>Determine closest data point in data set to mouse hover point <span style="color:red">(Carter)</li>
<li>Change color of closest data point to red <span style="color:red">(Carter)</li>
<li>Create hover message showing data point values in red color <span style="color:red">(Mark, Carter)</li>
<li>Add capabilites for data source file uploads <span style="color:red"> (Pia)</span> </li>
<li>Convert REST API data to file attachment with failure if REST API returns nothing</li>
<li>Add capabilites for data source to be manually inputed <span style="color:red">(Pia)</span> </li>
<li>Identify and obtain sample data set for manual input <span style="color:red">(Allen, Ryan)</span></li>
<li>Provide option to render as cylinders of varying height in addition to discs <span style="color:red">(Allen, Yang)</span></li>
</ol>`
)});
  main.variable(observer()).define(["md"], function(md){return(
md `# Code`
)});
  main.variable(observer()).define(["md"], function(md){return(
md `### ===Canvas definition===`
)});
  main.variable(observer("gl")).define("gl", ["createRegl","myCanvas"], function(createRegl,myCanvas)
{
  const gl = createRegl({canvas:myCanvas});
  gl.clear({color: [0.5, 0.5, 0.6, 1]});
  return gl;
}
);
  main.variable(observer("canvasWidth")).define("canvasWidth", function(){return(
960
)});
  main.variable(observer("canvasHeight")).define("canvasHeight", function(){return(
600
)});
  main.variable(observer("camera")).define("camera", ["createCamera","gl","sphereDimensions"], function(createCamera,gl,sphereDimensions){return(
createCamera(gl, {
   center:    sphereDimensions.center,
   distance:  sphereDimensions.radius * 3, //  (* distance) // from widget
   noScroll:  true,
   renderOnDirty: true
   // near:      0.001*sphereDimensions.radius, // Defaults to .01
   // far:       10*sphereDimensions.radius,    // Defaults to 1000
   // fovy :     toRadian(fov),
   })
)});
  main.variable(observer()).define(["gl","camera","renderEarth","mutable view","mutable proj","dataRenderables","d3","hex2rgb","invalidation","md"], function(gl,camera,renderEarth,$0,$1,dataRenderables,d3,hex2rgb,invalidation,md)
{
  
  gl.clear({color: [0.5, 0.5, 0.6, 1]});
  
  const frame = gl.frame(() => {
     camera((state) => {
          if (!state.dirty) return;
          gl.clear({color: [0.5, 0.5, 0.6, 1]})
          renderEarth();
          $0.value = state.view;
          $1.value = state.projection;
          
          let pointWidth = 8.0;
          for (var i = 0; i < dataRenderables.length; i++)
          {
            
            var color = d3.scaleSqrt()
              .domain([0, 0.5, 1])
              .range(["purple", "yellow", "blue"]);
            var colorData = d3.color(color(dataRenderables[i].percent));
            var colorVector = [colorData.r / 255.0, colorData.g / 255.0, colorData.b / 255.0];
            
            var draw = dataRenderables[i].renderable;
            
            draw({
              pointColor: dataRenderables[i].active ? hex2rgb("ff0000") : colorVector, 
              view: state.view, 
              projection: state.projection
            });
          }
     })
   })
   invalidation.then(() => frame.cancel());
 
   return md `Draw Canvas Code (Exapand Cell to View)`
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`### ===Models===`
)});
  main.variable(observer()).define(["md"], function(md){return(
md `#### 1) Sphere for earth`
)});
  main.variable(observer("sphere")).define("sphere", ["THREE","array2Darray"], function(THREE,array2Darray)
{
  const sphereGeometry = new THREE.SphereBufferGeometry( 1, 32, 32 );
  
  //return sphereGeometry
  return {
    positions : array2Darray(sphereGeometry.attributes.position.array,3),
    normals : array2Darray(sphereGeometry.attributes.normal.array,3),
    uvs : array2Darray(sphereGeometry.attributes.uv.array,2),
    cells : array2Darray(sphereGeometry.index.array,3)
  }
}
);
  main.variable(observer("sphereDimensions")).define("sphereDimensions", ["getScDimensions","sphere"], function(getScDimensions,sphere){return(
getScDimensions(sphere)
)});
  main.variable(observer("texture_image")).define("texture_image", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("8k_earth_daymap.jpg").image()
)});
  main.variable(observer("sphere_texture")).define("sphere_texture", ["gl","texture_image"], function(gl,texture_image){return(
gl.texture({
      data: texture_image, 
      flipY: true, 
})
)});
  main.variable(observer("modelMatrix")).define("modelMatrix", ["glMatrix"], function(glMatrix){return(
glMatrix.mat4.create()
)});
  main.variable(observer("renderEarth")).define("renderEarth", ["gl","sphere","modelMatrix","sphere_texture"], function(gl,sphere,modelMatrix,sphere_texture){return(
gl({
  vert: `
     precision mediump float;
  
     attribute vec3 position;
     attribute vec3 normal;
     attribute vec2 uv;
  
     uniform mat4 projection;
     uniform mat4 view;
     uniform mat4 modelMatrix;

     varying vec3 fragNormal;
     varying vec2 fragUV;
  
     void main() {
       gl_PointSize = 4.0;
       fragNormal = abs(modelMatrix * vec4(normal,0.0)).xyz;
       fragUV = uv;
       gl_Position = projection * view * modelMatrix * vec4(position,1);
     }
  `,
  frag: `
     precision mediump float;
     varying vec3 fragNormal;
     varying vec2 fragUV;
     uniform sampler2D texture;
     void main() {
       vec3 color = texture2D(texture,fragUV).rgb;//abs(fragNormal)
       gl_FragColor = vec4(color, 1);
     }
  `,
  attributes: {
    position: sphere.positions,
    normal: sphere.normals,
    uv: sphere.uvs
  },
  elements:sphere.cells,
  uniforms: {
    modelMatrix: modelMatrix,
    texture: sphere_texture 
  },
  primitive: 'triangles',
  cull: {
    enable: false
  }
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md `#### 2) Small Circles for Data Points`
)});
  main.variable(observer("smallCircle")).define("smallCircle", ["THREE","array2Darray"], function(THREE,array2Darray){return(
(rad) =>{
  // First arg is radius
  const disc = new THREE.CircleBufferGeometry(rad,16);
  return {
    positions : array2Darray(disc.attributes.position.array,3),
    normals : array2Darray(disc.attributes.normal.array,3),
    uvs : array2Darray(disc.attributes.uv.array,2),
    cells : array2Darray(disc.index.array,3)
  }
}
)});
  main.variable(observer("makeSmallCircleRenderable")).define("makeSmallCircleRenderable", ["glMatrix","smallCircle","gl"], function(glMatrix,smallCircle,gl){return(
(XYZ, radio) => {
  var translationMatrix = glMatrix.mat4.fromTranslation([], XYZ);
  
  var circleNormal = glMatrix.vec3.fromValues(0,0,1);
  // get normal vector between circle's normal line and direction vector
  var normalizVec = glMatrix.vec3.normalize([],glMatrix.vec3.cross([],circleNormal,XYZ));
  // do dot product get the angle
  var angle = Math.acos((glMatrix.vec3.dot(XYZ,circleNormal)/(Math.sqrt(glMatrix.vec3.squaredLength(XYZ)))))
  
  var roterQuat = glMatrix.quat.setAxisAngle(glMatrix.quat.create(), normalizVec, angle)
  var rotationMatrix = glMatrix.mat4.fromQuat([], roterQuat)
  var modelMatrix = glMatrix.mat4.multiply([], translationMatrix, rotationMatrix)
  
  var cir = smallCircle(radio)
  var renderable = {
  vert: `
     precision mediump float;
  
     attribute vec3 position;
     attribute vec3 normal;
     attribute vec2 uv;

     varying vec3 fragColor;
  
     uniform vec3 pointColor;
     uniform mat4 projection;
     uniform mat4 view;
     uniform mat4 modelMatrix;
  
     void main() {
       fragColor = pointColor;
       gl_Position = projection * view * modelMatrix * vec4(position,1);
     }
  `,
  frag: `
     precision mediump float;
     varying vec3 fragColor;
     void main() {
       gl_FragColor = vec4(fragColor, 0.6);
     }
  `,
  attributes: {
    position: cir.positions,
    normal: cir.normals,
    uv: cir.uvs
  },
  elements:cir.cells,
  uniforms: {
    modelMatrix: modelMatrix,
    pointColor: gl.prop('pointColor'),
  },
    blend: {
      enable: true,
      func: {
        src: 'src alpha',
        dst: 'one minus src alpha'
      }
    },
  primitive: 'triangles',
  cull: {
    enable: false
  }
  };
    
  return renderable;
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md `#### 3) Cylinders for Data Points`
)});
  main.variable(observer("getCylinder")).define("getCylinder", ["THREE","array2Darray"], function(THREE,array2Darray){return(
(percent) => {
  const cylinderGeometry = new THREE.CylinderBufferGeometry(0.005, 0.005, percent, 4);
  return {
    positions : array2Darray(cylinderGeometry.attributes.position.array,3),
    normals : array2Darray(cylinderGeometry.attributes.normal.array,3),
    uvs : array2Darray(cylinderGeometry.attributes.uv.array,2),
    cells : array2Darray(cylinderGeometry.index.array,3)
  }
}
)});
  main.variable(observer("cylinderRenderable")).define("cylinderRenderable", ["getCylinder","glMatrix","gl"], function(getCylinder,glMatrix,gl){return(
(XYZ, percent) => {
  var cylinder = getCylinder(percent);
  var translationMatrix = glMatrix.mat4.fromTranslation([], XYZ);
  
  var cylinderAxis = glMatrix.vec3.fromValues(0,1,0);
  var normalizVec = glMatrix.vec3.normalize([],glMatrix.vec3.cross([],cylinderAxis,XYZ));
  
  var angle = Math.acos((glMatrix.vec3.dot(XYZ,cylinderAxis)/(Math.sqrt(glMatrix.vec3.squaredLength(XYZ)))))
  
  var roterQuat = glMatrix.quat.setAxisAngle(glMatrix.quat.create(), normalizVec, angle);
  var rotationMatrix = glMatrix.mat4.fromQuat([], roterQuat);
  var modelMatrix = glMatrix.mat4.multiply([], translationMatrix, rotationMatrix);
  
  var renderable = {
  vert: `
     precision mediump float;
  
     attribute vec3 position;
     attribute vec3 normal;
     attribute vec2 uv;
  
     uniform mat4 projection;
     uniform mat4 view;
     uniform mat4 modelMatrix;
  
     void main() {
       gl_PointSize = 4.0;
       gl_Position = projection * view * modelMatrix * vec4(position,1);
     }
  `,
  frag: `
     precision mediump float;
     uniform vec3 pointColor;
     void main() {
       gl_FragColor = vec4(pointColor, 0.6);
     }
  `,
  attributes: {
    position: cylinder.positions,
    normal: cylinder.normals,
    uv: cylinder.uvs,
  },
  elements:cylinder.cells,
  uniforms: {
    modelMatrix: modelMatrix,
    pointColor: gl.prop('pointColor')
  },
  primitive: 'triangles',
  cull: {
    enable: false
  }};
    
  return renderable;
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### ===Data Sources===`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`#### 1) Data from REST API call`
)});
  main.variable(observer("rawCovidData2")).define("rawCovidData2", async function(){return(
(await fetch ("https://corona.lmao.ninja/v2/jhucsse")).json()
)});
  main.variable(observer("processedCovidData2")).define("processedCovidData2", ["rawCovidData2"], function(rawCovidData2)
{
  function makeDataObj(covidData)
  {
    var obj = {
      locationName: covidData.country + (covidData.province != null ? ' ' + covidData.province : ''),
      coordinates: covidData.coordinates,
      value: covidData.stats.deaths,
    }
    
    return obj;
  }
  
  function makeDataArray(rawCovidData2)
  {
    const dataArray = [];
    for (let i = 0; i < rawCovidData2.length; i++)
    {
      dataArray.push(makeDataObj(rawCovidData2[i]));
    }
    
    return dataArray;
  }
  
  var processedData = {
    title: "Coronavirus Data",
    description: "Coronavirus Deaths",
    data: makeDataArray(rawCovidData2)
  }
  
  return processedData;
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`#### 2) Data from file attachment`
)});
  main.variable(observer("rawCovidData")).define("rawCovidData", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("covid19Data.txt").json()
)});
  main.variable(observer("processedCovidData")).define("processedCovidData", ["rawCovidData"], function(rawCovidData)
{
  function makeDataObj(covidData)
  {
    var obj = {
      locationName: covidData.country + (covidData.province != null ? ' ' + covidData.province : ''),
      coordinates: covidData.coordinates,
      value: covidData.stats.deaths,
    }
    
    return obj;
  }
  
  function makeDataArray(rawCovidData)
  {
    const dataArray = [];
    for (let i = 0; i < rawCovidData.length; i++)
    {
      dataArray.push(makeDataObj(rawCovidData[i]));
    }
    
    return dataArray;
  }
  
  var processedData = {
    title: "Coronavirus Data",
    description: "Coronavirus Deaths",
    data: makeDataArray(rawCovidData)
  }
  
  return processedData;
}
);
  main.variable(observer("Example_File_Format1")).define("Example_File_Format1", function()
{
    var data = {
     "title":"Death Count",
     "description":"Total Coronavirus Deaths Since Yesterday",
     "data":[
        {
           "locationName":"Orlando",
           "coordinates":{
              "latitude":28.6,
              "longitude":-81.229
           },
           "value":73
        },
        {
           "locationName":"New York City",
           "coordinates":{
              "latitude":40.7,
              "longitude":-73.9
           },
           "value":300
        }
     ]
  }
  
  return data;
}
);
  main.variable(observer("Example_File_Format2")).define("Example_File_Format2", function()
{
    var data = {
     "title":"Smartphones Sold",
     "description":"Total Smartphones Sold To Date",
     "data":[
        {
           "locationName":"Tokyo",
           "coordinates":{
              "latitude":35.65,
              "longitude":139.84
           },
           "value":100000000
        },
        {
           "locationName":"London",
           "coordinates":{
              "latitude":51.5,
              "longitude":-0.11
           },
           "value":28000000
        },
        {
           "locationName":"Delhi",
           "coordinates":{
              "latitude":28.6,
              "longitude":77.2
           },
           "value":50000000
        },
     ]
  }
  
  return data;
}
);
  main.variable(observer()).define(["md"], function(md){return(
md `#### 3) Data from manual user input`
)});
  main.variable(observer("inputDataSet")).define("inputDataSet", ["count","rawTitle","rawDescription","rawInput"], function(count,rawTitle,rawDescription,rawInput)
{
  
  const parseData = value => {
  let lines = value.split("\n");
  const separator = count(lines[0], "\t") > count(lines[0], ",") ? "\t" : ",";
  lines = lines.map(line => line.split(separator)).filter(f => f.length > 1);
  const data = lines.map(line => {
    return {
      locationName: line[0],
      coordinates: {
        latitude: line[1],
        longitude: line[2]
      },
      value: parseFloat(line[3])
    };
  });
  return data;
  };
  
  var dataSet = {
    title: rawTitle,
    description: rawDescription,
    data: parseData(rawInput)
  }
  
  return dataSet;
}
);
  main.variable(observer()).define(["md"], function(md){return(
md `#### Dataset to be rendered`
)});
  main.variable(observer("chosenDataset")).define("chosenDataset", ["camera","chooseDataset","rawCovidData2","processedCovidData","processedCovidData2","inputDataSet"], function(camera,chooseDataset,rawCovidData2,processedCovidData,processedCovidData2,inputDataSet)
{
  camera.dirty = true;
  switch (chooseDataset)
  {
    case "Covid2":
      return (typeof(rawCovidData2) === "undefined") ? processedCovidData : processedCovidData2;
    case "Covid":
      return processedCovidData;
    case "Input":
      return inputDataSet;
  }
}
);
  main.variable(observer()).define(["md"], function(md){return(
md `#### Making renderables for data in generic form`
)});
  main.variable(observer("makeRenderablesForData")).define("makeRenderablesForData", ["latlon2XYZ","displayFormat","gl","makeSmallCircleRenderable","getRad","hex2rgb","cylinderRenderable"], function(latlon2XYZ,displayFormat,gl,makeSmallCircleRenderable,getRad,hex2rgb,cylinderRenderable){return(
(genericData) => {
  
  let minMaxData = []
  let min = 1000000000;
  let max = -100000000;
  for (let i = 0; i < genericData.data.length; i++)
  {
    if (max < parseFloat(genericData.data[i].value))
      max = parseFloat(genericData.data[i].value)
    if (min > parseFloat(genericData.data[i].value))
      min = parseFloat(genericData.data[i].value)
  }
  minMaxData[0] = min;
  minMaxData[1] = max;
  
  var renderables = []
  for (let i = 0; i < genericData.data.length; i++)
  {
    var XYZ = latlon2XYZ(parseFloat(genericData.data[i].coordinates.latitude),      parseFloat(genericData.data[i].coordinates.longitude));
    var percent = parseFloat(genericData.data[i].value) / minMaxData[1];
    if (displayFormat == "Circle")
    {
      renderables.push({
        renderable: 
          gl(makeSmallCircleRenderable(
            XYZ, 
            getRad(
              minMaxData[0], minMaxData[1], parseFloat(genericData.data[i].value)
            ),)),
        color: hex2rgb("fff700"),
        percent: percent,
        active: false
      });
    }
    else if (displayFormat == "Graph")
    {
      renderables.push({
        renderable: 
          gl(cylinderRenderable(XYZ, percent)),
        color: hex2rgb("fff700"),
        percent: percent,
        active: false
      });
    }
  }
  
  return renderables;
}
)});
  main.variable(observer("dataRenderables")).define("dataRenderables", ["makeRenderablesForData","chosenDataset"], function(makeRenderablesForData,chosenDataset){return(
makeRenderablesForData(chosenDataset)
)});
  main.variable(observer()).define(["md"], function(md){return(
md `### ===Obtaining Mouse Postion===`
)});
  main.variable(observer()).define(["md"], function(md){return(
md `#### Current Camera Adjustments`
)});
  main.define("initial view", function(){return(
null
)});
  main.variable(observer("mutable view")).define("mutable view", ["Mutable", "initial view"], (M, _) => new M(_));
  main.variable(observer("view")).define("view", ["mutable view"], _ => _.generator);
  main.define("initial proj", function(){return(
null
)});
  main.variable(observer("mutable proj")).define("mutable proj", ["Mutable", "initial proj"], (M, _) => new M(_));
  main.variable(observer("proj")).define("proj", ["mutable proj"], _ => _.generator);
  main.variable(observer()).define(["md"], function(md){return(
md `#### Mouse Position Relative to Canvas`
)});
  main.define("initial mousePos", ["canvasWidth","canvasHeight"], function(canvasWidth,canvasHeight){return(
{x: canvasWidth / 2, y: canvasHeight / 2}
)});
  main.variable(observer("mutable mousePos")).define("mutable mousePos", ["Mutable", "initial mousePos"], (M, _) => new M(_));
  main.variable(observer("mousePos")).define("mousePos", ["mutable mousePos"], _ => _.generator);
  main.variable(observer()).define(["myCanvas","mutable mousePos","canvasWidth","canvasHeight","md"], function(myCanvas,$0,canvasWidth,canvasHeight,md)
{
// myCanvas.onmousedown =
  myCanvas.onmousemove = (e) => {
    //mutable mousePos = {x: e.offsetX, y: e.offsetY};
    $0.value = {x: e.offsetX / canvasWidth * 2 - 1, y: e.offsetY / canvasHeight * (-2) + 1};
    // mutable cameraEye = {x: camera.eye[0], y: e.offsetY, z: e.offsetY};
  }
  
  return md `Register Mouse Listener (Expand Cell for Details)`
}
);
  main.variable(observer()).define(["md"], function(md){return(
md `#### Ray-Sphere Intersection Calculations For Point (X,Y,Z) on Sphere`
)});
  main.variable(observer("MouseXYZ")).define("MouseXYZ", ["glMatrix","mousePos"], function(glMatrix,mousePos){return(
(proj, view) => {
  var InverseCamera = glMatrix.mat4.invert([],glMatrix.mat4.multiply([],proj, view));
  var rayPoint1 = glMatrix.vec3.transformMat4([], [mousePos.x,mousePos.y, -1], InverseCamera);
  var rayPoint2 = glMatrix.vec3.transformMat4([], [mousePos.x,mousePos.y, 1], InverseCamera);
  var rayOrigin = rayPoint1;
  var rayDirection = glMatrix.vec3.normalize([],glMatrix.vec3.subtract([], rayPoint2, rayPoint1));
  var A = glMatrix.vec3.dot(rayDirection,rayDirection);
  var B = 2 * glMatrix.vec3.dot(rayOrigin,rayDirection);
  var C = glMatrix.vec3.dot(rayOrigin,rayOrigin) - 1;
  var Root1 = (-B + Math.sqrt( (B**2 - 4*A*C) )) / 2*A;
  var Root2 = (-B - Math.sqrt( (B**2 - 4*A*C) )) / 2*A;
  var t = Math.min(Root1,Root2);
  var pointOnSphere = glMatrix.vec3.add([],rayOrigin, glMatrix.vec3.scale([],rayDirection,t));
  return pointOnSphere;
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### ===Utility Functions===`
)});
  main.variable(observer("latlon2XYZ")).define("latlon2XYZ", ["sphereDimensions","glMatrix"], function(sphereDimensions,glMatrix){return(
(lat,lon) => {
  const lonCorrection = 0;   // Will need to determine value if texture map is not centered on equator and meridian
  const latCorrection = 0;   // Will need to determine value if texture map is not centered on equator and meridian
  const phi = (90-lat+latCorrection)*(Math.PI/180);
  const theta = (lon+180+lonCorrection)*(Math.PI/180);
  const x = -((sphereDimensions.radius) * Math.sin(phi) * Math.cos(theta));
  const y = ((sphereDimensions.radius) * Math.cos(phi));
  const z = ((sphereDimensions.radius) * Math.sin(phi) * Math.sin(theta));
  return glMatrix.vec3.fromValues(x,y,z);
}
)});
  main.variable(observer("XYZ2latlon")).define("XYZ2latlon", ["sphereDimensions"], function(sphereDimensions){return(
function XYZ2latlon(x, y, z) {
      var radius = sphereDimensions.radius;
      var latRads = Math.acos(y / radius);
      var lngRads = Math.atan2(z, x);
      var lat = (Math.PI / 2 - latRads) * (180 / Math.PI);
      var lng = (Math.PI - lngRads) * (180 / Math.PI);
      return [lat, lng - 180];
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
  main.variable(observer("count")).define("count", function(){return(
(str, substr) => (str.match(new RegExp(substr, "g")) || []).length
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
  main.variable(observer("hex2rgb")).define("hex2rgb", function(){return(
hex => (hex = hex.replace('#', '')).match(new RegExp('(.{' + hex.length/3 + '})', 'g')).map(l =>  parseInt(hex.length%2 ? l+l : l, 16)/255)
)});
  main.variable(observer("distance")).define("distance", ["deg2rad"], function(deg2rad){return(
function distance(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}
)});
  main.variable(observer("deg2rad")).define("deg2rad", function(){return(
function deg2rad(deg) {
  return deg * (Math.PI/180)
}
)});
  main.variable(observer("getRad")).define("getRad", function(){return(
(min, max, value) => {
  // calculate the r = a*value + b
  // we need to find the a and b by input the max and min of data nad max and min of radius
  var a = (0.04 - 0.001)/(Math.sqrt(max)-Math.sqrt(min))
  var b = 0.001 - a * Math.sqrt(min)
  
  return a * Math.sqrt(value) + b
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### ===JavaScript libraries and imports===`
)});
  main.variable(observer("createRegl")).define("createRegl", ["require"], function(require){return(
require("regl")
)});
  main.variable(observer("createCamera")).define("createCamera", ["require"], function(require){return(
require('https://bundle.run/regl-camera@2.1.1')
)});
  main.variable(observer("glMatrix")).define("glMatrix", ["require"], function(require){return(
require('https://bundle.run/gl-matrix@3.3.0')
)});
  main.variable(observer("THREE")).define("THREE", ["require"], function(require){return(
require("three")
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3")
)});
  const child1 = runtime.module(define1);
  main.import("fileInput", child1);
  const child2 = runtime.module(define2);
  main.import("slider", child2);
  main.import("radio", child2);
  main.import("color", child2);
  main.import("textarea", child2);
  const child3 = runtime.module(define3);
  main.import("columns", child3);
  return main;
}
