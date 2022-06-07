import styled from "styled-components";
import { DirectionsStep } from "../../types/directions-result";
import { useAppSelector, useAppDispatch } from "../../redux/redux-hooks";
import {
  selectHighlight,
  set,
  unset,
} from "../../redux/slices/highlight-slice";

const Wrapper = styled.div`
  overflow: hidden;
`;

const Container = styled.div<{ show: boolean }>`
  margin-top: ${({ show }) => (show ? 0 : "-105%")};
  transition: margin-top 600ms;
`;

const Step = styled.div<{ active: boolean }>`
  padding: 0.5em 0em 0.5em 1em;
  border-bottom: 0.1em solid #e8eaed;
  cursor: pointer;
  &:last-child {
    border: none;
  }
  background: ${({ active }) => (active ? "#c1b2a3" : "inherit")};
  ${({ active }) => `
      &:hover {
        background: ${active ? "#c1b2a3" : "#ccc"};
      }
    `}
`;

export default function NestedSteps({
  steps,
  show,
}: {
  steps: DirectionsStep[];
  show: boolean;
}) {
  const selectedStep = useAppSelector(selectHighlight);
  const dispatch = useAppDispatch();

  function onClickStepHandler(step: DirectionsStep) {
    if (
      selectedStep?.type === "NESTED" &&
      selectedStep.step?.geometry === step.geometry
    ) {
      dispatch(unset());
      return;
    }
    dispatch(set({ value: { step, type: "NESTED" } }));
  }

  function showStep(step: DirectionsStep) {
    return (
      <Step
        key={step.geometry}
        onClick={step.steps?.length ? () => {} : () => onClickStepHandler(step)}
        active={
          selectedStep?.type === "NESTED" &&
          selectedStep?.step?.geometry === step.geometry
        }
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
