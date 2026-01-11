import { useState } from 'react';
import { ChevronDown, Mail } from 'lucide-react';
import './Support.css';

export default function Support() {
  const [expandedFaq, setExpandedFaq] = useState(null);

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
        <section className="support-section demo-form-section">
          <h1 className="support-title">Support</h1>
          <p className="support-subtitle">
            Need help, have a question, or want to share feedback? Reach us directly.
          </p>

          <div className="support-form-container">
            <div className="support-quick-actions">
              <a className="support-submit support-contact" href="mailto:founders@joinprobable.com">
                Email founders@joinprobable.com <Mail size={18} />
              </a>
              <p className="support-note">
                We typically respond within 1–2 business days.
              </p>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="support-section faqs-section">
          <h2 className="support-title">FAQs</h2>
          <p className="support-subtitle">Quick answers to common questions.</p>
          
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


