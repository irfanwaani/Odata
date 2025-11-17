(function () {
  const myConnector = tableau.makeConnector();
alert("ServiceNow OData Connector Loaded");
  // ----- Define schema -----
  myConnector.getSchema = function (schemaCallback) {
    const columns = [
      { id: "sys_id", dataType: tableau.dataTypeEnum.string },
      { id: "name", dataType: tableau.dataTypeEnum.string },
      { id: "sys_created_on", dataType: tableau.dataTypeEnum.datetime }
    ];

    const tableDef = {
      id: "sn_odata_table",
      alias: "ServiceNow OData Feed",
      columns
    };

    schemaCallback([tableDef]);
  };

  // ----- Fetch data -----
  myConnector.getData = function (table, doneCallback) {
    const url = tableau.connectionData;

    fetch(url, { method: "GET", headers: { "Accept": "application/json" }})
      .then(response => response.json())
      .then(json => {
        const rows = json.value.map(item => ({
          sys_id: item.sys_id,
          name: item.name,
          sys_created_on: item.sys_created_on
        }));

        table.appendRows(rows);
        doneCallback();
      })
      .catch(error => {
        console.error("Error fetching OData:", error);
        doneCallback();
      });
  };

  // ----- UI Submit -----
  window.submitConnector = function () {
    alert("Submitting ServiceNow OData Connector");
    const url = document.getElementById("odataUrl").value;

    tableau.connectionData = url;
    tableau.connectionName = "ServiceNow OData Feed";

    tableau.submit();
  };

  tableau.registerConnector(myConnector);
})();
