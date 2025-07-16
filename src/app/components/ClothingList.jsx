// ClothingList.js
// Component for displaying a list of clothing items
import ClothingItem from './ClothingItem';

export default function ClothingList({ clothes, hoveredIdx, setHoveredIdx, handleRemoveClothing }) {
  return (
    <div className="flex justify-center flex-wrap gap-6">
      {clothes.map((clothing, index) => (
        <ClothingItem
          key={index}
          clothing={clothing}
          index={index}
          hoveredIdx={hoveredIdx}
          setHoveredIdx={setHoveredIdx}
          handleRemoveClothing={handleRemoveClothing}
        />
      ))}
    </div>
  );
}
