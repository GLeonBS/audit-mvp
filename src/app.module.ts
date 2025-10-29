import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditModule } from './modules/audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5450,
      username: 'postgres',
      password: 'postgres',
      database: 'audit_mvp',
      autoLoadEntities: true,
      synchronize: true,
    }),
    MongooseModule.forRoot('mongodb://localhost:28017/audit_mvp'),
    UserModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
