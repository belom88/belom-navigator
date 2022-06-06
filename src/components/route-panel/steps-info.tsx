import { ReactElement } from "react";
import styled from "styled-components";
import { DirectionsStep } from "../../types/directions-result";
import StepInfo from "./step-info";
import moment from "moment";

const Container = styled.div`
  position: relative;
  padding: 2em 0;
`;

const StepContainer = styled.div`
  position: relative;
`;

const Point = styled.div`
  position: absolute;
  display: flex;
  left: 7.8em;
  top: -0.5em;
  background: #fff;
  border: 0.2em solid #333;
  border-radius: 1em;
  width: 1em;
  height: 1em;
`;

const EndPoint = styled(Point)`
  top: inherit;
  bottom: 1.5em;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Dot = styled.div`
  width: 0.4em;
  height: 0.3em;
  background: #333;
  border-radius: 1em;
`;

const Time = styled.span`
  font-weight: 500;
  position: absolute;
  bottom: 1.3em;
  left: 2.7em;
`;

export default function StepsInfo({
  departureTime,
  arrivalTime,
  steps,
}: {
  departureTime: number;
  arrivalTime: number;
  steps: DirectionsStep[];
}) {
  const preprocessedSteps: ReactElement[] = [];
  let prevDuration = 0;
  for (const step of steps) {
    const startTime = departureTime + prevDuration + step.duration.value;
    preprocessedSteps.push(
      <StepContainer key={step.geometry}>
        <Point />
        <StepInfo startTime={startTime} step={step} />
      </StepContainer>
    );
    prevDuration += step.duration.value;
  }
  return (
    <Container>
      {preprocessedSteps}
      <EndPoint>
        <Dot />
      </EndPoint>
      <Time>{moment.unix(arrivalTime).utcOffset("+02:00").format("LT")}</Time>
    </Container>
  );
}
