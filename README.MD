# NFT Lottery 
**UI Demo can be found here: https://billion-dollar-mint.web.app/**

## Abstract
- Lotteries and raffles can be completely decentralized into trustless contracts, with legitimate checks in place to contract owners that ensure a fair game for all who play.
- Developers beware, 'private' lotteries are illegal in some countries (USA included), so be careful how you use this.

## About
- Users can mint lottery tickets, which are mapped to their address as ERC721s (NFTs).
- The contract owner can mint tickets for addresses manually, up to the COMMUNITY_TICKET_CAP. This can be used to incentivize community outreach.
- The contract owner calls the `generateWinningTicket` function, which uses Chainlink VRF to decide the winning ticket ID.
- The contract owner then calls the `cashOutWinnings` function, which pays the winning address of the lottery the winner's pot, and then cashes out the remaining balance to the contract owner.
- While this contract currently relies on the contract owner to 'decide the winner' there is no way for the winner to access funds until after the winner has been paid out. 
- If you wish for a 100% trustless (but perhaps less fun?) lottery system, use `TrustlessNFTLottery.sol` instead.

## Development
- Install node: https://nodejs.org/en/download/
- Clone this repository and cd into it
- Run `npm install`
- Enter credentials & API endpoint in .env
- To test, run `npx hardhat test`
- To deploy to ropsten, run `npx hardhat --network ropsten run scripts/deploy.js`
