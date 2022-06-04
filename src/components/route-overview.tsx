import { Polyline } from "react-leaflet";
import { CartographicCoordinatesTuple } from "../types/directions-result";

export default function RouteOverview({
  polyline,
}: {
  polyline: CartographicCoordinatesTuple[];
}) {
  return <Polyline positions={polyline} pathOptions={{ color: "#4a571a" }} />;
}
