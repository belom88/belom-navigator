import { Tooltip } from "react-leaflet";
import { useAppSelector } from "../../redux/redux-hooks";
import { selectHighlight } from "../../redux/slices/highlight-slice";
import { DirectionsStep } from "../../types/directions-result";

type TooltipProps = {
  /** Mode of marker - "NESTED" - turn point of a "walking" step,
   * "STOP" - transit station, "START_END" - start/end of the route */
  mode: "NESTED" | "STOP" | "START_END";
  /** Edge of step/route - start or end */
  edge?: "START" | "END";
  /** Text for the tooltip. If is not set - deduced from the step data */
  text?: string;
  /** Step tooltip for */
  step?: DirectionsStep;
};

/**
 * Tooltip for highlighted marker
 */
export default function LeafletTooltipForHighlight({
  mode,
  edge,
  text,
  step,
}: TooltipProps) {
  const selectedHighlight = useAppSelector(selectHighlight);
  // Tooltip should be permanent for highlighed objects (start, end, station, turn point)
  const isPermanent =
    // If turn point highlighted
    (selectedHighlight?.type === "NESTED" &&
      mode === "NESTED" &&
      selectedHighlight?.step?.geometry === step?.geometry) ||
    // If transit station highlighted
    (selectedHighlight?.type === "STOP" &&
      mode === "STOP" &&
      selectedHighlight?.edge === edge &&
      selectedHighlight?.step?.geometry === step?.geometry) ||
    // If start or end of the route highlighted
    (selectedHighlight?.type === "START_END" &&
      mode === "START_END" &&
      selectedHighlight?.edge === edge);
  let textData: string = text || "";
  // If text not set in props, deduce it by the mode of tooltip and step
  if (!textData) {
    switch (mode) {
      case "NESTED":
        textData = step?.html_instructions || "";
        break;
      case "STOP":
        if (edge === "START") {
          textData = step?.transit_details.departure_stop.name || "";
        } else if (edge === "END") {
          textData = step?.transit_details.arrival_stop.name || "";
        }
        break;
      case "START_END":
      default:
        "";
    }
  }
  return (
    <>
      {isPermanent && (
        <Tooltip permanent interactive>
          <div dangerouslySetInnerHTML={{ __html: textData }}></div>
        </Tooltip>
      )}
      ;
      {!isPermanent && (
        <Tooltip>
          <div dangerouslySetInnerHTML={{ __html: textData }}></div>
        </Tooltip>
      )}
    </>
  );
}
