import React, { useState, useEffect, useContext } from 'react';
import { Card, Table, Badge, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api, { BASE_URL } from '../services/api';
import AdminLayout from './AdminLayout';
import { FaTrash, FaEye } from 'react-icons/fa';

const AdminProducts = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.role !== 'admin') {
                navigate('/');
            } else {
                fetchProducts();
            }
        }
    }, [user, authLoading, navigate]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/products');
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products', error);
        }
        setLoading(false);
    };

    const deleteProductHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/brand/products/${id}`);
                fetchProducts();
            } catch (error) {
                alert('Error deleting product');
            }
        }
    };

    if (authLoading || loading) return <div className="text-center py-5"><Spinner animation="border" variant="danger" /></div>;

    // Group products by brand
    const groupedProducts = products.reduce((groups, product) => {
        const brand = product.brandName || 'Unknown Brand';
        if (!groups[brand]) {
            groups[brand] = [];
        }
        groups[brand].push(product);
        return groups;
    }, {});

    return (
        <AdminLayout title="Global Product Inventory">
            <div className="mb-4">
                <p className="text-muted">Viewing all marketplace products grouped by their respective brand partners.</p>
            </div>

            {Object.keys(groupedProducts).length === 0 ? (
                <div className="text-center py-5 bg-white rounded-4 shadow-sm border">
                    <h5 className="text-muted mb-0">No products found in the database.</h5>
                </div>
            ) : (
                <div className="products-by-brand">
                    {Object.entries(groupedProducts).map(([brandName, brandProducts]) => (
                        <Card key={brandName} className="border-0 shadow-sm rounded-4 mb-5 overflow-hidden">
                            <Card.Header className="bg-dark text-white py-3 px-4 d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center gap-2">
                                    <h5 className="mb-0 fw-bold">{brandName}</h5>
                                </div>
                                <Badge bg="danger" pill className="px-3 py-2">{brandProducts.length} {brandProducts.length === 1 ? 'Product' : 'Products'}</Badge>
                            </Card.Header>
                            <Card.Body className="p-0">
                                <Table hover responsive className="mb-0 align-middle">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="px-4 py-3">Product Info</th>
                                            <th className="py-3">Category</th>
                                            <th className="py-3">Price</th>
                                            <th className="py-3">Stock Status</th>
                                            <th className="px-4 py-3 text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {brandProducts.map(product => (
                                            <tr key={product._id}>
                                                <td className="px-4 py-3">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <img 
                                                            src={product.image.startsWith('http') ? product.image : `${BASE_URL}${product.image}`} 
                                                            alt={product.name} 
                                                            className="rounded shadow-sm border"
                                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                                                        />
                                                        <div>
                                                            <div className="fw-bold text-dark">{product.name}</div>
                                                            <small className="text-muted d-block" style={{ fontSize: '11px' }}>ID: {product._id}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <Badge bg="light" text="dark" className="border fw-normal">{product.category}</Badge>
                                                </td>
                                                <td className="fw-bold text-danger">₹{product.price.toFixed(2)}</td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className={`rounded-circle ${product.stock < 10 ? 'bg-danger' : 'bg-success'}`} style={{ width: '8px', height: '8px' }}></div>
                                                        <span className={`fw-semibold ${product.stock < 10 ? 'text-danger' : 'text-dark'}`}>
                                                            {product.stock} in stock
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 text-end">
                                                    <div className="d-flex justify-content-end gap-2">
                                                        <Button 
                                                            className="btn-lax-view" 
                                                            onClick={() => navigate(`/product/${product._id}`)}
                                                        >
                                                            <FaEye size={12} /> View
                                                        </Button>
                                                        <Button variant="danger" size="sm" onClick={() => deleteProductHandler(product._id)} className="rounded-pill px-3 shadow-sm border-0">
                                                            <FaTrash size={12} />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                            <Card.Footer className="bg-white border-0 py-3 text-end px-4">
                                <small className="text-muted fw-bold">Inventory Value: ₹{brandProducts.reduce((sum, p) => sum + (p.price * p.stock), 0).toLocaleString()}</small>
                            </Card.Footer>
                        </Card>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminProducts;
