"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  X,
  Tag,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  ArrowUpDown,
} from "lucide-react";

import "./pricing.css";

const API_BASE_URL = (() => {
  const base = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050"
  ).replace(/\/+$/, "");

  return base.endsWith("/api") ? base : `${base}/api`;
})();

type PricingRule = {
  id: number;
  serviceType: string;
  routeName?: string | null;
  pickupLocation: string;
  dropoffLocation: string;
  minimumPassengers: number;
  maximumPassengers: number;
  pricingBasis: "PerPassenger" | "FixedTrip";
  amount: number;
  currency: string;
  isActive: boolean;
  effectiveFromUtc: string;
  effectiveUntilUtc?: string | null;
  description?: string | null;
  createdAtUtc: string;
  updatedAtUtc?: string | null;
};

type PricingForm = {
  serviceType: string;
  routeName: string;
  pickupLocation: string;
  dropoffLocation: string;
  minimumPassengers: string;
  maximumPassengers: string;
  pricingBasis: "PerPassenger" | "FixedTrip";
  amount: string;
  currency: string;
  isActive: boolean;
  effectiveFrom: string;
  effectiveUntil: string;
  description: string;
};

const emptyForm: PricingForm = {
  serviceType: "Shuttle",
  routeName: "",
  pickupLocation: "",
  dropoffLocation: "",
  minimumPassengers: "1",
  maximumPassengers: "15",
  pricingBasis: "PerPassenger",
  amount: "",
  currency: "ZAR",
  isActive: true,
  effectiveFrom: new Date().toISOString().slice(0, 10),
  effectiveUntil: "",
  description: "",
};

function formatMoney(amount: number, currency = "ZAR") {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency,
  }).format(amount);
}

function dateValue(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().slice(0, 10);
}

function getErrorMessage(data: unknown, fallback: string) {
  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data.message;
  }

  return fallback;
}

