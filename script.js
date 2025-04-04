// ตัวแปรสำหรับ Google Sheets API URL
const sheetId = '1-1CvXEzgeU6iO_NoQpL0lWmTI3DSEGaC2KOILsvetnU';  // ใส่ ID ของ Google Sheets ของคุณ
const apiKey = 'AIzaSyCPRT9U_a8PTWEzYqTc56ZadodxNaSYDds';    // ใส่ API Key ที่คุณได้จาก Google Cloud Console
const range = 'Sheet1!A1:E6';   // ระบุช่วงข้อมูลที่ต้องการดึง (เช่น A1:D10)

function loadData() {
  // กรอกหมายเลขติดตาม
  const trackId = document.getElementById("trackId").value.trim();
  if (!trackId) {
    alert("กรุณากรอกหมายเลขติดตาม");
    return;
  }

  // ดึงข้อมูลจาก Google Sheets
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${1-1CvXEzgeU6iO_NoQpL0lWmTI3DSEGaC2KOILsvetnU}/values/${Sheet1!A1:E6}?key=${AIzaSyCPRT9U_a8PTWEzYqTc56ZadodxNaSYDdsapiKey}`;
    // ใส่ API Key ที่คุณได้จาก Google Cloud Console
  }`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      // ประมวลผลข้อมูลจาก Google Sheets
      const values = data.values;
      const filteredData = values.filter(row => row[0] === trackId); // ตรวจสอบหมายเลขติดตาม

      if (filteredData.length === 0) {
        document.getElementById("timeline").innerHTML = "<p style='color:red;'>ไม่พบข้อมูล</p>";
        return;
      }

      drawTimeline(filteredData);
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
}

function drawTimeline(data) {
  const container = document.getElementById("timeline");
  container.innerHTML = ""; // เคลียร์ข้อมูลเก่า

  data.forEach(entry => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <div class="date">${entry[1]}</div>
      <div class="status">${entry[2]}</div>
      <div class="note">${entry[3]}</div>
      <div class="line"></div>
    `;
    container.appendChild(div);
  });
}
