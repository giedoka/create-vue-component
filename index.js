const fs = require('fs');
const path = require('path');
const program = require('commander');
const {prompt} = require('inquirer');
const emoji = require('node-emoji');

const currentPath = process.cwd();
let componentData = {};

program
  .version('0.0.1')
  .description('Vue component generator');

const types = ['Regular', 'TypeScript'];
prompt([
  {
    type: 'list',
    name: 'selected',
    message: 'Select type',
    choices: types
  }
])
  .then(({selected}) => {
    componentData.type = selected.toLowerCase();
    prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Component name:'
      }
    ]).then(({name}) => {
      componentData.name = name;
      fs.readFile(path.join(path.resolve(__dirname), `templates/${componentData.type}-component`),
        {encoding: 'utf-8'}, (err, file) => {
          if (err) throw err;
          file = file.replace(/{component_name}/g, componentData.name);
          createComponent(`${componentData.name}`, file);
        });
    });
  });

function createComponent(name, file) {
  fs.writeFile(path.join(currentPath, `${name}.vue`), file, (err, data) => {
    if (err) throw err;
    console.log(`${emoji.emojify(':bangbang:')}Component created successfully${emoji.emojify(':bangbang:')}`);
  });
}