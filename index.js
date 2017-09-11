#!/usr/bin/env node
const dir = require('node-dir');
const readline = require('readline');
const open = require("open");
const leftPad = require("left-pad");
const minimist = require("minimist");

const commandProcessor = require("./commands");

const args = process.argv.splice(2);

const commandName = args[0];
const commandArgs = minimist(args.slice(1));


commandProcessor(commandName, commandArgs);