export default function PricingPage() {
  const [prices, setPrices] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [serviceFilter, setServiceFilter] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<number | null>(null);
  const [form, setForm] = useState<PricingForm>(emptyForm);

  const loadPrices = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/pricing`, {
        method: "GET",
        cache: "no-store",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Unable to load pricing (${response.status}).`);
      }

      const data: PricingRule[] = await response.json();
      setPrices(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the pricing API.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPrices();
  }, [loadPrices]);

  const filteredPrices = useMemo(() => {
    return prices.filter((price) => {
      const searchText = search.toLowerCase();

      const matchesSearch = [
        price.serviceType,
        price.routeName,
        price.pickupLocation,
        price.dropoffLocation,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(searchText));

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" && price.isActive) ||
        (statusFilter === "Inactive" && !price.isActive);

      const matchesService =
        serviceFilter === "All" || price.serviceType === serviceFilter;

      return matchesSearch && matchesStatus && matchesService;
    });
  }, [prices, search, statusFilter, serviceFilter]);

  const activeCount = prices.filter((price) => price.isActive).length;
  const inactiveCount = prices.length - activeCount;

  const services = Array.from(
    new Set(prices.map((price) => price.serviceType)),
  );

  function updateField<K extends keyof PricingForm>(
    field: K,
    value: PricingForm[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function openAddModal() {
    setEditingPrice(null);
    setForm({ ...emptyForm });
    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  function openEditModal(price: PricingRule) {
    setEditingPrice(price.id);

    setForm({
      serviceType: price.serviceType,
      routeName: price.routeName || "",
      pickupLocation: price.pickupLocation,
      dropoffLocation: price.dropoffLocation,
      minimumPassengers: String(price.minimumPassengers),
      maximumPassengers: String(price.maximumPassengers),
      pricingBasis: price.pricingBasis,
      amount: String(price.amount),
      currency: price.currency || "ZAR",
      isActive: price.isActive,
      effectiveFrom: dateValue(price.effectiveFromUtc),
      effectiveUntil: dateValue(price.effectiveUntilUtc),
      description: price.description || "",
    });

    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const minimum = Number(form.minimumPassengers);
    const maximum = Number(form.maximumPassengers);
    const amount = Number(form.amount);

    if (
      !Number.isInteger(minimum) ||
      !Number.isInteger(maximum) ||
      minimum < 1 ||
      maximum < minimum
    ) {
      setError("Please enter a valid passenger range.");
      setSaving(false);
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Please enter a valid price greater than zero.");
      setSaving(false);
      return;
    }

    if (!form.effectiveFrom) {
      setError("Please select the effective start date.");
      setSaving(false);
      return;
    }

    if (form.effectiveUntil && form.effectiveUntil < form.effectiveFrom) {
      setError("The end date cannot be before the start date.");
      setSaving(false);
      return;
    }

    const payload = {
      serviceType: form.serviceType,
      routeName: form.routeName.trim() || null,
      pickupLocation: form.pickupLocation.trim(),
      dropoffLocation: form.dropoffLocation.trim(),
      minimumPassengers: minimum,
      maximumPassengers: maximum,
      pricingBasis: form.pricingBasis,
      amount,
      currency: form.currency,
      isActive: form.isActive,
      effectiveFromUtc: new Date(
        `${form.effectiveFrom}T00:00:00.000Z`,
      ).toISOString(),
      effectiveUntilUtc: form.effectiveUntil
        ? new Date(`${form.effectiveUntil}T23:59:59.000Z`).toISOString()
        : null,
      description: form.description.trim() || null,
    };

    try {
      const isEditing = editingPrice !== null;

      const response = await fetch(
        isEditing
          ? `${API_BASE_URL}/pricing/${editingPrice}`
          : `${API_BASE_URL}/pricing`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, "Unable to save pricing information."),
        );
      }

      setModalOpen(false);

      setSuccess(
        isEditing
          ? "Pricing rule updated successfully."
          : "New pricing rule created successfully.",
      );

      await loadPrices();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save pricing.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(price: PricingRule) {
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/pricing/${price.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            isActive: !price.isActive,
          }),
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, "Unable to update pricing status."),
        );
      }

      setSuccess("Pricing status updated.");
      await loadPrices();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update status.");
    }
  }

  async function deletePrice(price: PricingRule) {
    const confirmed = window.confirm(
      `Delete the pricing rule for ${price.pickupLocation} to ${price.dropoffLocation}?`,
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/pricing/${price.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
          getErrorMessage(data, "Unable to delete pricing rule."),
        );
      }

      setSuccess("Pricing rule deleted successfully.");
      await loadPrices();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete pricing.",
      );
    }
  }

  return (
    <div className="pricing-page">
      {/* PAGE HEADER */}

      <div className="pricing-header">
        <div className="pricing-heading">
          <div className="pricing-eyebrow">
            <Tag size={15} />
            Rate Administration
          </div>

          <h1>Pricing Management</h1>

          <p>Manage service rates, passenger ranges and route pricing.</p>
        </div>

        <div className="pricing-header-actions">
          <button
            type="button"
            onClick={() => void loadPrices()}
            disabled={loading}
            className="pricing-button pricing-button-secondary"
          >
            <RefreshCw size={16} className={loading ? "pricing-spin" : ""} />
            Refresh
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="pricing-button pricing-button-primary"
          >
            <Plus size={18} />
            Add New Price
          </button>
        </div>
      </div>

      {/* NOTIFICATIONS */}

      {error && !modalOpen && (
        <div className="pricing-alert pricing-alert-error">
          <AlertCircle size={19} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="pricing-alert pricing-alert-success">
          <CheckCircle2 size={19} />
          <span>{success}</span>

          <button
            type="button"
            onClick={() => setSuccess("")}
            aria-label="Dismiss success message"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* STATISTICS */}

      <div className="pricing-stats">
        <StatCard
          label="Total Pricing Rules"
          value={prices.length}
          icon={<Tag size={21} />}
        />

        <StatCard
          label="Active Rules"
          value={activeCount}
          icon={<CheckCircle2 size={21} />}
        />

        <StatCard
          label="Inactive Rules"
          value={inactiveCount}
          icon={<XCircle size={21} />}
        />
      </div>

      {/* TABLE PANEL */}

      <section className="pricing-panel">
        <div className="pricing-panel-header">
          <div className="pricing-panel-title">
            <h2>Service Pricing</h2>
            <p>All pricing rules configured in your system.</p>
          </div>

          <div className="pricing-filters">
            <div className="pricing-search">
              <Search size={17} />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search routes..."
                aria-label="Search pricing routes"
              />
            </div>

            <select
              value={serviceFilter}
              onChange={(event) => setServiceFilter(event.target.value)}
              aria-label="Filter by service"
            >
              <option value="All">All Services</option>

              {services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by status"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* TABLE */}

        <div className="pricing-table-wrapper">
          <table className="pricing-table">
            <thead>
              <tr>
                <th>Service / Route</th>
                <th>Passenger Range</th>
                <th>Pricing Basis</th>
                <th>Amount</th>
                <th>Status</th>
                <th className="pricing-actions-heading">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="pricing-empty-cell">
                    <Loader2 className="pricing-loader" size={28} />

                    <p>Loading pricing rules...</p>
                  </td>
                </tr>
              ) : filteredPrices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="pricing-empty-cell">
                    <div className="pricing-empty-icon">
                      <Tag size={23} />
                    </div>

                    <h3>No pricing rules found</h3>

                    <p>Add a new pricing rule or change your search filters.</p>
                  </td>
                </tr>
              ) : (
                filteredPrices.map((price) => (
                  <tr key={price.id}>
                    <td>
                      <p className="pricing-service-name">
                        {price.serviceType}
                      </p>

                      <div className="pricing-route">
                        <MapPin size={12} />
                        {price.pickupLocation} → {price.dropoffLocation}
                      </div>

                      {price.routeName && (
                        <p className="pricing-route-name">{price.routeName}</p>
                      )}
                    </td>

                    <td>
                      <div className="pricing-passengers">
                        <Users size={15} />
                        {price.minimumPassengers}–{price.maximumPassengers}
                      </div>
                    </td>

                    <td>
                      <span className="pricing-basis">
                        {price.pricingBasis === "PerPassenger"
                          ? "Per Passenger"
                          : "Fixed Trip"}
                      </span>
                    </td>

                    <td>
                      <p className="pricing-amount">
                        {formatMoney(price.amount, price.currency)}
                      </p>

                      <p className="pricing-amount-caption">
                        {price.pricingBasis === "PerPassenger"
                          ? "Per passenger"
                          : "Per trip"}
                      </p>
                    </td>

                    <td>
                      <button
                        type="button"
                        onClick={() => void toggleStatus(price)}
                        className={`pricing-status ${
                          price.isActive
                            ? "pricing-status-active"
                            : "pricing-status-inactive"
                        }`}
                      >
                        <span />
                        {price.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>

                    <td>
                      <div className="pricing-row-actions">
                        <button
                          type="button"
                          onClick={() => openEditModal(price)}
                          title="Edit pricing"
                          aria-label="Edit pricing"
                          className="pricing-icon-button pricing-edit-button"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => void deletePrice(price)}
                          title="Delete pricing"
                          aria-label="Delete pricing"
                          className="pricing-icon-button pricing-delete-button"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pricing-table-footer">
          <p>
            Showing {filteredPrices.length} of {prices.length} pricing rules
          </p>

          <div>
            <ArrowUpDown size={13} />
            Sorted by latest data
          </div>
        </div>
      </section>

      {/* ADD / EDIT MODAL */}

      {modalOpen && (
        <div
          className="pricing-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              setModalOpen(false);
            }
          }}
        >
          <div className="pricing-modal">
            <div className="pricing-modal-header">
              <div>
                <h2>{editingPrice ? "Edit Pricing Rule" : "Add New Price"}</h2>

                <p>Configure the service rate and passenger requirements.</p>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={saving}
                aria-label="Close form"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="pricing-form">
              {error && (
                <div className="pricing-alert pricing-alert-error">
                  <AlertCircle size={17} />
                  <span>{error}</span>
                </div>
              )}

              <div className="pricing-form-grid">
                <FormField label="Service Type">
                  <select
                    value={form.serviceType}
                    onChange={(event) =>
                      updateField("serviceType", event.target.value)
                    }
                    className="pricing-input"
                    required
                  >
                    <option value="Shuttle">Shuttle</option>
                    <option value="Airport Transfer">Airport Transfer</option>
                    <option value="Corporate Transport">
                      Corporate Transport
                    </option>
                    <option value="Tour Transport">Tour Transport</option>
                    <option value="Other">Other</option>
                  </select>
                </FormField>

                <FormField label="Route Name (Optional)">
                  <input
                    value={form.routeName}
                    onChange={(event) =>
                      updateField("routeName", event.target.value)
                    }
                    placeholder="e.g. Cape Town Airport Route"
                    className="pricing-input"
                  />
                </FormField>

                <FormField label="Pickup Location">
                  <input
                    value={form.pickupLocation}
                    onChange={(event) =>
                      updateField("pickupLocation", event.target.value)
                    }
                    placeholder="Enter pickup location"
                    className="pricing-input"
                    required
                  />
                </FormField>

                <FormField label="Drop-off Location">
                  <input
                    value={form.dropoffLocation}
                    onChange={(event) =>
                      updateField("dropoffLocation", event.target.value)
                    }
                    placeholder="Enter destination"
                    className="pricing-input"
                    required
                  />
                </FormField>

                <FormField label="Minimum Passengers">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={form.minimumPassengers}
                    onChange={(event) =>
                      updateField("minimumPassengers", event.target.value)
                    }
                    className="pricing-input"
                    required
                  />
                </FormField>

                <FormField label="Maximum Passengers">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={form.maximumPassengers}
                    onChange={(event) =>
                      updateField("maximumPassengers", event.target.value)
                    }
                    className="pricing-input"
                    required
                  />
                </FormField>

                <FormField label="Pricing Basis">
                  <select
                    value={form.pricingBasis}
                    onChange={(event) =>
                      updateField(
                        "pricingBasis",
                        event.target.value as PricingForm["pricingBasis"],
                      )
                    }
                    className="pricing-input"
                  >
                    <option value="PerPassenger">Per Passenger</option>
                    <option value="FixedTrip">Fixed Trip</option>
                  </select>
                </FormField>

                <FormField label="Amount (ZAR)">
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.amount}
                    onChange={(event) =>
                      updateField("amount", event.target.value)
                    }
                    placeholder="0.00"
                    className="pricing-input"
                    required
                  />
                </FormField>

                <FormField label="Effective From">
                  <input
                    type="date"
                    value={form.effectiveFrom}
                    onChange={(event) =>
                      updateField("effectiveFrom", event.target.value)
                    }
                    className="pricing-input"
                    required
                  />
                </FormField>

                <FormField label="Effective Until (Optional)">
                  <input
                    type="date"
                    value={form.effectiveUntil}
                    onChange={(event) =>
                      updateField("effectiveUntil", event.target.value)
                    }
                    min={form.effectiveFrom}
                    className="pricing-input"
                  />
                </FormField>
              </div>

              <FormField label="Description (Optional)">
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder="Add notes about this pricing rule..."
                  className="pricing-input pricing-textarea"
                />
              </FormField>

              <label className="pricing-active-option">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    updateField("isActive", event.target.checked)
                  }
                />

                <span>
                  <strong>Active pricing rule</strong>
                  <small>
                    Allow this price to be used while it is effective.
                  </small>
                </span>
              </label>

              <div className="pricing-form-footer">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={saving}
                  className="pricing-button pricing-button-cancel"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="pricing-button pricing-button-primary"
                >
                  {saving && <Loader2 size={16} className="pricing-spin" />}

                  {saving
                    ? "Saving..."
                    : editingPrice
                      ? "Save Changes"
                      : "Create Pricing Rule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="pricing-stat-card">
      <div className="pricing-stat-top">
        <p>{label}</p>

        <div className="pricing-stat-icon">{icon}</div>
      </div>

      <p className="pricing-stat-value">{value}</p>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pricing-form-field">
      <label>{label}</label>
      {children}
    </div>
  );
}
