import { ReactElement } from "react";
import styled from "styled-components";
import {
  DirectionsStep,
  TimeWithTimeZone,
} from "../../types/directions-result";
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
import { MomentTimeZones } from "../../constants/common";
import {
  cl_canvas,
  cl_item_hovered,
  cl_item_selected,
  cl_point_outline,
  cl_leaflet_walking_step,
} from "../../constants/colors";

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
  background: ${cl_canvas};
  border: 0.2em solid ${cl_point_outline};
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
  border-left: 0.5em dotted ${cl_leaflet_walking_step};
  margin-top: -0.5em;
`;

const Text = styled.div<{ active: boolean }>`
  margin-left: 0;
  margin-top: -1em;
  padding: 0.5em 1em 0.5em;
  cursor: pointer;
  background: ${({ active }) => (active ? cl_item_selected : "inherit")};
  ${({ active }) => `
      &:hover {
        background: ${active ? cl_item_selected : cl_item_hovered};
      }
    `}
`;

type StepInfoProps = {
  /** Departure time of the leg */
  departureTime: TimeWithTimeZone;
  /** Start address of the leg */
  startAddress: string;
  /** Arrival time of the leg */
  arrivalTime: TimeWithTimeZone;
  /** End address of the leg */
  endAddress: string;
  /** Steps of the leg */
  steps: DirectionsStep[];
};

/** Group of elements for schedule:
 * * start of the leg
 * * top level steps
 * * end of the leg
 */
export default function StepsInfo({
  departureTime,
  startAddress,
  arrivalTime,
  endAddress,
  steps,
}: StepInfoProps) {
  const selectedHighlight = useAppSelector(selectHighlight);
  const dispatch = useAppDispatch();

  /**
   * Highlight start/end of the route on the map
   * @param edge - edge of the route (start or end)
   */
  function onClickStartEndHandler(edge: "START" | "END"): void {
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
        <StepInfo step={step} />
      </StepContainer>
    );
  }
  return (
    <Container>
      <StepContainer>
        {/* Start of the leg */}
        <EdgeContainer>
          <Time>
            {moment
              .unix(departureTime.value)
              .utcOffset(MomentTimeZones[departureTime.time_zone])
              .format("LT")}
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
        {/* End of the leg */}
        <EdgeContainer>
          <Time>
            {moment
              .unix(arrivalTime.value)
              .utcOffset(MomentTimeZones[arrivalTime.time_zone])
              .format("LT")}
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
