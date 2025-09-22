import React from 'react';
import { MessageSquare, Instagram, Facebook, Mail, Phone, Globe } from 'lucide-react';
import { ChannelType } from '@/types';

interface ChannelIconProps {
  channel: ChannelType;
  className?: string;
}

const ChannelIcon: React.FC<ChannelIconProps> = ({ channel, className = "h-4 w-4" }) => {
  const getIcon = () => {
    switch (channel) {
      case 'whatsapp':
        return <MessageSquare className={`${className} text-channel-whatsapp`} />;
      case 'instagram':
        return <Instagram className={`${className} text-channel-instagram`} />;
      case 'facebook':
        return <Facebook className={`${className} text-channel-facebook`} />;
      case 'email':
        return <Mail className={`${className} text-channel-email`} />;
      case 'phone':
        return <Phone className={`${className} text-muted-foreground`} />;
      case 'website':
        return <Globe className={`${className} text-muted-foreground`} />;
      default:
        return <MessageSquare className={`${className} text-muted-foreground`} />;
    }
  };

  return getIcon();
};

export default ChannelIcon;