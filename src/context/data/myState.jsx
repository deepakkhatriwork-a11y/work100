import React, { useState, useEffect, useMemo, useCallback } from 'react';
import myContext from './myContext';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where, getDoc } from 'firebase/firestore';
import { fireDB } from '../../firebase/firebaseConfig';
import { toast } from 'react-toastify';

const MyState = (props) => {
    // Initialize mode from localStorage or default to 'light'
    const [mode, setMode] = useState(() => {
        const savedMode = localStorage.getItem('themeMode');
        return savedMode || 'light';
    });
    
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchkey, setSearchkey] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterPrice, setFilterPrice] = useState('');
    const [order, setOrder] = useState([]);
    const [user, setUser] = useState([]);
    const [refundRequests, setRefundRequests] = useState([]);

    // Apply theme on mount and mode change
    useEffect(() => {
        if (mode === 'dark') {
            document.documentElement.classList.add('dark');
            document.body.style.backgroundColor = "rgb(17, 24, 39)";
        } else {
            document.documentElement.classList.remove('dark');
            document.body.style.backgroundColor = "white";
        }
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    // Log when order state changes
    useEffect(() => {
        console.log('Order state updated:', order);
    }, [order]);

    // Fetch products when component mounts
    useEffect(() => {
        getProduct();
        // Reduce delay for other data fetching to improve initial load time
        const timer = setTimeout(() => {
            getUserData();
            getOrderData();
            getRefundRequests();
        }, 300);
        
        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleMode = () => {
        setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
    };

    // Get Product Function with caching
    const getProduct = useCallback(async () => {
        // Check if products are already loaded
        if (products.length > 0) {
            return;
        }
        
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(fireDB, 'products'));
            const productsArray = [];
            querySnapshot.forEach((doc) => {
                productsArray.push({ id: doc.id, ...doc.data() });
            });
            setProducts(productsArray);
            setFilteredProducts(productsArray);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    }, [products.length]);

    // Add Product Function
    const addProduct = async (product) => {
        setLoading(true);
        try {
            const productData = {
                ...product,
                date: new Date().toLocaleString(
                    "en-US",
                    {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                    }
                )
            };
            
            await addDoc(collection(fireDB, 'products'), productData);
            toast.success('Product added successfully');
            getProduct(); // Refresh products list
            setLoading(false);
            return { success: true };
        } catch (error) {
            console.error('Error adding product:', error);
            toast.error('Failed to add product');
            setLoading(false);
            return { success: false, error };
        }
    };

    // Update Product Function
    const updateProduct = async (id, updatedProduct) => {
        setLoading(true);
        try {
            const productRef = doc(fireDB, 'products', id);
            await updateDoc(productRef, updatedProduct);
            toast.success('Product updated successfully');
            getProduct(); // Refresh products list
            setLoading(false);
            return { success: true };
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Failed to update product');
            setLoading(false);
            return { success: false, error };
        }
    };

    // Get Single Product Function
    const getSingleProduct = async (id) => {
        setLoading(true);
        try {
            const productDoc = await getDoc(doc(fireDB, 'products', id));
            if (productDoc.exists()) {
                const productData = { id: productDoc.id, ...productDoc.data() };
                setLoading(false);
                return { success: true, data: productData };
            } else {
                toast.error('Product not found');
                setLoading(false);
                return { success: false, error: 'Product not found' };
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error('Failed to fetch product');
            setLoading(false);
            return { success: false, error };
        }
    };

    // Get Order Data Function
    const getOrderData = async () => {
        // Skip if already loaded
        if (order.length > 0) {
            return { success: true, data: order };
        }
        
        setLoading(true);
        try {
            console.log('Fetching all orders from Firestore...');
            const querySnapshot = await getDocs(collection(fireDB, 'orders'));
            const ordersArray = [];
            querySnapshot.forEach((doc) => {
                ordersArray.push({ id: doc.id, ...doc.data() });
            });
            setOrder(ordersArray);
            setLoading(false);
            console.log('Fetched orders:', ordersArray);
            console.log('Order state updated:', ordersArray);
            return { success: true, data: ordersArray };
        } catch (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);
            return { success: false, error };
        }
    };

    // Get User Orders Function
    const getUserOrders = async (userId) => {
        setLoading(true);
        try {
            console.log('Fetching user orders from Firestore...');
            // Query orders where userid matches the current user's ID
            const q = query(collection(fireDB, 'orders'), where('userid', '==', userId));
            const querySnapshot = await getDocs(q);
            const ordersArray = [];
            querySnapshot.forEach((doc) => {
                ordersArray.push({ id: doc.id, ...doc.data() });
            });
            setOrder(ordersArray);
            setLoading(false);
            console.log('Fetched user orders:', ordersArray);
            console.log('Order state updated:', ordersArray);
            return { success: true, data: ordersArray };
        } catch (error) {
            console.error('Error fetching user orders:', error);
            setLoading(false);
            return { success: false, error };
        }
    };

    // Update Order Function
    const updateOrder = async (id, updatedData) => {
        setLoading(true);
        try {
            const orderRef = doc(fireDB, 'orders', id);
            await updateDoc(orderRef, updatedData);
            toast.success('Order updated successfully');
            getOrderData(); // Refresh orders list
            setLoading(false);
            return { success: true };
        } catch (error) {
            console.error('Error updating order:', error);
            toast.error('Failed to update order');
            setLoading(false);
            return { success: false, error };
        }
    };

    // Delete Order Function
    const deleteOrder = async (id) => {
        setLoading(true);
        try {
            await deleteDoc(doc(fireDB, 'orders', id));
            toast.success('Order deleted successfully');
            getOrderData(); // Refresh orders list
            setLoading(false);
            return { success: true };
        } catch (error) {
            console.error('Error deleting order:', error);
            toast.error('Failed to delete order');
            setLoading(false);
            return { success: false, error };
        }
    };

    // Get User Data Function
    const getUserData = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(fireDB, 'users'));
            const usersArray = [];
            querySnapshot.forEach((doc) => {
                usersArray.push({ id: doc.id, ...doc.data() });
            });
            setUser(usersArray);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    // Delete Product Function
    const deleteProduct = async (id) => {
        setLoading(true);
        try {
            await deleteDoc(doc(fireDB, 'products', id));
            toast.success('Product deleted successfully');
            getProduct(); // Refresh products list
            setLoading(false);
            return { success: true };
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to delete product');
            setLoading(false);
            return { success: false, error };
        }
    };

    // Get Refund Requests Function
    const getRefundRequests = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(fireDB, 'refundRequests'));
            const refundRequestsArray = [];
            querySnapshot.forEach((doc) => {
                refundRequestsArray.push({ id: doc.id, ...doc.data() });
            });
            setRefundRequests(refundRequestsArray);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching refund requests:', error);
            setLoading(false);
        }
    };

    // Add Refund Request Function
    const addRefundRequest = async (refundData) => {
        setLoading(true);
        try {
            await addDoc(collection(fireDB, 'refundRequests'), refundData);
            toast.success('Refund request submitted successfully');
            getRefundRequests(); // Refresh refund requests list
            setLoading(false);
            return { success: true };
        } catch (error) {
            console.error('Error adding refund request:', error);
            toast.error('Failed to submit refund request');
            setLoading(false);
            return { success: false, error };
        }
    };

    // Update Refund Request Function
    const updateRefundRequest = async (id, updatedData) => {
        setLoading(true);
        try {
            const refundRequestRef = doc(fireDB, 'refundRequests', id);
            await updateDoc(refundRequestRef, updatedData);
            toast.success('Refund request updated successfully');
            getRefundRequests(); // Refresh refund requests list
            setLoading(false);
            return { success: true };
        } catch (error) {
            console.error('Error updating refund request:', error);
            toast.error('Failed to update refund request');
            setLoading(false);
            return { success: false, error };
        }
    };

    const contextValue = useMemo(() => ({
        mode,
        toggleMode,
        loading,
        setLoading,
        products,
        setProducts,
        filteredProducts,
        setFilteredProducts,
        searchkey, 
        setSearchkey,
        filterType, 
        setFilterType,
        filterPrice, 
        setFilterPrice,
        order,
        setOrder,
        getOrderData,
        getUserOrders,
        updateOrder,
        deleteOrder,
        addProduct,
        deleteProduct,
        getProduct,
        updateProduct, // Added update product function
        getSingleProduct, // Added get single product function
        user,
        setUser,
        getUserData,
        refundRequests,
        setRefundRequests,
        getRefundRequests,
        addRefundRequest,
        updateRefundRequest
    }), [
        mode, 
        loading, 
        products, 
        filteredProducts, 
        searchkey, 
        filterType, 
        filterPrice, 
        order, 
        user, 
        refundRequests
    ]);

    return (
        <myContext.Provider value={contextValue}>
            {props.children}
        </myContext.Provider>
    );
};

export default MyState;