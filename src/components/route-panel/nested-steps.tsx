import styled from "styled-components";
import { DirectionsStep } from "../../types/directions-result";
import { useAppSelector, useAppDispatch } from "../../redux/redux-hooks";
import {
  selectHighlight,
  set,
  unset,
} from "../../redux/slices/highlight-slice";
import {
  cl_item_hovered,
  cl_item_selected,
  cl_splitter,
} from "../../constants/colors";

const Wrapper = styled.div`
  overflow: hidden;
`;

const Container = styled.div<{ show: boolean }>`
  margin-top: ${({ show }) => (show ? 0 : "-105%")};
  transition: margin-top 600ms;
`;

const Step = styled.div<{ active: boolean }>`
  padding: 0.5em 0em 0.5em 1em;
  border-bottom: 0.1em solid ${cl_splitter};
  cursor: pointer;
  &:last-child {
    border: none;
  }
  background: ${({ active }) => (active ? cl_item_selected : "inherit")};
  ${({ active }) => `
      &:hover {
        background: ${active ? cl_item_selected : cl_item_hovered};
      }
    `}
`;

type NestedStepsProps = {
  /** Steps to show */
  steps: DirectionsStep[];
  /** Expand or collapse steps */
  show: boolean;
};

/** Nested steps - turn points of a "walking" step */
export default function NestedSteps({ steps, show }: NestedStepsProps) {
  const selectedStep = useAppSelector(selectHighlight);
  const dispatch = useAppDispatch();

  /**
   * Highlight/unhighlight step on the map
   * @param step - step to highlight/unhighlight
   */
  function onClickStepHandler(step: DirectionsStep): void {
    if (
      selectedStep?.type === "NESTED" &&
      selectedStep.step?.geometry === step.geometry
    ) {
      dispatch(unset());
      return;
    }
    dispatch(set({ value: { step, type: "NESTED" } }));
  }

  /**
   * Recursive visualisation of steps tree
   * @param step step to show
   */
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
