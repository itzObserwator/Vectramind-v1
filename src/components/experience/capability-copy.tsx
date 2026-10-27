"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CapabilityContent } from "./capability-content";
export default function CapabilityCopy({ active }: { active: number }) {
  const reduced = useReducedMotion();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={active}
        initial={reduced ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25 }}
      >
        <CapabilityContent active={active} />
      </motion.div>
    </AnimatePresence>
  );
}
