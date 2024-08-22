import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Put, Query } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';



@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'video', maxCount: 1 },
    { name: 'cover_image', maxCount: 1 },
  ]))
  async create(@UploadedFiles() files: { video?: Express.Multer.File[], cover_image?: Express.Multer.File[] }, @Body() body) {
    try{
      const { url } = await this.filmsService.uploadSingleFile({file: files.video[0], isPublic: true});
      const blobVid = url;
      let blobImg = '';
      if(files.cover_image?.length){
        const { url } = await this.filmsService.uploadSingleFile({file: files.cover_image[0], isPublic: true});
        blobImg = url;
      }
      const newstr = body.genre.toString();

      const genre = newstr.split(',');
      const title = body.title;
      const description = body.description;
      const director = body.director;
      const release_year = parseInt(body.release_year);
      const price = parseInt(body.price);
      const duration = parseInt(body.duration);
      return await this.filmsService.create({title, description, director, release_year, genre, price, duration, video_url: blobVid, cover_image_url: blobImg});
    } catch(error){
      return {
        status: "error",
        message: "Unexpected error",
        data: null
      }
    }
  }

  @Get()
  async findAll(@Query() queryGet: Record<string, any>) {
    try{
      const query = queryGet.q || "";
      return await this.filmsService.findAll(query);
    } catch(error){
      return {
        status: "error",
        message: "Unexpected error",
        data: null
      }
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try{
      return await this.filmsService.findOne(+id);
    } catch(error){
      return {
        status: "error",
        message: "Unexpected error",
        data: null
      }
    }
  }

  @Put(':id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'video', maxCount: 1 },
    { name: 'cover_image', maxCount: 1 },
  ]))
  async update(@Param('id') id: string, @UploadedFiles() files: { video?: Express.Multer.File[], cover_image?: Express.Multer.File[] }, @Body() body) {
    try{
      const respFilm = await this.filmsService.findOne(+id);
      const film = respFilm.data;
      let url = '';
      var prevVid = film.video_url.substring(film.video_url.lastIndexOf('/') + 1);
      if(files.video){
        ({ url } = await this.filmsService.uploadSingleFile({file: files.video[0], isPublic: true}) );
        const deleteResp = await this.filmsService.deleteFile(prevVid);
      }
      var prevImg = film.cover_image_url ? film.cover_image_url.substring(film.cover_image_url.lastIndexOf('/') + 1) : '';
      const blobVid = url;
      let blobImg = '';
      if(files.cover_image){
        const { url } = await this.filmsService.uploadSingleFile({file: files.cover_image[0], isPublic: true});
        blobImg = url;
        if(prevImg){
          const deleteResp = await this.filmsService.deleteFile(prevImg);
        }
      }
      
      const newstr = body.genre.toString();

      const genre = newstr.split(',');
      const title = body.title;
      const description = body.description;
      const director = body.director;
      const release_year = parseInt(body.release_year);
      const price = parseInt(body.price);
      const duration = parseInt(body.duration);
      
      return await this.filmsService.update(+id, {title, description, director, release_year, genre, price, duration, video_url: blobVid, cover_image_url: blobImg});
    } catch(error){
      return {
        status: "error",
        message: "Unexpected error",
        data: null
      }
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try{
      return await this.filmsService.remove(+id);
    } catch (error){
      return {
        status: "error",
        message: "Unexpected error",
        data: null
      }
    }
  }
}
