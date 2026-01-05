import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, Shield, Swords, Info } from 'lucide-react';
import { rarityColors } from './cardData';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function DeckCard({ deck, index, cardLevels }) {
  const avgElixir = (deck.cards.reduce((sum, c) => sum + c.elixir, 0) / 8).toFixed(1);
  const metaScore = deck.metaScore || 50;
  const avgLevel = deck.avgLevel || (deck.cards.reduce((sum, c) => sum + (cardLevels[c.name] || 9), 0) / 8).toFixed(1);
  
  const getMetaScoreColor = (score) => {
    if (score >= 70) return { text: "text-green-400", bg: "bg-green-500/20", border: "border-green-500/50" };
    if (score >= 55) return { text: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/50" };
    if (score >= 45) return { text: "text-yellow-400", bg: "bg-yellow-500/20", border: "border-yellow-500/50" };
    return { text: "text-orange-400", bg: "bg-orange-500/20", border: "border-orange-500/50" };
  };

  const getMetaRating = (score) => {
    if (score >= 70) return "S";
    if (score >= 60) return "A";
    if (score >= 50) return "B";
    if (score >= 40) return "C";
    return "D";
  };

  const metaColors = getMetaScoreColor(metaScore);
  
  const deckTypeIcons = {
    beatdown: <Swords className="w-4 h-4" />,
    control: <Shield className="w-4 h-4" />,
    siege: <Target className="w-4 h-4" />,
    cycle: <Zap className="w-4 h-4" />,
  };

  const deckTypeColors = {
    beatdown: "from-red-500 to-orange-500",
    control: "from-blue-500 to-cyan-500",
    siege: "from-purple-500 to-pink-500",
    cycle: "from-green-500 to-emerald-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
      className="relative rounded-2xl overflow-hidden"
    >
      {/* Gradient Border Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${deckTypeColors[deck.type]} opacity-20`} />
      
      <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`p-1.5 rounded-lg bg-gradient-to-br ${deckTypeColors[deck.type]} text-white`}>
                {deckTypeIcons[deck.type]}
              </span>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{deck.type}</span>
            </div>
            <h3 className="text-xl font-bold text-white">{deck.name}</h3>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-amber-400">
              <Zap className="w-4 h-4" />
              <span className="font-bold">{avgElixir}</span>
            </div>
            <span className="text-xs text-slate-500">Avg Elixir</span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {deck.cards.map((card, i) => {
            const colors = rarityColors[card.rarity];
 
