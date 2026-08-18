/**
 * Calendar Integration Helper for Google Calendar Appointment Schedule, iCal, and WhatsApp
 */

// Default Google Appointment Schedule Link (Replace with therapist's actual appointment schedule link)
export const DEFAULT_GOOGLE_SCHEDULE_URL = "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3vW0S1q8p8...";

/**
 * Format Date & Time strings to UTC ISO string required by Google Calendar (YYYYMMDDTHHmmssZ)
 */
function formatGoogleDate(dateStr, timeStr) {
  if (!dateStr || !timeStr) return '';
  const dateObj = new Date(`${dateStr}T${timeStr}:00`);
  if (isNaN(dateObj.getTime())) return '';
  
  const endObj = new Date(dateObj.getTime() + 50 * 60 * 1000); // 50 min session
  
  const toIso = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  return `${toIso(dateObj)}/${toIso(endObj)}`;
}

/**
 * Generates direct pre-filled Google Calendar event URL
 */
export function generateGoogleCalendarUrl(state) {
  const service = state.service || 'Psikolojik Danışmanlık';
  const mode = state.mode === 'online' ? 'Online Terapi (Google Meet)' : 'Kuzguncuk Klinik Yüz Yüze';
  const title = encodeURIComponent(`Rabia Yalçın Yıldırım - ${service} Seansı`);
  
  const dates = formatGoogleDate(state.date, state.time);
  
  const detailsText = `Danışan: ${state.name}\nTelefon: ${state.phone}\nE-Posta: ${state.email}\nSeans Türü: ${mode}\nReferans Kodu: ${state.refCode}\nNot: ${state.note || 'Yok'}`;
  const details = encodeURIComponent(detailsText);
  const location = encodeURIComponent(mode === 'online' ? 'Google Meet Online Görüşme Linki' : 'Kuzguncuk Mahallesi, Üsküdar İstanbul');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

/**
 * Generates and triggers download of .ics file for Apple iCal / Outlook
 */
export function downloadIcsFile(state) {
  const service = state.service || 'Psikolojik Danışmanlık';
  const mode = state.mode === 'online' ? 'Online Terapi' : 'Kuzguncuk Klinik';
  const title = `Rabia Yalçın Yıldırım - ${service} Seansı`;
  
  const dateObj = new Date(`${state.date}T${state.time}:00`);
  const endObj = new Date(dateObj.getTime() + 50 * 60 * 1000);
  
  const toIso = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Rabia Yalcin Yildirim//Psikolojik Danismanlik//TR
BEGIN:VEVENT
UID:ref-${state.refCode}@rabiayalcin.com
DTSTAMP:${toIso(new Date())}
DTSTART:${toIso(dateObj)}
DTEND:${toIso(endObj)}
SUMMARY:${title}
DESCRIPTION:Danisay: ${state.name}\\nTelefon: ${state.phone}\\nRef Kodu: ${state.refCode}
LOCATION:${mode}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `Seans-Randevusu-${state.refCode}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generates pre-filled WhatsApp confirmation URL
 */
export function generateWhatsAppUrl(state) {
  const message = `Merhaba Rabia Hanım, ${state.date} tarihinde saat ${state.time} için randevu oluşturdum. Ref Kodu: ${state.refCode} (${state.name} - ${state.phone})`;
  return `https://wa.me/905395535593?text=${encodeURIComponent(message)}`;
}
