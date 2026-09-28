import { useState } from "react";
import { Mail, Send, MapPin, CheckCircle2, Phone } from "lucide-react";

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    // Replace this string with your Web3Forms Access Key
    formData.append("access_key", "YOUR_WEB3FORMS_ACCESS_KEY");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Failed to send message. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
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
                <p className="text-muted">hypersoft086@gmail.com</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-card border border-border rounded-xl">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Headquarters</h3>
                <p className="text-muted">Faisalabad, Pakistan</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-3 bg-card border border-border rounded-xl">
                <Phone className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-muted">+92 300 1234567</p>
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
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-muted uppercase tracking-wider">Name</label>
                <input 
                  type="text" 
                  id="name" name="name"
                  required
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                  placeholder="Shahmeer Ali"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-muted uppercase tracking-wider">Email</label>
                <input 
                  type="email" 
                  id="email" name="email"
                  required
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                  placeholder="shahmeer@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-muted uppercase tracking-wider">Message</label>
                <textarea 
                  id="message" name="message"
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
                <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                {!isSubmitting && <Send className="w-4 h-4" />}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
