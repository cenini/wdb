import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { $Enums, Prisma, Tag, TagType } from '@prisma/client';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async tag(
    tagWhereUniqueInput: Prisma.TagWhereUniqueInput,
  ): Promise<Tag | null> {
    return this.prisma.tag.findUnique({
      where: tagWhereUniqueInput,
    });
  }

  async tags(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TagWhereUniqueInput;
    where?: Prisma.TagWhereInput;
    orderBy?: Prisma.TagOrderByWithRelationInput;
  }): Promise<Tag[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.tag.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createTag(data: Prisma.TagCreateInput): Promise<Tag> {
    return this.prisma.tag.create({
      data,
    });
  }

  async createTags(
    data: Prisma.TagCreateManyInput,
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.tag.createMany({
      data: data,
      skipDuplicates: true,
    });
  }

  async upsertTag(tagData: {
    key: string;
    value: string;
    type: TagType;
  }): Promise<Tag> {
    const { key, value, type } = tagData;

    return this.prisma.tag.upsert({
      where: { key_value: { key, value } },
      update: { value, type },
      create: { key, value, type },
    });
  }

  async upsertTags(
    tagDataArray: {
      name: string;
      key: string;
      value: string;
      type: TagType;
    }[],
  ): Promise<Tag[]> {
    const upsertedTags: Tag[] = [];

    for (const tagData of tagDataArray) {
      const { name, key, value, type } = tagData;

      if (key === null || value === null) continue;

      if (type === $Enums.TagType.KEY_VALUE) {
        const upsertedTag = await this.prisma.tag.upsert({
          where: { key_value: { key, value } },
          update: { value, type },
          create: { key, value, type },
        });

        upsertedTags.push(upsertedTag);
      } else {
        const upsertedTag = await this.prisma.tag.upsert({
          where: { name },
          update: { name, type },
          create: { name, type },
        });

        upsertedTags.push(upsertedTag);
      }
    }

    return upsertedTags;
  }

  async updateTag(params: {
    where: Prisma.TagWhereUniqueInput;
    data: Prisma.TagUpdateInput;
  }): Promise<Tag> {
    const { where, data } = params;
    return this.prisma.tag.update({
      data,
      where,
    });
  }

  async deleteTag(where: Prisma.TagWhereUniqueInput): Promise<Tag> {
    return this.prisma.tag.delete({
      where,
    });
  }
}
