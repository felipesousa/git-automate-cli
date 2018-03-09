const ConfigStore = require('configstore');
const _           = require('lodash');
const Spinner     = require('clui').Spinner;
const chalk       = require('chalk');
const octokit     = require('@octokit/rest')();

const inquirer    = require('./inquirer');
const pkg         = require('../package.json');
const conf        = new ConfigStore(pkg.name);


const getInstance = () => octokit;

const getStoredToken = () => conf.get('github.token');

const setGitCredentials = async () => {
  const credentials = await inquirer.askCredentials();

  octokit.authenticate(
    Object.assign({}, { type: 'basic' }, credentials)
  );
}

const registerToken = async () => {
  const status = new Spinner('Authenticating you, please wait...');
  status.start();

  try {
    const response = await octokit.authorization.create({
      scopes: ['user', 'public_repo', 'repo', 'repo:status'],
      note: 'ginits, the command-line tool for initalizing Git repos',
    });

    const {token} = response.data;

    if(token) {
      conf.set('github.token', token);
      return token;
    } else {
      throw new Error("Missing Token", "GitHub wasn't found on response.");
    }

  } catch (err) {
    throw err; 
  } finally {
    status.stop();
  }
};

const githubAuth = (token) => {
  octokit.authenticate({
    type: 'oauth',
    token,
  })
}

module.exports = {
  getInstance,
  getStoredToken, 
  setGitCredentials,
  registerToken,
  githubAuth,
}
