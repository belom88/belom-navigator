import { Map } from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { DirectionRoute } from "../../types/directions-result";
import {
  getStepByGeometry,
  getSummaryBounds,
} from "../../utils/directions-utils";
import { useAppSelector } from "../../redux/redux-hooks";
import { selectStep } from "../../redux/slices/step-slice";

export default function LeafletBounds({
  routes,
}: {
  routes?: DirectionRoute[];
}) {
  const map: Map = useMap();
  const selectedStep = useAppSelector(selectStep);

  function fitBounds() {
    const newBounds = getSummaryBounds(routes);
    if (newBounds) {
      map.fitBounds(newBounds);
    }
  }

  useEffect(() => {
    // Show start point
    if (routes && selectedStep?.type === "NESTED") {
      const step = getStepByGeometry(selectedStep.geometry, routes);
      if (step) {
        map.setView(step?.start_location, 15);
      }
    }
    if (selectedStep === null) {
      fitBounds();
    }
  }, [selectedStep]);

  useEffect(() => {
    fitBounds();
  }, [routes]);
  return <></>;
}
