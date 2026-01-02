"use client";

import React, { useState } from 'react';

// actually the plan said Home.css. I will use a className and import Home.css or just rely on global Home.css if imported in layout/page. 
// But commonly components might have their own. 
// Let's use inline styles or standard CSS classes defined in Home.css to match existing patterns.

export default function ProductRequest() {
    const [formData, setFormData] = useState({
        productName: '',
        details: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/save-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitted(true);
                setFormData({ productName: '', details: '' });
            } else {
                alert('Failed to send request. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting request:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="product-request-section">
            <div className="section-container">
                <div className="request-content">
                    <h2 className="section-title">Missing Something?</h2>
                    <p className="section-subtitle">
                        Can't find what you need? Let us know what products you'd like to see, and we'll do our best to stock them.
                    </p>

                    {!submitted ? (
                        <form className="request-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Product Name (e.g., Huggies Size 4)"
                                    value={formData.productName}
                                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                                    required
                                    className="request-input"
                                />
                            </div>
                            <div className="form-group">
                                <textarea
                                    placeholder="Additional Details (optional)"
                                    value={formData.details}
                                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                    className="request-textarea"
                                    rows={3}
                                />
                            </div>
                            <button type="submit" className="request-button" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Request'}
                            </button>
                        </form>
                    ) : (
                        <div className="success-message">
                            <div className="success-icon">✓</div>
                            <h3>Request Sent!</h3>
                            <p>Thanks for your feedback. We'll look into it!</p>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="request-button-secondary"
                            >
                                Send Another
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
