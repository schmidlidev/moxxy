import express from 'express';
import { readdir, readJSON } from 'fs-extra';
import { join } from 'path';
import { fileResolver, proxyResolver } from './resolve';

type ServiceConfig = {
  port: string;
  proxy: {
    host: string;
  };
};

function initializeApp(name: string, servicePath: string, config: ServiceConfig) {
  const { port, proxy } = config;
  const app = express();

  const routesDirectory = join(servicePath, 'routes/');
  app.use('*', fileResolver(routesDirectory));

  if (proxy) {
    app.use('*', proxyResolver(proxy.host));
  }

  app.listen(port);
  console.log(`${name} listening on port ${port}`);
}

async function loadServiceConfig(servicePath: string): Promise<ServiceConfig> {
  // TODO: Validate config
  return await readJSON(join(servicePath, 'config.json'));
}

async function startService(directory: string, name: string) {
  console.log(`Starting service: ${name}`);
  const servicePath = join(directory, name);
  const serviceConfig = await loadServiceConfig(servicePath);

  initializeApp(name, servicePath, serviceConfig);
}

export async function startServices(directory: string) {
  const serviceNames = await readdir(directory);

  // Initialize services in parallel.
  await Promise.all(serviceNames.map(async (name) => startService(directory, name)));
  console.log('Initialized services.');
}
