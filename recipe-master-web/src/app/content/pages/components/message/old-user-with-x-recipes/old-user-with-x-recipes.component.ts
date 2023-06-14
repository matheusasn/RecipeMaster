import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CpRoutes } from '../../../../../core/constants/cp-routes';
import { MessageType } from '../../../../../core/models/business/dto/message';

@Component({
  selector: 'm-old-user-with-x-recipes',
  templateUrl: './old-user-with-x-recipes.component.html',
  styleUrls: ['./old-user-with-x-recipes.component.scss']
})
export class OldUserWithXRecipesComponent implements OnInit {

	@Input() message:Message;
	@Output() onSubmit:EventEmitter<any> = new EventEmitter<any>();
	step: number = 1;
	form:FormGroup;

  constructor(private formBuilder:FormBuilder,
		private _router: Router) { }

  ngOnInit() {
		this.buildForm();
  }

	private buildForm() {
		this.form = this.formBuilder.group({
			feedback: ['']
		})
	}

	nextStep() {
		this.step = this.step + 1;
	}

	showPlansPage() {
		this.doCancel();
		this._router.navigate([CpRoutes.PLAN_SIGN]);
	}

	sendFeedback() {
		this.nextStep();
		if (this.form.invalid) {
			console.log('Formulário inválido', this.form)
			return;
		}
		this.onSubmit.emit({
			title: 'Mensagem automática usuário antigo no plano gratuito que possui 6 ou mais receitas',
			type: MessageType.OLD_USER_WITH_X_RECIPES,
			data: this.form.value.feedback
		});
	}

	doCancel() {
		this.onSubmit.emit({
			cancel: true
		});
	}

}
