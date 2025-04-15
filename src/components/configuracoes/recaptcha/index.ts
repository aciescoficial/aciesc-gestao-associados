
import RecaptchaConfig from './RecaptchaConfig';

export default RecaptchaConfig;
// Export types without duplicating RecaptchaConfigValues
export type { RecaptchaFormValues } from './types';
export { useRecaptchaForm } from './hooks/useRecaptchaForm';
