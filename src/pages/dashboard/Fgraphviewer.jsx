// Force-directed graph demo displayed inside the dashboard.
import { useRef, useLayoutEffect, useState } from "react";
import { useWindowSize } from '../../utils/WindowSize.js';
import ForceGraph2D from 'react-force-graph-2d';

// Initialize canvas size tracking and render the sample graph dataset.
function FgraphviewerContent() {

  const ref = useRef(null);
  const size = useWindowSize();

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    setWidth(ref.current.offsetWidth);
    setHeight(size.height - ref.current.parentNode.offsetTop*2);
  }, [size]);

  const N = 300;
    const gData = {
      nodes: [...Array(N).keys()].map(i => ({ id: i })),
      links: [...Array(N).keys()]
        .filter(id => id)
        .map(id => ({
          source: id,
          target: Math.round(Math.random() * (id-1))
        }))
    };

  return (
    <div ref={ref} >
      <ForceGraph2D
        linkDirectionalParticles={2}
        graphData={gData}
        width={width}
        height={height}
      />
    </div>
  );
}

export default function Fgraphviewer() {
  return <FgraphviewerContent />;
}
