import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";

import {
  fetchPantryItems,
  addPantryItem,
  deletePantryItem,
  updatePantryItem,
} from "../../app/features/pantry/pantrySlice";
import {
  fetchShoppingListItems,
  addShoppingListItem,
  deleteShoppingListItem,
} from "../../app/features/shoppingList/shoppingListSlice";
import { fetchRecipes, deleteRecipe } from "../../app/features/recipes/recipesSlice";

import Spinner from "../Spinner";
import RecipeSuggestionCard from "../RecipeSuggestionCard";
import { mockRecipes } from "../../mock/mockRecipeData.js";

const ActionButton = ({ onClick, children, className = "", type = "button", disabled = false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`font-bold py-2.5 px-5 rounded-lg transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

const FormInput = (props) => (
  <input
    {...props}
    className={`w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
      props.className || ""
    }`}
  />
);

const ModalWrapper = ({ children, onClose }) => (
  <>
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 animate-fade-in-fast"
      onClick={onClose}
    />
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6 z-50 w-full animate-slide-up-fast">
      {children}
    </div>
  </>
);

const DeleteConfirmationModal = ({ item, onClose, onConfirm }) => (
  <ModalWrapper onClose={onClose}>
    <div className="text-center max-w-md mx-auto">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">Confirm Deletion</h2>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        Delete <span className="font-semibold">{item.name}</span>? You can also add it to your
        shopping list.
      </p>
      <div className="flex justify-center gap-4">
        <ActionButton
          onClick={() => onConfirm(false)}
          className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500"
        >
          Just Delete
        </ActionButton>
        <ActionButton
          onClick={() => onConfirm(true)}
          className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
        >
          Yes, Add to List
        </ActionButton>
      </div>
    </div>
  </ModalWrapper>
);

const EditItemModal = ({ item, onClose, onSave }) => {
  const [name, setName] = useState(item.name);
  const [quantity, setQuantity] = useState(item.quantity);
  const [expiryDate, setExpiryDate] = useState(item.expiryDate);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: item.id, updatedData: { name, quantity, expiryDate } });
  };

  return (
    <ModalWrapper onClose={onClose}>
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-5 text-gray-800 dark:text-gray-100">
          Edit Pantry Item
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Item Name
            </label>
            <FormInput
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quantity
            </label>
            <FormInput
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Expiry Date
            </label>
            <FormInput
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <ActionButton
              onClick={onClose}
              className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500"
            >
              Cancel
            </ActionButton>
            <ActionButton
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
            >
              Save Changes
            </ActionButton>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

const RecipeDetailModal = ({ recipe, onClose, onDelete }) => (
  <ModalWrapper onClose={onClose}>
    <div className="w-full max-w-8xl">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {recipe.recipeName}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{recipe.description}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Ingredients You Have:
          </h3>
          <ul className="list-disc list-inside text-sm text-green-700 dark:text-green-400 space-y-1">
            {recipe.ingredients.have.map((ing) => (
              <li key={ing}>{ing}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Ingredients You Need:
          </h3>
          <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-400 space-y-1">
            {recipe.ingredients.missing.length > 0 ? (
              recipe.ingredients.missing.map((ing) => <li key={ing}>{ing}</li>)
            ) : (
              <li className="text-gray-500 list-none">None!</li>
            )}
          </ul>
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Instructions:</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
          {recipe.instructions}
        </p>
      </div>
      {recipe.id && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <ActionButton
            onClick={() => onDelete(recipe.id)}
            className="w-full bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
          >
            Delete Recipe from Collection
          </ActionButton>
        </div>
      )}
    </div>
  </ModalWrapper>
);

const PantryForm = ({ onAddItem }) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddItem({ name, quantity, expiryDate });
    setName("");
    setQuantity("");
    setExpiryDate("");
  };

  return (
    <div className="bg-gray-100/80 dark:bg-gray-900/50 p-4 rounded-xl">
      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">Add to Pantry</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <FormInput
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item Name"
          required
        />
        <div className="flex gap-3">
          <FormInput
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity (e.g., 1kg)"
            required
          />
          <FormInput
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
          />
        </div>
        <ActionButton
          type="submit"
          className="w-full bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
        >
          Add Item
        </ActionButton>
      </form>
    </div>
  );
};

const PantryItem = ({ item, onEdit, onDelete }) => {
  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return "safe";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);
    if (expiry < today) return "expired";
    if (expiry <= sevenDaysFromNow) return "expiring_soon";
    return "safe";
  };

  const statusColors = {
    expired: "bg-red-100/80 dark:bg-red-900/50 border-l-4 border-red-500",
    expiring_soon: "bg-yellow-100/80 dark:bg-yellow-800/50 border-l-4 border-yellow-500",
    safe: "bg-white/80 dark:bg-gray-800/70",
  };
  const status = getExpiryStatus(item.expiryDate);

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg shadow-sm transition-colors ${statusColors[status]}`}
    >
      <div>
        <p className="font-bold text-gray-900 dark:text-gray-100">{item.name}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {item.quantity} - Expires: {item.expiryDate}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(item)}
          className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-full transition-colors"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
            <path
              fillRule="evenodd"
              d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button
          onClick={() => onDelete(item)}
          className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-full transition-colors"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

