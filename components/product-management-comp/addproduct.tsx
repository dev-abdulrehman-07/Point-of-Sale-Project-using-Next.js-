"use client"

import { useCreateProductMutation, useGetcategoriesQuery, useGetInventoryItemsQuery } from "@/lib/store/Api-Hooks/main.api";
import { useState } from "react"
import type { InventoryItemResponse } from "@/app/api/inventory/route";
import { cardDataType } from "@/model/product.Model";
import mongoose from "mongoose";

interface RecipeIngredient {
  id: string;
  name: string;
  unit: string;
  quantity: string;
}


export default function AddProductComponent() {
  const [createProduct, { isLoading : createProductLoading, isSuccess : createProductSuccess, error : createProductError }] = useCreateProductMutation();
  const { isLoading, data, error } = useGetInventoryItemsQuery();
  const STORE_ITEMS: InventoryItemResponse[] | undefined = data;
  
  const [openCategory, setOpenCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{ _id: string; name: string } | null>(null);
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([]);
  const {data : category ,isLoading : loadingCategory ,error : errorCategory} = useGetcategoriesQuery();
  const CATEGORIES = category?.data || [];

  const handleAddIngredient = (item: InventoryItemResponse) => {
    if (recipeIngredients.some((ing) => ing.id === item._id)) return;
    setRecipeIngredients((prev) => [
      ...prev,
      { id: item._id, name: item.name, unit: item.unit, quantity: "" },
    ]);
  };

  const handleRemoveIngredient = (id: string) => {
    setRecipeIngredients((prev) => prev.filter((ing) => ing.id !== id));
  };

  const handleQuantityChange = (id: string, value: string) => {
    setRecipeIngredients((prev) =>
      prev.map((ing) => (ing.id === id ? { ...ing, quantity: value } : ing))
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    if (!selectedCategory) {
      alert("Please select a category.");
      return;
    }

    if (recipeIngredients.some((ing) => !ing.quantity || Number(ing.quantity) <= 0)) {
      alert("Please enter a valid quantity for all recipe ingredients.");
      return;
    }

    
    const productPayload: Partial<cardDataType> = {
      title: formData.get("productName") as string,
      category: selectedCategory._id, 
      description:formData.get("productDescription") as string,          
      price: Number(formData.get("productPrice")),
      image: formData.get("imageLink") as string,
      Recipe :  recipeIngredients.map((ing) => ({
        Item : ing.id,                            
        Quantity: Number(ing.quantity),
    
      })),
      
      

    };

    createProduct(productPayload).unwrap()
      .then(() => {
        alert("Product added successfully!");
        form.reset();
        setSelectedCategory(null);
        setRecipeIngredients([]);
      })
      .catch((err) => {
        alert("Failed to add product.");
        console.error("Failed to add product:", err);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Add New Product & Recipe</h2>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the product details and configure its recipe from store items.
          </p>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="flex flex-col gap-y-2">
              <label htmlFor="productName" className="text-sm font-medium text-gray-700">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                className="h-11 w-full px-4 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#ccff66] transition-all"
                type="text"
                name="productName"
                id="productName"
                placeholder="e.g., Cheese Burger"
                required
              />
            </div>

            <div className="relative flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-700">
                Product Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  className="h-11 w-full px-4 pr-10 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#ccff66] transition-all"
                  type="text"
                  placeholder="Select Category"
                  value={selectedCategory?.name ?? ""}
                  readOnly
                  onClick={() => setOpenCategory((p) => !p)}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                  <svg
                    className={`w-4 h-4 transition-transform ${openCategory ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {openCategory && (
                <div className="absolute bg-white border border-gray-100 shadow-lg rounded-xl top-[105%] w-full max-h-52 overflow-y-auto z-20 p-1">
                  {CATEGORIES.map((cat) => (
                    <div
                      key={cat._id.toString()}
                      onClick={() => {
                        setSelectedCategory({ _id: cat._id.toString(), name: cat.name });
                        setOpenCategory(false);
                      }}
                      className="text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-[#ccff66] px-4 py-2.5 rounded-lg cursor-pointer transition-colors"
                    >
                      {cat.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-y-2">
              <label htmlFor="productPrice" className="text-sm font-medium text-gray-700">
                Selling Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                className="h-11 w-full px-4 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#ccff66] transition-all"
                type="number"
                name="productPrice"
                id="productPrice"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            
          </div>

          <div className="flex flex-col gap-y-2">
            <label htmlFor="imageLink" className="text-sm font-medium text-gray-700">
              Image URL <span className="text-red-500">*</span>
            </label>
            <input
              className="h-11 w-full px-4 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#ccff66] transition-all"
              type="url"
              name="imageLink"
              id="imageLink"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <label htmlFor="productDescription" className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              className="w-full p-4 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#ccff66] transition-all min-h-[80px] resize-y"
              name="productDescription"
              id="productDescription"
              placeholder="Write a brief description..."
            />
          </div>

          <hr className="border-gray-100" />

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Product Recipe (Ingredients)</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Select items from store inventory and specify their usage quantity per recipe.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 max-h-[280px] overflow-y-auto">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-3">
                  Store Inventory
                </span>

                {isLoading && (
                  <p className="text-xs text-gray-400 text-center py-4">Loading items...</p>
                )}
                {error && (
                  <p className="text-xs text-red-400 text-center py-4">Failed to load inventory.</p>
                )}

                <div className="space-y-2">
                  {STORE_ITEMS?.map((item) => {
                    const isSelected = recipeIngredients.some((ing) => ing.id === item._id);
                    return (
                      <button
                        key={item._id}
                        type="button"
                        onClick={() => handleAddIngredient(item)}
                        disabled={isSelected}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg border text-left transition-all
                          ${isSelected
                            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-white border-gray-200 text-gray-700 hover:border-[#ccff66] hover:bg-blue-50/50"
                          }`}
                      >
                        <span>{item.name}</span>
                        <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 uppercase">
                          {item.unit}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="md:col-span-2 border border-gray-200 rounded-xl p-4 bg-white min-h-[200px]">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-3">
                  Recipe Items
                </span>

                {recipeIngredients.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-12 text-gray-400">
                    <p className="text-sm">No ingredients added yet.</p>
                    <p className="text-xs mt-0.5">Click on items from the store list to add them.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                    {recipeIngredients.map((ingredient) => (
                      <div
                        key={ingredient.id}
                        className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-100 rounded-xl gap-x-3"
                      >
                        <span className="text-sm font-medium text-gray-700 w-1/3 truncate">
                          {ingredient.name}
                        </span>

                        <div className="flex items-center gap-x-2 w-1/2">
                          <input
                            type="number"
                            step="any"
                            min="0.01"
                            placeholder="Qty"
                            value={ingredient.quantity}
                            onChange={(e) => handleQuantityChange(ingredient.id, e.target.value)}
                            className="h-9 w-full px-3 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ccff66] bg-white text-gray-900"
                            required
                          />
                          <span className="text-xs text-gray-400 min-w-[35px] uppercase">
                            {ingredient.unit}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(ingredient.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-x-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
  type="submit"
  disabled={createProductLoading}
  className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#1b2011] hover:bg-[#ccff66] disabled:bg-[#ccff66] disabled:cursor-not-allowed rounded-xl shadow-sm transition-all"
>
  {createProductLoading ? (
    <>
      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Adding...</span>
    </>
  ) : (
    "Add Product"
  )}
</button>
          </div>

        </form>
      </div>
    </div>
  );
}