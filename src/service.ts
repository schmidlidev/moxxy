import express from 'express';
import { readdir, readJSON } from 'fs-extra';
import { join } from 'path';
import { moxxyConfig } from './config';
import { fileResolver, proxyResolver } from './resolve';

type ServiceConfig = {
  port: string;
  proxy: {
    host: string;
  };
};

function initializeApp(name: string, config: ServiceConfig) {
  const { port, proxy } = config;
  const app = express();

  const routesDirectory = join(moxxyConfig.moxxyDir, name, 'routes/');
  app.use('*', fileResolver(routesDirectory));

  if (proxy) {
    app.use('*', proxyResolver(proxy.host));
  }

  app.listen(port);
  console.log(`${name} listening on port ${port}`);
}

async function loadServiceConfig(name: string): Promise<ServiceConfig> {
  // TODO: Validate config
  return await readJSON(join(moxxyConfig.moxxyDir, name, 'config.json'));
}

async function startService(name: string) {
  console.log(`Starting service: ${name}`);
  const serviceConfig = await loadServiceConfig(name);

  initializeApp(name, serviceConfig);
}

export async function startServices() {
  const serviceNames = await readdir(moxxyConfig.moxxyDir);

  // Initialize services in parallel.
  await Promise.all(serviceNames.map(async (name) => startService(name)));
  console.log('Initialized services.');
}
