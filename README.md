<h1 align="center">
  <a href="https://FreeNFTMint.app"><img width="30%" src="https://freenftmint.app/assets/images/logo.png" alt="Free NFT Mint App logo" /></a>
</h1>

<h3 align="center">Angular NFT minting dApp for web and native mobile <a href="FreeNFTMint.app">FreeNFTMint.app</a></h3>

<h4 align="center">Made With 🧡 By The <a href="https://Bizelop.app">Bizelop</a> Community </h4>
<p align="center">
  <a href="https://discord.gg/bizelop"><img src="https://img.shields.io/badge/chat-discord?style=for-the-badge&logo=discord&label=discord&logoColor=7389D8&color=ff6501" /></a>
  <a href="https://twitter.com/mmwirelesstech"><img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/mmwirelesstech?color=ff6501&label=twitter&logo=twitter&style=for-the-badge"></a>
</p>



# About
This is a free NFT minting dApp to mint your own images directly to your wallet. Turn your favorite memories, best moments, selfies, beautiful art or business logo into an NFT. Upload an image from your device and mint.

The minted NFT will be an ERC-1155 token that lives on the Ethereum blockchain. You can then use it as your Twitter NFT profile picture, transfer it to a friend/family member, add images to your NFT photo frame, or list it for sale on an NFT marketplace.

This is built on Angular that integrates with WalletConnect, Coinbase, MetaMask and other web3 support wallets. The wallet integrations are done separately to show how you can utilize the different SDKs available for your own integration if needed.

It also has code that is expected when deployed onto a [Bizelop Cordova Shell App](https://github.com/bizelop/Cordova-ShellApp) so it can run in a Native App and get deployed to Google/Apple Store. The Native App demonstrates how to deep-link to connect with Coinbase wallet that has a limited browser (Coinbase in-app wallet does not allow to upload files with the HTML file input) enable push notifications, and more.

You are free to clone and update the code as needed and if you need any help join the [Discord](https://discord.gg/bizelop)

## Prerequisites

Node version 16.13.0 (This version is what we used) 
 
 - Use Node Version Manager (nvm) to install and use different node versions on the same machine

- An IDE (Visual Studio Code) 

## Initial Setup 

Clone the  project to your local machine

```bash
git clone https://github.com/bizelop/FreeNFTMint-Angular-dApp.git
```

cd to the folder 

```bash
cd FreeNFTMint-Angular-dApp
```
install node dependencies (see package.json)

```bash
npm install
```

Create an [Infura Api Key](https://infura.io/) needed for WalletConnect and Coinbase SDKs 

in 
```
app/global-variables.ts
```
populate the infuraId variable

```
public infuraId: string = "";
```

run the Angular command to build project

```
ng serve -o
```

# Compile and Deploy 

run the Angular command:

```
ng build
```

this will create a dist folder with a www folder inside. Take the inside of the www folder and publish to your server.

If you are using the [Bizelop Cordova Shell App](https://github.com/bizelop/Cordova-ShellApp) this is where you would zip the www folder and copy it to the root of your server as well and then increment  your AppVersion.txt to have the Shell App download the update (See [Github repo](https://github.com/bizelop/Cordova-ShellApp) for more info)

# Update smart contract address and networks
To update the smart contract addresses used or if you are looking to add a new network. You can do that in the mint-networks.ts file 

```
app/mint-networks.ts 
```
Note: If you add your own network you need to create your own custom button in the view to select it

Note: If you are developing the depp-link minting functionality then you need to update the `cb-mint-networks.js` file located in `src` folder as well

# Uploading image to IPFS
We have an open API where you can send your NFT image metadata to be uploaded onto IPFS and get back the metadata IPFS hash. This integration is done through [NFT.storage](NFT.storage) on a server side. 

Feel free to use the API end point or create your own endpoint. 

```
https://freenftmint.app/api/UploadFile
```

The endpoint accepts a FormData that expects to have a filename with the extension, metadata NFT name (appears as the name of the NFT), metadata NFT description (appears as the desciption of the NFT), and the file. The uploaded images are not stored on any centralized servers and are uploaded directly to IPFS. the response will be the IPFS hash metadata URL. You then need to construct the final URL. See code below

```
//global-variables.ts
public ipfsUpload: string = "https://freenftmint.app/api/UploadFile";

.
.
.

//mint function in app.components.ts
var data = new FormData();
data.append("filePath", this.file.name);
data.append("fileName", this.imgName);
data.append("fileDescr", this.imgDescr);
data.append("UploadedImage", this.file);

this.rootVars.ipnft = await this.http.post(this.rootVars.ipfsUpload, data).toPromise();
.
.
.
var url = "ipfs://" + this.rootVars.ipnft + "/metadata.json";

```
If you have any issues or questions join the [Discord](https://discord.gg/bizelop)
# License

```
MIT License

Copyright (c) 2022 Bizelop Community Code

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```