import { decode } from "@googlemaps/polyline-codec";
import {
  CartographicCoordinates,
  CartographicCoordinatesTuple,
  DirectionRoute,
  DirectionsStep,
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

export function getStepByGeometry(
  geometry: string,
  routes: DirectionRoute[]
): DirectionsStep | null {
  for (const route of routes) {
    for (const leg of route.legs) {
      for (const step of leg.steps) {
        const result = lookupStepByGeometry(geometry, step);
        if (result !== null) {
          return result;
        }
      }
    }
  }
  return null;
}

export function lookupStepByGeometry(
  geometry: string,
  step: DirectionsStep
): DirectionsStep | null {
  if (step.geometry === geometry) {
    return step;
  }
  if (step.steps?.length) {
    for (const nestedStep of step.steps) {
      const result = lookupStepByGeometry(geometry, nestedStep);
      if (result !== null) {
        return result;
      }
    }
  }
  return null;
}

export function decodePolyline(encodedPolyline: string) {
  return decode(encodedPolyline, 5);
}
