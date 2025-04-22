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

const head = createHead()

export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(head)
    .use(createRulesPlugin({}, vuetify.locale))
}
