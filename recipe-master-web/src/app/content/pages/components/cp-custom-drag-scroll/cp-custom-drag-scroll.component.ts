import { DOCUMENT } from "@angular/common";
import { AfterViewInit, Component, ContentChildren, ElementRef, EventEmitter, HostBinding, HostListener, Inject, OnChanges, OnDestroy, Output, QueryList, Renderer2, SimpleChanges, ViewChild } from "@angular/core";
import { CpCustomDragScrollItemDirective } from "./cp-custom-drag-scroll-item";

@Component({
	selector: 'cp-custom-drag-scroll',
	template: `
		<div class="drag-scroll-content" #contentRef>
			<ng-content></ng-content>
		</div>
	`,
	styles: [`
		:host {
			overflow: hidden;
			display: block;
		}
		.drag-scroll-content::-webkit-scrollbar {
			display: none !important;
		}
		.drag-scroll-content {
			display: flex;
			height: 100%;
			overflow: auto;
			white-space: nowrap;
		}
	`]
})
export class CpCustomDragScrollComponent implements OnDestroy, AfterViewInit {

  private _startX: any;

  private _scrollLeft: any;

	private _isDragging = false;

  private _onMouseMoveListener: Function;

  private _onMouseUpListener: Function;

  private _onMouseDownListener: Function;

  private _onScrollListener: Function;

	private _onDragStartListener: Function;

	downX = 0;

	@ViewChild('contentRef') _contentRef: ElementRef;

	@ContentChildren(CpCustomDragScrollItemDirective, { descendants: true }) _children: QueryList<CpCustomDragScrollItemDirective>;

	@HostBinding('style.pointer-events') _pointerEvents = 'auto';

	isPressed = false;

	@Output() reachesLeftBound = new EventEmitter<boolean>();

  @Output() reachesRightBound = new EventEmitter<boolean>();

	@Output() dragStart = new EventEmitter<void>();

  @Output() dragEnd = new EventEmitter<void>();

	get isDragging(): boolean {
		return this._isDragging;
	}

	constructor(
		@Inject(ElementRef) private _elementRef: ElementRef,
    @Inject(Renderer2) private _renderer: Renderer2,
    @Inject(DOCUMENT) private _document: any
	) {

	}

	ngAfterViewInit(): void {
		this._renderer.setAttribute(this._contentRef.nativeElement, 'drag-scroll', 'true');
		this._onMouseDownListener = this._renderer.listen(this._contentRef.nativeElement, 'mousedown', this.onMouseDownHandler.bind(this));
    // prevent Firefox from dragging images
    this._onDragStartListener = this._renderer.listen(this._contentRef.nativeElement, 'dragstart', (e) => {
      e.preventDefault();
    });
		this.checkNavStatus();
	}

	ngOnDestroy() {
    this._renderer.setAttribute(this._contentRef.nativeElement, 'drag-scroll', 'false');
    if (this._onMouseDownListener) {
      this._onMouseDownListener = this._onMouseDownListener();
    }
    if (this._onScrollListener) {
      this._onScrollListener = this._onScrollListener();
    }
    if (this._onDragStartListener) {
      this._onDragStartListener = this._onDragStartListener();
    }
  }

	onMouseMove(event: MouseEvent) {
    if (this.isPressed) {
      this._pointerEvents = 'none';
			this._setIsDragging(true);

			const clientX = (event as MouseEvent).clientX;
			this._contentRef.nativeElement.scrollLeft =
				this._contentRef.nativeElement.scrollLeft - clientX + this.downX;
			this.downX = clientX;
			this.checkNavStatus();
    }
  }

	onMouseDownHandler(event: MouseEvent) {
    const isTouchEvent = event.type === 'touchstart';

    this._startGlobalListening(isTouchEvent);
    this.isPressed = true;

    const mouseEvent = event as MouseEvent;
    this.downX = mouseEvent.clientX;
  }

	onMouseUpHandler(event: MouseEvent) {
    if (this.isPressed) {
      this.isPressed = false;
      this._pointerEvents = 'auto';
			this._setIsDragging(false);
      this._stopGlobalListening();
    }
  }

