import { loadConfig } from './config';
import { startServices } from './service';

console.log('Starting Moxxy');

const config = loadConfig();

startServices();
