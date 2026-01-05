import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { getCardsByArena, rarityColors, getMaxLevel } from './cardData';

export default function CardLevelSelector({ arena, cardLevels, onCardLevelChange }) {
  const [expandedRarity, setExpandedRarity] = useState('common');
  const [defaultLevel, setDefaultLevel] = useState(9);
  
  const availableCards = getCardsByArena(arena);
  
  const groupedCards = availableCards.reduce((acc, card) => {
    if (!acc[card.rarity]) acc[card.rarity] = [];
    acc[card.rarity].push(card);
    return acc;
  }, {});

  const rarityOrder = ['common', 'rare', 'epic', 'legendary', 'champion'];
  
  const setAllToDefault = () => {
    const newLevels = {};
    availableCards.forEach(card => {
      newLevels[card.name] = Math.min(defaultLevel, getMaxLevel(card.rarity));
    });
    onCardLevelChange(newLevels);
  };

  const getCardLevel = (cardName) => {
    return cardLevels[cardName] || 1;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/30">
            <Layers className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Card Levels</h2>
            <p className="text-sm text-slate-400">Set your card levels for accurate recommendations</p>
          </div>
        </div>
      </div>

      {/* Quick Set All */}
      <div className="mb-6 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1 w-full">
            <p className="text-sm text-slate-400 mb-2">Set all cards to level:</p>
            <div className="flex items-center gap-4">
              <Slider
                value={[defaultLevel]}
                onValueChange={(val) => setDefaultLevel(val[0])}
                min={1}
                max={16}
                step={1}
                className="flex-1"
              />
              <span className="text-xl font-bold text-amber-400 w-8">{defaultLevel}</span>
            </div>
          </div>
          <Button 
            onClick={setAllToDefault}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Apply to All
          </Button>
        </div>
      </div>

      {/* Card Groups by Rarity */}
      <div className="space-y-3">
        {rarityOrder.map(rarity => {
          const cards = groupedCards[rarity];
          if (!cards || cards.length === 0) return null;
          
          const isExpanded = expandedRarity === rarity;
          const colors = rarityColors[rarity];
 
