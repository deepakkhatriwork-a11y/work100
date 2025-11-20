import React from 'react';
import { formatCurrency, formatDate } from '../../../utils/firebaseUtils';

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

function CodOrderDetail({ order, onUpdateStatus, onDownloadInvoice }) {
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

  if (!order) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No order selected</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            <p className="text-gray-600 mt-1">Order #{order.orderId || order.id?.substring(0, 8) || 'N/A'}</p>
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={order.status || 'Processing'}
              onChange={(e) => onUpdateStatus(order.id, e.target.value)}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
            >
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button
              onClick={() => onDownloadInvoice(order)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Download Invoice
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Order Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Order Value</h3>
            <p className="text-2xl font-bold text-blue-900">{formatCurrency(order.totalAmount)}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">Payment Method</h3>
            <p className="text-2xl font-bold text-yellow-900">COD</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <h3 className="text-sm font-medium text-green-800 mb-2">Order Status</h3>
            <div className="mt-1">
              <StatusBadge status={order.status || 'Processing'} />
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{order.customerName || order.addressInfo?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{order.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{order.addressInfo?.phoneNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium">{formatDate(order.date)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-medium">{order.addressInfo?.name || 'N/A'}</p>
            <p className="mt-1">{order.addressInfo?.address || 'N/A'}</p>
            <p className="mt-1">{order.addressInfo?.city || ''}, {order.addressInfo?.state || ''} {order.addressInfo?.pincode || ''}</p>
            <p className="mt-1">Phone: {order.addressInfo?.phoneNumber || 'N/A'}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.cartItems?.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded-md object-cover" 
                            src={item.imageUrl || item.image || 'https://placehold.co/400x400/cccccc/ffffff?text=No+Image'} 
                            alt={item.title || item.name || 'Product'} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.title || item.name || 'Unknown Item'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity || 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency((item.price || 0) * (item.quantity || 1))}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                    Subtotal
                  </td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">
                    {formatCurrency(order.totalAmount)}
                  </td>
                </tr>
                <tr>
                  <td colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                    Shipping
                  </td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">
                    {formatCurrency(0)}
                  </td>
                </tr>
                <tr>
                  <td colSpan="3" className="px-6 py-3 text-right text-sm font-bold text-gray-900">
                    Total
                  </td>
                  <td className="px-6 py-3 text-sm font-bold text-gray-900">
                    {formatCurrency(order.totalAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Payment Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-yellow-800">Payment Method</p>
                <p className="font-medium text-yellow-900">Cash on Delivery (COD)</p>
              </div>
              <div>
                <p className="text-sm text-yellow-800">Payment Status</p>
                <p className="font-medium text-yellow-900">Pending (To be collected at delivery)</p>
              </div>
              <div>
                <p className="text-sm text-yellow-800">Amount to Collect</p>
                <p className="text-2xl font-bold text-yellow-900">{formatCurrency(order.totalAmount)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodOrderDetail;