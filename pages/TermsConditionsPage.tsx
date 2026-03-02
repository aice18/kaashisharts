import React from 'react';
import { useNavigate } from 'react-router-dom';

export const TermsConditionsPage = () => {
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
                    <h1 className="text-5xl md:text-6xl font-serif mb-4">Terms and Conditions</h1>
                    <p className="text-secondary italic">Last updated: March 2026</p>

                    <section className="space-y-4">
                        <div>
                            <h3 className="text-2xl font-serif mt-6 mb-3">Introduction</h3>
                            <p className="text-secondary leading-relaxed">
                                Welcome to Kash Artss. By accessing or using our website, you agree to comply with and be bound by these Terms and Conditions.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-serif mt-6 mb-3">Use of Services</h3>
                            <p className="text-secondary leading-relaxed">
                                You agree to use our services only for lawful purposes. Any misuse of the website, including unauthorized access or damage to the site, is prohibited.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-serif mt-6 mb-3">Intellectual Property</h3>
                            <p className="text-secondary leading-relaxed">
                                All content on this website, including text, graphics, logos, and images, is the property of Kash Artss and is protected by copyright laws. You may not reproduce or distribute any content without our permission.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-serif mt-6 mb-3">User Accounts</h3>
                            <p className="text-secondary leading-relaxed">
                                To access certain features, you may need to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities under your account.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-serif mt-6 mb-3">Payments and Refunds</h3>
                            <p className="text-secondary leading-relaxed">
                                Payments for services or products are processed securely. All sales are final, and we do not offer refunds, except as required by law.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-serif mt-6 mb-3">Limitation of Liability</h3>
                            <p className="text-secondary leading-relaxed">
                                Kash Artss is not liable for any direct, indirect, incidental, or consequential damages arising from your use of the website or services.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-serif mt-6 mb-3">Changes to Terms</h3>
                            <p className="text-secondary leading-relaxed">
                                We reserve the right to modify these Terms and Conditions at any time. Any changes will be effective immediately upon posting on the website.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-serif mt-6 mb-3">Contact Us</h3>
                            <p className="text-secondary leading-relaxed">
                                If you have any questions or concerns about this policy, please contact us at:<br />
                                <a href="mailto:contact@kashartss.com" className="text-cobalt hover:text-primary">Email: contact@kashartss.com</a> | <a href="tel:+919881721288" className="text-cobalt hover:text-primary">Phone: +91 9881721288</a>
                            </p>
                        </div>
                    </section>
                </article>
            </div>
        </div>
    );
};
