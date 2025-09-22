export type UserRole = 'attendant' | 'manager';

export type ChannelType = 'whatsapp' | 'instagram' | 'facebook' | 'email' | 'phone' | 'website';

export type MessageStatus = 'sent' | 'delivered' | 'read' | 'pending';

export type AttendantStatus = 'online' | 'away' | 'busy' | 'offline';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status?: AttendantStatus;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email?: string;
  preferredChannel: ChannelType;
  lastContact?: Date;
}

export interface Message {
  id: string;
  patientId: string;
  attendantId?: string;
  channel: ChannelType;
  content: string;
  timestamp: Date;
  status: MessageStatus;
  isFromPatient: boolean;
}

export interface Conversation {
  id: string;
  patient: Patient;
  channel: ChannelType;
  messages: Message[];
  assignedTo?: string;
  status: 'open' | 'closed' | 'pending';
  priority: 'low' | 'medium' | 'high';
  lastMessageAt: Date;
  tags?: string[];
}

export interface AttendantMetrics {
  id: string;
  name: string;
  totalConversations: number;
  avgResponseTime: number;
  satisfactionRate: number;
  status: AttendantStatus;
  activeConversations: number;
}

export interface DashboardMetrics {
  totalConversations: number;
  pendingConversations: number;
  avgResponseTime: number;
  satisfactionRate: number;
  channelDistribution: Record<ChannelType, number>;
  hourlyActivity: Array<{ hour: number; conversations: number }>;
}