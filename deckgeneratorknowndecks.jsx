import { getCardsByArena, allCards, getMaxLevel } from './cardData';

const calculateAverageLevel = (deck, cardLevels) => {
  const levels = deck.cards.map(card => cardLevels[card.name] || 1);
  const sum = levels.reduce((a, b) => a + b, 0);
  return (sum / levels.length).toFixed(1);
};

const deckTemplates = [
  // Low Arena Decks (Best for Arena 1-6)
  {
    name: "Giant Witch",
    type: "beatdown",
    difficulty: "Easy",
    winRate: "54%",
    metaScore: 58,
    strategy: "Simple beatdown deck perfect for lower arenas. Giant tanks while Witch spawns skeletons. Support with Archers and Musketeer for defense.",
    requiredCards: ["Giant", "Witch"],
    preferredCards: ["Musketeer", "Archers", "Arrows", "Fireball", "Minions", "Knight"],
    fillPriority: ["troop", "spell"],
    minArena: 1,
    maxArena: 7
  },
  {
    name: "Mini P.E.K.K.A Hog",
    type: "cycle",
    difficulty: "Easy",
    winRate: "53%",
    metaScore: 61,
    strategy: "Fast cycle deck for low arenas. Mini P.E.K.K.A defends, Hog Rider attacks. Very effective against Giant and Prince pushes.",
    requiredCards: ["Mini P.E.K.K.A", "Hog Rider"],
    preferredCards: ["Musketeer", "Valkyrie", "Fireball", "Zap", "Cannon", "Skeletons"],
    fillPriority: ["troop", "spell", "building"],
    minArena: 1,
    maxArena: 8
  },
  {
    name: "Prince Deck",
    type: "beatdown",
    difficulty: "Easy",
    winRate: "52%",
    metaScore: 54,
    strategy: "Classic Prince deck for mid arenas. Prince charges for massive damage while Baby Dragon provides splash support.",
    requiredCards: ["Prince", "Baby Dragon"],
    preferredCards: ["Witch", "Musketeer", "Arrows", "Valkyrie", "Tombstone", "Mini P.E.K.K.A"],
    fillPriority: ["troop", "spell", "building"],
    minArena: 1,
    maxArena: 9
  },
  {
    name: "Valkyrie Hog",
    type: "cycle",
    difficulty: "Easy",
    winRate: "53%",
    metaScore: 59,
    strategy: "Reliable cycle deck. Valkyrie clears swarms, Hog Rider deals tower damage. Perfect for learning cycle mechanics.",
    requiredCards: ["Valkyrie", "Hog Rider"],
    preferredCards: ["Musketeer", "Cannon", "Fireball", "Zap", "Ice Spirit", "Skeletons"],
    fillPriority: ["troop", "spell", "building"],
    minArena: 1,
    maxArena: 8
  },
  {
    name: "Balloon Freeze",
    type: "beatdown",
    difficulty: "Medium",
    winRate: "51%",
    metaScore: 52,
    strategy: "Sneaky Balloon pushes with Freeze spell. Use Baby Dragon or Mega Minion to tank for Balloon, then Freeze defenders.",
    requiredCards: ["Balloon", "Freeze"],
    preferredCards: ["Baby Dragon", "Mega Minion", "Wizard", "Arrows", "Tombstone", "Knight"],
    fillPriority: ["troop", "spell", "building"],
    minArena: 1,
    maxArena: 10
  },

  // Beatdown Decks
  {
    name: "Golem Beatdown",
    type: "beatdown",
    difficulty: "Medium",
    winRate: "52%",
 
