
export interface TwoFactorAuthProps {
  userId: string;
}

export interface TotpSetupData {
  secret: string;
  qrCodeUrl: string;
}
