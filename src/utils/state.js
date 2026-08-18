export const bookingState = {
  service: 'Bireysel Danışmanlık',
  format: 'Online Görüşme',
  date: '',
  time: '10:00',
  fullName: '',
  phone: '',
  email: '',
  note: ''
};

export function generateRefCode() {
  return 'RYY-' + Math.floor(10000 + Math.random() * 90000);
}
