import AppDataSource from "../data-source";
import User from "../entities/User.entity";
import AppError from "../errors";

export async function getNotificationsService(userId:string) {
    
    const repo = AppDataSource.getRepository(User);
    
    const user = await repo.findOne({ 
        where: { id: userId },
        relations: { notifications: true } 
    })
    console.log("\n\n\n\n\PIMBAAAAAAAAAAAA\n\n\n\n\n");
    if(!user) throw new AppError("User not found", 404);

    return user.notifications || [];
}