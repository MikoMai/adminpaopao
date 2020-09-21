import axios from 'axios';

let base = '/api';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

export const requestLogin = params => { return axios.get(`${base}/user/login`, { params: params }); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/getUserPage`, { params: params }); };

export const getAdminListPage = params => { return axios.get(`${base}/user/getAdminPage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/delUser`,{ params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const addAdmin = params => { return axios.post(`${base}/user/saveAdmin`, params ); };


export const getMissionPage = params => { return axios.get(`${base}/mission/getMissionPage`, { params: params }); };

export const saveMission = params => { return axios.post(`${base}/mission/saveMission`, params ); };

export const removeMission = params => { return axios.get(`${base}/mission/updateStatus`,{ params: params }); };



export const getGiftPage = params => { return axios.get(`${base}/gift/getGiftPage`, { params: params }); };
export const removeGift = params => { return axios.get(`${base}/gift/updateStatus`,{ params: params }); };
export const saveGift = params => { return axios.post(`${base}/gift/saveGift`, params ); };



export const getNewsPage = params => { return axios.get(`${base}/news/getNewsPage`, { params: params }); };
export const removeNews = params => { return axios.get(`${base}/news/updateStatus`,{ params: params }); };
export const saveNews = params => { return axios.post(`${base}/news/saveNews`, params ); };

