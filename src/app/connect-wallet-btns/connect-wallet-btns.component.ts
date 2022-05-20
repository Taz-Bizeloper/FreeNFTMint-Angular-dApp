import { Component, OnInit, Input } from '@angular/core';
import { mintNetworks } from "../mint-networks";
import { globalVars } from '../global-variables';
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

@Component({
  selector: 'app-connect-wallet-btns',
  templateUrl: './connect-wallet-btns.component.html',
  styleUrls: ['./connect-wallet-btns.component.scss']
})
export class ConnectWalletBtnsComponent implements OnInit {


  win: any;

  walletConnectProvider: any = {};
  connectedProvider: any = {};

  metaMaskExtProvider: any = false;
  coinBaseProvider: any = false;
  browserExtSupported: any = false;
  coinbaseWallet: any = {};
  constructor(public rootVars: globalVars) {
    this.win = (window as any);

    this.initCoinBaseWallet();
    this.initMetaMaskExt();


  }

  ngOnInit(): void {
  }



  disconnectWallet = async () => {
    this.coinbaseWallet.disconnect();
    await this.connectedProvider.disconnect();
  }

  initMetaMaskExt = async () => {
    if (this.win.ethereum) {
      this.browserExtSupported = true;
      if (this.win.ethereum.providers) {

        var providers = this.win.ethereum.providers;
        for (var i = 0; i < providers.length; i++) {
          var tmpProvider = providers[i];
          if (tmpProvider.isMetaMask) {
            this.metaMaskExtProvider = tmpProvider;
          }
        }
      } else {

        if (this.win.ethereum.isMetaMask) {
          this.metaMaskExtProvider = this.win.ethereum;
        }
      }
    }
  }
  initCoinBaseWallet = async () => {

    var DEFAULT_ETH_JSONRPC_URL = 'https://' + this.rootVars.selectedMintNetwork.name + '.infura.io/v3/' + this.rootVars.infuraId;
    this.coinbaseWallet = new CoinbaseWalletSDK({
      appName: "Free NFT Mint App",
      appLogoUrl: "https://freenftmint.app/assets/images/logo.png",
      darkMode: false
    });

    this.coinBaseProvider = this.coinbaseWallet.makeWeb3Provider(DEFAULT_ETH_JSONRPC_URL, this.rootVars.selectedMintNetwork.chainId)

  }
  initWalletConnect = async () => {

    this.walletConnectProvider = new WalletConnectProvider({
      infuraId: this.rootVars.infuraId
    });

    // Subscribe to accounts change
    this.walletConnectProvider.on("accountsChanged", (accounts: string[]) => {
      this.rootVars.wallet.address = accounts[0];
      var leftSide = this.rootVars.wallet.address.substring(0, 5);
      var rightSide = this.rootVars.wallet.address.substring(this.rootVars.wallet.address.length - 4, this.rootVars.wallet.address.length);
      this.rootVars.wallet.addressShort = leftSide + "..." + rightSide;
    });

    // Subscribe to chainId change
    this.walletConnectProvider.on("chainChanged", async (chainId: number) => {
      if (this.rootVars.selectedMintNetwork.chainId != chainId) {
        this.rootVars.isWalletConnected = false;
        this.win.Swal.fire("Switch Networks", "Please connect your wallet to " + this.rootVars.selectedMintNetwork.name + " network");
      }
    });

    // Subscribe to session disconnection
    this.walletConnectProvider.on("disconnect", (code: number, reason: string) => {
      this.rootVars.isWalletConnected = false;
    });

    //  Enable session (triggers QR Code modal)
  }

  setConnectLinkForMobile = () => {
    //for when loaded within cordova shell app. need to wait until the button is available in document and set listener on it
    setTimeout(() => {
      if (this.win.document.getElementById("walletconnect-connect-button-Connect") != null) {
        this.win.document.getElementById("walletconnect-connect-button-Connect").onclick = (res: any) => {
          var url = (res as any).target.href;
          this.win.cordova.InAppBrowser.open(url, "_system")
        }
      }
      else {
        this.setConnectLinkForMobile();
      }
    }, (500));
  }


  openCoinbaseVerifyInAppLink = async () => {

    var cbDeppLink = "https://go.cb-w.com/dapp?cb_url=" + encodeURIComponent(globalVars.coinBaseInAppURL + "?verify=true");
    if (this.win.cordova.platformId == "android") {

      cbDeppLink += "&cb_callback=bizelop";
    }
    else {
      cbDeppLink += "cbwallet://dapp?url=" + encodeURIComponent(globalVars.coinBaseInAppURL + "?verify=true");
    }

    this.win.cordova.InAppBrowser.open(cbDeppLink, "_system");
    return;
  }

  connectWallet = async (type: string) => {
    try {
      var ethAddresses = [];
      if (type == "walletConnect") {
        this.initWalletConnect();
        if (this.rootVars.isCordova) {
          this.setConnectLinkForMobile();
        }
        ethAddresses = await this.walletConnectProvider.enable();
        this.rootVars.wallet.provider = new ethers.providers.Web3Provider(this.walletConnectProvider);
        this.connectedProvider = this.walletConnectProvider;
      }
      else if (type == "metamask") {
        this.rootVars.wallet.provider = new ethers.providers.Web3Provider(this.metaMaskExtProvider);
        ethAddresses = await this.rootVars.wallet.provider.send("eth_requestAccounts", []);
        this.connectedProvider = this.metaMaskExtProvider;

      }
      else {
        //coinbase
        if (this.rootVars.isCordova) {
          //open deep-link and get signature
          //callback will happen in universal-link deep-link listener
          this.openCoinbaseVerifyInAppLink();
        } else {
          //in browser use Coinbase SDK.
          ethAddresses = await this.coinBaseProvider.enable();
          this.rootVars.wallet.provider = new ethers.providers.Web3Provider(this.coinBaseProvider);
          this.connectedProvider = this.coinBaseProvider;
        }
      }

      this.rootVars.wallet.signer = this.rootVars.wallet.provider.getSigner();
      this.rootVars.wallet.network = await this.rootVars.wallet.provider.getNetwork();

      if (this.rootVars.wallet.network.name == "homestead") {
        this.rootVars.wallet.network.name = "mainnet";
      }

      if (this.rootVars.wallet.network.name.toLowerCase() != this.rootVars.selectedMintNetwork.name.toLowerCase()) {
        var me = this;
        me.win.Swal.fire("Switch Networks", "Please connect your wallet to " + this.rootVars.selectedMintNetwork.name + " network").then(() => {
          me.disconnectWallet();
        });
        return;
      }

      if (Array.isArray(ethAddresses)) {
        this.rootVars.wallet.address = ethAddresses[0];
      } else if (ethAddresses.result) {
        this.rootVars.wallet.address = ethAddresses.result[0];
      }
      else {
        this.rootVars.log("Error getting address. Please try again or contact us")
        return;
      }
      this.rootVars.smartContract = new ethers.Contract(this.rootVars.selectedMintNetwork.contractAddress, mintNetworks[this.rootVars.selectedMintNetwork.name].abi, this.rootVars.wallet.signer);
      this.rootVars.isWalletConnected = true;
      var leftSide = this.rootVars.wallet.address.substring(0, 5);
      var rightSide = this.rootVars.wallet.address.substring(this.rootVars.wallet.address.length - 4, this.rootVars.wallet.address.length);
      this.rootVars.wallet.addressShort = leftSide + "..." + rightSide;
    }
    catch (ex) {
      console.log(ex);
    }

  }



}
