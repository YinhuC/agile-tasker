import React from 'react';
import { Link } from 'react-router';
import classes from './Wordmark.module.css';

type WordmarkProps = {
  to: string;
  size?: number;
};

/** The lowercase "agile tasker." wordmark with its yellow full stop, linking home. */
function Wordmark({ to, size = 22 }: WordmarkProps) {
  return (
    <Link
      to={to}
      className={classes.root}
      style={{ fontSize: size }}
      aria-label='agile tasker home'
    >
      agile tasker<span className={classes.stop}>.</span>
    </Link>
  );
}

export default Wordmark;
