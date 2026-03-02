import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ReturnPolicyPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-primary font-sans">
            <div className="max-w-4xl mx-auto py-12 px-6 md:py-20">
                <button 
                    onClick={() => navigate('/')}
                    className="mb-8 text-[10px] uppercase tracking-[0.2em] text-secondary hover:text-primary transition-colors"
                >
                    ← Back Home
                </button>

                <article className="prose prose-invert max-w-none space-y-8">
                    <h1 className="text-5xl md:text-6xl font-serif mb-4">Return Policy</h1>
                    <p className="text-secondary italic">Last updated: March 2026</p>

                    <section className="space-y-4">
                        <div>
                            <h3 className="text-2xl font-serif mt-6 mb-3">Return Policy For Kash Artss</h3>
                            <p className="text-secondary leading-relaxed">
                                Please review our Return Policy carefully to understand our procedures and policies regarding the return of products and services.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-serif mt-6 mb-3">All Sales Final</h3>
                            <p className="text-secondary leading-relaxed">
                                All sales at Kash Artss are final. We do not offer returns or refunds on any products or services unless otherwise required by law or in exceptional circumstances.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-serif mt-6 mb-3">Exceptions</h3>
                            <p className="text-secondary leading-relaxed mb-3">
                                In the following cases, we may consider returns or refunds at our sole discretion:
                            </p>
                            <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                                <li>Products or services that are defective or damaged upon delivery</li>
                                <li>Services not rendered as described</li>
                                <li>As required by applicable law or regulations</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-2xl font-serif mt-6 mb-3">How to Request a Return</h3>
                            <p className="text-secondary leading-relaxed">
                                If you believe you qualify for a return or refund under the exceptions listed above, please contact us within 7 days of your purchase with documentation of the issue.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-serif mt-6 mb-3">Refund Processing</h3>
                            <p className="text-secondary leading-relaxed">
                                If your return request is approved, refunds will be processed within 10-14 business days to your original payment method. Processing times may vary depending on your financial institution.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-serif mt-6 mb-3">Changes to This Policy</h3>
                            <p className="text-secondary leading-relaxed">
                                We reserve the right to modify this Return Policy at any time. Changes will be effective immediately upon posting on our website.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-serif mt-6 mb-3">Contact Us</h3>
                            <p className="text-secondary leading-relaxed">
                                For return inquiries or questions about this policy, please contact us at:<br />
                                <a href="mailto:contact@kashartss.com" className="text-cobalt hover:text-primary">Email: contact@kashartss.com</a> | <a href="tel:+919881721288" className="text-cobalt hover:text-primary">Phone: +91 9881721288</a>
                            </p>
                        </div>
                    </section>
                </article>
            </div>
        </div>
    );
};
