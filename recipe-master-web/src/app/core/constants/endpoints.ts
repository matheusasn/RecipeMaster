export const PACKAGE = {
    SECURITY: "/security",
	BUSINESS: "/business",
	ADMIN: "/admin/stats",
	STORAGE: "/storage"
};

export const ENDPOINTS = {

	ADMIN: {
		STATS: {
			ALL: `${PACKAGE.ADMIN}/all`,
			ALL_GRAPH: `${PACKAGE.ADMIN}/all/graph`,
			USERS: `${PACKAGE.ADMIN}/users`,
			SIGNATURES: `${PACKAGE.ADMIN}/signatures`,
			ACCESS: `${PACKAGE.ADMIN}/access`,
		}
	},

    SECURITY: {
        LOGIN: "/login",
				LOGIN_FACEBOOK: "/login/facebook",
				LOGIN_GOOGLE: "/login/google",
		USER: `${PACKAGE.SECURITY}/user`,
		REFRESH_PLAN: `${PACKAGE.SECURITY}/user/refresh-plan`,
	},

	STORAGE: {
		PROFILE: `${PACKAGE.STORAGE}/profile`,
		RECIPE: `${PACKAGE.STORAGE}/recipe`,
		MENU: `${PACKAGE.STORAGE}/menu`,
		MESSAGES: `${PACKAGE.STORAGE}/messages`,
		PDF: `${PACKAGE.STORAGE}/pdf`
	},

	BUSINESS: {
		PDF: `${PACKAGE.BUSINESS}/pdf`,
		INGREDIENTS: `${PACKAGE.BUSINESS}/ingredient`,
		FIXED_COST: `${PACKAGE.BUSINESS}/fixed-cost`,
		FIXED_SPECIFIC_COST: `${PACKAGE.BUSINESS}/fixed-specific-cost`,
		VARIABLE_COST: `${PACKAGE.BUSINESS}/variable-cost`,
		INGREDIENT_CATEGORIES_REDUCED: `${PACKAGE.BUSINESS}/ingredient-category/reduced`,
		UNITS_REDUCED: `${PACKAGE.BUSINESS}/unit/reduced`,
        UNITS_ABBREVIATED: `${PACKAGE.BUSINESS}/unit/abbreviated`,
        UNITS: `${PACKAGE.BUSINESS}/unit`,
        REGION: `${PACKAGE.BUSINESS}/region`,
		RECIPES: `${PACKAGE.BUSINESS}/recipe`,
		RECIPES_REPORTS: `${PACKAGE.BUSINESS}/recipes-reports`,
		RECIPE_CATEGORIES: `${PACKAGE.BUSINESS}/recipe-category`,
		RECIPE_CATEGORIES_REDUCED: `${PACKAGE.BUSINESS}/recipe-category/reduced`,
		MENUS: `${PACKAGE.BUSINESS}/menu`,
		SUPPORT: `${PACKAGE.BUSINESS}/support`,
		COMMONQUESTIONS: `${PACKAGE.BUSINESS}/common-questions`,
		NOTIFICATION: `${PACKAGE.BUSINESS}/notification`,
		NUTRITIONINFO: `${PACKAGE.BUSINESS}/nutrition`,
        PURCHASELIST: `${PACKAGE.BUSINESS}/purchaseList`,
		MESSAGES: `${PACKAGE.BUSINESS}/messages`,
		OTHER_COSTS: `${PACKAGE.BUSINESS}/other-costs`,
		INGREDIENT_HISTORY: `${PACKAGE.BUSINESS}/ingredient-history`,
		FINANCIAL_HISTORY: `${PACKAGE.BUSINESS}/financial-history`,
		MERCADOPAGO: `${PACKAGE.BUSINESS}/mercadopago`,
		ALLERGENS: `${PACKAGE.BUSINESS}/allergen`,
		APPLESTORE: `${PACKAGE.BUSINESS}/applestore`
	},
	PAGSEGURO:{
		CHECKOUT: `${PACKAGE.BUSINESS}/pagseguro/checkout`,
	}

}
