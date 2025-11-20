import React, { useContext, useEffect, useState } from 'react';
import myContext from '../../../context/data/myContext';
import { formatCurrency, formatDate } from '../../../utils/firebaseUtils';
import { FiRefreshCw, FiEye } from 'react-icons/fi';
import CodOrderDetail from './CodOrderDetail';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

function StatusBadge({ status }) {
  const colors = {
    Delivered: 'bg-green-100 text-green-700',
    Shipped: 'bg-blue-100 text-blue-700',
    Processing: 'bg-yellow-100 text-yellow-700',
    Pending: 'bg-red-100 text-red-700',
    Cancelled: 'bg-gray-100 text-gray-700',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
}

function CodOrdersTab() {
  const context = useContext(myContext);
  const { order, getOrderData, updateOrder } = context;
  
  const [codOrders, setCodOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailView, setIsDetailView] = useState(false);

  // Filter COD orders
  useEffect(() => {
    if (order && order.length > 0) {
      const codOrdersData = order.filter(orderItem => 
        orderItem.paymentMethod && 
        (orderItem.paymentMethod.toLowerCase().includes('cash') || 
         orderItem.paymentMethod.toLowerCase().includes('cod') ||
         orderItem.paymentMethod === 'COD')
      );
      setCodOrders(codOrdersData);
      setLoading(false);
    } else {
      setCodOrders([]);
      setLoading(false);
    }
  }, [order]);

  const handleRefresh = () => {
    setLoading(true);
    getOrderData();
  };

  const handleViewDetails = (orderItem) => {
    setSelectedOrder(orderItem);
    setIsDetailView(true);
  };

  const handleBackToList = () => {
    setIsDetailView(false);
    setSelectedOrder(null);
  };

  // Function to update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrder(orderId, { status: newStatus });
      // Refresh the data
      getOrderData();
    } catch (error) {
      console.error('Error updating order status:', error);
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
      doc.text(`Order ID: ${orderItem.orderId || orderItem.id?.substring(0, 8) || 'N/A'}`, 150, 37);
      doc.text(`Order Date: ${formatDate(orderItem.date)}`, 150, 44);
      
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
      tableRows.push(['', '', '', 'Total Amount', `₹${orderItem.totalAmount || 0}`]);
      
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
      const filename = `invoice-${orderItem.orderId || orderItem.id?.substring(0, 8) || 'order'}.pdf`;
      doc.save(filename);
    } catch (error) {
      console.error('Error generating invoice:', error);
    }
  };

  // Filter orders based on search term
  const filteredOrders = codOrders.filter(orderItem => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (orderItem.customerName && orderItem.customerName.toLowerCase().includes(searchTermLower)) ||
      (orderItem.orderId && orderItem.orderId.toLowerCase().includes(searchTermLower)) ||
      (orderItem.id && orderItem.id.toLowerCase().includes(searchTermLower)) ||
      (orderItem.addressInfo?.name && orderItem.addressInfo.name.toLowerCase().includes(searchTermLower)) ||
      (orderItem.addressInfo?.phoneNumber && orderItem.addressInfo.phoneNumber.includes(searchTermLower))
    );
  });

  if (isDetailView && selectedOrder) {
    return (
      <CodOrderDetail 
        order={selectedOrder} 
        onUpdateStatus={updateOrderStatus}
        onDownloadInvoice={downloadInvoice}
      />
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">COD Orders</h2>
            <p className="text-gray-600 mt-1">Manage Cash on Delivery orders</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FiRefreshCw className={`${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">Total COD Orders</p>
            <p className="text-2xl font-bold text-yellow-900 mt-1">{codOrders.length}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">Total COD Value</p>
            <p className="text-2xl font-bold text-green-900 mt-1">
              {formatCurrency(codOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0))}
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">Pending COD Orders</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">
              {codOrders.filter(order => order.status === 'Processing' || order.status === 'Pending').length}
            </p>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002-2h2a2 2 0 002 2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No COD orders found</h3>
            <p className="mt-1 text-gray-500">
              {searchTerm ? 'No COD orders match your search.' : 'There are currently no COD orders in your store.'}
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((orderItem) => (
                <tr key={orderItem.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{orderItem.orderId || orderItem.id?.substring(0, 8) || 'N/A'}
                    </div>
                    {orderItem.addressInfo?.phoneNumber && (
                      <div className="text-sm text-gray-500">
                        {orderItem.addressInfo.phoneNumber}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {orderItem.customerName || orderItem.addressInfo?.name || 'N/A'}
                    </div>
                    {orderItem.addressInfo?.state && (
                      <div className="text-sm text-gray-500">
                        {orderItem.addressInfo.state}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(orderItem.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(orderItem.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={orderItem.status || 'Pending'} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      COD
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(orderItem)}
                      className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                    >
                      <FiEye size={16} />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredOrders.length}</span> of{' '}
                <span className="font-medium">{filteredOrders.length}</span> results
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CodOrdersTab;