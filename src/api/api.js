import axios from 'axios';

let base = '';

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };


export const getDictList = params => { return axios.get(`${base}/dict/list`, { params: params }); };

export const getDictListPage = params => { return axios.get(`${base}/dict/listpage`, { params: params }); };

export const removeDict = params => { return axios.get(`${base}/dict/remove`, { params: params }); };

export const batchRemoveDict = params => { return axios.get(`${base}/dict/batchremove`, { params: params }); };

export const editDict = params => { return axios.get(`${base}/dict/edit`, { params: params }); };

export const addDict = params => { return axios.get(`${base}/dict/add`, { params: params }); };