# 🌐 NFT Marketplace and Membership NFTs

## 📜 Overview
This NFT Marketplace, built with Next.js and Express.js, specializes in the trade of Membership NFTs, offering a unique platform for various NFT transactions.

## ✨ Features
- **🖼 NFT Listing**: Seamlessly list NFTs using Pinata for metadata management.
- **🏅 Membership NFTs**: Trade specialized NFTs with multiple tiers and renewal options.
- **💻 Backend Integration**: Robust setup with Express, Mongoose, AlgoliaSearch, and Ethers.js.
  - **🗃 Database & Indexing**: Listings are automatically added to MongoDB and indexed on Algolia.
  - **🌍 API Routes**: Fetch all listings, listings by ID, and batch ID listings.
- **🎨 Frontend Design**: Crafted with Next.js and `shadcn` for a responsive user experience.
- **🔍 Search Functionality**: Advanced search options based on NFT seller or address.
- **👤 Custom Wallet Display**: Unique representation using Gravatar.
- **🔗 Ethers.js Integration**: Manages blockchain interactions and `writeContract` functionalities.

## 🚧 Known Issues
- **🛠 SetApproval Requirement**: Working to resolve `setApprovalForAll` issues in `listNFT` function.

## 🚀 Development Status
The project is in active development and is part of an ongoing assignment.

## 📁 Project Structure
- **blockchain**: Contains smart contracts and Hardhat configurations.
- **client**: Next.js frontend application.
- **server**: Express.js backend server.

## 🚀 Getting Started

- **Clone the Repository**
  - `git clone [your-repository-url]`

- **Setup Blockchain Environment**
  - Change to the blockchain directory: `cd blockchain`
  - Install dependencies: `npm install`
  - Compile contracts with Hardhat: `npx hardhat compile`
  - Deploy contracts: The files are in the `scripts` folder. You can deploy them with `npx hardhat run scripts/[script-name].js`

- **Initialize Server**
  - Navigate to server folder: `cd ../server`
  - Install dependencies and start the server: `npm install` then `npm start`

- **Launch Client Application**
  - Go to client folder: `cd ../client`
  - Install dependencies and run the Next.js app: `npm install` then `npm run dev`
  
- **Found Issues**
  - Noted issues with `writeContract` in wagmi when handling Ether values. Workaround is to use ethers.js to handle the transaction.

---


