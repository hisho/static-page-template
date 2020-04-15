import '@babel/polyfill';
import 'what-input';
import 'picturefill';
import './@modules/UserAgent';
import _SmoothScroll from './@modules/SmoothScroll';
import _setViewportProperty from "./@modules/SetViewportProperty";
// import safariMediaQueryListPolyfill from './@modules/SafariMediaQueryListPolyfill';

// safariMediaQueryListPolyfill();
_setViewportProperty();
_SmoothScroll();
