
import { useEffect } from 'react';
import { useRecaptchaV2 } from './useRecaptchaV2';

/**
 * Hook for rendering and initializing reCAPTCHA in login forms
 * 
 * @param containerId - DOM ID where reCAPTCHA should be rendered
 * @param recaptchaLoaded - State variable indicating if reCAPTCHA is loaded
 * @param setRecaptchaLoaded - State setter for recaptchaLoaded
 * @param setRecaptchaToken - State setter for storing the reCAPTCHA token
 */
export const useRecaptcha = (
  containerId: string,
  recaptchaLoaded: boolean,
  setRecaptchaLoaded: (loaded: boolean) => void,
  setRecaptchaToken: (token: string) => void
) => {
  const { recaptchaLoaded: apiLoaded, isEnabled, executeRecaptcha } = useRecaptchaV2();

  // Update parent component when reCAPTCHA loads
  useEffect(() => {
    if (apiLoaded) {
      setRecaptchaLoaded(true);
    }
  }, [apiLoaded, setRecaptchaLoaded]);

  // Execute reCAPTCHA on mount and store token
  useEffect(() => {
    if (apiLoaded && isEnabled) {
      const getToken = async () => {
        try {
          const token = await executeRecaptcha('login_page');
          setRecaptchaToken(token);
        } catch (error) {
          console.error('Error executing reCAPTCHA:', error);
        }
      };

      getToken();
    }
  }, [apiLoaded, isEnabled, executeRecaptcha, setRecaptchaToken]);

  return {
    containerId,
    loaded: recaptchaLoaded
  };
};
