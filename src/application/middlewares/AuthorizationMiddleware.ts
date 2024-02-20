import { IData, IMiddleware, IResponse } from '../interfaces/IMiddleware';
import { IRequest } from '../interfaces/IRequest';
import { GetRolePermissionsUseCase } from '../useCases/GetRolePermissionsUseCase';

export interface IOptions {
  operator: 'OR' | 'AND';
}

export class AuthorizationMiddleware implements IMiddleware {
  constructor(
    private readonly requiredPermissions: string[],
    private readonly getRolePermissionsUseCase: GetRolePermissionsUseCase,
    private readonly options?: IOptions,
  ) {}

  async handle({ account }: IRequest): Promise<IResponse | IData> {
    if (!account) {
      return {
        statusCode: 403,
        body: {
          error: 'Access Denied.',
        },
      };
    }

    const { permissionsCodes } = await this.getRolePermissionsUseCase.execute({
      roleId: account.role,
    });

    const filterFn = this.options?.operator === 'AND' ? 'every' : 'some';
    const isAllowed = this.requiredPermissions[filterFn](code => (
      permissionsCodes.includes(code)
    ));

    if (!isAllowed) {
      return {
        statusCode: 403,
        body: {
          error: 'Access Denied.',
        },
      };
    }

    return {
      data: {},
    };
  }
}
