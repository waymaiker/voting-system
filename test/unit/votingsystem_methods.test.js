const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhet-config")

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Units tests METHODS of Voting smart contract", function(){
      let accounts;
      let voting;

      before(async () => {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
      })

      describe("Deployment", function() {
        it("should deploy the smart contract", async function() {
          await deployments.fixture(["voting"])
          voting = await ethers.getContract("Voting")
        })
      })

      describe("Tests: METHODS", function() {
        beforeEach(async() => {
          await deployments.fixture(["voting"])
          voting = await ethers.getContract("Voting")
        })

        describe("Validations", function() {
          it("should ADD a VOTER, to the voters list", async function() {
            await expect(voting.addVoter(accounts[1].getAddress())).not.to.be.reverted
            await expect(voting.addVoter(accounts[2].getAddress())).not.to.be.reverted

            const voter1 = await voting.connect(accounts[1]).getVoter(accounts[1].getAddress())
            await assert(voter1.isRegistered === true)
          })

          it("should GET a VOTER identified by his address", async function() {
            await voting.addVoter(accounts[1].getAddress())
            await voting.addVoter(accounts[2].getAddress())
            const voter = await voting.connect(accounts[2]).getVoter(accounts[1].getAddress())

            await expect(voter).not.to.be.reverted
            await assert(voter.isRegistered === true)
            await assert(voter.hasVoted === false)
            await assert(ethers.BigNumber.from(voter.votedProposalId).toString() === ethers.BigNumber.from(0).toString())
          })

          it("should ADD a PROPOSAL", async function() {
            await voting.addVoter(accounts[1].getAddress())
            await voting.startProposalsRegistering()

            await expect(voting.connect(accounts[1]).addProposal("Proposal 1")).not.to.be.reverted
          })

          it("should GET a PROPOSAL", async function() {
            proposalDescription = "GENESIS"
            await voting.addVoter(accounts[1].getAddress())
            await voting.startProposalsRegistering()
            const proposal = await voting.connect(accounts[1]).getOneProposal(0)

            await expect(proposal).not.to.be.reverted
            assert(proposal.description.toString() === proposalDescription)
          })

          it("should SET a VOTE", async function() {
            await voting.addVoter(accounts[1].getAddress())
            await voting.addVoter(accounts[2].getAddress())
            await voting.startProposalsRegistering()
            await voting.connect(accounts[1]).addProposal('Proposal 1')
            await voting.endProposalsRegistering()
            await voting.startVotingSession()

            await expect(voting.connect(accounts[1]).setVote(1)).not.to.be.reverted

            const voter = await voting.connect(accounts[2]).getVoter(accounts[1].getAddress())
            assert(voter.hasVoted === true)
            assert(voter.votedProposalId.toString() ===  ethers.BigNumber.from(1).toString())
          })
        })

        describe("Events", function() {
          it("using ADDVOTER methods, should EMITS VoterRegistered", async function() {
            await expect(voting.addVoter(accounts[1].getAddress())).to.emit(voting, "VoterRegistered")
          })
          it("using ADDPROPOSAL methods, should EMITS ProposalRegistered", async function() {
            await voting.addVoter(accounts[1].getAddress())
            await voting.startProposalsRegistering()

            await expect(voting.connect(accounts[1]).addProposal("Proposal 1")).to.emit(voting, "ProposalRegistered")
          })

          it("using SETVOTE methods, should EMITS Voted", async function() {
            await voting.addVoter(accounts[1].getAddress())
            await voting.startProposalsRegistering()
            await voting.connect(accounts[1]).addProposal('Proposal 1')
            await voting.endProposalsRegistering()
            await voting.startVotingSession()

            await expect(voting.connect(accounts[1]).setVote(1)).to.emit(voting, "Voted")
          })
        })

        describe("Requires", function() {
          describe("should NOT addVoter", function() {
            it("when he has already been registered", async function() {
              await voting.addVoter(accounts[1].getAddress())
              await expect(voting.addVoter(accounts[1].getAddress())).to.be.revertedWith("Already registered")
            })
          })

          describe("should NOT getVoter", function() {
            it("when user who is trying to processed this method, has not been registered as a voter", async function() {
              await expect(voting.getVoter(accounts[1].getAddress())).to.be.revertedWith("You're not a voter")
            })
          })

          describe("should NOT addProposal", function() {
            it("when user who is trying to processed this method, has not been registered as a voter", async function() {
              await voting.startProposalsRegistering()

              await expect(voting.addProposal("Proposal 1")).to.be.revertedWith("You're not a voter")
            })

            it("when the workflow status is not equals to ProposalsRegistrationStarted", async function() {
              await voting.addVoter(accounts[1].getAddress())

              await expect(voting.connect(accounts[1]).addProposal("Proposal 1")).to.be.revertedWith("Proposals are not allowed yet")
            })

            it("when the description is empty", async function() {
              await voting.addVoter(accounts[1].getAddress())
              await voting.startProposalsRegistering()

              await expect(voting.connect(accounts[1]).addProposal("")).to.be.revertedWith("Vous ne pouvez pas ne rien proposer")
            })
          })

          describe("should NOT getProposal", function() {
            it("when user who is trying to processed this method, has not been registered as a voter", async function() {
              await expect(voting.getOneProposal(0)).to.be.revertedWith("You're not a voter")
            })

            it("when voter who is trying to processed this method, use a proposalId that is out-of-bounds or negative", async function() {
              await voting.addVoter(accounts[1].getAddress())

              await expect(voting.connect(accounts[1]).getOneProposal(5)).to.be.revertedWithPanic(0x32)
            })
          })

          describe("should NOT setVote", function() {
            it("when user who is trying to processed this method, has not been registered as a voter", async function() {
              await expect(voting.setVote(0)).to.be.revertedWith("You're not a voter")
            })

            it("when the workflow status is not equals to VotingSessionStarted", async function() {
              await voting.addVoter(accounts[1].getAddress())

              await expect(voting.connect(accounts[1]).setVote(5)).to.be.revertedWith("Voting session havent started yet")
            })

            it("when voter has already voted", async function() {
              await voting.addVoter(accounts[1].getAddress())
              await voting.startProposalsRegistering()
              await voting.connect(accounts[1]).addProposal('Proposal 1')
              await voting.endProposalsRegistering()
              await voting.startVotingSession()

              await voting.connect(accounts[1]).setVote(1)

              const voter = await voting.connect(accounts[1]).getVoter(accounts[1].getAddress())
              await assert(voter.hasVoted === true)

              await expect(voting.connect(accounts[1]).setVote(1)).to.be.revertedWith("You have already voted")
            })

            it("when voter votes for an unknown proposal", async function() {
              await voting.addVoter(accounts[1].getAddress())
              await voting.startProposalsRegistering()
              await voting.endProposalsRegistering()
              await voting.startVotingSession()

              await expect(voting.connect(accounts[1]).setVote(1)).to.be.revertedWith("Proposal not found")
            })
          })
        })
      })
  })