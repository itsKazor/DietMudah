export const calcBMR = ({ gender, weight, height, age }) => {
  // Laki-laki: (10 × weight) + (6.25 × height) − (5 × age) + 5
  // Perempuan: (10 × weight) + (6.25 × height) − (5 × age) − 161
  if (gender === 'male') {
    return (10 * weight) + (6.25 * height) - (5 * age) + 5;
  }
  return (10 * weight) + (6.25 * height) - (5 * age) - 161;
};

export const calcTDEE = (bmr, activityLevel) => {
  const multipliers = {
    sedentary: 1.2,      // kerja kantoran, jarang olahraga
    light: 1.375,        // olahraga ringan 1–3x/minggu
    moderate: 1.55,      // olahraga sedang 3–5x/minggu
    active: 1.725,       // olahraga berat 6–7x/minggu
    very_active: 1.9,    // atlet / kerja fisik berat
  };
  return bmr * (multipliers[activityLevel] || 1.2);
};

export const calcTargets = (tdee, goal) => {
  let calories = tdee;
  if (goal === 'deficit') calories -= 500;
  if (goal === 'surplus') calories += 300;
  
  // Protein 25%, Karbo 50%, Lemak 25%
  const protein = (calories * 0.25) / 4;
  const carbs = (calories * 0.50) / 4;
  const fat = (calories * 0.25) / 9;
  
  return {
    calories: Math.round(calories),
    protein: Number(protein.toFixed(1)),
    carbs: Number(carbs.toFixed(1)),
    fat: Number(fat.toFixed(1))
  };
};
