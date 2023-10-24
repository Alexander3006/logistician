import { Injectable } from '@nestjs/common';
import { Metadata } from 'sharp';
import * as sharp from 'sharp';
import { FileMimeType } from '../types';

@Injectable()
export class ImageFileService {
  constructor() {}

  async getImageMetadata(filepath: string): Promise<Metadata> {
    const result = await sharp(filepath).metadata();
    return result;
  }

  async compressImageFile(
    mimetype: string,
    file: NodeJS.ReadableStream,
    size?: number,
  ): Promise<NodeJS.ReadableStream> {
    if (!mimetype.startsWith('image')) return file;
    const baseCompressor = sharp({ animated: true, limitInputPixels: false })
      .rotate()
      .toFormat('jpeg', {
        quality: 90,
      });
    const compressor = size
      ? baseCompressor.resize({
          height: size,
          withoutEnlargement: mimetype !== FileMimeType.SVG,
        })
      : baseCompressor;
    const stream = file.pipe(compressor);
    return stream;
  }
}
