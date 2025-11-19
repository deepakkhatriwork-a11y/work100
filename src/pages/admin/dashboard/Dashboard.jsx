import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../../components/layout/Layout'
import myContext from '../../../context/data/myContext'
import { useAuth } from '../../../hooks/useAuth'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../../../firebase/firebaseConfig'
import { formatCurrency, formatDate, calculateTotalRevenue, normalizeOrderData } from '../../../utils/firebaseUtils'
import DeployRulesInstructions from '../../../components/DeployRulesInstructions'
import { FiEye } from 'react-icons/fi'

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
        setProducts(sampleProducts)
        setInventory(sampleInventory)
        setFirebaseError(true)
        setShowSampleData(true)
        setLoading(false)
        return
      }
      
      // Fetch Products
      const productsQuery = query(collection(db, 'products'))
      const productsSnapshot = await getDocs(productsQuery)
      const productsData = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setProducts(productsData)
      
      // Fetch Orders
      const ordersQuery = query(
        collection(db, 'orders'),
        orderBy('date', 'desc'),
        limit(10) // Increased limit to get more data for revenue calculation
      )
      const ordersSnapshot = await getDocs(ordersQuery)
      const ordersData = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).map(normalizeOrderData) // Normalize order data
      
      setRecentOrders(ordersData)
      
      // Fetch Users count
      const usersSnapshot = await getDocs(collection(db, 'users'))
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
      const codOrders = ordersData.filter(order => 
        order.paymentMethod === 'Cash on Delivery' || 
        order.paymentMethod === 'cod' ||
        order.paymentMethod === 'COD'
      ).length
      
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
                to="/add-requested-products"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-600 to-teal-600 px-6 py-2 text-sm font-medium text-white hover:from-green-700 hover:to-teal-700 shadow-lg shadow-green-500/30 transition-all"
              >
                Add Sample Products
              </Link>
              <button
                onClick={fixImageUrls}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-600 to-orange-600 px-6 py-2 text-sm font-medium text-white hover:from-yellow-700 hover:to-orange-700 shadow-lg shadow-yellow-500/30 transition-all"
              >
                Fix Product Images
              </button>
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
                        <p className="text-sm text-gray-500">#{order.id?.slice(0, 8) || 'N/A'} • {formatDate(order.date)}</p>
                        {order.addressInfo?.state && (
                          <p className="text-sm text-gray-500">State: {order.addressInfo.state}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                        <div className="flex items-center justify-end gap-2 mt-1">
                          <StatusBadge status={order.status || 'Pending'} />
                          {order.paymentMethod && (
                            <span className="text-xs text-gray-500">
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

            {/* Inventory and State Distribution */}
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
                      <div key={item.category} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-gray-900">{item.category}</p>
                          <span className="text-sm text-gray-600 font-semibold">{item.inStock + item.reserved} items</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="text-green-600 font-semibold mr-4">In stock: {item.inStock}</span>
                          <span>Reserved: {item.reserved}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
                  <p className="text-sm text-gray-600">Past 6 months</p>
                </div>
                <span className="text-sm font-medium text-green-600">+12% growth</span>
              </div>
              <div className="h-48 flex items-end gap-4">
                {[50, 80, 60, 95, 70, 110].map((value, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div className="w-9 rounded-t-xl bg-blue-100 flex items-end">
                      <div style={{ height: `${value}%` }} className="w-full bg-gradient-to-t from-blue-600 to-indigo-600 rounded-t-xl transition-all" />
                    </div>
                    <span className="text-xs text-gray-500 mt-2">M{idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h2>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-4 text-gray-600">
                    Loading products...
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-4 text-gray-600">
                    No products yet
                  </div>
                ) : (
                  products.slice(0, 3).map((product) => (
                    <Link
                      key={product.id}
                      to={`/update-product/${product.id}`}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        <img src={product.imageUrl || product.image} alt={product.title || product.name} className="w-12 h-12 object-cover rounded-lg" />
                        <div>
                          <p className="font-medium text-gray-900">{product.title || product.name}</p>
                          <p className="text-sm text-gray-500">{product.category}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900">{formatCurrency(product.price)}</p>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard