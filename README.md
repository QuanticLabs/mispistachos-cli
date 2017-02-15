# mispistachos-cli
A CLI that combines bitbucket, google cloud and kubernetes.

## Installation

Clone the repo and link it using these commands:
```
# Clone the repo
$ git clone git@github.com:MisPistachos/mispistachos-cli.git
$ cd mispistachos-cli/
# Install the CLI
$ npm install -g mispistachos-cli
# Check that the CLI is working
$ mp -h
```

#Getting Started

## Get bitbucket OAuth token
1.- Go to https://bitbucket.org/account/user/YOUR_USERNAME/api  
2.- Under "OAuth consumers" select "Add consumer"  
3.- Pick a name and add a callback URL. Which URL doesn't matter.  
4.- Select all permissions ('delete' is optional) and generate a new OAuth token  


## Init project

```
# This command will ask you to set an ENV_PASS, and will ask you for your OAuth credentials.
$ mp init
```

...

## Collaborate

Clone the repo and link it using these commands:
```
$ git clone git@github.com:MisPistachos/mispistachos-cli.git
$ cd mispistachos-cli/
$ npm install -g
$ npm link
```
Modify the repo and create a pull request.