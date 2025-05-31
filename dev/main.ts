import App from "./App.vue";
import { createApp } from "vue";
import RegionsMap from "../src";

const app = createApp(App);
app.use(RegionsMap);
app.mount("#app");
