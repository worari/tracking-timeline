
const sheetId = '1-1CvXEzgeU6iO_NoQpL0lWmTI3DSEGaC2KOILsvetnU';
const apiKey = 'AIzaSyCPRT9U_a8PTWEzYqTc56ZadodxNaSYDds';
const range = 'Sheet1!A1:U1000';

function loadData() {
  const trackId = document.getElementById("trackId").value.trim();
  if (!trackId) {
    alert("กรุณากรอกหมายเลขบัตร ปชช.");
    return;
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const values = data.values || [];
      const filtered = values.filter(row => (row[0] || "").trim() === trackId);
      if (filtered.length === 0) {
        document.getElementById("timeline").innerHTML = "<p class='text-danger text-center'>ไม่พบข้อมูล</p>";
        return;
      }
      drawTimeline(filtered);
    })
    .catch(error => {
      console.error("เกิดข้อผิดพลาด:", error);
    });
}

function drawTimeline(data) {
  const container = document.getElementById("timeline");
  container.innerHTML = "";

  data.forEach(entry => {
    const html = `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title text-primary">📅 วันที่: ${entry[7]}</h5>
          <p class="card-text">สถานะ: ${entry[5]}</p>
          <p class="card-text text-muted">หมายเหตุ: ${entry[17]}</p>
        </div>
      </div>`;
    container.innerHTML += html;
  });
}
