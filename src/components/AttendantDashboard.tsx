import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Send, 
  Paperclip, 
  MoreHorizontal,
  Clock,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import { Conversation, Message } from '@/types';
import { mockConversations } from '@/data/mockData';
import ChannelIcon from './ChannelIcon';

interface AttendantDashboardProps {
  userId: string;
}

const AttendantDashboard: React.FC<AttendantDashboardProps> = ({ userId }) => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    mockConversations[0] || null
  );
  const [newMessage, setNewMessage] = useState('');

  const conversations = mockConversations.filter(
    conv => conv.assignedTo === userId || !conv.assignedTo
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive';
      case 'medium': return 'bg-status-away';
      case 'low': return 'bg-status-online';
      default: return 'bg-muted';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      patientId: selectedConversation.patient.id,
      attendantId: userId,
      channel: selectedConversation.channel,
      content: newMessage,
      timestamp: new Date(),
      status: 'sent',
      isFromPatient: false
    };

    // In a real app, this would update the conversation
    setNewMessage('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Conversations List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Conversas Ativas</span>
            <Badge variant="secondary">{conversations.length}</Badge>
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conversas..."
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            {conversations.map((conversation, index) => (
              <div key={conversation.id}>
                <div
                  className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedConversation?.id === conversation.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {conversation.patient.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">
                          {conversation.patient.name}
                        </p>
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(conversation.priority)}`} />
                          <ChannelIcon channel={conversation.channel} />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {conversation.messages[conversation.messages.length - 1]?.content}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">
                          {formatTime(conversation.lastMessageAt)}
                        </span>
                        {conversation.status === 'pending' && (
                          <Badge variant="secondary" className="text-xs">
                            Pendente
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {index < conversations.length - 1 && <Separator />}
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="lg:col-span-2">
        {selectedConversation ? (
          <>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>
                      {selectedConversation.patient.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedConversation.patient.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <ChannelIcon channel={selectedConversation.channel} />
                      <span className="capitalize">{selectedConversation.channel}</span>
                      <span>•</span>
                      <span>{selectedConversation.patient.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant="outline" 
                    className={`${getPriorityColor(selectedConversation.priority)} text-white border-none`}
                  >
                    {selectedConversation.priority === 'high' ? 'Alta' : 
                     selectedConversation.priority === 'medium' ? 'Média' : 'Baixa'}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col h-[500px]">
              {/* Messages */}
              <ScrollArea className="flex-1 mb-4">
                <div className="space-y-4 p-2">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.isFromPatient ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isFromPatient
                            ? 'bg-muted text-foreground'
                            : 'bg-medical-blue text-white'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs opacity-70">
                            {formatTime(message.timestamp)}
                          </span>
                          {!message.isFromPatient && (
                            <div className="flex items-center">
                              {message.status === 'read' && (
                                <CheckCircle2 className="h-3 w-3 text-medical-green" />
                              )}
                              {message.status === 'delivered' && (
                                <CheckCircle2 className="h-3 w-3 opacity-70" />
                              )}
                              {message.status === 'sent' && (
                                <Clock className="h-3 w-3 opacity-70" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="flex items-center space-x-2 border-t pt-4">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Selecione uma conversa para iniciar o atendimento
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default AttendantDashboard;