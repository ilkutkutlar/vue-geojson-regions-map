<script lang="ts">
import View from "ol/View";

export default {
  data() {
    return {
      highlightedRegionId: "",
      selectedRegionId: "",
      geoJsonFilePath: "./dev/test.geojson",
    };
  },
  computed: {
    regionColours() {
      return new Map([
        ["one", "#FF0000"],
        ["two", "#008000"],
        ["three", "#0000FF"],
      ]);
    },
    customView() {
      return new View({
        center: [618938, 691310],
        minZoom: 9,
        zoom: 10,
        maxZoom: 11,
        extent: [484514, 613274, 760505, 772324],
      });
    },
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
    v-model:highlighted-region-id="highlightedRegionId"
    :selected-region-id="selectedRegionId"
    :region-colours="regionColours"
    :geo-json-file-path="geoJsonFilePath"
    :custom-view="customView"
    @region-single-click="selectRegion"
    @region-pointer-move="highlightRegion"
  />
</template>
