const Generator = require('yeoman-generator');

class GeneratorCool extends Generator {
  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        // Defaults to the project's folder name if not specified
        default: this.appname,
      },
      {
        type: 'list',
        name: 'license',
        message: 'Which license would you like to use?',
        default: 'MIT',
        choices: [
          {
            name: 'No License',
            value: '',
            short: 'None',
          },
          {
            name: 'MIT',
            value: 'MIT',
            short: 'MIT',
          },
          {
            name: 'GPL-3.0',
            value: 'GPL-3.0',
            short: 'GPL-3.0',
          },
          {
            name: 'Apache-2.0',
            value: 'Apache-2.0',
            short: 'Apache-2.0',
          },
        ],
      },
      {
        type: 'input',
        name: 'description',
        message: 'Please enter a description for your project',
        default: 'Cool project!!!',
      },

      {
        type: 'confirm',
        name: 'installDeps',
        message: 'Would you like to install all dependencies now?',
        default: false,
      },
    ]).then(answers => {
      this.props = answers;
    });
  }

  writing() {
    this.log('writing');
    // Package.json
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      {
        name: this.props.name,
        description: this.props.description,
        license: this.props.license,
      }
    );

    // .gitignore
    this.fs.copy(
      this.templatePath('_gitignore'),
      this.destinationPath('.gitignore')
    );

    this.fs.copy(
      this.templatePath('_eslintrc.js'),
      this.destinationPath('.eslintrc.js')
    );

    this.fs.copyTpl(
      this.templatePath('_README.md'),
      this.destinationPath('README.md'),
      {
        name: this.props.name,
        description: this.props.description,
      }
    );

    // copy app src, dependent on language choice
    this.fs.copyTpl(
      // this.templatePath(`src_${this.props.language === 'es2015' ? 'es2015' : 'ts'}`),
      this.templatePath('src'),
      this.destinationPath('src'),
      {
        name: this.props.name,
        description: this.props.description,
      }
    );
  }

  install() {
    if (this.props.installDeps) {
      this.npmInstall();
    } else {
      this
        .log(`Skipping the install step. Run \`npm install\` inside the project root when
        you're ready.`);
    }
  }
}

module.exports = GeneratorCool;
