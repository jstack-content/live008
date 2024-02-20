import { AuthorizationMiddleware, IOptions } from '../application/middlewares/AuthorizationMiddleware';
import { makeGetRolePermissionsUseCase } from './makeGetRolePermissionsUseCase';

export function makeAuthorizationMiddleware(requiredPermissions: string[], options?: IOptions) {
  return new AuthorizationMiddleware(
    requiredPermissions,
    makeGetRolePermissionsUseCase(),
    options,
  );
}
