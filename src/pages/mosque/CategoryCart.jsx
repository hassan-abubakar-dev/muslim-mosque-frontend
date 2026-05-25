import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import privateAxiosInstance from "../../../auth/privateAxiosInstance"; // Adjust path as needed
import truncateByWords from "../../util/splitWord";

const CategoryCart = ({ categories, isOwner, setCategories, setIsEdit, setShowModal, setNewCategory }) => {
    const [openMenuId, setOpenMenuId] = useState(false);
    const [showDeleteCategory, setShowDeleteCategory] = useState(false);
    const navigate = useNavigate();

    const handleDeleteCategory = async (categoryId) => {

        try {
           const res = await privateAxiosInstance.delete(`/categories/delete-category/${categoryId}`);
            
        if(res.status < 400){
            setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
            setShowDeleteCategory(false);
        }
            
        } catch (err) {
            console.error("Delete failed:", err);
           
        }
    };

    return (
        <div className="max-w-6xl  mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {categories.map((cat) => (
                <div key={cat.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col relative">
                    {cat?.categoryProfile ? (
                        <img src={cat.categoryProfile.image} alt={cat.name} className="w-full h-44 object-cover" />
                    ) : (
                        <div className="w-full h-44 flex items-center justify-center bg-emerald-100 text-emerald-700 font-bold text-5xl">
                            {cat.name.charAt(0)}
                        </div>
                    )}
                    
                    <div className="p-4 flex flex-col flex-1">
                        <div className="flex justify-between items-start">
                            <h4 className="font-bold text-lg text-gray-800 text-nowrap">{cat.name}</h4>
                            <span className="text-sm text-gray-500 font-medium mt-1.5 ml-10 text-nowrap">{truncateByWords(cat.teacherName, 3)}</span>
                        </div>
                        
                        {cat.information && <p className="text-sm text-gray-600 mt-2 whitespace-nowrap">{truncateByWords(cat.information, 6)}</p>}
                        
                        <div className="mt-auto flex items-center justify-between pt-4">
                            <button 
                                className="bg-emerald-700 text-white px-4 py-1.5 whitespace-nowrap rounded-md text-sm hover:bg-emerald-800" 
                                onClick={() => navigate('/category/lacture', { state: { cat } })}
                            >
                                View Lectures
                            </button>

                              {isOwner && (
                                // 2. Remove ml-24, let flexbox handle the spacing
                                <div className="relative">
                                    <button 
                                        onClick={() => setOpenMenuId(openMenuId === cat.id ? null : cat.id)} 
                                        className="p-2 rounded-full hover:bg-gray-100 md:ml-16"
                                    >
                                        <MoreVertical className="w-5 h-5 text-gray-600" />
                                    </button>

                                    {/* 3. Position the menu absolutely relative to this specific wrapper */}
                                    {openMenuId === cat.id && (
                                        <div className="absolute right-0 bottom-full mb-2 bg-white border rounded-lg shadow-xl w-36 z-50">
                                            <button
                                                onClick={() => { setIsEdit(true); setShowModal(true); setOpenMenuId(null); setNewCategory(cat) }}
                                                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 w-full"
                                            >
                                                <Pencil className="w-4 h-4 text-emerald-700" /> Edit
                                            </button>
                                            <button
                                                onClick={() => { setShowDeleteCategory(cat.id); setOpenMenuId(null); }}
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                                            >
                                                <Trash2 className="w-4 h-4" /> Delete
                                            </button>
                                        </div>
                                    )}

                                    
                    {showDeleteCategory && (
                            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                            <div className="bg-white rounded-xl p-6 w-96">
                                <h2 className="text-lg font-semibold">Delete Category</h2>
                                <p className="text-sm mt-2">Are you sure you want to delete {cat.name}?</p>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button onClick={() => setShowDeleteCategory(null)} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
                                    <button onClick={() => handleDeleteCategory(cat.id)} className="px-4 py-2 bg-red-600 text-white rounded-md">Delete</button>
                                </div>
                            </div>
                        </div>
                    )}
                                </div>

                                
                            )}
                        </div>
                    </div>

           
                </div>
            ))}
        </div>
    );
};

export default CategoryCart;




    
                   
                     


                       
               