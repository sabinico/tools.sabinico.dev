/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import { createRulesPlugin } from 'vuetify/labs/rules'
import pinia from '@/stores'
import router from '@/router'
import { createHead } from '@unhead/vue/client'
import { createGtag } from 'vue-gtag'

const head = createHead()
const gtag = createGtag({
  tagId: 'G-TQ6WTX8GMY',
})


export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(head)
    .use(gtag)
    .use(createRulesPlugin({}, vuetify.locale))
}
