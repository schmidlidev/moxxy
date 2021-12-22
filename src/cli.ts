#!/usr/bin/env node
import yargs from 'yargs';
import { startServices } from './service';

const argv = yargs(process.argv.splice(2))
  .scriptName('moxxy')
  .option('dir', {
    alias: 'd',
    describe: 'Moxxy directory.',
    default: 'moxxy/',
  })
  .help()
  .parseSync();

console.log('Starting Moxxy');
startServices(argv.dir);
