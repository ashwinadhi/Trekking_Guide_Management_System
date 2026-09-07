"use client";

import { useEffect, useState } from "react";

export default function BookingExamplePage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch("/api/services");
        if (res.ok) {
          const data = await res.json();
          setServices(data);
        }
      } catch (error) {
        console.error("Failed to load services", error);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const handleBookClick = (serviceId: string) => {
    setSelectedService(serviceId);
    setFormStatus({ type: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus({ type: "info", message: "Submitting..." });

    try {
      const payload = {
        ...formData,
        serviceId: selectedService,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setFormStatus({ type: "success", message: "Booking created successfully!" });
        setFormData({ name: "", email: "", date: "", message: "" });
        setTimeout(() => setSelectedService(null), 2000);
      } else {
        const data = await res.json();
        setFormStatus({ type: "error", message: data.error || "Failed to create booking." });
      }
    } catch (error) {
      setFormStatus({ type: "error", message: "An error occurred." });
    }
  };

  if (loading) return <div className="p-10 text-center">Loading services...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-10">Available Services</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service._id} className="bg-white border rounded-lg shadow-sm p-5 hover:shadow-md transition">
            {service.images && service.images.length > 0 && (
              <img
                src={service.images[0]}
                alt={service.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            )}
            <h2 className="text-xl font-bold mb-2">{service.title}</h2>
            <p className="text-gray-600 text-sm mb-3 line-clamp-3">{service.description}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded capitalize">
                {service.category}
              </span>
              <span className="font-semibold text-gold">
                {service.price ? `$${service.price}` : "Contact for price"}
              </span>
            </div>
            <button
              onClick={() => handleBookClick(service._id)}
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center text-gray-500">No services found. Add some from the admin dashboard!</div>
      )}

      {selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">Complete Booking</h2>

            {formStatus.message && (
              <div
                className={`p-3 mb-4 rounded text-sm ${formStatus.type === "success"
                    ? "bg-green-100 text-green-800"
                    : formStatus.type === "error"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
              >
                {formStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border rounded p-2 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded p-2 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  required
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full border rounded p-2 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message (Optional)</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full border rounded p-2 text-black h-24"
                  placeholder="Any special requests?"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={formStatus.type === "info"}
                className="w-full bg-gold text-ink font-semibold py-2 hover:bg-gold/90 transition"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
