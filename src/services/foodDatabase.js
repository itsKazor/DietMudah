import foodsData from '../data/foods.json';

// Normalize string for searching: lowercase, remove extra spaces
const normalize = (str) => {
  return str.toLowerCase().trim().replace(/\s+/g, ' ');
};

export const searchFoods = (query) => {
  if (!query || query.trim() === '') return [];
  
  const normalizedQuery = normalize(query);
  const results = [];
  
  for (const food of foodsData) {
    const normalizedName = normalize(food.name);
    
    if (normalizedName === normalizedQuery) {
      // Exact match gets highest priority
      results.unshift(food);
    } else if (normalizedName.includes(normalizedQuery)) {
      results.push(food);
    }
    
    if (results.length >= 10) break;
  }
  
  // Truncate to max 10 results in case unshift made it 11
  return results.slice(0, 10);
};

export const getFoodById = (id) => {
  return foodsData.find(food => food.id === id) || null;
};
