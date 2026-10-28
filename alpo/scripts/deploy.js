const { ethers } = require('ethers')
const solc = require('solc')
const fs = require('fs')
const path = require('path')

const RPC_URL = 'https://testnet-rpc.monad.xyz'
const CHAIN_ID = 10143

async function main() {
  // Load env
  const envPath = path.join(__dirname, '../.env.local')
  const envContent = fs.readFileSync(envPath, 'utf8')
  const privateKey = envContent.match(/MONAD_PRIVATE_KEY=(.+)/)?.[1]?.trim()
  if (!privateKey) throw new Error('MONAD_PRIVATE_KEY no encontrada en .env.local')

  // Compile
  console.log('Compilando ALPOEvidence.sol...')
  const source = fs.readFileSync(path.join(__dirname, '../contracts/ALPOEvidence.sol'), 'utf8')

  const input = {
    language: 'Solidity',
    sources: { 'ALPOEvidence.sol': { content: source } },
    settings: { outputSelection: { '*': { '*': ['abi', 'evm.bytecode'] } } },
  }

  const output = JSON.parse(solc.compile(JSON.stringify(input)))

  if (output.errors?.some(e => e.severity === 'error')) {
    throw new Error(output.errors.filter(e => e.severity === 'error').map(e => e.message).join('\n'))
  }

  const contract = output.contracts['ALPOEvidence.sol']['ALPOEvidence']
  const abi = contract.abi
  const bytecode = '0x' + contract.evm.bytecode.object

  // Deploy
  console.log('Conectando a Monad Testnet...')
  const provider = new ethers.JsonRpcProvider(RPC_URL, { chainId: CHAIN_ID, name: 'monad-testnet' })
  const wallet = new ethers.Wallet(privateKey, provider)

  const balance = await provider.getBalance(wallet.address)
  console.log(`Wallet: ${wallet.address}`)
  console.log(`Balance: ${ethers.formatEther(balance)} MON`)

  console.log('Desplegando contrato...')
  const factory = new ethers.ContractFactory(abi, bytecode, wallet)
  const deployed = await factory.deploy()
  await deployed.waitForDeployment()

  const address = await deployed.getAddress()
  console.log(`\nContrato desplegado en: ${address}`)
  console.log(`Explorer: https://testnet.monadexplorer.com/address/${address}`)

  // Update .env.local
  const updatedEnv = envContent.replace(
    /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
    `NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`
  )
  fs.writeFileSync(envPath, updatedEnv)
  console.log('\n.env.local actualizado con NEXT_PUBLIC_CONTRACT_ADDRESS')
}

main().catch(e => { console.error(e.message); process.exit(1) })
