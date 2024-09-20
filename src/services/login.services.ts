import { compareSync } from "bcryptjs";
import AppDataSource from "../data-source";
import User from "../entities/User.entity";
import AppError from "../errors";
import { TUserResponse } from "../types/users.types";
import { sign } from "jsonwebtoken";

interface ILoginPayload {
    email: string;
    password: string;
}
interface ILoginResponse {
    token: string;
    user: TUserResponse;
}

export const loginService = async ({ email, password }:ILoginPayload): Promise<ILoginResponse> => {

    const repo = AppDataSource.getRepository(User);

    const user = await repo.findOne({
        where: { email }, 
        relations: { details: true } 
    });
    if(!user) throw new AppError("User not found", 404);

    if(user.password && !compareSync(password, user.password))
        throw new AppError("Password does not match", 401)

    const token = sign( {},
        String(process.env.SECRET_KEY),
        {
            expiresIn: String(process.env.EXPIRES_IN),
            subject: user.id
        }
    )
    return { token, user }
}