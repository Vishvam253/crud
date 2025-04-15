import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {toast, ToastContainer} from 'react-toastify';

const AddCategory = ({ closeDrawer, refreshCategories }) => {
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8081/api/v1/category/add", { name: category }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-type': 'application/json',
        },
      });
      toast.success("Category added successfully!");
      setCategory('');
      closeDrawer(); 
      refreshCategories(); 
    } catch (err) {
      setError("Failed to add category. Try again.");
    } finally {
      setLoading(false);
    }
  };

 
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Add Category</h2>
      <form onSubmit={handleAddCategory} className="space-y-4">
        <input
          type="text"
          placeholder="Enter category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <p className="text-red-600">{error}</p>}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={closeDrawer}
            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Category'}
          </button>
        </div>
      </form>
      <ToastContainer position='top-right' autoClose={2000}/>
    </div>
  );
};

export default AddCategory;
