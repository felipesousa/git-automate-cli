const inquirer = require('inquirer');
const files = require('./files');

const askCredentials = () => {
  const questions = [
    {
      name: 'username',
      type: 'input',
      message: 'Insert your GitHub username or email address:', 
      validate: (field) => field.length ? true : 'Please enter your email or username.'
    }, 

    {
      name: 'password',
      type: 'password',
      message: 'Enter your password:',
      validate: (field) => field.length ? true : 'Please enter any password.'
    }
  ]

  return inquirer.prompt(questions);
}

const askRepo = () => {
  const argv = require('minimist')(process.argv.slice(2));

  const questions = [
    {
      type: 'input',
      name: 'name',
      message: 'Enter a name for the repository:',
      default: argv._[0] || files.getPath(),
      validate: function(field) {
        return field.length ? true : 'Please enter a name for the repository.'
      }
    },
    {
      type: 'input',
      name: 'description',
      default: argv._[1] || null,
      message: 'Optionally enter a description of the repository:'
    },  
    {
      type: 'list',
      name: 'visibility',
      message: 'Public or private:',
      choices: [ 'public', 'private' ],
      default: 'public'
    }
  ];

  return inquirer.prompt(questions);
};

const askIgnoreFiles = (filelist) => {
  const questions = [
    {
      type: 'checkbox',
      name: 'ignore',
      message: 'Select the files and/or folders you wish to ignore:',
      choices: filelist,
      default: ['node_modules', 'bower_components'],
    }
  ];  

  return inquirer.prompt(questions);
};


module.exports = { 
  askCredentials,
  askRepo,
  askIgnoreFiles,
};
