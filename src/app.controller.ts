import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors
} from "@nestjs/common";
import { AppService } from "./app.service";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { Response } from "express";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("image-to-pdf")
  @UseInterceptors(FileFieldsInterceptor([{ name: "images", maxCount: 20 }]))
  async imageToPDF(
    @UploadedFiles() files: { images?: Express.Multer.File[] },
    @Res() res: Response
  ) {
    if (!files.images || files.images.length === 0) {
      throw new BadRequestException("No images uploaded");
    }

    const buffers = files.images.map((img) => img.buffer);

    const pdfBuffer = await this.appService.imageToPDF(buffers);

    // Get first filename and change extension to .pdf
    const originalName = files.images[0].originalname;
    const filenameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
    const newFilename = filenameWithoutExt + ".pdf";

    res
      .set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${newFilename}`
      })
      .send(pdfBuffer);
  }

  @Post("merge-pdf")
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "pdfs", maxCount: 10 } // Accept up to 10 PDF files
    ])
  )
  async mergePDF(
    @UploadedFiles() files: { pdfs?: Express.Multer.File[] },
    @Body("order") orderJson: string,
    @Res() res: Response
  ) {
    if (!files.pdfs || files.pdfs.length === 0) {
      throw new BadRequestException("No PDFs uploaded");
    }

    let order: string[];
    try {
      order = JSON.parse(orderJson);
      if (!Array.isArray(order)) throw new Error();
    } catch {
      throw new BadRequestException('Invalid "order" field, must be a JSON array of filenames');
    }

    // Map filenames to buffers
    const bufferMap = new Map(files.pdfs.map((file) => [file.originalname, file.buffer]));

    // Reorder buffers based on filenames
    const orderedBuffers: Buffer[] = [];
    for (const filename of order) {
      const buffer = bufferMap.get(filename);
      if (!buffer) {
        throw new BadRequestException(`Missing PDF for "${filename}"`);
      }
      orderedBuffers.push(buffer);
    }

    const mergedBuffer = await this.appService.mergePDFs({
      pdfs: orderedBuffers,
      order: order.map((_, i) => i) // order is now implied by filename order
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=merged.pdf"
    });
    res.send(mergedBuffer);
  }
}
