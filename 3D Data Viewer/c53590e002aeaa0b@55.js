// https://observablehq.com/@mbostock/file-input-with-initial-value@55
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["hello.json",new URL("./files/6a80819bbb03fb04c43c7e6e88dde373d5b842b94c8e37cf53837e41d101812745e6cc131cfd96cdabb2088cb02b7a643bfd5c4b97db96f863119b5da7dd3324",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# File Input with Initial Value

This [file input](/@mbostock/reading-local-files) lets you specify a default value. To use in your notebook:

\`\`\`js
import {fileInput} from "@mbostock/file-input-with-initial-value"
\`\`\`

Ref. [@john-guerra](/@john-guerra/file-input-with-default-value)`
)});
  main.variable(observer("viewof file")).define("viewof file", ["fileInput","FileAttachment"], function(fileInput,FileAttachment){return(
fileInput({
  initialValue: FileAttachment("hello.json").blob(),
  accept: ".json"
})
)});
  main.variable(observer("file")).define("file", ["Generators", "viewof file"], (G, _) => G.input(_));
  main.variable(observer()).define(["file"], function(file){return(
file
)});
  main.variable(observer("data")).define("data", ["Files","file"], async function(Files,file){return(
JSON.parse(await Files.text(file))
)});
  main.variable(observer("fileInput")).define("fileInput", ["html"], function(html){return(
function fileInput({initialValue, accept = ""} = {}) {
  const form = html`<form><input name=i type="file" accept="${accept}">`;
  form.i.onchange = () => {
    form.value = form.i.multiple ? form.i.files : form.i.files[0];
    form.dispatchEvent(new CustomEvent("input"));
  };
  form.value = initialValue;
  return form;
}
)});
  return main;
}
