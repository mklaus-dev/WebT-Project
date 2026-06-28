import { json } from '@sveltejs/kit';

export async function GET() {
  try {
    // Holt Höchsttemperatur UND Regenwahrscheinlichkeit für die nächsten 7 Tage
    const response = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=49.8916&longitude=10.8850&daily=temperature_2m_max,precipitation_probability_max&timezone=Europe%2FBerlin'
    );
    
    if (!response.ok) throw new Error('Wetter-API Fehler');
    
    const data = await response.json();
    const weekdayNames = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    
    // 1. Die Wochen-Vorhersage wie gehabt aufbereiten
    const forecast = data.daily.time.map((dateStr, index) => {
      const date = new Date(dateStr);
      const dayName = weekdayNames[date.getDay()];
      const temp = Math.round(data.daily.temperature_2m_max[index]);
      
      return {
        day: index === 0 ? 'Heute' : dayName,
        date: date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }),
        temp: `${temp}°C`,
        isCurrent: index === 0
      };
    });

    // 2. BACKEND-LOGIK FÜR DIE WANDER-AMPEL (Index 0 = Heute)
    const todayTemp = Math.round(data.daily.temperature_2m_max[0]);
    const todayRainProb = data.daily.precipitation_probability_max[0];

    let verdictText = 'Heute ist ein guter Tag zum Wandern!';
    let status = 'good'; // Kann 'good' (grün), 'bad' (rot) oder 'maybe' (gelb) sein

    // 1. Priorität: Rot-Kriterien (K.-o.-Kriterien)
    if (todayTemp > 35 || todayRainProb > 75) {
      verdictText = 'Heute ist kein guter Tag zum Wandern!';
      status = 'bad';
    } 
    // 2. Priorität: Gelb-Kriterium (Grauzone)
    else if (todayTemp > 30 && todayRainProb > 50) {
      verdictText = 'Heute ist vielleicht ein guter Tag zum Wandern.';
      status = 'maybe';
    }

    return json({
      success: true,
      city: 'Bamberg',
      forecast: forecast,
      summary: {
        verdictText: verdictText,
        status: status // Schickt 'good', 'bad' oder 'maybe' an das Frontend
      }
    });
    
  } catch (error) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
}