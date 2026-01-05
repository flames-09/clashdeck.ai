import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Swords, Zap, Shuffle, Award, TrendingUp, ArrowLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { allCards, rarityColors } from '@/components/clash/cardData';

const calculateAttackScore = (cards) => {
  let score = 0;
  const winConditions = ['Hog Rider', 'Giant', 'Golem', 'Balloon', 'Graveyard', 'X-Bow', 'Mortar', 'Royal Giant', 'P.E.K.K.A', 'Mega Knight', 'Lava Hound', 'Goblin Barrel', 'Miner', 'Royal Hogs', 'Ram Rider', 'Prince', 'Dark Prince', 'Electro Giant', 'Ram Rider', 'Wall Breakers', 'Goblin Drill'];
  
  cards.forEach(card => {
    if (winConditions.includes(card.name)) {
      if (card.elixir > 3) {
        score += 25;
      } else {
        score += 8;
      }
    } else if (card.type === 'troop' || (card.type === 'spell' && ['Fireball', 'Lightning', 'Rocket', 'Poison'].includes(card.name))) {
      score += 8;
    }
  });
  
  return Math.min(score, 100);
};

const calculateDefenseScore = (cards) => {
  let score = 0;
  
  cards.forEach(card => {
    if (card.type === 'building') {
      score += 25;
    } else if (card.type === 'troop' || card.type === 'spell') {
      score += 10;
    }
  });
  
  return Math.min(score, 100);
};

const calculateElixirScore = (cards) => {
  const avgElixir = cards.reduce((sum, c) => sum + c.elixir, 0) / 8;
  
  if (avgElixir < 2.5) return 100;
  if (avgElixir >= 2.6 && avgElixir <= 2.8) return 95;
  if (avgElixir >= 2.9 && avgElixir <= 3.3) return 90;
  if (avgElixir >= 3.4 && avgElixir <= 3.6) return 85;
  if (avgElixir >= 3.7 && avgElixir <= 4.0) return 80;
  if (avgElixir >= 4.1 && avgElixir <= 4.5) return 70;
  if (avgElixir >= 4.6) return 25;
  return 25;
};

const calculateVersatilityScore = (cards) => {
  let score = 0;
  const types = new Set(cards.map(c => c.type));
  score += types.size * 20;
  
  const hasAir = cards.some(c => ['Balloon', 'Lava Hound', 'Minions', 'Mega Minion', 'Baby Dragon'].includes(c.name));
  const hasGround = cards.some(c => c.type === 'troop' && !['Balloon', 'Lava Hound', 'Minions', 'Mega Minion', 'Baby Dragon'].includes(c.name));
  if (hasAir && hasGround) score += 15;
  
  const elixirRange = Math.max(...cards.map(c => c.elixir)) - Math.min(...cards.map(c => c.elixir));
  score += Math.min(elixirRange * 5, 25);
  
  const hasWinCondition = cards.some(c => ['Hog Rider', 'Giant', 'Balloon', 'Graveyard', 'X-Bow', 'Mortar'].includes(c.name));
  if (hasWinCondition) score += 20;
  
  return Math.min(score, 100);
};

