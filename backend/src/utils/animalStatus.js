const CARE_STATUS_TO_HEALTH_STATUS = {
  HEALTHY: 'Healthy',
  OBSERVATION: 'Observation',
  MONITORING: 'Observation',
  TREATMENT: 'Under Treatment',
  UNDER_TREATMENT: 'Under Treatment',
  SICK: 'Sick',
  QUARANTINE: 'Quarantine',
  RECOVERED: 'Recovered',
};

const HEALTH_STATUS_TO_CARE_STATUS = {
  Healthy: 'HEALTHY',
  Observation: 'OBSERVATION',
  Sick: 'OBSERVATION',
  'Under Treatment': 'TREATMENT',
  Quarantine: 'OBSERVATION',
  Recovered: 'HEALTHY',
};

const GENDER_ALIASES = {
  MALE: 'Male',
  FEMALE: 'Female',
  UNKNOWN: 'Unknown',
};

const OPERATIONAL_STATUS_ALIASES = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  TRANSFERRED: 'Transferred',
};

const normalizeKey = (value) => String(value || '').trim().toUpperCase().replace(/[\s-]+/g, '_');

const careStatusToHealthStatus = (status) => {
  if (!status) return null;
  return CARE_STATUS_TO_HEALTH_STATUS[normalizeKey(status)] || null;
};

const healthStatusToCareStatus = (healthStatus) => {
  return HEALTH_STATUS_TO_CARE_STATUS[healthStatus] || 'HEALTHY';
};

const normalizeGender = (gender) => {
  if (!gender) return 'Unknown';
  return GENDER_ALIASES[normalizeKey(gender)] || gender;
};

const normalizeOperationalStatus = (status) => {
  if (!status) return 'Active';
  return OPERATIONAL_STATUS_ALIASES[normalizeKey(status)] || status;
};

module.exports = {
  careStatusToHealthStatus,
  healthStatusToCareStatus,
  normalizeGender,
  normalizeOperationalStatus,
};
