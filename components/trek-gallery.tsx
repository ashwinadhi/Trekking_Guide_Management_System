"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TrekGalleryProps {
  images: string[]
}

export default function TrekGallery({ images }: TrekGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const openLightbox = (index: number) => {
    setSelectedImage(index)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length)
    }
  }

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.slice(0, 5).map((image, index) => (
          <div
            key={index}
            className="relative aspect-square cursor-pointer overflow-hidden rounded-lg hover:opacity-90 transition-opacity"
            onClick={() => openLightbox(index)}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Trek gallery image ${index + 1}`}
              fill
              className="object-cover"
            />
            {index === 4 && images.length > 5 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white text-xl font-bold">+{images.length - 5} more</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-full p-4">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 z-10"
              onClick={closeLightbox}
            >
              <X className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white hover:bg-opacity-20"
              onClick={prevImage}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white hover:bg-opacity-20"
              onClick={nextImage}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>

            <div className="relative">
              <Image
                src={images[selectedImage] || "/placeholder.svg"}
                alt={`Trek gallery image ${selectedImage + 1}`}
                width={800}
                height={600}
                className="max-w-full max-h-[80vh] object-contain"
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
                {selectedImage + 1} / {images.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
