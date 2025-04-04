// ตัวแปรสำหรับ Google Sheets API URL
const sheetId = '1-1CvXEzgeU6iO_NoQpL0lWmTI3DSEGaC2KOILsvetnU';  // ใส่ ID ของ Google Sheets ของคุณ
const apiKey = 'AIzaSyCPRT9U_a8PTWEzYqTc56ZadodxNaSYDds';    // ใส่ API Key ที่คุณได้จาก Google Cloud Console
const range = 'Sheet1!A1:E6';   // ระบุช่วงข้อมูลที่ต้องการดึง (เช่น A1:D10)

function loadData() {
    const trackId = document.getElementById("trackId").value.trim();
    if (!trackId) {
      alert("กรุณากรอกหมายเลขติดตาม");
      return;
    }

  // ดึงข้อมูลจาก Google Sheets
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
    // ใส่ API Key ที่คุณได้จาก Google Cloud Console

    fetch(url)
    .then(response => response.json())
    .then(data => {
      const values = data.values || [];
      const filteredData = values.filter(row => (row[0] || "").trim() === trackId);

      if (filteredData.length === 0) {
        document.getElementById("timeline").innerHTML = "<p style='color:red;'>ไม่พบข้อมูล</p>";
        return;
      }

      drawTimeline(filteredData);
    })
    .catch(error => {
      console.error("เกิดข้อผิดพลาด:", error);
    });
}

function drawTimeline(data) {
    const container = document.getElementById("timeline");
    container.innerHTML = "";
  
    data.forEach(entry => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <div class="date"><strong>วันที่:</strong> ${entry[1]}</div>
        <div class="status"><strong>สถานะ:</strong> ${entry[2]}</div>
        <div class="note"><strong>หมายเหตุ:</strong> ${entry[3]}</div>
        <hr>
      `;
      container.appendChild(div);
    });
  }
