import React, { useContext, useEffect, useState } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import myContext from '../../../context/data/myContext';
import Layout from '../../../components/layout/Layout';
import { MdOutlineProductionQuantityLimits } from 'react-icons/md'
import { FaUser, FaCartPlus } from 'react-icons/fa';
import { AiFillShopping, AiFillPlusCircle, AiFillDelete } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

function AdminDashboardTab() {
    const context = useContext(myContext)
    const { mode, product, edithandle, deleteProduct, order, getOrderData, updateOrder, user, getUserData, refundRequests, getRefundRequests, updateRefundRequest } = context
    let [isOpen, setIsOpen] = useState(false);
    const [refundRequestsError, setRefundRequestsError] = useState(null);
    
    useEffect(() => {
        getOrderData();
        getUserData();
        
        // Try to fetch refund requests, but handle errors gracefully
        getRefundRequests()
            .then(result => {
                if (!result.success) {
                    setRefundRequestsError(result.error);
                }
            })
            .catch(error => {
                console.error('Error fetching refund requests:', error);
                setRefundRequestsError(error);
            });
    }, []);

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    const goToAdd = () => {
        window.location.href = '/add-product'
    }

    // Function to update order status
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await updateOrder(orderId, { status: newStatus });
            toast.success('Order status updated successfully');
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('Failed to update order status');
        }
    };

    // Function to update refund request status
    const updateRefundStatus = async (refundId, newStatus) => {
        try {
            await updateRefundRequest(refundId, { status: newStatus, processed: true });
            toast.success('Refund request updated successfully');
        } catch (error) {
            console.error('Error updating refund request:', error);
            toast.error('Failed to update refund request');
        }
    };

    // Function to generate and download invoice
    const downloadInvoice = (orderItem) => {
        try {
            const doc = new jsPDF();
            
            // Add title
            doc.setFontSize(20);
            doc.text('INVOICE', 105, 20, null, null, 'center');
            
            // Add company info
            doc.setFontSize(12);
            doc.text('Titanium Store', 20, 30);
            doc.text('Bikaner, Rajasthan, India', 20, 37);
            doc.text('Email: contact@titaniumstore.com', 20, 44);
            
            // Add invoice info
            doc.setFontSize(12);
            doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 150, 30);
            doc.text(`Order ID: ${orderItem.orderId || orderItem.id?.substring(0, 8) || orderItem.paymentId?.substring(0, 8) || 'N/A'}`, 150, 37);
            doc.text(`Order Date: ${orderItem.date || 'N/A'}`, 150, 44);
            
            // Add customer info
            doc.setFontSize(14);
            doc.text('Bill To:', 20, 60);
            doc.setFontSize(12);
            doc.text(orderItem.addressInfo?.name || 'N/A', 20, 67);
            doc.text(orderItem.addressInfo?.address || 'N/A', 20, 74);
            doc.text(`${orderItem.addressInfo?.city || ''}, ${orderItem.addressInfo?.state || ''} ${orderItem.addressInfo?.pincode || ''}`, 20, 81);
            doc.text(`Phone: ${orderItem.addressInfo?.phoneNumber || 'N/A'}`, 20, 88);
            
            // Add items table
            const tableColumn = ["#", "Item", "Quantity", "Price", "Total"];
            const tableRows = [];
            
            orderItem.cartItems?.forEach((item, index) => {
                const itemData = [
                    index + 1,
                    item.title || item.name || 'Unknown Item',
                    item.quantity || 1,
                    `₹${item.price || 0}`,
                    `₹${(item.price || 0) * (item.quantity || 1)}`
                ];
                tableRows.push(itemData);
            });
            
            // Add shipping charges row if applicable
            if (orderItem.shippingCharges > 0) {
                tableRows.push(['', '', '', 'Shipping Charges', `₹${orderItem.shippingCharges}`]);
            }
            
            // Add total row
            tableRows.push(['', '', '', 'Total Amount', `₹${orderItem.totalAmount || orderItem.total || 0}`]);
            
            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: 95,
                styles: { fontSize: 10 },
                headStyles: { fillColor: [66, 66, 66] },
                theme: 'grid'
            });
            
            // Add payment method
            const finalY = doc.lastAutoTable.finalY;
            doc.text(`Payment Method: ${orderItem.paymentMethod || 'N/A'}`, 20, finalY + 10);
            doc.text(`Payment Status: ${orderItem.status || 'Processing'}`, 20, finalY + 17);
            
            // Save the PDF
            doc.save(`invoice-${orderItem.orderId || orderItem.id?.substring(0, 8) || orderItem.paymentId?.substring(0, 8) || 'order'}.pdf`);
            
            toast.success('Invoice downloaded successfully!');
        } catch (error) {
            console.error('Error generating invoice:', error);
            toast.error('Failed to generate invoice');
        }
    };

    return (
        <div className="container mx-auto px-4">
            <Tabs defaultIndex={0} className="mt-8">
                <TabList className="md:flex md:space-x-8 bg-gray-100 grid grid-cols-2 text-center gap-4 md:justify-center mb-10 rounded-lg p-2">
                    <Tab>
                        <button type="button" className="font-medium border-b-2 hover:shadow-purple-700 border-purple-500 text-purple-500 rounded-lg text-xl shadow-[inset_0_0_8px_rgba(0,0,0,0.6)] px-5 py-1.5 text-center bg-[#605d5d12] w-full">
                            <div className="flex gap-2 items-center justify-center">
                                <MdOutlineProductionQuantityLimits />Products
                            </div>
                        </button>
                    </Tab>
                    <Tab>
                        <button type="button" className="font-medium border-b-2 border-pink-500 bg-[#605d5d12] text-pink-500 hover:shadow-pink-700 rounded-lg text-xl shadow-[inset_0_0_8px_rgba(0,0,0,0.6)] px-5 py-1.5 text-center w-full">
                            <div className="flex gap-2 items-center justify-center">
                                <AiFillShopping /> Orders
                            </div>
                        </button>
                    </Tab>
                    <Tab>
                        <button type="button" className="font-medium border-b-2 border-green-500 bg-[#605d5d12] text-green-500 rounded-lg text-xl hover:shadow-green-700 shadow-[inset_0_0_8px_rgba(0,0,0,0.6)] px-5 py-1.5 text-center w-full">
                            <div className="flex gap-2 items-center justify-center">
                                <FaUser /> Users
                            </div>
                        </button>
                    </Tab>
                    <Tab>
                        <button type="button" className="font-medium border-b-2 border-yellow-500 bg-[#605d5d12] text-yellow-500 rounded-lg text-xl hover:shadow-yellow-700 shadow-[inset_0_0_8px_rgba(0,0,0,0.6)] px-5 py-1.5 text-center w-full">
                            <div className="flex gap-2 items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Refunds
                            </div>
                        </button>
                    </Tab>
                </TabList>

                {/* Products Tab */}
                <TabPanel>
                    <div className='px-4 md:px-0 mb-16'>
                        <h1 className="text-center mb-5 text-3xl font-semibold underline" style={{ color: mode === 'dark' ? 'white' : '' }}>Product Details</h1>
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={goToAdd}
                                type="button"
                                className="focus:outline-none text-white bg-pink-600 shadow-[inset_0_0_10px_rgba(0,0,0,0.6)] border hover:bg-pink-700 outline-0 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
                                style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '', color: mode === 'dark' ? 'white' : '' }}
                            >
                                <div className="flex gap-2 items-center">
                                    Add Product <FaCartPlus size={20} />
                                </div>
                            </button>
                        </div>
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs border border-gray-600 text-black uppercase bg-gray-200 shadow-[inset_0_0_8px_rgba(0,0,0,0.6)]" style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '', color: mode === 'dark' ? 'white' : '' }}>
                                    <tr>
                                        <th scope="col" className="px-6 py-3">S.No</th>
                                        <th scope="col" className="px-6 py-3">Image</th>
                                        <th scope="col" className="px-6 py-3">Title</th>
                                        <th scope="col" className="px-6 py-3">Price</th>
                                        <th scope="col" className="px-6 py-3">Category</th>
                                        <th scope="col" className="px-6 py-3">Date</th>
                                        <th scope="col" className="px-6 py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {product.map((item, index) => {
                                        const { id, title, price, imageUrl, category, date } = item;
                                        return (
                                            <tr key={id} className="bg-gray-50 border-b dark:border-gray-700" style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '', color: mode === 'dark' ? 'white' : '' }}>
                                                <td className="px-6 py-4 text-black" style={{ color: mode === 'dark' ? 'white' : '' }}>
                                                    {index + 1}.
                                                </td>
                                                <th scope="row" className="px-6 py-4 font-medium text-black whitespace-nowrap">
                                                    <img className='w-16' src={imageUrl} alt="img" />
                                                </th>
                                                <td className="px-6 py-4 text-black" style={{ color: mode === 'dark' ? 'white' : '' }}>
                                                    {title}
                                                </td>
                                                <td className="px-6 py-4 text-black" style={{ color: mode === 'dark' ? 'white' : '' }}>
                                                    ₹{price}
                                                </td>
                                                <td className="px-6 py-4 text-black" style={{ color: mode === 'dark' ? 'white' : '' }}>
                                                    {category}
                                                </td>
                                                <td className="px-6 py-4 text-black" style={{ color: mode === 'dark' ? 'white' : '' }}>
                                                    {date}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <div className="flex gap-2 cursor-pointer text-black" style={{ color: mode === 'dark' ? 'white' : '' }}>
                                                            <div onClick={() => deleteProduct(item)}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <Link to={'/update-product'} onClick={() => edithandle(item)}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                                    </svg>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </TabPanel>

                {/* Orders Tab */}
                <TabPanel>
                    <div className="relative overflow-x-auto mb-16">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-center mb-5 text-3xl font-semibold underline" style={{ color: mode === 'dark' ? 'white' : '' }}>Order Details</h1>
                            <div className="flex gap-2">
                                <button 
                                    onClick={getOrderData}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                >
                                    Refresh Orders
                                </button>
                            </div>
                        </div>
                        {order.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No orders found</p>
                                <button 
                                    onClick={getOrderData}
                                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Refresh Orders
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {order.map((orderItem, index) => (
                                    <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '', color: mode === 'dark' ? 'white' : '' }}>
                                        <div className="p-6">
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                                <div>
                                                    <h2 className="text-lg font-semibold text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>
                                                        Order #{orderItem.orderId || orderItem.id?.substring(0, 8) || orderItem.paymentId?.substring(0, 8) || 'N/A'}
                                                        {/* Show "NEW" badge for orders placed in the last 24 hours */}
                                                        {(() => {
                                                            const orderDate = new Date(orderItem.date || orderItem.orderTimestamp);
                                                            const now = new Date();
                                                            const diffHours = Math.abs(now - orderDate) / 36e5; // 36e5 is the number of milliseconds in an hour
                                                            
                                                            if (diffHours <= 24) {
                                                                return (
                                                                    <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                        NEW
                                                                    </span>
                                                                );
                                                            }
                                                            return null;
                                                        })()}
                                                    </h2>
                                                    <p className="text-sm text-gray-500" style={{ color: mode === 'dark' ? 'gray' : '' }}>
                                                        {orderItem.date || 'N/A'}
                                                    </p>
                                                </div>
                                                <div className="mt-2 md:mt-0">
                                                    <select 
                                                        value={orderItem.status || 'Processing'}
                                                        onChange={(e) => updateOrderStatus(orderItem.id, e.target.value)}
                                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                                        style={{ backgroundColor: mode === 'dark' ? 'rgb(56 65 89)' : '', color: mode === 'dark' ? 'white' : '' }}
                                                    >
                                                        <option value="Processing">Processing</option>
                                                        <option value="Shipped">Shipped</option>
                                                        <option value="Delivered">Delivered</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                </div>
                                            </div>
                                            
                                            <div className="border-t border-gray-200 pt-4" style={{ borderColor: mode === 'dark' ? 'rgb(75 85 99)' : '' }}>
                                                <h3 className="text-md font-medium text-gray-900 mb-2" style={{ color: mode === 'dark' ? 'white' : '' }}>Items</h3>
                                                <div className="space-y-3">
                                                    {orderItem.cartItems?.map((item, itemIndex) => (
                                                        <div key={itemIndex} className="flex items-center">
                                                            <img 
                                                                src={item.imageUrl || item.image || 'https://placehold.co/400x400/cccccc/ffffff?text=No+Image'} 
                                                                alt={item.title} 
                                                                className="h-16 w-16 object-cover rounded-md"
                                                                onError={(e) => {
                                                                  e.target.src = 'https://placehold.co/400x400/cccccc/ffffff?text=No+Image';
                                                                }}
                                                            />
                                                            <div className="ml-4 flex-1">
                                                                <h4 className="text-sm font-medium text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>{item.title}</h4>
                                                                <p className="text-sm text-gray-500" style={{ color: mode === 'dark' ? 'gray' : '' }}>Quantity: {item.quantity || 1}</p>
                                                            </div>
                                                            <p className="text-sm font-medium text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>₹{item.price}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            <div className="border-t border-gray-200 pt-4 mt-4" style={{ borderColor: mode === 'dark' ? 'rgb(75 85 99)' : '' }}>
                                                <div className="flex justify-between">
                                                    <p className="text-gray-600" style={{ color: mode === 'dark' ? 'gray' : '' }}>Total</p>
                                                    <p className="text-lg font-semibold text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>₹{orderItem.totalAmount || orderItem.total || 'N/A'}</p>
                                                </div>
                                                {orderItem.paymentMethod && (
                                                    <div className="flex justify-between mt-2">
                                                        <p className="text-gray-600" style={{ color: mode === 'dark' ? 'gray' : '' }}>Payment Method</p>
                                                        <p className="text-sm font-medium text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>{orderItem.paymentMethod}</p>
                                                    </div>
                                                )}
                                                <div className="flex justify-between mt-2">
                                                    <p className="text-gray-600" style={{ color: mode === 'dark' ? 'gray' : '' }}>Order Status</p>
                                                    <p className="text-sm font-medium text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>{orderItem.status || 'Processing'}</p>
                                                </div>
                                                <div className="mt-4">
                                                    <button
                                                        onClick={() => downloadInvoice(orderItem)}
                                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                                    >
                                                        Download Invoice
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <div className="border-t border-gray-200 pt-4 mt-4" style={{ borderColor: mode === 'dark' ? 'rgb(75 85 99)' : '' }}>
                                                <h3 className="text-md font-medium text-gray-900 mb-2" style={{ color: mode === 'dark' ? 'white' : '' }}>Shipping Information</h3>
                                                <div className="text-sm text-gray-600" style={{ color: mode === 'dark' ? 'gray' : '' }}>
                                                    <p>{orderItem.addressInfo?.name || 'N/A'}</p>
                                                    <p>{orderItem.addressInfo?.address || 'N/A'}</p>
                                                    <p>{orderItem.addressInfo?.pincode || 'N/A'}</p>
                                                    <p>Phone: {orderItem.addressInfo?.phoneNumber || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </TabPanel>

                {/* Users Tab */}
                <TabPanel>
                    <div className="mb-16">
                        <h1 className="text-center mb-5 text-3xl font-semibold underline" style={{ color: mode === 'dark' ? 'white' : '' }}>User Details</h1>
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs border border-gray-600 text-black uppercase bg-gray-200 shadow-[inset_0_0_8px_rgba(0,0,0,0.6)]" style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '', color: mode === 'dark' ? 'white' : '' }}>
                                    <tr>
                                        <th scope="col" className="px-6 py-3">S.No</th>
                                        <th scope="col" className="px-6 py-3">User ID</th>
                                        <th scope="col" className="px-6 py-3">Name</th>
                                        <th scope="col" className="px-6 py-3">Email</th>
                                        <th scope="col" className="px-6 py-3">Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {user.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-4">No users found</td>
                                        </tr>
                                    ) : (
                                        user.map((userData, index) => (
                                            <tr key={index} className="bg-gray-50 border-b dark:border-gray-700" style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '', color: mode === 'dark' ? 'white' : '' }}>
                                                <td className="px-6 py-4 text-black" style={{ color: mode === 'dark' ? 'white' : '' }}>{index + 1}.</td>
                                                <td className="px-6 py-4 text-black" style={{ color: mode === 'dark' ? 'white' : '' }}>{userData.id || 'N/A'}</td>
                                                <td className="px-6 py-4 text-black" style={{ color: mode === 'dark' ? 'white' : '' }}>{userData.name || userData.displayName || 'N/A'}</td>
                                                <td className="px-6 py-4 text-black" style={{ color: mode === 'dark' ? 'white' : '' }}>{userData.email || 'N/A'}</td>
                                                <td className="px-6 py-4 text-black" style={{ color: mode === 'dark' ? 'white' : '' }}>
                                                    <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                                                        {userData.role || 'user'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </TabPanel>

                {/* Refund Requests Tab */}
                <TabPanel>
                    <div className="mb-16">
                        <h1 className="text-center mb-5 text-3xl font-semibold underline" style={{ color: mode === 'dark' ? 'white' : '' }}>Refund Requests</h1>
                        <div className="relative overflow-x-auto">
                            {refundRequestsError ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Unable to load refund requests due to permissions.</p>
                                    <p className="text-sm text-gray-400 mt-2">Make sure you have the correct Firebase security rules configured.</p>
                                </div>
                            ) : refundRequests.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No refund requests found</p>
                                    <button 
                                        onClick={() => {
                                            getRefundRequests()
                                                .then(result => {
                                                    if (!result.success) {
                                                        setRefundRequestsError(result.error);
                                                    } else {
                                                        setRefundRequestsError(null);
                                                    }
                                                })
                                                .catch(error => {
                                                    console.error('Error fetching refund requests:', error);
                                                    setRefundRequestsError(error);
                                                });
                                        }}
                                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Refresh Refund Requests
                                    </button>
                                </div>
                            ) : (
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs border border-gray-600 text-black uppercase bg-gray-200 shadow-[inset_0_0_8px_rgba(0,0,0,0.6)]" style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '', color: mode === 'dark' ? 'white' : '' }}>
                                        <tr>
                                            <th scope="col" className="px-6 py-3">S.No</th>
                                            <th scope="col" className="px-6 py-3">Order ID</th>
                                            <th scope="col" className="px-6 py-3">User</th>
                                            <th scope="col" className="px-6 py-3">Amount</th>
                                            <th scope="col" className="px-6 py-3">Request Date</th>
                                            <th scope="col" className="px-6 py-3">Status</th>
                                            <th scope="col" className="px-6 py-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {refundRequests.map((refund, index) => (
                                            <tr key={index} className="bg-gray-50 border-b dark:border-gray-700" style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '', color: mode === 'dark' ? 'white' : '' }}>
                                                <td className="px-6 py-4 text-black" style={{ color: mode === 'dark' ? 'white' : '' }}>{index + 1}.</td>
                                                <td className="px-6 py-4 text-black" style={{ color: mode === 'dark' ? 'white' : '' }}>
                                                    {refund.orderId?.substring(0, 8) || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-black" style={{ color: mode === 'dark' ? 'white' : '' }}>
                                                    {refund.userName || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-black" style={{ color: mode === 'dark' ? 'white' : '' }}>
                                                    ₹{refund.refundAmount || '0'}
                                                </td>
                                                <td className="px-6 py-4 text-black" style={{ color: mode === 'dark' ? 'white' : '' }}>
                                                    {refund.requestDate ? new Date(refund.requestDate).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 text-xs rounded ${
                                                        refund.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        refund.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                        refund.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {refund.status || 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {refund.status === 'Pending' ? (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => updateRefundStatus(refund.id, 'Approved')}
                                                                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => updateRefundStatus(refund.id, 'Rejected')}
                                                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-gray-500">
                                                            {refund.processed ? 'Processed' : 'N/A'}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </TabPanel>
            </Tabs>
        </div>
    )
}

export default AdminDashboardTab;