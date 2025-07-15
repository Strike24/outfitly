'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [setting, setSetting] = useState('');
  const [outfitResult, setOutfitResult] = useState(null);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Load clothes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('clothes');
    if (saved) setClothes(JSON.parse(saved));
  }, []);

  // Save clothes to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('clothes', JSON.stringify(clothes));
  }, [clothes]);

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setLoading(true);
        try {
          const base64Image = reader.result;

          // Get description from Gemini
          const descriptionResponse = await fetch('/api/clothes/describe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: base64Image }),
          });
          const descriptionData = await descriptionResponse.json();

          // Remove background
          const removeBgResponse = await fetch('/api/removebg', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: base64Image }),
          });
          const removeBgData = await removeBgResponse.json();

          const newClothes = [...clothes];
          newClothes.push({
            image: removeBgData.image, // Image with background removed
            desc: JSON.parse(descriptionData), // Description from Gemini
          });
          setClothes(newClothes);
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file); // Convert image to Base64
    }
  };

  const handleCreateOutfit = async () => {
    if (!setting.trim() || clothes.length === 0) return;
    setLoading(true);
    try {
      const items = clothes.map((c) => c.desc);
      const response = await fetch('/api/outfits/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, setting }),
      });
      const data = await response.json();
      setOutfitResult(JSON.parse(data));
    } catch (error) {
      console.error('Error creating outfit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveClothing = (idx) => {
    const newClothes = clothes.filter((_, i) => i !== idx);
    setClothes(newClothes);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Welcome to Outfitly</h1>
      <p className="text-lg text-center text-gray-600 mb-8">Upload your clothes and create outfits.</p>

      <div className="flex justify-center gap-8 mb-8">
        <div>
          <div className='flex justify-center mb-4'>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="mx-auto block file:rounded-md file:border-none file:text-lg file:cursor-pointer file:mr-4 file:p-4 text-xl py-2 px-4 bg-white text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition mb-10 cursor-pointer hover:bg-blue-50 hover:border-blue-400 hover:shadow-lg file:bg-blue-100 file:text-blue-700 file:font-semibold file:transition file:duration-300 file:ease-in-out"
            />
          </div>
          {loading && <p className="text-center text-lg text-gray-600">Processing...</p>}
          <div className="flex justify-center flex-wrap gap-6">
            {clothes.map((clothing, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 relative group"
                onMouseEnter={() => setHoveredIdx(index)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <img
                  src={clothing.image}
                  alt={`clothing-${index}`}
                  className="w-36 h-36 object-cover rounded-lg border-2 border-gray-300 shadow-lg"
                />
                {hoveredIdx === index && (
                  <button
                    onClick={() => handleRemoveClothing(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg z-10 hover:bg-red-600 transition"
                    title="Remove"
                  >
                    &times;
                  </button>
                )}
                <div className="flex flex-col items-center gap-2">
                  <p className="text-center text-lg pt-2 text-gray-600">{clothing.desc.description}</p>
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-0.5 rounded-full">
                    {clothing.desc.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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

      {outfitResult && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Outfit Suggestion</h2>
          <p className="text-center text-lg text-gray-600 mb-2">{outfitResult.reason}</p>
          <div className="flex justify-center flex-wrap gap-6 mt-4">
            {outfitResult.selected.map((idx) => {
              const clothing = clothes[idx];
              return clothing ? (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <img
                    src={clothing.image}
                    alt={`outfit-item-${idx}`}
                    className="w-36 h-36 object-cover rounded-lg border-2 border-blue-400 shadow-lg"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-center text-lg pt-2 text-gray-600">{clothing.desc.description}</p>
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-0.5 rounded-full">
                      {clothing.desc.type}
                    </span>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
