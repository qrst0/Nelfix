import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { filmPrismaObj } from './dto/prisma-film.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';




@Injectable()
export class FilmsService {
  private client: S3Client;
  private bucketName = this.configService.get('S3_BUCKET_NAME');
  constructor(private readonly prisma: PrismaService, private readonly configService: ConfigService,) {
    const s3_region = this.configService.get('S3_REGION');
 
    if (!s3_region) {
      throw new Error('S3_REGION not found in environment variables');
    }
 
    this.client = new S3Client({
      region: s3_region,
      credentials: {
        accessKeyId: this.configService.get('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get('S3_SECRET_ACCESS_KEY'),
      },
      forcePathStyle: true,
    });
  }
  async create(createFilmDto: CreateFilmDto) {
    const result: filmPrismaObj =  await this.prisma.films.create({
      data: createFilmDto,
    });
    result.id = result.id.toString();
    if(!result.cover_image_url){
      result.cover_image_url = null;
    }
    return {
      status: "success",
      message: "Films successfully added",
      data: result
    };
  }

  async findAll(query: string) {
    const allFilms: filmPrismaObj[] = await this.prisma.films.findMany({
      where:{
        OR:[
          {
            title:{
              contains: query,
            }
          },
          {
            director:{
              contains: query,
            }
          }
        ]
      }
    });
    allFilms.forEach( (json) => {
      delete json.description;
      delete json.video_url;
      json.id = json.id.toString();
      if(!json.cover_image_url){
        json.cover_image_url = null;
      }
    });
    return {
      status: "success",
      message: 'Query success',
      data: allFilms
    };
  }

  async findOne(id: number) {
    const film: filmPrismaObj = await this.prisma.films.findUnique({
      where: { id },
    }); 
    if(!film){
      return {
        status: "error",
        message: 'Film doesn\'t exist',
        data: null
      }
    }
    film.id = film.id.toString();
    if(!film.cover_image_url){
      film.cover_image_url = null;
    }
    return {
      status: "success",
      message: 'Query success',
      data: film
    };
  }

  async update(id: number, updateFilmDto: CreateFilmDto) {
    const film = await this.prisma.films.findUnique({
      where: {id},
    });
    if(!film){
      return {
        status: "error",
        message: "Id doesn\'t exist",
        data: null
      };
    }
    updateFilmDto.video_url = updateFilmDto.video_url ? updateFilmDto.video_url : film.video_url;
    updateFilmDto.cover_image_url = updateFilmDto.cover_image_url ? updateFilmDto.cover_image_url : film.cover_image_url;
    const updatedFilm: filmPrismaObj = await this.prisma.films.update({
      where: {
        id,
      },
      data: updateFilmDto
    });
    updatedFilm.id = updatedFilm.id.toString();
    if(!updatedFilm.cover_image_url){
      updatedFilm.cover_image_url = null;
    }
    return {
      status: "success",
      message: "Films successfully updated",
      data: updatedFilm
    };
  }

  async remove(id: number) {
    const deleteFilm: filmPrismaObj = await this.prisma.films.delete({
      where: { id }
    });
    delete deleteFilm.cover_image_url;
    delete deleteFilm.price;
    delete deleteFilm.duration;
    deleteFilm.id = deleteFilm.id.toString();
    return {
      status: "success",
      message: "Film successfully deleted",
      data: deleteFilm
    }
  }

  async getBought(userId: number){
    const resp: filmPrismaObj[] = await this.prisma.films.findMany({
      where: {
        History:{
          some:{
            userId:{
              equals: userId
            }
          }
        }
      }
    });
    resp.forEach( (json) => {
      delete json.description;
      delete json.video_url;
      json.id = json.id.toString();
    });
    return resp;
  }

  async findGenre(genre: string){
    const allFilms: filmPrismaObj[] = await this.prisma.films.findMany({
      where:{
        genre:{
          has: genre,
        }
      }
    });
    allFilms.forEach( (json) => {
      delete json.description;
      delete json.video_url;
      json.id = json.id.toString();
    });
    return {
      status: "success",
      message: 'Query success',
      data: allFilms
    };
  }

  async uploadSingleFile({
    file,
    isPublic = true,
  }: {
    file: Express.Multer.File;
    isPublic: boolean;
  }) {
    try {
      const key = `${uuidv4()}`;
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: isPublic ? 'public-read' : 'private',
 
        Metadata: {
          originalName: file.originalname,
        },
      });
 
      const uploadResult = await this.client.send(command);
 
  
      return {
        url: isPublic
          ? (await this.getFileUrl(key)).url
          : (await this.getPresignedSignedUrl(key)).url,
        key,
        isPublic,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
 
  async getFileUrl(key: string) {
    return { url: `https://${this.bucketName}.s3.amazonaws.com/${key}` };
  }
 
 
 async getPresignedSignedUrl(key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
 
      const url = await getSignedUrl(this.client, command, {
        expiresIn: 60 * 60 * 24, // 24 hours
      });
 
      return { url };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteFile(key: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
 
      await this.client.send(command);
 
      return { message: 'File deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