const EmptyState = ({ message }) => (
  <div className="text-center py-10 px-4 bg-gray-100/80 dark:bg-gray-800/50 rounded-xl">
    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{message}</p>
  </div>
);

const ShoppingList = ({ items, onAddItem, onRemoveItem, status }) => {
  const [newItem, setNewItem] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newItem.trim()) {
      onAddItem({ name: newItem });
      setNewItem("");
    }
  };

  const handleCopyList = () => {
    if (items.length === 0) {
      toast.error("Shopping list is empty!");
      return;
    }
    const listAsString = items.map((item) => `• ${item.name}`).join("\n");
    navigator.clipboard.writeText(listAsString);
    toast.success("List copied to clipboard!");
  };

  return (
    <div className="bg-gray-100/80 dark:bg-gray-900/50 p-4 rounded-xl flex flex-col h-full">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Shopping List</h3>
        <button
          onClick={handleCopyList}
          disabled={items.length === 0}
          className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
          </svg>
        </button>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
        <FormInput
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add to list..."
        />
        <button
          type="submit"
          className="bg-green-600 text-white font-bold px-4 rounded-lg hover:bg-green-700 transition-transform hover:scale-105"
        >
          +
        </button>
      </form>
      <div className="space-y-2 flex-grow overflow-y-auto pr-1">
        {status === "loading" ? (
          <Spinner />
        ) : items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white/80 dark:bg-gray-800/80 p-2.5 rounded-lg shadow-sm"
            >
              <span className="text-gray-800 dark:text-gray-200">{item.name}</span>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="p-1 text-gray-400 hover:text-red-500 rounded-full transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))
        ) : (
          <EmptyState message="Your shopping list is empty." />
        )}
      </div>
    </div>
  );
};

