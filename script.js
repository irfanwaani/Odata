(function () {
  const myConnector = tableau.makeConnector();

  // -------- Schema --------
  myConnector.getSchema = function (schemaCallback) {
    const columns = [
      { id: "number", dataType: tableau.dataTypeEnum.string },
      { id: "short_description", dataType: tableau.dataTypeEnum.string }
    ];

    const tableDef = {
      id: "sn_odata_table",
      alias: "ServiceNow OData Feed",
      columns
    };

    schemaCallback([tableDef]);
  };

  // -------- Data Fetch --------
  myConnector.getData = function (table, doneCallback) {
    const url = tableau.connectionData;

    console.log("📡 Fetching data from:", url);

    fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    })
      .then(response => {
        console.log("📥 Raw Response:", response);
        return response.json();
      })
      .then(json => {
        console.log("📦 Parsed JSON:", json);
        console.log("📄 OData 'value' array:", json.value);

        const rows = json.value.map(item => ({
          number: item.number,
          short_description: item.short_description
        }));

        console.log("🧩 Extracted rows to be loaded into Tableau:", rows);

        table.appendRows(rows);
        doneCallback();
      })
      .catch(error => {
        console.error("❌ Error fetching OData:", error);
        doneCallback();
      });
  };

  // -------- Submit Connector --------
  window.submitConnector = function () {
    const url = document.getElementById("odataUrl").value;

    console.log("🔗 Connector submitted with URL:", url);

    tableau.connectionData = url;
    tableau.connectionName = "ServiceNow OData Feed";

    tableau.submit();
  };

  tableau.registerConnector(myConnector);
})();
