// OutfitSuggestion.js
// Component for displaying the suggested outfit and reason
export default function OutfitSuggestion({ outfitResult, clothes }) {
  if (!outfitResult) return null;
  return (
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
  );
}
