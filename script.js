// Handle Excel File Upload
document.getElementById('excelFileInput').addEventListener('change', handleFile, false);

function handleFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    const data = event.target.result;
    const workbook = XLSX.read(data, { type: 'binary' });

    // Assuming data is in the first sheet
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Convert sheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Display metrics
    displayMetrics(jsonData);
  };
  reader.onerror = function(event) {
    console.error('Error reading file:', event.target.error);
  };
  reader.readAsBinaryString(file);
}

function displayMetrics(data) {
  const metricsDiv = document.getElementById('metrics');
  metricsDiv.innerHTML = '';

  if (data.length === 0) {
    metricsDiv.innerText = 'No data found in the Excel file.';
    return;
  }

  // Create table
  const table = document.createElement('table');
  const headers = Object.keys(data[0]);

  // Table Header
  const thead = table.createTHead();
  const headerRow = thead.insertRow();
  headers.forEach(header => {
    const th = document.createElement('th');
    th.innerText = header;
    headerRow.appendChild(th);
  });

  // Table Body
  const tbody = table.createTBody();
  data.forEach(rowData => {
    const row = tbody.insertRow();
    headers.forEach(header => {
      const cell = row.insertCell();
      cell.innerText = rowData[header] || '';
    });
  });

  metricsDiv.appendChild(table);
}

// Handle Critical Jobs Input
document.getElementById('updateJobsButton').addEventListener('click', updateCriticalJobs);

function updateCriticalJobs() {
  const jobsInput = document.getElementById('criticalJobsInput').value;
  const jobsDisplay = document.getElementById('criticalJobsDisplay');
  jobsDisplay.innerHTML = '';

  const jobsArray = jobsInput.split('\n').filter(job => job.trim() !== '');
  if (jobsArray.length === 0) {
    jobsDisplay.innerText = 'No critical jobs entered.';
    return;
  }

  const list = document.createElement('ul');
  jobsArray.forEach(job => {
    const listItem = document.createElement('li');
    listItem.innerText = job;
    list.appendChild(listItem);
  });
  jobsDisplay.appendChild(list);
}
