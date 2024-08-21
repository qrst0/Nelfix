import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { userPrismaObj } from './dto/prisma-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const userCheckEmail = await this.prisma.users.findUnique({
      where: {email: createUserDto.email}
    });
    const userCheckUsername = await this.prisma.users.findUnique({
      where: {username: createUserDto.username}
    });
    if(userCheckEmail || userCheckUsername){
      throw new BadRequestException('Username/email has been registered!');
    }
    return await this.prisma.users.create({
      data: createUserDto,
    });
  }

  async findAll(query: string) {
    const allUsers: userPrismaObj[] = await this.prisma.users.findMany({
      where:{
          username:{
            contains: query,
          }
      }
    });
    allUsers.forEach( (json) => {
      delete json.password;
      delete json.createdAt;
      delete json.updatedAt;
      delete json.fullname;
      delete json.admin;
      json.id = json.id.toString();
    });
    return {
      status: "success",
      message: 'Query success',
      data: allUsers
    }
  }

  async getAdminStatus(id: number){
    const user = await this.prisma.users.findUnique({
      where: { id },
    }); 
    return user.admin;
  }

  async findOne(id: number) {
    const user: userPrismaObj = await this.prisma.users.findUnique({
      where: { id },
    }); 
    if(!user){
      return {
        status: "error",
        message: 'User doesn\'t exist',
        data: null
      }
    }
    delete user.createdAt;
    delete user.updatedAt;
    delete user.password;
    delete user.fullname;
    delete user.admin;
    user.id = user.id.toString();
    return {
      status: "success",
      message: 'Query success',
      data: user
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    const deleteUser: userPrismaObj = await this.prisma.users.delete({
      where: { id },
    });
    delete deleteUser.password;
    delete deleteUser.createdAt;
    delete deleteUser.updatedAt;
    delete deleteUser.fullname;
    delete deleteUser.admin;
    deleteUser.id = deleteUser.id.toString();
    return {
      status: "success",
      message: "User successfully deleted",
      data: deleteUser
    }
  }

  // added
  async findWithUsername(username: string){
    return await this.prisma.users.findUnique({
      where: { username: username },
    }); 
  }

  async increment(id: number, increment: number){
    const user = await this.prisma.users.findUnique({
      where: { id },
    }); 
    if(!user){
      return {
        status: "error",
        message: 'User doesn\'t exist',
        data: null
      }
    }
    const updatedUser: userPrismaObj = await this.prisma.users.update({
      where: {
        id,
      },
      data: {
        balance: {
          increment: increment
        }
      }
    });
    delete updatedUser.createdAt;
    delete updatedUser.updatedAt;
    delete updatedUser.password;
    delete updatedUser.admin;
    delete updatedUser.fullname;
    updatedUser.id = updatedUser.id.toString();
    return {
      status: "success",
      message: 'Query success',
      data: updatedUser
    }
  }

  async findWithEmail(email: string){
    return await this.prisma.users.findUnique({
      where:{
       email 
      }
    });
  }
}
