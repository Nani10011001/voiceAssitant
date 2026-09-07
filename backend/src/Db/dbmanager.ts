import mongodbSerive from "./dbconnection.js";

interface DatabaseType {
    connect: () => Promise<void>;
}
interface DatabaseService {
    mongodb: mongodbSerive
}
export class DbManager implements DatabaseType {
    constructor(private readonly dbService: DatabaseService) {}

    async connect(): Promise<void> {
        await this.dbService.mongodb.connect();
    }
}