<template>
  <div class="about">
    <h1 class="title is-1">Comanda de Venda</h1>
    <div class="card">
      <header class="modal-card-head group">
        <div class="field is-grouped group">
          <div class="control">
            <Input :label="'Código'" :type="'text'" style="width: 80px"/>
          </div>
          <div class="control">
            <Input :label="'Produto'" :type="'text'" />
          </div>
          <div class="control widthMin">
            <Input :label="'Unidade'" :type="'text'" style="width: 80px"/>
          </div>
          <div class="control widthMin">
            <Input :label="'Quant.'" :type="'text'" style="width: 80px"/>
          </div>
          <div class="control">
            <Input :label="'Valor Unit.'" :type="'text'" style="width: 100px"/>
          </div>
          <div class="control">
            <button class="button is-success">Adicionar</button>
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
          <input class="input is-normal" type="text" placeholder="Total" name="total" />
        </div>
        <div>
          <button class="button is-success">Efetuar Venda</button>
          <button class="button">Cancelar</button>
        </div>
      </footer>
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import { reactive, onMounted, ref } from "vue";

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-material.css"; // Optional theme CSS
import Input from "@/components/form/Input.vue";

export default defineComponent({
  name: "VendaBalcao",
  components: { AgGridVue, Input },
  setup() {
    const gridApi = ref(null);
    const rowData = reactive({});
    const columnDefs = reactive({
      value: [
        { field: "Codigo" },
        { field: "NomeProduto" },
        { field: "Quantidade" },
        { field: "Valor" },
        { field: "Unidade" },
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
