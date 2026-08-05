import L from "leaflet";

import redMarker from "../assets/markers/marker-icon-2x-red.png";
import greenMarker from "../assets/markers/marker-icon-2x-green.png";
import blueMarker from "../assets/markers/marker-icon-2x-blue.png";
import yellowMarker from "../assets/markers/marker-icon-2x-yellow.png";
import greyMarker from "../assets/markers/marker-icon-2x-grey.png";
import markerShadow from "../assets/markers/marker-shadow.png";

const options = {
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
};

export const markerIcons = {
  Road: L.icon({
    iconUrl: redMarker,
    ...options,
  }),

  Garbage: L.icon({
    iconUrl: greenMarker,
    ...options,
  }),

  Water: L.icon({
    iconUrl: blueMarker,
    ...options,
  }),

  Electricity: L.icon({
    iconUrl: yellowMarker,
    ...options,
  }),

  Other: L.icon({
    iconUrl: greyMarker,
    ...options,
  }),
};