import express from 'express';
import { readdir, readJSON } from 'fs-extra';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { join } from 'path';
import { MoxxyConfig } from './config';
import { resolver } from './resolve';

type ServiceConfig = {
  port: string;
  proxy: {
    host: string;
  };
};

function initializeApp(
  name: string,
  config: ServiceConfig,
  moxxyConfig: MoxxyConfig
) {
  const { port, proxy } = config;
  const app = express();

  const routesDirectory = join(moxxyConfig.servicesDirectory, name, 'routes/');
  app.use('*', resolver(routesDirectory));

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

async function loadServiceConfig(
  name: string,
  servicesDirectory: string
): Promise<ServiceConfig> {
  // TODO: Validate config
  return await readJSON(join(servicesDirectory, name, 'config.json'));
}

async function startService(name: string, moxxyConfig: MoxxyConfig) {
  const serviceConfig = await loadServiceConfig(
    name,
    moxxyConfig.servicesDirectory
  );

  initializeApp(name, serviceConfig, moxxyConfig);
}

export async function startServices(config: MoxxyConfig) {
  const serviceNames = await readdir(config.servicesDirectory);

  // Initialize services in parallel.
  await Promise.all(
    serviceNames.map(async (name) => startService(name, config))
  );
  console.log('Initialized services.');
}