	private _setIsDragging(value: boolean) {
    if (this._isDragging === value) {
      return;
    }

    this._isDragging = value;
    value ? this.dragStart.emit() : this.dragEnd.emit();
  }


	private _startGlobalListening(isTouchEvent: boolean) {
    if (!this._onMouseMoveListener) {
      const eventName = isTouchEvent ? 'touchmove' : 'mousemove';
      this._onMouseMoveListener = this._renderer.listen('document', eventName, this.onMouseMoveHandler.bind(this));
    }

    if (!this._onMouseUpListener) {
      const eventName = isTouchEvent ? 'touchend' : 'mouseup';
      this._onMouseUpListener = this._renderer.listen('document', eventName, this.onMouseUpHandler.bind(this));
    }
  }

  private _stopGlobalListening() {
    if (this._onMouseMoveListener) {
      this._onMouseMoveListener = this._onMouseMoveListener();
    }

    if (this._onMouseUpListener) {
      this._onMouseUpListener = this._onMouseUpListener();
    }
  }

	@HostListener('wheel', ['$event'])
  public onWheel(event: WheelEvent) {
		if (this._children.length > 3) {
			event.preventDefault();
			this._contentRef.nativeElement.scrollLeft += event.deltaY
			this.checkNavStatus();
		}
  }

	onMouseMoveHandler(event: MouseEvent) {
    this.onMouseMove(event);
  }

	moveRight() {
		this._contentRef.nativeElement.scrollTo({
			left: this._contentRef.nativeElement.scrollLeft + 300,
			behavior: 'smooth'
		})
		const scrollLeftPos = Math.abs(this._contentRef.nativeElement.scrollLeft) + this._contentRef.nativeElement.offsetWidth;
		if (scrollLeftPos >= this._contentRef.nativeElement.scrollWidth * 0.90) {
			this._contentRef.nativeElement.scrollTo({
				left: this._contentRef.nativeElement.scrollWidth + 100,
				behavior: 'smooth'
			})
			this.reachesLeftBound.emit(false);
			this.reachesRightBound.emit(true);
		} else {
			this.checkNavStatus();
		}
	}

	moveLeft() {
		this._contentRef.nativeElement.scrollTo({
			left: this._contentRef.nativeElement.scrollLeft - 300,
			behavior: 'smooth'
		})
		if (this._contentRef.nativeElement.scrollLeft <= this._contentRef.nativeElement.scrollWidth * 0.10) {
			this._contentRef.nativeElement.scrollTo({
				left: 0,
				behavior: 'smooth'
			})
			this.reachesLeftBound.emit(true);
			this.reachesRightBound.emit(false);
		} else {
			this.checkNavStatus();
		}
	}

	checkNavStatus() {
		setTimeout(() => {
			const containerIsLargerThanContent = Boolean(this._contentRef.nativeElement.scrollWidth <=
        this._contentRef.nativeElement.clientWidth);

				if (containerIsLargerThanContent) {
					this.reachesLeftBound.emit(true);
					this.reachesRightBound.emit(true);
				} else if (this.isScrollReachesRightEnd()) {
					// reached right end
					this.reachesLeftBound.emit(false);
					this.reachesRightBound.emit(true);
				} else if (this._contentRef.nativeElement.scrollLeft === 0 &&
					this._contentRef.nativeElement.scrollWidth > this._contentRef.nativeElement.clientWidth) {
					// reached left end
					this.reachesLeftBound.emit(true);
					this.reachesRightBound.emit(false);
				} else {
					// in the middle
					this.reachesLeftBound.emit(false);
					this.reachesRightBound.emit(false);
				}
		}, 0)
	}

	private isScrollReachesRightEnd(): boolean {
    const scrollLeftPos = Math.abs(this._contentRef.nativeElement.scrollLeft) + this._contentRef.nativeElement.offsetWidth;
    return scrollLeftPos >= this._contentRef.nativeElement.scrollWidth;
  }

	@HostListener('window:resize')
  public onWindowResize() {
    this.checkNavStatus();
  }
}
