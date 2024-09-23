import AppDataSource from "../data-source";
import Team from "../entities/Team.entity";
import User from "../entities/User.entity";
import AppError from "../errors";
import { TTeamCreation, TTeamUpdate } from "../types/teams.types";

export async function createTeamService(userId:string, payload:TTeamCreation): Promise<Team> {
    
    const teamRepo = AppDataSource.getRepository(Team);
    const userRepo = AppDataSource.getRepository(User);

    const owner = await userRepo.findOneBy({ id: userId });
    if(!owner) throw new AppError("User not found", 404);

    const team = teamRepo.create({ ...payload, owner });
    return await teamRepo.save(team);
}

export async function updateTeamService(teamId:string, payload:TTeamUpdate) {

    const repo = AppDataSource.getRepository(Team);

    const team = await repo.findOneBy({ id: teamId });
    if(!team) throw new AppError("Team not found", 404);

    return await repo.save({ ...team, ...payload });
}



export async function getUserTeamsService(userId:string) {
    
}
