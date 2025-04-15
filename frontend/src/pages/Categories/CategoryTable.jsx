import React, { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';

const CategoryTable = ({ categories, onEditCategory, onDeleteCategory }) => {
  
    return (
      <div className="overflow-x-auto rounded-xl">
        <table className="w-full bg-white shadow-lg rounded-lg border border-gray-300 text-md font-semibold">
          <thead className="bg-gray-300">
            <tr>
              <th className="px-4 py-3 border border-gray-300">Category Name</th>
              <th className="px-4 py-3 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, index) => (
              <tr key={cat._id || index} className="text-gray-700 border-b hover:bg-gray-100">
                <td className="px-4 py-3 border border-gray-300">{cat.name}</td>
                <td className="px-4 py-3 border border-gray-300 space-x-3">
                <button
                  onClick={() => onEditCategory(cat)}
                  className="text-blue-600 hover:text-blue-700 transition"
                  title="Edit"
                >
                 <FaEdit size={21} />
                </button>                  
                <button
                  onClick={() => onDeleteCategory(cat._id)}
                      className="text-red-600 hover:text-red-700 transition"
                  title="Delete"
                >
                  <FiTrash2 size={20} />
                </button>          
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default CategoryTable;
