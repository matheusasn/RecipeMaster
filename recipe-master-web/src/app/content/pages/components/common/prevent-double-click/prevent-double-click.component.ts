import { Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { throttleTime, debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[preventDoubleClick]'
})
export class CpPreventDoubleClick implements OnInit, OnDestroy {
  @Input()
  throttleTime = 500;

  @Output()
  throttledClick = new EventEmitter();

  private clicks = new Subject();
  private subscription: Subscription;

  constructor() { }

  ngOnInit() {
    this.subscription = this.clicks.
		pipe(
			debounceTime(100)
		).
		pipe(
      throttleTime(this.throttleTime)
    ).subscribe(e => this.emitThrottledClick(e));
  }

  emitThrottledClick(e) {
    this.throttledClick.emit(e);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @HostListener('click', ['$event'])
  clickEvent(event) {
    event.preventDefault();
    event.stopPropagation();
    this.clicks.next(event);
  }
}
