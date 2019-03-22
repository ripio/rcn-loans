import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
// App Component
import { DialogApproveContractComponent } from '../../dialogs/dialog-approve-contract/dialog-approve-contract.component';
import { DialogClientAccountComponent } from '../../dialogs/dialog-client-account/dialog-client-account.component';
import { DialogClientWalletComponent } from '../../dialogs/dialog-client-wallet/dialog-client-wallet.component';
import { DialogClientNetworkComponent } from '../../dialogs/dialog-client-network/dialog-client-network.component';
import { DialogClientInstructionsComponent } from '../../dialogs/dialog-client-instructions/dialog-client-instructions.component';
import { DialogClientStepsComponent } from '../../dialogs/dialog-client-steps/dialog-client-steps.component';
// App Service
import { Web3Service } from '../../services/web3.service';
import { SidebarService } from '../../services/sidebar.service';
import { TitleService } from '../../services/title.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  account: string;
  makeRotate = false;
  profile: boolean;
  title: string;

  isOpen$: BehaviorSubject<boolean>;
  navToggle: boolean; // Navbar toggled

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private web3Service: Web3Service,
    private sidebarService: SidebarService,
    public titleService: TitleService
  ) {}

  // Toggle Navbar
  sidebarToggle() {
    this.sidebarService.toggleService(this.navToggle = !this.navToggle);
  }

  handleProfile() {
    this.profile = !this.profile;
    if (this.profile) {
      this.router.navigate(['/profile/']);
    } else {
      this.router.navigate(['/requests/']);
    }
  }

  // Open Approve Dialog
  openDialogApprove() {
    this.dialog.open(DialogApproveContractComponent, {});
  }
  // Open Client Dialog
  openDialogClient() {
    this.dialog.open(DialogClientAccountComponent, {});
  }
  // Open Wallet Dialog
  openDialogWallet() {
    this.dialog.open(DialogClientWalletComponent, {});
  }
  // Open Network Dialog
  openDialogNetwork() {
    this.dialog.open(DialogClientNetworkComponent, {});
  }
  // Open Approve Dialog
  async openDialog() {
    if (this.hasAccount) {
      const dialogRef: MatDialogRef<DialogApproveContractComponent> = this.dialog.open(DialogApproveContractComponent, {});
      this.makeRotate = true;
      dialogRef.componentInstance.autoClose = false;
      dialogRef.afterClosed().subscribe(() => {
        this.makeRotate = false;
      });
    } else 
    if (await this.web3Service.requestLogin()) {
      return;
    } 
    if (!this.hasWebWallet){
     this.openDialogWallet();
    } 
    if (this.hasWebWallet && !this.hasAccount){
     this.openDialogClient();
    } 
    if (this.hasWebWallet && !this.correctNet){
     this.openDialogNetwork();
    } 


  //   if (this.hasAccount) {
  //     const dialogRef: MatDialogRef<DialogApproveContractComponent> = this.dialog.open(DialogApproveContractComponent, {});
  //     this.makeRotate = true;
  //     dialogRef.componentInstance.autoClose = false;
  //     dialogRef.afterClosed().subscribe(() => {
  //       this.makeRotate = false;
  //     });
  //   } else if (!this.hasAccount){
  //     this.openDialogClient();
  //   }

  //   if (!this.hasWebWallet){
  //     this.openDialogWallet();
  //   }  else if (!this.correctNet){
  //     this.openDialogNetwork();
  //   } 
  }

  get hasAccount(): boolean {
    return this.account !== undefined;
  }

  get correctNet(): boolean {
    return this.web3Service.correctNet !== false;
  }

  get hasWebWallet(): boolean {
    return this.web3Service.hasWebWallet !== false;
  }

  async loadLogin() {
    if (!this.hasAccount) {
      this.account = await this.web3Service.getAccount();
    }
  }

  ngOnInit() {
    this.sidebarService.currentToggle.subscribe(navToggle => this.navToggle = navToggle);
    this.titleService.currentTitle.subscribe(title => this.title = title);
    this.web3Service.loginEvent.subscribe(() => this.loadLogin());
    this.loadLogin();
  }

  ngAfterViewInit(): any {}
}
