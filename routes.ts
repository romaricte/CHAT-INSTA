/**
 * Les routes qui sont accessibles au public
 * Ces routes ne nécessitent pas d'authentification
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
]

/**
 * Les routes utilisées pour l'authentification
 * Ces routes redirigeront les utilisateurs connectés vers /chat
 * @type {string[]}
 */
export const authRoutes = [
  "/login",
  "/register",
]

/**
 * Le préfixe pour les routes d'API d'authentification
 * Les routes qui commencent par ce préfixe sont utilisées pour l'authentification
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth"

/**
 * La route par défaut après la connexion
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/chat"
