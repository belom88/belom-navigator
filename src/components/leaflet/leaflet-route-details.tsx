import { LeafletMouseEvent, PolylineOptions } from "leaflet";
import { Fragment, ReactElement } from "react";
import { Polyline } from "react-leaflet";
import { DirectionRoute, DirectionsStep } from "../../types/directions-result";
import { decodePolyline } from "../../utils/directions-utils";
import { LeafletStepPoint } from "./leaflet-points";
import { useAppSelector, useAppDispatch } from "../../redux/redux-hooks";
import { selectHighlight, set } from "../../redux/slices/highlight-slice";
import LeafletTooltipForHighlight from "./leaflet-tooltip-for-highlight";

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
  const selectedHighlight = useAppSelector(selectHighlight);
  const dispatch = useAppDispatch();
  function toggleNestedStep(step: DirectionsStep) {
    if (
      selectedHighlight?.type === "NESTED" &&
      selectedHighlight?.step?.geometry === step.geometry
    ) {
      dispatch(set({ value: { type: "NESTED" } }));
    } else {
      dispatch(set({ value: { step, type: "NESTED" } }));
    }
  }

  function toggleStop(step: DirectionsStep, edge: "START" | "END") {
    if (
      selectedHighlight?.type === "STOP" &&
      selectedHighlight?.step?.geometry === step.geometry &&
      selectedHighlight?.edge === edge
    ) {
      dispatch(set({ value: { type: "STOP" } }));
    } else {
      dispatch(set({ value: { step, edge, type: "STOP" } }));
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
      return (
        <Fragment key={step.geometry}>
          <Polyline
            positions={polyline}
            pathOptions={{
              weight: 6,
              opacity: 1,
              ...getStepSpecificOption(step),
            }}
          />
          {/* Turn points for middle steps */}
          <LeafletStepPoint
            center={step.start_location}
            radius={2}
            onClick={(event: LeafletMouseEvent) => {
              toggleNestedStep(step);
            }}
          >
            <LeafletTooltipForHighlight mode="NESTED" step={step} />
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
                onClick={(event: LeafletMouseEvent) => {
                  toggleStop(step, "END");
                }}
              >
                <LeafletTooltipForHighlight
                  mode="STOP"
                  step={step}
                  edge="END"
                ></LeafletTooltipForHighlight>
              </LeafletStepPoint>
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
                onClick={(event: LeafletMouseEvent) => {
                  toggleStop(step, "START");
                }}
              >
                <LeafletTooltipForHighlight
                  mode="STOP"
                  step={step}
                  edge="START"
                ></LeafletTooltipForHighlight>
              </LeafletStepPoint>
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
