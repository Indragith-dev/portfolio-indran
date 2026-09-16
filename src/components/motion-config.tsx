import { MotionConfig } from "motion/react";
import React from "react";

const MotionConfigWrapper = ({ children }: { children: React.ReactNode }) => {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
};

export default MotionConfigWrapper;
