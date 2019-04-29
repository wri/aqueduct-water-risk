export const PRESET_OPTIONS = [
  { label: 'Custom', value: 'custom' },
  { label: 'Default weighting', value: 'DEF' },
  { label: 'Argiculture', value: 'AGR' },
  { label: 'Electric Power', value: 'ELP' },
  { label: 'Semiconductor', value: 'SMC' },
  { label: 'Oil and gas', value: 'ONG' },
  { label: 'Chemical', value: 'CHE' },
  { label: 'Mining', value: 'MIN' },
  { label: 'Food and beverage', value: 'FNB' },
  { label: 'Construction materials', value: 'CON' },
  { label: 'Textile', value: 'TEX' }
];

export const PRESET_VALUES = {
  DEF: {
    bws_cat: '4.0',
    bwd_cat: '4.0',
    iav_cat: '0.5',
    sev_cat: '0.5',
    gtd_cat: '4.0',
    drr_cat: '2.0',
    rfr_cat: '1.0',
    cfr_cat: '1.0',
    ucw_cat: '2.0',
    cep_cat: '1.0',
    udw_cat: '2.0',
    usa_cat: '2.0',
    rri_cat: '0.5'
  },
  AGR: {
    bws_cat: '4.0',
    bwd_cat: '4.0',
    iav_cat: '2.0',
    sev_cat: '0.5',
    gtd_cat: '4.0',
    drr_cat: '4.0',
    rfr_cat: '1.0',
    cfr_cat: '1.0',
    ucw_cat: '1.0',
    cep_cat: '4.0',
    udw_cat: '2.0',
    usa_cat: '2.0',
    rri_cat: '0.25'
  },
  ELP: {
    bws_cat: '4.0',
    bwd_cat: '4.0',
    iav_cat: '1.0',
    sev_cat: '2.0',
    gtd_cat: '0.5',
    drr_cat: '4.0',
    rfr_cat: '2.0',
    cfr_cat: '4.0',
    ucw_cat: '0.25',
    cep_cat: '1.0',
    udw_cat: '0.25',
    usa_cat: '0.25',
    rri_cat: '0.25'
  },
  SMC: {
    bws_cat: '2.0',
    bwd_cat: '2.0',
    iav_cat: '1.0',
    sev_cat: '1.0',
    gtd_cat: '2.0',
    drr_cat: '1.0',
    rfr_cat: '1.0',
    cfr_cat: '1.0',
    ucw_cat: '4.0',
    cep_cat: '2.0',
    udw_cat: '1.0',
    usa_cat: '1.0',
    rri_cat: '2.0'
  },
  ONG: {
    bws_cat: '1.0',
    bwd_cat: '1.0',
    iav_cat: '0.5',
    sev_cat: '0.5',
    gtd_cat: '1.0',
    drr_cat: '0.5',
    rfr_cat: '1.0',
    cfr_cat: '4.0',
    ucw_cat: '4.0',
    cep_cat: 'null',
    udw_cat: '4.0',
    usa_cat: '4.0',
    rri_cat: '4.0'
  },
  CHE: {
    bws_cat: '2.0',
    bwd_cat: '2.0',
    iav_cat: '1.0',
    sev_cat: '1.0',
    gtd_cat: '2.0',
    drr_cat: '2.0',
    rfr_cat: '4.0',
    cfr_cat: '4.0',
    ucw_cat: '2.0',
    cep_cat: '0.25',
    udw_cat: '2.0',
    usa_cat: '2.0',
    rri_cat: '2.0'
  },
  MIN: {
    bws_cat: '2.0',
    bwd_cat: '2.0',
    iav_cat: '1.0',
    sev_cat: '1.0',
    gtd_cat: '2.0',
    drr_cat: '4.0',
    rfr_cat: '4.0',
    cfr_cat: '4.0',
    ucw_cat: '4.0',
    cep_cat: '0.25',
    udw_cat: '4.0',
    usa_cat: '4.0',
    rri_cat: '4.0'
  },
  FNB: {
    bws_cat: '4.0',
    bwd_cat: '4.0',
    iav_cat: '1.0',
    sev_cat: '0.5',
    gtd_cat: '4.0',
    drr_cat: '2.0',
    rfr_cat: '0.5',
    cfr_cat: '0.5',
    ucw_cat: '1.0',
    cep_cat: '2.0',
    udw_cat: '1.0',
    usa_cat: '1.0',
    rri_cat: '2.0'
  },
  CON: {
    bws_cat: '2.0',
    bwd_cat: '2.0',
    iav_cat: '0.5',
    sev_cat: '0.5',
    gtd_cat: '2.0',
    drr_cat: '1.0',
    rfr_cat: '1.0',
    cfr_cat: '1.0',
    ucw_cat: '1.0',
    cep_cat: '0.5',
    udw_cat: '1.0',
    usa_cat: '1.0',
    rri_cat: '0.5'
  },
  TEX: {
    bws_cat: '2.0',
    bwd_cat: '2.0',
    iav_cat: '1.0',
    sev_cat: '0.5',
    gtd_cat: '2.0',
    drr_cat: '1.0',
    rfr_cat: '1.0',
    cfr_cat: '2.0',
    ucw_cat: '2.0',
    cep_cat: '1.0',
    udw_cat: '2.0',
    usa_cat: '2.0',
    rri_cat: '4.0'
  },
  custom: {
    bws_cat: '1.0',
    bwd_cat: '1.0',
    gtd_cat: '1.0',
    iav_cat: '1.0',
    sev_cat: '1.0',
    drr_cat: '1.0',
    rfr_cat: '1.0',
    cfr_cat: '1.0',
    ucw_cat: '1.0',
    cep_cat: '1.0',
    udw_cat: '1.0',
    usa_cat: '1.0',
    rri_cat: '1.0'
  }
};

export const PRESET_POINTS = [
  { label: '', value: '0.25' },
  { label: '', value: '0.5' },
  { label: '', value: '1.0' },
  { label: '', value: '2.0' },
  { label: '', value: '4.0' }
];

export default {
  PRESET_OPTIONS,
  PRESET_VALUES,
  PRESET_POINTS
};
