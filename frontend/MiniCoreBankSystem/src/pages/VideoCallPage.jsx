import React from "react";
import { useParams } from "react-router-dom";
import VideoCall from "./VideoCall";

const VideoCallPage = () => {
  const { roomName } = useParams();
  return <VideoCall roomName={roomName} />;
};

export default VideoCallPage;
