# Voting system

Alyra course project - phase 2

A small organization has decided, to use a new vote system.  
All voters are known to the organization and are whitelisted using their Ethereum address.   
They can submit new proposals during a proposal registration session and can vote on proposals only during the voting session.  
When the administrator has tallied the votes, the vote is closed.

Few rules:  
✔️ Voting is not secret for users added to the Whitelist.  
✔️ Each voter can see the votes of others.  
✔️ The winner is determined by simple majority.  
✔️ The proposal that gets the most votes wins.  

## Contents
- [Tests](#tests)
  - [Workflow](#workflow)
  - [Methods](#methods)
  - [States](#states)
- [How to use this project](#how-to-use-this-project)
- [Resources](#resources)

## Tests
Here I focused on having at least 90% of branch tests coverage.  

![Ceci est un exemple d’image](https://github.com/waymaiker/voting-system/blob/master/test_coverage.png) 

***Currently having 50 tests.***  
Divided into 3 files: 


### WORKFLOW
[file - votingsystem_workflow.test.js](https://github.com/waymaiker/voting-system/blob/master/test/integration/voingsystem_workflow.test.js)

![Ceci est un exemple d’image](https://github.com/waymaiker/voting-system/blob/master/tests_description_workflows.png)

### METHODS
[file - votingsystem_methods.test.js](https://github.com/waymaiker/voting-system/blob/master/test/unit/votingsystem_methods.test.js)
#### What are required to them to work well, what kind of event they should emit while working well and what could make them not working
![Ceci est un exemple d’image](https://github.com/waymaiker/voting-system/blob/master/tests_description_methods.png)

### STATES
[file - votingsystem_state.test.js](https://github.com/waymaiker/voting-system/blob/master/test/unit/votingsytem_state.test.js)
#### What are required to them to work well, what kind of event they should emit while working well and what could make them not working
![Ceci est un exemple d’image](https://github.com/waymaiker/voting-system/blob/master/tests_description_state.png)


## How to use this project
This project will require that you have already installed
* Yarn
* Node
* Git

If you are familiar with git and the terminal, here are few steps to follow

### Clone the project
```shell
git clone https://github.com/waymaiker/voting-system.git
```

### Install libraries
```shell
cd voting-system
yarn install
```
### hardhat commands
```shell
# Start the local Blockchain
yarn hardhat node
```

#### In an other terminal tab
```shell
# Deploy your smart contract
yarn hardhat deploy
```

#### test commands
```shell
yarn hardhat test
yarn hardhat coverage
```

## Resources

* https://www.chaijs.com/api/bdd/
* https://hardhat.org/tutorial/testing-contracts
* https://hardhat.org/hardhat-chai-matchers/docs/overview
* https://docs.ethers.org/v5/api/utils/bignumber/
