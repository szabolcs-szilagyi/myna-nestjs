import { EntityRepository, Repository } from "typeorm";
import { SessionToken } from "./entities/session-token.entity";

@EntityRepository(SessionToken)
export class SessionTokenRepository extends Repository<SessionToken> {
}
