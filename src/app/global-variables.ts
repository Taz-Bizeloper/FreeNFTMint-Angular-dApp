import { Injectable } from '@angular/core';

@Injectable()

export class globalVars {

    public isWalletConnected = false;
    public wallet: any = {};
    public ipfsUpload: string = "https://freenftmint.app/api/UploadFile"; //api to upload image and get NFT metadata onto IPFS
    public static coinBaseInAppURL: string = "http://cb.mmwirelesstech.com/cbindex.html"; //cordova deep-link to coinbase  
    public selectedMintNetwork: any;
    public etherScanUrl: string = "";
    public isCordova: boolean = false;
    public ipnft: any = undefined;
    public smartContract: any;
    public infuraId: string = "";


    public log = (msg: string) => {
        var swal = (window as any).Swal;
        swal.fire("Oops. Something Went Wrong", msg, "error");
    }


    public setLocalStorage = (key: string, obj: any) => {
        window.localStorage.setItem(key, obj);
    }
    public getLocalStorage = (key: string) => {
        return window.localStorage.getItem(key);
    }

}