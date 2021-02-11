import {PermissionKeys} from './authorization/permission-keys';

export interface IRequiredPermissions {
  required: PermissionKeys[];
}

export interface MyUserProfile {
  id: string;
  nickname: string;
  permissions: PermissionKeys[];
}
