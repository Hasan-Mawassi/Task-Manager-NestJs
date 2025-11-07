import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { User } from "./entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypedConfigService } from "src/config/typed-config.service";
import { AuthConfig } from "src/config/auth.config";
import { PasswordService } from "./password/password.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: TypedConfigService): JwtModuleOptions => ({
        secret: configService.get<AuthConfig>("auth")?.jwt.secret,
        signOptions: {
          expiresIn: Number(configService.get<AuthConfig>("auth")?.jwt.expiresIn),
        },
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, PasswordService],
})
export class UsersModule {}
