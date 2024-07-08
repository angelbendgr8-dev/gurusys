import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy,'local') {
  constructor(private authService: AuthService) {
    super();
  }
  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUserWithPassword(
      username,
      password,
    );
    console.log('user');
    if (!user || user.isActive === false) {
      throw new UnauthorizedException('user not found');
    }
    return user;
  }
}
