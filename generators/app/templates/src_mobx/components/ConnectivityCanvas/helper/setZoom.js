/* global jsPlumb */
const setZoom = (zoom, jsPlumbInstance, transformOriginValue, element) => {
  const transformOrigin = transformOriginValue || [0.5, 0.5];
  const instance = jsPlumbInstance || jsPlumb;
  const el = element || instance.getContainer();
  const prefixes = ['webkit', 'moz', 'ms', 'o'];
  const scale = `scale(${zoom})`;
  const oString = `${transformOrigin[0] * 100}% ${transformOrigin[1] * 100}%`;

  for (const prefix of prefixes) {
    el.style[`${prefix}Transform`] = scale;
    el.style[`${prefix}TransformOrigin`] = oString;
  }

  el.style.transform = scale;
  el.style.transformOrigin = oString;

  instance.setZoom(zoom);
};

export default setZoom;
