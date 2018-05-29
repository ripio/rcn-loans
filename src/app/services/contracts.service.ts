import { Loan } from '../models/loan.model';
import { Injectable } from '@angular/core';
import { LoanCurator } from './../utils/loan-curator';
import { LoanUtils } from './../utils/loan-utils';
import { environment } from '../../environments/environment';
import { Web3Service } from './web3.service';
import { TxService } from '../tx.service';
import { CosignerService } from './cosigner.service';
import { Utils } from '../utils/utils';
import { HttpClient, HttpResponse } from '@angular/common/http';
import BigNumber from 'bignumber.js';

declare let require: any;

const tokenAbi = require('../contracts/Token.json');
const engineAbi = require('../contracts/NanoLoanEngine.json');
const extensionAbi = require('../contracts/NanoLoanEngineExtension.json');
const oracleAbi = require('../contracts/Oracle.json');

@Injectable()
export class ContractsService {
    private _rcnContract: any;
    private _rcnContractAddress: string = environment.contracts.rcnToken;

    private _rcnEngine: any;
    private _rcnEngineAddress: string = environment.contracts.basaltEngine;
    private _rcnExtension: any;
    private _rcnExtensionAddress: string = environment.contracts.engineExtension;

    constructor(
      private web3: Web3Service,
      private txService: TxService,
      private cosignerService: CosignerService,
      private http: HttpClient
    ) {
      this._rcnContract = this.web3.web3.eth.contract(tokenAbi.abi).at(this._rcnContractAddress);
      this._rcnEngine = this.web3.web3.eth.contract(engineAbi.abi).at(this._rcnEngineAddress);
      this._rcnExtension = this.web3.web3.eth.contract(extensionAbi.abi).at(this._rcnExtensionAddress);
    }

    public async getUserBalanceRCN(): Promise<number> {
        const account = await this.web3.getAccount();
        return new Promise((resolve, reject) => {
          const _web3 = this.web3.web3;
          this._rcnContract.balanceOf.call(account, function (err, result) {
            if (err != null) {
              reject(err);
            }
            resolve(_web3.fromWei(result));
          });
        }) as Promise<number>;
    }

    public async isEngineApproved(): Promise<boolean> {
        const account = await this.web3.getAccount();
        return new Promise((resolve, reject) => {
          const pending = this.txService.getLastPendingApprove(this._rcnContractAddress, this._rcnEngineAddress);
          if (pending !== undefined) {
            console.log('Pending engine approved found', pending);
            resolve(pending);
          } else {
            const _web3 = this.web3.web3;
            this._rcnContract.allowance.call(account, this._rcnEngineAddress, function (err, result) {
              if (err != null) {
                reject(err);
              }

              resolve(_web3.fromWei(result) >= _web3.toWei(1000000000));
            });
          }
        }) as Promise<boolean>;
    }

    public async approveEngine(): Promise<string> {
        const account = await this.web3.getAccount();
        const txService = this.txService;
        const rcnAddress = this._rcnContractAddress;
        const engineAddress = this._rcnEngineAddress;
        return new Promise((resolve, reject) => {
          const _web3 = this.web3.web3;
          this._rcnContract.approve(this._rcnEngineAddress, _web3.toWei(10 ** 32), { from: account }, function (err, result) {
            if (err != null) {
              reject(err);
            } else {
              txService.registerApproveTx(result, rcnAddress, engineAddress, true);
              resolve(result);
            }
          });
        }) as Promise<string>;
    }

