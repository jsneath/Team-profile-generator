const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require('inquirer');
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./src/page-template.js");


// TODO: Write Code to gather information about the development team members, and render the HTML file.
const teamMembers = [];

function createTeamMember() {
  
    inquirer.prompt([
        {
            type: 'list',
            name: 'role',
            message: 'What is the role of the team member?',
            choices: ['Manager', 'Engineer', 'Intern', 'Exit']
        }
    ]).then((answers) => {
        if (answers.role === 'Exit') {
            buildTeam();
 
            return;
        }

        inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: `What is the ${answers.role}'s name?`
            },
            {
                type: 'input',
                name: 'id',
                message: `What is the ${answers.role}'s ID?`
            },
            {
                type: 'input',
                name: 'email',
                message: `What is the ${answers.role}'s email?`
            },
            ...(answers.role === 'Manager' ? [{
                type: 'input',
                name: 'officeNumber',
                message: "What is the manager's office number?"
            }] : []),
            ...(answers.role === 'Engineer' ? [{
                type: 'input',
                name: 'github',
                message: "What is the engineer's GitHub username?"
            }] : []),
            ...(answers.role === 'Intern' ? [{
                type: 'input',
                name: 'school',
                message: "What school does the intern attend?"
            }] : [])
        ]).then((moreAnswers) => {
            let member;
            if (answers.role === 'Manager') {
                member = new Manager(moreAnswers.name, moreAnswers.id, moreAnswers.email, moreAnswers.officeNumber);
            } else if (answers.role === 'Engineer') {
                member = new Engineer(moreAnswers.name, moreAnswers.id, moreAnswers.email, moreAnswers.github);
            } else if (answers.role === 'Intern') {
                member = new Intern(moreAnswers.name, moreAnswers.id, moreAnswers.email, moreAnswers.school);
            }

            teamMembers.push(member);
            createTeamMember();
   
        });
    });
}

function buildTeam() {
    // Check if output directory exists, if not, create it
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }

    // Call the render function and write the HTML to a file
    fs.writeFileSync(outputPath, render(teamMembers), "utf-8");
}

function init() {
    createTeamMember();
}

init();