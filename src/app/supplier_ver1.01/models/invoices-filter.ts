import { Alias, Model } from 'tsmodels';

export class InvoicesFilter extends Model {
  public included = false;
  public excluded = false;

  public clearingYes = false;
  public clearingNo = false;

  @Alias('is_included') private _isIncluded;
  @Alias('is_clearing') private _isClearing;
  @Alias('invoice_dpe') public dpe: number[] = [];
  @Alias('invlice_amount') public amount: number[] = [];

  // Override
  public _toJSON(): Object {
    this._isIncluded = -1;

    if (this.included === this.excluded) {
      this._isIncluded = 0;
    } else if (this.included && !this.excluded) {
      this._isIncluded = 1;
    }

    this._isClearing = -1;

    if (this.clearingNo === this.clearingYes) {
      this._isClearing = 0;
    } else if (this.clearingYes && !this.clearingNo) {
      this._isClearing = 1;
    }

    return super._toJSON();
  }

  public toggleDpe(value: number, elem: Event): void {
    if (elem.target['checked']) {
      this.dpe.push(value);
    } else {
      this.dpe.splice(this.dpe.indexOf(value), 1);
    }
  }

  public toggleAmount(value: number, elem: Event): void {
    if (elem.target['checked']) {
      this.amount.push(value);
    } else {
      this.amount.splice(this.amount.indexOf(value), 1);
    }
  }
}
