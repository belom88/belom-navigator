import styled from "styled-components";
import { DirectionsStep } from "../../types/directions-result";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import NestedSteps from "./nested-steps";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/redux-hooks";
import {
  selectHighlight,
  set,
  unset,
} from "../../redux/slices/highlight-slice";
import { lookupStepByGeometry } from "../../utils/directions-utils";
import { MomentTimeZones } from "../../constants/common";
import {
  cl_canvas,
  cl_item_hovered,
  cl_item_selected,
  cl_point_outline,
  cl_splitter,
  cl_leaflet_walking_step,
  cl_step_info_duration_text,
} from "../../constants/colors";

const Container = styled.div`
  display: flex;
  margin: 0rem 2rem;
`;

const TimeRange = styled.div`
  display: flex;
  flex-basis: 6em;
  padding: 0;
  align-content: space-between;
  flex-wrap: wrap;
`;

const Time = styled.span`
  font-weight: 500;
  padding: 1em 0 2em;
`;

const StepContainer = styled.div<{
  borderColor?: string;
  borderStyle?: string;
}>`
  position: relative;
  width: 20em;
  margin-left: 1em;
  padding: 1em 0em 1em 1em;
  border-left: 6px
    ${({ borderColor, borderStyle }) => `${borderStyle} ${borderColor}`};
`;

const TransitStop = styled.div<{ active: boolean }>`
  border-bottom: 0.1em solid ${cl_splitter};
  border-top: 0.1em solid ${cl_splitter};
  padding: 1em 0 1em 1em;
  cursor: pointer;
  font-weight: 500;
  background: ${({ active }) => (active ? cl_item_selected : "inherit")};
  ${({ active }) => `
      &:hover {
        background: ${active ? cl_item_selected : cl_item_hovered};
      }
    `}
`;

const StepCollapsable = styled.div<{ hasNestedSteps: boolean }>`
  padding: 0.5em 1em;
  cursor: ${({ hasNestedSteps }) => (hasNestedSteps ? "pointer" : "inherit")};
  ${({ hasNestedSteps }) => {
    if (hasNestedSteps) {
      return `
        &:hover {
          background: ${cl_item_hovered};
        }
      `;
    }
  }}
`;

const StepDetails = styled.div<{ hasNestedSteps: boolean }>`
  font-weight: 300;
  padding: 1em 0em;
  line-height: 1.5em;
`;

const LineInfo = styled.span<{ backgroundColor: string; color: string }>`
  color: ${({ color }) => color};
  background: ${({ backgroundColor }) => backgroundColor};
  padding: 0.2em;
  margin-left: 0.3em;
`;

const Duration = styled.div`
  color: ${cl_step_info_duration_text};
  font-weight: 300;
`;

const Point = styled.div`
  position: absolute;
  display: flex;
  left: -9px; // px works better on differen devices
  top: -0.5em;
  background: ${cl_canvas};
  border: 0.2em solid ${cl_point_outline};
  border-radius: 1em;
  width: 1em;
  height: 1em;
`;

