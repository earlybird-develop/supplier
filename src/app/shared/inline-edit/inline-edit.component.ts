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
  public submitToService = false;
  @Input()
  public disabled = false;

  @Input()
  public placeholder = '';

  @Output('change')
  public change: EventEmitter<number> = new EventEmitter();

  private _propagateChange: Function = () => null;

  public bsModalRef: BsModalRef;

  constructor(@Attribute('black') _black: string,
    private modalService: BsModalService,
    private _route: ActivatedRoute
  ) {
    this.black = typeof _black === 'string';
    this.buyId = this._route.parent.snapshot.params.id;
  }

  public apply(): void {
    this._propagateChange(this.value);
    this.close();

    if (localStorage.getItem('notOffer') !== 'true') {
      //  this.bsModalRef = this.modalService.show(DialogOffer, Object.assign({ initialState }, { class: 'dialog-offer', initialState }));
      this.submitToService = false;
    } else {
      this.submitToService = true;
    }
  }
  public checkLocalStorage(): boolean {
    return  this.submitToService;
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
