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

const Container = styled.div`
  display: flex;
  margin: 0rem 2rem;
`;

const TimeRange = styled.div`
  display: flex;
  flex-basis: 5em;
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
  border-left: 0.5em
    ${({ borderColor, borderStyle }) => `${borderStyle} ${borderColor}`};
`;

const TransitStop = styled.div<{ active: boolean }>`
  border-bottom: 0.1em solid #e8eaed;
  border-top: 0.1em solid #e8eaed;
  padding: 1em 0 1em 1em;
  cursor: pointer;
  font-weight: 500;
  background: ${({ active }) => (active ? "#c1b2a3" : "inherit")};
  ${({ active }) => `
      &:hover {
        background: ${active ? "#c1b2a3" : "#ccc"};
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
          background: #ccc;
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
  color: #777;
  font-weight: 300;
`;

const Point = styled.div`
  position: absolute;
  display: flex;
  left: -9px; // px works better on differen devices
  top: -0.5em;
  background: #fff;
  border: 0.2em solid #333;
  border-radius: 1em;
  width: 1em;
  height: 1em;
`;

export default function StepInfo({ step }: { step: DirectionsStep }) {
  const [showNestedSteps, setShowNestedSteps] = useState(false);
  const duration = moment.duration(step.duration.value, "seconds");
  const selectedHighlight = useAppSelector(selectHighlight);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      selectedHighlight?.type === "NESTED" &&
      selectedHighlight?.step &&
      lookupStepByGeometry(selectedHighlight.step.geometry, step)
    ) {
      setShowNestedSteps(true);
    }
  }, [selectedHighlight]);

  function onClickStopHandler(step: DirectionsStep, edge: "START" | "END") {
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
      <TimeRange>
        {step.travel_mode === "TRANSIT" && (
          <>
            <Time>
              {moment
                .unix(step.transit_details.departure_time.value)
                .utcOffset("+02:00")
                .format("LT")}
            </Time>
            <Time>
              {moment
                .unix(step.transit_details.arrival_time.value)
                .utcOffset("+02:00")
                .format("LT")}
            </Time>
          </>
        )}
      </TimeRange>
      <StepContainer
        borderColor={
          (step.travel_mode === "TRANSIT" && step.transit_details.line.color) ||
          "#06abf5"
        }
        borderStyle={(step.travel_mode === "TRANSIT" && "solid") || "dotted"}
      >
        {<Point />}
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
