import React from 'react';
import { Box, BoxProps } from '@mantine/core';
import classes from './ScreenFrame.module.css';

type ScreenFrameProps = BoxProps & {
  kind: 'window' | 'phone';
  label?: string;
  children: React.ReactNode;
};

/** Ink frame around a real capture of the app: a labelled window or a phone bezel. */
function ScreenFrame({
  kind,
  label,
  className,
  children,
  ...props
}: ScreenFrameProps) {
  return (
    <Box
      className={`${classes.root} ${className ?? ''}`}
      data-kind={kind}
      {...props}
    >
      {kind === 'window' && (
        <div className={classes.bar} aria-hidden>
          <span className={classes.stop} />
          {label}
        </div>
      )}
      <div className={classes.screen}>{children}</div>
    </Box>
  );
}

export default ScreenFrame;
