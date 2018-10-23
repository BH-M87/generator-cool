const Generator = require('yeoman-generator');

class GeneratorCool extends Generator {
  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        // Defaults to the project's folder name if not specified
        default: this.appname
      },
      {
        type: 'input',
        name: 'title',
        message: 'Please enter a title for your project html file',
        default: 'Title'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Please enter a description for your project',
        default: 'Cool project!!!'
      },
      {
        type: 'list',
        name: 'license',
        message: 'Which license would you like to use?',
        default: 'No License',
        choices: [
          {
            name: 'No License',
            value: '',
            short: 'None'
          },
          {
            name: 'MIT',
            value: 'MIT',
            short: 'MIT'
          },
          {
            name: 'GPL-3.0',
            value: 'GPL-3.0',
            short: 'GPL-3.0'
          },
          {
            name: 'Apache-2.0',
            value: 'Apache-2.0',
            short: 'Apache-2.0'
          }
        ]
      },
      {
        type: 'confirm',
        name: 'installDeps',
        message: 'Would you like to install all dependencies now?',
        default: false
      }
    ]).then(answers => {
      this.props = answers;
    });
  }

  writing() {
    this.log('writing');
    // Package.json
    this.fs.copyTpl(this.templatePath('_package.json'), this.destinationPath('package.json'), {
      name: this.props.name,
      description: this.props.description,
      license: this.props.license
    });

    // .gitignore
    this.fs.copy(this.templatePath('_gitignore'), this.destinationPath('.gitignore'));

    this.fs.copy(this.templatePath('_eslintrc.js'), this.destinationPath('.eslintrc.js'));

    this.fs.copy(this.templatePath('_tsconfig.json'), this.destinationPath('tsconfig.json'));

    this.fs.copy(
      this.templatePath('_cool.dev.config.js'),
      this.destinationPath('.cool.dev.config.js')
    );

    this.fs.copy(this.templatePath('_mock.js'), this.destinationPath('.mock.js'));

    this.fs.copy(this.templatePath('_prettierrc'), this.destinationPath('.prettierrc'));

    this.fs.copyTpl(this.templatePath('_README.md'), this.destinationPath('README.md'), {
      name: this.props.name,
      description: this.props.description
    });

    // copy shell
    this.fs.copy(this.templatePath('_publish.sh'), this.destinationPath('publish.sh'));
    this.fs.copy(
      this.templatePath('_installExtension.sh'),
      this.destinationPath('installExtension.sh')
    );

    // copy app src, dependent on language choice
    this.fs.copyTpl(
      // this.templatePath(`src_${this.props.language === 'es2015' ? 'es2015' : 'ts'}`),
      this.templatePath('src'),
      this.destinationPath('src'),
      {
        name: this.props.name,
        description: this.props.description,
        title: this.props.title
      }
    );

    // .vscode config
    this.fs.copy(this.templatePath('.vscode'), this.destinationPath('.vscode'));
  }

  install() {
    if (this.props.installDeps) {
      this.spawnCommandSync('tnpm', 'install');
    } else {
      this.log(`Skipping the install step. Run \`npm install\` inside the project root when
        you're ready.`);
    }
  }
}

module.exports = GeneratorCool;
