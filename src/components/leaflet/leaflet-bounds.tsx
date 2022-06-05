import { Map } from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { DirectionRoute } from "../../types/directions-result";
import { getSummaryBounds } from "../../utils/directions-utils";

export default function LeafletBounds({ routes }: { routes?: DirectionRoute[] }) {
  const map: Map = useMap();

  useEffect(() => {
    const newBounds = getSummaryBounds(routes);
    if (newBounds) {
      map.fitBounds(newBounds);
    }
  }, [routes]);
  return <></>;
}
