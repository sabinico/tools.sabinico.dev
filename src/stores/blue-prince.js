// Utilities
import { defineStore } from 'pinia'

export const useBluePrinceStore = defineStore('blueprince', {
  state: () => ({
    devmode: false,
    tasks: [],
    unlockedTools: [],
    journalNotes: [],
    shrine: [],
    paintings: {},
    redenvelopes: [],
  }),
  getters: {
    hasUnlockedTool (state) {
      return toolname => state.unlockedTools.includes(toolname)
    },
    hasRequiredUnlocks (state) {
      return unlocks => {
        let value = true
        unlocks.forEach(toolname => {
          if(!state.unlockedTools.includes(toolname)){
            value = false
          }
        });
        return value;
      }
    },
    hasUnlockedShrineBlessing (state) {
      return b => {
        let val = false;
        b.coins.forEach(c => {
          if(state.shrine.includes(c)){
            val = true;
          }
        });
        return val;
      }
    },
  },
})
