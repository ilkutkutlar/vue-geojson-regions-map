import RegionsMap from "./RegionsMap.vue";

const RegionsMapPlugin = {
  install(app) {
    app.component("RegionsMap", RegionsMap);
  },
};

export default RegionsMapPlugin;
