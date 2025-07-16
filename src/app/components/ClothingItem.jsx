// ClothingItem.js
// Component for displaying a single clothing item with remove button on hover

export default function ClothingItem({ clothing, index, hoveredIdx, setHoveredIdx, handleRemoveClothing }) {
  return (
    <div
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
  );
}
