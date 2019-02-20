import { Component, OnInit, Input } from '@angular/core';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import { MarketAuthorizationService, SubheaderService } from '../../services';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MarketsHeaderComponent } from '../../components';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-market-authorization',
  templateUrl: './market-authorization.component.html',
  styleUrls: ['./market-authorization.component.scss']
})
export class MarketAuthorizationComponent implements OnInit {
  public marketList = [];
  public currentCompany: any;
  public supplierID: number;
  public supplierInfo: any;
  public supplierEmail: any;
  public pdfBoolean: boolean;
  public bsModalRef: BsModalRef;
  public authFile: any;
  public registerFile: any;
  public uploadRegisterButtonProcess: boolean;
  public uploadAuthButtonProcess: boolean;

  constructor(public marketAuthorizationService: MarketAuthorizationService,
    public modalService: BsModalService,
    private _subheader: SubheaderService,
    private _toastr: ToastrService
  ) { }

  ngOnInit() {
    this.supplierEmail = localStorage.getItem('user_email');
    this.pdfBoolean = true;
    this.uploadRegisterButtonProcess = true;
    this.uploadAuthButtonProcess = true;
    this.supplierInfo = new Object();
    this.loadCustomer();
    this._subheader.show(MarketsHeaderComponent);
  }

//load customer market supplier list
  public loadCustomer() {
    this.marketAuthorizationService.loadMarketsList().subscribe(
      data => {
        this.marketList = data['data'];
        console.log(this.marketList);
      },
      error => {
        console.log(error);
      }
    )
  }
//function to save PDF
  public savePDF() {
    var that = this;
    html2canvas(document.getElementById('pdfContent')).then(function (canvas) {
      var img = canvas.toDataURL("image/jpeg");
      var doc = new jsPDF();
      doc.addImage(img, 'JPEG', 5, 20);
      doc.save('authoriztion.pdf');
      that.bsModalRef.hide();
      that.pdfBoolean = true;
      that.supplierInfo = new Object();
    });
  }
//vertify vender code
  public submitStepOne(event: any, item: any) {
    this.currentCompany = item;
    this.marketAuthorizationService.verifyVendorCode({ vendorcode: item.venderCode, market_id: item.market_id }).subscribe(
      data => {
        console.log(data);
        if(data){
          item.status =1;
        }
        this.ngOnInit();
      },
      error => {
        console.log(error);
      }
    )
  }
//open dialog form to enter supplier infomation
  public openStepTwoForm(item: any, currentMarket: any) {
    this.currentCompany = currentMarket;
    this.supplierInfo.market_id = currentMarket.market_id;
    if (currentMarket.status == 1) {
      this.supplierInfo.id_type = "identity_card";
      this.bsModalRef = this.modalService.show(item);
    } else {
      this.bsModalRef = this.modalService.show(item);
      this.marketAuthorizationService.getSupplierInfo({ market_id: currentMarket.market_id }).subscribe(
        resp => {
          this.supplierInfo = resp['data'];
          this.submitStepTwo(true);
        },
        error => {
          this._toastr.error(error, "Error Message", { positionClass: 'toast-center-center' });
        }
      )
    }

  }
// submit supplier information and start to download pdf
  public submitStepTwo(setSupplierInfoBoolean: boolean) {

    if (!this.supplierInfo.first_name && !this.supplierInfo.last_name) {
      this._toastr.error("请输入员工姓名", "Error Message", { positionClass: 'toast-center-center' });
    } else if (!this.supplierInfo.id_number) {
      this._toastr.error("请输入授权委托指定员工证件号码", "Error Message", { positionClass: 'toast-center-center' });
    } else if (!this.supplierInfo.company_name) {
      this._toastr.error("请输入企业名字", "Error Message", { positionClass: 'toast-center-center' });
    } else if (!this.supplierInfo.company_license) {
      this._toastr.error("请输入企业证照号码", "Error Message", { positionClass: 'toast-center-center' });
    } else {
      this.pdfBoolean = false;
      var that = this;
      if (setSupplierInfoBoolean) {
        setTimeout(function () {
          that.savePDF();
        }, 1000);
      } else {
        this.marketAuthorizationService.setSupplierInfo(this.supplierInfo).subscribe(
          resp => {
            setTimeout(function () {
              that.savePDF();
            }, 1000);
            that.ngOnInit();
          },
          error => {
            this._toastr.error(error, "Error Message", { positionClass: 'toast-center-center' });
          }
        )
      }

    }
  }
//on change auth file
  public authFileEvent(event, item) {

    let file = event.srcElement.files[0];
    if (file.name.slice(file.name.length - 3, file.name.length) != 'pdf') {
      this._toastr.error("请上传PDF文档", "Error Message", { positionClass: 'toast-center-center' });
    } else {
      this.authFile = file;
      item.attach_file.letter = new Object({
        file_name: file.name
      });
      this.currentCompany = item;
    }

  }
// on change register file
  public authRegisterEvent(event, item) {

    let file = event.srcElement.files[0];
    if (file.name.slice(file.name.length - 3, file.name.length) != 'pdf') {
      this._toastr.error("请上传PDF文档", "Error Message", { positionClass: 'toast-center-center' });
    } else {
      this.registerFile = file;
      item.attach_file.license = new Object({
        file_name: file.name
      });
      this.currentCompany = item;
    }
  }
//button to submit auth file
  public uploadAuthFile() {
    console.log(this.authFile);
    this.uploadAuthButtonProcess = false;
    this.marketAuthorizationService.uploadAuthFile({ market_id: this.currentCompany.market_id, file_type: "authorization" }, this.authFile).subscribe(
      resp => {
        this.uploadAuthButtonProcess = true;
        this.ngOnInit();
      },
      error => {
        this.uploadAuthButtonProcess = true;
        this._toastr.error(error['msg'], "Error Message", { positionClass: 'toast-center-center' });
      }
    )
  }
//button to submit register file
  public uploadRegisterFile() {
    this.uploadRegisterButtonProcess = false;
    this.marketAuthorizationService.uploadRegisterFile({ market_id: this.currentCompany.market_id, file_type: "license" }, this.registerFile).subscribe(
      resp => {
        this.uploadRegisterButtonProcess = true;
        this.ngOnInit();
      },
      error => {
        this.uploadRegisterButtonProcess = true;
        this._toastr.error(error['msg'], "Error Message", { positionClass: 'toast-center-center' });
      }
    )
  }

}
