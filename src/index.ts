import { loadConfig } from './config';
import { startServices } from './service';

console.log('Starting Moxxy');
startServices(loadConfig());
