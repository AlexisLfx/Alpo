import { ethers } from 'ethers'

const RPC_URLS = [
  'https://testnet-rpc.monad.xyz',
  'https://rpc.ankr.com/monad_testnet',
]
const MONAD_CHAIN_ID = 10143
const BLOCK_EXPLORER = 'https://testnet.monadexplorer.com'

const ABI = [
  'function storeEvidence(bytes32 evidenceHash, uint256 timestamp) external',
  'event EvidenceStored(bytes32 indexed hash, uint256 timestamp, address indexed sender)',
]

async function getProvider(): Promise<ethers.JsonRpcProvider> {
  for (const url of RPC_URLS) {
    try {
      const provider = new ethers.JsonRpcProvider(url, {
        chainId: MONAD_CHAIN_ID,
        name: 'monad-testnet',
      })
      // Verificar que el RPC responde
      await provider.getBlockNumber()
      return provider
    } catch {
      console.warn(`[monad] RPC no disponible: ${url}, intentando siguiente...`)
    }
  }
  throw new Error('Ningún RPC de Monad Testnet está disponible')
}

export async function storeEvidenceOnChain(
  hexHash: string,
  timestamp: number
): Promise<{ txHash: string; blockExplorerUrl: string }> {
  const privateKey = process.env.MONAD_PRIVATE_KEY
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS

  if (!privateKey) throw new Error('MONAD_PRIVATE_KEY no configurada')
  if (!contractAddress) throw new Error('NEXT_PUBLIC_CONTRACT_ADDRESS no configurada')

  const provider = await getProvider()
  const wallet = new ethers.Wallet(privateKey, provider)
  const contract = new ethers.Contract(contractAddress, ABI, wallet)

  // SHA-256 ya es 32 bytes — agregar prefijo 0x para bytes32
  const bytes32Hash = ('0x' + hexHash) as `0x${string}`

  const tx = await contract.storeEvidence(bytes32Hash, BigInt(timestamp))
  const receipt = await tx.wait()

  return {
    txHash: receipt.hash,
    blockExplorerUrl: `${BLOCK_EXPLORER}/tx/${receipt.hash}`,
  }
}
