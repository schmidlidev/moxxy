import { readJsonSync } from 'fs-extra';

export type MoxxyConfig = {
  servicesDirectory: string;
};

export function loadConfig(): MoxxyConfig {
  return readJsonSync('moxxy.json');
}
