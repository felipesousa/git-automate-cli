const _       = require('lodash');
const fs      = require('fs');
const git     = require('simple-git')();
const Spinner = require('clui').Spinner;

const inquirer = require('./inquirer');
const github   = require('./github');


const createRepo = async () => {
  const gh = github.getInstance();
  const answers = await inquirer.askRepo();  
  
  const {name, description, visibility} = answers;

  const data = {
    name,
    description,
    private: (visibility === 'private')
  };

  const status = new Spinner('Creating remote repository...');
  status.start();
  
  try {
    const response = await gh.repos.create(data);
    return response.data.ssh_url;
  } catch (err) {
    throw err;
  } finally {
    status.stop();
  }
};

const createIgnore = async () => {
  const filelist = _.without(fs.readdirSync('.'), '.git', '.gitignore');
  if(filelist.length) {
    const answers = await inquirer.askIgnoreFiles(filelist); 

    if (answers.ignore.length) {
      fs.writeFileSync('.gitignore', answers.ignore.join('\n'));
    } else {
      touch('.gitignore');
    }
  } else { 
    touch('.gitignore');
  }
};

const setupRepo = async (url) => {
  const status = new Spinner('Initializing local repository and pushing to remote...');
  status.start();

  try {
    await git
      .init()
      .add('.gitignore')
      .add('./*')
      .commit('initial commit')
      .addRemote('origin', url)
      .push('origin', 'master')

    return true;
  } catch (err) {
    throw err;
  } finally {
    status.stop();
  }
}

module.exports = { 
  createRepo,
  createIgnore,
  setupRepo,
};
