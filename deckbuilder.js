import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Sword, Wand2, RefreshCw, Crown, Sparkles, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ArenaSelector from '@/components/clash/ArenaSelector';
import CardLevelSelector from '@/components/clash/CardLevelSelector';
import DeckCard from '@/components/clash/DeckCard';
import AIAssistant from '@/components/clash/AIAssistant';
import { generateDecks } from '@/components/clash/deckGenerator';
import { allCards } from '@/components/clash/cardData';

export default function DeckBuilder() {
  const [step, setStep] = useState(1);
  const [arena, setArena] = useState(null);
  const [cardLevels, setCardLevels] = useState({});
  const [decks, setDecks] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAI, setShowAI] = useState(false);

  const handleGenerateDecks = async () => {
    setIsGenerating(true);
    
    // Simulate loading for effect
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const generatedDecks = generateDecks(arena, cardLevels);
    setDecks(generatedDecks);
    setStep(3);
    setIsGenerating(false);
  };

  const handleAIDecks = (aiDecks) => {
    const formattedDecks = aiDecks.map(deck => ({
      ...deck,
      cards: deck.cards.map(cardName => 
        allCards.find(c => c.name === cardName) || allCards[0]
      ).slice(0, 8)
    }));
    setDecks(formattedDecks);
    setShowAI(false);
    setStep(3);
  };

  const handleRegenerateDecks = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const generatedDecks = generateDecks(arena, cardLevels);
    setDecks(generatedDecks);
    setIsGenerating(false);
  };

  const handleReset = () => {
    setStep(1);
    setArena(null);
    setCardLevels({});
    setDecks([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30">
              <Crown className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 mb-3">
            Deck Builder
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Get personalized deck recommendations based on your card levels and arena
          </p>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto mt-2">
            Meta scores are based on recent competitive play data. Higher scores mean fewer counters in the current meta.
          </p>

          {/* Grade Deck Button - Always Visible */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mt-6"
          >
            <Link to={createPageUrl('DeckGrade')}>
              <Button
                size="lg"
                variant="outline"
                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 font-bold px-6 py-4"
              >
                <Award className="w-5 h-5 mr-2" />
                Grade Your Deck
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step >= s
                    ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}
                animate={{ scale: step === s ? 1.1 : 1 }}
              >
                {s}
              </motion.div>
              {s < 3 && (
                <div className={`w-12 sm:w-20 h-1 rounded-full transition-all ${
                  step > s ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-slate-800'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <ArenaSelector selectedArena={arena} onSelect={setArena} />

              {arena && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col sm:flex-row justify-center gap-4"
                >
                  <Button
                    onClick={() => setShowAI(true)}
                    size="lg"
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-8 py-6 text-lg shadow-lg shadow-cyan-500/30"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    AI Deck Assistant
                  </Button>
                  <Button
                    onClick={() => setStep(2)}
                    size="lg"
                    variant="outline"
                    className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 font-bold px-8 py-6 text-lg"
                  >
                    Manual Setup
                  </Button>
                </motion.div>
              )}
            </motion.div>
            )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <CardLevelSelector
                arena={arena}
                cardLevels={cardLevels}
                onCardLevelChange={setCardLevels}
              />
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  size="lg"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Back to Arena
                </Button>
                <Button
                  onClick={handleGenerateDecks}
                  disabled={isGenerating}
                  size="lg"
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold px-8 py-6 text-lg shadow-lg shadow-violet-500/30"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 mr-2" />
                      Generate Decks
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Your Recommended Decks</h2>
                  <p className="text-slate-400">Based on Arena {arena} and your card levels</p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleRegenerateDecks}
                    disabled={isGenerating}
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                    New Decks
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                  >
                    Start Over
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {decks.map((deck, index) => (
                  <DeckCard
                    key={deck.name + index}
                    deck={deck}
                    index={index}
                    cardLevels={cardLevels}
                  />
                ))}
              </div>

              {decks.length === 0 && (
                <div className="text-center py-12">
                  <Sword className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No decks could be generated for your arena. Try a higher arena!</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        </div>

        {/* AI Assistant Modal */}
        <AnimatePresence>
        {showAI && (
          <AIAssistant
            arena={arena}
            cardLevels={cardLevels}
            onDecksGenerated={handleAIDecks}
            onClose={() => setShowAI(false)}
          />
        )}
        </AnimatePresence>
        </div>
        );
        }
