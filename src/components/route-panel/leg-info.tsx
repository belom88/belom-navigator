import { DirectionLeg } from "../../types/directions-result";
import styled from "styled-components";
import moment from "moment";
import MacroStepsOverview from "./macro-steps-overview";
import StepsInfo from "./steps-info";
import { MomentTimeZones } from "../../constants/common";
import {
  cl_address_label,
  cl_splitter,
  cl_text_secondary,
} from "../../constants/colors";

const Address = styled.div`
  color: ${cl_text_secondary};
  padding: 1em 2em 0em;
  font-size: 0.9rem;
  &:last-child {
    padding-top: 0.3em;
  }
`;

const Label = styled.span`
  color: ${cl_address_label};
`;

const Time = styled.div`
  margin: 1rem 2rem 0em;
  font-size: 1.5em;
`;

const Duration = styled(Time)`
  margin-top: 0;
  color: ${cl_text_secondary};
`;

const Splitter = styled.div`
  width: 100%;
  height: 0;
  border-bottom: 0.1em solid ${cl_splitter};
`;

/** Leg information for the route panel */
export default function LegInfo({ leg }: { leg: DirectionLeg }) {
  const duration = moment.duration(leg.duration, "seconds");
  return (
    <>
      <div>
        {/* Start address */}
        <Address>
          from <Label title={leg.start_address}>{leg.start_address}</Label>
        </Address>
        {/* End address */}
        <Address>
          to <Label title={leg.end_address}>{leg.end_address}</Label>
        </Address>
      </div>
      <Time>
        {/* Departure time */}
        {moment
          .unix(leg.departure_time.value)
          .utcOffset(MomentTimeZones[leg.departure_time.time_zone])
          .format("LT")}{" "}
        - {/* Arrival time */}
        {moment
          .unix(leg.arrival_time.value)
          .utcOffset(MomentTimeZones[leg.arrival_time.time_zone])
          .format("LT")}
      </Time>
      {/* Travel duration */}
      <Duration>
        ({duration.hours()} hr {duration.minutes()} min)
      </Duration>
      <MacroStepsOverview steps={leg.steps} />
      <Splitter />
      <StepsInfo
        departureTime={leg.departure_time}
        startAddress={leg.start_address}
        arrivalTime={leg.arrival_time}
        endAddress={leg.end_address}
        steps={leg.steps}
      />
    </>
  );
}
