import api from "./api";

export default {

    async listarProdutos(param) {
        try{
            const response = await api().post('produtos/listar', param);
            return response.data
        }catch(error) {
            return console.log("erro ao listar produto:", error);
        }
    },
    async inserirProduto(param) {
        try {
            await api().post('produtos/inserir', param);
        }catch(error) {
            return console.log("erro ao cadastrar novo produto:". error)
        }
    },
    async excluirProduto(param) {
        try{
            await api().post('produtos/excluir', param);
        }catch(error) {
            return console.log("erro ao excluir produto:". error)
        }
    },
    async editarProduto(param) {
        try{
            await api().post('produtos/alterar', param);
        }catch(error) {
            return console.log("erro ao alterar produto:". error)
        }
    },
}