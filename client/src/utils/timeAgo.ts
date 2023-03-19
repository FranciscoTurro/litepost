export const timeAgo = (unixDate: string) => {
  const timestamp = parseInt(unixDate);
  const now = new Date().getTime();
  const elapsedMs = now - timestamp;

  const msInSecond = 1000;
  const msInMinute = msInSecond * 60;
  const msInHour = msInMinute * 60;
  const msInDay = msInHour * 24;
  const msInWeek = msInDay * 7;

  if (elapsedMs >= msInWeek) {
    const weeks = Math.floor(elapsedMs / msInWeek);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (elapsedMs >= msInDay) {
    const days = Math.floor(elapsedMs / msInDay);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (elapsedMs >= msInHour) {
    const hours = Math.floor(elapsedMs / msInHour);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const minutes = Math.floor(elapsedMs / msInMinute);
    return `${minutes < 0 ? 0 : minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
};
