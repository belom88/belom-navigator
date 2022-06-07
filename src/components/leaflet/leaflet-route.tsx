import { useEffect, useState } from "react";
import {
  CartographicCoordinatesTuple,
  DirectionRoute,
} from "../../types/directions-result";
import LeafletRouteOverview from "./leaflet-route-overview";
import { decodePolyline } from "../../utils/directions-utils";
import LeafletRouteDetails from "./leaflet-route-details";
import { useAppSelector } from "../../redux/redux-hooks";
import { selectZoom } from "../../redux/slices/zoom-slice";

export default function LeafletRoute({ route }: { route: DirectionRoute }) {
  const [overviewPolyline, setOverveiwPolyline] = useState<
    CartographicCoordinatesTuple[]
  >(decodePolyline(route.overview_polyline.points));
  const zoom = useAppSelector(selectZoom);

  useEffect(() => {
    const encodedPolyline = route.overview_polyline.points;
    const polyline = decodePolyline(encodedPolyline);
    setOverveiwPolyline(polyline);
  }, [route]);

  return (
    <>
      {zoom < 11 && <LeafletRouteOverview polyline={overviewPolyline} />}
      {zoom >= 11 && <LeafletRouteDetails route={route} />}
    </>
  );
}
