import { create } from 'zustand';

const useTradeContext = create((set, get) => ({
  // Current trade data
  currentTrade: null,
  
  // Trade impact analysis
  tradeImpact: {
    specialCategories: [],
    statCategories: [],
    winProbability: 0.5,
    isWinningTrade: false
  },
  
  // Mock stat impact data (will be replaced with real calculations later)
  statImpactData: {
    currentAverages: {},
    incomingDeltas: {},
    impactPercentages: {}
  },
  
  // Actions
  setCurrentTrade: (trade) => set({ currentTrade: trade }),
  
  setTradeImpact: (impact) => set({ tradeImpact: impact }),
  
  updateSpecialCategories: (categories) => set((state) => ({
    tradeImpact: {
      ...state.tradeImpact,
      specialCategories: categories
    }
  })),
  
  updateStatCategories: (categories) => set((state) => ({
    tradeImpact: {
      ...state.tradeImpact,
      statCategories: categories
    }
  })),
  
  setWinProbability: (probability) => set((state) => ({
    tradeImpact: {
      ...state.tradeImpact,
      winProbability: probability,
      isWinningTrade: probability > 0.5
    }
  })),
  
  setStatImpactData: (data) => set({ statImpactData: data }),
  
  // Computed values
  getSortedStatCategories: () => {
    const { statCategories } = get().tradeImpact;
    return [...statCategories].sort((a, b) => {
      // First sort by improvement status (improvements first)
      if (a.improvement && !b.improvement) return -1;
      if (!a.improvement && b.improvement) return 1;
      
      // Within each group:
      // - Improvements: sort by width descending (largest first)
      // - Declines: sort by width ascending (smallest first)
      if (a.improvement && b.improvement) {
        return b.width - a.width;
      } else if (!a.improvement && !b.improvement) {
        return a.width - b.width;
      }
      
      return 0;
    });
  },
  
  getSortedSpecialCategories: () => {
    const { specialCategories } = get().tradeImpact;
    return [...specialCategories].sort((a, b) => {
      if (a.isImprovement && !b.isImprovement) return -1;
      if (!a.isImprovement && b.isImprovement) return 1;
      return 0;
    });
  },
  
  // Clear/reset
  resetTradeContext: () => set({
    currentTrade: null,
    tradeImpact: {
      specialCategories: [],
      statCategories: [],
      winProbability: 0.5,
      isWinningTrade: false
    },
    statImpactData: {
      currentAverages: {},
      incomingDeltas: {},
      impactPercentages: {}
    }
  })
}));

export default useTradeContext; 