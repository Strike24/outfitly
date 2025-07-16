// utils/clothes.js
// Utility functions for clothes management

/**
 * Load clothes from localStorage
 * @returns {Array}
 */
export function loadClothes() {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('clothes');
  return saved ? JSON.parse(saved) : [];
}

/**
 * Save clothes to localStorage
 * @param {Array} clothes
 */
export function saveClothes(clothes) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('clothes', JSON.stringify(clothes));
}

/**
 * Remove a clothing item by index
 * @param {Array} clothes
 * @param {number} idx
 * @returns {Array}
 */
export function removeClothingByIndex(clothes, idx) {
  return clothes.filter((_, i) => i !== idx);
}
