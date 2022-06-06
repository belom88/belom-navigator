import styled from "styled-components";
import { DirectionsStep } from "../../types/directions-result";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import NestedSteps from "./nested-steps";
import { useState } from "react";

const Container = styled.div`
  display: flex;
  margin: 0rem 2rem;
`;

const TimeRange = styled.div`
  width: 20%;
  display: flex;
  flex-basis: 5em;
  padding: 0;
`;

const Time = styled.span`
  font-weight: 500;
`;

const StepContainer = styled.div<{
  borderColor?: string;
  borderStyle?: string;
}>`
  width: 20em;
  margin-left: 1em;
  padding-left: 1em;
  padding: 1em 1em 0em;
  border-left: 0.5em
    ${({ borderColor, borderStyle }) => `${borderStyle} ${borderColor}`};
`;

const StepHeader = styled.div`
  border-bottom: 0.1em solid #e8eaed;
  padding-bottom: 1em;
  font-weight: 500;
`;

const StepCollapsable = styled.div<{ hasNestedSteps: boolean }>`
  padding: 1em;
  cursor: ${({ hasNestedSteps }) => (hasNestedSteps ? "pointer" : "inherited")};
  ${({ hasNestedSteps }) => {
    if (hasNestedSteps) {
      return `
        &:hover {
          background: #eee;
        }
      `;
    }
  }}
`;

const StepDetails = styled.div<{ hasNestedSteps: boolean }>`
  font-weight: 300;
  border-bottom: 0.1em solid #e8eaed;
  padding: 1em 0 1em;
  padding-bottom: ${({ hasNestedSteps }) => (hasNestedSteps ? "0" : "1em")};
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

export default function StepInfo({
  startTime,
  step,
}: {
  startTime: number;
  step: DirectionsStep;
}) {
  const [showNestedSteps, setShowNestedSteps] = useState(false);
  const duration = moment.duration(step.duration.value, "seconds");
  return (
    <Container>
      <TimeRange>
        <Time>{moment.unix(startTime).utcOffset("+02:00").format("LT")}</Time>
      </TimeRange>
      <StepContainer
        borderColor={
          (step.travel_mode === "TRANSIT" && step.transit_details.line.color) ||
          "#06abf5"
        }
        borderStyle={(step.travel_mode === "TRANSIT" && "solid") || "dotted"}
      >
        <StepHeader
          dangerouslySetInnerHTML={{ __html: step.html_instructions }}
        />
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
                  {duration.humanize()} ( ({step.distance.text})
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
      </StepContainer>
    </Container>
  );
}
