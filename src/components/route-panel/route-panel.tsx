import { DirectionRoute } from "../../types/directions-result";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import RouteDetails from "./route-details";
import { cl_canvas, cl_panel_shadow } from "../../constants/colors";

const RoutePanelContainer = styled.div<{ collapsed: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 30em;
  z-index: 401;
  background: ${cl_canvas};
  box-shadow: 0.3em 0.3em 0.4em ${cl_panel_shadow};
  left: ${({ collapsed }) => (collapsed ? "-30em" : "0")};
  transition: left 900ms;
  overflow-y: scroll; ;
`;

const HideButton = styled.button<{ collapsed: boolean }>`
  position: absolute;
  top: 0;
  height: 2em;
  width: 1.4em;
  z-index: 401;
  border-radius: 0.3em;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-width: 0;
  background: ${cl_canvas};
  box-shadow: 0.3em 0.3em 0.4em ${cl_panel_shadow};
  left: ${({ collapsed }) => (collapsed ? "0em" : "27em")};
  transition: left 900ms;
  cursor: pointer;
`;

/** Route panel to show detailed information about routes */
export default function RoutePanel({ routes }: { routes?: DirectionRoute[] }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <>
      {routes && (
        <>
          {/* Panel */}
          <RoutePanelContainer collapsed={collapsed}>
            {routes.map((route: DirectionRoute) => (
              <RouteDetails
                key={route.overview_polyline.points}
                route={route}
              ></RouteDetails>
            ))}
          </RoutePanelContainer>
          {/* Show/hide button */}
          <HideButton
            collapsed={collapsed}
            onClick={() => setCollapsed(!collapsed)}
          >
            <FontAwesomeIcon icon={collapsed ? faAngleRight : faAngleLeft} />
          </HideButton>
        </>
      )}
    </>
  );
}
