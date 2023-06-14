import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CpLoadingService } from '../../../../core/services/common/cp-loading.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CpBaseComponent } from '../../common/cp-base/cp-base.component';
import { Messages } from '../../../../core/constants/messages';
import { CpRoutes } from '../../../../core/constants/cp-routes';
import { SupportService } from '../../../../core/services/business/support.service';
import { ApiResponse } from '../../../../core/models/api-response';
import { CpLocalStorageService } from '../../../../core/services/common/cp-localstorage.service';
import { User } from '../../../../core/models/user';
import { TranslateService } from '@ngx-translate/core';
import { TutorialItem } from '../../components/tutorial-card/tutorial-card.component';
import { CPTutorial } from "../../../../config/tutorial.config";
import { CommonQuestion } from '../../../../core/models/business/common-question';
import { debounceTime, switchMap } from 'rxjs/operators';
import { TranslationService } from '../../../../core/metronic/services/translation.service';
import { HttpClient } from '@angular/common/http';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { DialogSuportComponent } from '../../tutorials/suport/dialog-suport/dialog-suport.component';



const ASSUNTOS:string[] = [
    'SUPPORT_PAGE.SELECT_TXT1',
    'SUPPORT_PAGE.SELECT_TXT2',
    'SUPPORT_PAGE.SELECT_TXT3',
    'SUPPORT_PAGE.SELECT_TXT4',
    'SUPPORT_PAGE.SELECT_TXT5',
];

