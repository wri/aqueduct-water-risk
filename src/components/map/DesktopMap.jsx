import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { PluginLeaflet } from 'layer-manager/dist/layer-manager';
import { LayerManager, Layer } from 'layer-manager/dist/components';
import {
  Map as WRIMap,
  MapPopup,
  Legend as VizzLegend,
  LegendItemToolbar,
  LegendListItem,
  LegendItemButtonInfo,
  LegendItemButtonOpacity
} from 'vizzuality-components/dist/bundle';
import {
  MapControls,
  ShareButton,
  ZoomControl,
  Legend,
  Icon
} from 'aqueduct-components';
import isEqual from 'lodash/isEqual';

// utils
import { logEvent } from 'utils/analytics';
import { normalizeLng } from '../../utils/layers';

// components
import BasemapControl from './basemap-control';
import LayerPopup from './popups/layer';
import AnalysisPopup from './popups/analysis';

// constants
import { LABEL_LAYER_CONFIG } from './constants';

class DesktopMap extends PureComponent {
  componentWillReceiveProps(nextProps) {
    const {
      layers,
      indicator,
      setLoading,
      analysisSelectedData
    } = this.props;
    const {
      layers: nextLayers,
      indicator: nextIndicator,
      analysisSelectedData: nextAnalysisSelectedData,
      analysisData
    } = nextProps;
    const layersChanged = !isEqual(layers, nextLayers);
    const indicatorChanged = !isEqual(indicator, nextIndicator);
    const selectedChanged = !isEqual(analysisSelectedData, nextAnalysisSelectedData);

    if ((layersChanged || indicatorChanged) && nextIndicator) {
      setLoading(true);
      if (this.popup) this.popup._close();
    }
  }

  componentDidUpdate(prevProps) {
    const { analysisSelectedData, analysisData, points, setPopupData, setPopupLocation } = this.props;
    const { analysisSelectedData: prevAnalysisSelectedData } = prevProps;
    const analysisSelectedDataPopupChanged = analysisSelectedData !== prevAnalysisSelectedData;

    if (analysisSelectedDataPopupChanged) {
      setPopupData({ ...analysisData[analysisSelectedData] });
      if (analysisData[analysisSelectedData]) {
        const { latitude: lat, longitude: lng } = analysisData[analysisSelectedData];
        setPopupLocation({ lat, lng });
      } else if (points[analysisSelectedData]) {
        const nextPopupPosition = points[analysisSelectedData];
        setPopupLocation(nextPopupPosition);
      } else {
        setPopupLocation(null);
      }
    }
  }

  handlePoint(event) {
    const { latlng, layer } = event;
    const {
      analysisSelectedData,
      onAddPoint,
      onAddUnknownLocation,
      points,
      analysisData,
      setSelectedData,
      setBounds
    } = this.props;

    if (layer) {
      const { editing: { _marker: { _latlng } } } = layer;
      const { lat } = _latlng;
      const lng = normalizeLng(_latlng.lng);
      const indexFromData = analysisData.findIndex(({ longitude, latitude }) => {
        const latDelta = Math.abs(latitude - lat);
        const lngDelta = Math.abs(longitude - lng);
        // 5 meters to grades
        const MAX_DISTANCE_TO_POINT = 0.0000007;
        return latDelta < MAX_DISTANCE_TO_POINT && lngDelta < MAX_DISTANCE_TO_POINT;
      });

      if (indexFromData === -1) {
        const indexFromPoints = points.findIndex(_point => isEqual(_point, ({ lat, lng })));
        if (indexFromPoints !== -1) setSelectedData([indexFromPoints]);
      }


      if (indexFromData !== -1 && analysisSelectedData.includes(indexFromData)) {
        setSelectedData([]);
      } else if (indexFromData !== -1) {
        setSelectedData([indexFromData]);
      }
    } else {
      const normalizedLng = normalizeLng(latlng.lng);
      onAddPoint({ lat: latlng.lat, lng: normalizedLng });
      if (latlng.lng > 180 || latlng.lng < -180) {
        setBounds({ bbox: [(normalizedLng - 30), (latlng.lat + 10), (normalizedLng + 30), (latlng.lat - 10)] });
      }
      onAddUnknownLocation();
    }
  }

