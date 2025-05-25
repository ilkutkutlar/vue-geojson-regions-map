import type { App } from "vue";
import RegionsMap from "./RegionsMap.vue";

const RegionsMapPlugin = {
  install(app: App) {
    app.component("RegionsMap", RegionsMap);
  },
};

export default RegionsMapPlugin;
