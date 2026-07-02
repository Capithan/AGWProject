export function calculateAge(dob: string, today: Date = new Date()): number {
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function isEligible(dob: string, today: Date = new Date()): boolean {
  const age = calculateAge(dob, today);
  return age >= 10 && age < 18;
}

export function getEligibleDobRange(today: Date = new Date()) {
  const earliestDobDate = new Date(today);
  earliestDobDate.setFullYear(earliestDobDate.getFullYear() - 18);

  const latestDobDate = new Date(today);
  latestDobDate.setFullYear(latestDobDate.getFullYear() - 10);

  return {
    from: earliestDobDate.toISOString().split('T')[0],
    to: latestDobDate.toISOString().split('T')[0],
  };
}
