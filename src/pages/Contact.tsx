import { useState } from "react";
import { Mail, Send, MapPin, CheckCircle2 } from "lucide-react";

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would ping Formspree or EmailJS
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        
        {/* Left Side - Info */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight uppercase mb-4">Get in Touch</h1>
            <p className="text-muted text-lg leading-relaxed">
              Have questions about our conversion algorithms? Interested in data partnerships or sponsorships? We'd love to hear from you.
            </p>
          </div>

          <div className="space-y-6 pt-4 border-t border-border">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-card border border-border rounded-xl">
                <Mail className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Email Us</h3>
                <p className="text-muted">hello@ev-range-converter.app</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-card border border-border rounded-xl">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Headquarters</h3>
                <p className="text-muted">Lahore, Pakistan (Global Data Hub)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="bg-card border border-border p-8 rounded-[2rem] shadow-xl">
          {isSubmitted ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 bg-realism-accent/10 rounded-full">
                <CheckCircle2 className="w-12 h-12 text-realism-accent" />
              </div>
              <h2 className="text-2xl font-bold">Message Sent!</h2>
              <p className="text-muted">Thanks for reaching out. We'll get back to you shortly.</p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="mt-4 px-6 py-2 bg-background border border-border rounded-lg text-sm font-medium hover:text-foreground hover:bg-border transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-muted uppercase tracking-wider">Name</label>
                <input 
                  type="text" 
                  id="name"
                  required
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-muted uppercase tracking-wider">Email</label>
                <input 
                  type="email" 
                  id="email"
                  required
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-muted uppercase tracking-wider">Message</label>
                <textarea 
                  id="message"
                  required
                  rows={4}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors resize-none"
                  placeholder="How can we help?"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-foreground text-background font-semibold py-4 rounded-xl hover:bg-white transition-colors flex items-center justify-center space-x-2"
              >
                <span>Send Message</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
