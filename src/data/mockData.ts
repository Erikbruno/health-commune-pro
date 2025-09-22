import { Conversation, Patient, Message, AttendantMetrics, DashboardMetrics, User } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria@clinica.com',
    role: 'attendant',
    status: 'online',
    avatar: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'Dr. João Santos',
    email: 'joao@clinica.com',
    role: 'manager',
    status: 'online',
    avatar: '/placeholder.svg'
  }
];

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Ana Paula Costa',
    phone: '(11) 99999-1234',
    email: 'ana@email.com',
    preferredChannel: 'whatsapp'
  },
  {
    id: '2',
    name: 'Carlos Oliveira',
    phone: '(11) 99999-5678',
    email: 'carlos@email.com',
    preferredChannel: 'email'
  },
  {
    id: '3',
    name: 'Fernanda Lima',
    phone: '(11) 99999-9012',
    email: 'fernanda@email.com',
    preferredChannel: 'instagram'
  }
];

export const mockMessages: Message[] = [
  {
    id: '1',
    patientId: '1',
    attendantId: '1',
    channel: 'whatsapp',
    content: 'Boa tarde! Gostaria de agendar uma consulta com cardiologista.',
    timestamp: new Date(2024, 0, 22, 14, 30),
    status: 'read',
    isFromPatient: true
  },
  {
    id: '2',
    patientId: '1',
    attendantId: '1',
    channel: 'whatsapp',
    content: 'Olá Ana Paula! Claro, posso te ajudar. Qual seria sua preferência de horário?',
    timestamp: new Date(2024, 0, 22, 14, 35),
    status: 'delivered',
    isFromPatient: false
  },
  {
    id: '3',
    patientId: '2',
    attendantId: '1',
    channel: 'email',
    content: 'Preciso remarcar minha consulta de amanhã, é possível?',
    timestamp: new Date(2024, 0, 22, 15, 0),
    status: 'sent',
    isFromPatient: true
  },
  {
    id: '4',
    patientId: '3',
    attendantId: '1',
    channel: 'instagram',
    content: 'Olá! Vi no Instagram que vocês têm consultas online. Como funciona?',
    timestamp: new Date(2024, 0, 22, 16, 15),
    status: 'pending',
    isFromPatient: true
  }
];

export const mockConversations: Conversation[] = [
  {
    id: '1',
    patient: mockPatients[0],
    channel: 'whatsapp',
    messages: mockMessages.filter(m => m.patientId === '1'),
    assignedTo: '1',
    status: 'open',
    priority: 'medium',
    lastMessageAt: new Date(2024, 0, 22, 14, 35),
    tags: ['agendamento', 'cardiologia']
  },
  {
    id: '2',
    patient: mockPatients[1],
    channel: 'email',
    messages: mockMessages.filter(m => m.patientId === '2'),
    assignedTo: '1',
    status: 'pending',
    priority: 'high',
    lastMessageAt: new Date(2024, 0, 22, 15, 0),
    tags: ['reagendamento']
  },
  {
    id: '3',
    patient: mockPatients[2],
    channel: 'instagram',
    messages: mockMessages.filter(m => m.patientId === '3'),
    status: 'open',
    priority: 'low',
    lastMessageAt: new Date(2024, 0, 22, 16, 15),
    tags: ['consulta-online', 'informação']
  }
];

export const mockAttendantMetrics: AttendantMetrics[] = [
  {
    id: '1',
    name: 'Maria Silva',
    totalConversations: 45,
    avgResponseTime: 3.2,
    satisfactionRate: 4.8,
    status: 'online',
    activeConversations: 8
  },
  {
    id: '2',
    name: 'Pedro Costa',
    totalConversations: 38,
    avgResponseTime: 4.1,
    satisfactionRate: 4.6,
    status: 'busy',
    activeConversations: 12
  },
  {
    id: '3',
    name: 'Julia Santos',
    totalConversations: 52,
    avgResponseTime: 2.8,
    satisfactionRate: 4.9,
    status: 'online',
    activeConversations: 6
  }
];

export const mockDashboardMetrics: DashboardMetrics = {
  totalConversations: 324,
  pendingConversations: 12,
  avgResponseTime: 3.4,
  satisfactionRate: 4.7,
  channelDistribution: {
    whatsapp: 145,
    instagram: 78,
    facebook: 45,
    email: 32,
    phone: 18,
    website: 6
  },
  hourlyActivity: [
    { hour: 8, conversations: 12 },
    { hour: 9, conversations: 24 },
    { hour: 10, conversations: 35 },
    { hour: 11, conversations: 28 },
    { hour: 12, conversations: 18 },
    { hour: 13, conversations: 22 },
    { hour: 14, conversations: 42 },
    { hour: 15, conversations: 38 },
    { hour: 16, conversations: 45 },
    { hour: 17, conversations: 32 },
    { hour: 18, conversations: 28 }
  ]
};