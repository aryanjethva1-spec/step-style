import React, { useState, useEffect, useContext } from 'react';
import { Card, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { FaCloudUploadAlt, FaSave, FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api, { BASE_URL } from '../services/api';
import BrandLayout from './BrandLayout';

const AddProduct = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const { brand, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !brand) {
            navigate('/');
        }
    }, [brand, authLoading, navigate]);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form fields
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [footwearType, setFootwearType] = useState('');
    const [description, setDescription] = useState('');
    const [sizes, setSizes] = useState('');
    const [image, setImage] = useState('');
    const [stock, setStock] = useState('');

    useEffect(() => {
        if (isEditMode) {
            fetchProductDetails();
        }
    }, [id]);

    const fetchProductDetails = async () => {
        setFetching(true);
        try {
            const { data } = await api.get(`/products/${id}`);
            setName(data.name);
            setPrice(data.price);
            setCategory(data.category);
            setFootwearType(data.footwearType || '');
            setDescription(data.description);
            setSizes(data.sizes.join(', '));
            setImage(data.image);
            setStock(data.stock);
        } catch (error) {
            console.error('Error fetching product details', error);
            alert('Failed to load product details');
            navigate('/brand/products');
        }
        setFetching(false);
    };

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            const { data } = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setImage(data.image);
        } catch (error) {
            console.error('Upload error:', error);
            alert(error.response?.data?.message || 'Image upload failed');
        }
        setUploading(false);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!image) return alert('Please upload an image');

        setLoading(true);
        try {
            const sizeArray = sizes.split(',').map(s => s.trim());
            const productData = {
                name,
                price: Number(price),
                category,
                footwearType,
                description,
                sizes: sizeArray,
                image,
                stock: Number(stock)
            };

            if (isEditMode) {
                await api.put(`/brand/products/${id}`, productData);
                alert('Product updated successfully!');
            } else {
                await api.post('/brand/products', productData);
                alert('Product added successfully!');
            }
            navigate('/brand/products');
        } catch (error) {
            alert(error.response?.data?.message || 'Error saving product');
        }
        setLoading(false);
    };

    if (fetching) return <div className="text-center py-5 mt-5"><Spinner animation="border" variant="danger" /></div>;

    return (
        <BrandLayout title={isEditMode ? 'Edit Product' : 'Add New Product'}>
            <div className="mb-4">
                <Button variant="outline-dark" className="rounded-pill px-4 shadow-sm d-flex align-items-center gap-2 border-0 bg-white" onClick={() => navigate('/brand/products')}>
                    <FaArrowLeft /> Back to Inventory
                </Button>
            </div>

            <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                <Card.Body className="p-4 p-md-5">
                    <Form onSubmit={submitHandler}>
                        <Row className="gy-4">
                            <Col md={12}>
                                <div className="p-4 rounded-4 bg-light border-dashed d-flex flex-column align-items-center justify-content-center text-center position-relative" style={{ border: '2px dashed #dee2e6', minHeight: '200px' }}>
                                    {image ? (
                                        <div className="position-relative">
                                            <img
                                                src={image.startsWith('http') ? image : `${BASE_URL}${image}`}
                                                alt="Preview"
                                                style={{ maxHeight: '250px', maxWidth: '100%', objectFit: 'contain' }}
                                                className="rounded shadow"
                                            />
                                            <div className="mt-3 text-success fw-bold small"><FaCheckCircle className="me-1" /> Image Chosen Successfully</div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="bg-white rounded-circle p-4 shadow-sm mb-3">
                                                <FaCloudUploadAlt className="text-danger fs-1" />
                                            </div>
                                            <h5 className="fw-bold mb-1">Upload Product Image</h5>
                                            <p className="text-muted small mb-0">Recommended size: 1000x1000px (JPG, PNG)</p>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        className="position-absolute w-100 h-100 opacity-0 cursor-pointer"
                                        onChange={uploadFileHandler}
                                        style={{ top: 0, left: 0, cursor: 'pointer' }}
                                    />
                                    {uploading && (
                                        <div className="position-absolute bg-white bg-opacity-75 d-flex align-items-center justify-content-center w-100 h-100 rounded-4">
                                            <Spinner animation="border" variant="danger" />
                                        </div>
                                    )}
                                </div>
                            </Col>

                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="fw-bold text-dark mb-2">Product Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g. Premium Leather Sneakers"
                                        className="rounded-3 p-3 bg-light border-0 shadow-none fs-5 h-auto fw-bold"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-bold text-dark mb-2">Footwear Type</Form.Label>
                                    <Form.Select
                                        className="rounded-3 p-3 bg-light border-0 shadow-none h-auto"
                                        value={footwearType}
                                        onChange={(e) => setFootwearType(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Footwear Type...</option>
                                        <option value="Shoes">Shoes</option>
                                        <option value="Sandals">Sandals</option>
                                        <option value="Sliders">Sliders/Flip-flops</option>
                                        <option value="Sneakers">Sneakers</option>
                                        <option value="Boots">Boots</option>
                                        <option value="Heels">Heels</option>
                                        <option value="Formal Shoes">Formal Shoes</option>
                                        <option value="Sports Shoes">Sports Shoes</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-bold text-dark mb-2">Target Group (Gender)</Form.Label>
                                    <Form.Select
                                        className="rounded-3 p-3 bg-light border-0 shadow-none h-auto"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Group...</option>
                                        <option value="Men">Men</option>
                                        <option value="Women">Women</option>
                                        <option value="Kids">Kids</option>
                                        <option value="Unisex">Unisex</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label className="fw-bold text-dark mb-2">Price (₹)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="0.00"
                                        className="rounded-3 p-3 bg-light border-0 shadow-none h-auto"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                        min="0"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label className="fw-bold text-dark mb-2">Initial Stock</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="0"
                                        className="rounded-3 p-3 bg-light border-0 shadow-none h-auto"
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                        required
                                        min="0"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="fw-bold text-dark mb-2">Available Sizes (comma separated)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g. 7, 8, 9, 10, 11"
                                        className="rounded-3 p-3 bg-light border-0 shadow-none h-auto"
                                        value={sizes}
                                        onChange={(e) => setSizes(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="fw-bold text-dark mb-2">Detailed Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={5}
                                        placeholder="Describe the material, comfort, and unique features of this footwear..."
                                        className="rounded-4 p-3 bg-light border-0 shadow-none h-auto"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={12} className="text-end mt-4">
                                <Button
                                    variant="danger"
                                    type="submit"
                                    size="lg"
                                    className="rounded-pill px-5 py-3 fw-bold shadow-sm d-inline-flex align-items-center gap-2"
                                    disabled={loading || uploading}
                                >
                                    {loading ? <Spinner animation="border" size="sm" /> : <FaSave />}
                                    {isEditMode ? 'Update Product Details' : 'Publish New Product'}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            <style>{`
                .border-dashed { border-style: dashed !important; }
                .cursor-pointer { cursor: pointer; }
            `}</style>
        </BrandLayout>
    );
};

const AddProductLayout = ({ children, title }) => (
    <div className="add-product-container">{children}</div>
);

// We need to export it but wrap it in BrandLayout correctly in the main component
const ExportableAddProduct = () => (
    <AddProduct />
);

export default AddProduct;
