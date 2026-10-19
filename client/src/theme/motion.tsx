import React from 'react';
import { motion, Variants } from 'motion/react';

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Spread on the element that starts a reveal; plays once as its top crosses 88% of the viewport. */
export const reveal = {
  initial: 'hidden',
  whileInView: 'shown',
  viewport: { once: true, margin: '0px 0px -12% 0px' },
} as const;

/** Spread on page-top content that is already on screen at load. */
export const enter = { initial: 'hidden', animate: 'shown' } as const;

export const rise: Variants = {
  hidden: { opacity: 0, y: 20 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

/** Screenshots settle in from slightly smaller and lower, a beat slower than text. */
export const settle: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  shown: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.9, ease: EASE_OUT },
  },
};

export const stagger = (gap = 0.08, delay = 0): Variants => ({
  hidden: {},
  shown: { transition: { staggerChildren: gap, delayChildren: delay } },
});

type RootProps = Record<string, unknown>;

/** Mantine `renderRoot` that reveals the element itself once it scrolls into view. */
export const revealRoot = (variants: Variants = rise) =>
  function RevealRoot(rootProps: RootProps) {
    return <motion.div {...rootProps} {...reveal} variants={variants} />;
  };

/** Mantine `renderRoot` that plays on mount, for content already on screen at load. */
export const enterRoot = (variants: Variants = rise) =>
  function EnterRoot(rootProps: RootProps) {
    return <motion.div {...rootProps} {...enter} variants={variants} />;
  };

/** Mantine `renderRoot` for a child that takes its cue from a revealing parent. */
export const childRoot = (variants: Variants = rise) =>
  function ChildRoot(rootProps: RootProps) {
    return <motion.div {...rootProps} variants={variants} />;
  };
