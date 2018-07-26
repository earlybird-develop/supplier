import { Alias, Model } from 'tsmodels';

export class Invoice extends Model {
  @Alias('inv_id') public invId: string;
  @Alias('is_included') public included: number;
  @Alias('is_clearing') public clearing: number;
  @Alias('invoice_no') public invoiceId: number;
  @Alias('original_paydate') public originalPaydate: string;
  @Alias('inv_dpe') public invDpe: number;
  @Alias('invoice_amount') public invoiceAmount: number;
  @Alias('discount_rate') public discountRate: number;
  @Alias() public discount: number;

  public _checked = false;

  constructor(data?) {
    super();

    if (data) {
      this._fromJSON(data);
    }
  }

  public isIncluded(): boolean {
    return !!this.included;
  }

  public isIncludedClass(): string {
    if( this.included == 1){
      return 'included';
    }else{
      return 'noincluded';
    }
  }

  public isClearing(): boolean {
    return !!this.clearing;
  }
}
