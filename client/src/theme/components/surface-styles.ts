import {
  Anchor,
  Card,
  MantineThemeOverride,
  Modal,
  Notification,
  Title,
} from '@mantine/core';
import classes from './surface.module.css';

export const surfaces: MantineThemeOverride['components'] = {
  Title: Title.extend({ classNames: { root: classes.title } }),
  Card: Card.extend({
    defaultProps: { radius: 'md' },
    classNames: { root: classes.card },
  }),
  Modal: Modal.extend({
    defaultProps: {
      radius: 'lg',
      overlayProps: { backgroundOpacity: 0.5, color: '#16181a', blur: 2 },
    },
    classNames: {
      content: classes.modalContent,
      header: classes.modalHeader,
      title: classes.modalTitle,
    },
  }),
  Notification: Notification.extend({
    defaultProps: { radius: 'md' },
    classNames: {
      root: classes.notification,
      title: classes.notificationTitle,
    },
  }),
  Anchor: Anchor.extend({ defaultProps: { c: 'dark.8', underline: 'hover' } }),
};
