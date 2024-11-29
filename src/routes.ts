/**
 * La route par défaut après la connexion
 */
export const DEFAULT_LOGIN_REDIRECT = "/chat";

/**
 * Préfixe pour les routes d'API d'authentification
 */
export const apiAuthPrefix = "/api/auth";

/**
 * Routes publiques accessibles sans authentification
 */
export const publicRoutes = [
  "/",
  "/about",
];

/**
 * Routes liées à l'authentification
 */
export const authRoutes = [
  "/login",
  "/register",
  "/error",
  "/reset",
  "/new-password",
  "/verify",
];