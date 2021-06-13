import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";
import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder()
      .select("*")
      .where("title ilike :title", { title: `%${param}%` })
      .getRawMany() as unknown as Game[];
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("SELECT COUNT(0) FROM games"); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return (await this.repository
      .createQueryBuilder("games")
      .innerJoinAndSelect("games.users", "users")
      .select([
        "users.email AS email",
        "users.first_name AS first_name",
        "users.last_name AS last_name",
      ])
      .where("games.id=:id", { id })
      .getRawMany()) as unknown as User[];
  }
}
