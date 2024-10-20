import { formatDate } from 'utils/dates';
import { deburrUpper } from 'utils/data';
import moment from 'moment';
import isNil from 'lodash/isNil';

// utils
import { INDICATOR_SCHEME_ORDER, INDICATOR_THRESHOLD_TRANSFORMERS } from 'constants/indicators';
import { LEGENDS } from 'components/map/constants';


const getAnnualParametrization = ({ indicator }) => ({
  indicator,
  label: indicator.replace('cat', 'label')
});

const getMonthlyParametrization = ({ indicator, month }) => ({
  indicator,
  month,
  label: indicator.replace('cat', 'label')
});

const getProjectedParametrization = ({ year, scenario }) => ({
  year,
  scenario
});

const getCustomPonderationParametrization = customPonderation => (
  { custom_weights: `'[${INDICATOR_SCHEME_ORDER.map(_key => customPonderation[_key])}]'` }
);

const getDefaultPonderationParametrization = ({ indicator }, customPonderation) => (
  {
    indicator: indicator.replace('def', customPonderation),
    label: indicator.replace('def', customPonderation).replace('cat', 'label'),
    fraction: indicator.replace('def', customPonderation).replace('cat', 'weight_fraction')
  }
);

const getBasinParametrization = ({ indicator, threshold }) => {
  const transformer = INDICATOR_THRESHOLD_TRANSFORMERS[indicator];
  return ({
    indicator,
    label: indicator.replace('cat', 'label'),
    value: indicator.replace('cat', 'raw'),
    threshold: transformer ? transformer(threshold) : threshold
  });
};

export const getLayerParametrization = (parametrization, ponderation, scope) => {
  const { year, timeScale } = parametrization;
  const {
    scheme: ponderationScheme,
    custom: customPonderation
  } = ponderation;
  let params = {};

  switch (true) {
    // prioritize basins
    case (scope === 'basins'):
      params = getBasinParametrization(parametrization);
      break;
    // future layers
    case (year !== 'baseline'):
      params = getProjectedParametrization(parametrization);
      break;
    // monthly
    case (timeScale === 'monthly' && year === 'baseline'):
      params = getMonthlyParametrization(parametrization);
      break;
     // predefined ponderation
    case (ponderationScheme !== 'custom'):
      params = getDefaultPonderationParametrization(parametrization, ponderationScheme);
      break;
    // annual
    case (timeScale === 'annual' && year === 'baseline' && ponderationScheme !== 'custom'):
      params = getAnnualParametrization(parametrization);
      break;
    // custom ponderation
    case (ponderationScheme === 'custom'):
      params = getCustomPonderationParametrization(customPonderation);
      break;
    default:
      return params;
  }

  return params;
};

export const reduceParams = (params) => {
  if (!params) return null;
  return params.reduce((obj, param) => {
    const { format, key, interval, count } = param;
    let paramValue = param.default;
    const isDate = deburrUpper(param.key).includes('DATE');
    if (isDate && !paramValue) {
      let date = formatDate(new Date());
      if (interval && count) date = moment(date).subtract(count, interval);
      paramValue = moment(date).format(format || 'YYYY-MM-DD');
    }

    const newObj = {
      ...obj,
      [key]: paramValue,
      ...(key === 'endDate' &&
        param.url && { latestUrl: param.url })
    };
    return newObj;
  }, {});
};

export const reduceSqlParams = (params) => {
  if (!params) return null;
  return params.reduce((obj, param) => {
    const newObj = {
      ...obj,
      [param.key]: param.key_params.reduce((subObj, item) => {
        const keyValues = {
          ...subObj,
          [item.key]: item.value
        };
        return keyValues;
      }, {})
    };
    return newObj;
  }, {});
};

export const getMarker = () => {};

export const getLayerLegend = (indicator) => {
  const isParent = [
    'w_awr_def_tot_cat',
    'w_awr_def_qan_cat',
    'w_awr_def_qal_cat',
    'w_awr_def_rrr_cat',
    'drr_cat'
  ].includes(indicator);
  let legend = LEGENDS.common;

  switch (true) {
    case !!LEGENDS[indicator]:
      legend = LEGENDS[indicator];
      break;
    case isParent:
      legend = LEGENDS.parent;
      break;
    default:
      legend = LEGENDS.common;
  }

  return legend;
};

export const normalizeLng = (lng) => {
  if (lng === 0) return 0;
  if (lng < -180) return (lng % 180) + 180;
  if (lng > 180) return (lng % 180) - 180;
  return lng;
};

export default {
  reduceParams,
  reduceSqlParams,
  getLayerParametrization,
  getMarker,
  getLayerLegend
};
