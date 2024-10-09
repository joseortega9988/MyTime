import moment from 'moment-timezone';

const getDateStatus = (taskDate) => {
  // Get the device's default time zone
  const timeZone = moment.tz.guess();

  // Parse the task date and convert it to the device's local time zone
  const taskDateObj = moment(taskDate).tz(timeZone);

  // Get today's date in the device's time zone, with the time starting at midnight
  const today = moment().tz(timeZone).startOf('day');

  // Calculate the difference in days
  const timeDifference = taskDateObj.diff(today, 'days', true);

  if (timeDifference >= 0 && timeDifference < 1) {
    return 'Today';
  } else if (timeDifference >= 1 && timeDifference < 2) {
    return 'Tomorrow';
  } else if (timeDifference >= -1 && timeDifference < 0) {
    return 'Yesterday';
  } else if (timeDifference < -1) {
    return `Expired (${taskDateObj.format('L')})`; // Return expired with the date
  } else {
    return taskDateObj.format('L'); // Return the date normally
  }
};

export default getDateStatus;