export default function KitchenWidget({ isMaximized = false }) {
  const dispatch = useDispatch();

  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [recipeSuggestions, setRecipeSuggestions] = useState([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [viewingRecipe, setViewingRecipe] = useState(null);

  const pantryState = useSelector((state) => state.pantry);
  const shoppingListState = useSelector((state) => state.shoppingList);
  const recipesState = useSelector((state) => state.recipes);

  useEffect(() => {
    if (pantryState.status === "idle") dispatch(fetchPantryItems());
    if (shoppingListState.status === "idle") dispatch(fetchShoppingListItems());
    if (recipesState.status === "idle") dispatch(fetchRecipes());
  }, [pantryState.status, shoppingListState.status, recipesState.status, dispatch]);

  const handleAddItem = async (itemData) => {
    try {
      await dispatch(addPantryItem(itemData)).unwrap();
      toast.success("Item added to pantry!");
    } catch {
      toast.error("Failed to add item.");
    }
  };

  const handleUpdateItem = async ({ id, updatedData }) => {
    try {
      await dispatch(updatePantryItem({ id, updatedData })).unwrap();
      toast.success("Item updated successfully!");
      setEditingItem(null);
    } catch {
      toast.error("Failed to update item.");
    }
  };

  const handleConfirmDelete = async (shouldAddToList) => {
    if (!deletingItem) return;
    if (shouldAddToList) {
      dispatch(addShoppingListItem({ name: deletingItem.name }));
    }
    dispatch(deletePantryItem(deletingItem.id));
    toast.success(`${deletingItem.name} deleted.`);
    setDeletingItem(null);
  };

  const handleAddShoppingItem = async (itemData) => {
    try {
      await dispatch(addShoppingListItem(itemData)).unwrap();
      toast.success("Added to shopping list!");
    } catch {
      toast.error("Failed to add to list.");
    }
  };

  const handleFindRecipes = async () => {
    setIsLoadingRecipes(true);
    setRecipeSuggestions([]);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRecipeSuggestions(mockRecipes);
    toast.success("Mock recipes loaded!");

    setIsLoadingRecipes(false);
    setShowRecipeModal(true);
  };

  const handleCloseRecipeModal = () => {
    setShowRecipeModal(false);
    setRecipeSuggestions([]);
  };

  const handleViewRecipe = (recipe) => {
    setViewingRecipe(recipe);
  };

  const handleDeleteRecipe = (recipeId) => {
    dispatch(deleteRecipe(recipeId));
    toast.success("Recipe deleted from your collection.");
    setViewingRecipe(null);
  };

  return (
    <>
      {editingItem && (
        <EditItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleUpdateItem}
        />
      )}
      {deletingItem && (
        <DeleteConfirmationModal
          item={deletingItem}
          onClose={() => setDeletingItem(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
      {showRecipeModal && (
        <ModalWrapper onClose={handleCloseRecipeModal}>
          <div className="w-full max-w-8xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Recipe Ideas</h2>
              <button
                onClick={handleCloseRecipeModal}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recipeSuggestions.map((recipe, index) => (
                <RecipeSuggestionCard key={index} recipe={recipe} onView={handleViewRecipe} />
              ))}
            </div>
          </div>
        </ModalWrapper>
      )}
      {viewingRecipe && (
        <RecipeDetailModal
          recipe={viewingRecipe}
          onClose={() => setViewingRecipe(null)}
          onDelete={handleDeleteRecipe}
        />
      )}

      <div
        className={`grid grid-cols-1 ${isMaximized ? "lg:grid-cols-3" : "lg:grid-cols-2"} gap-6`}
      >
        <div className={`flex flex-col gap-4 ${isMaximized ? "" : "lg:col-span-1"}`}>
          <PantryForm onAddItem={handleAddItem} />
          <div className="bg-gray-100/80 dark:bg-gray-900/50 p-4 rounded-xl">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
              Get Inspired
            </h3>
            <ActionButton
              onClick={handleFindRecipes}
              disabled={isLoadingRecipes || pantryState.items.length === 0}
              className="w-full bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
            >
              {isLoadingRecipes ? "Finding Recipes..." : "What can I make?"}
            </ActionButton>
          </div>
          <div className="bg-gray-100/80 dark:bg-gray-900/50 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Saved Recipes
            </h3>
            <div className="space-y-2">
              {recipesState.status === "loading" ? (
                <Spinner />
              ) : recipesState.items.length > 0 ? (
                recipesState.items.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="flex items-center justify-between bg-white/80 dark:bg-gray-800/80 p-2.5 rounded-lg shadow-sm"
                  >
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {recipe.recipeName}
                    </span>
                    <button
                      onClick={() => handleViewRecipe(recipe)}
                      className="text-sm font-semibold text-blue-600 hover:underline"
                    >
                      View
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  You haven't saved any recipes yet.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className={`flex flex-col gap-4 ${isMaximized ? "" : "lg:col-span-1"}`}>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-2">
            Current Pantry
          </h3>
          <div className="space-y-2">
            {pantryState.status === "loading" ? (
              <Spinner />
            ) : pantryState.items.length > 0 ? (
              pantryState.items.map((item) => (
                <PantryItem
                  key={item.id}
                  item={item}
                  onEdit={setEditingItem}
                  onDelete={setDeletingItem}
                />
              ))
            ) : (
              <EmptyState message="Your pantry is empty. Add some items to get started!" />
            )}
          </div>
        </div>

        <div className={`${isMaximized ? "lg:col-span-1" : "lg:col-span-2"}`}>
          <ShoppingList
            items={shoppingListState.items}
            status={shoppingListState.status}
            onAddItem={handleAddShoppingItem}
            onRemoveItem={(id) => dispatch(deleteShoppingListItem(id))}
          />
        </div>
      </div>
    </>
  );
}
