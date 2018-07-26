import { Alias, Model } from 'tsmodels';

export class HistoryMarket extends Model {
  @Alias('awarded_amount') public awardedAmount: number;
  @Alias('awarded_discount') public awardedDiscount: number;
  @Alias('average_discount') public averageDiscount: number;
  @Alias() public currency: string;

  constructor(data?) {
    super();

    if (data) {
      this._fromJSON(data);
    }
  }
}
