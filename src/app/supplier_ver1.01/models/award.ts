import { Alias, Model } from 'tsmodels';

export class Award extends Model {
  @Alias('award-id') public id: string;
  @Alias('award_date') public award_date: string;
  @Alias('total_paid') public total_paid: number;
  @Alias('total_discount') public total_discount: number;
  @Alias('average_discount') public average_discount: number;
  @Alias('average_apr') public average_apr: number;
  @Alias('average_dpe') public average_dpe: number;

  constructor(data?) {
    super();

    if (data) {
      this._fromJSON(data);
    }
  }
}
