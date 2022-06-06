import styled from "styled-components";
import { DirectionsStep } from "../../types/directions-result";
import { useAppSelector, useAppDispatch } from "../../redux/redux-hooks";
import { selectStep, set, unset } from "../../redux/slices/step-slice";

const Wrapper = styled.div`
  overflow: hidden;
`;

const Container = styled.div<{ show: boolean }>`
  margin-top: ${({ show }) => (show ? 0 : "-100%")};
  transition: margin-top 600ms;
`;

const Step = styled.div<{ active: boolean }>`
  padding: 1em 0em 1em 1em;
  border-bottom: 0.1em solid #e8eaed;
  cursor: pointer;
  &:last-child {
    border: none;
  }
  &:hover {
    background: #ccc;
  }
  background: ${({ active }) => (active ? "#eee" : "inherited")};
`;

export default function NestedSteps({
  steps,
  show,
}: {
  steps: DirectionsStep[];
  show: boolean;
}) {
  const selectedStep = useAppSelector(selectStep);
  const dispatch = useAppDispatch();

  function onClickStepHandler(step: DirectionsStep) {
    if (selectedStep && selectedStep.geometry === step.geometry) {
      dispatch(unset());
      return;
    }
    dispatch(set({ value: { geometry: step.geometry, type: "NESTED" } }));
  }

  function showStep(step: DirectionsStep) {
    return (
      <Step
        key={step.geometry}
        onClick={step.steps?.length ? () => {} : () => onClickStepHandler(step)}
        active={selectedStep?.geometry === step.geometry}
      >
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
