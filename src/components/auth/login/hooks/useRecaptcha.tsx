
import { useEffect } from 'react';

export const useRecaptcha = (
  containerId: string,
  recaptchaLoaded: boolean,
  setRecaptchaLoaded: (loaded: boolean) => void,
  setRecaptchaToken: (token: string) => void
) => {
  // Initialize reCAPTCHA when component mounts
  useEffect(() => {
    // Initialize reCAPTCHA when component mounts
    const loadRecaptcha = () => {
      if (window.grecaptcha) {
        window.onRecaptchaLoad = () => {
          setRecaptchaLoaded(true);
          
          // Render reCAPTCHA in the container
          const recaptchaContainer = document.getElementById(containerId);
          
          if (recaptchaContainer) {
            window.grecaptcha.render(recaptchaContainer, {
              'sitekey': '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', // Use your actual site key here
              'size': 'normal',
              'callback': (token: string) => setRecaptchaToken(token)
            });
          }
        };
      }
    };

    // Load reCAPTCHA script
    if (!window.grecaptcha) {
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    } else {
      loadRecaptcha();
    }

    return () => {
      // Cleanup if needed
      window.onRecaptchaLoad = () => {};
    };
  }, [containerId, setRecaptchaLoaded, setRecaptchaToken]);
};
