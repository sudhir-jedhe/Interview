export function getEnrollmentMessage(seatsLeft: number): string {
  if (seatsLeft === 0) {
    return "Sold Out";
  }

  if (seatsLeft === 1) {
    return "Only 1 seat left";
  }

  return `${seatsLeft} seats left`;
}

export function getCourseAccessMessage(isPaidUser: boolean): string {
  if (isPaidUser) {
    return "Access Granted";
  }

  return "Payment Required";
}
