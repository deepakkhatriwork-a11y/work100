import React from 'react';
import { FiCpu, FiBatteryCharging, FiWifi, FiMonitor, FiSmartphone, FiHeadphones, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const NextStyleCategories = () => {
  const categories = [
    {
      id: 1,
      name: "Microcontrollers",
      icon: <FiCpu className="w-8 h-8" />,
      description: "Arduino, Raspberry Pi, ESP32",
      count: 42,
      color: "from-blue-500 to-blue-600"
    },
    {
      id: 2,
      name: "Power Supplies",
      icon: <FiBatteryCharging className="w-8 h-8" />,
      description: "Batteries, Chargers, PSU",
      count: 28,
      color: "from-green-500 to-green-600"
    },
    {
      id: 3,
      name: "Sensors",
      icon: <FiWifi className="w-8 h-8" />,
      description: "Motion, Temperature, Light",
      count: 36,
      color: "from-purple-500 to-purple-600"
    },
    {
      id: 4,
      name: "Displays",
      icon: <FiMonitor className="w-8 h-8" />,
      description: "LCD, OLED, TFT Screens",
      count: 19,
      color: "from-red-500 to-red-600"
    },
    {
      id: 5,
      name: "Communication",
      icon: <FiSmartphone className="w-8 h-8" />,
      description: "Bluetooth, WiFi, GSM",
      count: 24,
      color: "from-yellow-500 to-yellow-600"
    },
    {
      id: 6,
      name: "Audio",
      icon: <FiHeadphones className="w-8 h-8" />,
      description: "Speakers, Microphones",
      count: 15,
      color: "from-pink-500 to-pink-600"
    }
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore our wide range of electronic components organized by category
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={`/category/${category.id}`}
              className="group"
            >
              <div className={`bg-gradient-to-br ${category.color} rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 h-full`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-white/20 p-3 rounded-xl">
                    {category.icon}
                  </div>
                  <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                    {category.count} items
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                <p className="text-white/80 mb-6">{category.description}</p>
                
                <div className="flex items-center text-white/80 group-hover:text-white transition-colors">
                  <span className="font-medium">Explore</span>
                  <FiChevronRight className="w-5 h-5 ml-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NextStyleCategories;