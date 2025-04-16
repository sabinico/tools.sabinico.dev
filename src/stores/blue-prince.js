// Utilities
import { defineStore } from 'pinia'

export const useBluePrinceStore = defineStore('blueprince', {
  state: () => ({
    tasks: [],
    unlockedTools: [],
    journalNotes: [],
  }),
})
