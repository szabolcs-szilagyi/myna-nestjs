import { EntityRepository, Repository } from "typeorm";
import { NewsletterEntity } from "./entities/newsletter.entity";

@EntityRepository(NewsletterEntity)
export class NewsletterRepository extends Repository<NewsletterEntity> {}
