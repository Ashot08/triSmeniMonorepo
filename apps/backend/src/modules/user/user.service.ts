import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}
  async create(userDto: CreateUserDto) {
    // todo: сделать нормальный метод с хэширование пароля и проверками
    return await this.userRepository.save(userDto);
  }

  async findOne(login: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: [
        {username: login},
        {email: login.toLowerCase()}
      ]
    });
  }
}
