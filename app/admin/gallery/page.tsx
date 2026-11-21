"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Images,
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  X,
  Upload,
  ImagePlus,
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";
import "./gallery.css";

type GalleryImage = {
  id: number;
  title: string;
  category: string;
  description: string;
  altText: string;
  isPublished: boolean;
  displayOrder: number;
  createdAtUtc?: string;
  updatedAtUtc?: string | null;
  imageUrl: string;
};

type GalleryForm = {
  title: string;
  category: string;
  description: string;
  altText: string;
  isPublished: boolean;
  displayOrder: number;
};

const CATEGORIES = [
  "Our Fleet",
  "Destinations",
  "Travel Experiences",
  "Our Services",
];

const API_BASE_URL = (() => {
  const base = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050"
  ).replace(/\/+$/, "");

  return base.endsWith("/api") ? base : `${base}/api`;
})();

const API_ORIGIN = API_BASE_URL.replace(/\/api$/, "");

const EMPTY_FORM: GalleryForm = {
  title: "",
  category: "Our Fleet",
  description: "",
  altText: "",
  isPublished: false,
  displayOrder: 0,
};

function getErrorMessage(data: unknown, fallback: string) {
  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data.message;
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "title" in data &&
    typeof data.title === "string"
  ) {
    return data.title;
  }

  return fallback;
}

