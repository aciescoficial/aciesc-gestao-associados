
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { AvatarUpload } from './components/AvatarUpload';
import { ProfileForm } from './components/ProfileForm';
import { useProfileData } from './hooks/useProfileData';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface PersonalInfoProps {
  user: any;
}

export const PersonalInfoTab = ({ user }: PersonalInfoProps) => {
  const {
    name,
    setName,
    phone,
    setPhone,
    role,
    avatarUrl,
    setAvatarUrl,
    isLoading
  } = useProfileData(user);
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <LoadingSpinner size="medium" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meu Perfil</CardTitle>
        <CardDescription>
          Gerencie suas informações pessoais
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <AvatarUpload 
            user={user} 
            avatarUrl={avatarUrl} 
            onAvatarUpdate={setAvatarUrl} 
          />
          
          <ProfileForm 
            user={user}
            name={name}
            phone={phone}
            role={role}
            onNameChange={setName}
            onPhoneChange={setPhone}
          />
        </div>
      </CardContent>
    </Card>
  );
};
