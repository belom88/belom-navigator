import { DirectionWaypoint } from "../../types/directions-result";
import { LeafletStartPoint, LeafletEndPoint } from "./leaflet-points";
import LeafletTooltipForHighlight from "./leaflet-tooltip-for-highlight";
import { useAppSelector, useAppDispatch } from "../../redux/redux-hooks";
import { selectHighlight, set } from "../../redux/slices/highlight-slice";

/** Start and end points of the route */
export default function LeafletEdgePoints({
  waypoints,
}: {
  waypoints: DirectionWaypoint[];
}) {
  const selectedHighlight = useAppSelector(selectHighlight);
  const dispatch = useAppDispatch();

  /**
   * Toggle - if start/end of the route is selected
   * @param edge - is it start or end of the route
   */
  function toggleEdgePoint(edge: "START" | "END") {
    if (
      selectedHighlight?.type === "START_END" &&
      selectedHighlight?.edge === edge
    ) {
      dispatch(set({ value: { type: "START_END" } }));
    } else {
      dispatch(set({ value: { edge, type: "START_END" } }));
    }
  }
  return (
    <>
      {waypoints && (
        <>
          (
          <LeafletStartPoint
            center={[waypoints[0].location[1], waypoints[0].location[0]]}
            onClick={() => toggleEdgePoint("START")}
          >
            <LeafletTooltipForHighlight
              mode="START_END"
              text={waypoints[0].name}
              edge="START"
            />
          </LeafletStartPoint>
          <LeafletEndPoint
            center={[
              waypoints[waypoints.length - 1].location[1],
              waypoints[waypoints.length - 1].location[0],
            ]}
            onClick={() => toggleEdgePoint("END")}
          >
            <LeafletTooltipForHighlight
              mode="START_END"
              text={waypoints[waypoints.length - 1].name}
              edge="END"
            />
          </LeafletEndPoint>
        </>
      )}
    </>
  );
}
