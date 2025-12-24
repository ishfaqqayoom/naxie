// @ts-nocheck
/**
 * Angular module for Naxie
 * 
 * Note: Requires @angular/core and @angular/common to be installed
 * This file is excluded from TypeScript compilation (see tsconfig.json)
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NaxieChatComponent } from './naxie-chat.component';

@NgModule({
  declarations: [NaxieChatComponent],
  imports: [CommonModule],
  exports: [NaxieChatComponent],
})
export class NaxieChatModule {}
