
import { useAuth } from '@/components/auth';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoTab } from './PersonalInfoTab';
import { SecurityTab } from './SecurityTab';
import { ActivityLogsTab } from './ActivityLogsTab';
import { Phone, Shield, ClipboardList } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="personal" className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="logs">Atividade</TabsTrigger>
          </TabsList>
        </div>

        {/* Personal Information Tab */}
        <TabsContent value="personal">
          <PersonalInfoTab user={user} />
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <SecurityTab userId={user.id} />
        </TabsContent>

        {/* Activity Logs Tab */}
        <TabsContent value="logs">
          <ActivityLogsTab userId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
