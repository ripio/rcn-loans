var ROUTES_INDEX = {"name":"<root>","kind":"module","className":"AppModule","children":[{"name":"routes","filename":"src/app/app-routing.module.ts","module":"AppRoutingModule","children":[{"path":"","redirectTo":"requests","pathMatch":"full"},{"path":"activity","loadChildren":"./views/active-loans/active-loans.module#ActiveLoansModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/views/active-loans/active-loans.module.ts","module":"ActiveLoansModule","children":[{"path":"","component":"ActiveLoansComponent"}],"kind":"module"}],"module":"ActiveLoansModule"}]},{"path":"address/:address","loadChildren":"./views/address/address.module#AddressModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/views/address/address.module.ts","module":"AddressModule","children":[{"path":"","component":"AddressComponent"}],"kind":"module"}],"module":"AddressModule"}]},{"path":"loan/:id","loadChildren":"./views/loan-detail/loan-detail.module#LoanDetailModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/views/loan-detail/loan-detail.module.ts","module":"LoanDetailModule","children":[{"path":"","component":"LoanDetailComponent"},{"path":"404","component":"LoanDoesNotExistComponent"}],"kind":"module"}],"module":"LoanDetailModule"}]},{"path":"requests","loadChildren":"./views/requested-loan/requested-loan.module#RequestedLoanModule","children":[{"kind":"module","children":[],"module":"RequestedLoanModule"}]},{"path":"404","loadChildren":"./views/not-found/not-found.module#NotFoundModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/views/not-found/not-found.module.ts","module":"NotFoundModule","children":[{"path":"","component":"NotFoundComponent"}],"kind":"module"}],"module":"NotFoundModule"}]},{"path":"**","redirectTo":"/404"}],"kind":"module"}]}
