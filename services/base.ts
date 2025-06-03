import { ethers } from 'ethers';

const idRegistryAddress = '0x0007137d48c376590dcc6936aa9246e4828bdec1';
const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');

export async function getFidCreationDate(fid: number): Promise<Date> {
  const iface = new ethers.Interface([
    'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'
  ]);

  const topic = iface.getEventTopic('Transfer');

  const logs = await provider.getLogs({
    address: idRegistryAddress,
    fromBlock: 0,
    toBlock: 'latest',
    topics: [
      topic,
      ethers.ZeroHash, // from = 0x0 => mint
      null,
      ethers.hexZeroPad(ethers.toBeHex(fid), 32)
    ]
  });

  if (logs.length === 0) {
    throw new Error('FID mint not found');
  }

  const block = await provider.getBlock(logs[0].blockNumber);
  return new Date(block.timestamp * 1000);
}
