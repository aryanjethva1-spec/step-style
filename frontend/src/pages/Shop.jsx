import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Breadcrumb, Pagination, Offcanvas } from 'react-bootstrap';
import { FaSearch, FaFilter, FaStar, FaTimes } from 'react-icons/fa';
import { useLocation, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

const Shop = () => {
    const location = useLocation();
    
    // Parse query params for initial state if present
    const searchParams = new URLSearchParams(location.search);
    const initialCategory = searchParams.get('category') || '';
    
    // States
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    
    // Filters State
    const [inputValue, setInputValue] = useState(searchParams.get('keyword') || '');
    const [keyword, setKeyword] = useState(inputValue);
    const [gender, setGender] = useState('');
    const [footwearType, setFootwearType] = useState(initialCategory ? '' : ''); // If you passed ?category from home
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [rating, setRating] = useState('');
    const [priceRange, setPriceRange] = useState(10000);
    
    // If incoming category from Home matches a type or gender, handle it
    useEffect(() => {
        if (initialCategory) {
            if (['Men', 'Women', 'Kids', 'Boys', 'Girls'].includes(initialCategory)) {
                setGender(initialCategory === 'Boys' || initialCategory === 'Girls' ? 'Kids' : initialCategory);
            } else {
                setFootwearType(initialCategory);
            }
        }
    }, [initialCategory]);

    // Sorting & Pagination State
    const [sort, setSort] = useState('newest');
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    const filterOptions = {
        genders: ['All', 'Men', 'Women', 'Kids'],
        footwearTypes: ['All', 'Sneakers', 'Sports Shoes', 'Casual Shoes', 'Formal Shoes', 'Sandals'],
        sizes: ['6', '7', '8', '9', '10', '11'],
        ratings: [
            { label: '4 Stars & Above', value: 4 },
            { label: '3 Stars & Above', value: 3 }
        ]
    };

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            setKeyword(inputValue);
            setPageNumber(1); // Reset to page 1 on new search
        }, 500);
        return () => clearTimeout(timer);
    }, [inputValue]);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const { data } = await api.get('/brand/public');
                setBrands(data);
            } catch (error) {
                console.error('Error fetching brands', error);
            }
        };
        fetchBrands();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let url = `/products?pageNumber=${pageNumber}&maxPrice=${priceRange}&sort=${sort}`;
                if (keyword) url += `&keyword=${keyword}`;
                if (gender && gender !== 'All') url += `&gender=${gender}`;
                if (footwearType && footwearType !== 'All') url += `&footwearType=${footwearType}`;
                if (selectedBrand) url += `&brand=${selectedBrand}`;
                if (selectedSize) url += `&size=${selectedSize}`;
                if (rating) url += `&rating=${rating}`;
                
                const { data } = await api.get(url);
                setProducts(data.products || []);
                setTotalPages(data.pages || 1);
            } catch (error) {
                console.error('Error fetching products', error);
            }
            setLoading(false);
        };

        fetchProducts();
    }, [keyword, gender, footwearType, selectedBrand, selectedSize, rating, priceRange, sort, pageNumber]);

    const clearFilters = () => {
        setInputValue('');
        setKeyword('');
        setGender('');
        setFootwearType('');
        setSelectedBrand('');
        setSelectedSize('');
        setRating('');
        setPriceRange(10000);
        setSort('newest');
        setPageNumber(1);
    };

    const filterSidebarContent = (
        <div className="mt-3">
            {/* Search */}
            <div className="mb-4">
                <h6 className="fw-bold mb-3 text-uppercase small text-muted letter-spacing-1">Search</h6>
                <InputGroup>
                    <InputGroup.Text className="bg-light border-0"><FaSearch className="text-muted" /></InputGroup.Text>
                    <Form.Control placeholder="Find sneakers..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="bg-light border-0 shadow-none py-2" />
                </InputGroup>
            </div>
            {/* Category Filter */}
            <div className="mb-4">
                <h6 className="fw-bold mb-3 text-uppercase small text-muted letter-spacing-1">Category</h6>
                {filterOptions.footwearTypes.map((type, idx) => (
                    <Form.Check key={idx} id={`type-m-${idx}`} type="radio" name="footwearTypeM" label={type}
                        checked={footwearType === type || (footwearType === '' && type === 'All')}
                        onChange={() => { setFootwearType(type === 'All' ? '' : type); setPageNumber(1); }}
                        className="mb-2 text-dark custom-radio" />
                ))}
            </div>
            {/* Gender Filter */}
            <div className="mb-4">
                <h6 className="fw-bold mb-3 text-uppercase small text-muted letter-spacing-1">Gender</h6>
                {filterOptions.genders.map((g, idx) => (
                    <Form.Check key={idx} id={`gender-m-${idx}`} type="radio" name="genderFilterM" label={g}
                        checked={gender === g || (gender === '' && g === 'All')}
                        onChange={() => { setGender(g === 'All' ? '' : g); setPageNumber(1); }}
                        className="mb-2 text-dark custom-radio" />
                ))}
            </div>
            {/* Size Filter */}
            <div className="mb-4">
                <h6 className="fw-bold mb-3 text-uppercase small text-muted letter-spacing-1">Size (UK/IND)</h6>
                <div className="d-flex flex-wrap gap-2">
                    {filterOptions.sizes.map((s, idx) => (
                        <div key={idx} className={`size-filter-btn ${selectedSize === s ? 'active' : ''}`}
                            onClick={() => { setSelectedSize(selectedSize === s ? '' : s); setPageNumber(1); }}>
                            {s}
                        </div>
                    ))}
                </div>
            </div>
            {/* Price Range Filter */}
            <div className="mb-4">
                <h6 className="fw-bold mb-3 text-uppercase small text-muted letter-spacing-1">Price Range</h6>
                <Form.Label className="d-flex justify-content-between small fw-bold">
                    <span>₹0</span><span className="text-danger">₹{priceRange}</span>
                </Form.Label>
                <Form.Range min={0} max={20000} step={500} value={priceRange}
                    onChange={(e) => { setPriceRange(e.target.value); setPageNumber(1); }} className="custom-range" />
            </div>
            {/* Brand Filter */}
            <div className="mb-4">
                <h6 className="fw-bold mb-3 text-uppercase small text-muted letter-spacing-1">Brands</h6>
                <Form.Check type="radio" id="brand-m-all" name="brandFilterM" label="All Brands"
                    checked={selectedBrand === ''} onChange={() => { setSelectedBrand(''); setPageNumber(1); }}
                    className="mb-2 text-dark custom-radio" />
                {brands.map((b) => (
                    <Form.Check key={b._id} id={`brand-m-${b._id}`} type="radio" name="brandFilterM"
                        label={b.brandName} checked={selectedBrand === b._id}
                        onChange={() => { setSelectedBrand(b._id); setPageNumber(1); }}
                        className="mb-2 text-dark custom-radio" />
                ))}
            </div>
            {/* Rating Filter */}
            <div className="mb-4 border-top pt-4">
                <h6 className="fw-bold mb-3 text-uppercase small text-muted letter-spacing-1">Customer Reviews</h6>
                <Form.Check type="radio" name="ratingFilterM" id="rating-m-all" label="Any Rating"
                    checked={rating === ''} onChange={() => { setRating(''); setPageNumber(1); }}
                    className="mb-2 text-dark custom-radio" />
                {filterOptions.ratings.map((r, idx) => (
                    <Form.Check key={idx} id={`rating-m-${idx}`} type="radio" name="ratingFilterM"
                        label={<span className="d-flex align-items-center">{[...Array(5)].map((_, i) => (<FaStar key={i} size={12} className={i < r.value ? "text-warning me-1" : "text-muted opacity-25 me-1"} />))}<span className="ms-1 small">& Up</span></span>}
                        checked={rating === r.value} onChange={() => { setRating(r.value); setPageNumber(1); }}
                        className="mb-2 text-dark custom-radio d-flex align-items-center" />
                ))}
            </div>
        </div>
    );

    return (
        <div className="bg-light pb-5">
            {/* 2. Page Header / Hero Section */}
            <div className="position-relative text-white py-5 mb-5" style={{ 
                background: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80") center/cover no-repeat',
                minHeight: '300px',
                display: 'flex',
                alignItems: 'center'
            }}>
                <Container className="text-center fade-in-up">
                    <h1 className="display-4 fw-black text-uppercase letter-spacing-2 mb-3">Shop All Footwear</h1>
                    <p className="lead fw-light opacity-75 text-uppercase letter-spacing-1">Find the perfect pair for every step</p>
                </Container>
            </div>

            <Container>
                {/* Mobile Filter Toggle Button */}
                <div className="d-lg-none mb-3">
                    <Button 
                        variant="dark" 
                        className="rounded-pill px-4 fw-bold w-100 d-flex align-items-center justify-content-center gap-2"
                        onClick={() => setShowFilters(true)}
                    >
                        <FaFilter /> Filter & Search Products
                    </Button>
                </div>

                {/* Mobile Filter Offcanvas */}
                <Offcanvas show={showFilters} onHide={() => setShowFilters(false)} placement="start">
                    <Offcanvas.Header className="border-bottom">
                        <Offcanvas.Title className="fw-bold d-flex align-items-center gap-2"><FaFilter className="text-danger"/> Filters</Offcanvas.Title>
                        <Button variant="link" className="text-dark ms-auto p-0" onClick={() => setShowFilters(false)}><FaTimes size={20}/></Button>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <span className="text-danger small fw-bold cursor-pointer" onClick={() => { clearFilters(); setShowFilters(false); }}>Clear All Filters</span>
                        {filterSidebarContent}
                    </Offcanvas.Body>
                </Offcanvas>

                <Row className="g-4">
                    {/* 3. Filter Sidebar — desktop only */}
                    <Col lg={3} className="d-none d-lg-block fade-in-left">
                        <div className="bg-white p-4 rounded-4 shadow-sm mb-4">
                            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                                <h5 className="fw-bold mb-0 d-flex align-items-center"><FaFilter className="me-2 text-danger"/> Filters</h5>
                                <span className="text-danger small fw-bold cursor-pointer hover-opacity" onClick={clearFilters}>Clear All</span>
                            </div>

                            {/* Search */}
                            <div className="mb-4">
                                <h6 className="fw-bold mb-3 text-uppercase small text-muted letter-spacing-1">Search</h6>
                                <InputGroup>
                                    <InputGroup.Text className="bg-light border-0"><FaSearch className="text-muted" /></InputGroup.Text>
                                    <Form.Control
                                        placeholder="Find sneakers..."
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        className="bg-light border-0 shadow-none py-2"
                                    />
                                </InputGroup>
                            </div>

                            {/* Category Filter */}
                            <div className="mb-4">
                                <h6 className="fw-bold mb-3 text-uppercase small text-muted letter-spacing-1">Category</h6>
                                {filterOptions.footwearTypes.map((type, idx) => (
                                    <Form.Check 
                                        key={idx} id={`type-${idx}`}
                                        type="radio" name="footwearType"
                                        label={type}
                                        checked={footwearType === type || (footwearType === '' && type === 'All')}
                                        onChange={() => { setFootwearType(type === 'All' ? '' : type); setPageNumber(1); }}
                                        className="mb-2 text-dark custom-radio"
                                    />
                                ))}
                            </div>

                            {/* Gender Filter */}
                            <div className="mb-4">
                                <h6 className="fw-bold mb-3 text-uppercase small text-muted letter-spacing-1">Gender</h6>
                                {filterOptions.genders.map((g, idx) => (
                                    <Form.Check 
                                        key={idx} id={`gender-${idx}`}
                                        type="radio" name="genderFilter"
                                        label={g}
                                        checked={gender === g || (gender === '' && g === 'All')}
                                        onChange={() => { setGender(g === 'All' ? '' : g); setPageNumber(1); }}
                                        className="mb-2 text-dark custom-radio"
                                    />
                                ))}
                            </div>

                            {/* Size Filter */}
                            <div className="mb-4">
                                <h6 className="fw-bold mb-3 text-uppercase small text-muted letter-spacing-1">Size (UK/IND)</h6>
                                <div className="d-flex flex-wrap gap-2">
                                    {filterOptions.sizes.map((s, idx) => (
                                        <div 
                                            key={idx} 
                                            className={`size-filter-btn ${selectedSize === s ? 'active' : ''}`}
                                            onClick={() => { setSelectedSize(selectedSize === s ? '' : s); setPageNumber(1); }}
                                        >
                                            {s}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range Filter */}
                            <div className="mb-4">
                                <h6 className="fw-bold mb-3 text-uppercase small text-muted letter-spacing-1">Price Range</h6>
                                <Form.Label className="d-flex justify-content-between small fw-bold">
                                    <span>₹0</span>
                                    <span className="text-danger">₹{priceRange}</span>
                                </Form.Label>
                                <Form.Range 
                                    min={0} max={20000} step={500} 
                                    value={priceRange} 
                                    onChange={(e) => { setPriceRange(e.target.value); setPageNumber(1); }} 
                                    className="custom-range"
                                />
                            </div>

                            {/* Brand Filter */}
                            <div className="mb-4">
                                <h6 className="fw-bold mb-3 text-uppercase small text-muted letter-spacing-1">Brands</h6>
                                <Form.Check 
                                    type="radio" id="brand-all" name="brandFilter"
                                    label="All Brands"
                                    checked={selectedBrand === ''}
                                    onChange={() => { setSelectedBrand(''); setPageNumber(1); }}
                                    className="mb-2 text-dark custom-radio"
                                />
                                {brands.map((b) => (
                                    <Form.Check 
                                        key={b._id} id={`brand-${b._id}`} type="radio" name="brandFilter"
                                        label={b.brandName}
                                        checked={selectedBrand === b._id}
                                        onChange={() => { setSelectedBrand(b._id); setPageNumber(1); }}
                                        className="mb-2 text-dark custom-radio"
                                    />
                                ))}
                            </div>

                            {/* Rating Filter */}
                            <div className="mb-4 border-top pt-4">
                                <h6 className="fw-bold mb-3 text-uppercase small text-muted letter-spacing-1">Customer Reviews</h6>
                                <Form.Check 
                                    type="radio" name="ratingFilter" id="rating-all"
                                    label="Any Rating"
                                    checked={rating === ''}
                                    onChange={() => { setRating(''); setPageNumber(1); }}
                                    className="mb-2 text-dark custom-radio"
                                />
                                {filterOptions.ratings.map((r, idx) => (
                                    <Form.Check 
                                        key={idx} id={`rating-${idx}`} type="radio" name="ratingFilter"
                                        label={
                                            <span className="d-flex align-items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar key={i} size={12} className={i < r.value ? "text-warning me-1" : "text-muted opacity-25 me-1"} />
                                                ))}
                                                <span className="ms-1 small">& Up</span>
                                            </span>
                                        }
                                        checked={rating === r.value}
                                        onChange={() => { setRating(r.value); setPageNumber(1); }}
                                        className="mb-2 text-dark custom-radio d-flex align-items-center"
                                    />
                                ))}
                            </div>

                        </div>
                    </Col>

                    {/* Main Content */}
                    <Col lg={9}>
                        {/* 4. Sort Bar (Top Right) */}
                        <div className="bg-white p-3 rounded-4 shadow-sm mb-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 fade-in-up">
                            <h6 className="mb-0 fw-bold text-muted">Showing results for your selection</h6>
                            <div className="d-flex align-items-center gap-2">
                                <span className="small fw-bold text-nowrap text-uppercase letter-spacing-1">Sort By:</span>
                                <Form.Select 
                                    value={sort} 
                                    onChange={(e) => { setSort(e.target.value); setPageNumber(1); }} 
                                    className="bg-light border-0 fw-semibold shadow-none w-auto"
                                >
                                    <option value="newest">Newest Arrivals</option>
                                    <option value="priceLow">Price: Low to High</option>
                                    <option value="priceHigh">Price: High to Low</option>
                                    <option value="bestSelling">Best Selling</option>
                                    <option value="topRated">Top Rated</option>
                                </Form.Select>
                            </div>
                        </div>

                        {/* 5. Product Grid Section */}
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-danger" role="status" style={{ width: '3rem', height: '3rem' }}></div>
                                <h5 className="mt-3 text-muted fw-bold">Loading brilliant pairs...</h5>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="bg-white p-5 rounded-4 shadow-sm text-center">
                                <img src="https://cdn-icons-png.flaticon.com/512/10332/10332306.png" alt="No Results" style={{ width: '120px', opacity: 0.5 }} className="mb-4" />
                                <h3 className="fw-black mb-3 text-dark">No Products Found</h3>
                                <p className="text-muted mb-4">Try adjusting your filters or search keywords to find what you're looking for.</p>
                                <Button variant="danger" className="rounded-pill px-4" onClick={clearFilters}>Clear All Filters</Button>
                            </div>
                        ) : (
                            <>
                                <Row className="g-4 mb-5">
                                    {products.map((product, index) => (
                                        <React.Fragment key={product._id}>
                                            <Col md={6} xl={4} className="fade-in-up" style={{ animationDelay: `${(index % 6) * 0.1}s` }}>
                                                <ProductCard product={product} />
                                            </Col>

                                            {/* 8. Promotional Banner (Inserted after the 6th active product if paginated) */}
                                            {index === 5 && (
                                                <Col xs={12} className="fade-in-up my-4">
                                                    <div className="rounded-4 overflow-hidden position-relative d-flex align-items-center p-4 p-md-5" style={{ background: 'linear-gradient(45deg, #000000, #dc3545)' }}>
                                                        <div className="position-relative z-index-1 text-white w-100 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
                                                            <div>
                                                                <h2 className="fw-black display-5 text-uppercase mb-2">Get 30% OFF</h2>
                                                                <p className="lead mb-0 opacity-75 fw-bold">On Performance Sports Shoes</p>
                                                            </div>
                                                            <Button variant="light" size="lg" className="text-danger fw-bold rounded-pill px-5 text-uppercase shadow-sm hover-scale" onClick={() => { setFootwearType('Sports Shoes'); setPageNumber(1); window.scrollTo(0,0); }}>
                                                                Shop Offer
                                                            </Button>
                                                        </div>
                                                        {/* Abstract background graphics */}
                                                        <div className="position-absolute end-0 top-0 h-100 opacity-25 object-fit-cover" style={{ width: '40%' }}>
                                                            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path fill="#FFFFFF" d="M49.6,-61.2C65.5,-48.6,80.7,-34.5,84.1,-18.3C87.4,-2,79.1,16.5,67.7,31.7C56.3,46.9,41.9,58.8,25.9,64.4C10,70,-7.6,69.4,-22.8,63.4C-38,57.4,-50.8,46,-61.7,31.5C-72.6,17,-81.4,-0.6,-78.9,-16.4C-76.3,-32.1,-62.3,-46.1,-46.9,-58.5C-31.5,-71,-15.7,-81.9,0.3,-82.3C16.3,-82.6,33.7,-73.8,49.6,-61.2Z" transform="translate(100 100)" /></svg>
                                                        </div>
                                                    </div>
                                                </Col>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </Row>

                                {/* 7. Pagination */}
                                {totalPages > 1 && (
                                    <div className="d-flex justify-content-center pt-4 border-top">
                                        <Pagination className="custom-pagination shadow-sm rounded-pill overflow-hidden bg-white p-2">
                                            <Pagination.Prev 
                                                disabled={pageNumber === 1} 
                                                onClick={() => { setPageNumber(p => Math.max(1, p - 1)); window.scrollTo(0,0); }}
                                                className="fw-bold text-uppercase small"
                                            >
                                                Previous
                                            </Pagination.Prev>
                                            
                                            {[...Array(totalPages).keys()].map(x => (
                                                <Pagination.Item 
                                                    key={x + 1} 
                                                    active={x + 1 === pageNumber}
                                                    onClick={() => { setPageNumber(x + 1); window.scrollTo(0,0); }}
                                                    className="fw-bold mx-1"
                                                >
                                                    {x + 1}
                                                </Pagination.Item>
                                            ))}
                                            
                                            <Pagination.Next 
                                                disabled={pageNumber === totalPages} 
                                                onClick={() => { setPageNumber(p => Math.min(totalPages, p + 1)); window.scrollTo(0,0); }}
                                                className="fw-bold text-uppercase small"
                                            >
                                                Next
                                            </Pagination.Next>
                                        </Pagination>
                                    </div>
                                )}
                            </>
                        )}
                    </Col>
                </Row>
            </Container>

            {/* 9. Recently Viewed Section (Demo display sharing the same design style) */}
            <Container className="my-5 pt-5 border-top fade-in-up">
                <div className="d-flex justify-content-between align-items-end mb-4">
                    <div>
                        <h6 className="text-secondary text-uppercase fw-bold letter-spacing-2 mb-2">Your History</h6>
                        <h3 className="fw-black fs-2 text-dark text-uppercase mb-0">Recently Viewed</h3>
                    </div>
                </div>
                <div className="d-flex pb-4 custom-scrollbar" style={{ overflowX: 'auto', gap: '1.5rem', mx: '-1rem', padding: '0 1rem' }}>
                    {products.slice(0, 5).map(product => (
                        <div key={product._id} style={{ minWidth: '280px', flex: '0 0 auto' }}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </Container>

            <style>{`
                .fw-black { font-weight: 900; }
                .letter-spacing-1 { letter-spacing: 1px; }
                .letter-spacing-2 { letter-spacing: 2px; }
                .cursor-pointer { cursor: pointer; }
                .hover-opacity:hover { opacity: 0.7; }
                .hover-scale:hover { transform: translateY(-3px) scale(1.02); }
                
                .custom-radio .form-check-input:checked { background-color: #dc3545; border-color: #dc3545; }
                .custom-radio .form-check-input:focus { box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25); }
                .custom-radio .form-check-label { font-weight: 500; cursor: pointer; }
                
                .size-filter-btn {
                    width: 45px; height: 45px;
                    display: flex; align-items: center; justify-content: center;
                    border: 2px solid #e9ecef; border-radius: 8px;
                    font-weight: bold; cursor: pointer; background: white;
                    transition: all 0.2s ease;
                }
                .size-filter-btn:hover { border-color: #dc3545; color: #dc3545; }
                .size-filter-btn.active { background-color: #dc3545; border-color: #dc3545; color: white; }
                
                .custom-range::-webkit-slider-thumb { background: #dc3545; }
                .custom-range::-webkit-slider-thumb:active { background: #c82333; }
                
                .custom-pagination .page-item.active .page-link { background-color: #dc3545; border-color: #dc3545; color: white; border-radius: 5px; }
                .custom-pagination .page-link { color: #212529; border: none; padding: 0.5rem 1rem; border-radius: 5px; }
                .custom-pagination .page-link:hover { background-color: #f8f9fa; color: #dc3545; }
                .custom-pagination .page-item.disabled .page-link { background-color: transparent; }

                .custom-scrollbar::-webkit-scrollbar { height: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #dc3545; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #c82333; }
            `}</style>
        </div>
    );
};

export default Shop;
