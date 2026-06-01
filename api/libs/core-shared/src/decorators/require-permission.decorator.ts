import { SetMetadata } from '@nestjs/common';

export type PermissionAction = 'read' | 'edit' | 'delete';

export interface RequiredPermission {
  module: string;
  action: PermissionAction;
}

export const PERMISSION_KEY = 'required_permission';

export const RequirePermission = (module: string, action: PermissionAction) =>
  SetMetadata(PERMISSION_KEY, { module, action } satisfies RequiredPermission);