@Component({
  selector: 'm-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent extends CpBaseComponent implements OnInit {

  formGroup:FormGroup;
	searchForm:FormGroup;
  assuntos:string[] = ASSUNTOS;
  supportSent:boolean = false;
  error:boolean = false;

  isCollapsed = []

  tutorialItens:TutorialItem[] = CPTutorial.itens;

	language: string;
	questions: CommonQuestion[] = [];
	lang: string;

  constructor(  _cdr: ChangeDetectorRef,
                _loading: CpLoadingService,
                private _formBuilder: FormBuilder,
                private _toast: ToastrService,
                private _router: Router,
                private supportService: SupportService,
                private _cpLocalStorageService: CpLocalStorageService,
								private translationService: TranslationService,
								private http: HttpClient,
                private translate: TranslateService,
								private _dialog: MatDialog,) {
    super(_loading, _cdr);
  }

  ngOnInit() {
		this.translate.get('TRANSLATOR.LINGUAGEM').subscribe(
			data => {
				this.buildForm();
				this.supportService.getQuestions(data, '').subscribe(
					response => {
						this.questions = response.data
						this.questions.forEach((question, index) => this.isCollapsed[index] = true)
					}
				);
				this.language = data;
			}
		);

		this.translationService.getSelectedLanguage().subscribe(lang => {
			this.lang = lang;
		});
  }

  urlTutorial:string;

  openTutorial(url:string) {
    this.urlTutorial = url;
  }

  doCloseTutorial(ev:any) {
    this.urlTutorial = null;
  }

	toggleCollapse(index: number) {
		this.isCollapsed[index] = !this.isCollapsed[index];
	}

	getQuestionTitle(question: CommonQuestion) {
		if (this.language === 'pt') return question.title;
		else if (this.language === 'es') return question.esTitle;
		else return question.enTitle;
	}

	getQuestionAnswer(question: CommonQuestion) {
		if (this.language === 'pt') return question.answer;
		else if (this.language === 'es') return question.esAnswer;
		else return question.enAnswer;
	}

  buildForm() {
    this.formGroup = this._formBuilder.group({
      assunto: ['', Validators.required],
      mensagem: ['', Validators.required],
      imagem: [null, []]
    });

		this.searchForm = this._formBuilder.group({
			searchTerm: ['', []]
		})

    this.searchForm.get('searchTerm')
      .valueChanges
      .pipe(
        debounceTime(400),
        switchMap( (name:string = "") => {
					return this.supportService.getQuestions(this.language, name)
				})).subscribe(response => {
					this.questions = response.data;
					this.onChangeComponent();
				})
  }

  private toFormData<T>( formValue: T ) {
    const formData = new FormData();

    for ( const key of Object.keys(formValue) ) {
      const value = formValue[key];
      formData.append(key, value);
    }

    return formData;
  }

  onFileChange(event) {
    let reader = new FileReader();

    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.formGroup.patchValue({
          imagem: file
        });

        // need to run CD since file load runs outside of zone
        this._cdr.markForCheck();
      };
    }
    else {
      console.log("não fez nada!!!!");
    }
  }

  send() {

    let support:any = this.formGroup.value;

    let user = this._cpLocalStorageService.getLoggedUser();

    support.emailFrom = user.email;
    support.nome = user.name;

    this.supportSent = false;
    this._loading.show();

    this.translate.get(support.assunto).subscribe(
			data => {
        support.assunto = data
      }
		);

    this.supportService.sendMail(this.toFormData(support)).subscribe( (response:ApiResponse) => {

      this._loading.hide();

      this.formGroup.reset();
      this.supportSent = true;
      this.error = false;

      this._toast.success(Messages.SUCCESS);
      this.onChangeComponent();

    }, err => {
      this._loading.hide();

      this.formGroup.reset();
      this.supportSent = true;
      this.error = true;

      this.onChangeComponent();

    } );

  }

  sendAgain() {
    this.supportSent = false;
  }

  girar(esc) {
    document.getElementById(esc).classList.toggle('girar');
  }

  //Funções para as actions do SAIBA MAIS
  action1(e) {
    e.preventDefault();
    window.open('https://recipemasterapp.com/tutorial/como_criar_uma_ficha_tecnica/.br', '_blank');
  }
  action2(e) {
    e.preventDefault();
    window.open('https://recipemasterapp.com/tutorial/como_criar_uma_ficha_tecnica/.br', '_blank');
  }
  action3(e) {
    e.preventDefault();
    window.open('https://recipemasterapp.com/tutorial/como_criar_uma_ficha_tecnica/.br', '_blank');
  }
  action4(e) {
    e.preventDefault();
    window.open('https://recipemasterapp.com/tutorial/como_criar_uma_ficha_tecnica/.br', '_blank');
  }
  action5(e) {
    e.preventDefault();
    window.open('https://recipemasterapp.com/tutorial/como_criar_uma_ficha_tecnica/.br', '_blank');
  }
  action6(e) {
    e.preventDefault();
    window.open('https://recipemasterapp.com/tutorial/como_criar_uma_ficha_tecnica/.br', '_blank');
  }
  action7(e) {
    e.preventDefault();
    window.open('https://recipemasterapp.com/tutorial/como_criar_uma_ficha_tecnica/.br', '_blank');
  }

		private async showLink(link: string) {
		const iOSDevice = this._cpLocalStorageService.isIOS()
		// @ts-ignore
		const isAndroid = typeof Android !== 'undefined'

		if (iOSDevice || isAndroid) {
			const res = await this.http.get(link, { responseType: 'blob' }).toPromise()
			const reader = new FileReader();
			reader.onloadend = () => {
				const base64Pdf = reader.result
				const filename = 'file.pdf'

				if (isAndroid) {
					// @ts-ignore
					Android.downloadPdfWithName(base64Pdf,filename);
				} else if (iOSDevice) {
					// @ts-ignore
					window.webkit.messageHandlers.ios.postMessage({ base64: base64Pdf, fileName: filename });
				}
			}

			reader.readAsDataURL(res);
		} else {
			window.open(link);
		}
	}

	async showPrivacyPolicy() {
		await this.showLink('../../../../../assets/Privacy_Policy.pdf')
	}

	async showTerms() {
		const links = {
			'pt': '../../../../../assets/TERMS_AND_CONDITIONS.pdf',
			'en': '../../../../../assets/TERMS_AND_CONDITIONS.pdf',
			'es': '../../../../../assets/TERMINOS_Y_CONDICIONES.pdf'
		}

		const correctLink = links[this.lang]
		await this.showLink(correctLink)
	}

	openDialog(type: string): void {
		const dialogConfig: MatDialogConfig = {
			maxWidth: '90vw',
			width: '587px',
			maxHeight: '95vh',
			hasBackdrop: true,
			closeOnNavigation: true,
			panelClass: 'tutorial-dialog-container'
		};

		const optionsDialog = {
			dialogSuport: DialogSuportComponent
		}

		const dialogComponent = optionsDialog[type];
		this._dialog.open(dialogComponent, dialogConfig);
	}

}
