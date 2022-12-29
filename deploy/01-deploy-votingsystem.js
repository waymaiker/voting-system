module.exports = async({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  log("Deployment in progress ...");

  arguments = []
  await deploy("Voting", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: 1
  })

  log("Deployment done !")
}

module.exports.tags = ["all", "voting", "main"]