import { Injectable } from "@nestjs/common";
import { PDFDocument } from "pdf-lib";

export type MergePDFs = {
  order: number[];
  pdfs: Buffer[];
};

@Injectable()
export class AppService {
  /**
   * Converts an array of images to a single PDF document.
   */
  async imageToPDF(images: Buffer[]): Promise<Buffer> {
    console.log("Converting images to PDF...");
    const pdfDoc = await PDFDocument.create();

    for (const imageBuffer of images) {
      let image;
      let dimensions;

      if (imageBuffer[0] === 0xff && imageBuffer[1] === 0xd8) {
        // JPEG
        image = await pdfDoc.embedJpg(imageBuffer);
        dimensions = image.scale(1);
      } else if (imageBuffer[0] === 0x89 && imageBuffer[1] === 0x50) {
        // PNG
        image = await pdfDoc.embedPng(imageBuffer);
        dimensions = image.scale(1);
      } else {
        throw new Error("Unsupported image format");
      }

      const page = pdfDoc.addPage([dimensions.width, dimensions.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: dimensions.width,
        height: dimensions.height
      });
    }

    const pdfBytes = await pdfDoc.save();

    console.log("Images converted to PDF");
    return Buffer.from(pdfBytes);
  }

  /**
   * Merges multiple PDF documents into a single PDF document.
   */
  async mergePDFs(params: { pdfs: Buffer[]; order: number[] }): Promise<Buffer> {
    const { pdfs, order } = params;

    const outputPdf = await PDFDocument.create();

    for (const idx of order) {
      const inputPdf = await PDFDocument.load(pdfs[idx]);
      const copiedPages = await outputPdf.copyPages(inputPdf, inputPdf.getPageIndices());
      copiedPages.forEach((page) => outputPdf.addPage(page));
    }

    const mergedPdfBuffer = await outputPdf.save();
    return Buffer.from(mergedPdfBuffer);
  }
}
