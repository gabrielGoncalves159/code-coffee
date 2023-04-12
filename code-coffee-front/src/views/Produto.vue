<template>
  <div class="about">
    <h1 class="title is-1">Cadastro de Produto</h1>
    <div class="card">
      <header class="modal-card-head">
        <div class="field is-grouped group">
          <div class="control">
            <Input :label="'Código'" :type="'text'" style="width: 80px" />
          </div>
          <div class="control">
            <Input :label="'Produto'" :type="'text'" style="width: 400px"/>
          </div>
          <div class="control">
            <div class="field is-grouped">
              <div class="control">
                <button class="button is-info">Pesquisar</button>
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
            <Input :label="'Código'" :type="'text'"/>
            <Input :label="'Nome'" :type="'text'" />
            <Input :label="'Valor Unitário'" :type="'text'" />
            <Select :label="'Unidade'" :options="optionSelect"/>
          </template>
          <template v-slot:footer>
            <button class="button is-success">Salvar</button>
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
import { reactive, onMounted, ref } from "vue";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/Select.vue";

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-material.css"; // Optional theme CSS
import ModalPadrao from "@/components/modal/ModalPadrao.vue";

export default defineComponent({
  name: "VendaBalcao",
  components: { AgGridVue, Input, Select, ModalPadrao },
  emits: ["eventAbrirModal"],
  data() {
    return {
      showModal: false,
      optionSelect: [],
    };
  },
  methods: {
    abrirModal() {
      this.showModal = true
    },
    fecharModal() {
      this.showModal = false;
    },
  },
  setup() {
    const gridApi = ref(null);
    const rowData = reactive({});
    const columnDefs = reactive({
      value: [
        { field: "Código" },
        { field: "Produto" },
        { field: "Unid. Medida" },
        { field: "Valor" },
        { field: "Ação" },
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

    // Example load data from sever
    onMounted(() => {
      fetch("https://www.ag-grid.com/example-assets/row-data.json")
        .then((result) => result.json())
        .then((remoteRowData) => (rowData.value = remoteRowData));
    });

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
