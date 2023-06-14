import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageModalComponent } from './message-modal/message-modal.component';
import { MatDialogModule } from '@angular/material';
import { MessageWelcomeComponent } from './message-welcome/message-welcome.component';
import { MessageNpsComponent } from './message-nps/message-nps.component';
import { MessageInputComponent } from './message-input/message-input.component';
import { MessageButtonComponent } from './message-button/message-button.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { MessageNpsSwiperComponent } from './message-nps-swiper/message-nps-swiper.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MessageAddComponent } from './message-add/message-add.component';
import { CPCommonComponentsModule } from '../common/cp-common-components.module';
import { MessageNpsRankingComponent } from './message-nps-ranking/message-nps-ranking.component';
import { MessageWizardComponent } from './message-wizard/message-wizard.component';
import { MessageWelcomeFirebaseComponent } from './message-welcome-firebase/message-welcome-firebase.component';
import { PhotoUploadModule } from '../photo-upload/photo-upload.module';
import { OldUserWithXRecipesComponent } from './old-user-with-x-recipes/old-user-with-x-recipes.component';
import { AnotherAppToForeignUsersComponent } from './another-app-to-foreign-users/another-app-to-foreign-users.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    NgbModalModule,
    TranslateModule.forChild(),
    // NgbModule,
    NgxUsefulSwiperModule,
    CPCommonComponentsModule,
    PhotoUploadModule
  ],
  declarations: [MessageModalComponent, MessageWelcomeComponent, MessageNpsComponent, MessageInputComponent, MessageButtonComponent, MessageNpsSwiperComponent, MessageAddComponent, MessageNpsRankingComponent, MessageWizardComponent, MessageWelcomeFirebaseComponent, OldUserWithXRecipesComponent, AnotherAppToForeignUsersComponent],
  exports: [MessageModalComponent],
  entryComponents: [MessageModalComponent, MessageAddComponent, AnotherAppToForeignUsersComponent]
})
export class MessageModule { }
