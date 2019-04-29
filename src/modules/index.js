import { handleModule } from 'redux-tools';
import { routerReducer } from 'react-router-redux';

import { modalReducer } from 'aqueduct-components';
import * as appModule from 'modules/app';
import * as layersModule from 'modules/layers';
import * as settingsModule from 'modules/settings';
import * as analyzeLocationsModule from 'modules/analyze-locations-tab';
import * as mapModule from 'modules/map';
import * as sharingModule from 'modules/sharing';

export default {
  // third-party reducers
  routing: routerReducer,
  modal: modalReducer,
  // local reducers
  app: handleModule(appModule),
  layers: handleModule(layersModule),
  settings: handleModule(settingsModule),
  map: handleModule(mapModule),
  share: handleModule(sharingModule),
  analyzeLocations: handleModule(analyzeLocationsModule)
};
