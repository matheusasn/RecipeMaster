import { Pipe, PipeTransform } from '@angular/core';
import { PerfilEnum } from '../core/models/security/perfil.enum';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'profileInfo'
})


export class ProfileInfoPipe implements PipeTransform {

    constructor( private translate: TranslateService){}

    getLabel(perfil: PerfilEnum):string {
        
        let auxNone: string;
        let auxAdmin: string;
        let auxUser: string;
        let auxUserBasic: string;
        let auxUserPro: string;
        let auxUserProNutri: string;
        let auxUserBeta: string;
        let auxUserInternal: string;
        let auxUserDefault: string;

        this.translate.get('PROFILE.PERFIL_ENUM.NONE').subscribe(data => auxNone = data);
        this.translate.get('PROFILE.PERFIL_ENUM.ADMIN').subscribe(data => auxAdmin = data);
        this.translate.get('PROFILE.PERFIL_ENUM.USER').subscribe(data => auxUser = data);
        this.translate.get('PROFILE.PERFIL_ENUM.USER_BASIC').subscribe(data => auxUserBasic = data);
        this.translate.get('PROFILE.PERFIL_ENUM.USER_PRO').subscribe(data => auxUserPro = data);
        this.translate.get('PROFILE.PERFIL_ENUM.USER_PRO_NUTRI').subscribe(data => auxUserProNutri = data);
        this.translate.get('PROFILE.PERFIL_ENUM.USER_BETA').subscribe(data => auxUserBeta = data);
        this.translate.get('PROFILE.PERFIL_ENUM.USER_INTERNAL').subscribe(data => auxUserInternal = data);
        this.translate.get('PROFILE.PERFIL_ENUM.USER_DEFAULT').subscribe(data => auxUserDefault = data);

        switch(perfil) {
            case PerfilEnum.NONE:
                return auxNone;
            case PerfilEnum.ADMIN:
                return auxAdmin;
            case PerfilEnum.USER:
                return auxUser;
            case PerfilEnum.USER_BASIC:
                return auxUserBasic;
            case PerfilEnum.USER_PRO:
                return auxUserPro;
            case PerfilEnum.USER_PRO_NUTRI:
                return auxUserProNutri;
            case PerfilEnum.USER_BETA:
                return auxUserBeta;
            case PerfilEnum.USER_INTERNAL:
                return auxUserInternal;
            default:
                return auxUserDefault;
        }

    }

    transform(perfis: any[], args?: any): any {
        let auxNone: string;
        let auxAdmin: string;
        let auxUser: string;
        let auxUserBasic: string;
        let auxUserPro: string;
        let auxUserProNutri: string;
        let auxUserBeta: string;
        let auxUserInternal: string;
        let auxUserDefault: string;

        this.translate.get('PROFILE.PERFIL_ENUM.NONE').subscribe(data => auxNone = data);
        this.translate.get('PROFILE.PERFIL_ENUM.ADMIN').subscribe(data => auxAdmin = data);
        this.translate.get('PROFILE.PERFIL_ENUM.USER').subscribe(data => auxUser = data);
        this.translate.get('PROFILE.PERFIL_ENUM.USER_BASIC').subscribe(data => auxUserBasic = data);
        this.translate.get('PROFILE.PERFIL_ENUM.USER_PRO').subscribe(data => auxUserPro = data);
        this.translate.get('PROFILE.PERFIL_ENUM.USER_PRO_NUTRI').subscribe(data => auxUserProNutri = data);
        this.translate.get('PROFILE.PERFIL_ENUM.USER_BETA').subscribe(data => auxUserBeta = data);
        this.translate.get('PROFILE.PERFIL_ENUM.USER_INTERNAL').subscribe(data => auxUserInternal = data);
        this.translate.get('PROFILE.PERFIL_ENUM.USER_DEFAULT').subscribe(data => auxUserDefault = data);

        try {

            if(args && args == 'ALL') {
                let label:string = "";

                perfis.forEach( (_p:PerfilEnum[]) => {
                    
                    let freeAccount:boolean = true;
                    if(_p.includes(PerfilEnum.USER_BASIC) || _p.includes(PerfilEnum.USER_PRO) || _p.includes(PerfilEnum.USER_PRO_NUTRI)) {
                        freeAccount = false;
                    }
                    _p.forEach( (p:PerfilEnum, index) => {
                        if(p == PerfilEnum.USER && !freeAccount) {
                        }
                        else {
                            label += this.getLabel(p);
                            if(index < (_p.length - 1)) {
                                label += ', ';
                            }
                        }
                    });
                });
                return label;
            }
        }
        catch(e) {
            console.warn(e.message);
        }

        try {
            if( perfis.includes(PerfilEnum.ADMIN) ) {
                return auxAdmin;
            }
            else if( perfis.includes(PerfilEnum.USER_PRO_NUTRI) ) {
                return auxUserProNutri;
            }
            else if( perfis.includes(PerfilEnum.USER_PRO) ) {
                return auxUserPro;
            }
            else if( perfis.includes(PerfilEnum.USER_BASIC) ) {
                return auxUserBasic;
            }
            else if( perfis.includes(PerfilEnum.USER_BETA) ) {
                return auxUserBeta;
            }
            else if( perfis.includes(PerfilEnum.USER_INTERNAL) ) {
                return auxUserInternal;
            }
            else if( perfis.includes(PerfilEnum.NONE) ) {
                return auxNone;
            }
            else if( perfis.includes(PerfilEnum.USER) ) {
                return auxUser;
            }
            else {
                return auxUserDefault;
            }
        }
        catch(e) {
            console.warn(e.message);
        }
    return 'NI';
  }
}
