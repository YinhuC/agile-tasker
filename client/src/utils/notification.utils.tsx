import React from 'react';
import { MdError } from 'react-icons/md';
import { notifications } from '@mantine/notifications';

export const GeneralErrorObject = {
  title: 'Something went wrong.',
  message:
    "The server couldn't be reached. Only the frontend is hosted right now; clone the repo to run the full app.",
  color: 'signal',
  icon: <MdError />,
};

/** Replaces any queued toasts with the general error toast. */
export const showGeneralError = () => {
  notifications.cleanQueue();
  notifications.show(GeneralErrorObject);
};
