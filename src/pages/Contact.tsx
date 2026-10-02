import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Send, Check } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', email: '', phone: '', message: '' });
    }, 3000);
  };

  const inputClass = 'w-full bg-transparent border-b border-fg/10 text-fg placeholder-ash-dark py-3 focus:border-gold focus:outline-none transition-colors';

  return (
    <div className="min-h-screen bg-ink-900 pt-28">
      <section className="relative h-[50vh] min-h-[350px] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/7031607/pexels-photo-7031607.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Luxury home"
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-night/70 to-night/50" />
        </div>
        <div className="relative z-10 text-center px-6">
          <ScrollReveal>
            <p className="text-gold-light text-sm font-semibold uppercase tracking-[0.18em] mb-4">Get in Touch</p>
            <h1 className="font-display font-semibold text-white text-[clamp(2.25rem,6vw,4.5rem)] tracking-tight">
              Contact <span className="italic text-gold-light">Us</span>
            </h1>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <ScrollReveal>
              <h2 className="font-display font-bold text-fg text-3xl lg:text-4xl tracking-tight mb-6">
                Let's <span className="gold-gradient-text">Talk</span>
              </h2>
              <p className="text-ash leading-relaxed mb-12 max-w-md">
                Whether you're looking for your dream home, an investment opportunity, or simply
                want to understand the Panchkula market better — we're here to help.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-ink-700 border border-fg/8 flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-ash-dark text-xs uppercase tracking-wider mb-1">Office</p>
                    <p className="text-fg">Sector 7, Panchkula, Haryana 134109</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-ink-700 border border-fg/8 flex items-center justify-center shrink-0">
                    <Phone size={20} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-ash-dark text-xs uppercase tracking-wider mb-1">Phone</p>
                    <a href="tel:+919216507444" className="text-fg hover:text-gold transition-colors">+91 92165 07444</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-ink-700 border border-fg/8 flex items-center justify-center shrink-0">
                    <Mail size={20} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-ash-dark text-xs uppercase tracking-wider mb-1">Email</p>
                    <a href="mailto:hello@varunestate.in" className="text-fg hover:text-gold transition-colors">hello@varunestate.in</a>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="mt-12 h-64 bg-ink-700 border border-fg/8 overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.1!2d76.85!3d30.69!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDQxJzI0LjAiTiA3NsKwNTEnMDAuMCJF!5e0!3m2!1sen!2sin!4v0000000000000"
                  className="w-full h-full grayscale invert opacity-80"
                  loading="lazy"
                  title="Office location"
                />
              </div>
            </ScrollReveal>
          </div>

          <div>
            <ScrollReveal delay={0.1}>
              <div className="bg-ink-700 border border-fg/8 p-8 lg:p-12">
                <h3 className="font-display font-bold text-fg text-2xl tracking-tight mb-8">
                  Send a <span className="gold-gradient-text">Message</span>
                </h3>

                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mb-4">
                      <Check size={32} className="text-fg" />
                    </div>
                    <p className="text-fg text-lg font-semibold">Message Sent!</p>
                    <p className="text-ash text-sm mt-2">We'll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="text-ash-dark text-xs uppercase tracking-wider">Name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={inputClass}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="text-ash-dark text-xs uppercase tracking-wider">Email</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={inputClass}
                        placeholder="you@email.com"
                      />
                    </div>
                    <div>
                      <label className="text-ash-dark text-xs uppercase tracking-wider">Phone</label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className={inputClass}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    <div>
                      <label className="text-ash-dark text-xs uppercase tracking-wider">Message</label>
                      <textarea
                        required
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className={inputClass + ' resize-none'}
                        placeholder="Tell us what you're looking for..."
                        rows={4}
                      />
                    </div>
                    <button type="submit" className="neopop-btn w-full flex items-center justify-center gap-2" data-cursor="hover">
                      <Send size={16} /> Send Message
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
