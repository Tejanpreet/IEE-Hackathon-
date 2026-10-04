// Google Maps base styles per theme (legacy `styles`, no Map ID needed).
// Matches the map/* tokens in the Figma file. Keep POIs hidden so our data stands out.
type Style = google.maps.MapTypeStyle[];

const common: Style = [
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.park', stylers: [{ visibility: 'on' }] },
  { featureType: 'poi.park', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit.station', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'simplified' }] },
];

export const darkMapStyle: Style = [
  { elementType: 'geometry', stylers: [{ color: '#0F1A2A' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94A3B8' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0B1220' }, { weight: 3 }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#334155' }] },
  { featureType: 'administrative.province', elementType: 'geometry.stroke', stylers: [{ color: '#475569' }, { weight: 1.5 }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#E2E8F0' }] },
  { featureType: 'landscape.natural.terrain', elementType: 'geometry', stylers: [{ color: '#132235' }] },
  { featureType: 'landscape.natural.landcover', elementType: 'geometry', stylers: [{ color: '#112033' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#10261F' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1E2C42' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#0B1220' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3A4C66' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#0B1220' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#CBD5E1' }] },
  { featureType: 'road.local', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#4A5B73' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#123552' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#5B7A99' }] },
  ...common,
];

export const lightMapStyle: Style = [
  { elementType: 'geometry', stylers: [{ color: '#F1F3EE' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#475569' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#FFFFFF' }, { weight: 3 }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#CBD5E1' }] },
  { featureType: 'administrative.province', elementType: 'geometry.stroke', stylers: [{ color: '#94A3B8' }, { weight: 1.5 }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#1E293B' }] },
  { featureType: 'landscape.natural.terrain', elementType: 'geometry', stylers: [{ color: '#E6EBE1' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#D7EAD3' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#FFFFFF' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#D4DBE3' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#F6CF7A' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#E0B55A' }] },
  { featureType: 'road.local', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#9AA6B5' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#AFD3EC' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#4A7AA0' }] },
  ...common,
];
