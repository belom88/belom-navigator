import { decode } from "@googlemaps/polyline-codec";
import {
  CartographicCoordinates,
  CartographicCoordinatesTuple,
  DirectionRoute,
  DirectionsStep,
} from "../types/directions-result";

/**
 * Calculate common bounds for the array of routes
 * @param routes routes to calculate
 * @returns northeast and southwest angle of bounds
 */
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

/**
 * Seek nested step that has matched geometry string
 * @param geometry - geometry string to match
 * @param step - root step to find in
 * @return - step that has matched geometry string
 */
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

/**
 * Decode geometry polyline with google codec
 * @param - encoded geometry
 * @returns - array of polyline coordinates
 */
export function decodePolyline(
  encodedPolyline: string
): CartographicCoordinatesTuple[] {
  return decode(encodedPolyline, 5);
}
