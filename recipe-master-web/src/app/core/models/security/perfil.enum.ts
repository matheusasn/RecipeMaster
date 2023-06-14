
export enum PerfilEnum {
    NONE = "NONE",
    ADMIN = "ADMIN",
    USER = "USER",
    USER_BASIC = "USER_BASIC",
    USER_PRO = "USER_PRO",
    USER_PRO_NUTRI = "USER_PRO_NUTRI",
    USER_BETA = "USER_BETA",
    USER_INTERNAL = "USER_INTERNAL"
}

export class Perfil {
    public static perfilToIndex(perfil: PerfilEnum):number {

        let idx:number;

        if(perfil == PerfilEnum.USER_BASIC) {
            idx = 3;
        }
        else if(perfil == PerfilEnum.USER_PRO) {
            idx = 4;
        }
        else if(perfil == PerfilEnum.USER_PRO_NUTRI) {
            idx = 5;
        }
        else if(perfil == PerfilEnum.USER_BETA) {
            idx = 6;
        }
        else if(perfil == PerfilEnum.USER_INTERNAL) {
            idx = 7;
        }

        return idx;

    }
}

export const RECIPE_PHOTO_LIMIT:number = 6;

export enum RolePermission {
		RECIPE_UNLIMITED,
    PHOTO_UNLIMITED,
    PDF_CREATION,
    MENU_ENABLED,
    SHARE_ENABLED,
    NUTRITION_INFO_ENABLED
}

export enum RolePermissionMessage {
	RECIPE_UNLIMITED = "ALERT_PLAN.TXT_RECIPE_UNLIMITED",
    PHOTO_UNLIMITED = "O plano gratuito tem um limite de 6 fotos das receitas. <br><small>Veja mais detalhes dos planos e assine uma versão mais completa para ter todas as vantagens e se organizar da melhor maneira.</small>",
    PDF_CREATION = "ALERT_PLAN.TXT1",
    MENU_ENABLED = "ALERT_PLAN.TXT1",
    SHARE_ENABLED = "ALERT_PLAN.TXT1",
    NUTRITION_INFO_ENABLED = "Assine uma versão mais completa para ter todas as vantagens e organizar melhor o seu negócio!"
}

export class PerfilPermission {
    private static USER = [];
    private static USER_BASIC = [
        RolePermission.PHOTO_UNLIMITED,
		RolePermission.RECIPE_UNLIMITED
    ];
    private static USER_PRO = [
        RolePermission.PHOTO_UNLIMITED,
        RolePermission.PDF_CREATION,
        RolePermission.MENU_ENABLED,
        RolePermission.SHARE_ENABLED,
		RolePermission.RECIPE_UNLIMITED
    ];
    private static USER_PRO_NUTRI = [
        RolePermission.PHOTO_UNLIMITED,
        RolePermission.PDF_CREATION,
        RolePermission.MENU_ENABLED,
        RolePermission.SHARE_ENABLED,
        RolePermission.NUTRITION_INFO_ENABLED,
	    RolePermission.RECIPE_UNLIMITED
    ];
    private static USER_BETA = [];
    private static USER_INTERNAL = [];

    public static getMessage(role:RolePermission):String {

        try {
            return RolePermissionMessage[Object.keys(RolePermissionMessage)[role]];
        }
        catch(e) {
            console.warn(e.message);
            return null;
        }

    }

    public static getPermission(perfil: PerfilEnum) {

        switch(perfil) {
            case PerfilEnum.USER:
                return this.USER;
            case PerfilEnum.USER_BASIC:
                return this.USER_BASIC;
            case PerfilEnum.USER_PRO:
                return this.USER_PRO;
            case PerfilEnum.USER_PRO_NUTRI:
                return this.USER_PRO_NUTRI
            case PerfilEnum.USER_BETA:
                return this.USER_BETA;
            case PerfilEnum.USER_INTERNAL:
                return this.USER_INTERNAL;
        }

        return null;

    }

}
