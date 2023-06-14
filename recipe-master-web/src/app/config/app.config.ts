import { environment } from "../../environments/environment";

export const API = {

  BASE_URL: environment.BASE_URL,
  BASE_URI: '/api/v1',
  S3_URL: environment.S3_URL
}

export const APP_CONFIG = {

  BASE_URL: API.BASE_URL,
  BASE_FULL_URL: API.BASE_URL.concat(API.BASE_URI),

  S3_PROFILE_URL: API.S3_URL.concat('profiles/'),
  S3_MESSAGES_URL: API.S3_URL.concat('messages/'),
  S3_RECIPE_URL: API.S3_URL.concat('recipes/'),
  S3_MENU_URL: API.S3_URL.concat('menus/')

}
