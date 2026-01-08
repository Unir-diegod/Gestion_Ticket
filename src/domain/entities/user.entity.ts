import { UserRole } from '../value-objects/user-role.vo';

export class User {
  private _name: string;
  private _role: UserRole;
  private _passwordHash: string;

  constructor(
    public readonly id: number,
    public readonly email: string,
    name: string,
    role: UserRole,
    passwordHash: string,
  ) {
    this._name = name;
    this._role = role;
    this._passwordHash = passwordHash;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    if (!value || value.trim().length < 2) {
      throw new Error('Invalid user name');
    }
    this._name = value.trim();
  }

  get role(): UserRole {
    return this._role;
  }

  set role(value: UserRole) {
    this._role = value;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  set passwordHash(value: string) {
    if (!value) {
      throw new Error('Invalid password hash');
    }
    this._passwordHash = value;
  }

  changeRole(newRole: UserRole) {
    this.role = newRole;
  }
}
