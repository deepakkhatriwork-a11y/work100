import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/layout/Layout';
import myContext from '../../../context/data/myContext';
import { toast } from 'react-toastify';

function AddProduct() {
    const navigate = useNavigate();
    const context = useContext(myContext);
    const { addProduct, loading } = context;
    
    const [product, setProduct] = useState({
        title: '',
        price: '',
        imageUrls: ['', '', '', '', ''], // Support for 5 images
        modelUrls: ['', '', ''], // Support for 3 3D models
        category: '',
        description: '',
        stock: 0,
        reserved: 0
    });

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });
    };

    // Handle image URL changes
    const handleImageChange = (index, value) => {
        const newImageUrls = [...product.imageUrls];
        newImageUrls[index] = value;
        setProduct({
            ...product,
            imageUrls: newImageUrls
        });
    };

    // Handle 3D model URL changes
    const handleModelChange = (index, value) => {
        const newModelUrls = [...product.modelUrls];
        newModelUrls[index] = value;
        setProduct({
            ...product,
            modelUrls: newModelUrls
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!product.title || !product.price || !product.category || !product.description) {
            toast.error('Please fill all required fields', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
            return;
        }

        // Check if at least one image is provided
        const hasImage = product.imageUrls.some(url => url.trim() !== '');
        if (!hasImage) {
            toast.error('Please provide at least one image URL', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
            return;
        }

        try {
            const result = await addProduct({
                ...product,
                price: parseFloat(product.price),
                stock: parseInt(product.stock) || 0,
                reserved: parseInt(product.reserved) || 0
            });
            
            if (result.success) {
                // Reset form
                setProduct({
                    title: '',
                    price: '',
                    imageUrls: ['', '', '', '', ''],
                    modelUrls: ['', '', ''], // Reset 3D model URLs
                    category: '',
                    description: '',
                    stock: 0,
                    reserved: 0
                });
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex justify-center items-center py-10">
                <div className="bg-white/80 backdrop-blur-sm border border-blue-100 px-10 py-10 rounded-2xl shadow-xl w-full max-w-2xl">
                    <div className="mb-6">
                        <h1 className="text-center text-gray-900 text-2xl font-bold">Add Product</h1>
                        <p className="text-center text-gray-600 text-sm mt-2">Fill in the details to add a new product</p>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Product Title</label>
                            <input
                                type="text"
                                name="title"
                                value={product.title}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 px-4 py-3 w-full rounded-lg text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter product title"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Product Price</label>
                            <input
                                type="number"
                                name="price"
                                value={product.price}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 px-4 py-3 w-full rounded-lg text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter product price"
                            />
                        </div>

                        {/* Multiple Image URLs */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Product Images (Up to 5)</label>
                            {[0, 1, 2, 3, 4].map((index) => (
                                <div key={index} className="mb-2">
                                    <input
                                        type="text"
                                        value={product.imageUrls[index]}
                                        onChange={(e) => handleImageChange(index, e.target.value)}
                                        className="bg-gray-50 border border-gray-300 px-4 py-3 w-full rounded-lg text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder={`Enter image URL ${index + 1}`}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* 3D Model URLs */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">3D Models (Up to 3)</label>
                            <p className="text-gray-500 text-xs mb-2">Enter URLs for 3D model viewers (e.g., Sketchfab links)</p>
                            {[0, 1, 2].map((index) => (
                                <div key={index} className="mb-2">
                                    <input
                                        type="text"
                                        value={product.modelUrls[index]}
                                        onChange={(e) => handleModelChange(index, e.target.value)}
                                        className="bg-gray-50 border border-gray-300 px-4 py-3 w-full rounded-lg text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder={`Enter 3D model URL ${index + 1}`}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Product Category</label>
                            <select
                                name="category"
                                value={product.category}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 px-4 py-3 w-full rounded-lg text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select a category</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Home & Living">Home & Living</option>
                                <option value="Books">Books</option>
                                <option value="Sports">Sports</option>
                                <option value="Beauty">Beauty</option>
                                <option value="Toys">Toys</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Stock Quantity</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={product.stock}
                                    onChange={handleChange}
                                    className="bg-gray-50 border border-gray-300 px-4 py-3 w-full rounded-lg text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Reserved</label>
                                <input
                                    type="number"
                                    name="reserved"
                                    value={product.reserved}
                                    onChange={handleChange}
                                    className="bg-gray-50 border border-gray-300 px-4 py-3 w-full rounded-lg text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0"
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Product Description</label>
                            <textarea
                                cols="30"
                                rows="6"
                                name="description"
                                value={product.description}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 px-4 py-3 w-full rounded-lg text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                placeholder="Enter product description"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-4 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Adding...' : 'Add Product'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                disabled={loading}
                                className="flex-1 bg-gray-200 text-gray-700 font-bold px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default AddProduct;