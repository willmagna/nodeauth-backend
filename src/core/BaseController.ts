import { Request, Response } from "express";

export abstract class BaseController {
  protected abstract execute(req: Request, res: Response): Promise<void>;

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      await this.execute(req, res);
    } catch (error) {
      console.error("🔥 Controller Error:", error);
      this.fail(res, error);
    }
  }

  public ok<T>(res: Response, dto?: T) {
    if (dto) {
      res.status(200).json(dto);
    } else {
      res.sendStatus(200);
    }
  }

  public created<T>(res: Response, dto?: T) {
    if (dto) {
      res.status(201).json(dto);
    } else {
      res.sendStatus(201);
    }
  }

  public noContent(res: Response) {
    return res.sendStatus(204);
  }

  public badRequest(res: Response, message = "Bad Request") {
    return res.status(400).json({ message });
  }

  public unauthorized(res: Response, message = "Unauthorized") {
    return res.status(401).json({ message });
  }

  public notFound(res: Response, message = "Not Found") {
    return res.status(404).json({ message });
  }

  public conflict(res: Response, message = "Conflict") {
    return res.status(409).json({ message });
  }

  public fail(res: Response, error: any) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
}