    public async dissaproveEngine(): Promise<string> {
      const account = await this.web3.getAccount();
      const txService = this.txService;
      const rcnAddress = this._rcnContractAddress;
      const engineAddress = this._rcnEngineAddress;
      return new Promise((resolve, reject) => {
        const _web3 = this.web3.web3;
        this._rcnContract.approve(this._rcnEngineAddress, 0, { from: account }, function (err, result) {
          if (err != null) {
            reject(err);
          } else {
            txService.registerApproveTx(result, rcnAddress, engineAddress, false);
            resolve(result);
          }
        });
      }) as Promise<string>;
    }
    public async lendLoan(loan: Loan): Promise<string> {
        const account = await this.web3.getAccount();
        const oracleData = await this.getOracleData(loan);

        const cosignerOption = await this.cosignerService.getCosignerOptions(loan);

        let cosigner = '0x0';
        let cosignerData = '0x0';
        if (cosignerOption !== undefined) {
          const cosignerDetail = await cosignerOption.detail;
          cosigner = cosignerDetail.contract;
          cosignerData = cosignerDetail.data;
        }

        return new Promise((resolve, reject) => {
          const _web3 = this.web3.web3;
          this._rcnEngine.lend(loan.id, oracleData, cosigner, cosignerData, { from: account }, function(err, result) {
            if (err != null) {
              reject(err);
            }
            resolve(result);
          });
        }) as Promise<string>;
    }
    public async withdrawFunds(loans: number[]): Promise<string> {
      const account = await this.web3.getAccount();
      return new Promise((resolve, reject) => {
        this._rcnEngine.withdrawalList(loans, account, (err, result) => {
            if (err != null) {
              reject(err);
            }
            resolve(result);
          });
        }) as Promise<string>;
    }
    public async getOracleData(loan: Loan): Promise<string> {
      return new Promise((resolve) => {
        if (loan.oracle === Utils.address_0) {
          console.log('Loan has no oracle');
          resolve('0x');
        } else {
          const web3 = this.web3.web3;
          const oracle = this.web3.web3.eth.contract(oracleAbi.abi).at(loan.oracle);
          oracle.url.call((err, url) => {
            if (url === '') {
              console.log('Oracle does not require data');
              resolve('0x');
            } else {
              this.http.get(url).subscribe((resp: any) => {
                resp.forEach(e => {
                  if (e.currency === loan.currencyRaw) {
                    resolve(e.data);
                    return;
                  }
                });
                console.log('Oracle did not provide data', resp);
                resolve('0x');
              });
            }
          });
        }
      }) as Promise<string>;
    }
    public async getLoan(id: number): Promise<Loan> {
      return new Promise((resolve, reject) => {
        this._rcnExtension.getLoan.call(this._rcnEngineAddress, id, (err, result) => {
          if (err != null) {
            reject(err);
          }
          resolve(LoanUtils.loanFromBytes(this._rcnEngineAddress, id, result));
        });
      }) as Promise<Loan>;
    }
    public async getOpenLoans(): Promise<Loan[]> {
        return new Promise((resolve, reject) => {
          this._rcnExtension.searchOpenLoans.call(this._rcnEngineAddress, 0, 0, (err, result) => {
            if (err != null) {
              reject(err);
            }
            resolve(LoanCurator.curateLoans(this.parseLoansBytes(result)));
          });
        }) as Promise<Loan[]>;
    }
    public async getMyLoans(): Promise<Loan[]> {
      const account = await this.web3.getAccount();
      return new Promise((resolve, reject) => {
        this._rcnExtension.searchLenderLoans.call(this._rcnEngineAddress, account, 0, 0, (err, result) => {
          if (err != null) {
            reject(err);
          }
          resolve(LoanCurator.curateLoans(this.parseLoansBytes(result)));
        });
      }) as Promise<Loan[]>;
    }
    public readPendingWithdraws(loans: Loan[]): [BigNumber, number[]] {
      const pendingLoans = [];
      let total = new BigNumber(0);

      loans.forEach(loan => {
        if (loan.lenderBalance > 0) {
          total += loan.lenderBalance;
          pendingLoans.push(loan.id);
        }
      });

      return [new BigNumber(total), pendingLoans];
    }
    public async getPendingWithdraws(): Promise<[number, number[]]> {
      const account = await this.web3.getAccount();
      return new Promise((resolve, reject) => {
        this.getMyLoans().then((loans: Loan[]) => {
          resolve(this.readPendingWithdraws(loans));
        });
      }) as Promise<[number, number[]]>;
    }
    private parseLoansBytes(bytes: any): Loan[] {
      const loans = [];
      const total = bytes.length / 20;
      for (let i = 0; i < total; i++) {
        const id = parseInt(bytes[(i * 20) + 19], 16);
        const loanBytes = bytes.slice(i * 20, i * 20 + 20);
        loans.push(LoanUtils.loanFromBytes(this._rcnEngineAddress, id, loanBytes));
      }
      return loans;
    }
}
