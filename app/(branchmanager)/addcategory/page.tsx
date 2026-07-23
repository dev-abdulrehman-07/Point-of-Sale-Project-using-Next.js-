"use client"

import { useState, useEffect } from "react"

interface CategoryType {
  _id: string;
  name: string;
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [newCategory, setNewCategory] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategory.trim()) return

    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      })
      const result = await res.json()

      if (res.ok) {
        setCategories([...categories, result.data])
        setNewCategory("")
        setMessage({ type: "success", text: "Category added successfully!" })
      } else {
        setMessage({ type: "error", text: result.error || "Something went wrong" })
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to connect to server" })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return

    try {
      const res = await fetch(`/api/categories?id=${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setCategories(categories.filter((cat) => cat._id !== id))
        setMessage({ type: "success", text: "Category deleted successfully!" })
      } else {
        const result = await res.json()
        setMessage({ type: "error", text: result.error || "Could not delete" })
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to delete category" })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-10 text-gray-900 rounded-2xl overflow-hidden">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-5">
        
        <div className="md:col-span-2 p-8 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col justify-between">
          <div>
            <div className="mb-8">

              <h2 className="text-2xl font-black text-gray-900 mt-3">Add Category</h2>
              <p className="text-xs text-gray-400 mt-1">Create a new section for your restaurant food menu.</p>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="flex flex-col gap-y-1.5">
                <label htmlFor="categoryName" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Category Name
                </label>
                <input
                  type="text"
                  id="categoryName"
                  placeholder="e.g., Appetizers"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="h-12 w-full px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all font-medium"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: "#ccff66" }}
                className="w-full h-12 text-sm font-bold text-gray-950 rounded-xl hover:opacity-90 active:scale-[0.99] shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {loading ? "Adding..." : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Category
                  </>
                )}
              </button>
            </form>
          </div>

          {message && (
            <div className={`mt-6 p-3 rounded-xl text-xs font-semibold ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}
        </div>

        <div className="md:col-span-3 p-8 bg-gray-50/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Active Categories</h3>
              <span className="text-xs font-bold text-gray-500 bg-white border px-2.5 py-1 rounded-lg shadow-sm">
                Total: {categories.length}
              </span>
            </div>

            {categories.length === 0 ? (
              <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
                <p className="text-sm font-medium">No categories created.</p>
                <p className="text-xs mt-0.5">Use the left panel to populate the list.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 max-h-[350px] overflow-y-auto pr-1">
                {categories.map((category) => (
                  <div
                    key={category._id}
                    className="flex items-center justify-between p-3.5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow transition-all group"
                  >
                    <div className="flex items-center gap-x-3">
                      <div className="w-2 h-2 rounded-full bg-[#ccff66]" />
                      <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                        {category.name}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(category._id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors md:opacity-0 group-hover:opacity-100"
                      title="Delete category"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <p className="text-[10px] text-gray-400 text-right mt-6">
            * Deleting a category might affect associated food items.
          </p>
        </div>

      </div>
    </div>
  )
}