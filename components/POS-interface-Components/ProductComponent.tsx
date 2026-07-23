"use client";

import React, { useState } from "react";
import { addToOrder } from "@/lib/store/Slices/posSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { useGetproductQuery } from "@/lib/store/Api-Hooks/main.api";
import { cardDataType } from "@/model/product.Model";
import { ScanSearch, ShoppingCart, AlertCircle } from "lucide-react";
import { ObjectId } from "mongoose";

function ProductComponent() {
  const dispatch = useAppDispatch();
  const orderData = useAppSelector((state) => state.pos.order);
  
  const { data, isLoading, error } = useGetproductQuery();
  const [category, setcategory] = useState("All Products");
  const [catopen, setcatopen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#C5F47F] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-sans font-medium text-sm">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h1 className="text-gray-800 font-sans font-bold text-lg">No Products Available</h1>
        </div>
      </div>
    );
  }

  const cardData: Omit<cardDataType, "Recipe">[] = data.data;

  const filteredProducts = cardData.filter((v) => {
    const matchesCategory =
      category === "All Products" || 
      v.title?.toLowerCase().trim() === category.toLowerCase().trim();

    if (!searchQuery) return matchesCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesTitle = v.title?.toLowerCase().trim().includes(query);
    const matchesDesc = v.description?.toLowerCase().trim().includes(query);
    const matchesPrice = !isNaN(Number(query)) && Number(v.price) === Number(query);

    return matchesCategory && (matchesTitle || matchesDesc || matchesPrice);
  });

  function getRemainingStock(id: string | ObjectId, originalQuantity: number) {
    const stringId = id.toString();
    const cartItem = orderData.find((product) => product._id.toString() === stringId);
    
    if (!cartItem) {
      return originalQuantity;
    } else {
      return originalQuantity - cartItem.quantity;
    }
  }

  return (
    <div className="relative flex flex-col   overflow-y-scroll bg-gray-50/50 min-h-full">
      
      {/* Top Bar / Search Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md flex h-[70px] items-center px-6 gap-x-4 w-full border-b border-gray-100 shadow-sm">
        <div className="relative flex items-center w-full max-w-[350px] h-[42px]">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-full pl-5 pr-12 border border-gray-200 rounded-full font-sans font-medium text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-white text-black"
          />
          <span className="absolute right-4 text-gray-400 pointer-events-none">
            <ScanSearch className="w-5 h-5" />
          </span>
        </div>

        <div className="relative">
          <button
            onClick={() => setcatopen(!catopen)}
            className="h-[40px] min-w-[150px] px-6 border border-gray-200 rounded-full flex justify-between items-center transition-all font-sans font-bold text-sm text-black bg-white hover:border-black cursor-pointer shadow-sm"
          >
            <span>{category}</span>
            <span className="text-[10px] ml-2">▼</span>
          </button>
          {catopen && (
            <div className="absolute right-0 top-12 z-50 bg-white border border-gray-100 rounded-2xl p-1 shadow-lg space-y-1 min-w-[180px]">
              <button
                onClick={() => {
                  setcategory("All Products");
                  setcatopen(false);
                }}
                className="h-[38px] w-full text-left px-4 hover:bg-gray-50 rounded-xl flex items-center font-sans font-semibold text-xs text-black transition-all"
              >
                All Products
              </button>
              {cardData.map((product, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setcategory(`${product.title}`);
                    setcatopen(false);
                  }}
                  className="h-[38px] w-full text-left px-4 hover:bg-gray-50 rounded-xl flex items-center font-sans font-semibold text-xs text-black transition-all"
                >
                  {product.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3  gap-6 max-w-[1400px] w-full p-6 sm:p-8 mx-auto">
        {filteredProducts.map((product, i) => {
          const remainingStock = getRemainingStock(product._id as string, product.quantity);
          const isOutOfStock = remainingStock <= 0;

          return (
            <div
              key={product._id ? product._id.toString() : i}
              className="flex flex-col bg-white border border-gray-100 rounded-[20px] p-3.5 hover:shadow-lg hover:border-gray-200 transition-all duration-300 group"
            >
              {/* Product Image Container */}
              <div className="relative w-full aspect-square rounded-[16px] overflow-hidden mb-3 bg-gray-50">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Floating Stock Indicator (Top Right) */}
                <div className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[10px] font-sans font-bold shadow-sm backdrop-blur-md ${
                  isOutOfStock 
                    ? "bg-red-500/90 text-white" 
                    : remainingStock <= 5 
                      ? "bg-amber-400/90 text-amber-950" 
                      : "bg-black/60 text-white"
                }`}>
                  {isOutOfStock ? "Out of Stock" : `Qty: ${remainingStock}`}
                </div>

                {/* Floating Price Tag (Bottom Left) */}
                <div className="absolute bottom-2.5 left-2.5 bg-white px-3 py-1 rounded-lg text-sm font-sans font-extrabold text-black shadow-sm">
                  ${product.price}
                </div>
              </div>

              {/* Text Info */}
              <div className="flex-1 flex flex-col mb-4 px-1">
                <h2 className="font-sans font-bold text-sm tracking-tight text-gray-900 line-clamp-1 group-hover:text-black">
                  {product.title}
                </h2>
                <p className="font-sans font-medium text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Action Button */}
              <button
                disabled={isOutOfStock}
                onClick={() => dispatch(addToOrder({ ...product }))}
                className={`w-full h-[40px] font-sans font-bold text-xs rounded-xl transition-all flex justify-center items-center gap-2 shadow-sm ${
                  isOutOfStock 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200" 
                    : "bg-[#C5F47F] text-black hover:bg-[#b8e972] active:scale-[0.97] hover:shadow-md cursor-pointer"
                }`}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                {isOutOfStock ? "Sold Out" : "Add to Cart"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProductComponent;