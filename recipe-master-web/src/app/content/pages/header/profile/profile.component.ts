import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UserDTO } from '../../../../core/models/security/dto/user-dto';
import { CpLocalStorageService } from '../../../../core/services/common/cp-localstorage.service';
import { User } from '../../../../core/models/user';
import { UserService } from '../../../../core/auth/user.service';

@Component({
  selector: 'm-profile',
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {

  user: UserDTO;

  constructor(
	  private localStorage: CpLocalStorageService,
	  private userService: UserService
	){ }

  ngOnInit() {
    let user: User = this.localStorage.getLoggedUser();
    if (user) {
      this.userService.findByIdReduced(user.id)
        .subscribe((res) => {
          this.user = res.data;
        }, err => {
          console.log(err);
        });
    }

  }

}
