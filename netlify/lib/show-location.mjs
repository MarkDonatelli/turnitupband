const STATES = new Map([
  ['Alabama', 'AL'], ['Alaska', 'AK'], ['Arizona', 'AZ'], ['Arkansas', 'AR'],
  ['California', 'CA'], ['Colorado', 'CO'], ['Connecticut', 'CT'], ['Delaware', 'DE'],
  ['District of Columbia', 'DC'], ['Florida', 'FL'], ['Georgia', 'GA'], ['Hawaii', 'HI'],
  ['Idaho', 'ID'], ['Illinois', 'IL'], ['Indiana', 'IN'], ['Iowa', 'IA'], ['Kansas', 'KS'],
  ['Kentucky', 'KY'], ['Louisiana', 'LA'], ['Maine', 'ME'], ['Maryland', 'MD'],
  ['Massachusetts', 'MA'], ['Michigan', 'MI'], ['Minnesota', 'MN'], ['Mississippi', 'MS'],
  ['Missouri', 'MO'], ['Montana', 'MT'], ['Nebraska', 'NE'], ['Nevada', 'NV'],
  ['New Hampshire', 'NH'], ['New Jersey', 'NJ'], ['New Mexico', 'NM'], ['New York', 'NY'],
  ['North Carolina', 'NC'], ['North Dakota', 'ND'], ['Ohio', 'OH'], ['Oklahoma', 'OK'],
  ['Oregon', 'OR'], ['Pennsylvania', 'PA'], ['Rhode Island', 'RI'], ['South Carolina', 'SC'],
  ['South Dakota', 'SD'], ['Tennessee', 'TN'], ['Texas', 'TX'], ['Utah', 'UT'],
  ['Vermont', 'VT'], ['Virginia', 'VA'], ['Washington', 'WA'], ['West Virginia', 'WV'],
  ['Wisconsin', 'WI'], ['Wyoming', 'WY']
].flatMap(([name, code]) => [[name.toLowerCase(), code], [code.toLowerCase(), code]]));
const REGION = [...STATES.keys()].sort((a, b) => b.length - a.length).join('|');
const REGION_ONLY = new RegExp(`^(${REGION})(?:\\s+\\d{5}(?:-\\d{4})?)?$`, 'i');
const CITY_REGION = new RegExp(`^(.+?)\\s+(${REGION})(?:\\s+\\d{5}(?:-\\d{4})?)?$`, 'i');
const isStreet = value => /^\d+\s|^P\.?O\.?\s+Box\b/i.test(value)
  || /\b(?:street|st|road|rd|avenue|ave|boulevard|blvd|drive|dr|lane|ln|highway|hwy|route|rte|way)\.?$/i.test(value);
const isCity = value => /^[\p{L}][\p{L}\p{M} .'-]*$/u.test(value) && !isStreet(value);

// Google supplies free-form text, not structured address components. Extract
// only recognized US city/state formats; do not invent a city from a street.
export function extractCityState(value) {
  if (typeof value !== 'string' || !value.trim()) return '';
  const parts = value.split(/[,\n]+/).map(part => part.replace(/\s+/g, ' ').trim()).filter(Boolean);
  while (parts.length && /^(?:USA|US|U\.?S\.?A?\.?|United States(?: of America)?|\d{5}(?:-\d{4})?)$/i.test(parts.at(-1))) parts.pop();
  if (!parts.length) return '';
  const last = parts.at(-1);
  const region = last.match(REGION_ONLY);
  const combined = !region && last.match(CITY_REGION);
  const cityIndex = region ? parts.length - 2 : combined ? parts.length - 1 : -1;
  const city = region ? parts[cityIndex] : combined?.[1];
  const state = STATES.get((region?.[1] || combined?.[2] || '').toLowerCase());
  return city && state && isCity(city) ? `${city}, ${state}` : '';
}
