import React, { useContext, useEffect, useState } from 'react';
import myContext from '../../../context/data/myContext';
import { formatCurrency } from '../../../utils/firebaseUtils';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

function CodOrdersSummary() {
  const context = useContext(myContext);
  const { order } = context;
  
  const [codOrders, setCodOrders] = useState([]);
  const [codStats, setCodStats] = useState({
    totalOrders: 0,
    totalValue: 0,
    pendingOrders: 0
  });

  // Filter COD orders and calculate stats
  useEffect(() => {
    if (order && order.length > 0) {
      const codOrdersData = order.filter(orderItem => 
        orderItem.paymentMethod && 
        (orderItem.paymentMethod.toLowerCase().includes('cash') || 
         orderItem.paymentMethod.toLowerCase().includes('cod') ||
         orderItem.paymentMethod === 'COD')
      );
      
      setCodOrders(codOrdersData);
      
      // Calculate stats
      const totalOrders = codOrdersData.length;
      const totalValue = codOrdersData.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const pendingOrders = codOrdersData.filter(order => 
        order.status === 'Processing' || order.status === 'Pending'
      ).length;
      
      setCodStats({
        totalOrders,
        totalValue,
        pendingOrders
      });
    } else {
      setCodOrders([]);
      setCodStats({
        totalOrders: 0,
        totalValue: 0,
        pendingOrders: 0
      });
    }
  }, [order]);

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">COD Orders Summary</h2>
          <p className="text-sm text-gray-600">Cash on Delivery overview</p>
        </div>
        <Link 
          to="/admin-dashboard" 
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
        >
          View All <FiArrowRight size={14} />
        </Link>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-yellow-50 rounded-lg p-3 text-center border border-yellow-100">
          <p className="text-sm text-yellow-800">Total Orders</p>
          <p className="text-xl font-bold text-yellow-900">{codStats.totalOrders}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center border border-green-100">
          <p className="text-sm text-green-800">Total Value</p>
          <p className="text-xl font-bold text-green-900">{formatCurrency(codStats.totalValue)}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
          <p className="text-sm text-blue-800">Pending</p>
          <p className="text-xl font-bold text-blue-900">{codStats.pendingOrders}</p>
        </div>
      </div>
      
      {codOrders.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Recent COD Orders</h3>
          <div className="space-y-2">
            {codOrders.slice(0, 3).map((order) => (
              <div key={order.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-gray-900">#{order.id?.substring(0, 6) || 'N/A'}</p>
                  <p className="text-gray-500">{order.customerName || 'Customer'}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(order.totalAmount)}</p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    COD
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CodOrdersSummary;