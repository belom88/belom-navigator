import { LeafletMouseEventHandlerFn } from "leaflet";
import { ReactNode } from "react";
import { CircleMarker, Tooltip } from "react-leaflet";
import {
  CartographicCoordinates,
  CartographicCoordinatesTuple,
} from "../../types/directions-result";

type PointProps = {
  center: CartographicCoordinates;
  radius?: number;
  children?: ReactNode;
  onClick?: LeafletMouseEventHandlerFn;
};

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
        color: "#000",
        weight: 1,
        opacity: 0.6,
        fillColor: "#fff",
        fillOpacity: 1,
      }}
      radius={radius}
    >
      {children}
    </CircleMarker>
  );
}

type EdgePointProps = {
  center: CartographicCoordinatesTuple;
  children?: ReactNode;
  onClick?: LeafletMouseEventHandlerFn;
};

export function LeafletStartPoint({
  center,
  children,
  onClick,
}: EdgePointProps) {
  return (
    <CircleMarker
      center={center}
      pathOptions={{
        color: "#000",
        weight: 2,
        opacity: 0.9,
        fillColor: "#fff",
        fillOpacity: 1,
      }}
      radius={5}
      eventHandlers={{
        click: onClick,
      }}
    >
      {children}
    </CircleMarker>
  );
}

export function LeafletEndPoint({ center, children, onClick }: EdgePointProps) {
  return (
    <>
      <CircleMarker
        center={center}
        pathOptions={{
          color: "#000",
          weight: 2,
          opacity: 0.9,
          fillColor: "#fff",
          fillOpacity: 1,
        }}
        radius={5}
        eventHandlers={{
          click: onClick,
        }}
      >
        {children}
      </CircleMarker>
      <CircleMarker
        center={center}
        pathOptions={{
          color: "#000",
          weight: 2,
          opacity: 0.9,
          fillColor: "#fff",
          fillOpacity: 1,
        }}
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
