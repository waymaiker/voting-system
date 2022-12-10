//SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/contracts/access/Ownable.sol";

error Voting__ProposalDescriptionCantBeEmpty();
error Voting__VoterHasAlreadyVoted();

contract Voting is Ownable {
  enum WorkflowStatus {
    RegisteringVoters,
    ProposalsRegistrationStarted,
    ProposalsRegistrationEnded,
    VotingSessionStarted,
    VotingSessionEnded,
    VotesTallied
  }

  struct Voter {
    bool isRegistered;
    bool hasVoted;
    uint votedProposalId;
  }

  struct Proposal {
    string description;
    uint voteCount;
  }

  mapping(address => Voter) registredVoters;
  address[] registeredVotersAddresses;
  uint winningProposalId;
  Proposal[] proposals;

  WorkflowStatus proposalSessionStatus;
  WorkflowStatus voteSessionStatus;

  event ProposalRegistered(uint proposalId);
  event Voted (address voter, uint proposalId);
  event VoterRegistered(address voterAddress);
  event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);

  modifier onlyRegisteredVoter(){
    require(registredVoters[msg.sender].isRegistered == true, 'Not Registered Voter');
    _;
  }

  modifier onlyWhenProposalRegistrationStarted(){
    require(proposalSessionStatus == WorkflowStatus.ProposalsRegistrationStarted, "Proposal session has not started yet");
    _;
  }

  modifier onlyWhenVotingSessionStarted(){
    require(voteSessionStatus == WorkflowStatus.VotingSessionStarted, "Voting session hasnt started yet");
    _;
  }
  // ONLY OWNER METHODS

  function registerVoter(address _voter) external onlyOwner {
    require(registredVoters[_voter].isRegistered == false, "This Voter has already been registered");

    registredVoters[_voter] = Voter(true, false, 0);
    registeredVotersAddresses.push(_voter);
    emit VoterRegistered(_voter);
  }

  function launchProposalSession() external onlyOwner {
    proposalSessionStatus = WorkflowStatus.ProposalsRegistrationStarted;
    emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
  }

  function stopProposalSession() external onlyOwner onlyWhenProposalRegistrationStarted {
    proposalSessionStatus = WorkflowStatus.ProposalsRegistrationEnded;
    emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
  }

  function launchVotingSession() external onlyOwner {
    require(proposalSessionStatus == WorkflowStatus.ProposalsRegistrationEnded, "Proposal Registration has ended yet");

    voteSessionStatus = WorkflowStatus.VotingSessionStarted;
    emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
  }

  function stopVotingSession() external onlyOwner onlyWhenVotingSessionStarted {
    voteSessionStatus = WorkflowStatus.VotingSessionEnded;
    emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
  }

  function voteSessionEndedSetWinnerProposalId() external onlyOwner {
    require(voteSessionStatus == WorkflowStatus.VotingSessionEnded, "Voting session hasnt ended yet");

    for(uint i = 0; i<proposals.length; i++){
      if(proposals[i].voteCount > winningProposalId){
        winningProposalId = i;
      }
    }

    voteSessionStatus = WorkflowStatus.VotesTallied;
    emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
  }

  // ONLY VOTERS METHODS

  function getRegisteredVotersAddresses() external view onlyRegisteredVoter returns(address[] memory){
    return registeredVotersAddresses;
  }

  function getRegisteredVoterVotedProposal(address _voterAddress) external view onlyRegisteredVoter returns(Proposal memory){
    return proposals[registredVoters[_voterAddress].votedProposalId];
  }

  function createProposal(string memory _description) external onlyRegisteredVoter onlyWhenProposalRegistrationStarted {
    if(bytes(_description).length == 0){ revert Voting__ProposalDescriptionCantBeEmpty(); }

    proposals.push(Proposal(_description, 0));
    emit ProposalRegistered(proposals.length);
  }

  function getAllProposals() external view onlyRegisteredVoter returns(Proposal[] memory) {
    return proposals;
  }

  function vote(uint _proposalId) external onlyRegisteredVoter onlyWhenVotingSessionStarted {
    if(registredVoters[msg.sender].hasVoted == true){ revert Voting__VoterHasAlreadyVoted(); }

    registredVoters[msg.sender].hasVoted = true;
    registredVoters[msg.sender].votedProposalId = _proposalId;
    proposals[_proposalId].voteCount += 1;

    emit Voted(msg.sender, _proposalId);
  }

  // PUBLIC METHODS

  function getWinnerProposal() public view returns(Proposal memory){
    require(voteSessionStatus == WorkflowStatus.VotesTallied, "Voting session hasnt been tailled yet");
    return proposals[winningProposalId];
  }
}