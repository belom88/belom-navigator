import { PolylineOptions } from "leaflet";
import { Fragment, ReactElement } from "react";
import { Polyline, Tooltip } from "react-leaflet";
import { DirectionRoute, DirectionsStep } from "../../types/directions-result";
import { decodePolyline } from "../../utils/directions-utils";
import { LeafletStepPoint } from "./leaflet-points";

type PolylineTree =
  | ReactElement
  | {
      [key: number]: PolylineTree;
    };

export default function LeafletRouteDetails({
  route,
}: {
  route: DirectionRoute;
}) {
  function showStep(
    step: DirectionsStep,
    root: DirectionsStep | null = null
  ): PolylineTree {
    if (step.steps?.length) {
      const steps = [];
      for (const nestedStep of step.steps) {
        steps.push(showStep(nestedStep, root || step));
      }
      return steps;
    } else {
      const polyline = decodePolyline(step.geometry);
      return (
        <Fragment key={step.geometry}>
          <Polyline
            positions={polyline}
            pathOptions={{
              weight: 6,
              opacity: 1,
              ...getStepSpecificOption(step),
            }}
          >
            {/* {<Tooltip sticky>{(root || step).html_instructions}</Tooltip>} */}
          </Polyline>
          {/* Turn points for middle steps */}
          <LeafletStepPoint center={step.start_location} radius={2}>
            <Tooltip sticky>
              <div
                dangerouslySetInnerHTML={{ __html: step.html_instructions }}
              ></div>
            </Tooltip>
          </LeafletStepPoint>
        </Fragment>
      );
    }
  }

  return (
    <>
      {route.legs.map((leg) => leg.steps.map((step) => showStep(step)))}
      {route.legs.map((leg) =>
        leg.steps.map(
          (step) =>
            // Tranfer points end of steps (only for 'TRANSIT')
            step.travel_mode === "TRANSIT" && (
              <LeafletStepPoint
                key={`${step.geometry}-end`}
                center={step.end_location}
              />
            )
        )
      )}
      {route.legs.map((leg) =>
        leg.steps.map(
          (step) =>
            // Tranfer points start of steps (only for 'TRANSIT')
            step.travel_mode === "TRANSIT" && (
              <LeafletStepPoint
                key={`${step.geometry}-start`}
                center={step.start_location}
              />
            )
        )
      )}
    </>
  );
}

function getStepSpecificOption(step: DirectionsStep): PolylineOptions {
  if (step.travel_mode === "WALKING") {
    return { color: "#06abf5", dashArray: "1 12" };
  } else {
    return { color: step.transit_details.line.color };
  }
}
