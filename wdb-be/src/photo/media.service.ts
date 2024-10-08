import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadApiOptions, v2 as cloudinary } from 'cloudinary';

@Injectable()
export class MediaService implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  onModuleInit() {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  generateItemFolderPath(itemId, userId) {
    return `items/${userId}/${itemId}`;
  }

  generateOutfitFolderPath(outfitId, userId) {
    return `outfits/${userId}/${outfitId}`;
  }

  async uploadItemImage(
    base64Image: string,
    itemId: string,
    userId: string,
  ): Promise<UploadedImage> {
    const folderPath = this.generateItemFolderPath(itemId, userId);
    console.log(folderPath);
    const result = await cloudinary.uploader.upload(
      base64Image,
      {
        folder: folderPath,
      },
      function (error, result) {
        console.log(result);
      },
    );
    return { publicId: result.public_id, secureUrl: result.secure_url };
  }

  async uploadOutfitImage(
    base64Image: string,
    outfitId: string,
    userId: string,
  ): Promise<UploadedImage> {
    const folderPath = this.generateOutfitFolderPath(outfitId, userId);
    console.log(folderPath);
    const result = await cloudinary.uploader.upload(
      base64Image,
      {
        folder: folderPath,
      },
      function (error, result) {
        console.log(result);
      },
    );
    return { publicId: result.public_id, secureUrl: result.secure_url };
  }

  async deleteImageFolder(path): Promise<void> {
    const result = await cloudinary.api.delete_resources_by_prefix(path);
    console.log(`Deleted images at path ${path}`);
    console.log(result);
  }

  async deleteImages(publicIds: string[]): Promise<void> {
    const result = await cloudinary.api.delete_resources(publicIds);
    console.log(`Deleted images with ids ${publicIds}`);
    console.log(result);
  }
}

export interface UploadedImage {
  publicId: string;
  secureUrl: string;
}
