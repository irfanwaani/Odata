(function () {
  tableau.makeConnector();

  const myConnector = tableau.makeConnector();

  myConnector.getSchema = function (schemaCallback) {
    const cols = [
      { id: "sys_id", dataType: tableau.dataTypeEnum.string },
      { id: "name", dataType: tableau.dataTypeEnum.string },
      { id: "created", dataType: tableau.dataTypeEnum.datetime }
    ];

    const tableSchema = {
      id: "sn_odata_table",
      alias: "ServiceNow OData Data",
      columns: cols
    };

    schemaCallback([tableSchema]);
  };

  myConnector.getData = function (table, doneCallback) {
    const url = tableau.connectionData;

    fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json"
        // Add Authorization header if needed
      }
    })
      .then(res => res.json())
      .then(json => {
        const rows = json.value.map(item => ({
          sys_id: item.sys_id,
          name: item.name,
          created: item.sys_created_on
        }));

        table.appendRows(rows);
        doneCallback();
      });
  };

  function submit() {
    const url = document.getElementById("odataUrl").value;
    tableau.connectionData = url;
    tableau.connectionName = "ServiceNow OData Feed";
    tableau.submit();
  }

  window.submit = submit;
})();
