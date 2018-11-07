import {
  Component, Input, forwardRef, Output, EventEmitter, Attribute
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DialogOffer } from '../dialog-offer/dialog-offer.page'

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
  @Input()
  public disabled = false;

  @Input()
  public placeholder = '';

  @Output('change')
  public change: EventEmitter<number> = new EventEmitter();

  private _propagateChange: Function = () => null;
  public bsModalRef: BsModalRef;


  constructor( @Attribute('black') _black: string, private modalService: BsModalService) {
    this.black = typeof _black === 'string';
  }

  public apply(): void {
    this._propagateChange(this.value);
    this.close();

    const initialState = {
      values: this.value
    };
    this.bsModalRef = this.modalService.show(DialogOffer, Object.assign({initialState}, { class: 'dialog-offer', initialState }));

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