function StatCard({
  label,
  value,
  icon,
  tone = "gold",
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone?: "gold" | "green" | "amber";
}) {
  return (
    <div className="gallery-stat-card">
      <div className="gallery-stat-top">
        <p>{label}</p>
        <div className={`gallery-stat-icon gallery-stat-icon-${tone}`}>
          {icon}
        </div>
      </div>
      <p className="gallery-stat-value">{value}</p>
    </div>
  );
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);

  const [form, setForm] = useState<GalleryForm>(EMPTY_FORM);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const getImageUrl = useCallback((path: string) => {
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
  }, []);

  const loadImages = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/gallery/admin`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error(
            "You are not authorized to view the Gallery. Please sign in again.",
          );
        }

        throw new Error(`Unable to load gallery images (${response.status}).`);
      }

      const data: GalleryImage[] = await response.json();
      setImages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading the gallery.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadImages();
  }, [loadImages]);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const filteredImages = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return images
      .filter((image) => {
        const matchesSearch =
          !searchText ||
          image.title.toLowerCase().includes(searchText) ||
          (image.description || "").toLowerCase().includes(searchText) ||
          image.category.toLowerCase().includes(searchText);

        const matchesCategory =
          categoryFilter === "All" || image.category === categoryFilter;

        const matchesStatus =
          statusFilter === "All" ||
          (statusFilter === "Published" && image.isPublished) ||
          (statusFilter === "Draft" && !image.isPublished);

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [images, search, categoryFilter, statusFilter]);

  const publishedCount = images.filter((image) => image.isPublished).length;
  const draftCount = images.length - publishedCount;

  const updateForm = <K extends keyof GalleryForm>(
    field: K,
    value: GalleryForm[K],
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const openUploadModal = () => {
    setEditingImage(null);
    setForm({ ...EMPTY_FORM });
    setSelectedFile(null);
    setPreviewUrl("");
    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  const openEditModal = (image: GalleryImage) => {
    setEditingImage(image);

    setForm({
      title: image.title,
      category: image.category,
      description: image.description || "",
      altText: image.altText || "",
      isPublished: image.isPublished,
      displayOrder: image.displayOrder,
    });

    setSelectedFile(null);
    setPreviewUrl(getImageUrl(image.imageUrl));
    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingImage(null);
    setSelectedFile(null);
    setPreviewUrl("");
    setForm({ ...EMPTY_FORM });
  };

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG and WebP images are supported.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("Images cannot exceed 8 MB.");
      return;
    }

    setError("");
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError("Please enter an image title.");
      return;
    }

    if (!editingImage && !selectedFile) {
      setError("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("Title", form.title.trim());
    formData.append("Category", form.category);
    formData.append("Description", form.description);
    formData.append("AltText", form.altText);
    formData.append("IsPublished", String(form.isPublished));
    formData.append("DisplayOrder", String(form.displayOrder));

    if (selectedFile) {
      formData.append("Image", selectedFile);
    }

    setSaving(true);

    try {
      const url = editingImage
        ? `${API_BASE_URL}/gallery/${editingImage.id}`
        : `${API_BASE_URL}/gallery`;

      const response = await fetch(url, {
        method: editingImage ? "PUT" : "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(getErrorMessage(data, "Unable to save gallery image."));
      }

      setModalOpen(false);
      setEditingImage(null);
      setSelectedFile(null);
      setPreviewUrl("");
      setForm({ ...EMPTY_FORM });

      setSuccess(
        editingImage
          ? "Gallery image updated successfully."
          : "Gallery image uploaded successfully.",
      );

      await loadImages();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save gallery image.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(image: GalleryImage) {
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/gallery/${image.id}/publish`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isPublished: !image.isPublished,
          }),
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, "Unable to update publishing status."),
        );
      }

      setSuccess(
        image.isPublished
          ? "Image unpublished successfully."
          : "Image published successfully.",
      );

      await loadImages();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update publishing status.",
      );
    }
  }

  async function deleteImage(image: GalleryImage) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${image.title}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/gallery/${image.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, "Unable to delete gallery image."),
        );
      }

      setSuccess("Gallery image deleted successfully.");
      await loadImages();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete gallery image.",
      );
    }
  }

  return (
    <div className="gallery-page">
      {/* PAGE HEADER */}
      <div className="gallery-header">
        <div className="gallery-heading">
          <div className="gallery-eyebrow">
            <Images size={15} />
            Content Management
          </div>

          <h1>Gallery Management</h1>
          <p>Manage the photos and experiences displayed on your website.</p>
        </div>

        <div className="gallery-header-actions">
          <button
            type="button"
            onClick={() => void loadImages()}
            disabled={loading}
            className="gallery-button gallery-button-secondary"
          >
            <RefreshCw size={16} className={loading ? "gallery-spin" : ""} />
            Refresh
          </button>

          <button
            type="button"
            onClick={openUploadModal}
            className="gallery-button gallery-button-primary"
          >
            <Plus size={18} />
            Upload Image
          </button>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      {error && !modalOpen && (
        <div className="gallery-alert gallery-alert-error">
          <AlertCircle size={19} />
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {success && (
        <div className="gallery-alert gallery-alert-success">
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
      <div className="gallery-stats">
        <StatCard
          label="Total Images"
          value={images.length}
          icon={<Images size={21} />}
        />
        <StatCard
          label="Published Images"
          value={publishedCount}
          icon={<Eye size={21} />}
          tone="green"
        />
        <StatCard
          label="Draft Images"
          value={draftCount}
          icon={<EyeOff size={21} />}
          tone="amber"
        />
      </div>

      {/* GALLERY PANEL */}
      <section className="gallery-panel">
        <div className="gallery-panel-header">
          <div className="gallery-panel-title">
            <h2>Website Gallery</h2>
            <p>
              View, organise and manage all images uploaded to your website.
            </p>
          </div>

          <div className="gallery-filters">
            <div className="gallery-search">
              <Search size={16} />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search gallery..."
                aria-label="Search gallery images"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              aria-label="Filter by category"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by publishing status"
            >
              <option value="All">All Status</option>
              <option value="Published">Published</option>
              <option value="Draft">Drafts</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="gallery-loading">
            <Loader2 size={30} className="gallery-loader" />
            <p>Loading gallery images...</p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="gallery-empty">
            <div className="gallery-empty-icon">
              <ImagePlus size={25} />
            </div>

            <h3>
              {images.length === 0
                ? "Your gallery is empty"
                : "No matching images"}
            </h3>

            <p>
              {images.length === 0
                ? "Upload your first image to start building the TESAZMARE gallery."
                : "Try changing your search or filter settings."}
            </p>

            {images.length === 0 && (
              <button
                type="button"
                onClick={openUploadModal}
                className="gallery-button gallery-button-primary"
              >
                <Plus size={17} />
                Upload First Image
              </button>
            )}
          </div>
        ) : (
          <div className="gallery-grid">
            {filteredImages.map((image) => (
              <article className="gallery-card" key={image.id}>
                <div className="gallery-card-image">
                  <img
                    src={getImageUrl(image.imageUrl)}
                    alt={image.altText || image.title}
                  />

                  <span
                    className={`gallery-status ${
                      image.isPublished ? "is-published" : "is-draft"
                    }`}
                  >
                    <span />
                    {image.isPublished ? "Published" : "Draft"}
                  </span>

                  <span className="gallery-category">{image.category}</span>
                </div>

                <div className="gallery-card-content">
                  <div className="gallery-card-heading">
                    <h3 title={image.title}>{image.title}</h3>
                    <span className="gallery-order">#{image.displayOrder}</span>
                  </div>

                  <p className="gallery-description">
                    {image.description || "No description added."}
                  </p>

                  <div className="gallery-card-actions">
                    <button
                      type="button"
                      onClick={() => void togglePublish(image)}
                      className={`gallery-publish-button ${
                        image.isPublished ? "unpublish" : "publish"
                      }`}
                    >
                      {image.isPublished ? (
                        <>
                          <EyeOff size={15} />
                          Unpublish
                        </>
                      ) : (
                        <>
                          <Eye size={15} />
                          Publish
                        </>
                      )}
                    </button>

                    <div className="gallery-row-actions">
                      <button
                        type="button"
                        onClick={() => openEditModal(image)}
                        className="gallery-icon-button gallery-edit-button"
                        title="Edit image"
                        aria-label={`Edit ${image.title}`}
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => void deleteImage(image)}
                        className="gallery-icon-button gallery-delete-button"
                        title="Delete image"
                        aria-label={`Delete ${image.title}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="gallery-panel-footer">
          <p>
            Showing <strong>{filteredImages.length}</strong> of{" "}
            <strong>{images.length}</strong> images
          </p>
          <div>
            <ImageIcon size={14} />
            Images are sorted by display order
          </div>
        </div>
      </section>

      {/* UPLOAD / EDIT MODAL */}
      {modalOpen && (
        <div
          className="gallery-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div
            className="gallery-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gallery-modal-title"
          >
            <div className="gallery-modal-header">
              <div>
                <h2 id="gallery-modal-title">
                  {editingImage ? "Edit Gallery Image" : "Upload Gallery Image"}
                </h2>
                <p>Add and manage the images displayed on your website.</p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close modal"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="gallery-form">
              {error && (
                <div className="gallery-alert gallery-alert-error">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              {/* IMAGE UPLOAD */}
              <div className="gallery-form-field">
                <label>Gallery Image *</label>

                <label className="gallery-upload-area">
                  {previewUrl ? (
                    <div className="gallery-preview-wrap">
                      <img
                        src={previewUrl}
                        alt="Gallery preview"
                        className="gallery-upload-preview"
                      />
                      <span className="gallery-preview-change">
                        <Upload size={14} />
                        Change image
                      </span>
                    </div>
                  ) : (
                    <div className="gallery-upload-placeholder">
                      <span className="gallery-upload-icon">
                        <Upload size={22} />
                      </span>
                      <strong>Click to upload an image</strong>
                      <small>JPG, PNG or WebP · Maximum 8 MB</small>
                    </div>
                  )}

                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={(event) =>
                      handleFileChange(event.target.files?.[0] || null)
                    }
                  />
                </label>

                {editingImage && (
                  <small className="gallery-field-help">
                    Leave the existing image unchanged by not selecting a new
                    file.
                  </small>
                )}
              </div>

              <div className="gallery-form-grid">
                <div className="gallery-form-field">
                  <label htmlFor="gallery-title">Image Title *</label>
                  <input
                    id="gallery-title"
                    className="gallery-input"
                    type="text"
                    required
                    maxLength={150}
                    value={form.title}
                    onChange={(event) =>
                      updateForm("title", event.target.value)
                    }
                    placeholder="e.g. Our Shuttle Fleet"
                  />
                </div>

                <div className="gallery-form-field">
                  <label htmlFor="gallery-category">Category *</label>
                  <select
                    id="gallery-category"
                    className="gallery-input"
                    value={form.category}
                    onChange={(event) =>
                      updateForm("category", event.target.value)
                    }
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="gallery-form-field">
                <label htmlFor="gallery-description">Description</label>
                <textarea
                  id="gallery-description"
                  className="gallery-input gallery-textarea"
                  rows={3}
                  maxLength={1000}
                  value={form.description}
                  onChange={(event) =>
                    updateForm("description", event.target.value)
                  }
                  placeholder="Write a short description about this image..."
                />
              </div>

              <div className="gallery-form-grid">
                <div className="gallery-form-field">
                  <label htmlFor="gallery-alt">Alternative Text</label>
                  <input
                    id="gallery-alt"
                    className="gallery-input"
                    type="text"
                    maxLength={250}
                    value={form.altText}
                    onChange={(event) =>
                      updateForm("altText", event.target.value)
                    }
                    placeholder="Describe the image"
                  />
                </div>

                <div className="gallery-form-field">
                  <label htmlFor="gallery-order">Display Order</label>
                  <input
                    id="gallery-order"
                    className="gallery-input"
                    type="number"
                    min={0}
                    value={form.displayOrder}
                    onChange={(event) =>
                      updateForm("displayOrder", Number(event.target.value))
                    }
                  />
                  <small className="gallery-field-help">
                    Lower numbers appear first.
                  </small>
                </div>
              </div>

              <label className="gallery-publish-option">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(event) =>
                    updateForm("isPublished", event.target.checked)
                  }
                />
                <span>
                  <strong>Publish this image</strong>
                  <small>
                    Published images will be visible on the public website.
                  </small>
                </span>
              </label>

              <div className="gallery-form-footer">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="gallery-button gallery-button-cancel"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="gallery-button gallery-button-primary"
                >
                  {saving ? (
                    <>
                      <Loader2 size={16} className="gallery-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      {editingImage ? "Save Changes" : "Upload Image"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
