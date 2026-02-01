/**
 * Push Notifications System
 */

export const isNotificationsSupported = () => 'Notification' in window && 'serviceWorker' in navigator;

export function showLocalNotification(title: string, options?: NotificationOptions): void {
  if (!isNotificationsSupported() || Notification.permission !== 'granted') return;
  navigator.serviceWorker.ready.then(reg => reg.showNotification(title, options));
}

export function scheduleDailyLearningReminder(time: string = '09:00'): void {
  const [h, m] = time.split(':').map(Number);
  const now = new Date();
  const scheduled = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
  if (scheduled <= now) scheduled.setDate(scheduled.getDate() + 1);
  
  setTimeout(() => {
    showLocalNotification('📚 Time to Learn!', { body: 'Your learning session awaits.', icon: '/icon-192.png', data: { url: '/courses' } });
    scheduleDailyLearningReminder(time);
  }, scheduled.getTime() - now.getTime());
}
