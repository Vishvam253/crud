import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CategoryTable from './CategoryTable';
import { toast, ToastContainer } from "react-toastify";
import EditCategory from './EditCategory';

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [editCategory, setEditCategory] = useState(null);
    const [showEditForm, setShowEditForm] = useState(null);
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem("token")
            const res = await axios.get(`${BASE_URL}/api/v1/category/get`, {
                headers: {
                     Authorization: `Bearer ${token}`,
                    'Content-type': 'application/json',
                },
            });
            setCategories(res.data.data || []);
        } catch (error) {
            console.error("Error fetching categories", error);
        }
    };

    const handleDeleteCategory = async (id) => {

        try {
            const token = localStorage.getItem("token");
            const res = await axios.delete(`${BASE_URL}/api/v1/category/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.data.success) {
                toast.success("Category deleted successfully");
                setTimeout(() => {
                fetchCategories();
                }, 2000);
            } else {
                toast.error("Failed to delete category")
            }
        } catch {
            toast.error("Something went wrong");
        }
    }

    const handlEditCategory = (cat) => {
        setEditCategory(cat);
        setShowEditForm(true);
    }

    const closeEditForm = () => {
        setShowEditForm(false);
        setEditCategory(null);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className='p-6 bg-gray-100 min-h-screen'>
            <h1 className='text-3xl font-bold text-gray-700 mb-4'>Categories List</h1>
            <CategoryTable categories={categories}
                onDeleteCategory={handleDeleteCategory}
                onEditCategory={handlEditCategory}
            />
            {showEditForm && (
                <EditCategory 
                    show={showEditForm}
                    category={editCategory}
                    onClose={closeEditForm}
                    onUpdate={fetchCategories}
                />
            )}

            <ToastContainer position='top-right' autoClose={2000} />
        </div>
    )
};

export default CategoryPage;