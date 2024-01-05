import {useEffect, useRef, useState} from 'react';

const gX = 19;
const gY = 8;

const processData = data => {
  const pixels = [];
  for (let index = 0; index < data.length; index += 6) {
    const r = data.substring(index, index + 2);
    const g = data.substring(index + 2, index + 4);
    const b = data.substring(index + 4, index + 6);
    pixels.push([parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)]);
  }
  return pixels;
};

/**
 *
 * @param {number[]} data
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} scale
 */
const drawCanvas = (data, ctx, scale) => {
  const lineWidth = scale / 5;
  const brightness = 80;
  const bScale = 255 / (255 - brightness);
  data.forEach((pixel, index) => {
    let x = index % (gX - 1);
    let y = gY - 1 - Math.floor(index / (gX - 1));
    if (x >= 16) x += 1;
    x *= scale;
    y *= scale;
    const r = pixel[0] * bScale + brightness;
    const g = pixel[1] * bScale + brightness;
    const b = pixel[2] * bScale + brightness;
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(x + lineWidth, y + lineWidth, scale - lineWidth * 2, scale - lineWidth * 2);
  });
};

const Canvas = ({scale, data, ...props}) => {
  const canvasRef = useRef(null);
  const context = useRef(null);
  const [init, setInit] = useState(false);

  useEffect(() => {
    // Get the device pixel ratio, falling back to 1.
    const dpr = window.devicePixelRatio || 1;
    // Give the canvas pixel dimensions of their CSS
    // size * the device pixel ratio.
    canvasRef.current.width = scale * gX * dpr;
    canvasRef.current.height = scale * gY * dpr;
    // Scale all drawing operations by the dpr, so you
    // don't have to worry about the difference.
    context.current = canvasRef.current.getContext('2d');
    context.current.scale(dpr, dpr);
    setInit(true);
  }, []);

  useEffect(() => {
    if (init) {
      drawCanvas(data, context.current, scale);
    }
  }, [init, data, scale]);

  return (
    <canvas
      ref={canvasRef}
      {...props}
    />
  );
};

const SongPreview = ({data, scale}) => {
  const [previewData, setPreviewData] = useState([]);
  useEffect(() => {
    if (data) setPreviewData(processData(data));
  }, []);
  return (
    <Canvas
      data={previewData}
      scale={scale}
      width={gX * scale}
      height={gY * scale}
      style={{
        width: gX * scale,
        height: gY * scale,
      }}
    />
  );
};

export default SongPreview;
