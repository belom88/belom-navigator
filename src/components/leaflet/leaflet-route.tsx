import { useEffect, useState } from "react";
import {
  CartographicCoordinatesTuple,
  DirectionRoute,
} from "../../types/directions-result";
import LeafletRouteOverview from "./leaflet-route-overview";
import { decodePolyline } from "../../utils/directions-utils";
import LeafletRouteDetails from "./leaflet-route-details";

export default function LeafletRoute({ route }: { route: DirectionRoute }) {
  const [showOverview, setShowOverview] = useState<boolean>(false);
  const [overviewPolyline, setOverveiwPolyline] = useState<
    CartographicCoordinatesTuple[]
  >(decodePolyline(route.overview_polyline.points));

  useEffect(() => {
    const encodedPolyline = route.overview_polyline.points;
    const polyline = decodePolyline(encodedPolyline);
    setOverveiwPolyline(polyline);
  }, [route]);

  return (
    <>
      {showOverview && <LeafletRouteOverview polyline={overviewPolyline} />}
      {!showOverview && <LeafletRouteDetails route={route} />}
    </>
  );
}
