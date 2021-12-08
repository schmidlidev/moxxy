import { NextFunction, Request, Response } from 'express';
import { pathExists, readJson } from 'fs-extra';
import { join } from 'path';
import { ServiceConfig } from './service';

const root = './moxxy';

export function resolver(name: string, config: ServiceConfig) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { method, baseUrl } = req;
    console.log(`Resolving ${method.toUpperCase()} ${baseUrl}`);

    const filepath = join(
      root,
      name,
      'routes/',
      `${baseUrl}.${method.toLowerCase()}.json`
    );
    console.log({ filepath });
    const exists = await pathExists(filepath);

    if (exists) {
      res.send(await readJson(filepath));
    } else {
      next();
    }
  };
}
