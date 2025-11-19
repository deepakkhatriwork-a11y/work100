import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/layout/Layout';
import { toast } from 'react-toastify';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';

function ManageAdvertisements() {
    const navigate = useNavigate();
    
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingAd, setEditingAd] = useState(null);
    
    const [adForm, setAdForm] = useState({
        title: '',
        imageUrl: '',
        targetUrl: '',
        position: 'hero',
        isActive: true
    });

    // Fetch all advertisements
    const fetchAdvertisements = async () => {
        try {
            setLoading(true);
            const querySnapshot = await getDocs(collection(db, 'advertisements'));
            const adsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAds(adsData);
        } catch (error) {
            console.error('Error fetching advertisements:', error);
            toast.error('Failed to fetch advertisements');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdvertisements();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAdForm({
            ...adForm,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!adForm.title || !adForm.imageUrl || !adForm.targetUrl) {
            toast.error('Please fill all required fields');
            return;
        }

        try {
            if (editingAd) {
                // Update existing ad
                await updateDoc(doc(db, 'advertisements', editingAd.id), adForm);
                toast.success('Advertisement updated successfully');
            } else {
                // Add new ad
                await addDoc(collection(db, 'advertisements'), {
                    ...adForm,
                    createdAt: new Date().toISOString()
                });
                toast.success('Advertisement added successfully');
            }
            
            // Reset form
            setAdForm({
                title: '',
                imageUrl: '',
                targetUrl: '',
                position: 'hero',
                isActive: true
            });
            setEditingAd(null);
            fetchAdvertisements();
        } catch (error) {
            console.error('Error saving advertisement:', error);
            toast.error('Failed to save advertisement');
        }
    };

    const handleEdit = (ad) => {
        setEditingAd(ad);
        setAdForm({
            title: ad.title,
            imageUrl: ad.imageUrl,
            targetUrl: ad.targetUrl,
            position: ad.position || 'hero',
            isActive: ad.isActive !== undefined ? ad.isActive : true
        });
    };

    const handleDelete = async (adId) => {
        if (window.confirm('Are you sure you want to delete this advertisement?')) {
            try {
                await deleteDoc(doc(db, 'advertisements', adId));
                toast.success('Advertisement deleted successfully');
                fetchAdvertisements();
                
                // If we were editing this ad, reset the form
                if (editingAd && editingAd.id === adId) {
                    setEditingAd(null);
                    setAdForm({
                        title: '',
                        imageUrl: '',
                        targetUrl: '',
                        position: 'hero',
                        isActive: true
                    });
                }
            } catch (error) {
                console.error('Error deleting advertisement:', error);
                toast.error('Failed to delete advertisement');
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingAd(null);
        setAdForm({
            title: '',
            imageUrl: '',
            targetUrl: '',
            position: 'hero',
            isActive: true
        });
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Manage Advertisements</h1>
                        <p className="text-gray-600 mt-2">Add, edit, and manage your store advertisements</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Form Section */}
                        <div className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                {editingAd ? 'Edit Advertisement' : 'Add New Advertisement'}
                            </h2>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={adForm.title}
                                        onChange={handleChange}
                                        className="bg-gray-50 border border-gray-300 px-4 py-3 w-full rounded-lg text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter advertisement title"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Image URL *</label>
                                    <input
                                        type="text"
                                        name="imageUrl"
                                        value={adForm.imageUrl}
                                        onChange={handleChange}
                                        className="bg-gray-50 border border-gray-300 px-4 py-3 w-full rounded-lg text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter image URL"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Target URL *</label>
                                    <input
                                        type="text"
                                        name="targetUrl"
                                        value={adForm.targetUrl}
                                        onChange={handleChange}
                                        className="bg-gray-50 border border-gray-300 px-4 py-3 w-full rounded-lg text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter target URL"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Position</label>
                                    <select
                                        name="position"
                                        value={adForm.position}
                                        onChange={handleChange}
                                        className="bg-gray-50 border border-gray-300 px-4 py-3 w-full rounded-lg text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="hero">Hero Section</option>
                                        <option value="sidebar">Sidebar</option>
                                        <option value="footer">Footer</option>
                                        <option value="product-page">Product Page</option>
                                    </select>
                                </div>

                                <div className="mb-6 flex items-center">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={adForm.isActive}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label className="ml-2 block text-gray-700 text-sm">
                                        Active Advertisement
                                    </label>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-4 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (editingAd ? 'Updating...' : 'Adding...') : (editingAd ? 'Update Advertisement' : 'Add Advertisement')}
                                    </button>
                                    
                                    {editingAd && (
                                        <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            disabled={loading}
                                            className="flex-1 bg-gray-200 text-gray-700 font-bold px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Advertisements List */}
                        <div className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Current Advertisements</h2>
                                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                                    {ads.length} ads
                                </span>
                            </div>

                            {loading ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-600">Loading advertisements...</p>
                                </div>
                            ) : ads.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-600">No advertisements found</p>
                                    <p className="text-gray-500 text-sm mt-2">Add your first advertisement using the form</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {ads.map((ad) => (
                                        <div key={ad.id} className="border border-blue-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-start gap-4">
                                                <img 
                                                    src={ad.imageUrl} 
                                                    alt={ad.title} 
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                    onError={(e) => {
                                                        e.target.src = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1173&q=80';
                                                    }}
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h3 className="font-medium text-gray-900">{ad.title}</h3>
                                                            <p className="text-sm text-gray-500 mt-1">Position: {ad.position || 'hero'}</p>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <span className={`text-xs px-2 py-1 rounded-full ${ad.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                    {ad.isActive ? 'Active' : 'Inactive'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleEdit(ad)}
                                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(ad.id)}
                                                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default ManageAdvertisements;