import { useState } from 'react';
import { AlertCircle, CheckCircle, ChevronDown } from 'lucide-react';
import './Support.css';
import { submitDemoRequestToSupabase } from '../services/leadsSupabase';

export default function Support() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    preferredTimes: '',
    message: ''
  });
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSubmitting(true);
    try {
      await submitDemoRequestToSupabase({
        ...formData,
        source: 'client_support_form',
      });
      setSuccess(true);
      setFormData({ name: '', email: '', company: '', preferredTimes: '', message: '' });
    } catch (err) {
      setError(err?.message || 'Failed to send. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqs = [
    {
      question: 'What happens in a demo?',
      answer: 'We’ll walk through how you can turn prediction market probabilities into decisions: what to watch, what might change next, and how to hedge or plan around outcomes.'
    },
    {
      question: 'How long does it take?',
      answer: 'Most demos are 20–30 minutes, plus time for questions. If you want to go deeper, we can schedule a longer follow-up.'
    },
    {
      question: 'Can you tailor it to my business?',
      answer: 'Yes. If you share your industry and key risks beforehand, we’ll bring relevant markets and a few practical “hedge / decide” examples.'
    }
  ];

  return (
    <div className="support-page">
      <div className="support-container">
        {/* Demo Request Form */}
        <section className="support-section demo-form-section">
          <h1 className="support-title">Schedule a Demo</h1>
          <p className="support-subtitle">
            Share a few details and we’ll reach out to schedule a quick walkthrough tailored to your risks and decisions.
          </p>

          {error && (
            <div className="support-alert error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="support-alert success">
              <CheckCircle size={16} />
              <span>Sent. We’ll reach out shortly to schedule.</span>
            </div>
          )}

          <div className="support-form-container">
            <form className="support-form" onSubmit={handleSubmit}>
              <div className="support-form-row">
                <div className="support-form-group">
                  <label htmlFor="name">Name</label>
                  <input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Your name" required />
                </div>
                <div className="support-form-group">
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="you@company.com" required />
                </div>
              </div>

              <div className="support-form-row">
                <div className="support-form-group">
                  <label htmlFor="company">Company / Org</label>
                  <input id="company" name="company" value={formData.company} onChange={handleInputChange} placeholder="Optional" />
                </div>
                <div className="support-form-group">
                  <label htmlFor="preferredTimes">Preferred times</label>
                  <input id="preferredTimes" name="preferredTimes" value={formData.preferredTimes} onChange={handleInputChange} placeholder="e.g. Tue 2–4pm ET" />
                </div>
              </div>

              <div className="support-form-group">
                <label htmlFor="message">What do you want to evaluate?</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Share the decisions you’re making and the risks you want to hedge or track."
                  rows={6}
                  required
                />
              </div>

              <button type="submit" className="support-submit" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send'}
              </button>
            </form>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="support-section faqs-section">
          <h2 className="support-title">Demo FAQs</h2>
          <p className="support-subtitle">Quick answers before we meet.</p>
          
          <div className="faqs-list">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item ${expandedFaq === index ? 'expanded' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <div className="faq-question">
                  <span>{faq.question}</span>
                  <ChevronDown 
                    size={20} 
                    className={`faq-chevron ${expandedFaq === index ? 'expanded' : ''}`}
                  />
                </div>
                {expandedFaq === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}


