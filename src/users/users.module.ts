import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { PaginatorModule } from 'src/paginator/paginator.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
    CloudinaryModule,
    PaginatorModule,
    NestjsFormDataModule,
  ],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