export default function DeckGrade() {
  const [selectedCards, setSelectedCards] = useState([]);
  const [scores, setScores] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCardSelect = (card) => {
    if (selectedCards.find(c => c.name === card.name)) {
      setSelectedCards(selectedCards.filter(c => c.name !== card.name));
    } else if (selectedCards.length < 8) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const handleGrade = () => {
    if (selectedCards.length !== 8) return;

    const attack = calculateAttackScore(selectedCards);
    const defense = calculateDefenseScore(selectedCards);
    const elixir = calculateElixirScore(selectedCards);
    const versatility = calculateVersatilityScore(selectedCards);
    const overall = Math.round((attack + defense + elixir + versatility) / 4);

    setScores({ attack, defense, elixir, versatility, overall });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'from-green-500/20 to-green-600/20 border-green-500/50';
    if (score >= 60) return 'from-blue-500/20 to-blue-600/20 border-blue-500/50';
    if (score >= 40) return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/50';
    return 'from-red-500/20 to-red-600/20 border-red-500/50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex justify-center mb-6">
            <Link to={createPageUrl('DeckBuilder')}>
              <Button
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Deck Builder
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30">
                <Award className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-500 mb-3">
              Deck Grader
            </h1>
            <p className="text-slate-400 max-w-xl mx-auto">
              Select 8 cards to analyze your deck's strengths and weaknesses
            </p>
          </div>
        </motion.div>

        {/* Selected Cards */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              Selected Cards ({selectedCards.length}/8)
            </h2>
            {selectedCards.length > 0 && (
              <Button
                onClick={() => setSelectedCards([])}
                variant="outline"
                size="sm"
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Clear All
              </Button>
            )}
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 mb-6">
            {Array.from({ length: 8 }).map((_, i) => {
              const card = selectedCards[i];
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-xl border-2 ${
                    card
                      ? `bg-gradient-to-br ${rarityColors[card.rarity].bg} border-${rarityColors[card.rarity].border}`
                      : 'border-slate-700 border-dashed bg-slate-800/30'
                  } flex items-center justify-center`}
                >
                  {card ? (
                    <div className="text-center p-2">
                      <p className="text-xs font-semibold text-white leading-tight">{card.name}</p>
                      <p className="text-xs text-purple-300 mt-1">{card.elixir}⚡</p>
                    </div>
                  ) : (
                    <div className="text-4xl text-slate-600">+</div>
                  )}
                </div>
              );
            })}
          </div>

          {selectedCards.length === 8 && (
            <div className="flex justify-center">
              <Button
                onClick={handleGrade}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-8 py-6 text-lg shadow-lg shadow-purple-500/30"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Grade Deck
              </Button>
            </div>
          )}
        </div>

        {/* Scores */}
        <AnimatePresence>
          {scores && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8"
            >
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                {/* Overall Score - Larger */}
                <div className="sm:col-span-2 lg:col-span-1 lg:row-span-2">
                  <div className={`h-full p-6 rounded-2xl bg-gradient-to-br ${getScoreBg(scores.overall)} border`}>
                    <div className="flex flex-col items-center justify-center h-full">
                      <Award className="w-12 h-12 text-amber-400 mb-3" />
                      <p className="text-sm text-slate-400 mb-2">Overall Score</p>
                      <p className={`text-6xl font-black ${getScoreColor(scores.overall)}`}>
                        {scores.overall}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Individual Scores */}
                <div className={`p-4 rounded-xl bg-gradient-to-br ${getScoreBg(scores.attack)} border`}>
                  <Swords className="w-8 h-8 text-red-400 mb-2" />
                  <p className="text-sm text-slate-400 mb-1">Attack</p>
                  <p className={`text-3xl font-bold ${getScoreColor(scores.attack)}`}>
                    {scores.attack}
                  </p>
                </div>

                <div className={`p-4 rounded-xl bg-gradient-to-br ${getScoreBg(scores.defense)} border`}>
                  <Shield className="w-8 h-8 text-blue-400 mb-2" />
                  <p className="text-sm text-slate-400 mb-1">Defense</p>
                  <p className={`text-3xl font-bold ${getScoreColor(scores.defense)}`}>
                    {scores.defense}
                  </p>
                </div>

                <div className={`p-4 rounded-xl bg-gradient-to-br ${getScoreBg(scores.elixir)} border`}>
                  <Zap className="w-8 h-8 text-purple-400 mb-2" />
                  <p className="text-sm text-slate-400 mb-1">Elixir</p>
                  <p className={`text-3xl font-bold ${getScoreColor(scores.elixir)}`}>
                    {scores.elixir}
                  </p>
                </div>

                <div className={`p-4 rounded-xl bg-gradient-to-br ${getScoreBg(scores.versatility)} border`}>
                  <Shuffle className="w-8 h-8 text-green-400 mb-2" />
                  <p className="text-sm text-slate-400 mb-1">Versatility</p>
                  <p className={`text-3xl font-bold ${getScoreColor(scores.versatility)}`}>
                    {scores.versatility}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card Selection */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Select Cards</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {allCards.filter(card => 
              card.name.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((card) => {
              const isSelected = selectedCards.find(c => c.name === card.name);
              const colors = rarityColors[card.rarity];
              
              return (
                <motion.button
                  key={card.name}
                  onClick={() => handleCardSelect(card)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`aspect-square rounded-xl p-0.5 transition-all ${
                    isSelected
                      ? `bg-gradient-to-br ${colors.bg} ring-2 ring-offset-2 ring-offset-slate-900 ${colors.border.replace('border-', 'ring-')}`
                      : `bg-gradient-to-br ${colors.bg} opacity-60 hover:opacity-100`
                  }`}
                >
                  <div className="w-full h-full bg-slate-900 rounded-[10px] flex flex-col items-center justify-center p-2">
                    <p className="text-[10px] text-center font-medium text-slate-200 leading-tight">
                      {card.name}
                    </p>
                    <p className="text-xs text-purple-400 mt-1">{card.elixir}⚡</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
