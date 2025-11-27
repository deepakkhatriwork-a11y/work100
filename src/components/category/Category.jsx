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
    <section className="bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between overflow-x-auto pb-2 -mx-2 px-2">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.href}
              className="flex flex-col items-center min-w-[70px] sm:min-w-[80px] group px-2"
            >
              <div className="category-icon group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <category.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="mt-2 text-xs font-medium text-gray-700 group-hover:text-blue-600 transition-colors text-center">
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