import { Body, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async storeImage(userId, file) {
    if (!file) throw new ForbiddenException('No file provided');
    const image = await this.prisma.image.create({
      data: {
        filename: file.originalname,
        content: file.buffer.toString('base64'),
        contentType: file.mimetype,
        userId: userId,
      },
    });
    return image;
  }

  async getImage(id, numero, res) {
    const { pictures } = await this.prisma.user.findUnique({
      where: { id },
      select: { pictures: true },
    });
    if (!pictures[numero - 1])
      throw new ForbiddenException('No image found at the index: ' + numero);
    res.header('Content-Type', pictures[numero - 1].contentType);
    res.header('Content-Disposition', 'inline');
    res.send(Buffer.from(pictures[numero - 1].content, 'base64'));
  }

  async signup(@Body() dto: SignUpDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
        },
      });
      return { 'user created': { user } };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async getUser(id) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        pictures: {
          select: {
            id: true,
            filename: true,
          },
        },
      },
    });
    return user;
  }

  async getUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        pictures: {
          select: {
            id: true,
            filename: true,
          },
        },
      },
    });
    return users;
  }
}