/** Step detailed information */
export default function StepInfo({ step }: { step: DirectionsStep }) {
  const [showNestedSteps, setShowNestedSteps] = useState(false);
  const duration = moment.duration(step.duration.value, "seconds");
  const selectedHighlight = useAppSelector(selectHighlight);
  const dispatch = useAppDispatch();

  /** Expand nested steps if one was selected on the map */
  useEffect(() => {
    if (
      selectedHighlight?.type === "NESTED" &&
      selectedHighlight?.step &&
      lookupStepByGeometry(selectedHighlight.step.geometry, step)
    ) {
      setShowNestedSteps(true);
    }
  }, [selectedHighlight]);

  /**
   * Highlight transit station
   * @param step - step of the station
   * @param edge - edge (start/end) of the station
   */
  function onClickStopHandler(
    step: DirectionsStep,
    edge: "START" | "END"
  ): void {
    if (
      selectedHighlight?.type === "STOP" &&
      selectedHighlight.step?.geometry === step.geometry &&
      selectedHighlight.edge === edge
    ) {
      dispatch(unset());
      return;
    }
    dispatch(set({ value: { step, edge, type: "STOP" } }));
  }

  return (
    <Container>
      {/* departure and arrival time of a transit step*/}
      <TimeRange>
        {step.travel_mode === "TRANSIT" && (
          <>
            {/* departure time */}
            <Time>
              {moment
                .unix(step.transit_details.departure_time.value)
                .utcOffset(
                  MomentTimeZones[step.transit_details.departure_time.time_zone]
                )
                .format("LT")}
            </Time>
            {/* arrival time */}
            <Time>
              {moment
                .unix(step.transit_details.arrival_time.value)
                .utcOffset(
                  MomentTimeZones[step.transit_details.arrival_time.time_zone]
                )
                .format("LT")}
            </Time>
          </>
        )}
      </TimeRange>
      {/* Step details container */}
      <StepContainer
        // Color for vertical  line of the step - between start/end time and step details
        borderColor={
          (step.travel_mode === "TRANSIT" && step.transit_details.line.color) ||
          cl_leaflet_walking_step
        }
        // Style for vertical  line of the step
        borderStyle={(step.travel_mode === "TRANSIT" && "solid") || "dotted"}
      >
        {<Point />}
        {/* Transit start station */}
        {step.travel_mode === "TRANSIT" && (
          <TransitStop
            onClick={() => onClickStopHandler(step, "START")}
            active={
              selectedHighlight?.type === "STOP" &&
              selectedHighlight?.step?.geometry === step.geometry &&
              selectedHighlight.edge === "START"
            }
          >
            {step.transit_details.departure_stop.name}
          </TransitStop>
        )}
        <StepDetails hasNestedSteps={Boolean(step.steps?.length)}>
          {/* Become collapse/expand button if has nested steps */}
          <StepCollapsable
            hasNestedSteps={Boolean(step.steps?.length)}
            onClick={() => setShowNestedSteps(!showNestedSteps)}
          >
            {step.travel_mode === "WALKING" && "WALKING"}
            {step.travel_mode === "TRANSIT" && (
              <>
                <LineInfo
                  backgroundColor={step.transit_details.line.color}
                  color={step.transit_details.line.text_color}
                >
                  {step.transit_details.line.short_name}
                </LineInfo>{" "}
                {step.transit_details.line.name}
              </>
            )}
            <Duration>
              {step.steps?.length && (
                <FontAwesomeIcon
                  icon={showNestedSteps ? faAngleUp : faAngleDown}
                />
              )}{" "}
              {step.travel_mode === "WALKING" && (
                <>
                  {duration.humanize()} ({step.distance.text})
                </>
              )}
              {step.travel_mode === "TRANSIT" && (
                <>
                  {duration.hours() > 0 && ` ${duration.hours()} hr`}
                  {duration.minutes() > 0 && ` ${duration.minutes()} min`}
                  {duration.seconds() > 0 && ` ${duration.seconds()} sec`} (
                  {step.transit_details.num_stops} stops)
                </>
              )}
            </Duration>
          </StepCollapsable>
          {step.steps?.length && (
            <NestedSteps
              steps={step.steps}
              show={showNestedSteps}
            ></NestedSteps>
          )}
        </StepDetails>
        {/* Transit end station */}
        {step.travel_mode === "TRANSIT" && (
          <TransitStop
            onClick={() => onClickStopHandler(step, "END")}
            active={
              selectedHighlight?.type === "STOP" &&
              selectedHighlight?.step?.geometry === step.geometry &&
              selectedHighlight.edge === "END"
            }
          >
            {step.transit_details.arrival_stop.name}
          </TransitStop>
        )}
      </StepContainer>
    </Container>
  );
}