  handleRemovePoint() {
    const {
      analysisData,
      analysisSelectedData,
      setSelectedData,
      onRemovePoint,
      onApplyAnalysis,
      points
    } = this.props;
    let pointToRemove = null;

    const locationToRemove = analysisData[analysisSelectedData];

    if (!locationToRemove) pointToRemove = points[analysisSelectedData[0]];

    if (locationToRemove) {
      const { longitude: lng, latitude: lat } = locationToRemove;
      onRemovePoint({ lat, lng });
    }

    if (pointToRemove) {
      const { lng, lat } = pointToRemove;
      onRemovePoint({
        lat,
        lng
      });
    }

    if (locationToRemove || pointToRemove) {
      setSelectedData([]);
      if (locationToRemove) onApplyAnalysis();
    }
  }

  handleAnalysis() {
    const {
      onApplyAnalysis,
      setSelectedData
    } = this.props;

    onApplyAnalysis();
    setSelectedData([]);
  }

  handleLayerOpacity(layer, opacity) {
    const { setLayerParametrization } = this.props;

    setLayerParametrization({ opacity });
  }

  handleClickMap(e) {
    const { popup: { data: currentData }, setPopupLocation, setPopupData } = this.props;
    const { latlng, data } = e;
    setPopupLocation(latlng);
    if (!currentData.counter) {
      setPopupData({ ...data, counter: 2 });
    } else {
      setPopupData({ ...currentData, ...data, counter: currentData.counter - 1 });
    }
  }

  updateMap(event, map) {
    const { setMapParams } = this.props;

    setMapParams({
      zoom: map.getZoom(),
      center: map.getCenter()
    });

    logEvent('Map', 'map-movement', window.location.hash);
  }

  handleBoundaries() {
    const { boundaries, setBoundaries } = this.props;

    setBoundaries(!boundaries);
  }

