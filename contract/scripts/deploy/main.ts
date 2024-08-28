
import { network, run, ethers } from "hardhat"
import fs from 'fs'

const frontEndAbiFile = './doc/abi.json';
const frontEndContractsFile = './doc/contracts.json';
async function deploy(chainId: number) {

  const JAN_1ST_2030 = 1893456000;
  const ONE_GWEI: bigint = 1_000_000_000n;

  const simpleLottery = await ethers.getContractFactory("SimpleLottery")
  const lottery = await simpleLottery.deploy(JAN_1ST_2030, { value: ONE_GWEI})

  const address = await lottery.getAddress()
  console.log(`SimpleLottery deployed to ${address} on ${chainId}`)

  console.log("Writing to front end...")
        
  const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
  if (chainId in contractAddresses) {
      if (!contractAddresses[chainId].includes(address)) {
          contractAddresses[chainId].push(address)
      }
  } else {
      contractAddresses[chainId] = [address]
  }
  fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
  fs.writeFileSync(frontEndAbiFile, lottery!.interface.formatJson())
  console.log("Front end written!")
}
async function main() {
  await run("compile")
  const chainId = network.config.chainId || 31337

  await deploy(chainId)
}

main().then(() => process.exit(0)).catch((e) => {
  console.error(e)
  process.exit(1);
})
