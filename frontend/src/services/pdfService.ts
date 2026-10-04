import { PDFDocument, degrees } from 'pdf-lib';

export const pdfService = {
  // Merge multiple PDF files into one
  mergePdfs: async (files: (File | Blob | ArrayBuffer)[]): Promise<Uint8Array> => {
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      let arrayBuffer: ArrayBuffer;
      if (file instanceof File || file instanceof Blob) {
        arrayBuffer = await file.arrayBuffer();
      } else {
        arrayBuffer = file;
      }

      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    return await mergedPdf.save();
  },

  // Delete specific page indices (1-indexed from user input)
  deletePages: async (pdfFile: File | Blob | ArrayBuffer, pagesToDelete: number[]): Promise<Uint8Array> => {
    let arrayBuffer: ArrayBuffer;
    if (pdfFile instanceof File || pdfFile instanceof Blob) {
      arrayBuffer = await pdfFile.arrayBuffer();
    } else {
      arrayBuffer = pdfFile;
    }

    const pdfDoc = await PDFDocument.load(arrayBuffer);
    // Sort in descending order to avoid shift issues
    const sorted = [...pagesToDelete].sort((a, b) => b - a);

    for (const p of sorted) {
      const pageIndex = p - 1;
      if (pageIndex >= 0 && pageIndex < pdfDoc.getPageCount()) {
        pdfDoc.removePage(pageIndex);
      }
    }

    return await pdfDoc.save();
  },

  // Rotate all or specific page
  rotatePages: async (pdfFile: File | Blob, rotationAngle: 90 | 180 | 270): Promise<Uint8Array> => {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();

    pages.forEach((page) => {
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees(currentRotation + rotationAngle));
    });

    return await pdfDoc.save();
  },

  // Convert JPG / PNG images to a multi-page PDF
  imagesToPdf: async (images: { dataUrl: string; width?: number; height?: number }[]): Promise<Uint8Array> => {
    const pdfDoc = await PDFDocument.create();

    for (const img of images) {
      const isPng = img.dataUrl.startsWith('data:image/png');
      const base64Data = img.dataUrl.split(',')[1];
      const binaryStr = atob(base64Data);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }

      const embeddedImg = isPng ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes);

      // Fit on standard A4 (595.28 x 841.89 points)
      const page = pdfDoc.addPage([595.28, 841.89]);
      const { width: pW, height: pH } = page.getSize();

      const imgDims = embeddedImg.scaleToFit(pW - 40, pH - 40);
      page.drawImage(embeddedImg, {
        x: (pW - imgDims.width) / 2,
        y: (pH - imgDims.height) / 2,
        width: imgDims.width,
        height: imgDims.height
      });
    }

    return await pdfDoc.save();
  },

  // Download helper for generated PDF bytes
  downloadPdfBytes: (pdfBytes: Uint8Array, fileName: string = 'CyberSeva_Processed.pdf') => {
    const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  }
};
