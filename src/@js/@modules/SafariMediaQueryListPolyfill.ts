export default function safariMediaQueryListPolyfill(): void {
  // MediaQueryList.prototype.addEventListener.ts
  if (typeof matchMedia !== 'undefined' && !matchMedia('all').addEventListener) {
    console.log('installing polyfill: MediaQueryList.prototype.addEventListener');

    const originalMatchMedia = matchMedia;
    self.matchMedia = function matchMedia(mediaQuery: string): MediaQueryList {
      const mql = originalMatchMedia(mediaQuery);
      mql.addEventListener = function(eventName: 'change', listener: (event: MediaQueryListEvent) => void) {
        this.addListener(listener);
      };
      return mql;
    };
  }
}

console.log('test');
