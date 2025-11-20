import React, { useContext, useEffect } from 'react';
import myContext from '../../../context/data/myContext';

function TestOrders() {
  const context = useContext(myContext);
  const { order, getOrderData } = context;

  useEffect(() => {
    console.log('TestOrders component mounted, fetching orders...');
    getOrderData()
      .then(result => {
        console.log('Test orders fetch result:', result);
        if (result.success) {
          console.log('Test orders data:', result.data);
        }
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Test Orders</h1>
      <p>Total orders: {order.length}</p>
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Order Data:</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(order, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default TestOrders;