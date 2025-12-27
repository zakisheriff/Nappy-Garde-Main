"use client";

import './Faq.css';

export default function FaqPage() {
    const faqs = [
        {
            question: "How long does delivery take?",
            answer: "We typically embrace a 2-3 business day delivery window within Colombo. For outstation deliveries, please allow 3-5 business days."
        },
        {
            question: "What is your return policy?",
            answer: "We accept returns for unopened and unused packs within 7 days of purchase. Please contact our support team on WhatsApp to initiate a return."
        },
        {
            question: "Do you offer cash on delivery?",
            answer: "Yes! We offer Cash on Delivery (COD) for all orders island-wide, so you can pay with confidence when your order arrives."
        },
        {
            question: "Are your diapers hypoallergenic?",
            answer: "Absolutely. Our Nappy Garde diapers are tested to be safe for sensitive skin, free from harsh chemicals, and designed for maximum comfort."
        },
        {
            question: "How do I choose the right size?",
            answer: "Our sizing is based on weight. If your baby is nearing the top of a weight range, we recommend sizing up for better comfort and absorbency."
        },
        {
            question: "Can I change my order after placing it?",
            answer: "If you need to make changes, please message us on WhatsApp immediately with your Order ID. We'll do our best to help before the order is dispatched."
        }
    ];

    return (
        <div className="faq-page page">
            <div className="container-wide">
                <div className="faq-header">
                    <h1 className="faq-title">Frequently Asked Questions</h1>
                    <p className="faq-subtitle">Everything you need to know about Nappy Garde.</p>
                </div>

                <div className="faq-grid">
                    {faqs.map((item, index) => (
                        <div key={index} className="faq-card">
                            <h3 className="faq-question">{item.question}</h3>
                            <p className="faq-answer">{item.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
