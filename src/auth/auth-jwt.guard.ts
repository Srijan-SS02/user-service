import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { AuthGuard, IAuthGuard } from '@nestjs/passport';
  import { JwtService } from '@nestjs/jwt'
  import { Reflector } from '@nestjs/core';
  
  @Injectable()
  export class JwtAuthGuard extends AuthGuard('jwt') implements IAuthGuard {
    constructor(
        private reflector: Reflector,
    ) { super() }

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        let isAllowed = false;
        const request: Request = context.switchToHttp().getRequest();
        try {
            const tokenRoles: string[] = request['user']['roles'];
            for(let role of roles){
                if(tokenRoles.indexOf(role) > -1){
                    isAllowed = true;
                    break;
                }
            }   
        } catch (error) {
            console.log({err: error});
            isAllowed = false;
        }
        return isAllowed;
    }
  
    handleRequest(err, user, info) {
        console.log({handleRequest: info, error: err, user: user})
      return user;
    }
  }