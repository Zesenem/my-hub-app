import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addShoppingListItem } from "../app/features/shoppingList/shoppingListSlice";
import { addRecipe } from "../app/features/recipes/recipesSlice";

const ActionButton = ({ onClick, children, className = "", disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`font-bold py-2 px-4 rounded-lg transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

export default function RecipeSuggestionCard({ recipe }) {
  const dispatch = useDispatch();
  const { items: shoppingListItems } = useSelector((state) => state.shoppingList);
  const { items: savedRecipes } = useSelector((state) => state.recipes);

  const isRecipeSaved = savedRecipes.some(
    (savedRecipe) => savedRecipe.recipeName === recipe.recipeName
  );

  const handleAddMissing = () => {
    const shoppingListNames = shoppingListItems.map((item) => item.name.toLowerCase());
    let itemsAddedCount = 0;

    recipe.ingredients.missing.forEach((missingIngredient) => {
      if (!shoppingListNames.includes(missingIngredient.toLowerCase())) {
        dispatch(addShoppingListItem({ name: missingIngredient }));
        itemsAddedCount++;
      }
    });

    if (itemsAddedCount > 0) {
      toast.success(`${itemsAddedCount} item(s) added to your shopping list!`);
    } else {
      toast.success("All missing ingredients are already on your list!");
    }
  };

  const handleSaveRecipe = () => {
    if (isRecipeSaved) {
      toast.error("This recipe is already in your collection!");
      return;
    }
    dispatch(addRecipe(recipe));
    toast.success(`"${recipe.recipeName}" saved to your collection!`);
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/70 rounded-xl shadow-lg p-5 flex flex-col">
      <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        {recipe.recipeName}
      </h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-grow">
        {recipe.description}
      </p>

      <div className="mb-4">
        <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
          Ingredients You Have:
        </h5>
        <ul className="list-disc list-inside text-sm text-green-700 dark:text-green-400">
          {recipe.ingredients.have.map((ing) => (
            <li key={ing}>{ing}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
          Ingredients You Need:
        </h5>
        <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-400">
          {recipe.ingredients.missing.length > 0 ? (
            recipe.ingredients.missing.map((ing) => <li key={ing}>{ing}</li>)
          ) : (
            <li className="text-gray-500 list-none">None! You have everything.</li>
          )}
        </ul>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        {recipe.ingredients.missing.length > 0 && (
          <ActionButton
            onClick={handleAddMissing}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
          >
            Add Missing to Shopping List
          </ActionButton>
        )}
        <ActionButton
          onClick={handleSaveRecipe}
          disabled={isRecipeSaved}
          className="w-full bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500"
        >
          {isRecipeSaved ? "Recipe Saved" : "Save Recipe"}
        </ActionButton>
      </div>
    </div>
  );
}
