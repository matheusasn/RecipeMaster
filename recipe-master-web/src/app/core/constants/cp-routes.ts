const _CP_ROUTES = {
    APP: '',
    LANDPAGE: ''
};

export const CpRoutes = {

    HOME: _CP_ROUTES.APP,

    LOGIN: `${_CP_ROUTES.APP}/login`,

    REGISTER: `${_CP_ROUTES.APP}/register`,

    REGISTER_USER:  `${_CP_ROUTES.APP}/user`,

    INGREDIENT:  `${_CP_ROUTES.APP}/ingrediente`,

		INGREDIENT_FORM:  `${_CP_ROUTES.APP}/ingrediente-form`,

    INGREDIENTS:  `${_CP_ROUTES.APP}/ingredientes`,

    RECIPE:  `${_CP_ROUTES.APP}/receita`,

		PUBLIC_RECIPES:  `${_CP_ROUTES.APP}/receitas-publicas`,

    RECIPES:  `${_CP_ROUTES.APP}/receitas`,

		MENU:  `${_CP_ROUTES.APP}/cardapio`,

    MENUS:  `${_CP_ROUTES.APP}/cardapios`,

    SUPPORT:  `${_CP_ROUTES.APP}/suporte`,

    PLAN_SIGN: `${_CP_ROUTES.APP}/plans`,

    PURCHASELISTS: `${_CP_ROUTES.APP}/purchaseLists`,

    PURCHASELIST: `${_CP_ROUTES.APP}/purchaseList`,

		ADMIN: `${_CP_ROUTES.APP}/admin`

};
