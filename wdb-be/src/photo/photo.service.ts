import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OutfitPhoto, Photo, Prisma } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import { MediaService } from './media.service';

@Injectable()
export class PhotoService {
  constructor(
    private prisma: PrismaService,
    private mediaService: MediaService,
  ) {}

  // Photos for items
  async photo(
    photoWhereUniqueInput: Prisma.PhotoWhereUniqueInput,
  ): Promise<Photo | null> {
    return this.prisma.photo.findUnique({
      where: photoWhereUniqueInput,
    });
  }

  // Photos for items
  async photos(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PhotoWhereUniqueInput;
    where?: Prisma.PhotoWhereInput;
    orderBy?: Prisma.PhotoOrderByWithRelationInput;
  }): Promise<Photo[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.photo.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  // Photos for items
  async createPhoto(data: Prisma.PhotoCreateInput): Promise<Photo> {
    return this.prisma.photo.create({data});
  }

  // Photos for items
  async updatePhoto(params: {
    where: Prisma.PhotoWhereUniqueInput;
    data: Prisma.PhotoUpdateInput;
  }): Promise<Photo> {
    const { where, data } = params;
    return this.prisma.photo.update({
      data,
      where,
    });
  }

  // Photos for items
  async deletePhoto(where: Prisma.PhotoWhereUniqueInput): Promise<Photo> {
    return this.prisma.photo.delete({
      where,
    });
  }

  async createOutfitPhoto(data: Prisma.OutfitPhotoCreateInput): Promise<OutfitPhoto> {
    return this.prisma.outfitPhoto.create({data})
  }

  async updateOutfitPhoto(params: {
    where: Prisma.OutfitPhotoWhereUniqueInput;
    data: Prisma.OutfitPhotoUpdateInput;
  }): Promise<OutfitPhoto> {
    const { where, data } = params;
    return this.prisma.outfitPhoto.update({
      data,
      where,
    });
  }

  async deleteOutfitPhoto(where: Prisma.OutfitPhotoWhereUniqueInput): Promise<OutfitPhoto> {
    return this.prisma.outfitPhoto.delete({
      where,
    });
  }
}
