import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Bot, 
  Send, 
  Lightbulb, 
  MessageSquare,
  Settings,
  Loader2,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AISuggestion {
  id: string;
  type: 'response' | 'info' | 'action';
  content: string;
  confidence: number;
}

interface AIAssistantProps {
  patientMessage?: string;
  onSuggestionApply?: (suggestion: string) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ 
  patientMessage, 
  onSuggestionApply 
}) => {
  const [apiKey, setApiKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConfigureAPI = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira sua API key da Perplexity",
        variant: "destructive",
      });
      return;
    }
    setIsConfigured(true);
    toast({
      title: "Sucesso",
      description: "API configurada com sucesso!",
    });
  };

  const generateSuggestions = async (message: string) => {
    if (!isConfigured) {
      toast({
        title: "Configuração necessária",
        description: "Configure a API key primeiro",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'Você é um assistente especializado em atendimento médico. Gere 3 sugestões de resposta profissionais, empáticas e informativas para atendentes de clínica médica. Seja preciso e conciso. Formate cada sugestão separada por "|||".'
            },
            {
              role: 'user',
              content: `Paciente disse: "${message}". Gere sugestões de resposta para o atendente da clínica médica.`
            }
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 500,
          return_images: false,
          return_related_questions: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro na API');
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      // Parse suggestions
      const suggestionTexts = aiResponse.split('|||').filter((s: string) => s.trim());
      const newSuggestions: AISuggestion[] = suggestionTexts.map((text: string, index: number) => ({
        id: `sugg-${Date.now()}-${index}`,
        type: index === 0 ? 'response' : index === 1 ? 'info' : 'action',
        content: text.trim(),
        confidence: 0.9 - (index * 0.1)
      }));

      setSuggestions(newSuggestions);
      
      toast({
        title: "Sugestões geradas",
        description: `${newSuggestions.length} sugestões criadas com IA`,
      });

    } catch (error) {
      console.error('Erro ao gerar sugestões:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar sugestões. Verifique sua API key.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySuggestion = (suggestion: AISuggestion) => {
    if (onSuggestionApply) {
      onSuggestionApply(suggestion.content);
      toast({
        title: "Sugestão aplicada",
        description: "Texto copiado para o campo de mensagem",
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'response': return <MessageSquare className="h-4 w-4" />;
      case 'info': return <Lightbulb className="h-4 w-4" />;
      case 'action': return <Sparkles className="h-4 w-4" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'response': return 'bg-medical-blue';
      case 'info': return 'bg-medical-green';
      case 'action': return 'bg-accent';
      default: return 'bg-muted';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-medical-blue" />
          <span>Assistente IA</span>
          {!isConfigured && (
            <Badge variant="outline" className="text-xs">
              Não configurado
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isConfigured ? (
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                Configure sua API key da Perplexity para ativar sugestões inteligentes:
              </p>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="sk-proj-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <Button 
                  onClick={handleConfigureAPI}
                  className="w-full"
                  size="sm"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar API
                </Button>
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-600">
                💡 <strong>Recomendação:</strong> Para maior segurança, conecte seu projeto ao Supabase 
                e configure a API key nas Edge Function Secrets.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Textarea
                placeholder="Digite a mensagem do paciente para gerar sugestões..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-h-20"
              />
              <Button 
                onClick={() => generateSuggestions(query)}
                disabled={!query.trim() || isLoading}
                className="w-full mt-2"
                size="sm"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Gerar Sugestões
              </Button>
            </div>

            {patientMessage && (
              <div>
                <p className="text-sm font-medium mb-2">Mensagem do Paciente:</p>
                <div className="p-3 bg-muted rounded-lg text-sm">
                  {patientMessage}
                </div>
                <Button 
                  onClick={() => generateSuggestions(patientMessage)}
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  disabled={isLoading}
                >
                  Gerar sugestões para esta mensagem
                </Button>
              </div>
            )}

            <Separator />

            <div>
              <p className="text-sm font-medium mb-3">Sugestões IA:</p>
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {suggestions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Nenhuma sugestão ainda</p>
                    </div>
                  ) : (
                    suggestions.map((suggestion) => (
                      <div 
                        key={suggestion.id}
                        className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => handleApplySuggestion(suggestion)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className={`p-1 rounded-full ${getTypeColor(suggestion.type)} text-white`}>
                              {getTypeIcon(suggestion.type)}
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {Math.round(suggestion.confidence * 100)}%
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Send className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm leading-relaxed">
                          {suggestion.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAssistant;