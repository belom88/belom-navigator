# belom-navigator

Code challege application for Huawei Research Center Germany

## Installation

The application is implemented as code challenge application and not expected for production deployment.

### Dependencies

To run the application localy the computer should be supported by [Node.js](https://nodejs.org).
Install Node.js from the website or use [Node Version Manager](https://github.com/nvm-sh/nvm).
The application has been tested on Node.js v14.17.3 .

### Clone the application

```bash
  git clone git@github.com:belom88/belom-navigator.git
```

### Install node_modules

```bash
  cd belom-navigator
  npm install
```

### Run the application

```bash
  npm run start
```

The application will run on the port 8080. The tab will be automaticaly opened in the default web browser. [Chrome](https://www.google.com/chrome/downloads) browser has been used for development and testing.

### Tech stack used

- [TypeScript](https://www.typescriptlang.org)
- [Leaflet](https://leafletjs.com)
- [React](https://reactjs.org)
- [React Leaflet](https://react-leaflet.js.org)
- [React Redux](https://react-redux.js.org)
- [Styled Components](https://styled-components.com)
- [Fontawesome](https://fontawesome.com)
- [Moment](https://momentjs.com)
- [Webpack](https://webpack.js.org)
- [Google Maps JavaScript Polyline Codec](https://github.com/googlemaps/js-polyline-codec)

## Functionality

### User should see the map with route

- I open http://localhost:8080 in the web browser
- And I should see the map
- And I should see the route path
- And I should see on route path multiple colored segments
- And I should see start point on the route path
- And I should see end point on the route path
- And I should see transit stops points on the route path

### User should see the route panel

- I open http://localhost:8080 in the web browser
- And I should see the route panel on the left
- And I should see `from` and `to` addresses
- And I should see time range and duration
- And I should see steps overview
- And I should see route schedule

### User should see route schedule on the route panel

- I open http://localhost:8080 in the web browser
- And I should see the route panel on the left
- And I should see route schedule
- And I should see time on the left side of the route schedule
- And I should see start point, "Walking" steps, transit stations, transit lines short info and end point
- And I should see vertical line with multiple colored segments
- And each segment's color match the color of the corresponding step on the map

### User should expand and collapse "Walking" details

- I open http://localhost:8080 in the web browser
- And I should see the route panel on the left
- And I should see route schedule
- And I should see "Walking" button
- When I click on "Walking"
- Then walking nested steps appear under the "Walking" button
- When I click on "Walking" second time
- Then walking nested steps disappear

### User should select start point and end point

- I open http://localhost:8080 in the web browser
- And I should see the route panel on the left
- And I should see route schedule
- When I click on the start address in the route schedule
- Then I can see that the start address text has active background
- And the map pans and zooms to the start point of the route
- And tooltip with start address appears permanently
- When I click on the tooltip
- Then tooltip disappears
- And the start address disactivated on the route schedule
- When I click on the end address in the route schedule
- Then I can see that the end address text has active background
- And the map pans and zooms to the end point of the route
- And tooltip with end address appears permanently
- When I click on the end address in the route schedule second time
- Then tooltip with end address disappears
- And the map zooms out to see the whole route path
- And I can see end address text has normal background

### User should select subway stations and bus stops

- I open http://localhost:8080 in the web browser
- And I should see the route panel on the left
- And I should see route schedule
- When I click "Neubiberg, W.-Heisenberg-W." bus stop
- Then the text of the bus stop has active backgound
- And the map pans and zooms to the bus stop
- And the tooltip with bus stop name appears permanently

### User should select walking turn point

- I open http://localhost:8080 in the web browser
- And I should see the route panel on the left
- And I should expand the first "Walking" step
- And I should click on "Turn left"
- Then the text "Turn left" has active background
- And the map pans and zooms to the turn point
- And the tooltip with "Turn left" appears permanently

### User should select start point, end point, subway station, bus stop or walking turn

- I open http://localhost:8080 in the web browser
- And I should see the map with route
- When I click on start point, end point, subway station, bus stop or walking turn
- Then the tooltip of the point appears permanently
- And corresponding object has active background in the route schedule

### User should see the route overview

- I open http://localhost:8080 in the web browser
- And I should see the map with route
- When I zoom out to see Shtuttgart (zoom === 9)
- Then I see the route has one color
- And I should't see subway stations, bus stops and walking turn points
- And I should see start point and end point
- When I zoom in to zoom === 11
- Then I should see subway stations, bus stops and walking turn points
- And I should see the route segmends with different colors

## Assumptions and restrictions

The application developed on a static data set and can fail on another data set, albeit one with a similar data structure.
