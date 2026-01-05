import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Trophy } from 'lucide-react';

const arenas = [
  { id: 1, name: "Goblin Stadium", trophies: "0-299" },
  { id: 2, name: "Bone Pit", trophies: "300-599" },
  { id: 3, name: "Barbarian Bowl", trophies: "600-999" },
  { id: 4, name: "Spell Valley", trophies: "1000-1299" },
  { id: 5, name: "Builder's Workshop", trophies: "1300-1599" },
  { id: 6, name: "P.E.K.K.A's Playhouse", trophies: "1600-1999" },
  { id: 7, name: "Royal Arena", trophies: "2000-2299" },
  { id: 8, name: "Frozen Peak", trophies: "2300-2599" },
  { id: 9, name: "Jungle Arena", trophies: "2600-2999" },
  { id: 10, name: "Hog Mountain", trophies: "3000-3399" },
  { id: 11, name: "Electro Valley", trophies: "3400-3799" },
  { id: 12, name: "Spooky Town", trophies: "3800-4199" },
  { id: 13, name: "Rascal's Hideout", trophies: "4200-4599" },
  { id: 14, name: "Serenity Peak", trophies: "4600-4999" },
  { id: 15, name: "Miner's Mine", trophies: "5000-5499" },
  { id: 16, name: "Executioner's Kitchen", trophies: "5500-5999" },
  { id: 17, name: "Royal Crypt", trophies: "6000-6499" },
  { id: 18, name: "Silent Sanctuary", trophies: "6500-6999" },
  { id: 19, name: "Dragon Spa", trophies: "7000-7499" },
  { id: 20, name: "Boot Camp", trophies: "7500-7999" },
  { id: 21, name: "Clash Fest", trophies: "8000-8499" },
  { id: 22, name: "PANCAKES!", trophies: "8500-8999" },
  { id: 23, name: "Valkhalla", trophies: "9000-9499" },
  { id: 24, name: "Legendary Arena", trophies: "9500-9999" },
  { id: 25, name: "Ultimate Champion", trophies: "10000+" },
];

export default function ArenaSelector({ selectedArena, onSelect }) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30">
          <Trophy className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Select Your Arena</h2>
          <p className="text-sm text-slate-400">Choose your current arena level</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {arenas.map((arena) => (
          <motion.button
            key={arena.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(arena.id)}
            className={`relative p-4 rounded-xl border transition-all duration-300 text-left ${
              selectedArena === arena.id
                ? 'bg-gradient-to-br from-amber-500/20 to-orange-600/20 border-amber-500/50 shadow-lg shadow-amber-500/20'
                : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Shield className={`w-4 h-4 ${selectedArena === arena.id ? 'text-amber-400' : 'text-slate-500'}`} />
              <span className={`text-xs font-bold ${selectedArena === arena.id ? 'text-amber-400' : 'text-slate-500'}`}>
                Arena {arena.id}
              </span>
            </div>
            <h3 className={`text-sm font-semibold truncate ${selectedArena === arena.id ? 'text-white' : 'text-slate-300'}`}>
              {arena.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1">{arena.trophies} 🏆</p>
            
            {selectedArena === arena.id && (
              <motion.div
                layoutId="arena-indicator"
                className="absolute inset-0 rounded-xl border-2 border-amber-400"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
