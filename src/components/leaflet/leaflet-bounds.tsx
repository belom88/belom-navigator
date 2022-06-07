import { Map } from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { DirectionRoute } from "../../types/directions-result";
import { getSummaryBounds } from "../../utils/directions-utils";
import { useAppSelector } from "../../redux/redux-hooks";
import { selectHighlight } from "../../redux/slices/highlight-slice";

export default function LeafletBounds({
  routes,
}: {
  routes?: DirectionRoute[];
}) {
  const map: Map = useMap();
  const selectedHighlight = useAppSelector(selectHighlight);

  function fitBounds() {
    const newBounds = getSummaryBounds(routes);
    if (newBounds) {
      map.fitBounds(newBounds);
    }
  }

  useEffect(() => {
    let newZoom = map.getZoom();
    if (newZoom < 15) {
      newZoom = 15;
    }
    if (routes) {
      if (selectedHighlight?.type === "NESTED") {
        const step = selectedHighlight.step;
        if (step) {
          map.setView(step?.start_location, newZoom);
        }
      } else if (selectedHighlight?.type === "START_END") {
        // TODO: works only for 1 route with 1 leg
        const leg = routes?.[0]?.legs?.[0];
        if (leg) {
          if (selectedHighlight.edge === "START") {
            map.setView(leg.start_location, newZoom);
          } else if (selectedHighlight.edge === "END") {
            map.setView(leg.end_location, newZoom);
          }
        }
      } else if (selectedHighlight?.type === "STOP") {
        const { step, edge } = selectedHighlight;
        if (step) {
          if (edge === "START") {
            map.setView(step.transit_details.departure_stop.location, newZoom);
          } else if (edge === "END") {
            map.setView(step.transit_details.arrival_stop.location, newZoom);
          }
        }
      }
    }
    if (selectedHighlight === null) {
      fitBounds();
    }
  }, [selectedHighlight]);

  useEffect(() => {
    fitBounds();
  }, [routes]);
  return <></>;
}
