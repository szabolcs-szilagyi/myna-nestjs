import { EntityRepository } from "typeorm";
import { ClientEntity } from "./client.entity";

@EntityRepository(ClientEntity)
export class ClientRepository {
}
