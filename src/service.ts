import express from 'express';
import { readdir, readJSON } from 'fs-extra';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { join } from 'path';
import { resolver } from './resolve';

export type ServiceConfig = {
  port: string;
  proxy: {
    host: string;
  };
};

type ServiceConfigMap = {
  [key: string]: ServiceConfig;
};

export const serviceConfigMap: ServiceConfigMap = {};

export async function populateConfig(servicesDir: string) {
  const services = await readdir(servicesDir);

  // Load all service configs in parallel.
  const configs = services.map(async (name) => {
    serviceConfigMap[name] = await readJSON(
      join(servicesDir, name, 'config.json')
    );
  });

  await Promise.all(configs);

  console.log({ serviceConfigMap });
}

export function initializeApp(name: string, config: ServiceConfig) {
  const { port, proxy } = config;
  const app = express();

  app.use('*', resolver(name, config));

  if (proxy) {
    app.use(
      '*',
      createProxyMiddleware({
        target: proxy.host,
        changeOrigin: true,
      })
    );
  }

  app.listen(port);
  console.log(`Listening on ${port}`);

  return app;
}

export async function startServices() {
  await populateConfig('./moxxy');

  const apps = Object.keys(serviceConfigMap).map((service) =>
    initializeApp(service, serviceConfigMap[service])
  );
}
