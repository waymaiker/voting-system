# Voting system

A small organization has decided, to use a new vote system.  
All voters are known to the organization and are whitelisted using their Ethereum address.   
They can submit new proposals during a proposal registration session, and can vote on proposals only during the voting session.  
When the administrator, has tally the votes, the vote is closed.

Few rules:  
✔️ Voting is not secret for users added to the Whitelist.  
✔️ Each voter can see the votes of others.  
✔️ The winner is determined by simple majority.  
✔️ The proposal that gets the most votes wins.  

Here I focused on having at least 90% of branch tests coverage.  
***Currently having 49 tests.***

![Ceci est un exemple d’image](https://example.com/bild.jpg)


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
yarn hardhat node (Start the local Blockchain)
```

#### In an other terminal tab
```shell
yarn hardhat deploy (deploy your smart contract)
```

#### test commands
```shell
yarn hardhat test
yarn hardhat coverage
```
