import { DirectionLeg } from "../../types/directions-result";
import styled from "styled-components";
import moment from "moment";
import MacroStepsOverview from "./macro-steps-overview";
import StepsInfo from "./steps-info";

const Address = styled.div`
  color: #70757a;
  padding: 1em 2em 0em;
  font-size: 0.9rem;
  &:last-child {
    padding-top: 0.3em;
  }
`;

const Label = styled.span`
  color: #3c4043;
`;

const Time = styled.div`
  margin: 1rem 2rem 0em;
  font-size: 1.5em;
`;

const Duration = styled(Time)`
  margin-top: 0;
  color: #70757a;
`;

const Splitter = styled.div`
  width: 100%;
  height: 0;
  border-bottom: 0.1em solid #e8eaed;
`;

export default function LegInfo({ leg }: { leg: DirectionLeg }) {
  const duration = moment.duration(leg.duration, "seconds");
  return (
    <>
      <div>
        <Address>
          from <Label title={leg.start_address}>{leg.start_address}</Label>
        </Address>
        <Address>
          to <Label title={leg.end_address}>{leg.end_address}</Label>
        </Address>
      </div>
      <Time>
        {/* "+02:00" - "Europe/Berlin" */}
        {moment
          .unix(leg.departure_time.value)
          .utcOffset("+02:00")
          .format("LT")}{" "}
        - {moment.unix(leg.arrival_time.value).utcOffset("+02:00").format("LT")}
      </Time>
      <Duration>
        ({duration.hours()} hr {duration.minutes()} min)
      </Duration>
      <MacroStepsOverview steps={leg.steps} />
      <Splitter />
      <StepsInfo
        departureTime={leg.departure_time.value}
        startAddress={leg.start_address}
        arrivalTime={leg.arrival_time.value}
        endAddress={leg.end_address}
        steps={leg.steps}
      />
    </>
  );
}
