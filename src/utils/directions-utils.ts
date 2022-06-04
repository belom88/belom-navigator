import { decode } from "@googlemaps/polyline-codec";
import {
  CartographicCoordinates,
  CartographicCoordinatesTuple,
  DirectionRoute,
} from "../types/directions-result";

export function getSummaryBounds(
  routes?: DirectionRoute[]
): [CartographicCoordinatesTuple, CartographicCoordinatesTuple] | null {
  if (!routes) {
    return null;
  }
  let summaryNortheast: CartographicCoordinates | null = null;
  let summarySouthwest: CartographicCoordinates | null = null;
  for (const route of routes) {
    const { northeast, southwest } = route.bounds;
    if (!summaryNortheast) {
      summaryNortheast = { ...northeast };
    } else {
      if (summaryNortheast.lng > northeast.lng) {
        summaryNortheast.lng = northeast.lng;
      }
      if (summaryNortheast.lat > northeast.lat) {
        summaryNortheast.lat = northeast.lng;
      }
    }
    if (!summarySouthwest) {
      summarySouthwest = { ...southwest };
      if (summarySouthwest.lng < southwest.lng) {
        summarySouthwest.lng = southwest.lng;
      }
      if (summarySouthwest.lat < southwest.lat) {
        summarySouthwest.lat = southwest.lng;
      }
    }
  }
  if (!summaryNortheast || !summarySouthwest) {
    return null;
  }
  return [
    [summarySouthwest.lat, summarySouthwest.lng],
    [summaryNortheast.lat, summaryNortheast.lng],
  ];
}

export function decodePolyline(encodedPolyline: string) {
  return decode(encodedPolyline, 5);
}
