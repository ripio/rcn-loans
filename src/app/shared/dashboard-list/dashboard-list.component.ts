import { Component, Input } from '@angular/core';
import { Loan } from '../../models/loan.model';

@Component({
  selector: 'app-dashboard-list',
  templateUrl: './dashboard-list.component.html',
  styleUrls: ['./dashboard-list.component.scss']
})
export class DashboardListComponent {
  @Input() title: string;
  @Input() showOptions: boolean;
  @Input() loans: Loan[];
  @Input() loading: boolean;
  @Input() isCurrentLoans: boolean;

  constructor() {}
}
