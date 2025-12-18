import React from 'react'
import { Link } from 'react-router-dom'
import { FiSmartphone, FiMonitor, FiHeadphones, FiCamera, FiWatch } from 'react-icons/fi'

const categories = [
  {
    name: 'Smartphones',
    href: '/products?category=smartphones',
    icon: FiSmartphone,
  },
  {
    name: 'Laptops',
    href: '/products?category=laptops',
    icon: FiMonitor,
  },
  {
    name: 'Audio',
    href: '/products?category=audio',
    icon: FiHeadphones,
  },
  {
    name: 'Cameras',
    href: '/products?category=cameras',
    icon: FiCamera,
  },
  {
    name: 'Wearables',
    href: '/products?category=wearables',
    icon: FiWatch,
  },
]

function Category() {
  return (
    <section className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Shop by Category</h2>
          <p className="text-gray-600">Browse our wide selection of products</p>
          <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto mt-3"></div>
        </div>
        
        <div className="flex items-center justify-between overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.href}
              className="flex flex-col items-center min-w-[80px] sm:min-w-[90px] group px-3 py-2"
            >
              <div className="category-icon group-hover:bg-gradient-to-r from-blue-500 to-indigo-600 group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
                <category.icon className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <span className="mt-3 text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors text-center">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Category