import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/layout/Layout';
import myContext from '../../../context/data/myContext';
import { toast } from 'react-toastify';

function AddRequestedProducts() {
    const navigate = useNavigate();
    const context = useContext(myContext);
    const { addProduct, loading } = context;
    
    const [isAdding, setIsAdding] = useState(false);
    const [addedCount, setAddedCount] = useState(0);

    // 5 sample products
    const requestedProducts = [
        {
            title: "Arduino Uno R3",
            price: 700,
            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Arduino_Uno_-_R3.jpg/250px-Arduino_Uno_-_R3.jpg",
            category: "Electronics",
            description: "Arduino Uno R3 is a microcontroller board based on the ATmega328P. It has 14 digital input/output pins (of which 6 can be used as PWM outputs), 6 analog inputs, a 16 MHz ceramic resonator, a USB connection, a power jack, an ICSP header and a reset button. It contains everything needed to support the microcontroller; simply connect it to a computer with a USB cable or power it with a AC-to-DC adapter or battery to get started.",
            stock: 25,
            reserved: 2
        },
        {
            title: "Lithium Ion Battery (5 pieces)",
            price: 700,
            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Arduino_Uno_-_R3.jpg/250px-Arduino_Uno_-_R3.jpg",
            category: "Electronics",
            description: "Pack of 5 Lithium Ion Batteries (18650) - 3.7V 2600mAh Rechargeable Batteries for Flashlights, Vapes, Mods, and other electronic devices. These high-capacity lithium-ion batteries are perfect for powering your electronic projects, portable devices, and DIY electronics. Each battery comes with built-in protection circuitry to prevent overcharging, over-discharging, and short circuits.",
            stock: 30,
            reserved: 3
        },
        {
            title: "Raspberry Pi 4 Model B",
            price: 1200,
            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Arduino_Uno_-_R3.jpg/250px-Arduino_Uno_-_R3.jpg",
            category: "Electronics",
            description: "Raspberry Pi 4 Model B is the latest version of the popular single-board computer. With a quad-core 1.5GHz 64-bit ARM Cortex-A72 CPU and 4GB LPDDR4 memory, it provides desktop performance comparable to entry-level x86 PC systems. Perfect for programming, IoT projects, and media centers.",
            stock: 20,
            reserved: 1
        },
        {
            title: "Wireless Bluetooth Headphones",
            price: 850,
            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Arduino_Uno_-_R3.jpg/250px-Arduino_Uno_-_R3.jpg",
            category: "Electronics",
            description: "High-quality wireless Bluetooth headphones with noise cancellation technology. Features 30-hour battery life, comfortable over-ear design, and premium sound quality. Perfect for music lovers, travelers, and professionals who need to focus in noisy environments.",
            stock: 40,
            reserved: 5
        },
        {
            title: "Smart Fitness Tracker Watch",
            price: 999,
            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Arduino_Uno_-_R3.jpg/250px-Arduino_Uno_-_R3.jpg",
            category: "Electronics",
            description: "Advanced smart fitness tracker watch with heart rate monitoring, sleep tracking, and smartphone notifications. Water-resistant design with 7-day battery life. Tracks steps, calories, distance, and provides personalized fitness insights to help you achieve your health goals.",
            stock: 35,
            reserved: 4
        }
    ];

    const addRequestedProducts = async () => {
        setIsAdding(true);
        setAddedCount(0);
        
        try {
            for (let i = 0; i < requestedProducts.length; i++) {
                const product = requestedProducts[i];
                const result = await addProduct(product);
                
                if (result.success) {
                    setAddedCount(prev => prev + 1);
                    toast.success(`Added ${product.title}`, {
                        position: "top-right",
                        autoClose: 1000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "colored",
                    });
                } else {
                    toast.error(`Failed to add ${product.title}`, {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "colored",
                    });
                }
                
                // Add a small delay to show progress
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            toast.success(`Successfully added ${addedCount} products!`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
            
            // Navigate back to dashboard after a delay
            setTimeout(() => {
                navigate('/dashboard');
            }, 3000);
        } catch (error) {
            console.error('Error adding products:', error);
            toast.error('Failed to add products', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex justify-center items-center py-10">
                <div className="bg-white/80 backdrop-blur-sm border border-blue-100 px-10 py-10 rounded-2xl shadow-xl w-full max-w-2xl">
                    <div className="mb-6">
                        <h1 className="text-center text-gray-900 text-2xl font-bold">Add Sample Products</h1>
                        <p className="text-center text-gray-600 text-sm mt-2">Add 5 sample products to your store</p>
                    </div>
                    
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h2 className="text-lg font-semibold text-blue-800 mb-2">Product Details</h2>
                        <ul className="list-disc pl-5 text-gray-700 space-y-1">
                            <li>Arduino Uno R3 - ₹700</li>
                            <li>Lithium Ion Battery (5 pieces) - ₹700</li>
                            <li>Raspberry Pi 4 Model B - ₹1200</li>
                            <li>Wireless Bluetooth Headphones - ₹850</li>
                            <li>Smart Fitness Tracker Watch - ₹999</li>
                            <li>All in Electronics category</li>
                            <li>High-quality product images</li>
                            <li>Stock quantities for inventory management</li>
                        </ul>
                    </div>
                    
                    {isAdding ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                            <p className="text-gray-700">Adding products... ({addedCount}/{requestedProducts.length})</p>
                        </div>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={addRequestedProducts}
                                disabled={loading || isAdding}
                                className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold px-4 py-3 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add Requested Products
                            </button>
                            <button
                                onClick={() => navigate('/dashboard')}
                                disabled={loading || isAdding}
                                className="flex-1 bg-gray-200 text-gray-700 font-bold px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default AddRequestedProducts;