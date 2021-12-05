import { readdir, readJSON } from 'fs-extra';
import { join } from 'path';

type ServiceConfigMap = {
  [key: string]: any;
};

export const serviceConfigMap: ServiceConfigMap = {};

export async function populate(servicesDir: string) {
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
