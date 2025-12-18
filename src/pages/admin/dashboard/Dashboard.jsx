import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../../components/layout/Layout'
import myContext from '../../../context/data/myContext'
import { useAuth } from '../../../hooks/useAuth'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { fireDB } from '../../../firebase/firebaseConfig'
import { formatCurrency, formatDate, calculateTotalRevenue, normalizeOrderData } from '../../../utils/firebaseUtils'
import DeployRulesInstructions from '../../../components/DeployRulesInstructions'
import { FiEye } from 'react-icons/fi'
import CodOrdersSummary from './CodOrdersSummary'
import { deployFirebaseRulesInfo } from '../../../utils/deployFirebaseRules'
import { toast } from 'react-toastify'

// Sample data for when Firebase is not accessible
const sampleStats = [
  { label: 'Total Revenue', value: '₹12.4L', change: '+18% vs last week', trend: 'up' },
  { label: 'Orders Processed', value: '1,248', change: '+6% vs last week', trend: 'up' },
  { label: 'Active Customers', value: '3,982', change: '+2% vs last week', trend: 'up' },
  { label: 'Total Products', value: '86', change: '+4% vs last week', trend: 'up' },
]

const sampleRecentOrders = [
  { id: '1', customerName: 'Ananya Sharma', totalAmount: 5499, status: 'Processing', date: new Date().toISOString(), paymentMethod: 'Cash on Delivery' },
  { id: '2', customerName: 'Rohit Gupta', totalAmount: 1299, status: 'Shipped', date: new Date().toISOString(), paymentMethod: 'Online' },
  { id: '3', customerName: 'Muskan Tekchandani', totalAmount: 2799, status: 'Delivered', date: new Date().toISOString(), paymentMethod: 'Cash on Delivery' },
  { id: '4', customerName: 'Vikram Singh', totalAmount: 9499, status: 'Pending', date: new Date().toISOString(), paymentMethod: 'Online' },
]

const sampleInventory = [
  { category: 'Electronics', inStock: 214, reserved: 18 },
  { category: 'Fashion', inStock: 418, reserved: 41 },
  { category: 'Home & Living', inStock: 136, reserved: 12 },
]

