import React, { useEffect, useState } from 'react'
import '../styles/Products.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Products = (props) => {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState([]);

    const [sortFilter, setSortFilter] = useState('popularity');
    const [categoryFilter, setCategoryFilter] = useState([]);
    const [genderFilter, setGenderFilter] = useState([]);


    useEffect(()=>{
        fetchData();
    }, [props.category]) // Re-fetch products when category prop changes
    
    // --- API CALLS ---
const fetchData = async() =>{
    try {
        // 1. Fetch Products
        const productResponse = await axios.get('http://localhost:6001/api/products/fetch-products');
        const allProducts = productResponse.data;

        // 1. Get the category from props and standardize it (lowercase, no hyphens/spaces)
        const categoryToFilter = props.category 
            ? props.category.toLowerCase().replace(/-/g, '').replace(/ /g, '') 
            : null;

        const filteredProducts = (categoryToFilter === 'all' || !categoryToFilter)
            ? allProducts
            : allProducts.filter(product => {
                
                // 🚀 FIX: Safety check for undefined category to prevent TypeError
                const rawCategory = product.category ?? ''; 
                
                // 2. Standardize the MongoDB category (product.category) for comparison
                const dbCategory = rawCategory.toLowerCase().replace(/-/g, '').replace(/ /g, '');
                
                // 3. Compare the standardized values
                return dbCategory === categoryToFilter;
            });

        setProducts(filteredProducts);
        setVisibleProducts(filteredProducts);
        
        // 2. Fetch Categories for the sidebar
        const categoryResponse = await axios.get('http://localhost:6001/api/products/fetch-categories');
        setCategories(categoryResponse.data); 
        
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
    // --- HANDLERS ---
    const handleCategoryCheckBox = (e) =>{
        const value = e.target.value;
        if(e.target.checked){
            setCategoryFilter([...categoryFilter, value]);
        }else{
            setCategoryFilter(categoryFilter.filter(cat=> cat !== value));
        }
    }

    const handleGenderCheckBox = (e) =>{
        const value = e.target.value;
        if(e.target.checked){
            setGenderFilter([...genderFilter, value]);
        }else{
            setGenderFilter(genderFilter.filter(g=> g !== value));
        }
    }

    const handleSortFilterChange = (e) =>{
        const value = e.target.value;
        setSortFilter(value);
        
        // FIX: Create a copy of the array before sorting to trigger state update
        setVisibleProducts(prevProducts => {
            const productsCopy = [...prevProducts];

            if(value === 'low-price'){
                return productsCopy.sort((a,b)=> a.price - b.price);
            } else if (value === 'high-price'){
                return productsCopy.sort((a,b)=> b.price - a.price);
            }else if (value === 'discount'){
                return productsCopy.sort((a,b)=> b.discount - a.discount);
            }
            return productsCopy; // Default case
        });
    }

    // --- FILTER USE EFFECT ---
    useEffect(()=>{
        let currentFilteredProducts = products;

        // Apply Category Filter - FIX: Make this case-insensitive too
        if (categoryFilter.length > 0) {
            // Map filter array to lowercase for comparison
            const lowerCaseFilter = categoryFilter.map(cat => cat.toLowerCase());
            
            currentFilteredProducts = currentFilteredProducts.filter(product => {
                // Use the raw category with safety check
                const rawCategory = product.category ?? '';
                
                return lowerCaseFilter.includes(rawCategory.toLowerCase());
            });
        }

        // Apply Gender Filter
        if (genderFilter.length > 0) {
            currentFilteredProducts = currentFilteredProducts.filter(product => genderFilter.includes(product.gender));
        }

        setVisibleProducts(currentFilteredProducts);

    }, [categoryFilter, genderFilter, products]) // products added as dependency if props.category changes

    // --- RENDER ---
    return (
        <div className="products-container">
            <div className="products-filter">
                <h4>Filters</h4>
                <div className="product-filters-body">

                    {/* SORT BY FILTER (Used className instead of class) */}
                    <div className="filter-sort">
                        <h6>Sort By</h6>
                        <div className="filter-sort-body sub-filter-body">

                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="filter-sort-radio1" value="popularity" checked={sortFilter === 'popularity'} onChange={handleSortFilterChange} />
                                <label className="form-check-label" htmlFor="filter-sort-radio1" >
                                    Popular
                                </label>
                            </div>

                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="filter-sort-radio2" value="low-price" checked={sortFilter === 'low-price'} onChange={handleSortFilterChange} />
                                <label className="form-check-label" htmlFor="filter-sort-radio2">
                                    Price (low to high)
                                </label>
                            </div>

                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="filter-sort-radio3" value="high-price" checked={sortFilter === 'high-price'} onChange={handleSortFilterChange} />
                                <label className="form-check-label" htmlFor="filter-sort-radio3">
                                    Price (high to low)
                                </label>
                            </div>

                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="filter-sort-radio4" value="discount" checked={sortFilter === 'discount'} onChange={handleSortFilterChange} />
                                <label className="form-check-label" htmlFor="filter-sort-radio4">
                                    Discount
                                </label>
                            </div>

                        </div>
                    </div>

                    {/* CATEGORIES FILTER */}
                    <div className="filter-categories">
                        <h6>Categories</h6>
                        <div className="filter-categories-body sub-filter-body">
                            {categories.length > 0 ? (
                                categories.map((category, index)=>{
                                    // If database categories have inconsistent casing (e.g., 'mobiles'), fix it for display
                                    const displayName = category.charAt(0).toUpperCase() + category.slice(1);
                                    return(
                                        <div className="form-check" key={index}> 
                                            {/* Value remains the exact DB string for consistent filtering */}
                                            <input className="form-check-input" type="checkbox" value={category} id={'productCategory'+ category} checked={categoryFilter.includes(category)} onChange={handleCategoryCheckBox} />
                                            <label className="form-check-label" htmlFor={'productCategory'+ category}>
                                                {displayName}
                                            </label>
                                        </div>
                                    )
                                })
                            ) : (
                                <p>No product categories found.</p>
                            )}
                        </div>
                    </div>
                    
                    {/* GENDER FILTER */}
                    <div className="filter-gender">
                        <h6>Gender</h6>
                        <div className="filter-gender-body sub-filter-body">
                            
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value="Men" id="filter-gender-check-1" checked={genderFilter.includes('Men')} onChange={handleGenderCheckBox} />
                                <label className="form-check-label" htmlFor="filter-gender-check-1">
                                    Men
                                </label>
                            </div>

                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value="Women" id="filter-gender-check-2" checked={genderFilter.includes('Women')} onChange={handleGenderCheckBox} />
                                <label className="form-check-label" htmlFor="filter-gender-check-2">
                                    Women
                                </label>
                            </div>

                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value="Unisex" id="filter-gender-check-3" checked={genderFilter.includes('Unisex')} onChange={handleGenderCheckBox} />
                                <label className="form-check-label" htmlFor="filter-gender-check-3">
                                    Unisex
                                </label>
                            </div>

                        </div>
                    </div>

                </div>
            </div>


            <div className="products-body">
                <h3>All Products</h3>
                <div className="products">

                    {visibleProducts.map((product)=>{
                        return(
                            <div className='product-item' key={product._id}>
                                <div className="product" onClick={()=> navigate(`/product/${product._id}`)}>
                                    <img src={product.mainImg} alt="" />
                                    <div className="product-data">
                                        <h6>{product.title}</h6>
                                        <p>{product.description.slice(0,30) + '....'}</p>
                                        <h5>&#8377; {parseInt(product.price - (product.price * product.discount)/100)} <s>{product.price}</s><p>( {product.discount}% off)</p></h5>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                </div>
            </div>
        </div>
    )
}

export default Products