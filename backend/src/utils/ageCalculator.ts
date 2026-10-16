export const calculateAge = (birthDateString: string | Date): number => {
  if (!birthDateString) return 0;
  const birthDate = new Date(birthDateString);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return Math.max(0, age);
};

export const calculateAgeFromDOB = (dob: string): { years: number; displayText: string } => {
  const age = calculateAge(dob);
  return {
    years: age,
    displayText: `${age} Years (${age} વર્ષ)`,
  };
};
