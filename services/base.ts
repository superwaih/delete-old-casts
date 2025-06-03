import { ethers } from 'ethers';

const idRegistryAddress = '0x0007137d48c376590dcc6936aa9246e4828bdec1';
const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');

export async function getFidCreationDate(fid: number): Promise<Date> {
  const iface = new ethers.Interface([
    'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'
  ]);

  const transferEvent = iface.getEvent('Transfer');
  if (!transferEvent) {
    throw new Error("Transfer event not found in interface");
  }
  const topic = transferEvent.topicHash;

  const logs = await provider.getLogs({
    address: idRegistryAddress,
    fromBlock: 0,
    toBlock: 'latest',
    topics: [
      topic,
      ethers.zeroPadValue('0x0000000000000000000000000000000000000000', 32), // from = 0x0
      null,
      ethers.zeroPadValue(ethers.toBeHex(fid), 32)
    ]
  });

  if (logs.length === 0) {
    throw new Error('FID mint not found');
  }

  const block = await provider.getBlock(logs[0].blockNumber);
  if (!block) throw new Error('Block not found');

  return new Date(Number(block.timestamp) * 1000);
}
