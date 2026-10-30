
import React, { useState } from 'react';
import { Control } from 'react-hook-form';
import { MensagemFormValues } from '../schema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X, Loader2, CheckSquare } from 'lucide-react';
import { useUserSearch } from '../hooks/useUserSearch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

interface UserSelectionFieldProps {
  control: Control<MensagemFormValues>;
  userTag?: string;
}

const UserSelectionField: React.FC<UserSelectionFieldProps> = ({ control, userTag }) => {
  const [open, setOpen] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  
  const { users, isLoading, selectedUsers, toggleUser, setSelectedUsers } = useUserSearch(userTag);
  
  // Filter users by name and/or email
  const filteredUsers = nameFilter 
    ? users.filter(user => 
        user.name?.toLowerCase().includes(nameFilter.toLowerCase()) || 
        user.email?.toLowerCase().includes(nameFilter.toLowerCase())
      )
    : users;

  const handleSelectAll = () => {
    const filteredUserIds = filteredUsers.map(user => user.id);
    setSelectedUsers(filteredUserIds);
  };

  const handleClearSelection = () => {
    setSelectedUsers([]);
  };
  
  return (
    <FormField
      control={control}
      name="selectedUsers"
      render={({ field }) => (
        <FormItem className="space-y-4">
          <FormLabel>Selecionar Usuários</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" type="button" className="w-full justify-start text-muted-foreground">
                      <Search className="mr-2 h-4 w-4" />
                      <span>Buscar e selecionar usuários</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl">
                    <DialogHeader>
                      <DialogTitle>Selecionar Usuários</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-4">
                        <Input
                          placeholder="Buscar por nome ou email..."
                          value={nameFilter}
                          onChange={(e) => setNameFilter(e.target.value)}
                          className="flex-1"
                        />
                        <div className="flex justify-between gap-2">
                          <Button 
                            variant="outline" 
                            onClick={handleSelectAll}
                            className="flex-1"
                          >
                            <CheckSquare className="mr-2 h-4 w-4" />
                            Selecionar Todos
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={handleClearSelection}
                            className="flex-1"
                          >
                            Limpar Seleção
                          </Button>
                        </div>
                      </div>
                      
                      {isLoading ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                      ) : (
                        <ScrollArea className="h-72 rounded-md border p-4">
                          {filteredUsers.length > 0 ? (
                            <div className="space-y-2">
                              {filteredUsers.map(user => (
                                <div key={user.id} className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={user.id} 
                                    checked={selectedUsers.includes(user.id)} 
                                    onCheckedChange={() => {
                                      toggleUser(user.id);
                                      const newSelection = selectedUsers.includes(user.id)
                                        ? selectedUsers.filter(id => id !== user.id)
                                        : [...selectedUsers, user.id];
                                      field.onChange(newSelection);
                                    }}
                                  />
                                  <label
                                    htmlFor={user.id}
                                    className="text-sm flex-1 flex justify-between cursor-pointer"
                                  >
                                    <span>{user.name}</span>
                                    <span className="text-muted-foreground">{user.email}</span>
                                  </label>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">
                              Nenhum usuário encontrado
                            </div>
                          )}
                        </ScrollArea>
                      )}
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          {selectedUsers.length} usuários selecionados
                        </span>
                        <Button onClick={() => setOpen(false)}>Confirmar</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {selectedUsers.length > 0 ? (
                  selectedUsers.map(userId => {
                    const user = users.find(u => u.id === userId);
                    return (
                      <Badge key={userId} variant="secondary" className="px-2 py-1">
                        {user?.name || user?.email || userId}
                        <button
                          type="button"
                          onClick={() => {
                            toggleUser(userId);
                            const newSelection = selectedUsers.filter(id => id !== userId);
                            field.onChange(newSelection);
                          }}
                          className="ml-1 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Nenhum usuário selecionado
                  </span>
                )}
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default UserSelectionField;
