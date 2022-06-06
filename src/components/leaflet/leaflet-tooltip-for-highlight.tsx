import { Tooltip } from "react-leaflet";
import { useAppSelector } from "../../redux/redux-hooks";
import { selectHighlight } from "../../redux/slices/highlight-slice";
import { DirectionsStep } from "../../types/directions-result";

export default function LeafletTooltipForHighlight({
  mode,
  edge,
  text,
  step,
}: {
  mode: "NESTED" | "STOP" | "START_END";
  edge?: "START" | "END";
  text?: string;
  step?: DirectionsStep;
}) {
  const selectedHighlight = useAppSelector(selectHighlight);
  const isPermanent =
    (selectedHighlight?.type === "NESTED" &&
      mode === "NESTED" &&
      selectedHighlight?.step?.geometry === step?.geometry) ||
    (selectedHighlight?.type === "STOP" &&
      mode === "STOP" &&
      selectedHighlight?.edge === edge &&
      selectedHighlight?.step?.geometry === step?.geometry) ||
    (selectedHighlight?.type === "START_END" &&
      mode === "START_END" &&
      selectedHighlight?.edge === edge);
  let textData: string = text || "";
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
