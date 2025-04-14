import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/route";
import { plugin, defaultConfig } from "@formkit/vue"; // ...
import config from "../formkit.config.js";
import { createPinia } from "pinia";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";

/* add icons to the library */
library.add(faUserSecret);

import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives,
});
import "vuetify/styles";
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

createApp(App)
  .use(router)
  .use(vuetify)
  .use(pinia)
  .use(plugin, defaultConfig(config))
  .component("FontAwesomeIcon", FontAwesomeIcon)
  .mount("#app");
