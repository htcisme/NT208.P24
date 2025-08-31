import fetch from "node-fetch";
import { Buffer } from "buffer";

// Utility functions for image processing
export class ImageProcessor {
  // Convert file to base64
  static fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result.split(",")[1]; // Remove data:image/jpeg;base64,
        const contentType = file.type;
        resolve({
          data: base64,
          contentType,
          filename: file.name,
          size: file.size,
        });
      };
      reader.onerror = (error) => reject(error);
    });
  }

  // Convert URL to base64
  static async urlToBase64(imageUrl) {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => {
          const base64 = reader.result.split(",")[1];
          resolve({
            data: base64,
            contentType: blob.type,
            filename: imageUrl.split("/").pop() || "image",
            size: blob.size,
          });
        };
        reader.onerror = (error) => reject(error);
      });
    } catch (error) {
      throw new Error(`Failed to convert URL to base64: ${error.message}`);
    }
  }

  // Validate image size (recommend max 2MB per image)
  static validateImageSize(base64Data, maxSizeInMB = 2) {
    const sizeInBytes = Math.ceil(base64Data.length * 0.75); // Approximate size
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (sizeInBytes > maxSizeInBytes) {
      throw new Error(
        `Image too large: ${(sizeInBytes / 1024 / 1024).toFixed(
          2
        )}MB. Max allowed: ${maxSizeInMB}MB`
      );
    }

    return sizeInBytes;
  }

  // Compress base64 image (basic implementation)
  static compressBase64Image(base64Data, quality = 0.8) {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Resize if too large
        let { width, height } = img;
        const maxDimension = 1200;

        if (width > maxDimension || height > maxDimension) {
          const ratio = Math.min(maxDimension / width, maxDimension / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas
          .toDataURL("image/jpeg", quality)
          .split(",")[1];

        resolve({
          data: compressedBase64,
          contentType: "image/jpeg",
          size: Math.ceil(compressedBase64.length * 0.75),
        });
      };

      img.src = `data:image/jpeg;base64,${base64Data}`;
    });
  }
}
