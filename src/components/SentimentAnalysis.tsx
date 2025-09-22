import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Frown, 
  Meh, 
  Smile, 
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

interface SentimentAnalysisProps {
  message: string;
  onSentimentChange?: (sentiment: SentimentResult) => void;
}

interface SentimentResult {
  score: number; // -1 to 1
  label: 'negative' | 'neutral' | 'positive';
  confidence: number;
  emotions: {
    anger: number;
    sadness: number;
    joy: number;
    fear: number;
    surprise: number;
  };
}

const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ 
  message, 
  onSentimentChange 
}) => {
  const [sentiment, setSentiment] = useState<SentimentResult | null>(null);

  // Análise simplificada de sentimento (em produção, usaria API real)
  const analyzeSentiment = (text: string): SentimentResult => {
    const positiveWords = ['obrigado', 'agradeço', 'excelente', 'bom', 'ótimo', 'perfeito', 'satisfeito'];
    const negativeWords = ['ruim', 'péssimo', 'demora', 'problema', 'dificuldade', 'chateado', 'irritado'];
    const medicalUrgentWords = ['dor', 'urgente', 'emergência', 'sangue', 'desmaio', 'febre alta'];
    
    const words = text.toLowerCase().split(/\s+/);
    
    let positiveScore = 0;
    let negativeScore = 0;
    let urgentScore = 0;
    
    words.forEach(word => {
      if (positiveWords.some(pw => word.includes(pw))) positiveScore++;
      if (negativeWords.some(nw => word.includes(nw))) negativeScore++;
      if (medicalUrgentWords.some(uw => word.includes(uw))) urgentScore += 2;
    });

    const totalScore = positiveScore - negativeScore - urgentScore;
    const normalizedScore = Math.max(-1, Math.min(1, totalScore / words.length * 10));
    
    let label: 'negative' | 'neutral' | 'positive' = 'neutral';
    if (normalizedScore > 0.2) label = 'positive';
    if (normalizedScore < -0.2) label = 'negative';
    
    return {
      score: normalizedScore,
      label,
      confidence: Math.min(0.95, 0.6 + Math.abs(normalizedScore) * 0.4),
      emotions: {
        anger: urgentScore > 0 ? 0.7 : negativeScore * 0.3,
        sadness: negativeScore * 0.4,
        joy: positiveScore * 0.6,
        fear: urgentScore * 0.5,
        surprise: urgentScore > 0 ? 0.4 : 0.1
      }
    };
  };

  useEffect(() => {
    if (message.trim()) {
      const result = analyzeSentiment(message);
      setSentiment(result);
      onSentimentChange?.(result);
    }
  }, [message, onSentimentChange]);

  if (!sentiment || !message.trim()) return null;

  const getSentimentIcon = () => {
    switch (sentiment.label) {
      case 'positive': return <Smile className="h-4 w-4 text-green-600" />;
      case 'negative': return <Frown className="h-4 w-4 text-red-600" />;
      default: return <Meh className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getSentimentColor = () => {
    switch (sentiment.label) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-200';
      case 'negative': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getUrgencyLevel = () => {
    if (sentiment.emotions.fear > 0.4 || sentiment.emotions.anger > 0.6) {
      return { level: 'high', text: 'Alta Prioridade', color: 'bg-red-500' };
    }
    if (sentiment.emotions.sadness > 0.5 || sentiment.score < -0.5) {
      return { level: 'medium', text: 'Atenção Especial', color: 'bg-yellow-500' };
    }
    return { level: 'low', text: 'Normal', color: 'bg-green-500' };
  };

  const urgency = getUrgencyLevel();

  return (
    <div className="space-y-2 p-3 bg-muted/30 rounded-lg border">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Heart className="h-4 w-4 text-medical-blue" />
          <span className="text-sm font-medium">Análise Emocional</span>
        </div>
        <Badge variant="outline" className={`text-xs ${getSentimentColor()}`}>
          {getSentimentIcon()}
          <span className="ml-1 capitalize">{sentiment.label}</span>
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span>Confiança</span>
            <span>{Math.round(sentiment.confidence * 100)}%</span>
          </div>
          <Progress value={sentiment.confidence * 100} className="h-1" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span>Urgência</span>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${urgency.color}`} />
              <span>{urgency.text}</span>
            </div>
          </div>
        </div>
      </div>

      {(urgency.level === 'high' || urgency.level === 'medium') && (
        <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded border border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <p className="text-xs text-yellow-700">
            {urgency.level === 'high' 
              ? 'Paciente pode estar em situação urgente - considere priorizar atendimento'
              : 'Paciente demonstra desconforto - responda com empatia extra'
            }
          </p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Smile className="h-3 w-3 text-green-600" />
          </div>
          <span>Alegria</span>
          <Progress value={sentiment.emotions.joy * 100} className="h-1 mt-1" />
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Frown className="h-3 w-3 text-red-600" />
          </div>
          <span>Preocupação</span>
          <Progress value={sentiment.emotions.fear * 100} className="h-1 mt-1" />
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <AlertTriangle className="h-3 w-3 text-orange-600" />
          </div>
          <span>Frustração</span>
          <Progress value={sentiment.emotions.anger * 100} className="h-1 mt-1" />
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysis;