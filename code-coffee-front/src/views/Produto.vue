<template>
  <div class="about">
    <h1 class="title is-1">Cadastro de Produto</h1>
    <div class="card">
      <header class="modal-card-head">
        <div class="field is-grouped group">
          <div class="control">
            <div class="container">
              <div class="field">
                <label class="title is-6">Código:</label>
                <div class="control">
                  <input class="input" type="text" v-model="formPesquisa.codigo" style="width: 80px"/>
                </div>
              </div>
            </div>
          </div>
          <div class="control">
            <div class="container">
              <div class="field">
                <label class="title is-6">Produto:</label>
                <div class="control">
                  <input class="input" type="text" v-model="formPesquisa.nomeProduto" style="width: 400px"/>
                </div>
              </div>
            </div>
          </div>
          <div class="control">
            <div class="field is-grouped">
              <div class="control">
                <button class="button is-info" @click="listarProdutos()">Pesquisar</button>
              </div>
              <div class="control">
                <button class="button is-primary" @click="abrirModal()">
                  Novo Produto
                </button>
              </div>
            </div>
          </div>
        </div>
        <modal-padrao :showModal="showModal">
          <template v-slot:header>
            <p class="modal-card-title">Cadastro Novo Produto</p>
            <button class="delete" aria-label="close" @click="fecharModal()"></button>
          </template>
          <template v-slot:body>

            <div class="container">
              <div class="field">
                <label class="title is-6">Nome Produto:</label>
                <div class="control">
                  <input class="input" type="text" v-model="formProduto.nomeProduto"/>
                </div>
              </div>
            </div>

            <div class="container">
              <div class="field">
                <label class="title is-6">Valor Unitário:</label>
                <div class="control">
                  <input class="input" type="text" v-model="formProduto.valorUnitario"/>
                </div>
              </div>
            </div>

            <div class="control is-expanded">
              <label class="title is-6">Unidade Medida:</label>
              <div class="control is-expanded">
                <div class="select is-link">
                  <select v-model="formProduto.unidadeMedida" :style="{ width: '200px' }">
                    <option v-for="option in unidadeMedida" :value="option.title" :key="option.value">
                      {{ option.title }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </template>
          <template v-slot:footer>
            <button class="button is-success" type="submit" @click="cadastrarProduto()">Salvar</button>
            <button class="button" @click="fecharModal()">Cancelar</button>
          </template>
        </modal-padrao>
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
      <footer class="modal-card-foot footer"></footer>
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import { reactive, ref } from "vue";
import produto from "../services/produto"

import ModalPadrao from "@/components/modal/ModalPadrao.vue";

export default defineComponent({
  name: "VendaBalcao",
  components: { AgGridVue, ModalPadrao },
  emits: ["eventAbrirModal"],
  data() {
    return {
      formProduto: {
        nomeProduto: '',
        valorUnitario: '',
        unidadeMedida: '',
      },
      formPesquisa: {
        codigo: '',
        nomeProduto: '',
      },
      showModal: false,
      optionSelect: [],
      unidadeMedida: [
        {
          value: 1,
          title: "UN"
        },
        {
          value: 2,
          title: "KG"
        },
        {
          value: 3,
          title: "L"
        },
        {
          value: 4,
          title: "CX"
        },
      ],
    };
  },
  mounted(){
    this.listarProdutos();
  },
  methods: {
    abrirModal() {
      this.showModal = true
    },
    fecharModal() {
      this.showModal = false;
    },
    async cadastrarProduto() {
      const payload = JSON.parse(JSON.stringify(this.formProduto));
      await produto.inserirProduto(payload)
      this.fecharModal()
      this.listarProdutos()
    },
    async listarProdutos() {
      const response = await produto.listarProdutos(
        {
          id_produto: this.formPesquisa.codigo == '' ? 0 : parseInt(this.formPesquisa.codigo),
          nome: this.formPesquisa.nomeProduto
        }
      );
      this.rowData.value = response;
    },
    
  },
  setup() {
    const gridApi = ref(null);
    const rowData = reactive({});

    const columnDefs = reactive({
      value: [
        { headerName: "Código", field: "id_produto" },
        { headerName: "Produto", field: "nome" },
        { headerName: "Unid. Medida", field: "unidade_medida" },
        { headerName: "Valor", field: "valor_produto" },
        { headerName: "Ação" },
      ],
    });

    // Obtain API from grid's onGridReady event
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

.teste {
  display: flex;
}
.group {
  align-items: flex-end;
}
.footer {
  display: flex;
  justify-content: space-between;
}
.botao {
  padding-top: 20px;
}
h1 {
  margin: 20px;
}
</style>
