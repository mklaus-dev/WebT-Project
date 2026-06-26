export const routes = [
  {
    file: '/routes/Wiai-Schlenkerla.geojson' ,
    start: 'Wiai',
    end: 'Schlenkerla' ,
    distance: '1,9 km'
  },
  {
    file: '/routes/Wiai-Gutenbergstrasse.geojson' ,
    start: 'Wiai',
    end: 'Gutenbergstraße' ,
    distance: '5,9 km'
  },
  {
    file: '/routes/Wiai-Feki.geojson' ,
    start: 'Wiai',
    end: 'Feki' ,
    distance: '3,1 km'
  },
  {
    name: 'Alte Testroute (Fallback)',
    coordinates: [
      [49.9032, 10.8691],
      [49.8916, 10.8850]
    ]
  }
];