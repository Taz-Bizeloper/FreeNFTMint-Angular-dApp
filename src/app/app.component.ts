import { Component, ChangeDetectorRef } from '@angular/core';
import { ethers } from "ethers";

import { HttpClient } from '@angular/common/http';
import { globalVars } from './global-variables';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {

  win: any;

  selectedMintNetwork: any;
  img: string = "https://freeNFTMint.app/assets/images/photos.gif";
  imgName: string = "";
  imgQty = 1;
  imgDescr: string = "";
  file: any;
  thisYear: any = {};
  isCoinbaseWalletAppMobileConnected: boolean = false;
  agree: boolean = false;

  constructor(private http: HttpClient, private chRef: ChangeDetectorRef, public rootVars: globalVars) {
    this.win = (window as any);
    this.thisYear = new Date().getFullYear();

    this.loadCordova();

    var me = this;
    var words = ["Best Moments", "Business Logo", "Favorite Memories", "Selfies", "Beautiful Art"];
    var counter = 1;
    setInterval(function () {
      me.win.document.getElementById("turnText").classList.remove("animate__fadeInUp");
      if (counter == words.length) {
        counter = 0;
      }
      setTimeout(function () {
        me.win.document.getElementById("turnText").classList.add("animate__fadeInUp");
        me.win.document.getElementById("turnText").innerHTML = words[counter];
        counter++;
      }, 200);

    }, 2000)
  }

  loadCordova = async () => {
    var me = this;

    document.addEventListener("deviceready", () => {
      //only fires when ran inside cordova shell App
      this.rootVars.isCordova = true;

      document.addEventListener("offline", function () { }, false);
      document.addEventListener("online", function () { }, false);

      this.win.setATags = function () {
        var aTags = document.getElementsByTagName("a");
        for (var i = 0; i < aTags.length; i++) {
          aTags[i].onclick = (event: any) => {
            var url = event.target.href;
            if (url != "" && url != window.location.href) {
              this.cordova.InAppBrowser.open(url, "_system");
              event.preventDefault();
            }
          }
        }
      };
      this.win.setATags();

      //listen to deep-link and receive info back from CoinBase App
      this.win.universalLinks.subscribe(null, function (eventData: any) {
        if (eventData.url.includes("?sign=")) {
          var signature = eventData.url.split("?sign=")[1];
          var msg = ethers.utils.toUtf8Bytes("Verify Address Ownership For Free NFT Mint App");
          var address = ethers.utils.verifyMessage(ethers.utils.hexlify(msg), signature);
          me.setCoinBaseWalletConnected(address);
        } else if (eventData.url.includes("?minted=")) {
          var txHash = eventData.url.split("?minted=")[1];
          me.showSuccessMint(txHash);
        }
      });

      var onBackKeyDown = () => {
        this.win.Swal.fire({
          title: "Exit App?",
          text: `Do you want to close the app?`,
          type: "info",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          closeOnConfirm: true,
          closeOnCancel: true
        }).then(function (res: any) {
          if (res.isConfirmed) {
            if ((navigator as any).app) {
              (navigator as any).app.exitApp();
            } else if ((navigator as any).device) {
              (navigator as any).device.exitApp();
            } else {
              window.close();
            }
          }
        })
      }
      document.addEventListener("backbutton", onBackKeyDown, false);

      this.win.cordova.plugins.firebase.messaging.requestPermission();

    }, false); //end of ondeviceready
  }


  setCoinBaseWalletConnected = (address: string) => {
    setTimeout(() => {
      this.rootVars.wallet.address = address;
      this.rootVars.isWalletConnected = true;
      var leftSide = this.rootVars.wallet.address.substring(0, 5);
      var rightSide = this.rootVars.wallet.address.substring(this.rootVars.wallet.address.length - 4, this.rootVars.wallet.address.length);
      this.rootVars.wallet.addressShort = leftSide + "..." + rightSide;
      this.isCoinbaseWalletAppMobileConnected = true;
      this.chRef.detectChanges();
    }, 250);
  }

  checkQty = () => {
    if (this.imgQty == 0) {
      this.imgQty = 1;
      this.win.document.getElementById("imgQty").select();
    }

  }

  handleFileChange = (ev: any) => {
    ev = (ev as any);
    var files = ev.target.files;
    this.file = files[0];
    var me = this;
    var reader = new FileReader();
    reader.onload = () => {
      this.img = reader.result as string;
      this.chRef.detectChanges();
    }
    reader.readAsDataURL(this.file);
  }

  launchCoinbaseWalletAppMobileMint = async (ipfsURL: string, qty: number) => {
    var win = (window as any);
    var cbDeppLink = "";
    if (win.cordova.platformId == "android") {
      cbDeppLink += "https://go.cb-w.com/dapp?cb_url=" + encodeURIComponent(globalVars.coinBaseInAppURL + "?mint=true&qty=" + qty + "&ipfs=" + ipfsURL);
      cbDeppLink += "&cb_callback=bizelop";
    }
    else {
      cbDeppLink += "cbwallet://dapp?url=" + encodeURIComponent(globalVars.coinBaseInAppURL + "?mint=true&qty=" + qty + "&ipfs=" + ipfsURL);
    }
    win.cordova.InAppBrowser.open(cbDeppLink, "_system");
  }

  mint = async () => {
    if (this.imgName == "" || this.imgDescr == "") {
      this.rootVars.log("Please enter a name and a description");
      return;
    }

    var me = this;
    var swal = this.win.Swal;


    if (!this.rootVars.ipnft) {
      swal.fire({
        title: 'Uploading image to IPFS...',
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          swal.showLoading();
        }
      });

      var data = new FormData();
      data.append("filePath", this.file.name);
      data.append("fileName", this.imgName);
      data.append("fileDescr", this.imgDescr);
      data.append("UploadedImage", this.file);

      this.rootVars.ipnft = await this.http.post(this.rootVars.ipfsUpload, data).toPromise();
      if (this.rootVars.ipnft == "" || this.rootVars.ipnft == "bad") {
        this.rootVars.ipnft = undefined;
        swal.fire("Error Uploading", "Sorry there was an error uploading to IPFS. Please try again or reach out to us if issue persists.", "error");
        return;
      }
    }
    var url = "ipfs://" + this.rootVars.ipnft + "/metadata.json";

    swal.fire({
      title: 'Uploaded! Open Your Connected Wallet App To Mint',
      allowEscapeKey: false,
      icon: "success",
      text: "Your image is now stored on IPFS. Navigate to your connected wallet App and complete the mint transaction",
      allowOutsideClick: false,
      confirmButtonText: "Resend Transaction"
    }).then(function () {
      me.mint();
    });

    if (this.isCoinbaseWalletAppMobileConnected) {
      this.launchCoinbaseWalletAppMobileMint(this.rootVars.ipnft, this.imgQty);
      return
    }

    try {
      var tx = await this.rootVars.smartContract.mint(this.rootVars.wallet.address, url, this.imgQty);
    }
    catch (ex) {
      swal.fire("Transaction rejected", "You rejected the mint transaction", "error");
      return;
    }
    console.log(tx);
    this.showSuccessMint(tx.hash);
  }

  showSuccessMint = (hash: any) => {
    this.rootVars.etherScanUrl = "https://" + (this.rootVars.selectedMintNetwork.name == "mainnet" ? "" : this.rootVars.selectedMintNetwork.name + ".") + "etherscan.io/tx/" + hash;
    var swal = this.win.Swal;
    swal.fire({
      title: "MINTED !",
      icon: "success",
      html: "Successfully minted image! <br/> <a target='_blank' href='" + this.rootVars.etherScanUrl + "' >View on block explorer</a>",
    }).then(function () {
      window.location.reload();
    });
    if (this.rootVars.isCordova) {
      var me = this;
      setTimeout(function () {
        me.win.setATags();
      }, 250);

    }
  }


}


