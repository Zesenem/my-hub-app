import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  convert,
  setCategory,
  setFromUnit,
  setToUnit,
  setInputValue,
  swapUnits,
  CONVERTER_CATEGORIES,
} from "../../app/features/converter/converterSlice";

const CategoryButtons = ({ categories, selectedCategory, onSelectCategory }) => (
  <div className="flex flex-wrap gap-2">
    {categories.map((cat) => (
      <button
        key={cat}
        onClick={() => onSelectCategory(cat)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ease-in-out
          ${
            selectedCategory === cat
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
          }`}
      >
        {cat.charAt(0).toUpperCase() + cat.slice(1)}
      </button>
    ))}
  </div>
);

const UnitButtons = ({ units, selectedUnit, onUnitChange }) => (
  <div className="flex flex-wrap gap-1 mt-2 justify-center sm:justify-start">
    {units.map((unit) => (
      <button
        key={unit}
        onClick={() => onUnitChange(unit)}
        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors duration-200 ease-in-out
          ${
            selectedUnit === unit
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200"
          }`}
      >
        {unit}
      </button>
    ))}
  </div>
);

const ConversionField = ({
  value,
  onValueChange,
  units,
  selectedUnit,
  onUnitChange,
  isInput = false,
}) => (
  <div>
    <input
      type="text"
      value={value}
      onChange={onValueChange}
      placeholder="0"
      readOnly={!isInput}
      className={`w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition
        ${
          isInput
            ? "bg-white dark:bg-gray-700"
            : "bg-gray-100 dark:bg-gray-800/70 font-bold truncate"
        }
      `}
    />
    <UnitButtons units={units} selectedUnit={selectedUnit} onUnitChange={onUnitChange} />
  </div>
);

export default function ConverterWidget() {
  const dispatch = useDispatch();
  const { category, fromUnit, toUnit, inputValue, outputValue } = useSelector(
    (state) => state.converter
  );
  const currentUnits = CONVERTER_CATEGORIES[category];

  useEffect(() => {
    dispatch(convert());
  }, [inputValue, fromUnit, toUnit, category, dispatch]);

  const handleInputChange = (e) => {
    if (/^[0-9]*\.?[0-9]*$/.test(e.target.value)) {
      dispatch(setInputValue(e.target.value));
    }
  };

  const handleCategorySelect = (selectedCat) => {
    dispatch(setCategory(selectedCat));
    const newUnits = CONVERTER_CATEGORIES[selectedCat];
    if (newUnits && newUnits.length > 0) {
      dispatch(setFromUnit(newUnits[0]));
      if (newUnits.length > 1) {
        dispatch(setToUnit(newUnits[1]));
      } else {
        dispatch(setToUnit(newUnits[0]));
      }
    }
  };

  const handleFromUnitChange = (unit) => {
    dispatch(setFromUnit(unit));
  };

  const handleToUnitChange = (unit) => {
    dispatch(setToUnit(unit));
  };

  return (
    <div className="space-y-6 p-4 rounded-lg shadow-md bg-white dark:bg-gray-700/50">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Category
        </label>
        <CategoryButtons
          categories={Object.keys(CONVERTER_CATEGORIES)}
          selectedCategory={category}
          onSelectCategory={handleCategorySelect}
        />
      </div>

      <div className="relative mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            From
          </label>
          <ConversionField
            isInput={true}
            value={inputValue}
            onValueChange={handleInputChange}
            units={currentUnits}
            selectedUnit={fromUnit}
            onUnitChange={handleFromUnitChange}
          />
        </div>

        <div className="flex justify-center my-4">
          <button
            onClick={() => dispatch(swapUnits())}
            className="p-2 rounded-full bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-600 ring-2 ring-gray-300 dark:ring-gray-600 transition-all transform hover:rotate-180 duration-300"
            title="Swap units"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            To
          </label>
          <ConversionField
            isInput={false}
            value={outputValue}
            onValueChange={() => {}}
            units={currentUnits}
            selectedUnit={toUnit}
            onUnitChange={handleToUnitChange}
          />
        </div>
      </div>
    </div>
  );
}
