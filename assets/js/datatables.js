import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';

document.addEventListener('DOMContentLoaded', () => {
  const dtInstances = [];

  const parseValue = (val) => {
    if (val === 'true') return true;
    if (val === 'false') return false;
    if (/^\d+$/.test(val)) return parseInt(val, 10);
    if (/^\d+(\.\d+)?$/.test(val)) return parseFloat(val);
    if (val.includes(',')) return val.split(',').map((v) => v.trim());
    return val;
  };

  document.querySelectorAll('table.DataTables').forEach((tableEl) => {
    const datasetOptions = {};
    for (const [key, value] of Object.entries(tableEl.dataset)) {
      datasetOptions[key] = parseValue(value);
    }

    // Find JSON config: prefer sibling <script.dt-config>, but search ancestors if needed
    let jsonOptions = {};
    let jsonEl =
      tableEl.parentElement.querySelector('script.dt-config') ||
      tableEl.closest('.DataTables-wrapper')?.querySelector('script.dt-config');

    if (!jsonEl) {
      // fallback: try next sibling in DOM
      const next = tableEl.nextElementSibling;
      if (next && next.matches('script.dt-config')) jsonEl = next;
    }

    if (jsonEl) {
      try {
        jsonOptions = JSON.parse(jsonEl.textContent.trim());
      } catch (err) {
        console.error('Invalid JSON in DataTable config:', err);
      }
    }

    // Ensure arrays in dataset are interpreted correctly
    if (
      datasetOptions.order &&
      Array.isArray(datasetOptions.order) &&
      datasetOptions.order.length === 2
    ) {
      datasetOptions.order = [[parseInt(datasetOptions.order[0], 10), datasetOptions.order[1]]];
    }

    // Merge JSON + dataset + sensible defaults
    const config = {
      ordering: true,
      pageLength: 25,
      pagingType: 'full_numbers',
      responsive: true,
      language: {
        search: 'Filter records:',
        lengthMenu: 'Display _MENU_ records per page',
        info: 'Showing page _PAGE_ of _PAGES_',
      },
      drawCallback: function () {
        if (this.columns?.adjust) this.columns.adjust();
      },
      initComplete: function () {
        if (this.columns?.adjust) this.columns.adjust();
      },
      ...jsonOptions,
      ...datasetOptions,
    };

    // 👇 NEW: add (don’t replace) DataTables-friendly classes to the existing class list
    // Defaults are conservative; adjust as you like.
    const defaultDTClasses = ['display', 'stripe', 'hover'];

    // Allow users to declare additional classes:
    // - in JSON: { "tableClasses": ["compact", "row-border"] }
    // - or data attribute: <table data-table-classes="compact,row-border">
    const declaredJsonClasses = Array.isArray(jsonOptions.tableClasses)
      ? jsonOptions.tableClasses
      : [];
    const declaredDataClasses = Array.isArray(datasetOptions.tableClasses)
      ? datasetOptions.tableClasses
      : typeof datasetOptions.tableClasses === 'string'
      ? datasetOptions.tableClasses.split(',').map((c) => c.trim()).filter(Boolean)
      : [];

    const classesToAdd = [...new Set([...defaultDTClasses, ...declaredJsonClasses, ...declaredDataClasses])];
    classesToAdd.forEach((cls) => {
      if (cls) tableEl.classList.add(cls);
    });

    try {
      const dt = new DataTable(tableEl, config);
      dtInstances.push(dt);
    } catch (err) {
      console.error('Failed to initialize DataTable:', err, { tableEl, config });
    }
  });

  // Handle window resizing to reflow columns
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      dtInstances.forEach((dt) => {
        if (dt.columns?.adjust) dt.columns.adjust();
      });
    }, 250);
  });
});
