import { LeafletMouseEvent, PolylineOptions } from "leaflet";
import { Fragment, ReactElement } from "react";
import { Polyline, Tooltip } from "react-leaflet";
import { DirectionRoute, DirectionsStep } from "../../types/directions-result";
import { decodePolyline } from "../../utils/directions-utils";
import { LeafletStepPoint } from "./leaflet-points";
import { useAppSelector, useAppDispatch } from "../../redux/redux-hooks";
import { selectStep, set } from "../../redux/slices/step-slice";

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
  const selectedStep = useAppSelector(selectStep);
  const dispatch = useAppDispatch();
  function toggleNestedStep(stepGeometry: string) {
    if (selectedStep?.geometry === stepGeometry) {
      dispatch(set({ value: { geometry: "", type: "NESTED" } }));
    } else {
      dispatch(set({ value: { geometry: stepGeometry, type: "NESTED" } }));
    }
  }

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
      const isPermanent = selectedStep?.geometry === step.geometry;

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
          <LeafletStepPoint
            center={step.start_location}
            radius={2}
            onClick={(event: LeafletMouseEvent) => {
              toggleNestedStep(step.geometry);
            }}
          >
            {isPermanent && (
              <Tooltip permanent interactive>
                <div
                  dangerouslySetInnerHTML={{ __html: step.html_instructions }}
                ></div>
              </Tooltip>
            )}
            {!isPermanent && (
              <Tooltip>
                <div
                  dangerouslySetInnerHTML={{ __html: step.html_instructions }}
                ></div>
              </Tooltip>
            )}
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
