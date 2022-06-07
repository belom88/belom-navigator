import { DirectionsStep } from "../../types/directions-result";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPersonWalking,
  faTrainSubway,
  faBus,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { cl_text_secondary } from "../../constants/colors";

const TravelMode = styled.span`
  color: ${cl_text_secondary};
  line-height: 2em
`;

const LineInfo = styled.span<{ backgroundColor: string; color: string }>`
  color: ${({ color }) => color};
  background: ${({ backgroundColor }) => backgroundColor};
  border-radius: 0.3em;
  padding: 0.2em;
  margin-left: 0.3em;
`;

/** Step overview for compact inline representation */
export default function StepOverview({ step }: { step: DirectionsStep }) {
  return (
    <>
      {step.travel_mode === "WALKING" && (
        <TravelMode>
          <FontAwesomeIcon icon={faPersonWalking} />
        </TravelMode>
      )}
      {step.travel_mode === "TRANSIT" &&
        step.transit_details.line.vehicle.type === "SUBWAY" && (
          <>
            <TravelMode>
              <FontAwesomeIcon icon={faTrainSubway} />
            </TravelMode>
          </>
        )}
      {step.travel_mode === "TRANSIT" &&
        step.transit_details.line.vehicle.type === "BUS" && (
          <TravelMode>
            <FontAwesomeIcon icon={faBus} />
          </TravelMode>
        )}
      {step.travel_mode === "TRANSIT" && (
        <LineInfo
          backgroundColor={step.transit_details.line.color}
          color={step.transit_details.line.text_color}
        >
          {step.transit_details.line.short_name}
        </LineInfo>
      )}
    </>
  );
}
