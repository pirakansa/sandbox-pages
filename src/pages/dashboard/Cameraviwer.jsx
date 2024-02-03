import styles from './Dashboard.module.scss';
import { useEffect, useState, useRef } from 'react';

import jsQR from 'jsqr';
import Dialog from '@mui/material/Dialog';
import AbsButtomBtn from '../../components/atoms/AbsButtomBtn';


function CameraviewerContent() {

  const [isPlay, setIsPlay] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if ( !videoRef.current ) return;
    const video = videoRef.current;
    video.addEventListener("playing", (event) => {
      setIsPlay(true);
    });

    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    }).then(function(stream) {
      video.srcObject = stream;
      video.onloadedmetadata = function(e) {
        video.play();
        let timeoutId = setInterval(() => {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          canvas.width = video.clientWidth;
          canvas.height = video.clientHeight;
          ctx.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
          const imageData = ctx.getImageData(0, 0, video.clientWidth, video.clientHeight)
          const code = jsQR(imageData.data, video.clientWidth, video.clientHeight)
          if (code) {
            console.log(code.data)
          }
        }, 500)
        setTimeoutId(timeoutId);
  //   // return () => {
  //   //   clearTimeout(timeoutId)
  //   // }
      }
    }).catch(function(err) {
      console.log(err)
    })
  }, [])

  return (
    <>
      <div className={styles.qrcanv}>
        <canvas ref={canvasRef} id="js-canvas"></canvas>
      </div>
      <div className={styles.centerCam}>
        <video ref={videoRef} id="js-video" className="reader-video" playsInline={true} ></video>
      </div>

      <AbsButtomBtn
        onclick={()=>{
          if ( !videoRef.current && isPlay) return;

          const video = videoRef.current;
          const tracks = video.srcObject.getTracks();
          tracks.forEach(function (track) {
            track.stop();
          });
          video.srcObject = null;
          clearTimeout(timeoutId)
          // window.history.back()
          setTimeout(()=>{window.history.back()}, 1000)
          
        }}
      />
    </>
  );
}

export default function Cameraviewer() {
  return (
    <Dialog
      fullScreen
      open={true}
    >
      <CameraviewerContent />
    </Dialog>
  );
}