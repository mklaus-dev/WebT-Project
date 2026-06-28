import { json } from '@sveltejs/kit';

export async function GET() {
  try {
    // Holt die 7-Tage-Vorhersage für Bamberg
    const response = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=49.8916&longitude=10.8850&daily=temperature_2m_max&timezone=Europe%2FBerlin'
    );
    
    if (!response.ok) throw new Error('Wetter-API Fehler');
    
    const data = await response.json();
    
    // Wochentage für die schöne Darstellung
    const weekdayNames = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    
    // Wir mappen die API-Daten in ein sauberes Array für unser Frontend
    const forecast = data.daily.time.map((dateStr, index) => {
      const date = new Date(dateStr);
      const dayName = weekdayNames[date.getDay()];
      const temp = Math.round(data.daily.temperature_2m_max[index]);
      
      return {
        day: index === 0 ? 'Heute' : dayName, // Der erste Tag ist "Heute"
        date: date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }),
        temp: `${temp}°C`,
        isCurrent: index === 0 // Flag für die farbliche Markierung im Frontend
      };
    });
    
    return json({
      success: true,
      city: 'Bamberg',
      forecast: forecast
    });
    
  } catch (error) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
}