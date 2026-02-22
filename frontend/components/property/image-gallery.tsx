"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const t = useTranslations("imageGallery");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [showThumbnails, setShowThumbnails] = useState(false);

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setShowThumbnails(false);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((selectedImageIndex + 1) % images.length);
  };

  const previousImage = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* Main Image Gallery */}
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Main Large Image */}
          <div 
            className="col-span-1 md:col-span-1 cursor-pointer group relative"
            onClick={() => openModal(0)}
          >
            <div className="relative h-[500px]">
              <img
                src={images[0]}
                alt={`${title} - ${t("mainImage")}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
            </div>
          </div>

          {/* Side Images Grid */}
          <div className="hidden md:grid grid-cols-2 gap-4">
            {images.slice(1, 5).map((image, index) => (
              <div 
                key={index + 1}
                className="relative cursor-pointer group"
                onClick={() => openModal(index + 1)}
              >
                <div className="relative h-[245px]">
                  <img
                    src={image}
                    alt={`${title} ${index + 2}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                </div>
                {index === 3 && images.length > 5 && (
                  <div 
                    className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowThumbnails(true);
                    }}
                  >
                    <span className="text-white text-xl font-semibold">{t("morePhotos", { count: images.length - 5 })}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Image Indicator */}
        <div className="flex md:hidden justify-center space-x-2 mt-4">
          {images.map((_, index) => (
            <div
              key={index}
              onClick={() => openModal(index)}
              className={cn(
                "w-2 h-2 rounded-full cursor-pointer transition-all",
                index === 0 
                  ? "bg-primary w-6" 
                  : "bg-gray-300 hover:bg-gray-400"
              )}
            />
          ))}
        </div>

        {/* Mobile View More Button */}
        <div className="md:hidden mt-4">
          <button
            onClick={() => setShowThumbnails(true)}
            className="w-full py-2 px-4 text-sm text-primary border-2 border-primary rounded-lg hover:bg-primary/5 transition-colors"
          >
            {t("viewAllPhotos", { count: images.length })}
          </button>
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={selectedImageIndex !== null} onOpenChange={closeModal}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] h-auto p-0 bg-black/95">
          <div className="relative w-full h-full flex flex-col">
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/50 to-transparent z-50 flex items-center justify-between px-4">
              <div className="text-white/90 font-medium">
                {selectedImageIndex !== null ? `${selectedImageIndex + 1} / ${images.length}` : ''}
              </div>
              <button
                onClick={closeModal}
                className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Image Container */}
            <div className="flex-1 relative flex items-center justify-center p-8">
              {/* Navigation Buttons */}
              <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-50">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    previousImage();
                  }}
                  className="p-2 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/70 transition-colors pointer-events-auto"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="p-2 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/70 transition-colors pointer-events-auto"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </div>

              {/* Main Image */}
              {selectedImageIndex !== null && (
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={images[selectedImageIndex]}
                    alt={`${title} ${selectedImageIndex + 1}`}
                    className="max-w-full max-h-[calc(95vh-16rem)] object-contain"
                  />
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="w-full bg-black/50 p-4">
              <div className="flex space-x-2 overflow-x-auto max-w-full pb-2">
                {images.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "flex-shrink-0 w-20 h-20 cursor-pointer rounded-lg overflow-hidden border-2 transition-all",
                      selectedImageIndex === index 
                        ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-black/95" 
                        : "border-transparent hover:border-white/50"
                    )}
                  >
                    <img
                      src={image}
                      alt={`${title} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Thumbnails Grid Modal */}
      <Dialog 
        open={showThumbnails && selectedImageIndex === null} 
        onOpenChange={(open) => {
          if (!open) setShowThumbnails(false);
        }}
      >
        <DialogContent className="max-w-4xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{t("allPhotos")}</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                onClick={() => openModal(index)}
                className="relative cursor-pointer group aspect-square"
              >
                <img
                  src={image}
                  alt={`${title} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 