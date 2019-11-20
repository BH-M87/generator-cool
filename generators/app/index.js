const Generator = require('yeoman-generator');

class GeneratorCool extends Generator {
  prompting() {
    return this.prompt([
      {
        type: 'list',
        name: 'stateContainerType',
        message: 'Which state container would you like to use?',
        default: 'dva',
        choices: [
          {
            name: 'dva',
            value: 'dva',
            short: 'dva'
          },
          {
            name: 'mobx',
            value: 'mobx',
            short: 'mobx'
          },
          {
            name: 'umi',
            value: 'umi',
            short: 'umi'
          }
        ]
      },
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
    // .vscode config
    this.fs.copy(this.templatePath('.vscode'), this.destinationPath('.vscode'));
    if (this.props.stateContainerType === 'umi') {
      this.fs.copyTpl(this.templatePath('umi/.*'), this.destinationPath('./'), {
        name: this.props.name,
        description: this.props.description,
        title: this.props.title
      });
      return;
    }
    // copy package.json, dependent on state container choice
    this.fs.copyTpl(
      this.templatePath(`_package_${this.props.stateContainerType}.json`),
      this.destinationPath('package.json'),
      {
        name: this.props.name,
        description: this.props.description
      }
    );

    // .gitignore
    this.fs.copy(this.templatePath('_gitignore'), this.destinationPath('.gitignore'));

    this.fs.copy(this.templatePath('_eslintrc.js'), this.destinationPath('.eslintrc.js'));

    this.fs.copy(this.templatePath('_jsconfig.json'), this.destinationPath('jsconfig.json'));

    this.fs.copy(this.templatePath('_cool.config.js'), this.destinationPath('.cool.config.js'));
    this.fs.copy(
      this.templatePath('_cool.dev.config.js'),
      this.destinationPath('.cool.dev.config.js')
    );
    this.fs.copy(
      this.templatePath('_cool.prod.config.js'),
      this.destinationPath('.cool.prod.config.js')
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

    // copy app src, dependent on state container choice
    this.fs.copyTpl(
      this.templatePath(`src_${this.props.stateContainerType}`),
      this.destinationPath('src'),
      {
        name: this.props.name,
        description: this.props.description,
        title: this.props.title
      }
    );

    // def config:
    // abc.json
    this.fs.copy(this.templatePath('_abc.json'), this.destinationPath('abc.json'));
    // templates: index.html and others
    this.fs.copy(this.templatePath('templates'), this.destinationPath('templates'));
  }

  install() {
    if (this.props.installDeps) {
      this.npmInstall();
    } else {
      this
        .log(`Skipping the install step. Run \`npm(cnpm or tnpm) install\` inside the project root when
        you're ready.`);
    }
  }
}

module.exports = GeneratorCool;
