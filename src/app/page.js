'use client';

import { useState, useEffect } from 'react';
import { Typewriter } from 'react-simple-typewriter';
import ClothingList from './components/ClothingList';
import OutfitSuggestion from './components/OutfitSuggestion';
import { loadClothes, saveClothes, removeClothingByIndex } from './utils/clothes';

// Utility to get clothing description from Gemini
async function getClothingDescription(base64Image) {
  const response = await fetch('/api/clothes/describe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64Image }),
  });
  return JSON.parse(await response.json());
}

// Utility to remove background from image
async function removeBackground(base64Image) {
  const response = await fetch('/api/removebg', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64Image }),
  });
  const data = await response.json();
  return data.image;
}

// Utility to create outfit suggestion
async function createOutfit(items, setting) {
  const response = await fetch('/api/outfits/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, setting }),
  });
  return JSON.parse(await response.json());
}

// Main Home component for Outfitly
export default function Home() {
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [setting, setSetting] = useState('');
  const [outfitResult, setOutfitResult] = useState(null);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Load clothes from localStorage on mount
  useEffect(() => {
    setClothes(loadClothes());
  }, []);

  // Save clothes to localStorage whenever it changes
  useEffect(() => {
    saveClothes(clothes);
  }, [clothes]);

  // Handle photo upload and process with Gemini and background removal
  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setLoading(true);
        try {
          const base64Image = reader.result;
          const desc = await getClothingDescription(base64Image);
          const image = await removeBackground(base64Image);
          setClothes((prev) => [...prev, { image, desc }]);
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file); // Convert image to Base64
    }
  };

  // Handle outfit creation by sending clothes and setting to Gemini
  const handleCreateOutfit = async () => {
    if (!setting.trim() || clothes.length === 0) return;
    setLoading(true);
    try {
      const items = clothes.map((c) => c.desc);
      const result = await createOutfit(items, setting);
      setOutfitResult(result);
    } catch (error) {
      console.error('Error creating outfit:', error);
    } finally {
      setLoading(false);
    }
  };

  // Remove a clothing item by index
  const handleRemoveClothing = (idx) => {
    setClothes((prev) => removeClothingByIndex(prev, idx));
  };

  // Occasions for the typewriter effect
  const occasions = [
    'a casual dinner',
    'a job interview',
    'a summer picnic',
    'a night out',
    'a wedding',
    'a business meeting',
    'a date',
    'a holiday party',
    'a weekend getaway',
    'a music festival',
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Welcome to Outfitly 🪄</h1>
      <p className="text-3xl text-center text-gray-600 mb-8">
        Create an outfit for{' '}
        <span className="font-semibold text-red-600">
          <Typewriter
            words={occasions}
            loop={0}
            cursor
            cursorStyle="|"
            typeSpeed={60}
            deleteSpeed={40}
            delaySpeed={1500}
          />
        </span>
      </p>
      <div className="flex justify-center mb-10">
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="mx-auto block file:rounded-md file:border-none file:text-lg file:cursor-pointer file:mr-4 file:p-4 text-xl py-2 px-4 bg-white text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition mb-10 cursor-pointer hover:bg-blue-50 hover:border-blue-400 hover:shadow-lg file:bg-blue-100 file:text-blue-700 file:font-semibold file:transition file:duration-300 file:ease-in-out"
            />
      </div>
      {loading && <p className="text-center text-lg text-gray-600">Processing...</p>}
      <ClothingList
        clothes={clothes}
        hoveredIdx={hoveredIdx}
        setHoveredIdx={setHoveredIdx}
        handleRemoveClothing={handleRemoveClothing}
      />
      <div className="flex flex-col items-center gap-4 mt-8">
        <input
          type="text"
          value={setting}
          onChange={(e) => setSetting(e.target.value)}
          placeholder="Describe the setting (e.g. 'casual dinner', 'job interview')"
          className="py-2 px-4 border rounded-md w-2/3 text-lg  placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-black"
        />
        <button
          onClick={handleCreateOutfit}
          className="py-3 px-8 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-500 cursor-pointer transition hover:scale-110"
          disabled={loading || !setting.trim() || clothes.length === 0}
        >
          Create Outfit
        </button>
      </div>
      <OutfitSuggestion outfitResult={outfitResult} clothes={clothes} />
    </div>
  );
}
