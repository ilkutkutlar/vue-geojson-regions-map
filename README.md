# Vue.js GeoJSON Regions Map

Vue.js GeoJSON Regions Map is a simple plugin providing a `RegionsMap` component. This component uses [OpenLayers](https://openlayers.org/) to load and display a given GeoJSON file where you can pan, zoom, and interact with the features in your GeoJSON file. Additionally, you can pass a colour map to allow setting the fill colour of each feature. This is useful for apps where you want to visualise regional data by colouring each region on a map according to a key.

To see its usage in a real project, you can see my project [UK Regional Data Visualiser](https://github.com/ilkutkutlar/uk-regional-data-visualiser), which you can [see in action here](https://ilkutkutlar.github.io/uk-regional-data-visualiser/).

## Installation

Install with `npm`:

```bash
npm install vue-geojson-regions-map --save
```

## Usage

Register the plugin in your app's `main.js` (or `main.ts` if you are using TypeScript):

```js
import App from "./App.vue";
import { createApp } from "vue";
import RegionsMap from "vue-geojson-regions-map";

const app = createApp(App);
app.use(RegionsMap);
app.mount("#app");
```

Let's say you have a `sample.geojson` file in your project's root directory with contents:

```json
{
  "type": "FeatureCollection",
  "crs": { "type": "name", "properties": { "name": "EPSG:27700" } },
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [...]
      },
      "id": "one"
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [...]
      },
      "id": "two"
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [...]
      },
      "id": "three"
    }
  ]
}
```

To display this GeoJSON without any region colouring:

```html
<template>
  <RegionsMap geo-json-file-path="./sample.geojson" />
</template>
```

You can pass a colour map to the `region-colours` prop to colour each feature in your GeoJSON file. The mapping is from the `id` field of the feature to the desired colour of the region (currently, only the `id` field is supported). The colour is expressed as a string of the colour's hexadecimal value, e.g. `"#FF0000"`. For example:

```html
<script>
  export default {
    computed: {
      regionsColours() {
        // Map of each feature ID to what colour it should be.
        return new Map([
          ["one", "#FF0000"],
          ["two", "#008000"],
          ["three", "#0000FF"],
        ]);
      },
    },
  };
</script>

<template>
  <RegionsMap
    geo-json-file-path="./sample.geojson"
    :region-colours="regionColours"
  />
</template>
```

### Mouse events example

The `region-pointer-move` and `region-single-click` events can be used with `highlighted-region-id` and `selected-region-id` to easily create an interactive display where features are highlighted upon pointer move, and are centred when clicked:

```html
<script>
  export default {
    data() {
      return {
        highlightedRegionId: "",
        selectedRegionId: "",
      };
    },
    methods: {
      selectRegion(regionId: string) {
        this.selectedRegionId = regionId;
      },
      deselectRegion() {
        if (this.selectedRegionId) this.highlightedRegionId = "";
        this.selectedRegionId = "";
      },
      highlightRegion(regionId: string) {
        this.highlightedRegionId = regionId;
      },
      unhighlightRegion(regionId: string) {
        if (regionId === this.selectedRegionId) return;
        this.highlightedRegionId = "";
      },
    },
  };
</script>

<template>
  <RegionsMap
    geo-json-file-path="./sample.geojson"
    :highlighted-region-id="highlightedRegionId"
    :selected-region-id="selectedRegionId"
    @region-single-click="selectRegion"
    @region-pointer-move="highlightRegion"
  />
</template>
```

## Props

| Name                    | Type                                    | Default                 | Description                                                                                                                                                                                                                                                                                                               |
| ----------------------- | --------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `geo-json-file-path`    | `String`                                | N/A (required)          | The URL to the GeoJSON file which should be displayed.                                                                                                                                                                                                                                                                    |
| `highlighted-region-id` | `String`                                | `""`                    | The feature ID which should be rendered as "highlighted", which adds a white translucent overlay and makes the borders thicker. Only one feature at a time can be highlighted.                                                                                                                                            |
| `selected-region-id`    | `String`                                | `""`                    | The feature ID which should be marked as the selected region. Selected features are styled the same way as highlighted ones. Only one feature can be selected at a time. When a feature is selected, the previously selected feature's highlight style is removed, and the newly selected feature is centred on the view. |
| `region-colours`        | `Map<number \| string \| null, string>` | `new Map()`             | The colour map that is used to apply colours for each feature in the GeoJSON file. The mapping is from the `id` field of each feature to the desired colour in hexadecimal format, e.g. `"FF0000"`                                                                                                                        |
| `region-no-data-colour` | `String`                                | `"#BFBFBF"`             | The default colour to be used for regions which do not have a mapping specified in the passed `region-colours`.                                                                                                                                                                                                           |
| `theme`                 | `String`                                | `"light"`               | The theme which determines the colour of the background for displaying the features. Valid options are `"light"` or `"dark"`.                                                                                                                                                                                             |
| `extra-view-options`    | `Object`                                | `Object` (empty object) | Extra options to pass to the OpenLayers [View](https://openlayers.org/en/latest/apidoc/module-ol_View-View.html) object used by the component. Can also be used to override default options. This can be useful for setting custom extents, min/max zoom, etc.                                                            |

## Events

Two events are emitted by `RegionsMap`: `region-pointer-move` when the pointer moves on top of a feature, and `region-single-click` when a feature is single clicked. Both events pass the target feature's `id` field as an argument. An example o their usage:

```html
<script>
  export default {
    methods: {
      handleRegionPointerMove(featureId: string) {
        console.log(`Cursor hovering over feature {featureId}`);
      },
      handleRegionSingleClicked(featureId: string) {
        console.log(`Clicked feature {featureId}`);
      }
    },
  };
</script>

<template>
  <RegionsMap
    geo-json-file-path="./sample.geojson"
    @region-pointer-move="handleRegionSingleClicked"
    @region-single-click="handleRegionPointerMove"
  />
</template>
```
