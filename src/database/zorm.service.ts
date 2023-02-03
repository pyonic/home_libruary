import { randomUUID } from "crypto";
import { DatabaseService } from "./database.service";

export class CustomOrm {
    constructor (private readonly databaseService: DatabaseService, private readonly table: string) {
        this.table = table;
    }

    getById(id: string): object {
        const dbData = this.databaseService.getDatabase()[this.table] || [];
        return dbData.find(d => d.id === id);
    }

    getAll(): Array<object> {
        const data = this.databaseService.getDatabase()[this.table] || [];
        return data;
    }

    setData(data) {
        this.databaseService.set(this.table, data);
        return true;
    }

    insertOne(data): object {
        const uuid: string = randomUUID();
        data.id = uuid;
        this.databaseService.insert(this.table, data);
        return data;
    }

    updateOne(id: string, updateData: any): object {
        let tableData = this.databaseService.getDatabase()[this.table] || [];
        tableData = tableData.map(data => data.id === id ? { ...data, ...updateData } : data);
        this.databaseService.set(this.table, tableData);
        return this.getById(id);
    }

    deleteOne(id: string): boolean {
        let tableData = this.databaseService.getDatabase()[this.table] || [];
        tableData = tableData.filter(data => data.id !== id).map(data => data);
        this.databaseService.set(this.table, tableData);
        return true;
    }

    deleteMany(filter: object) {
        let tableData = this.databaseService.getDatabase()[this.table] || [];
        tableData = tableData.filter(filter).map(data => data);
        this.databaseService.set(this.table, tableData);
        return true;
    }

    isUUID(str: string): boolean {
        const pattern: RegExp = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        return pattern.test(str);
    }
}