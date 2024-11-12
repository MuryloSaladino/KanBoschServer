import { Request, Response } from "express";
import CardListsService from "../services/cardList.services";
import { Controller, ControllerMiddlewares, HttpMethod, Route, RouteMiddlewares } from "../decorators/api.decorators";
import authenticate from "../middlewares/authenticate.middleware";
import { authorizeByBoardRole } from "../middlewares/boards.middlewares";


@Controller("/card-lists")
@ControllerMiddlewares([authenticate])
export default class CardListsController {

    private service = new CardListsService();

    @HttpMethod("post")
    @Route("/boards/:boardId")
    @RouteMiddlewares([authorizeByBoardRole(["Editor", "Owner"])])
    public create = async (req:Request, res:Response) => {
        const cardList = await this.service.create({
            boardId: req.params.boardId, 
            ...req.body
        });
        return res.status(201).json(cardList);
    }

    @HttpMethod("get")
    @Route("/boards/:boardId")
    @RouteMiddlewares([authorizeByBoardRole(["Reader", "Editor", "Owner"])])
    public getByBoard = async (req:Request, res:Response) => {
        const cardLists = await this.service.findAll({
            relations: { cards: true },
            where: { boardId: req.params.boardId },
        });
        return res.status(200).json(cardLists);
    }

    @HttpMethod("put")
    @Route("/:cardListId")
    @RouteMiddlewares([authorizeByBoardRole(["Editor", "Owner"])])
    public update = async (req:Request, res:Response) => {
        const cardList = await this.service.update(req.params.cardListId, req.body);
        return res.status(200).json(cardList);
    }

    @HttpMethod("delete")
    @Route("/:cardListId")
    @RouteMiddlewares([authorizeByBoardRole(["Editor", "Owner"])])
    public delete = async (req:Request, res:Response) => {
        await this.service.delete(req.params.cardListId);
        return res.status(204).send();
    }
}
