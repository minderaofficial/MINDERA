// This is a simplified ABI for a presale contract
// In a real implementation, you would generate this from your Solidity contract

const presaleAbi = [
  // Read functions
  "function currentPrice() view returns (uint256)",
  "function raisedAmount() view returns (uint256)",
  "function hardCap() view returns (uint256)",
  "function tokenPrice() view returns (uint256)",
  "function minContribution() view returns (uint256)",
  "function maxContribution() view returns (uint256)",
  "function presaleStartTime() view returns (uint256)",
  "function presaleEndTime() view returns (uint256)",
  "function tokensForSale() view returns (uint256)",
  "function soldTokens() view returns (uint256)",
  "function userContributions(address) view returns (uint256)",
  "function userTokens(address) view returns (uint256)",
  "function presaleStage() view returns (uint8)",

  // Write functions
  "function buyTokens() payable",
  "function claimTokens()",
  "function withdrawContribution()",

  // Events
  "event TokensPurchased(address indexed buyer, uint256 amount, uint256 tokens)",
  "event TokensClaimed(address indexed claimer, uint256 tokens)",
  "event ContributionWithdrawn(address indexed contributor, uint256 amount)",
]

export default presaleAbi

