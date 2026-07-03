// ================================================
// ✅ Component: P5Sketch
// Description: Renders a dynamic p5.js sketch (memoized)
// ================================================

import React, {
  FC,
  ReactElement,
  createRef,
  useState,
  memo,
  useEffect,
} from "react";
import { createCanvas, P5Instance } from "./reactP5WrapperComponent";
import { SketchLive } from "../../p5sketches/trees/sketchLive";
import { SketchRoot } from "../styled/p5Sketch";

const P5Sketch: FC<{}> = memo((): ReactElement => {
  const [isFirstLoaded, setFirstLoad] = useState<boolean>(true);
  const [instance, setInstance] = useState<P5Instance>();
  const wrapper = createRef<HTMLDivElement>();

  useEffect(() => {
    if (!wrapper.current || !SketchLive) return;
    if (isFirstLoaded) {
      instance?.remove();
      const canvas = createCanvas(SketchLive, wrapper.current);
      setInstance(canvas);
      setFirstLoad(false);
    }
  }, [isFirstLoaded, instance, wrapper]);

  return <SketchRoot ref={wrapper} />;
});

export default P5Sketch;
