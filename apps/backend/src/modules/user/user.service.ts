import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RoleService } from '@/modules/role/role.service';
import { RoleCode } from '@/common/enums/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
  ) {}
  async create(userDto: CreateUserDto) {

    const email = userDto.email.trim().toLowerCase();
    const username = userDto.username.trim();

    if(!email || !username) {
      throw new BadRequestException(
        'Username and email are required',
      );
    }

    const exists = await this.userRepository.findOne({
      where: [
        {email: email},
        {username: username},
        {username: email},
        {email: username},
      ],
    });


    if (exists) {
      throw new ConflictException(
        'User already exists'
      );
    }

    const role = await this.roleService.findByCode(RoleCode.PLAYER);

    if(!role) {
      throw new ConflictException(`Role ${RoleCode.PLAYER} does not exist`);
    }

    const passwordHash = await bcrypt.hash(
        userDto.password,
        10,
      );

    const user = this.userRepository.create({
        ...userDto,
        password: passwordHash,
        roles: [role],
      });

    return await this.userRepository.save(user);

  }

  async findOne(login: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: [
        {username: login},
        {email: login.toLowerCase()}
      ]
    });
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async updatePassword(
    userId: string,
    password: string,
  ) {
    const hash = await bcrypt.hash(password, 10);

    await this.userRepository.update(
      userId,
      {
        password: hash,
      },
    );
  }
}
