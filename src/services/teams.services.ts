import AppDataSource from "../data-source";
import Member from "../entities/Member.entity";
import Team from "../entities/Team.entity";
import User from "../entities/User.entity";
import AppError from "../errors";
import { TTeamCreation, TTeamUpdate } from "../types/teams.types";

export async function createTeamService(userId:string, payload:TTeamCreation): Promise<Team> {
    
    const teamRepo = AppDataSource.getRepository(Team);
    const userRepo = AppDataSource.getRepository(User);
    const memberRepo = AppDataSource.getRepository(Member);

    const owner = await userRepo.findOneBy({ id: userId });
    if(!owner) throw new AppError("User not found", 404);

    const team = teamRepo.create({ ...payload, owner });
    const savedTeam = await teamRepo.save(team);

    const firstMember = memberRepo.create({ user: owner, team: savedTeam });
    await memberRepo.save(firstMember);

    return savedTeam;
}

export async function getTeamService(teamId:string) {

    const repo = AppDataSource.getRepository(Team);

    const found = await repo.findOne({
        where: { id: teamId },
        relations: { members: { user: { details: true } } }
    });
    if(!found) throw new AppError("Team not found", 404);
    
    return found;
}

export async function getTeamsByUserService(userId:string) {
    return await AppDataSource.getRepository(Team)
        .createQueryBuilder("t")
        .innerJoin(Member, "m", "t.id = m.teamId")
        .innerJoin(User, "u", "u.id = m.userId")
        .where("u.id = :userId", { userId })
        .getMany()
}

export async function updateTeamService(teamId:string, payload:TTeamUpdate) {

    const repo = AppDataSource.getRepository(Team);

    const team = await repo.findOneBy({ id: teamId });
    if(!team) throw new AppError("Team not found", 404);

    return await repo.save({ ...team, ...payload });
}

export async function deleteTeamService(teamId:string) {
    
    const repo = AppDataSource.getRepository(Team);

    const team = await repo.findOneBy({ id: teamId });
    if(!team) throw new AppError("Team not found", 404);

    await repo.save({ ...team, deletedAt: new Date() });
}
