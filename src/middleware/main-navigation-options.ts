import { NextFunction, Request, Response } from "express";

export default async function (req: Request, res: Response, next: NextFunction) {
    const mainNavigation: any = [];

    if (req.oidc?.isAuthenticated()) {
        mainNavigation.push({
            href: "/logout",
            text: "Sign Out"
        })
    }
    res.locals.mainNavigation = mainNavigation

    next();
};