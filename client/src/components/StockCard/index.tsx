import React from 'react';
import { Box, BoxProps } from '@mantine/core';
import classes from './StockCard.module.css';

type StockCardProps = BoxProps & {
  stock?: 'yellow' | 'blue' | 'white';
  punched?: boolean;
  children: React.ReactNode;
};

/** A printed production card in a vinyl sleeve: coloured stock, ink rules, optional punched hole. */
function StockCard({
  stock = 'yellow',
  punched = true,
  className,
  children,
  ...props
}: StockCardProps) {
  return (
    <Box
      className={`${classes.root} ${className ?? ''}`}
      data-stock={stock}
      {...props}
    >
      {punched && <span className={classes.hole} aria-hidden />}
      {children}
    </Box>
  );
}

export default StockCard;
