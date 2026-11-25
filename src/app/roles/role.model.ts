export type Permission =
  | 'manage-users'
  | 'manage-roles'
  | 'create-request'
  | 'approve-request';

export interface Role {
  name: string;
  permissions: Permission[];
}