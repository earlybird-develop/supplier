import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'invoiceFilter',
  pure: false
})
export class InvoiceFilterPipe implements PipeTransform {
  transform(items: any[], fieldDate: any[], fieldInclude: number, fieldAward: number, fieldAmount: any[]): any[] {
    var returnValue = [];
    var startDate = new Date();
    var endDate = new Date();
    if (fieldDate.length > 0) {
      fieldDate = fieldDate.sort();
      for (var j = 0; j < fieldDate.length; j++) {
        switch (fieldDate[j]) {
          case 1:
            endDate = this.addDays(15);
            break;
          case 2:
            startDate = this.addDays(15);
            endDate = this.addDays(30);
            break;
          case 3:
            startDate = this.addDays(30);
            endDate = this.addDays(45);
            break;
          case 4:
            startDate = this.addDays(45);
            endDate = this.addDays(450);
            break;
        }
        for (var i = 0; i < items.length; i++) {
          var originalPaydateTimeStamp = new Date(items[i]['originalPaydate']);
          if (originalPaydateTimeStamp > startDate && originalPaydateTimeStamp <= endDate) {
            returnValue.push(items[i]);
          }
        }
      }
    } else {
      returnValue = items;
    }
    if (fieldInclude == 1) {
      returnValue = returnValue.filter(function (k) {
        return k['included'] == 1;
      })
    }
    if (fieldInclude == -1) {
      returnValue = returnValue.filter(function (k) {
        return k['included'] !== 1;
      })
    }
    if (fieldAward == 1) {
      returnValue = returnValue.filter(function (m) {
        return m['clearing'] == 1;
      })
    }
    if (fieldAward == -1) {
      returnValue = returnValue.filter(function (m) {
        return m['clearing'] == 0;
      })
    }
    if (fieldAmount.length > 0) {
      fieldAmount = fieldAmount.sort();
      var temReturnValue = [];
      for (var n = 0; n < fieldAmount.length; n++) {
        switch (fieldAmount[n]) {
          case 1:
            temReturnValue = temReturnValue.concat(returnValue.filter(function (e) {
              return Number(e['invoiceAmount']) <= 25000;
            }));
            break;
          case 2:
            temReturnValue = temReturnValue.concat(returnValue.filter(function (e) {
              return   Number(e['invoiceAmount']) <= 50000 && Number(e['invoiceAmount']) >25000;
            }));
            break;
          case 3:
            temReturnValue = temReturnValue.concat(returnValue.filter(function (e) {
              return  Number(e['invoiceAmount']) <= 75000 && Number(e['invoiceAmount']) >50000;
            }));
            break;
          case 4:
            temReturnValue = temReturnValue.concat(returnValue.filter(function (e) {
              return  Number(e['invoiceAmount']) > 75000 ;
            }));
            break;
        }
      }
      returnValue=temReturnValue;
    }
    // console.log(items.length + " " + returnValue.length);
    return returnValue;
  }

  addDays(numDays: number) {
    var today = Date.now();
    var returnDate: Date;
    returnDate = new Date(today + numDays * 24 * 60 * 60 * 1000);
    return returnDate;
  }
}
