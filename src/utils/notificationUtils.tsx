// src/utils/notificationUtils.ts

import { notification } from 'antd';

export const openNotificationWithIcon = (
  type: 'success' | 'info' | 'warning' | 'error',
  message: string,
  description: string
) => {
  notification[type]({
    message,
    description,
    placement: 'topRight',
    duration: 3,
  });
};
