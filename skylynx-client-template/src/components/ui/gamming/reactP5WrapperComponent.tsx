// ================================================
// ✅ Component: ReactP5WrapperComponent
// File: components/sketch/ReactP5WrapperComponent.tsx
// Description: React wrapper for dynamic p5.js sketches
// ================================================

import p5 from "p5";
import React, { createRef, FC, memo, useEffect, useState } from "react";
import deepEqual from "deep-equal";

// Interfaces
export interface SketchProps {
  [key: string]: any;
}

export interface Sketch {
  (instance: P5Instance): void;
}

export interface P5WrapperProps extends SketchProps {
  sketch: Sketch;
}

export interface P5Instance extends p5 {
  updateWithProps?: (props: SketchProps) => void;
}

// Utility to mount sketch
export function createCanvas(sketch: Sketch, container: HTMLDivElement) {
  return new p5(sketch, container) as P5Instance;
}

// Component
export const ReactP5WrapperComponent: FC<P5WrapperProps> = ({
  sketch,
  children,
  ...props
}) => {
  const wrapper = createRef<HTMLDivElement>();
  const [instance, setInstance] = useState<P5Instance>();

  useEffect(() => {
    if (!wrapper.current) return;
    instance?.remove(); // Cleanup any previous
    const canvas = createCanvas(sketch, wrapper.current);
    setInstance(canvas);
  }, [sketch, wrapper.current]);

  useEffect(() => {
    instance?.updateWithProps?.(props);
  }, [props]);

  return <div ref={wrapper}>{children}</div>;
};
