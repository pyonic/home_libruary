import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from 'src/database/database.service';
import { User } from 'src/models/user.interface';

@Injectable()
export class UserService {
  constructor (private readonly databaseService: DatabaseService) {}
  
  getUsers(): any {
    const users = this.databaseService.get('users');
    return  users
  }

  isUUID(str: string): boolean {
    const pattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return pattern.test(str);
  }

  updateUser(user: User): boolean {
    try {
        let users = this.databaseService.get('users');
        
        user.updatedAt = Date.now();
        
        users = users.map((usr: User) => usr.id === user.id ? user : usr)
        this.databaseService.set('users', users);
        return true;
    } catch (error) {
        console.log('Error: ', error);
        return false
    }
  }

  delete(user: any): boolean {
    try {
        let users = this.databaseService.get('users');
        
        user.updatedAt = Date.now();
        
        users = users.filter(d => d.id !== user.id).map((usr: User) => usr)
        this.databaseService.set('users', users);
        return true;
    } catch (error) {
        console.log('Error: ', error);
        return false
    }
  }

  getUser(id: string): any {
    const users = this.databaseService.get('users') || [];
    const user = users.find(u => u.id === id);
    return  { data: user }
  }

  createUser(UserData): any {
    const { login, password } = UserData;
    const match = this.databaseService.findMatching('users', 'login', login);
    
    if (match) {
        return { success: false, error: 'Login already taken!' } 
    }

    const uuid = randomUUID();
    const userData = {
        id: uuid,
        login,
        password,
        version: 1,
        createdAt: Date.now(),
        updatedAt: Date.now()
    }
    this.databaseService.insert('users', userData);
    return { success: false, data: userData };
  }
}
