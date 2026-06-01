import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PERMISSION_KEY, RequiredPermission } from '../decorators/require-permission.decorator';
import { TOKEN_PAYLOAD } from '../constant/auth.constant';

type PermissionFlags = { r: boolean; e: boolean; d: boolean };
type PermissionsMap = Record<string, PermissionFlags>;

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<RequiredPermission | undefined>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required) return true;

    const request = context.switchToHttp().getRequest<Record<string, unknown>>();
    const payload = request[TOKEN_PAYLOAD] as
      | { permissions?: PermissionsMap; scope?: string }
      | undefined;

    if (!payload || payload.scope !== 'authenticated') {
      throw new ForbiddenException(
        'Acesso restrito a sessões autenticadas com empresa selecionada.',
      );
    }

    const flags = payload.permissions?.[required.module];
    if (!flags) {
      throw new ForbiddenException(`Sem permissão de acesso ao módulo ${required.module}.`);
    }

    const actionMap: Record<string, keyof typeof flags> = {
      read: 'r',
      edit: 'e',
      delete: 'd',
    };

    if (!flags[actionMap[required.action]]) {
      throw new ForbiddenException(
        `Sem permissão de ${required.action} no módulo ${required.module}.`,
      );
    }

    return true;
  }
}
