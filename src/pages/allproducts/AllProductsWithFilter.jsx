import React, { useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Filter from '../../components/filter/Filter';
import ProductCard from '../../components/productCard/ProductCard';
import Layout from '../../components/layout/Layout';
import myContext from '../../context/data/myContext';

function AllProductsWithFilter() {
    const context = useContext(myContext);
    const { products, setSearchkey } = context;
    const [searchParams] = useSearchParams();

    // Read search query from URL and set it
    useEffect(() => {
        const searchQuery = searchParams.get('search');
        if (searchQuery && setSearchkey) {
            setSearchkey(searchQuery);
        }
    }, [searchParams, setSearchkey]);

    return (
        <Layout>
            <div className="min-h-screen">
                <Filter />
                <ProductCard />
            </div>
        </Layout>
    );
}

export default AllProductsWithFilter;