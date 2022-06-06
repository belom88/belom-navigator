import { ReactElement } from "react";
import styled from "styled-components";
import { DirectionsStep } from "../../types/directions-result";
import StepInfo from "./step-info";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleDot } from "@fortawesome/free-regular-svg-icons";
import { useAppSelector, useAppDispatch } from "../../redux/redux-hooks";
import {
  selectHighlight,
  set,
  unset,
} from "../../redux/slices/highlight-slice";

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
  bottom: 0em;
  left: 7.8em;
  border: none;
`;

const Time = styled.span`
  font-weight: 500;
  padding: 1em 0 0.5em;
  flex-basis: 5em;
`;

const EdgeContainer = styled.div`
  display: flex;
  position: relative;
  margin: 0rem 2rem;
  align-items: end;
`;

const StartTextContainer = styled.div`
  width: 20em;
  margin-left: 1em;
  padding-left: 1em;
`;

const EndTextContainer = styled(StartTextContainer)`
  border-left: 0.5em dotted #06abf5;
  margin-top: -0.5em;
`;

const Text = styled.div<{ active: boolean }>`
  margin-left: 0;
  margin-top: -1em;
  padding: 0.5em 1em 0.5em;
  cursor: pointer;
  &:hover {
    background: #ccc;
  }
  background: ${({ active }) => (active ? "#eee" : "inherited")};
`;

export default function StepsInfo({
  departureTime,
  startAddress,
  arrivalTime,
  endAddress,
  steps,
}: {
  departureTime: number;
  startAddress: string;
  arrivalTime: number;
  endAddress: string;
  steps: DirectionsStep[];
}) {
  const selectedHighlight = useAppSelector(selectHighlight);
  const dispatch = useAppDispatch();

  function onClickStartEndHandler(edge: "START" | "END") {
    if (
      selectedHighlight?.type === "START_END" &&
      selectedHighlight.edge === edge
    ) {
      dispatch(unset());
      return;
    }
    dispatch(set({ value: { edge, type: "START_END" } }));
  }

  const preprocessedSteps: ReactElement[] = [];
  for (const step of steps) {
    preprocessedSteps.push(
      <StepContainer key={step.geometry}>
        {<Point />}
        <StepInfo step={step} />
      </StepContainer>
    );
  }
  return (
    <Container>
      <StepContainer>
        <EdgeContainer>
          <Time>
            {moment.unix(departureTime).utcOffset("+02:00").format("LT")}
          </Time>
          <StartTextContainer>
            <Text
              onClick={() => onClickStartEndHandler("START")}
              active={
                selectedHighlight?.type === "START_END" &&
                selectedHighlight?.edge === "START"
              }
            >
              {startAddress}
            </Text>
          </StartTextContainer>
        </EdgeContainer>
      </StepContainer>
      {preprocessedSteps}
      <StepContainer>
        <EdgeContainer>
          <Time>
            {moment.unix(arrivalTime).utcOffset("+02:00").format("LT")}
          </Time>
          <EndTextContainer>
            <Text
              onClick={() => onClickStartEndHandler("END")}
              active={
                selectedHighlight?.type === "START_END" &&
                selectedHighlight?.edge === "END"
              }
            >
              {endAddress}
            </Text>
          </EndTextContainer>
        </EdgeContainer>
        <EndPoint>
          <FontAwesomeIcon icon={faCircleDot} />
        </EndPoint>
      </StepContainer>
    </Container>
  );
}
