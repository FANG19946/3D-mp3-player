import React, { useEffect, useRef, useState } from 'react';
import IpodModel from './IpodModel';
import MusicPanel from './MusicPanel';

export default function Ipod(props) {
  const groupRef = useRef();
  const screenRef = useRef();
  const [showUI, setShowUI] = useState(false);

  return (
    <>
      <IpodModel
        groupRef={groupRef}
        screenRef={screenRef}
        onTextureApplied={() => setShowUI(true)}
        {...props}
      />
      {showUI && <MusicPanel screenRef={screenRef} />}
    </>
  );
}
