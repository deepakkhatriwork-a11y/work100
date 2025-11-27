import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/layout/Layout';
import myContext from '../../../context/data/myContext';
import { toast } from 'react-toastify';

function MigrateProductImages() {
    const navigate = useNavigate();
    const context = useContext(myContext);
    const { products, updateProduct, loading } = context;
    const [migrationStatus, setMigrationStatus] = useState('');

    const migrateProductImages = async () => {
        setMigrationStatus('Starting migration...');
        let migratedCount = 0;
        
        try {
            // Process each product
            for (let i = 0; i < products.length; i++) {
                const product = products[i];
                
                // Check if product already has imageUrls array
                if (!product.imageUrls) {
                    // Convert single imageUrl to imageUrls array
                    const imageUrls = [];
                    
                    // Add primary image
                    if (product.imageUrl) {
                        imageUrls.push(product.imageUrl);
                    }
                    
                    // Add additional images if they exist
                    if (product.image2) imageUrls.push(product.image2);
                    if (product.image3) imageUrls.push(product.image3);
                    if (product.image4) imageUrls.push(product.image4);
                    if (product.image5) imageUrls.push(product.image5);
                    
                    // Fill remaining slots with empty strings
                    while (imageUrls.length < 5) {
                        imageUrls.push('');
                    }
                    
                    // Update product with new imageUrls format
                    await updateProduct(product.id, {
                        ...product,
                        imageUrls: imageUrls,
                        // Remove old image fields
                        imageUrl: undefined,
                        image2: undefined,
                        image3: undefined,
                        image4: undefined,
                        image5: undefined
                    });
                    
                    migratedCount++;
                    setMigrationStatus(`Migrated ${migratedCount}/${products.length} products...`);
                }
            }
            
            toast.success(`Successfully migrated ${migratedCount} products!`);
            setMigrationStatus(`Migration complete! Migrated ${migratedCount} products.`);
        } catch (error) {
            console.error('Error migrating products:', error);
            toast.error('Failed to migrate products');
            setMigrationStatus('Migration failed');
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex justify-center items-center py-10">
                <div className="bg-white/80 backdrop-blur-sm border border-blue-100 px-10 py-10 rounded-2xl shadow-xl w-full max-w-2xl">
                    <div className="mb-6">
                        <h1 className="text-center text-gray-900 text-2xl font-bold">Migrate Product Images</h1>
                        <p className="text-center text-gray-600 text-sm mt-2">Convert existing products to use the new multi-image format</p>
                    </div>
                    
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                        <h2 className="text-lg font-semibold text-blue-800 mb-2">Migration Information</h2>
                        <p className="text-blue-700">
                            This tool will convert all existing products to use the new imageUrls format that supports up to 5 images per product.
                        </p>
                    </div>
                    
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-700 font-medium">Products to migrate:</span>
                            <span className="text-gray-900 font-bold">{products.length}</span>
                        </div>
                        
                        {migrationStatus && (
                            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                                <p className="text-gray-700">{migrationStatus}</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex gap-3">
                        <button
                            onClick={migrateProductImages}
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold px-4 py-3 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Migrating...' : 'Start Migration'}
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 bg-gray-200 text-gray-700 font-bold px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default MigrateProductImages;