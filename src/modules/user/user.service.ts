import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { hashPassword } from '../../utils/hash-password';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationType } from '../../utils/optional-query';
import { convertBooleanObject } from '../../utils/optional-query';
import { IncludeUserType } from './types/Include-user.type';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private readonly logger: Logger) {}

  getIncludeUser(obj: any) {
    const {
      broker,
      company,
      comments_project,
      comments_Broker,
      comments_Company,
      comments_Property,
      properties,
    } = obj;

    return convertBooleanObject({
      broker,
      company,
      comments_project,
      comments_Broker,
      comments_Company,
      comments_Property,
      properties,
    });
  }

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    optional = {},
  ): Promise<User | null> {
    try {
      const include = this.getIncludeUser(optional);

      return this.prisma.user.findUnique({
        where: userWhereUniqueInput,
        include,
      });
    } catch (error) {
      this.logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  async users(
    params: {
      where?: Prisma.UserWhereInput;
    },
    optional: IncludeUserType<
      Prisma.UserWhereUniqueInput,
      Prisma.UserOrderByInput
    >,
  ): Promise<User[]> {
    try {
      const { where } = params;
      const { skip, take, cursor, orderBy, ...rest } = optional;

      const include = this.getIncludeUser(rest);

      return this.prisma.user.findMany({
        skip: Number(skip) || undefined,
        take: Number(take) || undefined,
        cursor,
        where,
        orderBy,
        include,
      });
    } catch (error) {
      this.logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  async createUser(data: CreateUserDto): Promise<any> {
    try {
      const { username, password: rawPassword, fullName, role } = data;
      const existedUser = await this.user({ username });

      if (existedUser) throw new Error('Username already exist');

      const passwordHashed = await hashPassword(rawPassword);

      return this.prisma.user.create({
        data: {
          username,
          password: passwordHashed,
          fullName,
          role,
        },
      });
    } catch (error) {
      this.logger.error(`${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: UpdateUserDto;
  }): Promise<User> {
    try {
      const { where, data } = params;
      const existedUser = await this.user({ id: where.id });

      if (!existedUser) throw new Error('Accout Not Found');

      const passwordHashed = await hashPassword(data.password);

      return this.prisma.user.update({
        data: {
          ...data,
          password: passwordHashed,
        },
        where,
      });
    } catch (error) {
      this.logger.error(`${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<any> {
    try {
      const existedUser = await this.user(where);

      if (!existedUser) throw new Error('Accout Not Found');

      await this.prisma.user.delete({
        where,
      });

      return true;
    } catch (error) {
      this.logger.error(`${error.message}`);
      throw new BadRequestException(error.message);
    }
  }
}
