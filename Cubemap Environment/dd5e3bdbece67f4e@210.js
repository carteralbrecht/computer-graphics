// https://observablehq.com/@ehouais/utils@210
import define1 from "./e93997d5089d7165@2303.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Utils`
)});
  main.variable(observer("corsFetch")).define("corsFetch", function(){return(
url => fetch(`https://cors-anywhere.herokuapp.com/${url}`)
)});
  main.variable(observer("fetchProgress")).define("fetchProgress", ["viewofProgressBar"], function(viewofProgressBar){return(
(url, init, max, title) => {
  const { bar, set, dispatch } = viewofProgressBar(title, max);
  fetch(url, init).then(async response => {
    const reader = response.body && response.body.getReader()
    const concat = new Uint8Array(max)
    let length = 0
    while (true) {
      const {done, value} = await reader.read()
      if (done) break;
      concat.set(value, length)
      length += value.length
      set(length)
    }
    dispatch(concat.buffer)
  });
  return bar
}
)});
  main.variable(observer("promisify")).define("promisify", function(){return(
fn => (...args) => new Promise((resolve, reject) => {
  fn(...args, (err, data) => err ? reject(err) : resolve(data))
})
)});
  main.variable(observer("Logger")).define("Logger", ["DOM","width"], function(DOM,width){return(
() => {
  const container = DOM.element("div");
  const ta = DOM.element("textarea");
  Object.assign(ta.style, {
    width: "100%",
    height: "200px",
    fontFamily: "monospace",
    fontSize: "13px"
  });
  ta.readOnly = true;
  container.appendChild(ta);
  Object.assign(container.style, { width: width + "px" });
  container.value = {
    log: txt => {
      ta.value += txt + "\n";
    },
    reset: () => {
      ta.value = "";
    }
  };
  return container;
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`---`
)});
  main.variable(observer("createImageBitmap")).define("createImageBitmap", function(){return(
window.createImageBitmap ||
  async function(blob) {
    return new Promise((resolve, reject) => {
      let img = document.createElement('img');
      img.addEventListener('load', function() {
        resolve(this);
      });
      img.src = URL.createObjectURL(blob);
    });
  }
)});
  main.variable(observer("getImageData")).define("getImageData", ["createImageBitmap","DOM"], function(createImageBitmap,DOM){return(
async function(blob) {
  const bitmap = await createImageBitmap(blob);
  const [width, height] = [bitmap.width, bitmap.height];

  // an intermediate "buffer" 2D context is necessary
  const ctx = DOM.context2d(width, height, 1);
  ctx.drawImage(bitmap, 0, 0);

  return ctx.getImageData(0, 0, width, height);
}
)});
  main.variable(observer("decodeImage")).define("decodeImage", function(){return(
(imageData, cb, [stepX, stepY] = [1, 1]) => {
  const { width, height, data } = imageData;
  const [stepIx, stepIy] = [stepX * 4, (stepY - 1) * 4];
  for (let index = 0, j = 0; j < height; j += stepY, index += stepIy)
    for (let i = 0; i < width; i += stepX, index += stepIx)
      cb([i, j], data.slice(index, index + 3));
}
)});
  main.variable(observer("resizeImageData")).define("resizeImageData", ["DOM"], function(DOM){return(
(imageData, sx, sy, sWidth, sHeight, dWidth, dHeight) => {
  const scontext = DOM.context2d(sWidth + sx, sHeight + sy, 1);
  scontext.putImageData(imageData, 0, 0, sx, sy, sWidth + sx, sHeight + sy);
  const context = DOM.context2d(dWidth, dHeight, 1);
  context.drawImage(
    scontext.canvas,
    sx,
    sy,
    sWidth,
    sHeight,
    0,
    0,
    dWidth,
    dHeight
  );
  return context.getImageData(0, 0, dWidth, dHeight);
}
)});
  main.variable(observer("canvas")).define("canvas", ["DOM"], function(DOM){return(
(param1, param2) => {
  const fromDims = dims => [DOM.context2d(...dims, 1), ...dims];
  const fromContext = ctx => [ctx, ctx.canvas.width, ctx.canvas.height];
  const [ctx, width, height] = (param1.canvas ? fromContext : fromDims)(param1);
  const fill = (data, [W, H], color) => {
    for (let j = H - 1, index = 0; j >= 0; j--) {
      for (let i = 0; i < W; i++, index += 4) {
        data.set(color(i, j), index);
        data[index + 3] = 255;
      }
    }
  };
  const imageData = ([W, H], color) => {
    const data = new Uint8ClampedArray(4 * W * H);
    fill(data, [W, H], typeof color == "function" ? color : () => color);
    return new ImageData(data, W, H);
  };
  const data = param2.width ? param2 : imageData([width, height], param2);
  ctx.putImageData(data, 0, 0);
  return ctx.canvas;
}
)});
  main.variable(observer("viewofCanvas")).define("viewofCanvas", ["DOM"], function(DOM){return(
function(W, H) {
  const context = DOM.context2d(W, H, 1);
  const canvas = context.canvas;
  const set = (obj, propname, value) => ((obj[propname] = value), obj);
  const fill = color => set(context, 'fillStyle', color).fillRect(0, 0, W, H);
  const input = () => new CustomEvent("input");
  const dispatch = value => set(canvas, 'value', value).dispatchEvent(input());
  fill("hsl(0,0%,80%)");
  return { context, canvas, dispatch, fill };
}
)});
  main.variable(observer("viewofText")).define("viewofText", ["DOM"], function(DOM){return(
function() {
  const div = DOM.element("div");
  return {
    div,
    dispatch: function(value) {
      div.value = value;
      div.dispatchEvent(new CustomEvent("input"));
    }
  };
}
)});
  main.variable(observer("viewofProgressBar")).define("viewofProgressBar", ["DOM","html"], function(DOM,html){return(
function(title, max = 100, height) {
  const container = DOM.element("div")
  if (height) container.style.height = `${height}px`
  const label = html`<label style="margin-right: 20px">${title}...</label>`
  const progress = html`<progress value="0" max="${max}"/>`
  container.append(label, progress)
  return {
    bar: container,
    set: value => {
      progress.setAttribute('value', value)
      if (value >= max) {
        label.textContent = `${title}: done`
        progress.remove()
      }
    },
    dispatch: function(value) {
      container.value = value
      container.dispatchEvent(new CustomEvent("input"))
    }
  }
}
)});
  main.variable(observer("zoomAndPan")).define("zoomAndPan", function(){return(
function(element, cb) {
  element.addEventListener("wheel", e => {
    cb(0, 0, e.deltaY);
    e.preventDefault();
  });
  element.addEventListener("mousedown", e => {
    let [x0, y0] = [e.layerX, e.layerY];
    const mm = e => {
      const [x, y] = [e.layerX, e.layerY];
      cb(x - x0, y - y0, 0);
      [x0, y0] = [x, y];
    };
    const mu = e => {
      element.removeEventListener("mousemove", mm);
      element.removeEventListener("mouseup", mu);
      element.removeEventListener("mouseleave", mu);
    };

    element.addEventListener("mousemove", mm);
    element.addEventListener("mouseup", mu);
    element.addEventListener("mouseleave", mu);

    e.preventDefault();
  });
}
)});
  main.variable(observer("image2canvas")).define("image2canvas", ["DOM"], function(DOM){return(
(imageData, width) => {
  const context = DOM.context2d(imageData.width, imageData.height, 1);
  context.putImageData(imageData, 0, 0);
  if (!width || imageData.width <= width) return context.canvas;

  const height = (imageData.height * width) / imageData.width;
  const contextr = DOM.context2d(width, height, 1);
  contextr.drawImage(context.canvas, 0, 0, width, height);
  return contextr.canvas;
}
)});
  main.variable(observer("rgb2hsl")).define("rgb2hsl", function(){return(
([r, g, b]) => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max == r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max == g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }

  return [h, s, l];
}
)});
  main.variable(observer("rgb2hsv")).define("rgb2hsv", function(){return(
([r, g, b]) => {
  const [min, max] = [Math.min(r, g, b), Math.max(r, g, b)];
  let h,
    s,
    v = max;
  const diff = max - min;
  const diffc = c => (max - c) / 6 / diff + 0.5;

  if (diff == 0) {
    h = s = 0;
  } else {
    s = diff / max;
    let [rr, gg, bb] = [diffc(r), diffc(g), diffc(b)];

    if (r === max) h = bb - gg;
    else if (g === max) h = 1 / 3 + rr - bb;
    else if (b === max) h = 2 / 3 + gg - rr;

    if (h < 0) h += 1;
    else if (h > 1) h -= 1;
  }
  return [h, s, v];
}
)});
  main.variable(observer("colorGradient")).define("colorGradient", function(){return(
([r, g, b], nb) => {
  const [rf, gf, bf] = [r / nb, g / nb, b / nb];
  return [...Array(nb)]
    .map((_, i) => [(i * rf) | 0, (i * gf) | 0, (i * bf) | 0]);
}
)});
  main.variable(observer("interpolateRGB")).define("interpolateRGB", function(){return(
([r1, g1, b1], [r2, g2, b2], r) => [
  (r1 + r * (r2 - r1)) | 0,
  (g1 + r * (g2 - g1)) | 0,
  (b1 + r * (b2 - b1)) | 0
]
)});
  main.variable(observer("interpolatePalette")).define("interpolatePalette", ["interpolateRGB"], function(interpolateRGB){return(
(palette, color, r) => palette.map(c => interpolateRGB(c, color, r))
)});
  main.variable(observer("colorShades")).define("colorShades", function(){return(
(rgb, n) =>
  [...Array(n)].map((_, i) => rgb.map(f => ((i * f) / n) | 0))
)});
  main.variable(observer()).define(["md"], function(md){return(
md`---`
)});
  main.variable(observer("separator")).define("separator", ["html"], function(html){return(
function() {
  return html`<div style="height: 16px">`
}
)});
  main.variable(observer("floor")).define("floor", function(){return(
function(n, dec) {
  const pow = 10**dec;
  return Math.floor(n*pow)/pow;
}
)});
  main.variable(observer("minstRand0")).define("minstRand0", function(){return(
function(seed) {
  var rndval = seed;
  const mod = 2**31-1;
  return function() {
    rndval = rndval * 16807 % mod;
    return (rndval - 1) / (mod - 1);
  }
}
)});
  main.variable(observer("Range")).define("Range", function(){return(
bounds => {
  let [min, max] = bounds || [+Infinity, -Infinity];
  return {
    bounds: () => [min, max],
    expand: value => {
      [min, max] = [Math.min(min, value), Math.max(max, value)];
      return this;
    },
    constrain: value => Math.max(min, Math.min(max, value))
  };
}
)});
  main.variable(observer("MultiRange")).define("MultiRange", ["Range"], function(Range){return(
dimensions => {
  const ranges = [...Array(dimensions)].map(_ => Range());
  const r = {
    bounds: () => ranges.map(r => r.bounds()),
    expand: (...points) => {
      points.forEach(coords => {
        ranges.forEach((r, i) => {
          r.expand(coords[i]);
        });
      });
      return r;
    },
    constrain: (...points) =>
      points.map(coords => ranges.map((r, i) => r.constrain(coords[i])))
  };
  return r;
}
)});
  main.variable(observer("fillArray")).define("fillArray", function(){return(
(array, values) => {
  const N = array.length;
  const n = values.length;
  for (let index = 0; index < N; index += n) array.set(values, index);
  return array;
}
)});
  main.variable(observer("umod")).define("umod", function(){return(
(val, mod) => val < 0 ? val-Math.floor(val) : val % mod
)});
  main.variable(observer()).define(["md"], function(md){return(
md`---`
)});
  const child1 = runtime.module(define1);
  main.import("slider", child1);
  main.variable(observer("sliders")).define("sliders", ["DOM","slider"], function(DOM,slider){return(
function(params, filter) {
  const form = DOM.element('form');
  var value = {};
  for (let name in params) {
    let input = slider(params[name]);
    let div = input.querySelector('div');
    if (div) div.style.marginTop = '10px';
    let update = function() {
      value[name] = input.value;
      form.value = filter ? filter(value) : value;
    };
	input.addEventListener('input', update);
    update();
    form.appendChild(input);
  }
  return form;
}
)});
  return main;
}
