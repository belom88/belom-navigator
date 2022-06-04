import { useEffect, useState } from "react";
import {
  CartographicCoordinatesTuple,
  DirectionRoute,
} from "../types/directions-result";
import RouteOverview from "./route-overview";
import { decodePolyline } from "../utils/directions-utils";
import RouteDetails from "./route-details";

export default function Route({ route }: { route: DirectionRoute }) {
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
      {showOverview && <RouteOverview polyline={overviewPolyline} />}
      {!showOverview && <RouteDetails route={route} />}
    </>
  );
}
