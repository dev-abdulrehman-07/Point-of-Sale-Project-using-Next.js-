"use client";
import { useGetproductQuery } from "@/lib/store/Api-Hooks/main.api";
import { cardDataType } from "@/model/product.Model";
import React, { useState } from "react";

function Liveproducts() {
  const { isLoading, data, error, isError } = useGetproductQuery();

  const [searchQuery, setSearchQuery] = useState("");

  const [disabledProducts, setDisabledProducts] = useState<string[]>([]);

  const handleEdit = (productName: string) => {
    alert(`Edit handling for: ${productName}`);
  };

  const handleDelete = (productName: string) => {
    if (confirm(`Kya waqai ${productName} ko udaana hai?`)) {
      alert(`Deleting: ${productName}`);
    }
  };

  const handleToggleDisable = (productName: string) => {
    setDisabledProducts((prev) =>
      prev.includes(productName)
        ? prev.filter((name) => name !== productName)
        : [...prev, productName],
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#ccff66]"></div>

        <span className="ml-2 text-xs text-gray-500">Loading...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-3 bg-red-50 text-red-700 rounded-lg text-xs max-w-md mx-auto mt-6 text-center">
        <p className="font-semibold">Something Went Wrong</p>

        <p className="text-[11px] text-red-500 mt-0.5">
          {(error as any)?.message || "Data fetch nahi ho saka."}
        </p>
      </div>
    );
  }

  const products: Omit<cardDataType, "Recipe">[] = data?.data || [];

  const filteredProducts = products.filter((product) =>
    product.title?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="p-3 max-w-5xl mx-auto bg-gray-50 rounded-xl border border-gray-200">
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-4 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 placeholder-gray-400 shadow-sm transition-colors"
        />
      </div>

      <div className="space-y-1.5">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const isDisabled = disabledProducts.includes(product.title);

            return (
              <div
                key={product._id.toString()}
                className={`flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200 shadow-sm hover:border-gray-300 transition-all text-xs ${
                  isDisabled ? "opacity-50 bg-gray-100 border-dashed" : ""
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <img
                    src={product.image || "https://via.placeholder.com/40"}
                    alt={product.title}
                    className="w-10 h-10 object-cover rounded-md bg-gray-100 flex-shrink-0"
                  />

                  <div className="min-w-0">
                    <h4
                      className={`font-semibold text-gray-800 truncate text-sm ${isDisabled ? "line-through text-gray-400" : ""}`}
                    >
                      {product.title}
                    </h4>

                    <div className="flex items-center space-x-2 mt-0.5 text-[11px] text-gray-500">
                      <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-medium">
                        ${product.price.toFixed(2)}
                      </span>

                      <span>•</span>

                      <span
                        className={`font-medium ${isDisabled ? "text-gray-400" : product.quantity > 0 ? "text-green-600" : "text-red-500"}`}
                      >
                        {isDisabled ? "Disabled" : `Qty: ${product.quantity}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 ml-4 flex-shrink-0">
                  <button
                    onClick={() => handleToggleDisable(product.title)}
                    className={`px-2.5 py-1 text-[11px] font-medium border rounded-md transition-colors ${
                      isDisabled
                        ? "bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200"
                    }`}
                  >
                    {isDisabled ? "Enable" : "Disable"}
                  </button>

                  <button
                    onClick={() => handleEdit(product.title)}
                    disabled={isDisabled}
                    className="px-2.5 py-1 text-[11px] font-medium bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(product.title)}
                    disabled={isDisabled}
                    className="px-2.5 py-1 text-[11px] font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-400 text-xs text-center py-6 bg-white rounded-lg border border-dashed">
            {products.length === 0
              ? "No Product is Available"
              : "No results match your search"}
          </p>
        )}
      </div>
    </div>
  );
}

export default Liveproducts;
