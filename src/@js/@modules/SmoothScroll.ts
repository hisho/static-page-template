import SweetScroll from 'sweet-scroll';
// import Breakpoints from '../../@scss/@foundations/_css_variables.scss';

export default function _SmoothScroll(): void {
  const linkElements = 'a[href^="#"]';
  const topButton = 'js-top-button';
  if (document.getElementById(topButton)) new SweetScroll({ trigger: `#${topButton}` });
  if (document.querySelector(linkElements)) {
    new SweetScroll({ trigger: linkElements });
    // const scroller = new SweetScroll({ trigger: linkElements });
    // const mediaQuery = matchMedia(`(min-width: ${Breakpoints.sm}px)`);
    // const handle = (): void => {
    //   if (!mediaQuery.matches) {
    //     scroller.update({ header: '#header' });
    //   } else {
    //     scroller.update({ header: '#sticky_header' });
    //   }
    // };
    // handle();
    // mediaQuery.addEventListener('change', () => handle());
  }
}
