import React from 'react';
import { useNavigate } from 'react-router-dom';

export const PrivacyPolicyPage = () => {
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
                    <h1 className="text-5xl md:text-6xl font-serif mb-4">Privacy Policy</h1>
                    <p className="text-secondary italic">Last updated: March 2026</p>

                    <section className="space-y-4">
                        <h2 className="text-3xl font-serif mt-8">Privacy Policy For Kash Artss</h2>
                        
                        <div>
                            <h3 className="text-2xl font-serif mt-6 mb-3">Introduction</h3>
                            <p className="text-secondary leading-relaxed">
                                Kash Artss is committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your personal information.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-serif mt-6 mb-3">Information Collection</h3>
                            <p className="text-secondary leading-relaxed">
                                We collect information you provide directly to us, such as when you sign up for our newsletter, contact us, or use our services. This may include your name, email address, phone number, and any other details you choose to provide.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-serif mt-6 mb-3">Use of Information</h3>
                            <p className="text-secondary leading-relaxed mb-3">We use your information to:</p>
                            <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                                <li>Provide and improve our services</li>
                                <li>Communicate with you about your inquiries, bookings, and updates</li>
                                <li>Personalize your experience with Kash Artss</li>
                                <li>Send you promotional materials and updates (with your consent)</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-2xl font-serif mt-6 mb-3">Information Sharing</h3>
                            <p className="text-secondary leading-relaxed mb-3">
                                We do not sell or share your personal information with third parties, except:
                            </p>
                            <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                                <li>With your consent</li>
                                <li>To comply with legal obligations</li>
                                <li>To protect the rights and safety of Kash Artss and our users</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-2xl font-serif mt-6 mb-3">Data Security</h3>
                            <p className="text-secondary leading-relaxed">
                                We implement appropriate measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-serif mt-6 mb-3">Cookies</h3>
                            <p className="text-secondary leading-relaxed">
                                We use cookies to enhance your experience on our website. You can control cookie settings through your browser.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-serif mt-6 mb-3">Third-Party Links</h3>
                            <p className="text-secondary leading-relaxed">
                                Our website may contain links to third-party sites. We are not responsible for their privacy practices, and we encourage you to review their policies.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-serif mt-6 mb-3">Changes to This Policy</h3>
                            <p className="text-secondary leading-relaxed">
                                We may update this policy from time to time. We will notify you of any changes by posting the new policy on our website.
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
