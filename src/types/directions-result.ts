export type DirectionsResult = {
  code: string;
  routes: DirectionRoute[];
  waypoints: DirectionWaypoint[];
};

export type DirectionRoute = {
  bounds: {
    northeast: CartographicCoordinates;
    southwest: CartographicCoordinates;
  };
  distance: number;
  duration: number;
  legs: DirectionLeg[];
  overview_polyline: {
    points: string;
  };
  profile: string;
  summary: string;
  warnings: string[];
  waypoint_order: [];
};

export type DirectionLeg = {
  arrival_time: TimeWithTimeZone;
  departure_time: TimeWithTimeZone;
  distance: number;
  duration: number;
  end_address: string;
  end_location: CartographicCoordinates;
  start_address: string;
  start_location: CartographicCoordinates;
  steps: DirectionsStep[];
  summary: string;
  traffic_speed_entry: [];
  via_waypoint: [];
};

export type DirectionsStep = {
  distance: {
    text: string;
    value: number;
  };
  duration: {
    text: string;
    value: number;
  };
  end_location: CartographicCoordinates;
  geometry: string;
  html_instructions: string;
  start_location: CartographicCoordinates;
  steps: DirectionsStep[];
  transit_details: DirectionTransitDetails;
  travel_mode: "WALKING" | "TRANSIT";
};

type DirectionTransitDetails = {
  arrival_stop: TransitStop;
  arrival_time: TimeWithTimeZone;
  departure_stop: TransitStop;
  departure_time: TimeWithTimeZone;
  headsign: string;
  line: TransitLine;
  num_stops: number;
};

export type DirectionWaypoint = {
  distance: number;
  hint: string;
  location: CartographicCoordinatesTuple;
  name: string;
};

type TransitLine = {
  agencies: Agency[];
  color: string;
  name: string;
  short_name: string;
  text_color: string;
  vehicle: {
    icon: string;
    name: string;
    type: "BUS" | "SUBWAY";
  };
};

type Agency = {
  name: string;
  phone: string;
  url: string;
};

export type TimeWithTimeZone = {
  text: string;
  time_zone: string;
  value: number;
};

export type CartographicCoordinates = {
  lat: number;
  lng: number;
};

export type CartographicCoordinatesTuple = [number, number];

type TransitStop = {
  location: CartographicCoordinates;
  name: string;
};
