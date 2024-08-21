import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query() queryGet: Record<string, any>) {
    const query = queryGet.q || "";
    try{
      return await this.usersService.findAll(query);
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
      return await this.usersService.findOne(+id);
    } catch(error){
      return {
        status: "error",
        message: "Unexpected error",
        data: null
      }
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try{
      return await this.usersService.remove(+id);
    }catch(error){
      return {
        status: "error",
        message: "Unexpected error",
        data: null
      }
    }
  }

  @Post(':id/balance')
  async increment(@Param('id') id: string, @Body() incrementDto: Record<string, any>){
    try{
      return await this.usersService.increment(+id, +incrementDto.increment);
    } catch(error){
      return {
        status: "error",
        message: "Unexpected error",
        data: null
      } 
    }
  }
}