const sampleProducts = [
  { id: '1', title: 'Smart Watch Pro', price: 2999, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1099&q=80' },
  { id: '2', title: 'Wireless Earbuds', price: 1499, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1032&q=80' },
  { id: '3', title: 'Minimal Backpack', price: 1299, category: 'Fashion', imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1173&q=80' },
]

function StatusBadge({ status }) {
  const colors = {
    Delivered: 'bg-green-100 text-green-700',
    Shipped: 'bg-blue-100 text-blue-700',
    Processing: 'bg-yellow-100 text-yellow-700',
    Pending: 'bg-red-100 text-red-700',
  }
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  )
}

function Dashboard() {
  const context = useContext(myContext)
  const { state, fixImageUrls } = context
  const { user } = useAuth()
  
  const [stats, setStats] = useState(sampleStats)
  const [recentOrders, setRecentOrders] = useState(sampleRecentOrders)
  const [codOrders, setCodOrders] = useState([]) // New state for COD orders
  const [products, setProducts] = useState(sampleProducts)
  const [inventory, setInventory] = useState(sampleInventory)
  const [loading, setLoading] = useState(true)
  const [firebaseError, setFirebaseError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [showSampleData, setShowSampleData] = useState(false)
  const [stateDistribution, setStateDistribution] = useState({})

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Check if user is logged in
      if (!user) {
        console.log('No user logged in, showing sample data')
        setStats(sampleStats)
        setRecentOrders(sampleRecentOrders)
        setCodOrders([]) // Initialize COD orders as empty
        setProducts(sampleProducts)
        setInventory(sampleInventory)
        setFirebaseError(true)
        setShowSampleData(true)
        setLoading(false)
        return
      }
      
      // Fetch Products
      const productsQuery = query(collection(fireDB, 'products'))
      const productsSnapshot = await getDocs(productsQuery)
      const productsData = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setProducts(productsData)
      
      // Fetch Orders
      const ordersQuery = query(
        collection(fireDB, 'orders'),
        orderBy('date', 'desc'),
        limit(10) // Increased limit to get more data for revenue calculation
      )
      const ordersSnapshot = await getDocs(ordersQuery)
      const ordersData = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).map(normalizeOrderData) // Normalize order data
      
      // Debug: Log fetched orders
      console.log('Fetched orders for dashboard:', ordersData)
      
      setRecentOrders(ordersData)
      
      // Filter COD orders
      const codOrdersData = ordersData.filter(order => 
        order.paymentMethod && 
        (order.paymentMethod.toLowerCase().includes('cash') || 
         order.paymentMethod.toLowerCase().includes('cod') ||
         order.paymentMethod === 'COD')
      )
      setCodOrders(codOrdersData)
      
      // Fetch Users count
      const usersSnapshot = await getDocs(collection(fireDB, 'users'))
      const usersCount = usersSnapshot.size
      
      // Calculate inventory by category
      const categoryStats = {}
      productsData.forEach(product => {
        const category = product.category || 'Uncategorized'
        if (!categoryStats[category]) {
          categoryStats[category] = {
            category,
            inStock: 0,
            reserved: 0
          }
        }
        const stock = parseInt(product.stock) || 0
        const reserved = parseInt(product.reserved) || 0
        categoryStats[category].inStock += stock
        categoryStats[category].reserved += reserved
      })
      
      const inventoryData = Object.values(categoryStats)
      setInventory(inventoryData)
      
      // Calculate stats with more accurate revenue calculation
      const totalRevenue = calculateTotalRevenue(ordersData)
      const totalOrders = ordersData.length
      
      // Calculate payment method stats
      const codOrderCount = codOrdersData.length
      
      // Calculate state distribution
      const stateDistribution = {}
      let knownOrdersCount = 0
      ordersData.forEach(order => {
        // Try to get state from addressInfo first, then fallback to userState
        const state = order.addressInfo?.state || order.userState
        if (state) {
          if (!stateDistribution[state]) {
            stateDistribution[state] = 0
          }
          stateDistribution[state]++
          knownOrdersCount++
        }
      })
      
      // Only show states with at least one order
      const filteredStateDistribution = {}
      Object.entries(stateDistribution).forEach(([state, count]) => {
        if (count > 0) {
          filteredStateDistribution[state] = count
        }
      })
      
      setStateDistribution(filteredStateDistribution)
      
      setStats([
        { label: 'Total Revenue', value: formatCurrency(totalRevenue), change: '+18% vs last week', trend: 'up' },
        { label: 'Orders Processed', value: totalOrders.toString(), change: '+6% vs last week', trend: 'up' },
        { label: 'Active Customers', value: usersCount.toString(), change: '+2% vs last week', trend: 'up' },
        { label: 'Total Products', value: productsData.length.toString(), change: '+4% vs last week', trend: 'up' },
      ])
      
      setLoading(false)
      setFirebaseError(false)
      setShowSampleData(false)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Log which collection caused the error
      if (error.code === 'permission-denied') {
        console.error('Permission denied error. Check Firebase security rules.')
        console.error('Current user:', user)
      }
      // Use sample data when Firebase is not accessible
      setStats(sampleStats)
      setRecentOrders(sampleRecentOrders)
      setCodOrders([]) // Initialize COD orders as empty
      setProducts(sampleProducts)
      setInventory(sampleInventory)
      setFirebaseError(true)
      setShowSampleData(true)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [retryCount])

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
  }

  const handleShowRealData = () => {
    setShowSampleData(false)
    setRecentOrders([])
    fetchDashboardData()
  }

  const handleDeployRulesInfo = () => {
    const info = deployFirebaseRulesInfo();
    toast.info(info.message + '\n\n' + info.commands.join('\n'), {
      autoClose: 10000,
      position: "bottom-right"
    });
  }

  return (
    <Layout>
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-widest text-blue-600 font-semibold">Dashboard</p>
              <h1 className="text-3xl font-bold text-gray-900 mt-1">Titanium Store</h1>
              <p className="text-gray-600 mt-2">Manage your store performance, orders, inventory and customers.</p>
              {firebaseError && (
                <div className="mt-2">
                  <p className="text-red-500 text-sm">
                    Note: Unable to connect to Firebase. Showing sample data.
                  </p>
                  <button 
                    onClick={handleRetry}
                    className="mt-1 text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Retry Connection
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-4 mb-8">
              <Link
                to="/add-product"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 text-sm font-medium text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transition-all"
              >
                Add Product
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 transition-colors"
              >
                <FiEye className="h-4 w-4" />
                View Products
              </Link>
            </div>
          </div>

          {/* Deploy Rules Instructions - Only show when there's a Firebase error */}
          {firebaseError && (
            <DeployRulesInstructions />
          )}

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {loading ? (
              <div className="col-span-4 text-center py-8">
                <p className="text-gray-600">Loading stats...</p>
              </div>
            ) : (
              stats.map((stat) => (
                <div key={stat.label} className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className={`text-sm mt-2 font-semibold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>{stat.change}</p>
                </div>
              ))
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg">
              <div className="p-6 border-b border-blue-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                  <p className="text-sm text-gray-600">Latest transactions in your store</p>
                </div>
                <div className="flex items-center gap-3">
                </div>
              </div>
              <div className="divide-y divide-blue-50">
                {loading ? (
                  <div className="px-6 py-8 text-center text-gray-600">
                    Loading orders...
                  </div>
                ) : recentOrders.length === 0 && !showSampleData ? (
                  <div className="px-6 py-8 text-center text-gray-600">
                    No orders yet
                  </div>
                ) : (
                  (showSampleData ? sampleRecentOrders : recentOrders).map((order) => (
                    <div key={order.id} className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{order.customerName}</p>
                        <p className="text-sm text-gray-500">
                          #{order.orderId || order.id?.slice(0, 8) || 'N/A'} • {formatDate(order.date)}
                        </p>
                        {/* Debug: Highlight the specific order */}
                        {(order.id && order.id.includes('48333762')) && (
                          <p className="text-xs text-red-500 font-bold">TARGET ORDER #48333762</p>
                        )}
                        {order.addressInfo?.state && (
                          <p className="text-sm text-gray-500">State: {order.addressInfo.state}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                        <div className="flex items-center justify-end gap-2 mt-1">
                          <StatusBadge status={order.status || 'Pending'} />
                          {order.paymentMethod && (
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              order.paymentMethod === 'Cash on Delivery' || 
                              order.paymentMethod.toLowerCase().includes('cod') ? 
                              'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {order.paymentMethod === 'Cash on Delivery' ? 'COD' : order.paymentMethod}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Inventory and COD Orders Summary */}
            <div className="space-y-6">
              {/* Inventory */}
              <div className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg p-6 space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Inventory Snapshot</h2>
                  <p className="text-sm text-gray-600">Current stock availability</p>
                </div>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-4 text-gray-600">
                      Loading inventory...
                    </div>
                  ) : inventory.length === 0 ? (
                    <div className="text-center py-4 text-gray-600">
                      No inventory data
                    </div>
                  ) : (
                    inventory.map((item) => (
                      <div key={item.category} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">{item.category}</p>
                          <p className="text-sm text-gray-500">
                            {item.inStock} in stock • {item.reserved} reserved
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{item.inStock}</p>
                          <p className="text-sm text-gray-500">
                            Available: {Math.max(0, item.inStock - item.reserved)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* COD Orders Summary */}
              <CodOrdersSummary codOrders={codOrders} loading={loading} />
            </div>
          </div>

          {/* State Distribution Chart */}
          <div className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Order Distribution by State</h2>
              <p className="text-sm text-gray-600">Geographic breakdown of orders</p>
            </div>
            {loading ? (
              <div className="text-center py-8 text-gray-600">
                Loading state distribution...
              </div>
            ) : Object.keys(stateDistribution).length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                No state distribution data available
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Object.entries(stateDistribution).map(([state, count]) => (
                  <div key={state} className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="font-semibold text-gray-900">{state}</p>
                    <p className="text-2xl font-bold text-blue-600">{count}</p>
                    <p className="text-xs text-gray-500">orders</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard