/* eslint-disable no-debugger */
import api from "./api";

export default {

    async listarUsuarios() {
        try {
            const response = await api().get('/listar');
            return response.data;
        } catch(error) {
            return console.log(error);
        }
    },

    async listarTipoUsuario() {
        try {
            const response = await api().get('/listarTipoUsuario');
            return response.data;
        } catch (error) {
            return console.log(error);
        }
    },

    async inserirUsuario(payload) {
        console.log(payload)
        debugger
        try {
            await api().post('/inserir', payload);
        } catch(error) {
            return console.log(error);
        }
    },

    async editarUsuario(payload) {
        try {
            const response = await api.patch('/editar', payload);
            return response.data;
        } catch(error) {
            return console.log(error);
        }
    },

    async excluirUsuario(payload) {
        try {
            const response = await api.delete('/excluir', payload);
            return response.data;
        } catch(error) {
            return console.log(error);
        }
    },
}