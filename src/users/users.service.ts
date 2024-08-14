import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
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
    if(userCheckEmail || userCheckEmail){
      throw new BadRequestException('Username atau email sudah terdaftar!');
    }
    return await this.prisma.users.create({
      data: createUserDto,
    });
  }

  async findAll() {
    return await this.prisma.users.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.users.findUnique({
      where: { id },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return await this.prisma.users.delete({
      where: { id },
    });
  }

  // added
  async findWithUsername(username: string){
    return await this.prisma.users.findUnique({
      where: { username: username },
    }); 
  }
}
