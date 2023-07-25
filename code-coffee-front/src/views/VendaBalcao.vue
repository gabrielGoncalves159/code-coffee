<template>
  <div class="about">
    <h1 class="title is-1">Comanda de Venda</h1>
    <div class="card">
      <header class="modal-card-head group">
        <div class="field is-grouped group">
          <div class="control">
            <div class="container">
              <div class="field">
                <label class="title is-6">Código:</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    v-model="formVenda.codigo"
                    style="width: 80px"
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="control is-expanded">
            <p class="help is-danger" v-if="!formVenda.produto && formValid">
                Preenchimento obrigatório!!
              </p>
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
              <p class="help is-danger" v-if="!formVenda.quantidade_produto && formValid ">
                Preenchimento obrigatório!!
              </p>
              <div class="field">
                <label class="title is-6">Quant:</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    v-model="formVenda.quantidade_produto"
                    style="width: 80px"
                    :class="{ 'is-danger': !formVenda.quantidade_produto && formValid }"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="control">
            <div class="container">
              <div class="field">
                <label class="title is-6">Unidade:</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    v-model="formVenda.unidadeMedida"
                    style="width: 80px"
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="control">
            <div class="container">
              <div class="field">
                <label class="title is-6">Valor Unit:</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    v-model="formVenda.valor"
                    style="width: 80px"
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="control">
            <button class="button is-primary" @click="arreyDeProdutos()"> 
              <span class="icon is-small is-left">
                <i class="fa fa-plus-circle" aria-hidden="true"></i> 
              </span>
              <span>Adicionar</span>
            </button>
          </div>
        </div>
      </header>
      <div class="card-content">
        <ag-grid-vue
          class="ag-theme-material"
          style="height: 250px"
          :columnDefs="columnDefs"
          :rowData="rowData"
          :defaultColDef="defaultColDef"
          rowSelection="multiple"
          animateRows="true"
          @cell-clicked="cellWasClicked"
          @grid-ready="onGridReady"
        >
        </ag-grid-vue>
      </div>
      <footer class="modal-card-foot footer">
        <div class="box">
          <label for="total" class="label">Total:</label>
          <input
            class="input is-normal"
            v-model="totalVenda"
            type="text"
            placeholder="Total"
            name="total"
          />
        </div>
        <div>
          <button class="button is-success" @click="efetivarProdutosComanda()" :disabled="rowData.length == 0">
            Finalizar Comanda
          </button>
          <button class="button" @click="limparArray()">Cancelar</button>
        </div>
      </footer>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import { defineComponent } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import produto from "../services/produto";
import comandaVenda from "../services/comandaVenda";
import format from "../store/format";

export default defineComponent({
  name: "VendaBalcao",
  components: { AgGridVue },
  data() {
    return {
      formVenda: {
        produto: "",
        codigo: "",
        unidadeMedida: "",
        quantidade_produto: "",
        valor: "",
      },
      listaProduto: [
        {
          value: "",
          title: "",
        },
      ],
      dataProduto: [],
      totalVenda: 0,
      formValid: false,
      rowData: [],
      columnDefs: [
        { headerName: "Código", field: "id_produto" },
        { headerName: "Produto", field: "nome" },
        { headerName: "Unidade", field: "unidade" },
        { headerName: "Quantidade", field: "quantidade_produto", editable: true },
        { headerName: "Valor Unit.", field: "valorUnitario" },
        { headerName: "Ação", cellRenderer: this.buttonsActions },
      ],
    };
  },
  mounted() {
    this.listarProdutos();
  },
  methods: {
    buttonsActions(params){
      const wrapper = document.createElement("div");
      wrapper.classList.add('a-button')

      // Botão de exclusão
      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = '<span class="icon is-small"><i class="fa fa-trash" style="color: #ff0000;"></i></span>';
      deleteButton.classList.add("button"); // Adiciona a classe "delete-button"
      deleteButton.addEventListener("click", () => this.removerProduto(params.data));
      wrapper.appendChild(deleteButton);

      return wrapper;
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
          (this.formVenda.valor = format.formatarValorEmReal(x.valor_produto))
        )
      );
    },
    arreyDeProdutos() {

      this.formValid = true;
      if (!this.formVenda.quantidade_produto || !this.formVenda.produto) {
          return;
      }
                                                                                                                             
      this.formValid = false;
      const valorGrid = this.rowData.filter((x) => x.id_produto == this.formVenda.codigo);
      if(valorGrid.length > 0)
      {
        for(let linha of this.rowData)
        {
          if(linha.id_produto === valorGrid[0].id_produto){
            linha.quantidade_produto += parseInt(this.formVenda.quantidade_produto)
          }
        }
      }else {
        this.rowData.push({
          id_produto: this.formVenda.codigo,
          nome: this.formVenda.produto,
          quantidade_produto: parseInt(this.formVenda.quantidade_produto),
          unidade: this.formVenda.unidadeMedida,
          valorUnitario: this.formVenda.valor
        });
      }
      this.gridApi.setRowData(this.rowData)
      this.calcularTotal(this.rowData.map((x) => ({
          ...x,
          valorUnitario: format.removerFormat(x.valorUnitario)
        })));
      this.limparFormulario();
    },
    limparFormulario() {
      this.formVenda = {
        codigo: "",
        unidadeMedida: "",
        quantidade_produto: "",
        valor: "",
      };
    },
    calcularTotal(params) {
        this.totalVenda = 0;
        for (let valor of params) {
          this.totalVenda += valor.quantidade_produto * parseFloat(valor.valorUnitario); 
        }
        this.totalVenda = format.formatarValorEmReal(this.totalVenda)
    },
    async efetivarProdutosComanda() {
      const payload = {
        produto: this.rowData.map((x) => ({
          ...x,
          valorUnitario: format.removerFormat(x.valorUnitario)
        })),
        data: moment().format("YYYY-MM-DD hh:mm:ss "),
      };
      await comandaVenda.inserirProdutoComanda(payload);
      this.limparArray();
    },
    limparArray() {
      this.rowData = [];
      this.totalVenda = 0;
    },
    async removerProduto(params) {
      for(let key in this.rowData){
          if(this.rowData[key].id_produto === params.id_produto){
            this.rowData.splice(key,1);
          }
        }
        this.gridApi.setRowData(this.rowData);
    },
  },
  setup() {
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
      onGridReady,
      defaultColDef,
      gridApi,
      deselectRows: () => {
        gridApi.value.deselectAll();
      },
    };
  },
});
</script>

<style>
@import "ag-grid-community/styles/ag-grid.css";
@import "ag-grid-community/styles/ag-theme-material.css";
@import "../../node_modules/@fortawesome/fontawesome-free/css/all.css";

.buttom-margin {
  margin-top: 34px;
  margin-left: 10px;
}

.group {
  align-items: flex-end;
}

.footer {
  display: flex;
  justify-content: space-between;
}
h1 {
  margin: 20px;
}
.a-button {
  display: flex;
  justify-content: space-evenly;
}
</style>
