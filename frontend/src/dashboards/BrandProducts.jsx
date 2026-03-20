import React, { useState, useEffect, useContext } from 'react';
import { Card, Table, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch, FaBox, FaEye } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import api, { BASE_URL } from '../services/api';
import BrandLayout from './BrandLayout';
import { useNavigate } from 'react-router-dom';

const BrandProducts = () => {
    const { brand, loading: authLoading } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !brand) {
            navigate('/');
        }
        if (!authLoading && brand) {
            fetchProducts();
        }
    }, [brand, authLoading, navigate]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/products/brand/${brand._id}`);
            setProducts(data.products || []);
        } catch (error) {
            console.error('Error fetching brand products', error);
        }
        setLoading(false);
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/brand/products/${id}`);
                fetchProducts();
            } catch (error) {
                alert(error.response?.data?.message || 'Error deleting product');
            }
        }
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <BrandLayout title="My Products">
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                <Card.Header className="bg-white border-0 p-4">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <h5 className="fw-bold mb-0 d-flex align-items-center">
                            <FaBox className="text-danger me-2" />
                            Inventory List <span className="ms-2 badge bg-light text-dark fw-normal" style={{ fontSize: '0.7rem' }}>{filteredProducts.length} Products Found</span>
                        </h5>
                        <InputGroup className="max-width-md shadow-sm rounded-pill" style={{ maxWidth: '400px' }}>
                            <InputGroup.Text className="bg-white border-0 ps-3">
                                <FaSearch className="text-muted" />
                            </InputGroup.Text>
                            <Form.Control
                                placeholder="Search by name or category..."
                                className="border-0 shadow-none ps-1 py-2"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                    </div>
                </Card.Header>
                <Card.Body className="p-0">
                    <Table hover responsive className="mb-0 align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="px-4 py-3 border-0 text-muted small text-uppercase">Image</th>
                                <th className="py-3 border-0 text-muted small text-uppercase">Product Details</th>
                                <th className="py-3 border-0 text-muted small text-uppercase text-center">Category</th>
                                <th className="py-3 border-0 text-muted small text-uppercase text-center">Stock</th>
                                <th className="py-3 border-0 text-muted small text-uppercase text-center">Price</th>
                                <th className="px-4 py-3 border-0 text-muted small text-uppercase text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-5">
                                        <div className="spinner-border text-danger"></div>
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-5">
                                        <p className="text-muted mb-0">No products found matching your search.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map(product => (
                                    <tr key={product._id} className="transition-all hover-bg-light">
                                        <td className="px-4">
                                            <div className="bg-light rounded p-1 d-inline-block">
                                                <img 
                                                    src={product.image.startsWith('http') ? product.image : `${BASE_URL}${product.image}`} 
                                                    alt={product.name} 
                                                    style={{ width: '45px', height: '45px', objectFit: 'cover' }} 
                                                    className="rounded" 
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="fw-bold text-dark">{product.name}</div>
                                            <div className="small text-muted text-truncate" style={{ maxWidth: '200px' }}>{product.description}</div>
                                            <div className="mt-1">
                                                <Badge bg="secondary" className="bg-opacity-10 text-muted border border-secondary border-opacity-25 rounded-pill px-2 py-1 me-1" style={{ fontSize: '0.65rem' }}>
                                                    {product.footwearType}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <Badge bg="danger" className="bg-opacity-10 text-danger border border-danger border-opacity-25 rounded-pill px-3 py-2 fw-semibold">
                                                {product.category}
                                            </Badge>
                                        </td>
                                        <td className="text-center">
                                            <div className={product.stock > 10 ? 'fw-bold text-success' : 'fw-bold text-danger'}>
                                                {product.stock}
                                            </div>
                                            <small className="text-muted" style={{ fontSize: '0.7rem' }}>Units Available</small>
                                        </td>
                                        <td className="text-center fw-bold">₹{product.price.toLocaleString()}</td>
                                        <td className="px-4 text-end">
                                            <div className="d-flex justify-content-end gap-2">
                                                <Button 
                                                    className="btn-lax-view"
                                                    title="View on Shop"
                                                    onClick={() => navigate(`/product/${product._id}`)}
                                                >
                                                    <FaEye size={12} /> View
                                                </Button>
                                                <Button 
                                                    variant="outline-dark" 
                                                    size="sm" 
                                                    className="rounded-circle p-2 d-flex shadow-sm"
                                                    onClick={() => navigate(`/brand/edit-product/${product._id}`)}
                                                >
                                                    <FaEdit size={14} />
                                                </Button>
                                                <Button 
                                                    variant="outline-danger" 
                                                    size="sm" 
                                                    className="rounded-circle p-2 d-flex shadow-sm"
                                                    onClick={() => deleteHandler(product._id)}
                                                >
                                                    <FaTrash size={14} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <style>{`
                .hover-bg-light:hover { background-color: rgba(0,0,0,0.01); }
                .transition-all { transition: all 0.2s ease; }
            `}</style>
        </BrandLayout>
    );
};

export default BrandProducts;
