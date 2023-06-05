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
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="control is-expanded">
            <label class="title is-6">Produto:</label>
            <div class="control is-expanded">
              <div class="select is-link">
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
              <div class="field">
                <label class="title is-6">Quant:</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    v-model="formVenda.quantidade"
                    style="width: 80px"
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
            <button class="button is-success" type="submet" @click="arreyDeProdutos()">
              Adicionar
            </button>
          </div>
        </div>
      </header>
      <div class="card-content">
        <ag-grid-vue
          class="ag-theme-material"
          style="height: 250px"
          :columnDefs="columnDefs.value"
          :rowData="rowData.value"
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
          <button class="button is-success" @click="efetivarProdutosComanda()">
            Efetuar Venda
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
import { reactive, ref } from "vue";
import produto from "../services/produto";
import comandaVenda from "../services/comandaVenda";

export default defineComponent({
  name: "VendaBalcao",
  components: { AgGridVue },
  data() {
    return {
      formVenda: {
        produto: "",
        codigo: "",
        unidadeMedida: "",
        quantidade: "",
        valor: "",
      },
      listaProduto: [
        {
          value: "",
          title: "",
        },
      ],
      produtoComanda: [],
      dataProduto: [],
      totalVenda: 0,
    };
  },
  mounted() {
    this.listarProdutos();
  },
  methods: {
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
    arreyDeProdutos() {
      var value = {
        id: this.formVenda.codigo,
        nome: this.formVenda.produto,
        quantidade: this.formVenda.quantidade,
        unidade: this.formVenda.unidadeMedida,
        valorUnitario: parseFloat(
          parseInt(this.formVenda.quantidade) * parseFloat(this.formVenda.valor)
        ),
      };
      this.produtoComanda.push(value);
      this.rowData.value = this.produtoComanda;
      this.totalVenda += parseFloat(value.valorUnitario);
      this.formVenda = {
        codigo: "",
        unidadeMedida: "",
        quantidade: "",
        valor: "",
      };
    },
    async efetivarProdutosComanda() {
      const payload = {
        produto: this.rowData.value,
        data: moment().format("YYYY-MM-DD hh:mm:ss "),
      };
      await comandaVenda.inserirProdutoComanda(payload);
      this.limparArray();
    },
    limparArray() {
      this.produtoComanda = [];
      this.rowData.value = [];
      this.totalVenda = 0;
    },
  },
  setup() {
    const gridApi = ref(null);
    const rowData = reactive({});
    const columnDefs = reactive({
      value: [
        { headerName: "Código", field: "id" },
        { headerName: "Produto", field: "nome" },
        { headerName: "Unidade", field: "unidade" },
        { headerName: "Quantidade", field: "quantidade" },
        { headerName: "Valor Unit.", field: "valorUnitario" },
      ],
    });

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
      columnDefs,
      rowData,
      defaultColDef,
      cellWasClicked: (event) => {
        // Example of consuming Grid Event
        console.log("cell was clicked", event);
      },
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
</style>
