"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewServicePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "trek routes",
    price: "",
    location: "",
    images: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        ...formData,
        price: formData.price ? Number(formData.price) : undefined,
        images: formData.images.split(",").map(img => img.trim()).filter(Boolean),
      };

      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/services");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create service");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add New Service</h1>
      {error && <div className="bg-red-100 text-red-600 p-3 mb-4 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input required name="title" value={formData.title} onChange={handleChange} className="w-full border rounded p-2 text-black" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea required name="description" value={formData.description} onChange={handleChange} className="w-full border rounded p-2 text-black h-32" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full border rounded p-2 text-black">
              <option value="trek routes">Trek Routes</option>
              <option value="hotels">Hotels</option>
              <option value="equipment">Equipment</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price (Optional)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border rounded p-2 text-black" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input required name="location" value={formData.location} onChange={handleChange} className="w-full border rounded p-2 text-black" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Images (Comma separated URLs)</label>
          <input name="images" value={formData.images} onChange={handleChange} className="w-full border rounded p-2 text-black" />
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Service</button>
        </div>
      </form>
    </div>
  );
}
