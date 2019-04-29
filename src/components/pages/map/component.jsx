import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Accordion, Icon, Sidebar, SegmentedUi, Spinner } from 'aqueduct-components';
import isEqual from 'lodash/isEqual';

// components
import BaselineTab from 'components/pages/map/baseline-tab';
import FutureTab from 'components/pages/map/future-tab';
import MapComponent from 'components/map';
import Analyzer from 'components/analyzer';

// constants
import { SCOPE_OPTIONS } from 'constants/app';
import { TIMEFRAME_OPTIONS } from 'constants/filters';
import { INDICATORS, DEFAULT_FUTURE_INDICATOR } from 'constants/indicators';

class MapPage extends PureComponent {
  componentWillMount() {
    const {
      getLayers,
      updateUrl
    } = this.props;

    getLayers();
    updateUrl();
  }

  componentWillReceiveProps(nextProps) {
    const {
      filters,
      ponderation,
      scope,
      advanced,
      mapState,
      geostore,
      updateUrl
    } = this.props;
    const {
      filters: nextFilters,
      ponderation: nextPonderation,
      scope: nextScope,
      advanced: nextAdvanced,
      mapState: nextMapState,
      geostore: nextGeostore
    } = nextProps;

    const filtersChanged = !isEqual(filters, nextFilters);
    const mapStateChanged = !isEqual(mapState, nextMapState);
    const ponderationChanged = ponderation.scheme !== nextPonderation.scheme;
    const scopeChanged = scope !== nextScope;
    const advancedModeChanged = advanced !== nextAdvanced;
    const geostoreChanged = geostore !== nextGeostore;

    // updates URL if any of these params change
    if (filtersChanged || ponderationChanged
      || scopeChanged || mapStateChanged
      || advancedModeChanged || geostoreChanged) updateUrl();
  }

  onChangeTab({ value }) {
    const {
      setScope,
      setFilters,
      filters: { projection }
    } = this.props;
    const isFuture = value === 'future';

    setScope(value);
    setFilters({
      year: isFuture ? TIMEFRAME_OPTIONS[0].value : 'baseline',
      indicator: isFuture ? DEFAULT_FUTURE_INDICATOR[projection] : INDICATORS[0].id
    });
  }

  render() {
    const {
      scope,
      loading,
      analyzerOpen,
      analysis: { data },
      setAnalyzerOpen
    } = this.props;

    const sidebarClass = classnames({
      'sidebar-with-open-analyzer': analyzerOpen,
      'sidebar-with-data-analyzer': analyzerOpen && data.length
    });

    return (
      <div className="c-map-page l-map-page">
        <Sidebar
          setSidebarWidth={() => {}}
          className={sidebarClass}
        >
          <SegmentedUi
            className="-tabs"
            items={SCOPE_OPTIONS}
            selected={scope}
            onChange={(tab) => { this.onChangeTab(tab); }}
          />
          <div className="l-mapview-content">
            {scope === 'baseline' && (<BaselineTab />)}
            {scope === 'future' && (<FutureTab />)}
          </div>
          <Accordion
            className="l-analyzer-accordion"
            opened={analyzerOpen}
            contentPosition="bottom"
            onToggle={(open) => { setAnalyzerOpen(open); }}
            toggleIcon={<Icon name="icon-arrow-up-2" className="accordion-analyzer-btn" />}
          >
            <div className="l-analyzer">
              <Analyzer />
            </div>
          </Accordion>
        </Sidebar>
        <MapComponent />
        <Spinner
          isLoading={loading}
          className="-map"
        />
      </div>
    );
  }
}

MapPage.propTypes = {
  filters: PropTypes.object.isRequired,
  ponderation: PropTypes.object.isRequired,
  analysis: PropTypes.object.isRequired,
  scope: PropTypes.string.isRequired,
  advanced: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  analyzerOpen: PropTypes.bool.isRequired,
  mapState: PropTypes.object.isRequired,
  geostore: PropTypes.any,
  setScope: PropTypes.func.isRequired,
  updateUrl: PropTypes.func.isRequired,
  getLayers: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired,
  setAnalyzerOpen: PropTypes.func.isRequired
};

MapPage.defaultProps = { geostore: null };

export default MapPage;
