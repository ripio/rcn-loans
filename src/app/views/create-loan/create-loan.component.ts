import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Loan } from './../../models/loan.model';
import { environment } from './../../../environments/environment';
// App Components
import { DialogGenericErrorComponent } from '../../dialogs/dialog-generic-error/dialog-generic-error.component';
// App Services
import { ContractsService } from './../../services/contracts.service';
import { TxService, Tx, Type } from './../../services/tx.service';

@Component({
  selector: 'app-create-loan',
  templateUrl: './create-loan.component.html',
  styleUrls: ['./create-loan.component.scss']
})
export class CreateLoanComponent {

  loan: Loan;
  loanWasCreated: boolean;
  createPendingTx: Tx = undefined;

  // progress bar
  startProgress: boolean;
  finishProgress: boolean;
  cancelProgress: boolean;

  // subscriptions
  txSubscription: boolean;

  constructor(
    private location: Location,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private contractsService: ContractsService,
    private txService: TxService
  ) { }

  /**
   * Update loan
   * @param loan Loan model
   */
  detectUpdateLoan(loan: Loan) {
    this.loan = loan;
  }

  /**
   * Create loan
   * @param loan Loan model
   * @param form Create loan form data
   */
  async detectCreateLoan({
    loan,
    form
  }) {
    const pendingTx: Tx = this.createPendingTx;
    this.loan = loan;

    if (pendingTx && pendingTx.confirmed) {
      this.router.navigate(['/', 'loan', this.loan.id]);
      return;
    }

    try {
      const id: string = loan.id;
      const amount: number = loan.amount;
      const tx: string = await this.contractsService.requestLoan(
        form.amount,
        form.model,
        form.oracle,
        form.account,
        form.callback,
        form.salt,
        form.expiration,
        form.encodedData
      );

      this.location.replaceState(`/create/${ id }`);
      this.txService.registerCreateTx(tx, {
        engine: environment.contracts.diaspore.loanManager,
        id,
        amount
      });
      this.retrievePendingTx();
    } catch (e) {
      // Don't show 'User denied transaction signature' error
      if (e.stack.indexOf('User denied transaction signature') < 0) {
        this.showMessage('A problem occurred during loan creation', 'snackbar');
      }
      throw Error(e);
    }
  }

  /**
   * Retrieve pending Tx
   */
  private retrievePendingTx() {
    this.createPendingTx = this.txService.getLastPendingCreate(this.loan);

    if (this.createPendingTx !== undefined) {
      const loanId: string = this.loan.id;
      this.location.replaceState(`/create/${ loanId }`);
      this.startProgress = true;
      this.trackProgressbar();
    }
  }

  /**
   * Track progressbar value
   */
  private trackProgressbar() {
    if (!this.txSubscription) {
      this.txSubscription = true;
      this.txService.subscribeConfirmedTx(async (tx: Tx) => {
        if (tx.type === Type.create && tx.tx === this.createPendingTx.tx) {
          this.finishLoanCreation();
        }
      });
    }
  }

  /**
   * Finish loan creation and check status
   */
  private async finishLoanCreation() {
    const loanWasCreated = await this.contractsService.loanWasCreated(this.loan.id);

    if (loanWasCreated) {
      this.finishProgress = true;
      this.loanWasCreated = true;
    } else {
      this.cancelProgress = true;
      this.loanWasCreated = false;
      setTimeout(() => {
        this.showMessage('The loan could not be created', 'dialog');
        this.startProgress = false;
        this.createPendingTx = undefined;
      }, 1000);
    }
  }

  /**
   * Show dialog or snackbar with a message
   * @param message The message to show in the snackbar
   * @param type UI Format: dialog or snackbar
   */
  private showMessage(message: string, type: 'dialog' | 'snackbar') {
    switch (type) {
      case 'dialog':
        const error: Error = {
          name: 'Error',
          message: message
        };
        this.dialog.open(DialogGenericErrorComponent, {
          data: {
            error
          }
        });
        break;

      case 'snackbar':
        this.snackBar.open(message , null, {
          duration: 4000,
          horizontalPosition: 'center'
        });
        break;

      default:
        console.error(message);
        break;
    }
  }

}
