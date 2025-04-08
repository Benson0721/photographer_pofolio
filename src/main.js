import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/route'
import { plugin, defaultConfig } from '@formkit/vue'// ...
import config from '../formkit.config.js'



/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faUserSecret)

createApp(App).use(router).use(plugin, defaultConfig(config)).component('FontAwesomeIcon', FontAwesomeIcon).mount('#app')
