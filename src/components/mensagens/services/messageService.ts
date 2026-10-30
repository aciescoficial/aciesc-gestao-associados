
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Message, MessagePriority, NewMessageData } from '../types';

export const fetchMessages = async () => {
  const { data: currentUser } = await supabase.auth.getUser();
  
  try {
    const { data: messagesData, error } = await supabase
      .from('messages')
      .select(`
        id,
        title,
        content,
        priority,
        created_at,
        sender_id,
        read_by
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Fetch user data separately
    const senderIds = messagesData
      .map(msg => msg.sender_id)
      .filter(Boolean);
    
    // Get sender information
    let senderMap: Record<string, { name: string; email: string }> = {};
    
    if (senderIds.length > 0) {
      const { data: userData, error: userError } = await supabase
        .from('user')
        .select('id, name, email')
        .in('id', senderIds);
      
      if (!userError && userData) {
        senderMap = userData.reduce((acc, user) => ({
          ...acc,
          [user.id]: { name: user.name || user.email, email: user.email }
        }), {});
      }
    }

    const transformedMessages = messagesData.map(msg => ({
      id: msg.id,
      title: msg.title,
      content: msg.content,
      sender: senderMap[msg.sender_id]?.name || 'Unknown',
      date: msg.created_at,
      read: (msg.read_by || []).includes(currentUser.user?.id || ''),
      priority: msg.priority as MessagePriority,
      read_by: msg.read_by
    }));

    return transformedMessages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const markMessageAsRead = async (id: string) => {
  const { data: currentUser } = await supabase.auth.getUser();
  if (!currentUser.user?.id) return;

  try {
    const { data: message, error: fetchError } = await supabase
      .from('messages')
      .select('read_by')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const readBy = [...(message.read_by || []), currentUser.user.id];

    const { error: updateError } = await supabase
      .from('messages')
      .update({ read_by: readBy })
      .eq('id', id);

    if (updateError) throw updateError;

  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
};

export const markAllAsRead = async (messages: Message[]) => {
  const { data: currentUser } = await supabase.auth.getUser();
  if (!currentUser.user?.id) return;

  const unreadMessages = messages.filter(m => !m.read);
  const updatePromises = unreadMessages.map(message => 
    supabase
      .from('messages')
      .update({ 
        read_by: [...(message.read_by || []), currentUser.user!.id]
      })
      .eq('id', message.id)
  );

  await Promise.all(updatePromises);
};

export const addMessage = async (messageData: NewMessageData) => {
  const { data: currentUser } = await supabase.auth.getUser();
  if (!currentUser.user?.id) {
    throw new Error('User not found');
  }

  const { error } = await supabase
    .from('messages')
    .insert({
      title: messageData.title,
      content: messageData.content,
      sender_id: currentUser.user.id,
      recipient_ids: messageData.recipient_ids,
      priority: messageData.priority,
      read_by: []
    });

  if (error) throw error;
};

export const deleteMessage = async (id: string) => {
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
