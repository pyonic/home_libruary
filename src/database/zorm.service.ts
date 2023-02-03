import { randomUUID } from "crypto";
import { DatabaseService } from "./database.service";

// HandMade Custom Orm

export class CustomOrm {
    constructor (private readonly databaseService: DatabaseService, private readonly table: string) {
        this.table = table;
    }

    getById(id: string, table = this.table): object {
        const dbData = this.databaseService.getDatabase()[table] || [];
        return dbData.find(d => d.id === id);
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
        tableData = tableData.map(data => data.id === id ? { ...data, ...updateData } : data);
        this.databaseService.set(table, tableData);
        return this.getById(id);
    }

    deleteOne(id: string, table = this.table): boolean {
        let tableData = this.databaseService.getDatabase()[table] || [];
        tableData = tableData.filter(data => data.id !== id).map(data => data);
        this.databaseService.set(table, tableData);
        return true;
    }

    deleteMany(filter: object, table = this.table) {
        let tableData = this.databaseService.getDatabase()[table] || [];
        tableData = tableData.filter(filter).map(data => data);
        this.databaseService.set(table, tableData);
        return true;
    }

    isUUID(str: string): boolean {
        const pattern: RegExp = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        return pattern.test(str);
    }
}