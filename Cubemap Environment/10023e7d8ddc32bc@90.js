// https://observablehq.com/@bcardiff/observable-columns@90
import define1 from "./e93997d5089d7165@2303.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Observable columns
_great for inputs_

~~~js
import {columns} from "@bcardiff/observable-columns"
~~~
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`It can be used with objects`
)});
  main.variable(observer("viewof values")).define("viewof values", ["columns","select"], function(columns,select){return(
columns({
  seasons: select(["Spring", "Summer", "Fall", "Winter"]),
  stooges: select({
    title: "Stooges",
    description: "Please pick your favorite stooge.",
    options: ["Curly", "Larry", "Moe", "Shemp"],
    value: "Moe"
  })
})
)});
  main.variable(observer("values")).define("values", ["Generators", "viewof values"], (G, _) => G.input(_));
  main.variable(observer()).define(["values"], function(values){return(
values
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Or with arrays`
)});
  main.variable(observer("viewof numOfInputs")).define("viewof numOfInputs", ["number"], function(number){return(
number({title: 'how many inputs?', value: 3})
)});
  main.variable(observer("numOfInputs")).define("numOfInputs", ["Generators", "viewof numOfInputs"], (G, _) => G.input(_));
  main.variable(observer("viewof arrayOfInputs")).define("viewof arrayOfInputs", ["numOfInputs","select","columns"], function(numOfInputs,select,columns)
{
  const inputs = []
  for(let i = 0; i < numOfInputs; i++) {
    inputs.push(select({title: `arrayOfInputs[${i}]`, options: ["a","b","c"]}))
  }
  
  return columns(inputs)
}
);
  main.variable(observer("arrayOfInputs")).define("arrayOfInputs", ["Generators", "viewof arrayOfInputs"], (G, _) => G.input(_));
  main.variable(observer()).define(["arrayOfInputs"], function(arrayOfInputs){return(
arrayOfInputs
)});
  main.variable(observer("columns")).define("columns", ["html"], function(html){return(
(args) => {
  const form = html`<form></form>`
  form.value = {}

  let cols = 0
  for (const key in args) {
    form.appendChild(args[key])
    cols++
  }
  
  form.style = `display: grid; grid-gap: 10px 15px; grid-template-columns: repeat(${cols}, auto); grid-auto-flow: row;`
  
  form.oninput = () => {
    form.value = Object.keys(args).reduce((result, key) => {
      result[key] = args[key].value
      return result
    }, Array.isArray(args) ? [] : {})
  }
  form.oninput()
  
  return form
}
)});
  const child1 = runtime.module(define1);
  main.import("select", child1);
  main.import("number", child1);
  return main;
}
