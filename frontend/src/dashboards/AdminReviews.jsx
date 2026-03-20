import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { Table, Button, Spinner, Badge } from 'react-bootstrap';
import { FaTrash, FaStar } from 'react-icons/fa';
import api, { BASE_URL } from '../services/api';

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const { data } = await api.get('/admin/reviews');
            setReviews(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            try {
                await api.delete(`/admin/reviews/${id}`);
                alert('Review deleted successfully');
                fetchReviews();
            } catch (error) {
                alert(error.response?.data?.message || 'Error deleting review');
            }
        }
    };

    return (
        <AdminLayout title="Customer Reviews">
            <div className="bg-white rounded-4 shadow-sm p-4">
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="danger" />
                    </div>
                ) : (
                    <div className="table-responsive">
                        <Table hover className="align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th>Product</th>
                                    <th>Reviewer</th>
                                    <th>Rating</th>
                                    <th style={{ width: '40%' }}>Comment</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">No reviews found.</td>
                                    </tr>
                                ) : (
                                    reviews.map((rev) => (
                                        <tr key={rev._id}>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <img 
                                                        src={rev.productId?.image?.startsWith('http') ? rev.productId.image : `${BASE_URL}${rev.productId?.image}`} 
                                                        alt="" 
                                                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                        className="rounded"
                                                    />
                                                    <span className="small fw-bold">{rev.productId?.name}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex flex-column">
                                                    <span className="fw-bold">{rev.name || rev.userId?.name}</span>
                                                    <small className="text-muted">{rev.email || rev.userId?.email}</small>
                                                    {!rev.userId && <Badge bg="info" className="w-fit" style={{ fontSize: '10px' }}>Guest</Badge>}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="text-warning d-flex align-items-center gap-1">
                                                    <FaStar />
                                                    <span className="fw-bold text-dark">{rev.rating}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <p className="mb-0 small text-secondary" style={{ maxHeight: '60px', overflowY: 'auto' }}>
                                                    {rev.comment}
                                                </p>
                                            </td>
                                            <td className="small text-muted">
                                                {new Date(rev.createdAt).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <Button 
                                                    variant="outline-danger" 
                                                    size="sm" 
                                                    className="rounded-circle p-2"
                                                    onClick={() => deleteHandler(rev._id)}
                                                >
                                                    <FaTrash />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminReviews;
