import { Injectable } from '@nestjs/common';
import { User } from 'src/models/user.interface';

@Injectable()
export class DatabaseService {
    private readonly data: Object = {};

    getDatabase() {
        return this.data;
    }

    get(table: string) {
        return this.data[table] || [];
    }

    set(table: string, data: Array<User>) {
        this.data[table] = data;
        return this.data[table] || [];
    }

    insert(table: string, data: object) {
        if (!this.data[table]) this.data[table] = []
        this.data[table].push(data);
    }

    findMatching(table, key, value) {
        const data: Array<any> = this.data[table] || [];
        const matching: object = data.find(dt => dt[key] === value);
        return matching;
    }
}