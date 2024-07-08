import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'user') {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY,
    });
  }
  async validate(payload: any) {
    // console.log(payload);
    const user = await this.userService.findUserById(payload.sub);
    return user;
  }
}
