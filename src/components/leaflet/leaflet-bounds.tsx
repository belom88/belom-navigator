import { Map } from "leaflet";
import { useEffect } from "react";
import { useMap, useMapEvent } from "react-leaflet";
import {
  CartographicCoordinates,
  DirectionRoute,
} from "../../types/directions-result";
import { getSummaryBounds } from "../../utils/directions-utils";
import { useAppDispatch, useAppSelector } from "../../redux/redux-hooks";
import { selectHighlight } from "../../redux/slices/highlight-slice";
import { set } from "../../redux/slices/zoom-slice";

export default function LeafletBounds({
  routes,
}: {
  routes?: DirectionRoute[];
}) {
  const map: Map = useMap();
  const selectedHighlight = useAppSelector(selectHighlight);
  const dispatch = useAppDispatch();

  function fitBounds() {
    const newBounds = getSummaryBounds(routes);
    if (newBounds) {
      map.fitBounds(newBounds, { animate: true });
    }
  }

  function changeView(location: CartographicCoordinates, zoom: number) {
    map.setView(location, zoom, { animate: true });
    dispatch(set(zoom));
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
          changeView(step?.start_location, newZoom);
        }
      } else if (selectedHighlight?.type === "START_END") {
        // TODO: works only for 1 route with 1 leg
        const leg = routes?.[0]?.legs?.[0];
        if (leg) {
          if (selectedHighlight.edge === "START") {
            changeView(leg.start_location, newZoom);
          } else if (selectedHighlight.edge === "END") {
            changeView(leg.end_location, newZoom);
          }
        }
      } else if (selectedHighlight?.type === "STOP") {
        const { step, edge } = selectedHighlight;
        if (step) {
          if (edge === "START") {
            changeView(step.transit_details.departure_stop.location, newZoom);
          } else if (edge === "END") {
            changeView(step.transit_details.arrival_stop.location, newZoom);
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

  const zoomEventMap = useMapEvent("zoom", () => {
    console.log(zoomEventMap.getZoom());
    dispatch(set(zoomEventMap.getZoom()));
  });
  return <></>;
}
