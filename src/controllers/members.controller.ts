import { Request, Response } from "express";
import MemebersService from "../services/members.services";
import { Controller, HttpMethod, Route, Middlewares } from "../decorators/api.decorators";
import authenticate from "../middlewares/authenticate.middleware";
import { authorizeMember, authorizeWorkspaceOwner } from "../middlewares/workspaces.middlewares";
import { passOne } from "../middlewares/utility.middlewares";
import { authorizeOwnUser } from "../middlewares/users.middlewares";

@Controller("/workspaces")
@Middlewares([authenticate])
export default class MemebersController {

    private service = new MemebersService();

    @HttpMethod("post")
    @Route("/:workspaceId/members/:email")
    @Middlewares([authorizeWorkspaceOwner])
    public invite = async (req:Request, res:Response) => {
        await this.service.inviteMember(req.params.email, req.params.workspaceId);
        return res.status(204).send();
    }

    @HttpMethod("post")
    @Route("/:workspaceId/members")
    public acceptInvite = async (req:Request, res:Response) => {
        await this.service.acceptInvite(req.params.workspaceId, res.locals.userId);
        return res.status(204).send();
    }

    @HttpMethod("get")
    @Route("/:workspaceId/members")
    @Middlewares([authorizeMember])
    public getByWorkspace = async (req:Request, res:Response) => {
        const members = await this.service.findAll({ 
            where: { workspaceId: req.params.workspaceId },
            relations: { user: true }
        });
        return res.status(200).json(members);
    }

    @HttpMethod("delete")
    @Route("/:workspaceId/members/:userId")
    @Middlewares([passOne(authorizeWorkspaceOwner, authorizeOwnUser)])
    public remove = async (req:Request, res:Response) => {
        await this.service.deleteByFks(req.params.workspaceId, req.params.userId);
        return res.status(204).send();
    }
}
