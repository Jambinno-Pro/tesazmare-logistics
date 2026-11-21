"use client";

import { useState } from "react";
import "./BookingForm.css";

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
];

interface BookingFormProps {
  initialService: string;
}

export default function BookingForm({ initialService }: BookingFormProps) {
  const validService = services.some(
    (service) => service.value === initialService,
  )
    ? initialService
    : "";

  const [formData, setFormData] = useState({
    service: validService,
    fullName: "",
    email: "",
    phone: "",
    pickupLocation: "",
    destination: "",
    travelDate: "",
    passengers: "1",
    loadDescription: "",
    hireDuration: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isTruckHire = formData.service === "truck-hire";

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatus("");

    try {
      const selectedService =
        services.find((service) => service.value === formData.service)?.label ||
        "Not specified";

      const message = [
        `Service: ${selectedService}`,
        `Customer: ${formData.fullName}`,
        `Email: ${formData.email}`,
        `Phone: ${formData.phone}`,
        `Collection / Pick-up Location: ${formData.pickupLocation || "Not specified"}`,
        `Destination: ${formData.destination || "Not specified"}`,
        `Travel / Hire Date: ${formData.travelDate || "Not specified"}`,
        isTruckHire
          ? `Load Description: ${formData.loadDescription || "Not specified"}`
          : `Number of Passengers: ${formData.passengers}`,
        isTruckHire
          ? `Hire Duration: ${formData.hireDuration || "Not specified"}`
          : "",
        "",
        "Additional Information:",
        formData.message || "None provided",
      ]
        .filter(Boolean)
        .join("\n");

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
          subject: `Booking Enquiry - ${selectedService}`,
          message,
          category: "Booking",
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Unable to submit your booking enquiry. Please try again.",
        );
      }

      setStatus(
        "Thank you! Your booking enquiry has been received. Our team will contact you shortly.",
      );

      setFormData({
        service: validService,
        fullName: "",
        email: "",
        phone: "",
        pickupLocation: "",
        destination: "",
        travelDate: "",
        passengers: "1",
        loadDescription: "",
        hireDuration: "",
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
    <section className="booking-section">
      <div className="booking-container">
        <div className="booking-heading">
          <span>TESAZMARE LOGISTICS</span>
          <h1>Book Your Journey</h1>
          <p>
            Tell us about your transportation requirements and our team can
            assist with your enquiry.
          </p>
        </div>

        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="booking-form-grid">
            <div className="booking-field">
              <label htmlFor="service">Select Service *</label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
              >
                <option value="">Choose a service</option>
                {services.map((service) => (
                  <option key={service.value} value={service.value}>
                    {service.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="booking-field">
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

            <div className="booking-field">
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="booking-field">
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

            <div className="booking-field">
              <label htmlFor="pickupLocation">
                {isTruckHire ? "Collection Location" : "Pick-up Location"}
              </label>
              <input
                id="pickupLocation"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
                placeholder="Enter collection or pick-up location"
              />
            </div>

            <div className="booking-field">
              <label htmlFor="destination">
                {isTruckHire ? "Delivery Location" : "Destination"}
              </label>
              <input
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="Enter destination"
              />
            </div>

            <div className="booking-field">
              <label htmlFor="travelDate">
                {isTruckHire ? "Required Hire Date" : "Travel Date"}
              </label>
              <input
                id="travelDate"
                name="travelDate"
                type="date"
                value={formData.travelDate}
                onChange={handleChange}
              />
            </div>

            {isTruckHire ? (
              <>
                <div className="booking-field">
                  <label htmlFor="loadDescription">Load Description</label>
                  <input
                    id="loadDescription"
                    name="loadDescription"
                    value={formData.loadDescription}
                    onChange={handleChange}
                    placeholder="Describe the goods or load"
                  />
                </div>

                <div className="booking-field">
                  <label htmlFor="hireDuration">Hire Duration</label>
                  <select
                    id="hireDuration"
                    name="hireDuration"
                    value={formData.hireDuration}
                    onChange={handleChange}
                  >
                    <option value="">Select duration</option>
                    <option value="Hourly">Hourly</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="To be discussed">To be discussed</option>
                  </select>
                </div>
              </>
            ) : (
              <div className="booking-field">
                <label htmlFor="passengers">Number of Passengers</label>
                <input
                  id="passengers"
                  name="passengers"
                  type="number"
                  min="1"
                  value={formData.passengers}
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="booking-field booking-field-full">
              <label htmlFor="message">Additional Information</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us more about your journey or requirements..."
              />
            </div>
          </div>

          <button
            type="submit"
            className="booking-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Booking Enquiry"}
          </button>

          {status && (
            <p className="booking-form-status" role="status">
              {status}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
