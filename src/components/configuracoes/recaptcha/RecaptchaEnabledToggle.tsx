
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';
import { RecaptchaFormValues } from './types';

interface RecaptchaEnabledToggleProps {
  form: UseFormReturn<RecaptchaFormValues>;
}

const RecaptchaEnabledToggle: React.FC<RecaptchaEnabledToggleProps> = ({ form }) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="recaptcha-enabled"
        checked={form.watch('enabled')}
        onCheckedChange={(checked) => form.setValue('enabled', checked)}
      />
      <Label htmlFor="recaptcha-enabled">
        {form.watch('enabled') ? 'reCAPTCHA ativado' : 'reCAPTCHA desativado'}
      </Label>
    </div>
  );
};

export default RecaptchaEnabledToggle;
