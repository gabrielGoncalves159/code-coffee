import api from "./api";

export default {

    async listarUsuarios(params) {
        try {
            const response = await api().post('usuarios/listar', params);
            return response.data;
        } catch(error) {
            return console.log(error);
        }
    },

    async listarTipoUsuario() {
        try {
            const response = await api().get('usuarios/listarTipoUsuario');
            return response.data;
        } catch (error) {
            return console.log(error);
        }
    },

    async inserirUsuario(params) {
        try {
            await api().post('usuarios/inserir', params);
        } catch(error) {
            return console.log(error);
        }
    },

    async editarUsuario(params) {
        try {
            const response = await api().patch('usuarios/editar', params);
            return response.data;
        } catch(error) {
            return console.log(error);
        }
    },

    async excluirUsuario(params) {
        console.log(params)
        try {
            await api().post('usuarios/excluir', params);
        } catch(error) {
            return console.log(error);
        }
    },
}