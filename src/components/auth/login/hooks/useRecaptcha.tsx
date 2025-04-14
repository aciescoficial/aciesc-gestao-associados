
import { useEffect, useState } from 'react';
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
  const [executionAttempted, setExecutionAttempted] = useState(false);
  const { 
    recaptchaLoaded: apiLoaded, 
    isEnabled, 
    executeRecaptcha 
  } = useRecaptchaV2();

  // Update parent component when reCAPTCHA loads
  useEffect(() => {
    if (apiLoaded) {
      console.log('reCAPTCHA API loaded successfully');
      setRecaptchaLoaded(true);
    }
  }, [apiLoaded, setRecaptchaLoaded]);

  // Execute reCAPTCHA on mount and store token
  useEffect(() => {
    if (apiLoaded && isEnabled && !executionAttempted) {
      setExecutionAttempted(true);
      
      const getToken = async () => {
        try {
          console.log(`Executing reCAPTCHA for ${containerId}`);
          const action = containerId.includes('login') ? 'login_page' : 'register_page';
          const token = await executeRecaptcha(action);
          console.log(`reCAPTCHA token received for ${action}: ${token ? 'success' : 'empty'}`);
          if (token) {
            setRecaptchaToken(token);
          } else {
            console.error('Empty reCAPTCHA token received');
          }
        } catch (error) {
          console.error('Error executing reCAPTCHA:', error);
        }
      };

      getToken();
    }
  }, [apiLoaded, isEnabled, containerId, executeRecaptcha, setRecaptchaToken, executionAttempted]);

  return {
    containerId,
    loaded: recaptchaLoaded,
    isEnabled
  };
};
