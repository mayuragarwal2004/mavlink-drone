import React, { useEffect, useRef, useState } from "react";
import { useLoader, useFrame } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const ModelViewer = ({imudata}) => {
  // const [imudata, setimudata] = useState({ roll: 0, pitch: 0.5, yaw: 0 });
  const gltf = useLoader(GLTFLoader, "/drone/scene.gltf");
  const modelRef = useRef();

  useEffect(() => {
    modelRef.current.position.x = 0; // Example: set X position to 1
    modelRef.current.position.y = -0.65; // Example: set Y position to 0
    modelRef.current.position.z = 2; // Example: set Z position to -2
  }, [])
  


  useFrame(() => {
    // Update the rotation angles (in radians) for the X, Y, and Z axes
    if (modelRef.current.rotation.x.toFixed(5) > imudata.pitch)
      modelRef.current.rotation.x -= 0.01;
    else if (modelRef.current.rotation.x.toFixed(5) < imudata.pitch)
      modelRef.current.rotation.x += 0.01;

    if (modelRef.current.rotation.y.toFixed(5) > -imudata.yaw)
      modelRef.current.rotation.y -= 0.01;
    else if (modelRef.current.rotation.y.toFixed(5) < -imudata.yaw)
      modelRef.current.rotation.y += 0.01;

    if (modelRef.current.rotation.z.toFixed(5) > -imudata.roll)
      modelRef.current.rotation.z -= 0.01;
    else if (modelRef.current.rotation.z.toFixed(5) < -imudata.roll)
      modelRef.current.rotation.z += 0.01;
  });

  return (
    <group ref={modelRef}>
      <primitive object={gltf.scene} />
    </group>
  );
};

export default ModelViewer;
