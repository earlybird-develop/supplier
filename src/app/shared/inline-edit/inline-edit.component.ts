import { Component, Input, forwardRef, Output, EventEmitter, Attribute } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DialogOffer } from '../../supplier/pages/dialog-offer/dialog-offer.page';

@Component({
  selector: 'eb-inline-edit',
  templateUrl: './inline-edit.component.html',
  styleUrls: ['./inline-edit.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InlineEditComponent),
      multi: true
    }
  ]
})
export class InlineEditComponent implements ControlValueAccessor {
  public isOpen = false;
  public value: number;
  public newValue: number;
  public black = false;
  public buyId: string;  // url的buyerId

  @Input()
  public disabled = false;

  @Input()
  public placeholder = '';

  // tslint:disable-next-line:no-output-rename
  @Output('change')
  public change: EventEmitter<number> = new EventEmitter();

  private _propagateChange: Function = () => null;
  // tslint:disable-next-line:member-ordering
  public bsModalRef: BsModalRef;

  // tslint:disable-next-line:max-line-length
  constructor(@Attribute('black') _black: string,
    private modalService: BsModalService,
    private _route: ActivatedRoute) {
    this.black = typeof _black === 'string';
    this.buyId = this._route.parent.snapshot.params.id;
  }

  public apply(): void {
    this._propagateChange(this.value);
    this.close();

    const initialState = {
      values: this.value,
      buyId: this.buyId
    };

    if (localStorage.getItem('notOffer') !== 'true') {
      // tslint:disable-next-line:max-line-length
      this.bsModalRef = this.modalService.show(DialogOffer, Object.assign({ initialState }, { class: 'dialog-offer', initialState }));
    }
  }

  public cancel(): void {
    this.value = this.newValue;
    this.close();
  }

  public open(): void {
    if (!this.disabled) {
      this.isOpen = true;
    }
  }

  public close(): void {
    this.isOpen = false;
  }

  writeValue(value: number) {
    this.value = value;
    this.newValue = this.value;
  }

  registerOnChange(fn: Function) {
    this._propagateChange = fn;
  }

  registerOnTouched(fn) { }

  setDisabledState(fn) { }
}
