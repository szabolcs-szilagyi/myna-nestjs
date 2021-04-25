import { EntityRepository, Repository } from "typeorm";
import { LoginToken } from "./entities/login-token.entity";

@EntityRepository(LoginToken)
export class LoginTokenRepository extends Repository<LoginToken> {}
