import React from 'react'
import Layout from '../../components/layout/Layout'
import Slider from '../../components/slider/Slider'
import Filter from '../../components/filter/Filter'
import Category from '../../components/category/Category'
import ProductCard from '../../components/productCard/ProductCard'

function Home() {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-4 md:space-y-6">
        <Slider />
        <Filter />
        <Category />
        <ProductCard />
      </div>
    </Layout>
  )
}

export default Home