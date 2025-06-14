import type { App } from "vue";
import RegionsMap from "./RegionsMap.vue";

export default {
  install(app: App) {
    app.component("RegionsMap", RegionsMap);
  },
};
