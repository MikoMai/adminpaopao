import axios from 'axios';

let base = '/api';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/getUserPage`, { params: params }); };

export const getAdminListPage = params => { return axios.get(`${base}/user/getAdminPage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editAdmin = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addAdmin = params => { return axios.post(`${base}/user/saveAdmin`, params ); };