export function formatPrice(amount: number, currency: string = 'XAF'): string {
  return `${amount.toLocaleString('fr-FR')} ${currency}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function calculateNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = end.getTime() - start.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function generateBookingId(): string {
  return `BK-${Date.now().toString(36).toUpperCase()}`;
}
