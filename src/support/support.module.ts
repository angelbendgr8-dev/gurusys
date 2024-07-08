import { Module } from '@nestjs/common';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PaginatorModule } from 'src/paginator/paginator.module';
import { Support, SupportSchema } from './schema/support.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Support.name, schema: SupportSchema }]),
    PaginatorModule,
  ],
  controllers: [SupportController],
  providers: [SupportService],
})
export class SupportModule {}
