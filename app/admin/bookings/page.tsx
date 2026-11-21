"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  Trash2,
  X,
  CalendarDays,
  Users,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  CheckCircle2,
  Clock3,
  XCircle,
  CircleCheck,
  LoaderCircle,
} from "lucide-react";

import "./bookings.css";
const API_BASE_URL = (() => {
  const base = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050"
  ).replace(/\/+$/, "");

  return base.endsWith("/api") ? base : `${base}/api`;
})();

type BookingStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed";

type Booking = {
  id: number;
  bookingReference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: string;
  pickupLocation: string;
  dropoffLocation: string;
  travelDate: string;
  passengerCount: number;
  isReturnTrip: boolean;
  returnTravelDate: string | null;
  status: BookingStatus;
  customerNotes: string | null;
  adminNotes: string | null;
  createdAtUtc: string;
  updatedAtUtc: string | null;
};

const statuses: BookingStatus[] = [
  "Pending",
  "Confirmed",
  "Cancelled",
  "Completed",
];

function formatDate(date: string | null) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function formatDateTime(date: string | null) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

function statusClass(status: BookingStatus) {
  return `booking-status booking-status-${status.toLowerCase()}`;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const loadBookings = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        credentials: "include",
        cache: "no-store",
      });

      if (response.status === 401 || response.status === 403) {
        throw new Error(
          "Your admin session has expired. Please sign in again.",
        );
      }

      if (!response.ok) {
        throw new Error("Unable to load bookings. Please try again.");
      }

      const data: Booking[] = await response.json();

      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading bookings.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadBookings();
  }, [loadBookings]);

  const filteredBookings = useMemo(() => {
    const term = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesSearch =
        !term ||
        booking.bookingReference.toLowerCase().includes(term) ||
        booking.customerName.toLowerCase().includes(term) ||
        booking.customerEmail.toLowerCase().includes(term) ||
        booking.customerPhone.toLowerCase().includes(term) ||
        booking.pickupLocation.toLowerCase().includes(term) ||
        booking.dropoffLocation.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "All" || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  const stats = useMemo(
    () => ({
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "Pending").length,
      confirmed: bookings.filter((b) => b.status === "Confirmed").length,
      completed: bookings.filter((b) => b.status === "Completed").length,
      cancelled: bookings.filter((b) => b.status === "Cancelled").length,
    }),
    [bookings],
  );

  async function updateStatus(booking: Booking, newStatus: BookingStatus) {
    try {
      setUpdatingId(booking.id);

      const response = await fetch(
        `${API_BASE_URL}/bookings/${booking.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status: newStatus,
            adminNotes,
          }),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        throw new Error(
          "Your admin session has expired. Please sign in again.",
        );
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to update booking.");
      }

      setBookings((current) =>
        current.map((item) =>
          item.id === booking.id
            ? {
                ...item,
                status: newStatus,
                adminNotes: adminNotes || item.adminNotes,
                updatedAtUtc: new Date().toISOString(),
              }
            : item,
        ),
      );

      setSelectedBooking((current) =>
        current?.id === booking.id
          ? {
              ...current,
              status: newStatus,
              adminNotes: adminNotes || current.adminNotes,
              updatedAtUtc: new Date().toISOString(),
            }
          : current,
      );
    } catch (err) {
      window.alert(
        err instanceof Error ? err.message : "Unable to update booking.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteBooking(booking: Booking) {
    const confirmed = window.confirm(
      `Permanently delete booking ${booking.bookingReference}? This cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(booking.id);

      const response = await fetch(`${API_BASE_URL}/bookings/${booking.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        throw new Error(
          "Your admin session has expired. Please sign in again.",
        );
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete booking.");
      }

      setBookings((current) =>
        current.filter((item) => item.id !== booking.id),
      );

      setSelectedBooking((current) =>
        current?.id === booking.id ? null : current,
      );
    } catch (err) {
      window.alert(
        err instanceof Error ? err.message : "Unable to delete booking.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  function openBooking(booking: Booking) {
    setSelectedBooking(booking);
    setAdminNotes(booking.adminNotes || "");
  }

  return (
    <div className="bookings-page">
      <div className="bookings-header">
        <div>
          <span className="bookings-eyebrow">BOOKING MANAGEMENT</span>
          <h1>Bookings</h1>
          <p>View and manage your TESAZMARE customer bookings.</p>
        </div>

        <button
          type="button"
          className="bookings-refresh-button"
          onClick={() => void loadBookings(true)}
          disabled={loading || refreshing}
        >
          <RefreshCw
            size={16}
            className={refreshing ? "bookings-spinning" : ""}
          />
          Refresh
        </button>
      </div>

      <div className="bookings-stats">
        <div className="booking-stat-card">
          <div className="booking-stat-icon booking-stat-total">
            <CalendarDays size={20} />
          </div>
          <div>
            <span>Total Bookings</span>
            <strong>{stats.total}</strong>
          </div>
        </div>

        <div className="booking-stat-card">
          <div className="booking-stat-icon booking-stat-pending">
            <Clock3 size={20} />
          </div>
          <div>
            <span>Pending</span>
            <strong>{stats.pending}</strong>
          </div>
        </div>

        <div className="booking-stat-card">
          <div className="booking-stat-icon booking-stat-confirmed">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span>Confirmed</span>
            <strong>{stats.confirmed}</strong>
          </div>
        </div>

        <div className="booking-stat-card">
          <div className="booking-stat-icon booking-stat-completed">
            <CircleCheck size={20} />
          </div>
          <div>
            <span>Completed</span>
            <strong>{stats.completed}</strong>
          </div>
        </div>

        <div className="booking-stat-card">
          <div className="booking-stat-icon booking-stat-cancelled">
            <XCircle size={20} />
          </div>
          <div>
            <span>Cancelled</span>
            <strong>{stats.cancelled}</strong>
          </div>
        </div>
      </div>

      <div className="bookings-content">
        <div className="bookings-toolbar">
          <div className="bookings-search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search customer, reference, route..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter bookings by status"
            className="bookings-filter"
          >
            <option value="All">All statuses</option>
            {statuses.map((status) => (
              <option value={status} key={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="bookings-error">
            <p>{error}</p>
            <button type="button" onClick={() => void loadBookings(true)}>
              Try Again
            </button>
          </div>
        )}

        <div className="bookings-table-wrap">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Booking</th>
                <th>Customer</th>
                <th>Journey</th>
                <th>Travel Date</th>
                <th>Passengers</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="bookings-table-message">
                    <LoaderCircle size={24} className="bookings-spinning" />
                    <span>Loading bookings...</span>
                  </td>
                </tr>
              ) : !error && filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="bookings-table-message">
                    <CalendarDays size={27} />
                    <strong>No bookings found</strong>
                    <span>
                      {bookings.length === 0
                        ? "Customer bookings will appear here."
                        : "Try changing your search or status filter."}
                    </span>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <div className="booking-reference">
                        <strong>{booking.bookingReference}</strong>
                        <span>{formatDate(booking.createdAtUtc)}</span>
                      </div>
                    </td>

                    <td>
                      <div className="booking-customer">
                        <strong>{booking.customerName}</strong>
                        <span>{booking.customerEmail}</span>
                        <span>{booking.customerPhone}</span>
                      </div>
                    </td>

                    <td>
                      <div className="booking-journey">
                        <span>{booking.pickupLocation}</span>
                        <ArrowRight size={14} />
                        <span>{booking.dropoffLocation}</span>
                      </div>
                      <small>{booking.serviceType}</small>
                    </td>

                    <td>{formatDate(booking.travelDate)}</td>

                    <td>
                      <span className="booking-passenger-count">
                        <Users size={15} />
                        {booking.passengerCount}
                      </span>
                    </td>

                    <td>
                      <span className={statusClass(booking.status)}>
                        {booking.status}
                      </span>
                    </td>

                    <td>
                      <div className="booking-actions">
                        <button
                          type="button"
                          className="booking-view-button"
                          title="View booking"
                          aria-label={`View booking ${booking.bookingReference}`}
                          onClick={() => openBooking(booking)}
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          type="button"
                          className="booking-delete-button"
                          title="Delete booking"
                          aria-label={`Delete booking ${booking.bookingReference}`}
                          disabled={deletingId === booking.id}
                          onClick={() => void deleteBooking(booking)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bookings-footer">
          Showing {filteredBookings.length} of {bookings.length} bookings
        </div>
      </div>

      {selectedBooking && (
        <div
          className="booking-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedBooking(null);
            }
          }}
        >
          <section
            className="booking-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
          >
            <div className="booking-modal-header">
              <div>
                <span className="bookings-eyebrow">BOOKING DETAILS</span>
                <h2 id="booking-modal-title">
                  {selectedBooking.bookingReference}
                </h2>
              </div>

              <button
                type="button"
                className="booking-modal-close"
                onClick={() => setSelectedBooking(null)}
                aria-label="Close booking details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="booking-modal-body">
              <div className="booking-detail-section">
                <h3>Customer Information</h3>

                <div className="booking-detail-grid">
                  <div className="booking-detail-item">
                    <Users size={17} />
                    <div>
                      <span>Customer Name</span>
                      <strong>{selectedBooking.customerName}</strong>
                    </div>
                  </div>

                  <div className="booking-detail-item">
                    <Mail size={17} />
                    <div>
                      <span>Email Address</span>
                      <strong>{selectedBooking.customerEmail}</strong>
                    </div>
                  </div>

                  <div className="booking-detail-item">
                    <Phone size={17} />
                    <div>
                      <span>Phone Number</span>
                      <strong>{selectedBooking.customerPhone}</strong>
                    </div>
                  </div>

                  <div className="booking-detail-item">
                    <CalendarDays size={17} />
                    <div>
                      <span>Booking Created</span>
                      <strong>
                        {formatDateTime(selectedBooking.createdAtUtc)}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="booking-detail-section">
                <h3>Journey Information</h3>

                <div className="booking-detail-grid">
                  <div className="booking-detail-item">
                    <MapPin size={17} />
                    <div>
                      <span>Pickup Location</span>
                      <strong>{selectedBooking.pickupLocation}</strong>
                    </div>
                  </div>

                  <div className="booking-detail-item">
                    <MapPin size={17} />
                    <div>
                      <span>Drop-off Location</span>
                      <strong>{selectedBooking.dropoffLocation}</strong>
                    </div>
                  </div>

                  <div className="booking-detail-item">
                    <CalendarDays size={17} />
                    <div>
                      <span>Departure Date</span>
                      <strong>{formatDate(selectedBooking.travelDate)}</strong>
                    </div>
                  </div>

                  <div className="booking-detail-item">
                    <Users size={17} />
                    <div>
                      <span>Passengers</span>
                      <strong>{selectedBooking.passengerCount}</strong>
                    </div>
                  </div>

                  <div className="booking-detail-item">
                    <CalendarDays size={17} />
                    <div>
                      <span>Return Journey</span>
                      <strong>
                        {selectedBooking.isReturnTrip ? "Yes" : "No"}
                      </strong>
                    </div>
                  </div>

                  {selectedBooking.isReturnTrip && (
                    <div className="booking-detail-item">
                      <CalendarDays size={17} />
                      <div>
                        <span>Return Date</span>
                        <strong>
                          {formatDate(selectedBooking.returnTravelDate)}
                        </strong>
                      </div>
                    </div>
                  )}

                  <div className="booking-detail-item">
                    <CalendarDays size={17} />
                    <div>
                      <span>Service Type</span>
                      <strong>{selectedBooking.serviceType}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {selectedBooking.customerNotes && (
                <div className="booking-notes-box">
                  <h3>Customer Notes</h3>
                  <p>{selectedBooking.customerNotes}</p>
                </div>
              )}

              <div className="booking-detail-section">
                <h3>Admin Management</h3>

                <label className="booking-form-label" htmlFor="booking-status">
                  Booking Status
                </label>

                <select
                  id="booking-status"
                  className="booking-status-select"
                  value={selectedBooking.status}
                  disabled={updatingId === selectedBooking.id}
                  onChange={(event) =>
                    void updateStatus(
                      selectedBooking,
                      event.target.value as BookingStatus,
                    )
                  }
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <label className="booking-form-label" htmlFor="admin-notes">
                  Internal Admin Notes
                </label>

                <textarea
                  id="admin-notes"
                  className="booking-admin-notes"
                  rows={3}
                  placeholder="Add internal notes about this booking..."
                  value={adminNotes}
                  onChange={(event) => setAdminNotes(event.target.value)}
                />

                <button
                  type="button"
                  className="booking-save-notes"
                  disabled={updatingId === selectedBooking.id}
                  onClick={() =>
                    void updateStatus(selectedBooking, selectedBooking.status)
                  }
                >
                  {updatingId === selectedBooking.id
                    ? "Saving..."
                    : "Save Admin Notes"}
                </button>
              </div>

              <div className="booking-modal-meta">
                <span>
                  Last updated: {formatDateTime(selectedBooking.updatedAtUtc)}
                </span>
              </div>
            </div>

            <div className="booking-modal-footer">
              <button
                type="button"
                className="booking-close-button"
                onClick={() => setSelectedBooking(null)}
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
