import { Alias, Model } from 'tsmodels';

export class MarketTotal extends Model {
  @Alias('available_amount') public availableAmount: number;
  @Alias('average_apr') public averageApr: number;
}

export class MarketClearing extends Model {
  @Alias('available_amount') public availableAmount: number;
  @Alias('average_dpe') public averageDpe: number;
}

export class MarketNonClearing extends Model {
  @Alias('available_amount') public availableAmount: number;
  @Alias('average_dpe') public averageDpe: number;
}

export class MarketDiscount extends Model {
  @Alias() public amount: number;
  @Alias('average_discount') public averageDiscount: number;
  @Alias('average_apr') public averageApr: number;
}

export class Market extends Model {
  public discountMarket: MarketDiscount;
  public discount: number;
  public clearingPercentage;
  public showProcess;

  @Alias() public currency: string;
  @Alias('buyer') public marketCode: string;
  @Alias() public vendorcode: string;
  @Alias() public supplier: string;
  @Alias() public paydate: string;
  @Alias('buyer_id') public id: string;
  @Alias('buyer_name') public marketName: string;
  @Alias('buyer_status') public marketStatus: number;
  @Alias('currency_sign') public currencySign: string;
  @Alias('is_participation') public isParticipation: number;
  @Alias('offer_value') public offerApr: number;
  @Alias('avg_dpe') public DPE: number;
  @Alias('next_paydate') public nextPaydate: string;
  @Alias('min_payment') public minPayment: number;
  @Alias('offer_status') public offerStatus: number;
  @Alias('total_amount') public totalAmount: number;
  @Alias('avaibale_amount') public availableAmount: number;
  @Alias('clearing_amount') public clearingAmount: number;
  @Alias('noclearing_amount') public noclearingAmount: number;
  @Alias('total', MarketTotal) public total: MarketTotal;
  @Alias('clearing', MarketClearing) public clearing: MarketClearing;
  @Alias('nonclearing', MarketNonClearing) public nonClearing: MarketNonClearing;

  constructor(data?) {
    super();
    if (data) {
      this._convertDiscount(data['discount']);
      this._fromJSON(data);
    }
  }

  public isLocked(): boolean {
    // 0 => normal status offer button not be locked, can submit the offer apr
    // 1 => waiting status, offer button need to be locked
    return !!this.offerStatus;
  }

  public _fromJSON(data) {
    super._fromJSON(data);
    if (!this.isObject(data.total)) {
      return;
    }
    this.clearingPercentage =
      (this.clearing.availableAmount / this.total.availableAmount) * 100;
    this.clearingPercentage = +this.clearingPercentage.toFixed(2);
  }

  public isNewMarket(): boolean {
    return this.offerApr === 0;
  }

  private isObject(item): boolean {
    return Object.prototype.toString.call(item) === '[object Object]';
  }

  private _convertDiscount(data): void {
    if (this.isObject(data)) {
      this.discountMarket = new MarketDiscount();
      this.discountMarket._fromJSON(data);
    } else {
      this.discount = data;
    }
  }
}
