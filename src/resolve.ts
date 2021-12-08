import { NextFunction, Request, Response } from 'express';
import { pathExists, readJson } from 'fs-extra';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { join } from 'path';

/*
 * Resolvers are Express middleware that resolve a request to a response.
 */

export function fileResolver(routesDirectory: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { method, baseUrl } = req;
    console.log(`Resolving ${method.toUpperCase()} ${baseUrl}`);

    const filepath = join(
      routesDirectory,
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

export function proxyResolver(host: string) {
  return createProxyMiddleware({
    target: host,
    changeOrigin: true,
  });
}
