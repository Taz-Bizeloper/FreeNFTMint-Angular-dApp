import { Component, OnInit } from '@angular/core';
import { globalVars } from '../global-variables';
import { mintNetworks } from '../mint-networks';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnInit {

  constructor(public rootVars: globalVars) {
    var networkedCached = rootVars.getLocalStorage("selectedNetwork");
    if (networkedCached != null) {
      this.setSelectedMintNetwork(networkedCached);
    } else {
      this.setSelectedMintNetwork("mainnet");
    }
  }

  ngOnInit(): void {
  }
  setSelectedMintNetwork = (network: string) => {
    this.rootVars.setLocalStorage("selectedNetwork", network);
    this.rootVars.selectedMintNetwork = mintNetworks[network];
    if (this.rootVars.isWalletConnected && this.rootVars.wallet.network.name.toLowerCase() != this.rootVars.selectedMintNetwork.name.toLowerCase()) {
      (window as any).Swal.fire("Switch Networks", "Please connect your wallet to " + this.rootVars.selectedMintNetwork.name + " network");
    }
  }
}
