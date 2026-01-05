import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Loader2, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AIAssistant({ arena, cardLevels, onDecksGenerated, onClose }) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! Let me help you build a perfect deck. First, tell me which cards you want to include in your deck (if any).' }
  ]);
  const [step, setStep] = useState(1);
  const [includeCards, setIncludeCards] = useState([]);
  const [excludeCards, setExcludeCards] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    const userMessage = prompt.trim();
    setPrompt('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsGenerating(true);

    try {
      if (step === 1) {
        // User provided cards to include
        setIncludeCards(userMessage.split(',').map(c => c.trim()).filter(c => c));
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Great! Now tell me which cards you want to EXCLUDE from your deck (if any). Type "none" if you don\'t want to exclude any cards.' 
        }]);
        setStep(2);
        setIsGenerating(false);
      } else if (step === 2) {
        // User provided cards to exclude
        const excludeList = userMessage.toLowerCase() === 'none' ? [] : userMessage.split(',').map(c => c.trim()).filter(c => c);
        setExcludeCards(excludeList);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Perfect! Now describe what kind of deck you want (e.g., aggressive, defensive, cycle deck, etc.)' 
        }]);
        setStep(3);
        setIsGenerating(false);
      } else {
        // Generate decks
        const response = await base44.integrations.Core.InvokeLLM({
          prompt: `You are a Clash Royale deck building expert. The user is in Arena ${arena} with the following card levels: ${JSON.stringify(cardLevels)}.

User request: "${userMessage}"
Cards to INCLUDE: ${includeCards.length > 0 ? includeCards.join(', ') : 'none specified'}
Cards to EXCLUDE: ${excludeCards.length > 0 ? excludeCards.join(', ') : 'none specified'}

Respond with 3 deck recommendations that match their request. For each deck, provide:
- A creative deck name
- Exactly 8 cards (only cards they have unlocked in Arena ${arena} or lower, MUST include cards they requested, MUST NOT include cards they want excluded)
- Deck type (beatdown/control/siege/cycle)
- A brief strategy (1-2 sentences)
- Difficulty (Easy/Medium/Hard)
- Estimated win rate

Format your response as JSON.`,
          response_json_schema: {
            type: "object",
            properties: {
              message: { type: "string" },
              decks: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    cards: { 
                      type: "array",
                      items: { type: "string" },
                      minItems: 8,
                      maxItems: 8
                    },
                    type: { type: "string", enum: ["beatdown", "control", "siege", "cycle"] },
                    strategy: { type: "string" },
                    difficulty: { type: "string" },
                    winRate: { type: "string" }
                  },
                  required: ["name", "cards", "type", "strategy", "difficulty", "winRate"]
                }
              }
            },
            required: ["message", "decks"]
          }
        });

        setMessages(prev => [...prev, { role: 'assistant', content: response.message }]);
        
        if (response.decks && response.decks.length > 0) {
          onDecksGenerated(response.decks);
        }
        setIsGenerating(false);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
      setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Deck Assistant</h2>
              <p className="text-sm text-slate-400">Let me help you build the perfect deck</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">

          {/* Messages */}
          <div className="mb-4 space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-cyan-600/20 border border-cyan-500/30 ml-8' 
                  : 'bg-slate-800/50 border border-slate-700/50 mr-8'
              }`}
            >
              <p className="text-sm text-slate-200">{msg.content}</p>
            </motion.div>
          ))}
          </AnimatePresence>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                step === 1 ? "e.g., Hog Rider, Fireball (or type 'none')" :
                step === 2 ? "e.g., Golem, Sparky (or type 'none')" :
                "e.g., 'aggressive cycle deck' or 'defensive control'"
              }
              className="flex-1 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
              disabled={isGenerating}
            />
            <Button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
