"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Images,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./Gallery.css";

const categories = [
  "All",
  "Our Fleet",
  "Destinations",
  "Travel Experiences",
  "Our Services",
];

interface GalleryImage {
  id: number;
  title: string;
  category: string;
  description: string;
  altText: string;
  displayOrder: number;
  imageUrl: string;
}

const API_BASE_URL = (() => {
  const base = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050"
  ).replace(/\/+$/, "");

  return base.endsWith("/api") ? base : `${base}/api`;
})();

const API_ORIGIN = API_BASE_URL.replace(/\/api$/, "");

function getImageUrl(imageUrl: string) {
  if (!imageUrl) return "";

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  return `${API_ORIGIN}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
}

export default function Gallery() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadGallery = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/gallery/published`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load gallery images.");
      }

      const data: GalleryImage[] = await response.json();

      setGalleryImages(
        Array.isArray(data)
          ? data.sort((a, b) => a.displayOrder - b.displayOrder)
          : [],
      );
    } catch (err) {
      console.error("Gallery loading error:", err);
      setError("Gallery images could not be loaded. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  const filteredImages =
    activeCategory === "All"
      ? galleryImages
      : galleryImages.filter((image) => image.category === activeCategory);

  const currentIndex = filteredImages.findIndex(
    (image) => image.id === selectedImage,
  );

  const selected = currentIndex >= 0 ? filteredImages[currentIndex] : null;

  const showPrevious = () => {
    if (filteredImages.length <= 1 || currentIndex < 0) return;

    const previousIndex =
      (currentIndex - 1 + filteredImages.length) % filteredImages.length;

    setSelectedImage(filteredImages[previousIndex].id);
  };

  const showNext = () => {
    if (filteredImages.length <= 1 || currentIndex < 0) return;

    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setSelectedImage(filteredImages[nextIndex].id);
  };

  return (
    <section className="gallery-section" id="gallery">
      <div className="gallery-container">
        <div className="gallery-heading">
          <div>
            <span className="gallery-eyebrow">OUR GALLERY</span>

            <h2>
              Moments Along <span>The Journey.</span>
            </h2>

            <p>
              Explore our fleet, destinations and experiences. Get a glimpse of
              what travelling with TESAZMARE Logistics is all about.
            </p>
          </div>

          <Link href="/gallery" className="gallery-view-all">
            View All Gallery
            <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className="gallery-filters">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={activeCategory === category ? "active" : ""}
              onClick={() => {
                setActiveCategory(category);
                setSelectedImage(null);
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="gallery-empty">
            <Images size={35} />
            <p>Loading gallery images...</p>
          </div>
        ) : error ? (
          <div className="gallery-empty">
            <Images size={35} />
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="gallery-grid">
              {filteredImages.map((image) => (
                <button
                  type="button"
                  className="gallery-item"
                  key={image.id}
                  onClick={() => setSelectedImage(image.id)}
                  aria-label={`View ${image.title}`}
                >
                  <Image
                    src={getImageUrl(image.imageUrl)}
                    alt={image.altText || image.title}
                    fill
                    unoptimized
                    sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                  />

                  <div className="gallery-item-overlay">
                    <div>
                      <span>{image.category}</span>
                      <h3>{image.title}</h3>
                      <p>{image.description}</p>
                    </div>

                    <div className="gallery-expand">
                      <ArrowUpRight size={20} />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {filteredImages.length === 0 && (
              <div className="gallery-empty">
                <Images size={35} />
                <p>No images available in this category.</p>
              </div>
            )}
          </>
        )}
      </div>

      {selected && (
        <div
          className="gallery-lightbox"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            className="gallery-lightbox-close"
            onClick={() => setSelectedImage(null)}
            aria-label="Close gallery"
          >
            <X size={25} />
          </button>

          {filteredImages.length > 1 && (
            <>
              <button
                type="button"
                className="gallery-lightbox-nav previous"
                onClick={(event) => {
                  event.stopPropagation();
                  showPrevious();
                }}
                aria-label="Previous image"
              >
                <ChevronLeft size={28} />
              </button>

              <button
                type="button"
                className="gallery-lightbox-nav next"
                onClick={(event) => {
                  event.stopPropagation();
                  showNext();
                }}
                aria-label="Next image"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          <div
            className="gallery-lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="gallery-lightbox-image">
              <Image
                src={getImageUrl(selected.imageUrl)}
                alt={selected.altText || selected.title}
                fill
                unoptimized
                sizes="90vw"
                className="gallery-lightbox-photo"
              />
            </div>

            <div className="gallery-lightbox-caption">
              <span>{selected.category}</span>
              <h3>{selected.title}</h3>
              <p>{selected.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
