import { Fragment } from "react";
import { DirectionsStep } from "../../types/directions-result";
import StepOverview from "./step-overview";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const StepsOverview = styled.div`
  margin: 1rem 2rem 1rem;
`;

const Splitter = styled.span`
  color: #cad3dc;
  margin: 0 1rem 0;
`;

export default function MacroStepsOverview({
  steps,
}: {
  steps: DirectionsStep[];
}) {
  return (
    <StepsOverview>
      {steps.slice(0, -1).map((step: DirectionsStep) => {
        return (
          <Fragment key={step.geometry}>
            <StepOverview step={step} />
            <Splitter>
              <FontAwesomeIcon icon={faAngleRight} />
            </Splitter>
          </Fragment>
        );
      })}
      {steps.slice(-1).map((step: DirectionsStep) => {
        return <StepOverview key={step.geometry} step={step} />;
      })}
    </StepsOverview>
  );
}
