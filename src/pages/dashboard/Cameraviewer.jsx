// Camera-based QR code scanner displayed within a modal dialog.
import { useEffect, useState, useRef } from 'react';

import jsQR from 'jsqr';
import AbsButtomBtn from '../../components/atoms/AbsButtomBtn';
import UpperInfo from '../../components/block/UpperInfo';


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
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <span className="flex-1 break-words text-sm leading-relaxed">
            {scannedData}
          </span>
          <button
            type="button"
            onClick={handleCopyScannedData}
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-400"
          >
            Copy
          </button>
        </div>
        {copyMessage && (
          <div className="mt-1 text-xs text-blue-700 dark:text-blue-200">
            {copyMessage}
          </div>
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
    <div className="relative flex h-full flex-1 flex-col items-center justify-center overflow-hidden bg-slate-950 text-white">
      <div className="hidden">
        <canvas ref={canvasRef} id="js-canvas"></canvas>
      </div>
      <div className="flex h-full w-full flex-1 items-center justify-center">
        <video
          ref={videoRef}
          id="js-video"
          className="max-h-[80vh] w-full max-w-xl rounded-3xl bg-black object-cover shadow-2xl shadow-black/60"
          playsInline={true}
        ></video>
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
    </div>
  );
}

// Wrap the content in a full-screen dialog for immersive scanning.
export default function Cameraviewer() {
  return (
    <div className="fixed inset-0 z-[1400] flex bg-slate-950">
      <CameraviewerContent />
    </div>
  );
}
