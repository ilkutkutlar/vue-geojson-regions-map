<script lang="ts">
import { defaults, DragPan } from "ol/interaction";
import { Fill, Stroke, Style } from "ol/style";
import Feature from "ol/Feature";
import GeoJSON from "ol/format/GeoJSON";
import type MapBrowserEvent from "ol/MapBrowserEvent";
import OpenLayersMap from "ol/Map";
import { type StyleLike } from "ol/style/Style";
import VectorImageLayer from "ol/layer/VectorImage";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import View from "ol/View";

export default {
  name: "RegionsMap",
  props: {
    geoJsonFilePath: {
      type: String,
      required: true,
    },
    highlightedRegionId: {
      type: String,
      default: "",
    },
    selectedRegionId: {
      type: String,
      default: "",
    },
    regionColours: {
      type: Map<number | string | undefined, string>,
      default: new Map(),
    },
    regionNoDataColour: {
      type: String,
      default: "#BFBFBF",
    },
    theme: {
      type: String,
      default: "light",
    },
    extraViewOptions: {
      type: Object,
      default: Object,
    },
  },
  emits: ["regionPointerMove", "regionSingleClick", "update:highlightedRegionId"],
  data() {
    return {
      regionsLayer: undefined as VectorImageLayer | undefined,
      view: undefined as View | undefined,
      map: undefined as OpenLayersMap | undefined,
      featureOverlay: undefined as VectorLayer | undefined,
      selectedFeature: null as Feature | null,
      highlightedFeature: null as Feature | null,
      centredZoom: 9 as number,
    };
  },
  computed: {
    backgroundColour() {
      return this.theme === "dark" ? "#212121" : "#F5F5F5";
    },
  },
  watch: {
    theme() {
      this.regionsLayer?.setBackground(this.backgroundColour);
    },
    highlightedRegionId(newRegionId) {
      if (newRegionId === "") {
        this.removeHighlightOverlay(this.highlightedFeature);
        this.highlightedFeature = null;
        return;
      }

      const feature = this.getFeatureByRegionId(newRegionId);

      if (!feature || feature === this.highlightedFeature) return;
      this.removeHighlightOverlay(this.highlightedFeature);
      if (feature === this.selectedFeature) return;

      this.applyHighlightOverlay(feature);
      this.highlightedFeature = feature;
    },
    selectedRegionId(newRegionId) {
      if (newRegionId === "") {
        this.removeHighlightOverlay(this.selectedFeature);
        this.selectedFeature = null;
        return;
      }

      const feature = this.getFeatureByRegionId(newRegionId);

      if (!feature || feature === this.selectedFeature) return;
      if (this.selectedFeature) {
        this.removeHighlightOverlay(this.selectedFeature);
      }

      this.highlightedFeature = null;
      this.selectedFeature = feature;
      this.centreOnRegion(feature);
    },
    geoJsonFilePath() {
      this.regionsLayer?.setSource(
        new VectorSource({
          url: this.geoJsonFilePath,
          format: new GeoJSON({}),
        }),
      );
      this.regionsLayer?.changed();
    },
    regionColours() {
      this.regionsLayer?.changed();
    },
  },
  mounted() {
    this.regionsLayer = this.createRegionsLayer();
    this.view = new View({
      center: [0, 0],
      minZoom: 7,
      zoom: 7,
      maxZoom: 11,
      ...this.extraViewOptions,
    });

    this.map = new OpenLayersMap({
      layers: [this.regionsLayer],
      target: "map",
      view: this.view,
      controls: [],
      interactions: defaults({ dragPan: false }).extend([new DragPan()]),
    });

    this.featureOverlay = new VectorLayer({
      map: this.map,
      source: new VectorSource(),
      style: new Style({
        stroke: new Stroke({ color: "white", width: 4 }),
        fill: new Fill({ color: [255, 255, 255, 0.4] }),
      }),
    });

    this.map.on("singleclick", (e: MapBrowserEvent<KeyboardEvent | WheelEvent | PointerEvent>) => {
      if (e.dragging) return;

      const feature = this.map?.forEachFeatureAtPixel(e.pixel, (f) => f);
      if (!feature) return;

      this.$emit("regionSingleClick", feature.getId());
    });

    this.map.on("pointermove", (e: MapBrowserEvent<KeyboardEvent | WheelEvent | PointerEvent>) => {
      if (e.dragging) return;

      const feature = this.map?.forEachFeatureAtPixel(e.pixel, (f) => f);
      if (!feature) {
        if (this.highlightedFeature) {
          this.$emit("update:highlightedRegionId", "");
        }
        return;
      }

      this.$emit("regionPointerMove", feature.getId());
    });
  },
  methods: {
    applyHighlightOverlay(regionFeature: Feature) {
      this.featureOverlay?.getSource()?.addFeature(regionFeature);
    },
    removeHighlightOverlay(regionFeature: Feature) {
      this.featureOverlay?.getSource()?.removeFeature(regionFeature);
    },
    centreOnRegion(regionFeature: Feature) {
      const maybeExtent = regionFeature.getGeometry()?.getExtent();
      if (!maybeExtent) {
        throw new Error("Centring on region failed: region is unrecognised");
      }

      this.view?.fit(maybeExtent, {
        padding: [0, 200, 0, 0],
        duration: 400,
        // If we are already zoomed in more than the desired level, don't zoom out.
        maxZoom: Math.max(this.view.getZoom() ?? this.centredZoom, this.centredZoom),
      });
    },
    createRegionsLayer(): VectorImageLayer {
      const stroke = new Stroke({ width: 1, color: [10, 10, 10, 0.5] });
      const defaultStyle = new Style({
        fill: new Fill({ color: this.regionNoDataColour }),
        stroke: stroke,
      });

      const styleFunction = (feature: Feature): Style => {
        const regionColour = this.regionColours.get(feature.getId());
        return regionColour
          ? new Style({ fill: new Fill({ color: regionColour }), stroke: stroke })
          : defaultStyle;
      };

      return new VectorImageLayer({
        background: this.backgroundColour,
        imageRatio: 2,
        style: this.regionColours.size > 0 ? (styleFunction.bind(this) as StyleLike) : defaultStyle,
        source: new VectorSource({
          url: this.geoJsonFilePath,
          format: new GeoJSON({}),
        }),
      });
    },
    getFeatureByRegionId(regionId: string): Feature | undefined {
      const features = this.regionsLayer?.getSource()?.getFeatures();
      return features?.find((feature: Feature) => feature.getId() === regionId);
    },
  },
};
</script>

<template>
  <div v-once id="map" class="map"></div>
</template>
