"use client";

import React, { useState } from "react";
import Image from "next/image";
import { addToOrder } from "@/lib/RTK/posSlice";
import { useAppDispatch } from "@/lib/RTK/store"; // Redux custom hook import kiya

// Card Data ki type design ki
type cardDataType = {
  id: number;
  image?: string;
  title: string;
  description: string;
  isActive: boolean;
  quantity: number;
  price: number;
};

function ProductComponent() {
  const dispatch = useAppDispatch(); // Dispatch hooks initialize kiya
  const [category, setcategory] = React.useState("All Products");
  const [catopen, setcatopen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const cardData: cardDataType[] = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60",
      title: "Classic Beef Burger",
      description: "Behtareen aur juicy beef patty wala burger.",
      isActive: true,
      quantity: 1,
      price: 450,
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60",
      title: "Healthy Salad Bowl",
      description: "Fresh veggies aur healthy ingredients ke sath.",
      isActive: true,
      quantity: 1,
      price: 350,
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60",
      title: "Cheese Loaded Pizza",
      description: "Extra cheese aur mazedar toppings wala pizza.",
      isActive: true,
      quantity: 1,
      price: 1200,
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60",
      title: "Cheese Loaded Pizza",
      description: "Extra cheese aur mazedar toppings wala pizza.",
      isActive: true,
      quantity: 1,
      price: 1200,
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60",
      title: "Cheese Loaded Pizza",
      description: "Extra cheese aur mazedar toppings wala pizza.",
      isActive: true,
      quantity: 1,
      price: 1200,
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60",
      title: "Cheese Loaded Pizza",
      description: "Extra cheese aur mazedar toppings wala pizza.",
      isActive: true,
      quantity: 1,
      price: 1200,
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60",
      title: "Cheese Loaded Pizza",
      description: "Extra cheese aur mazedar toppings wala pizza.",
      isActive: true,
      quantity: 1,
      price: 1200,
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60",
      title: "Cheese Loaded Pizza",
      description: "Extra cheese aur mazedar toppings wala pizza.",
      isActive: true,
      quantity: 1,
      price: 1200,
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60",
      title: "Cheese Loaded Pizza",
      description: "Extra cheese aur mazedar toppings wala pizza.",
      isActive: true,
      quantity: 1,
      price: 1200,
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60",
      title: "Cheese Loaded Pizza",
      description: "Extra cheese aur mazedar toppings wala pizza.",
      isActive: true,
      quantity: 1,
      price: 1200,
    },
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60",
      title: "Cheese Loaded Pizza",
      description: "Extra cheese aur mazedar toppings wala pizza.",
      isActive: true,
      quantity: 1,
      price: 1200,
    },
    {
      id: 8,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60",
      title: "Cheese Loaded Pizza",
      description: "Extra cheese aur mazedar toppings wala pizza.",
      isActive: true,
      quantity: 1,
      price: 1200,
    },
    {
      id: 9,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60",
      title: "Cheese Loaded Pizza",
      description: "Extra cheese aur mazedar toppings wala pizza.",
      isActive: true,
      quantity: 1,
      price: 1200,
    }
  ];

  return (
    <div className="relative flex flex-col overflow-y-auto pb-10 overflow-x-hidden bg-white">
      {/* Top Search & Filter Bar */}
      <div className="sticky top-0 z-50 bg-white flex h-[60px] items-center px-3 my-0 gap-x-4 w-full">
        <div className="relative flex items-center min-w-[260px] my-10 ml-8 max-w-[320px] h-[45px]">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-full pl-5 pr-4 border-2 border-black rounded-full font-sans font-medium text-sm focus:outline-none bg-white text-black"
          />
          <span className="absolute right-4 text-gray-500 pointer-events-none">🔍</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setcatopen(!catopen)}
            className="h-[40px] w-[150px] px-[26px] border-2 border-black rounded-full flex justify-center items-center transition-all font-sans font-bold text-sm whitespace-nowrap cursor-pointer"
          >
            {category}
          </button>
          {catopen && (
            <div className="absolute right-0 top-11 z-50 bg-white border-2 border-black rounded-2xl p-1 shadow-md space-y-1">
              {cardData.map((product, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setcategory(`${product.title}`);
                    setcatopen(!catopen);
                  }}
                  className="h-[35px] w-[160px] text-left px-4 hover:bg-gray-100 rounded-xl flex items-center font-sans font-medium text-xs whitespace-nowrap cursor-pointer text-black"
                >
                  {product.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Products Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8 max-w-[1200px] h-full w-full p-10 mx-auto">
        {cardData.map((product, i) => (
          <div key={i} className="flex flex-col border-neutral-800 rounded-[24px] text-white hover:border-neutral-700 transition-all duration-300 group">
            <div className="relative w-full aspect-[5/4] rounded-[20px] overflow-hidden mb-2 bg-neutral-800">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="flex flex-col px-1 mb-3">
              <h2 className="font-sans font-bold text-md tracking-tight leading-tight text-black">
                {product.title}
              </h2>
              <p className="font-sans font-normal text-[12px] text-neutral-400">
                {product.description}
              </p>
            </div>

            <div className="mt-auto">
              
              <button
                onClick={() => dispatch(addToOrder({...product}))}
                className="w-[80%] h-[33px] bg-[#C5F47F] text-black font-sans font-bold text-sm rounded-full hover:bg-[#b5e56e] active:scale-[0.98] transition-all cursor-pointer flex justify-center items-center shadow-sm"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductComponent;