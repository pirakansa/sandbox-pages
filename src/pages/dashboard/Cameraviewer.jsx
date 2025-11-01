// Camera-based QR code scanner displayed within a modal dialog.
import styles from './Dashboard.module.scss';
import { useEffect, useState, useRef } from 'react';

import jsQR from 'jsqr';
import Dialog from '@mui/material/Dialog';
import AbsButtomBtn from '../../components/atoms/AbsButtomBtn';
import UpperInfo from '../../components/block/UpperInfo';
import Button from '@mui/material/Button';


// Handle camera streaming, QR scanning, and teardown logic.
function CameraviewerContent() {

  const [isPlay, setIsPlay] = useState(false);
  const timeoutRef = useRef(null);
  const [scannedData, setScannedData] = useState(null);
  const [copyMessage, setCopyMessage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const copyResetTimeoutRef = useRef(null);

  const hSuccess = (stream) => {
    const video = videoRef.current;
    video.srcObject = stream;
    streamRef.current = stream;
    video.onloadedmetadata = function(_e) {
      video.play();
      const intervalId = setInterval(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = video.clientWidth;
        canvas.height = video.clientHeight;
        ctx.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
        const imageData = ctx.getImageData(0, 0, video.clientWidth, video.clientHeight)
        const code = jsQR(imageData.data, video.clientWidth, video.clientHeight)
        if (code) {
          setScannedData(code.data);
        }
      }, 500)
      timeoutRef.current = intervalId;
    }
  }

  // Render the latest scanned QR payload when available.
  const handleCopyScannedData = async () => {
    if (!scannedData) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(scannedData);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = scannedData;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'absolute';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopyMessage('Copied to clipboard');
    } catch (err) {
      console.error('Failed to copy QR code value', err);
      setCopyMessage('Copy failed');
    }

    if (copyResetTimeoutRef.current) {
      clearTimeout(copyResetTimeoutRef.current);
    }

    copyResetTimeoutRef.current = setTimeout(() => {
      setCopyMessage(null);
      copyResetTimeoutRef.current = null;
    }, 2000);
  };

  const showScannedInfo = () => {
    if (scannedData == null) return;

    return(
      <UpperInfo>
        <div className={styles.scannedInfo}>
          <span className={styles.scannedText}>{scannedData}</span>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={handleCopyScannedData}
          >
            Copy
          </Button>
        </div>
        {copyMessage && (
          <div className={styles.copyMessage}>{copyMessage}</div>
        )}
      </UpperInfo>
    );
  }

  useEffect(() => {
    if ( !videoRef.current ) return;
    const video = videoRef.current;
    const handlePlaying = (_ev) => {
      setIsPlay(true);
    };
    video.addEventListener("playing", handlePlaying);

    navigator.mediaDevices.getUserMedia({
      video: {
        facingMode : {
          exact : 'environment'
        }
      },
      audio: false
    }).then(hSuccess).catch(() => {
      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      }).then(hSuccess).catch(function(err) {
        console.log(err)
      })
    })

    return () => {
      video.removeEventListener("playing", handlePlaying);
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
        timeoutRef.current = null;
      }
      const currentVideo = video;
      if (currentVideo && currentVideo.srcObject) {
        currentVideo.srcObject.getTracks().forEach((track) => track.stop());
        currentVideo.srcObject = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (copyResetTimeoutRef.current) {
        clearTimeout(copyResetTimeoutRef.current);
        copyResetTimeoutRef.current = null;
      }
    };
  }, [])

  useEffect(() => {
    if (!scannedData && copyResetTimeoutRef.current) {
      clearTimeout(copyResetTimeoutRef.current);
      copyResetTimeoutRef.current = null;
    }
    setCopyMessage(null);
  }, [scannedData]);

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
          if (!videoRef.current || !isPlay) return;

          const video = videoRef.current;
          if (video.srcObject) {
            const tracks = video.srcObject.getTracks();
            tracks.forEach(function (track) {
              track.stop();
            });
            video.srcObject = null;
          }
          if (timeoutRef.current) {
            clearInterval(timeoutRef.current);
            timeoutRef.current = null;
          }
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
          }
          setIsPlay(false);
          setTimeout(()=>{
            window.history.back()
          }, 300)
        }}
      />
      {showScannedInfo()}
    </>
  );
}

// Wrap the content in a full-screen dialog for immersive scanning.
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
