/**
 * Angular type stubs for optional Angular dependency
 * These allow the Angular components to compile without @angular/core installed
 */

// Mock Angular decorators and types when Angular is not installed
export const Component = (): any => () => {};
export const NgModule = (): any => () => {};
export const Input = (): any => () => {};
export const Output = (): any => () => {};
export const ViewChild = (): any => () => {};
export const EventEmitter = class {
  emit(value?: any): void {}
  subscribe(next?: any): any {}
};
export const ElementRef = class {
  nativeElement: any;
};

// Lifecycle interfaces
export interface OnDestroy {
  ngOnDestroy(): void;
}

export interface AfterViewInit {
  ngAfterViewInit(): void;
}

// Common module placeholder
export const CommonModule = {};
