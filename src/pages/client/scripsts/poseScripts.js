/* global drawConnectors, POSE_CONNECTIONS, drawLandmarks, Pose, Camera */

// Función para cargar los scripts de MediaPipe
const loadMediaPipeScripts = () => {
  return new Promise((resolve, reject) => {
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    Promise.all([
      loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/pose'),
      loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils'),
      loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils')
    ]).then(resolve).catch(reject);
  });
};

// Función para inicializar la cámara y pose estimation
const initializePoseEstimation = (videoElement, canvasElement, setCurrentPose) => {
  const canvasCtx = canvasElement.getContext('2d');

  const onResults = (results) => {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    // Dibuja la cuadrícula antes de los landmarks
    drawGrid(canvasCtx, canvasElement.width, canvasElement.height);

    if (results.poseLandmarks) {
      drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { color: 'white', lineWidth: 1 });
      drawLandmarks(canvasCtx, results.poseLandmarks, { color: 'green', lineWidth: 0.5 });

      const leftShoulder = results.poseLandmarks[11];
      const rightShoulder = results.poseLandmarks[12];
      const nose = results.poseLandmarks[0];

      const midShoulder = {
        x: (leftShoulder.x + rightShoulder.x) / 2,
        y: (leftShoulder.y + rightShoulder.y) / 2
      };

      canvasCtx.beginPath();
      canvasCtx.moveTo(midShoulder.x * canvasElement.width, midShoulder.y * canvasElement.height);
      canvasCtx.lineTo(nose.x * canvasElement.width, nose.y * canvasElement.height);
      canvasCtx.strokeStyle = 'white';
      canvasCtx.lineWidth = 1;
      canvasCtx.stroke();

      setCurrentPose(results.poseLandmarks);
    }
    canvasCtx.restore();
  };

  const pose = new Pose({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
  });

  pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });

  pose.onResults(onResults);

  const camera = new Camera(videoElement, {
    onFrame: async () => {
      await pose.send({ image: videoElement });
    },
    width: 640,
    height: 480
  });

  camera.start();
};

// Función para dibujar la cuadrícula
const drawGrid = (ctx, width, height, cellSize = 25) => {
  ctx.strokeStyle = '#cccccc'; // Color de las líneas de la cuadrícula
  ctx.lineWidth = 0.5;

  // Dibuja líneas verticales
  for (let x = 0; x <= width; x += cellSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Dibuja líneas horizontales
  for (let y = 0; y <= height; y += cellSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
};

// Función para calcular el ángulo entre tres puntos
const calculateAngleBetweenPoints = (p1, p2, p3) => {
  const vector1 = { x: p1.x - p2.x, y: p1.y - p2.y };
  const vector2 = { x: p3.x - p2.x, y: p3.y - p2.y };

  const dotProduct = (vector1.x * vector2.x) + (vector1.y * vector2.y);
  const magnitude1 = Math.sqrt(vector1.x ** 2 + vector1.y ** 2);
  const magnitude2 = Math.sqrt(vector2.x ** 2 + vector2.y ** 2);

  const angleRad = Math.acos(dotProduct / (magnitude1 * magnitude2));
  const angleDeg = angleRad * (180 / Math.PI);

  return angleDeg;
};


const isShoulderLineStraight = (leftShoulder, rightShoulder, tolerance = 0.05) => {
    // Calcula el ángulo entre los dos hombros con respecto a una línea horizontal
    const deltaY = leftShoulder.y - rightShoulder.y;
    const deltaX = rightShoulder.x - leftShoulder.x;

    // Calcula el ángulo en grados
    const angleRad = Math.atan2(deltaY, deltaX);
    const angleDeg = Math.abs(angleRad * (180 / Math.PI)); // Se toma el valor absoluto

    // Si el ángulo está dentro de la tolerancia, se considera recto
    return angleDeg <= tolerance;
}

export {
  loadMediaPipeScripts, 
  initializePoseEstimation,
  calculateAngleBetweenPoints,
  isShoulderLineStraight
}