<template>
    <div class="modal" :class="{ 'is-active': showModal }" v-if="showModal">
      <div class="modal-background"></div>
      <form>
        <div class="modal-card">
          <header class="modal-card-head">
              <p class="modal-card-title">Pagamento Comanda</p>
              <button class="delete" aria-label="close" @click="fecharModal()"></button>
          </header>
          <section class="modal-card-body">
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label">Comanda:</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input
                        v-model="comanda"
                        class="input"
                        type="text"
                        style="width: 80px"
                        disabled
                      />
                  </div>
                </div>
              </div>
            </div>
            <div class="field is-grouped group" v-if="!visualizar">
              <div class="control">
                <div class="container">
                  <div class="field">
                    <label class="title is-6">Código:</label>
                    <div class="control">
                      <input
                        v-model="formVenda.codigo"
                        class="input"
                        type="text"
                        style="width: 80px"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="control">
                <p class="help is-danger" v-if="!formVenda.produto && formValid">Preenchimento obrigatório!!</p>
                <label class="title is-6">Produto:</label>
                <div class="control is-expanded">
                  <div class="select is-link" :class="{ 'is-danger': !formVenda.produto && formValid }">
                    <select
                      v-model="formVenda.produto"
                      :style="{ width: '400px' }"
                      @change="selected()"
                    >
                      <option
                        v-for="option in listaProduto"
                        :value="option.title"
                        :key="option.value"
                      >
                        {{ option.title }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="control">
                <div class="container">
                  <p class="help is-danger" v-if="!formVenda.quantidade  && formValid">
                    Preenchimento obrigatório!!
                  </p>
                  <div class="field">
                    <label class="title is-6">Quantidade:</label>
                    <div class="control">
                      <input
                        v-model="formVenda.quantidade"
                        class="input"
                        type="text"
                        style="width: 80px"
                        :class="{ 'is-danger': !formVenda.quantidade  && formValid }"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="control">
                <button class="button is-primary" @click="adicionarProduto">
                  <span class="icon is-small is-left">
                    <i class="fa fa-plus-circle" aria-hidden="true"></i> 
                  </span>
                  <span>Adicionar</span>
                </button>
              </div>
            </div>
            <div class="card-content">
              <ag-grid-vue
              class="ag-theme-material"
              style="height: 250px"
              :columnDefs="columnDefs"
              :rowData="rowData"
              :defaultColDef="defaultColDef"
              rowSelection="multiple"
              animateRows="true"
              @grid-ready="onGridReady"
              ></ag-grid-vue>
            </div>
          </section>
          <footer class="modal-card-foot footer">
            <div class="field is-grouped group">
              <div class="control box">
                <label for="total" class="label">Total:</label>
                <input
                  class="input is-normal"
                  v-model="valorTotalComanda"
                  type="text"
                  name="total"
                  @change="formatarInputReal"
                  disabled
                />
              </div>
              <div class="control is-expanded box" v-if="!visualizar">
                <p class="help is-danger" v-if="opcaoPagamentoInvalida">Preenchimento obrigatório!!</p>
                <label for="opcaoPagamento" class="label">Opão Pagamento:</label>
                <div class="control is-expanded" style="width: 208px;">
                  <div class="select" :class="{'is-danger': opcaoPagamentoInvalida}" style="width: 207px;">
                    <select 
                      v-model="form.opcaoPagamento" 
                      name="opcaoPagamento"
                      style="width: 207px;"
                    >
                      <option disabled value="">Selecione uma opção</option>
                      <option
                        v-for="option in opcaoPagamento"
                        :value="option.value"
                        :key="option.value"
                      >
                        {{ option.title }}
                      </option>
                     </select>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="!visualizar">
              <button 
                class="button is-success" 
                type="submit" 
                @click="pagarComanda()" s
                tyle="background-color: #0aaa3b;"
                :disabled="rowData.length === 0"
              >
                Finalizar
              </button>
              <button class="button" @click="fecharModal()">Cancelar</button>
            </div>
          </footer>
        </div>
      </form>
    </div>
</template>
<script>
  import { defineComponent } from "vue";
  import { AgGridVue } from "ag-grid-vue3";
  import { ref } from "vue";
  import opcaoPagamento from "../../services/opcaoPagamento";
  import comandaVenda from "../../services/comandaVenda";
  import produto from "../../services/produto";
  import format from "../../store/format";


  export default defineComponent({
    name: "modal-pagamento",
    components: {AgGridVue},
    props: {
      showModal: {
        type: Boolean,
        required: true
      },
      params: {
        type: Object,
        required: true
      },
      visualizar: {
        type: Boolean,
        required: true
      }
    },
    data() {
        return {
          form: {
            opcaoPagamento: ""
          },
          formVenda: {
            produto: "",
            codigo: "",
            unidadeMedida: "",
            quantidade: "",
            valor: "",
          },
          listaProduto: [
            { value: "", title: "" },
          ],
          comanda: this.params.comanda,
          dataProduto: [],
          opcaoPagamento: [],
          valorTotalComanda: 0,
          opcaoPagamentoInvalida: false,
          formValid: false,
          rowData: [],
          columnDefs: [
            { headerName: "Código", field: "id_produto", minWidth: 120 },
            { headerName: "Produto", field: "nome", minWidth: 170 },
            { headerName: "Unidade", field: "unidade_medida", minWidth: 120 },
            { headerName: "Quantidade", field: "quantidade_produto", minWidth: 120, editable: true },
            { headerName: "Valor Unit.", field: "valor_produto", minWidth: 120 },
            { headerName: "Ação", cellRenderer: this.buttonsActions, minWidth: 170 },
          ],
        }
    },
    mounted() {
      this.listarOpcaoPagamento();
      this.listarProdutosComanda(this.params);
      this.listarProdutos();
    },
    methods: {
      buttonsActions(params){
        if(!this.visualizar){
          const wrapper = document.createElement("div");
          wrapper.classList.add('a-button')
  
          // Botão de exclusão
          const deleteButton = document.createElement("button");
          deleteButton.innerHTML = '<span class="icon is-small"><i class="fa fa-trash" style="color: #ff0000;"></i></span>';
          deleteButton.classList.add("button"); // Adiciona a classe "delete-button"
          deleteButton.addEventListener("click", () => this.removerProduto(params.data));
          wrapper.appendChild(deleteButton);
  
          return wrapper;
        }
      },
      fecharModal() {
        this.$emit('update:showModal', false);
        this.$emit('look:visualizar', false);
      },
      async pagarComanda() {
        if (this.form.opcaoPagamento === '') {
          this.opcaoPagamentoInvalida = true;
          return 
        }
        this.opcaoPagamentoInvalida = false;
        const payload = {
          produto: this.rowData,
          idComanda: this.params.comanda,
          statusComanda: 'P',
          idOpcaoPagamento: this.form.opcaoPagamento
        }
        // console.log(payload)
        await comandaVenda.finalizarComanda(payload);
        this.fecharModal();
      },
      async listarOpcaoPagamento() {
        const response = await opcaoPagamento.listarOpcaoPagamento();
        this.opcaoPagamento = response.map((x) => ({
          value: x.id_opcao_pagamento,
          title: x.descricao
        }));
      },
      async listarProdutosComanda(value) {
        const payload = {id_comanda: value.comanda}
        const response = await comandaVenda.listarProdutoComanda(payload);
        this.rowData = response.data.map((x) => ({
          ...x,
          valor_produto: format.formatarValorEmReal(x.valor_produto)
        }));
        this.calcularTotal(this.rowData.map((x) => ({
          ...x,
          valor_produto: format.removerFormat(x.valor_produto)
        })));
      },
      calcularTotal(params) {
        this.valorTotalComanda = 0;
        for (let valor of params) {
          this.valorTotalComanda += valor.quantidade_produto * parseFloat(valor.valor_produto); 
        }
        this.valorTotalComanda = format.formatarValorEmReal(this.valorTotalComanda)
      },
      async listarProdutos() {
        const response = await produto.listarProdutos({
          id_produto: 0,
          nome: "",
        });
        this.listaProduto = response.map((x) => ({
          value: x.id_produto,
          title: x.nome,
        }));
        this.dataProduto = response;
      },
      async selected() {
        const value = this.dataProduto.filter((x) => x.nome == this.formVenda.produto);
        value.map(
          (x) => (
            (this.formVenda.codigo = x.id_produto),
            (this.formVenda.unidadeMedida = x.unidade_medida),
            (this.formVenda.valor = x.valor_produto)
          )
        );
      },
      adicionarProduto() {
        this.formValid = true;
        if (!this.formVenda.quantidade || !this.formVenda.produto) {
          return;
        }

        const value = this.rowData.filter((x) => x.id_produto == this.formVenda.codigo);
        if(value.length > 0)
        {
          for(let linha of this.rowData)
          {
            if(linha.id_produto === value[0].id_produto){
              linha.quantidade_produto += parseInt(this.formVenda.quantidade)
            }
          }
        }
        else
        {
          this.rowData.push({
            nome: this.formVenda.produto,
            id_produto: this.formVenda.codigo,
            unidade_medida: this.formVenda.unidadeMedida,
            quantidade_produto: this.formVenda.quantidade,
            valor_produto: this.formVenda.valor,
          })
        }
        this.gridApi.setRowData(this.rowData);
        this.formVenda = {
          produto: "",
          codigo: "",
          unidadeMedida: "",
          quantidade: "",
          valor: "",
        };
        this.calcularTotal(this.rowData)
      },
      removerProduto(params){
        for(let key in this.rowData){
          if(this.rowData[key].id_produto === params.id_produto){
            this.rowData.splice(key,1);
          }
        }
        this.gridApi.setRowData(this.rowData);
        this.calcularTotal(this.rowData)
      },
    },
    setup(){
      const gridApi = ref(null);

      const onGridReady = (params) => {
        gridApi.value = params.api;
      };

      const defaultColDef = {
        sortable: true,
        filter: true,
        flex: 1,
      };

      return {
        defaultColDef,
        onGridReady,
        gridApi,
      }
    }
  });
</script>
<style scoped>
.footer {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px 0px 20px !important;
}
.a-button {
  display: flex;
  justify-content: space-evenly;
}
.modal-card {
  max-height: calc(98vh - 0px) !important;
  width: 913px !important;
}
.field-label{
  text-align: left !important;
  margin-right: 0.5rem !important;
  flex-grow: 0 !important;
}

</style>
  