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
            const response = await api().post('/comanda-venda/listar-comanda-venda', param);
            return response.data
        }catch(error) {
            return console.log("erro ao listar comandas:". error)
        }
    },
    async listarProdutoComanda(param) {
        try {
            const response = await api().post('/comanda-venda/listar-produtos-comanda', param);
            return response;
        }catch(error) {
            return console.log("erro ao listar produtos comanda:". error)
        }
    },
    async alterarStatusComanda(param) {
        try {
            await api().post('/comanda-venda/altera-status-comanda', param);
        }catch(error) {
            return console.log("erro ao alterar status comanda:", error)
        }
    },
    async finalizarComanda(param) {
        try {
            await api().post('/comanda-venda/finaliza-comanda', param);
        }catch(error) {
            return console.log("erro ao finalizar comanda", error);
        }
    },
}