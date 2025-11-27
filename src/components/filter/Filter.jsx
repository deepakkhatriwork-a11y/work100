import React, { useContext } from 'react';
import myContext from '../../context/data/myContext';

function Filter() {
    const context = useContext(myContext);
    const { 
        mode, 
        searchkey, 
        setSearchkey, 
        filterType, 
        setFilterType,
        filterPrice, 
        setFilterPrice,
        products // Use products instead of originalProducts
    } = context;

    // Get unique categories from products with proper error handling
    const categories = products && Array.isArray(products) 
        ? [...new Set(products
            .map(item => item.category)
            .filter(Boolean))]
        : [];

    // Debug logging
    console.log('Products:', products);
    console.log('Categories:', categories);
    
    // Check if there are no products at all
    const hasProducts = products && Array.isArray(products) && products.length > 0;

    const resetFilters = () => {
        setSearchkey('');
        setFilterType('');
        setFilterPrice('');
    };

    // Don't show filter if there are no products
    if (!hasProducts) {
        return null;
    }

    return (
        // Extended width container
        <div className='container mx-auto px-2 sm:px-4 mt-5 w-full max-w-full'>
            <div className="p-5 rounded-lg bg-gray-100 drop-shadow-xl border border-gray-200"
                style={{ 
                    backgroundColor: mode === 'dark' ? '#282c34' : '', 
                    color: mode === 'dark' ? 'white' : '', 
                }}>
                <div className="relative">
                    <div className="absolute flex items-center ml-2 h-full">
                        <svg className="w-4 h-4 fill-current text-primary-gray-dark" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.8898 15.0493L11.8588 11.0182C11.7869 10.9463 11.6932 10.9088 11.5932 10.9088H11.2713C12.3431 9.74952 12.9994 8.20272 12.9994 6.49968C12.9994 2.90923 10.0901 0 6.49968 0C2.90923 0 0 2.90923 0 6.49968C0 10.0901 2.90923 12.9994 6.49968 12.9994C8.20272 12.9994 9.74952 12.3431 10.9088 11.2744V11.5932C10.9088 11.6932 10.9495 11.7869 11.0182 11.8588L15.0493 15.8898C15.1961 16.0367 15.4336 16.0367 15.5805 15.8898L15.8898 15.5805C16.0367 15.4336 16.0367 15.1961 15.8898 15.0493ZM6.49968 11.9994C3.45921 11.9994 0.999951 9.54016 0.999951 6.49968C0.999951 3.45921 3.45921 0.999951 6.49968 0.999951C9.54016 0.999951 11.9994 3.45921 11.9994 6.49968C11.9994 9.54016 9.54016 11.9994 6.49968 11.9994Z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        name="searchkey"
                        id="searchkey"
                        value={searchkey}
                        onChange={e => setSearchkey(e.target.value)}
                        placeholder="Search here"
                        className="px-8 py-3 w-full rounded-md bg-violet-0 border-transparent outline-0 text-sm" 
                        style={{ 
                            backgroundColor: mode === 'dark' ? 'rgb(64 66 70)' : '', 
                            color: mode === 'dark' ? 'white' : '',  
                        }} 
                    />
                </div>
                <div className="flex items-center justify-between mt-4">
                    <p className="font-medium">
                        Filters
                        {(searchkey || filterType || filterPrice) && (
                            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                                {(() => {
                                    const activeFilters = [];
                                    if (searchkey) activeFilters.push(`Search: "${searchkey}"`);
                                    if (filterType) activeFilters.push(`Category: ${filterType}`);
                                    if (filterPrice) activeFilters.push(`Price: ${filterPrice}`);
                                    return activeFilters.join(", ");
                                })()}
                            </span>
                        )}
                    </p>
                    {(searchkey || filterType || filterPrice) && (
                        <button 
                            onClick={resetFilters}
                            className="px-4 py-2 bg-gray-50 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md" 
                            style={{ color: mode === 'dark' ? 'white' : '' }}
                        >
                            Reset Filters
                        </button>
                    )}
                </div>
                <div>
                    {/* Single line layout with equal width for all filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                        <select 
                            value={filterType} 
                            onChange={(e) => setFilterType(e.target.value)} 
                            className="px-4 py-3 w-full rounded-md bg-gray-50 border-transparent outline-0 focus:border-gray-500 focus:bg-white focus:ring-0 text-sm" 
                            style={{ 
                                backgroundColor: mode === 'dark' ? 'rgb(64 66 70)' : '', 
                                color: mode === 'dark' ? 'white' : '', 
                            }}
                        >
                            <option value="">All Categories</option>
                            {categories.length > 0 ? (
                                categories.map((category, index) => (
                                    <option key={index} value={category}>{category}</option>
                                ))
                            ) : (
                                <option value="" disabled>No categories available</option>
                            )}
                        </select>
                        <select 
                            value={filterPrice} 
                            onChange={(e) => setFilterPrice(e.target.value)} 
                            className="px-4 py-3 w-full rounded-md bg-gray-50 border-transparent outline-0  focus:border-gray-500 focus:bg-white focus:ring-0 text-sm" 
                            style={{ 
                                backgroundColor: mode === 'dark' ? 'rgb(64 66 70)' : '', 
                                color: mode === 'dark' ? 'white' : '', 
                            }}
                        >
                            <option value="">All Prices</option>
                            <option value="0-1000">₹0 - ₹1000</option>
                            <option value="1001-5000">₹1001 - ₹5000</option>
                            <option value="5001-10000">₹5001 - ₹10000</option>
                            <option value="10001+">₹10001+</option>
                        </select>
                        {/* Hidden element to maintain grid structure - can be used for additional filters */}
                        <div className="hidden md:block"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Filter;