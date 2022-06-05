import styled from "styled-components";
import { DirectionsStep } from "../../types/directions-result";

const Wrapper = styled.div`
  overflow: hidden;
`;

const Container = styled.div<{ show: boolean }>`
  margin-top: ${({ show }) => (show ? 0 : "-100%")};
  transition: margin-top 600ms;
`;

const Step = styled.div`
  padding: 1em 0em 1em 1em;
  border-bottom: 0.1em solid #e8eaed;
  cursor: pointer;
  &:last-child {
    border: none;
  }
  &:hover {
    background: #eee;
  }
`;

export default function NestedSteps({
  steps,
  show,
}: {
  steps: DirectionsStep[];
  show: boolean;
}) {
  function showStep(step: DirectionsStep) {
    return (
      <Step key={step.geometry} show={show}>
        <div dangerouslySetInnerHTML={{ __html: step.html_instructions }}></div>
        {step.steps?.length && steps.map((step) => showStep(step))}
      </Step>
    );
  }
  return (
    <Wrapper>
      <Container show={show}>{steps.map((step) => showStep(step))}</Container>
    </Wrapper>
  );
}
