import { useEffect } from 'react';

export default function usePreventScroll(dep: boolean) {
  useEffect(() => {
    const body = document.querySelector('body');
    const nextBody = document.getElementById('__next');
    if (dep) {
      body.classList.add('prevent-scroll');
      nextBody.setAttribute('aria-hidden', 'true');
    } else {
      body.classList.remove('prevent-scroll');
      nextBody.removeAttribute('aria-hidden');
    }
  }, [dep]);
}
