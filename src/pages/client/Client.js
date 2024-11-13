// src/pages/client/Client.js
import React, { useEffect, useRef, useState } from 'react';
import {
  loadMediaPipeScripts,
  initializePoseEstimation,
  calculateAngleBetweenPoints,
  isShoulderLineStraight
} from '../client/scripsts/poseScripts';

const PoseEstimation = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [currentPose, setCurrentPose] = useState(null);

  const [seconds, setSeconds] = useState(0); // Estado para el temporizador
  const [photoURL, setPhotoURL] = useState(null);

  const imgPoses = [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Extended_arm.jpg/1200px-Extended_arm.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYH2knFjPxVQON7kOx2QPcXrolwTZEPk9g1Q&s',
    'https://i.ytimg.com/vi/r8yw6yXkZVA/maxresdefault.jpg'
  ]

  const [poseImg, setPoseImg] = useState(imgPoses[0])

  useEffect(() => {
    const setupPoseEstimation = async () => {
      await loadMediaPipeScripts();
      initializePoseEstimation(videoRef.current, canvasRef.current, setCurrentPose);
    };

    setupPoseEstimation();

    return () => {
      if (window.camera) {
        window.camera.stop();
      }
    };
  }, []);

  const handleCalculateAngle = () => {
    if (currentPose) {
      // const nose = currentPose[0]; // Nariz
      // const leftEyeInner = currentPose[1]; // Parte interna del ojo izquierdo
      // const leftEye = currentPose[2]; // Ojo izquierdo
      // const leftEyeOuter = currentPose[3]; // Parte externa del ojo izquierdo
      // const rightEyeInner = currentPose[4]; // Parte interna del ojo derecho
      // const rightEye = currentPose[5]; // Ojo derecho
      // const rightEyeOuter = currentPose[6]; // Parte externa del ojo derecho
      // const leftEar = currentPose[7]; // Oreja izquierda
      // const rightEar = currentPose[8]; // Oreja derecha
      // const mouthLeft = currentPose[9]; // Lado izquierdo de la boca
      // const mouthRight = currentPose[10]; // Lado derecho de la boca
      const leftShoulder = currentPose[11]; // Hombro izquierdo
      const rightShoulder = currentPose[12]; // Hombro derecho
      const leftElbow = currentPose[13]; // Codo izquierdo
      // const rightElbow = currentPose[14]; // Codo derecho
      const leftWrist = currentPose[15]; // Muñeca izquierda
      // const rightWrist = currentPose[16]; // Muñeca derecha
      // const leftPinky = currentPose[17]; // Dedo meñique izquierdo
      // const rightPinky = currentPose[18]; // Dedo meñique derecho
      // const leftIndex = currentPose[19]; // Dedo índice izquierdo
      // const rightIndex = currentPose[20]; // Dedo índice derecho
      // const leftThumb = currentPose[21]; // Pulgar izquierdo
      // const rightThumb = currentPose[22]; // Pulgar derecho
      // const leftHip = currentPose[23]; // Cadera izquierda
      // const rightHip = currentPose[24]; // Cadera derecha
      // const leftKnee = currentPose[25]; // Rodilla izquierda
      // const rightKnee = currentPose[26]; // Rodilla derecha
      // const leftAnkle = currentPose[27]; // Tobillo izquierdo
      // const rightAnkle = currentPose[28]; // Tobillo derecho
      // const leftHeel = currentPose[29]; // Talón izquierdo
      // const rightHeel = currentPose[30]; // Talón derecho
      // const leftFootIndex = currentPose[31]; // Punta del pie izquierdo
      // const rightFootIndex = currentPose[32]; // Punta del pie derecho

      if (leftShoulder && leftElbow && leftWrist) {
        const angle = calculateAngleBetweenPoints(leftShoulder, leftElbow, leftWrist);
        const rectShoulders = isShoulderLineStraight(leftShoulder, rightShoulder)
        console.log(`Ángulo de flexión del codo izquierdo: ${angle.toFixed(2)} grados`);
        console.log(rectShoulders)
      } else {
        console.log("Puntos clave no detectados con suficiente confianza.");
      }
    } else {
      console.log("Pose no detectada.");
    }
  };


  // Función que ejecuta el temporizador y espera a que termine
  const Timer = (time) => {
    return new Promise((resolve) => {
      setSeconds(time); // Inicializa el temporizador

      const countdown = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 1) {
            clearInterval(countdown);
            resolve(); // Resuelve la promesa cuando el tiempo llega a 0
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    });
  };

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

  const handleTakePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Dibuja la imagen del video en el canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Dibuja la cuadrícula sobre la imagen
      drawGrid(ctx, canvas.width, canvas.height);

      // Obtén la URL de datos de la imagen capturada
      const dataURL = canvas.toDataURL('image/png');
      setPhotoURL(dataURL); // Guardar la URL de datos en el estado
    }
  };

  const startRoutine = async () => {
    console.log("Inicio de la medición...");
  
    // Primer timer de 5 segundos
    await Timer(5);
    handleCalculateAngle();
    setPoseImg(imgPoses[1])

    // Primer timer de 5 segundos
    await Timer(5);
    handleCalculateAngle();
    setPoseImg(imgPoses[2])

    await Timer(5);
    handleTakePhoto()
    setPoseImg(imgPoses[0])
  
    console.log("Rutina completa.");
  };


  return (
    <div className="container pt-5">
                <br /><br />
      <div className="row">
        <div className="col-lg-8">
          <div className="video-container">
            <video ref={videoRef} width="640" height="480" autoPlay hidden ></video>
            <canvas className='shadow-left' ref={canvasRef} width="640" height="480" ></canvas>
          </div>
          <br />
          <div id="buttonContainer">
            <button className='custom-btn shadow-left' onClick={startRoutine}>Diagnostico</button>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="img-sample" style={{backgroundImage: `url(${poseImg})`}}>
          </div>
          <div className="timer">
              <h4 className='shadow-left'>{`00:00:0${seconds}`}</h4>
          </div>
        </div>
        {photoURL && <img src={photoURL} alt="Captura de la cámara" width={100} />}
      </div>
    </div>
  );
};

export default PoseEstimation;
