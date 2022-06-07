import { Polyline } from "react-leaflet";
import { cl_leaflet_overview_stroke } from "../../constants/colors";
import { CartographicCoordinatesTuple } from "../../types/directions-result";

/**
 * Leaflet polyline - path of the route overview
 * @param polyline - array of vertices of the polyline
 */
export default function LeafletRouteOverview({
  polyline,
}: {
  polyline: CartographicCoordinatesTuple[];
}) {
  return (
    <Polyline
      positions={polyline}
      pathOptions={{ color: cl_leaflet_overview_stroke }}
    />
  );
}
