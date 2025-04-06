
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
      const headers = values[0];
      const records = values.slice(1);
      const filtered = records.filter(row => (row[1] || "").trim() === trackId);

      if (filtered.length === 0) {
        document.getElementById("timeline").innerHTML = "<p class='text-danger'>ไม่พบข้อมูลที่ตรงกับหมายเลขติดตาม</p>";
        return;
      }

      const userName = filtered[0][2] || "ผู้ใช้งาน";
      speakName(userName);
      generateQRCode(trackId);
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
    const dateIn = entry[7] || "ไม่ระบุ";
    const dept = entry[4] || "ไม่ระบุหน่วย";
    const docIn = entry[6] || "-";
    const status = entry[8] || "-";
    const dateOut = entry[10] || "-";
    const docOut = entry[11] || "-";
    const sentTo = entry[12] || "-";
    const result = entry[13] || "-";

    const html = `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title text-primary">📥 วันที่รับเรื่อง: ${dateIn}</h5>
          <p>หน่วยงาน: ${dept}</p>
          <p>เลขหนังสือเข้า: ${docIn}</p>
          <p><strong>สถานะ:</strong> ${status}</p>
          <hr>
          <h5 class="card-title text-success">📤 วันที่หนังสือออก: ${dateOut}</h5>
          <p>เลขหนังสือออก: ${docOut}</p>
          <p>ส่งเรื่องให้: ${sentTo}</p>
          <p>ผลพิจารณา: ${result}</p>
        </div>
      </div>`;

    container.innerHTML += html;
  });
}

function speakName(name) {
  const msg = new SpeechSynthesisUtterance("ชื่อผู้ใช้: " + name);
  msg.lang = "th-TH";
  window.speechSynthesis.speak(msg);
}

function generateQRCode(trackId) {
  const qrcodeContainer = document.getElementById("qrcode");
  qrcodeContainer.innerHTML = "";
  new QRCode(qrcodeContainer, {
    text: `หมายเลขติดตาม: ${trackId}`,
    width: 128,
    height: 128,
  });
}

function exportExcel() {
  const table = document.getElementById("timeline");
  const wb = XLSX.utils.table_to_book(table, { sheet: "TrackingData" });
  XLSX.writeFile(wb, "tracking_result.xlsx");
}
