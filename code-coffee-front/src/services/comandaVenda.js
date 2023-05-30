import api from "./api";

export default {

    async inserirProdutoComanda(param) {
        try{
            const response = await api().post('/comanda-venda/inserir-produto-comanda', param);
            return response.data
        }catch(error) {
            return console.log("erro ao inserir produto na comanda:", error);
        }
    },
    async listarComandaVenda(param) {
        try {
            await api().post('/comanda-venda/listar-comanda-venda', param);
        }catch(error) {
            return console.log("erro ao listar comandas:". error)
        }
    },
    async listarProdutoComanda(param) {
        try {
            await api().post('/comanda-venda/listar-produtos-comanda', param);
        }catch(error) {
            return console.log("erro ao listar produtos comanda:". error)
        }
    },
}