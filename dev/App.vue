<script lang="ts">
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
    @region-single-click="selectRegion"
    @region-pointer-move="highlightRegion"
  />
</template>
