"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

const services = [
  { value: "shuttle-services", label: "Shuttle Services" },
  { value: "airport-transfers", label: "Airport Transfers" },
  { value: "private-transfers", label: "Private Transfers" },
  { value: "group-transportation", label: "Group Transportation" },
  { value: "game-drive-transfers", label: "Game Drive Transfers" },
  { value: "events-transfers", label: "Events Transfers" },
  { value: "corporate-transport", label: "Corporate Transport" },
  { value: "truck-hire", label: "Truck Hire" },
  { value: "general-enquiry", label: "General Enquiry" },
];

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    service: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatus("");

    try {
      const selectedService =
        services.find((service) => service.value === formData.service)?.label ||
        "Not specified";

      const message = [
        `Selected Service: ${selectedService}`,
        "",
        formData.message,
      ].join("\n");

      const response = await fetch(`${API_URL}/api/emails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          senderName: formData.fullName,
          senderEmail: formData.email,
          senderPhone: formData.phone,
          subject: formData.subject,
          message,
          category: "Contact",
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message || "Unable to send your enquiry. Please try again.",
        );
      }

      setStatus(
        "Thank you! Your enquiry has been received. Our team will get back to you.",
      );

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        service: "",
        message: "",
      });
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form-grid">
        <div className="contact-field">
          <label htmlFor="fullName">Full Name *</label>
          <input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="contact-field">
          <label htmlFor="email">Email Address *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            required
          />
        </div>

        <div className="contact-field">
          <label htmlFor="phone">Phone Number *</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
          />
        </div>

        <div className="contact-field">
          <label htmlFor="subject">Subject *</label>
          <input
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="What is your enquiry about?"
            required
          />
        </div>

        <div className="contact-field contact-field-full">
          <label htmlFor="service">Select Service</label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
          >
            <option value="">Choose a service</option>
            {services.map((service) => (
              <option key={service.value} value={service.value}>
                {service.label}
              </option>
            ))}
          </select>
        </div>

        <div className="contact-field contact-field-full">
          <label htmlFor="message">Your Message *</label>
          <textarea
            id="message"
            name="message"
            rows={6}
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us how we can help you..."
            required
          />
        </div>
      </div>

      <button type="submit" className="contact-submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>

      {status && (
        <p className="contact-form-status" role="status">
          {status}
        </p>
      )}
    </form>
  );
}
