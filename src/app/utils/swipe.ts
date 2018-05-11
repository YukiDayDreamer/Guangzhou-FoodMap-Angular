/**
 * get the next index of the swipe action
 * @param action string
 * @param list array
 * @param currentIndex number
 * @returns number
 */
export const swipe = function (action: string, list: Array<any>, currentIndex: number) {

  // constant for swipe action: left or right
  const SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };

  // out of range
  if (currentIndex > list.length || currentIndex < 0) {
    return -1;
  }

  let nextIndex = 0;

  // swipe right, previous feature
  if (action === SWIPE_ACTION.RIGHT) {
    const isFirst = currentIndex === 0;
    nextIndex = isFirst ? list.length - 1 : currentIndex - 1;
  }

  // swipe left, next feature
  if (action === SWIPE_ACTION.LEFT) {
    const isLast = currentIndex === list.length - 1;
    nextIndex = isLast ? 0 : currentIndex + 1;
  }

  return nextIndex;
};
