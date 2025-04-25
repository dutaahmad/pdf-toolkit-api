import { Injectable } from '@nestjs/common';
import { PDFDocument } from 'pdf-lib';

export type MergePDFs = {
  order: number[];
  pdfs: Buffer[];
}

@Injectable()
export class AppService {
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
