import { randomUUID } from 'crypto';
import { User } from 'src/models/user.interface';
import { DatabaseService } from './database.service';

// HandMade Custom Orm

export class CustomOrm {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly table: string,
  ) {
    this.table = table;
  }

  getById(id: string, table = this.table): object {
    const dbData = this.databaseService.getDatabase()[table] || [];
    return dbData.find((d) => d.id === id);
  }

  getAll(table = this.table): Array<object> {
    const data = this.databaseService.getDatabase()[table] || [];
    return data;
  }

  setData(data, table = this.table) {
    this.databaseService.set(table, data);
    return true;
  }

  insertOne(data, table = this.table): object {
    const uuid: string = randomUUID();
    data.id = uuid;
    this.databaseService.insert(table, data);
    return data;
  }

  updateOne(id: string, updateData: any, table = this.table): object {
    let tableData = this.databaseService.getDatabase()[table] || [];
    tableData = tableData.map((data) =>
      data.id === id ? { ...data, ...updateData } : data,
    );
    this.databaseService.set(table, tableData);
    return this.getById(id);
  }

  deleteOne(id: string, table = this.table): boolean {
    let tableData = this.databaseService.getDatabase()[table] || [];
    tableData = tableData.filter((data) => data.id !== id).map((data) => data);
    this.databaseService.set(table, tableData);
    return true;
  }

  deleteMany(filter: object, table = this.table) {
    let tableData = this.databaseService.getDatabase()[table] || [];
    tableData = tableData.filter(filter).map((data) => data);
    this.databaseService.set(table, tableData);
    return true;
  }

  isUUID(str: string): boolean {
    const pattern =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return pattern.test(str);
  }

  // UserSpecific Layer
  createUser(UserData): any {
    const { login, password } = UserData;
    const match = this.databaseService.findMatching('users', 'login', login);

    if (match) {
      return { success: false, error: 'Login already taken!' };
    }

    const uuid = randomUUID();
    const userData = {
      id: uuid,
      login,
      password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.databaseService.insert('users', userData);

    return this.deepClone({ success: false, data: userData });
  }

  updateUser(user: User): boolean {
    try {
      let users = this.databaseService.get('users');

      user.updatedAt = Date.now();
      user.version = user.version + 1;

      users = users.map((usr: User) =>
        usr.id === user.id ? { ...usr, ...user } : usr,
      );
      this.databaseService.set('users', users);
      return true;
    } catch (error) {
      console.log('Error: ', error);
      return false;
    }
  }

  deepClone(data) {
    return data ? JSON.parse(JSON.stringify(data)) : null;
  }
}
