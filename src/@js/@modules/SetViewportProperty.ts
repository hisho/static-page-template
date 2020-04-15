const enum EventName {
  LOAD = 'load',
  DOM_CONTENT_LOADED = 'DOMContentLoaded',
  CLICK = 'click',
  RESIZE = 'resize',
}

export default function _setViewportProperty(): void {
  function setViewportProperty(): void {
    const vh: number = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh + 0.01}px`);
  }
  let lastInnerWidth: number = window.innerWidth;
  function updateInnerWidth(): void {
    const updateLastInnerWidth: boolean = lastInnerWidth === window.innerWidth;
    if (!updateLastInnerWidth) {
      setViewportProperty();
    }
    lastInnerWidth = window.innerWidth;
  }
  setViewportProperty();
  window.addEventListener(EventName.RESIZE, updateInnerWidth);
}
