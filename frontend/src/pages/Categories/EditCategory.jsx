import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';

const EditCategory = ({show, category, onClose, onUpdate}) => {
    const [name, setName] = useState("");
    const drawerRef = useRef();
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;


    useEffect(()=>{ 
        if(category){
            setName(category.name);
        }
    },[category]);

    const handleUpdate = async(e) => {
        e.preventDefault();
        try{
            const token = localStorage.getItem("token");
            const res = await axios.put(`${BASE_URL}/api/v1/category/update/${category._id}`,{
                name
            },{
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            if(res.data.success){
                toast.success("Category updated successfully");
                onUpdate();
                onClose();  
            }else{
                toast.error("update failed");
            }
        }catch(error){
           toast.error("Something went wrong");
        } 
    };

    const handleClick = (e)=>{
      if(drawerRef.current && !drawerRef.current.contains(e.target)){
        onClose();
      }
    }
    if(!show) return null;

  return (

    <div className='fixed inset-0 bg-black/30 bg-opacity-20 backdrop-blur-sm justify-end' onClick={handleClick}>
    <div ref={drawerRef}
    className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
      show ? "translate-x-0" : "translate-x-full"
    }`}
  >
    <div className="p-4 bg-white rounded shadow-lg w-full min-h-screen">
      <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
      <form onSubmit={handleUpdate}>
        <input type='text' className='w-full border p-2 rounded mb-4' value={name}
        onChange={(e)=> setName(e.target.value)} required/>
         <div className="flex justify-end gap-2"> 
         <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            Cancel  
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            Update
          </button>
         </div>
      </form>
    </div>
    </div>
      
    </div>
  
  )
}

export default EditCategory