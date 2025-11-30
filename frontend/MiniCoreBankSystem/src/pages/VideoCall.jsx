import React, { useEffect, useRef } from "react";

const VideoCall = ({ roomName }) => {
  const jitsiContainerRef = useRef(null);

  useEffect(() => {
    const loadJitsiScript = () => {
      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.async = true;
      script.onload = () => initializeJitsi();
      document.body.appendChild(script);
    };

    const initializeJitsi = () => {
      if (window.JitsiMeetExternalAPI) {
        const domain = "meet.jit.si";
        const options = {
          roomName: roomName,
          parentNode: jitsiContainerRef.current,
          width: "100%",
          height: "100%",
        };
        new window.JitsiMeetExternalAPI(domain, options);
      } else {
        console.error("Jitsi Meet API script not loaded.");
      }
    };

    if (!window.JitsiMeetExternalAPI) {
      loadJitsiScript();
    } else {
      initializeJitsi();
    }
  }, [roomName]);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <div ref={jitsiContainerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default VideoCall;



