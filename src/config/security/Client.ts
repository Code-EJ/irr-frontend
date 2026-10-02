/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
export { apiClient } from '../../shared/api/client';
import { session } from '../../shared/api/session';
export const getToken=session.getToken;
export const setToken=session.setToken;
export const deleteToken=session.clear;
