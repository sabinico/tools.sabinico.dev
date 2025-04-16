// Utilities
import { defineStore } from 'pinia'

export const useBluePrinceStore = defineStore('blueprince', {
  state: () => ({
    tasks: [],
    unlockedTools: [],
    journalNotes: [],
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
  },
})
