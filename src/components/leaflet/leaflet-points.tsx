import { LeafletMouseEventHandlerFn } from "leaflet";
import { ReactNode } from "react";
import { CircleMarker } from "react-leaflet";
import {
  cl_leaflet_marker_fill,
  cl_leaflet_marker_stroke,
} from "../../constants/colors";
import {
  CartographicCoordinates,
  CartographicCoordinatesTuple,
} from "../../types/directions-result";

type PointProps = {
  /** Location of the point */
  center: CartographicCoordinates;
  /** Radius of the point (default = 4) */
  radius?: number;
  /** React children prop */
  children?: ReactNode;
  /** Click event handler */
  onClick?: LeafletMouseEventHandlerFn;
};

/** Marker for step points */
export function LeafletStepPoint({
  center,
  children,
  radius = 4,
  onClick,
}: PointProps) {
  return (
    <CircleMarker
      eventHandlers={{
        click: onClick,
      }}
      center={[center.lat, center.lng]}
      pathOptions={{
        color: cl_leaflet_marker_stroke,
        weight: 1,
        opacity: 0.6,
        fillColor: cl_leaflet_marker_fill,
        fillOpacity: 1,
      }}
      radius={radius}
    >
      {children}
    </CircleMarker>
  );
}

type EdgePointProps = {
  /** Location of the point */
  center: CartographicCoordinatesTuple;
  /** React children prop */
  children?: ReactNode;
  /** Click event handler */
  onClick?: LeafletMouseEventHandlerFn;
};

/** Marker for the start of the route */
export function LeafletStartPoint({
  center,
  children,
  onClick,
}: EdgePointProps) {
  return (
    <CircleMarker
      center={center}
      pathOptions={{
        color: cl_leaflet_marker_stroke,
        weight: 2,
        opacity: 0.9,
        fillColor: cl_leaflet_marker_fill,
        fillOpacity: 1,
      }}
      pane="markerPane"
      radius={5}
      eventHandlers={{
        click: onClick,
      }}
    >
      {children}
    </CircleMarker>
  );
}

/** Marker circle for the end of the route */
export function LeafletEndPoint({ center, children, onClick }: EdgePointProps) {
  return (
    <>
      {/* Outer circle */}
      <CircleMarker
        center={center}
        pathOptions={{
          color: cl_leaflet_marker_stroke,
          weight: 2,
          opacity: 0.9,
          fillColor: cl_leaflet_marker_fill,
          fillOpacity: 1,
        }}
        pane="markerPane"
        radius={5}
        eventHandlers={{
          click: onClick,
        }}
      >
        {children}
      </CircleMarker>
      {/* Inner dot */}
      <CircleMarker
        center={center}
        pathOptions={{
          color: cl_leaflet_marker_stroke,
          weight: 2,
          opacity: 0.9,
          fillColor: cl_leaflet_marker_fill,
          fillOpacity: 1,
        }}
        pane="markerPane"
        radius={1}
        eventHandlers={{
          click: onClick,
        }}
      >
        {children}
      </CircleMarker>
    </>
  );
}
