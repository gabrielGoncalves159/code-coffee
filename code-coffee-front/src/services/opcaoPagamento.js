import api from "./api";

export default {

  async listarOpcaoPagamento() {
      try {
          const response = await api().get('/opcao-pagamento/listar');
          return response.data
      }catch(error) {
          return console.log("erro ao listar opções de pagamento:". error)
      }
  },

}
