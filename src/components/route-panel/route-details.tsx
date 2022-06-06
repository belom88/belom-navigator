import { DirectionLeg, DirectionRoute } from "../../types/directions-result";
import LegInfo from "./leg-info";

export default function RouteDetails({ route }: { route: DirectionRoute }) {
  return (
    <>
      {route.legs.map((leg: DirectionLeg) => (
        <LegInfo key={leg.start_address + leg.end_address} leg={leg} />
      ))}
    </>
  );
}
