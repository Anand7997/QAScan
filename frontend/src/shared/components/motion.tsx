import { type ReactNode, useEffect, useState } from "react";
import { Box, type BoxProps } from "@mui/material";
import { animate, motion } from "motion/react";

const MotionBox = motion.create(Box);

export function MotionReveal({
  children,
  delay = 0,
  ...rest
}: BoxProps & { delay?: number }) {
  return (
    <MotionBox
      className="report-motion-reveal"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      {...(rest as object)}
    >
      {children}
    </MotionBox>
  );
}

export function AnimatedNumber({
  value,
  format,
  duration = 1.1,
}: {
  value: number;
  format?: (n: number) => ReactNode;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => controls.stop();
  }, [value, duration]);

  return <>{format ? format(display) : Math.round(display)}</>;
}
