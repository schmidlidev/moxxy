import { readJsonSync } from 'fs-extra';

type MoxxyConfig = {
  servicesDirectory: string;
};

export function loadConfig(): MoxxyConfig {
  return readJsonSync('moxxy.json');
}