  render() {
    const {
      map,
      basemap,
      layers,
      loading,
      bounds,
      indicator,
      mapMode,
      setMapParams,
      toggleSourceModal,
      toggleShareModal,
      layerGroup,
      popup,
      boundaries,
      analysisPopupColumns,
      setLoading,
      onUpdateLocation
    } = this.props;
    const { zoom, minZoom, maxZoom } = map;
    const mapEvents = { moveend: (e, _map) => { this.updateMap(e, _map); } };
    const mapClass = classnames('c-map', ({ '-analysis ': mapMode === 'analysis' }));

    return (
      <div className="l-map">
        <WRIMap
          mapOptions={map}
          events={mapEvents}
          basemap={basemap}
          bounds={bounds}
          customClass={mapClass}
          onReady={(_map) => { this.map = _map; }}
          {...boundaries && { label: LABEL_LAYER_CONFIG }}
        >
          {_map =>
            <Fragment>
              <LayerManager
                map={_map}
                plugin={PluginLeaflet}
                onReady={() => { if (loading) setLoading(false); }}
              >
                {layers.map((l, i) => (
                  <Layer
                    {...l}
                    key={l.id}
                    opacity={l.opacity}
                    zIndex={1000 - i}
                    {...l.params && { params: l.params }}
                    {...l.sqlParams && { sqlParams: l.sqlParams }}
                    {...l.decodeParams && { decodeParams: l.decodeParams }}
                    {...l.interactionConfig && {
                      interactivity: ['carto', 'cartodb'].includes(l.provider)
                        ? (l.interactionConfig.output || []).map(o => o.column)
                        : true
                    }}
                    events={{
                      ...mapMode === 'analysis' && { click: (e) => { this.handlePoint(e, _map); } },
                      ...mapMode === 'view' && { click: (e) => { this.handleClickMap(e); } }
                    }}
                  />
                )).filter(e => e)}
              </LayerManager>

              <MapControls>
                <ZoomControl
                  zoom={zoom}
                  minZoom={minZoom}
                  maxZoom={maxZoom}
                  onZoomChange={(_zoom) => { setMapParams({ zoom: _zoom }); }}
                />
                <BasemapControl />
                <button
                  type="submit"
                  onClick={() => { this.handleBoundaries(); }}
                >
                  <Icon
                    name="icon-boundaries"
                    className="title-icon"
                  />
                </button>
                <ShareButton onClick={toggleShareModal} />
              </MapControls>

              <MapPopup
                map={_map}
                latlng={popup.latlng}
                data={{
                  layers,
                  data: popup.data,
                  columns: analysisPopupColumns
                }}
                onReady={(_popup) => { this.popup = _popup; }}
              >
                {mapMode === 'analysis' ?
                  <AnalysisPopup
                    onRemovePoint={() => { this.handleRemovePoint(); }}
                    onFetchAnalysis={() => { this.handleAnalysis(); }}
                    onUpdateLocation={(location) => { onUpdateLocation(location); }}
                  /> :
                  <LayerPopup />
                }
              </MapPopup>

              { layers.length && indicator &&
                <div className="l-map-legend">
                  <VizzLegend sortable={false}>
                    {layerGroup.map((_layerGroup, i) => (
                      <LegendListItem
                        index={i}
                        key={_layerGroup.dataset}
                        onChangeInfo={() => { toggleSourceModal(indicator); }}
                        onChangeOpacity={(_layer, _opacity) => { this.handleLayerOpacity(_layer, _opacity); }}
                        layerGroup={_layerGroup}
                        toolbar={(
                          <LegendItemToolbar>
                            <LegendItemButtonOpacity
                              trackStyle={{ backgroundColor: '#2E57B8' }}
                              handleStyle={{ backgroundColor: '#2E57B8' }}
                            />
                            <LegendItemButtonInfo />
                          </LegendItemToolbar>
                        )}
                      >
                        <Legend filters={{}} />
                      </LegendListItem>
                    ))}
                  </VizzLegend>
                </div>
              }
            </Fragment>
          }
        </WRIMap>
      </div>
    );
  }
}

DesktopMap.propTypes = {
  map: PropTypes.object.isRequired,
  basemap: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  layers: PropTypes.array.isRequired,
  points: PropTypes.array.isRequired,
  analysisData: PropTypes.array.isRequired,
  analysisSelectedData: PropTypes.array.isRequired,
  layerGroup: PropTypes.array.isRequired,
  indicator: PropTypes.string,
  boundaries: PropTypes.bool.isRequired,
  bounds: PropTypes.object.isRequired,
  setBounds: PropTypes.func.isRequired,
  popup: PropTypes.object.isRequired,
  analysisPopupColumns: PropTypes.array.isRequired,
  mapMode: PropTypes.string.isRequired,
  sidebarWidth: PropTypes.number.isRequired,
  setMapParams: PropTypes.func.isRequired,
  setLayerParametrization: PropTypes.func.isRequired,
  setPopupLocation: PropTypes.func.isRequired,
  setPopupData: PropTypes.func.isRequired,
  onAddPoint: PropTypes.func.isRequired,
  onRemovePoint: PropTypes.func.isRequired,
  onFetchAnalysis: PropTypes.func.isRequired,
  toggleSourceModal: PropTypes.func.isRequired,
  toggleShareModal: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  setSelectedData: PropTypes.func.isRequired,
  onApplyAnalysis: PropTypes.func.isRequired,
  onAddUnknownLocation: PropTypes.func.isRequired,
  setBoundaries: PropTypes.func.isRequired,
  onUpdateLocation: PropTypes.func.isRequired
};

export default DesktopMap;
