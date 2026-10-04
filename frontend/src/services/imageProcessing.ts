// Local client-side document and photo processing service using HTML5 Canvas

export interface PassportGridOptions {
  count: number; // 4, 8, 16, 32
  paperSize: 'A4' | '4x6';
  photoWidthMm: number; // typically 35mm
  photoHeightMm: number; // typically 45mm
  bgColor: 'White' | 'LightBlue' | 'LightGray';
  addBorder: boolean;
  nameDateTag?: { name: string; date: string };
}

export const imageProcessing = {
  // Convert File / Blob to Image Element
  loadImageFromFile: (file: File | Blob): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = (e) => reject(e);
      img.src = url;
    });
  },

  loadImageFromUrl: (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = url;
    });
  },

  // Generate Passport Photos Grid Canvas (35x45mm)
  generatePassportSheet: async (
    sourceImage: HTMLImageElement,
    options: PassportGridOptions
  ): Promise<string> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');

    // 300 DPI calculations: 1 mm ≈ 11.81 pixels
    const DPI = 300;
    const MM_TO_PX = DPI / 25.4;

    const sheetWidth = options.paperSize === 'A4' ? Math.round(210 * MM_TO_PX) : Math.round(152.4 * MM_TO_PX); // 4x6 inch = 101.6 x 152.4 mm
    const sheetHeight = options.paperSize === 'A4' ? Math.round(297 * MM_TO_PX) : Math.round(101.6 * MM_TO_PX);

    canvas.width = sheetWidth;
    canvas.height = sheetHeight;

    // Fill white sheet background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, sheetWidth, sheetHeight);

    const photoW = Math.round(options.photoWidthMm * MM_TO_PX); // ~413 px
    const photoH = Math.round(options.photoHeightMm * MM_TO_PX); // ~531 px
    const gap = Math.round(4 * MM_TO_PX); // 4mm gap between photos
    const margin = Math.round(15 * MM_TO_PX); // 15mm page margin

    // Determine grid columns based on count
    let cols = 4;
    let rows = 2;
    if (options.count === 4) {
      cols = 2;
      rows = 2;
    } else if (options.count === 8) {
      cols = 4;
      rows = 2;
    } else if (options.count === 16) {
      cols = 4;
      rows = 4;
    } else if (options.count === 32) {
      cols = 6;
      rows = 6;
    }

    // Render individual photo onto a single cell canvas first
    const cellCanvas = document.createElement('canvas');
    cellCanvas.width = photoW;
    cellCanvas.height = photoH;
    const cellCtx = cellCanvas.getContext('2d');
    if (cellCtx) {
      // Background color
      if (options.bgColor === 'LightBlue') {
        cellCtx.fillStyle = '#D4E6F1';
      } else if (options.bgColor === 'LightGray') {
        cellCtx.fillStyle = '#EAECEE';
      } else {
        cellCtx.fillStyle = '#FFFFFF';
      }
      cellCtx.fillRect(0, 0, photoW, photoH);

      // Draw source image centered and cropped nicely to 35x45 ratio
      const srcRatio = sourceImage.width / sourceImage.height;
      const targetRatio = photoW / photoH;
      let sw = sourceImage.width;
      let sh = sourceImage.height;
      let sx = 0;
      let sy = 0;

      if (srcRatio > targetRatio) {
        sw = sourceImage.height * targetRatio;
        sx = (sourceImage.width - sw) / 2;
      } else {
        sh = sourceImage.width / targetRatio;
        sy = (sourceImage.height - sh) / 2;
      }

      cellCtx.drawImage(sourceImage, sx, sy, sw, sh, 0, 0, photoW, photoH);

      // Optional name & date bar at bottom for Indian Govt jobs (like SSC/Railway)
      if (options.nameDateTag && (options.nameDateTag.name || options.nameDateTag.date)) {
        const barH = Math.round(18 * (photoH / 100));
        cellCtx.fillStyle = 'rgba(255,255,255,0.92)';
        cellCtx.fillRect(0, photoH - barH, photoW, barH);
        cellCtx.fillStyle = '#000000';
        cellCtx.font = `bold ${Math.round(photoW * 0.055)}px Arial, sans-serif`;
        cellCtx.textAlign = 'center';
        if (options.nameDateTag.name) {
          cellCtx.fillText(options.nameDateTag.name.toUpperCase(), photoW / 2, photoH - barH + (barH * 0.42));
        }
        if (options.nameDateTag.date) {
          cellCtx.font = `${Math.round(photoW * 0.045)}px Arial, sans-serif`;
          cellCtx.fillText(`DOB/DOP: ${options.nameDateTag.date}`, photoW / 2, photoH - (barH * 0.18));
        }
      }

      // Border cut line
      if (options.addBorder) {
        cellCtx.strokeStyle = '#CCCCCC';
        cellCtx.lineWidth = 1.5;
        cellCtx.strokeRect(0.5, 0.5, photoW - 1, photoH - 1);
      }
    }

    // Now stamp copies across sheet
    let drawn = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (drawn >= options.count) break;
        const x = margin + c * (photoW + gap);
        const y = margin + r * (photoH + gap);

        ctx.drawImage(cellCanvas, x, y);

        // Cutting guides (crosshairs in corner)
        ctx.strokeStyle = '#999999';
        ctx.lineWidth = 0.5;
        // top-left tick
        ctx.beginPath();
        ctx.moveTo(x - 4, y); ctx.lineTo(x, y);
        ctx.moveTo(x, y - 4); ctx.lineTo(x, y);
        ctx.stroke();

        drawn++;
      }
    }

    // Print Header banner (subtle shop stamp)
    ctx.fillStyle = '#888888';
    ctx.font = `${Math.round(11 * MM_TO_PX * 0.35)}px sans-serif`;
    ctx.fillText('CYBERSEVA SMART PHOTO STUDIO — 35x45mm Standard Passport Sheet', margin, margin - 10);

    return canvas.toDataURL('image/jpeg', 0.95);
  },

  // Generate Aadhaar Front + Back on A4 Page
  generateAadhaarA4Layout: async (
    frontImg: HTMLImageElement,
    backImg?: HTMLImageElement | null,
    isBlackAndWhite: boolean = false,
    maskAadhaar: boolean = false
  ): Promise<string> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');

    const DPI = 300;
    const MM_TO_PX = DPI / 25.4;

    const a4W = Math.round(210 * MM_TO_PX); // 2480 px
    const a4H = Math.round(297 * MM_TO_PX); // 3508 px

    canvas.width = a4W;
    canvas.height = a4H;

    // Fill clean white A4
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, a4W, a4H);

    // Standard Aadhaar Card physical size: 86mm x 54mm (or slightly scaled for crisp counter reading: 95mm x 60mm)
    const cardW = Math.round(100 * MM_TO_PX);
    const cardH = Math.round(63 * MM_TO_PX);

    const centerX = (a4W - cardW) / 2;
    const topCardY = Math.round(45 * MM_TO_PX); // 45mm from top
    const gap = Math.round(15 * MM_TO_PX); // 15mm gap between front and back
    const bottomCardY = topCardY + cardH + gap;

    // Helper to draw card with B&W / filter support
    const drawCard = (img: HTMLImageElement, x: number, y: number, label: string) => {
      ctx.save();

      // Card border & shadow outline
      ctx.strokeStyle = '#B0B7C3';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, cardW, cardH);

      // Draw image
      if (isBlackAndWhite) {
        ctx.filter = 'grayscale(100%) contrast(120%)';
      }
      ctx.drawImage(img, x, y, cardW, cardH);
      ctx.restore();

      // Optional Aadhaar privacy mask on first 8 digits (XXXX XXXX 1234)
      if (maskAadhaar) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + cardW * 0.28, y + cardH * 0.72, cardW * 0.35, cardH * 0.1);
        ctx.fillStyle = '#000000';
        ctx.font = `bold ${Math.round(cardH * 0.08)}px monospace`;
        ctx.fillText('XXXX-XXXX-', x + cardW * 0.29, y + cardH * 0.79);
      }

      // Label & fold guide
      ctx.fillStyle = '#667085';
      ctx.font = `${Math.round(3.5 * MM_TO_PX)}px sans-serif`;
      ctx.fillText(label, x, y - 8);
    };

    drawCard(frontImg, centerX, topCardY, 'AADHAAR CARD — FRONT SIDE (मुद्रित प्रति)');

    if (backImg) {
      drawCard(backImg, centerX, bottomCardY, 'AADHAAR CARD — BACK SIDE (पता एवं सुरक्षा कोड)');

      // Center fold dotted line between front and back for easy card lamination fold
      ctx.strokeStyle = '#D0D5DD';
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      const foldY = topCardY + cardH + (gap / 2);
      ctx.moveTo(centerX - 30, foldY);
      ctx.lineTo(centerX + cardW + 30, foldY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = `${Math.round(2.8 * MM_TO_PX)}px sans-serif`;
      ctx.fillText('✂ लैमिनेशन व फोल्डिंग कट-लाइन (Fold & Laminate Line)', centerX + (cardW / 4), foldY - 6);
    }

    // Header & Privacy Notice
    ctx.fillStyle = '#101828';
    ctx.font = `bold ${Math.round(5 * MM_TO_PX)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('CYBERSEVA SMART DOCUMENT PRINT', a4W / 2, Math.round(25 * MM_TO_PX));

    ctx.font = `${Math.round(3 * MM_TO_PX)}px sans-serif`;
    ctx.fillStyle = '#667085';
    ctx.fillText('Zero-Retention Processing • Not affiliated with UIDAI • Temporary Counter Printout', a4W / 2, Math.round(32 * MM_TO_PX));

    return canvas.toDataURL('image/jpeg', 0.94);
  },

  // Compress image to target KB (e.g. 20KB for signature, 50KB for photo)
  compressToTargetKb: async (
    img: HTMLImageElement,
    targetKb: number,
    maxWidth: number = 1000
  ): Promise<{ dataUrl: string; finalKb: number }> => {
    const canvas = document.createElement('canvas');
    let width = img.width;
    let height = img.height;

    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    let quality = 0.9;
    let dataUrl = canvas.toDataURL('image/jpeg', quality);
    let sizeInBytes = Math.round((dataUrl.length * 3) / 4);

    // Iterative step down
    let attempts = 0;
    while (sizeInBytes > targetKb * 1024 && attempts < 10 && quality > 0.15) {
      quality -= 0.1;
      dataUrl = canvas.toDataURL('image/jpeg', quality);
      sizeInBytes = Math.round((dataUrl.length * 3) / 4);
      attempts++;
    }

    // If still oversized, scale down canvas resolution
    if (sizeInBytes > targetKb * 1024) {
      canvas.width = Math.round(width * 0.7);
      canvas.height = Math.round(height * 0.7);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      dataUrl = canvas.toDataURL('image/jpeg', 0.6);
      sizeInBytes = Math.round((dataUrl.length * 3) / 4);
    }

    return {
      dataUrl,
      finalKb: Math.round(sizeInBytes / 1024)
    };
  },

  // Clean Signature: Remove grey background, make strokes dark black & background pure white
  cleanSignature: async (img: HTMLImageElement): Promise<string> => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');

    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    // Thresholding & contrast enhancement
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

      if (brightness > 165) {
        // Turn yellowish/grey paper to pure white
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
      } else {
        // Deepen pen ink to sharp dark blue/black
        data[i] = Math.max(0, r * 0.6);
        data[i + 1] = Math.max(0, g * 0.6);
        data[i + 2] = Math.max(0, b * 0.7);
      }
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas.toDataURL('image/png');
  }
};
