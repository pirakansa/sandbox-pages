import styles from './Dashboard.module.scss';
import { useEffect } from 'react';

function CameraviewerContent() {

  useEffect(() => {
    const video  = document.querySelector('#js-video')

    navigator.mediaDevices
      .getUserMedia({
          video: { facingMode: "user" },
          audio: false
      })
      .then(function(stream) {
          video.srcObject = stream
          video.onloadedmetadata = function(e) {
              video.play()
          }
      })
      .catch(function(err) {
          alert('Error!!')
      })
  }, []);

  return (
    <>
      <div className={styles.canv}>
        <canvas id="js-canvas"></canvas>
      </div>
      <div className={styles.reader}>
        {/* <video id="js-video" className="reader-video" autoplay playsinline></video> */}
        <video id="js-video" className="reader-video" ></video>
      </div>
    </>
  );
}

export default function Cameraviewer() {
  return <CameraviewerContent />;
}