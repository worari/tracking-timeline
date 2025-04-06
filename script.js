const sheetId = '1-1CvXEzgeU6iO_NoQpL0lWmTI3DSEGaC2KOILsvetnU';
const apiKey = 'AIzaSyCPRT9U_a8PTWEzYqTc56ZadodxNaSYDds';
const range = 'Sheet1!A1:U1000'; // ช่วงข้อมูลที่ต้องการดึง

function loadData() {
  const trackId = document.getElementById("trackId").value.trim();
  if (!trackId) {
    alert("กรุณากรอกหมายเลขบัตร ปชช.");
    return;
  }

  // สร้าง URL สำหรับดึงข้อมูลจาก Google Sheets API
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

  // เริ่มทำการดึงข้อมูลจาก API
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // ตรวจสอบว่าเราได้รับค่าจาก API หรือไม่
      if (!data.values) {
        console.error("ไม่พบข้อมูลจาก Google Sheets");
        document.getElementById("timeline").innerHTML = "<p class='text-danger text-center'>ไม่พบข้อมูลจาก Google Sheets</p>";
        return;
      }

      const values = data.values || [];
      console.log("ข้อมูลที่ดึงมา:", values); // ตรวจสอบข้อมูลที่ดึงมา

      // กรองข้อมูลตาม trackId
      const filtered = values.filter(row => (row[1] || "").trim() === trackId);
      if (filtered.length === 0) {
        document.getElementById("timeline").innerHTML = "<p class='text-danger text-center'>ไม่พบข้อมูลที่ตรงกับหมายเลขบัตร ปชช.</p>";
        return;
      }

      // เรียกใช้ฟังก์ชันเพื่อวาด Timeline
      drawTimeline(filtered);
    })
    .catch(error => {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      document.getElementById("timeline").innerHTML = "<p class='text-danger text-center'>เกิดข้อผิดพลาดในการดึงข้อมูล</p>";
    });
}

function drawTimeline(data) {
  const container = document.getElementById("timeline");
  container.innerHTML = ""; // เคลียร์ข้อมูลเก่า

  // วนลูปเพื่อแสดงข้อมูล
  data.forEach(entry => {
    // ตรวจสอบค่าที่ดึงมาว่ามีคอลัมน์ที่ต้องการหรือไม่
    const date = entry[7] || "ไม่ระบุ";
    const status = entry[8] || "ไม่ระบุ";
    const note = entry[9] || "ไม่ระบุ";
    const date2 = entry[11] || "ไม่ระบุ";
    const status2 = entry[13] || "ไม่ระบุ";
    const note2 = entry[18] || "ไม่ระบุ";
    const note3 = entry[19] || "ไม่ระบุ";


    const html = `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title text-primary">📅 วันที่: ${date}</h5>
          <p class="card-text">สถานะ: ${status}</p>
          <p class="card-text text-muted">หมายเหตุ: ${note}</p>
        </div>
      </div>
        <div class="card mb-4">
        <div class="card-body">
          <h5 class="text-success">📤 วันที่หนังสือออก: ${date2["วันที่หนังสือออก"] || "-"}</h5>
          <p><strong>เลขหนังสือ:</strong> ${status2["เลขหนังสือ"] || "-"}</p>
          <p><strong>ส่งเรื่องให้หน่วย:</strong> ${note2["ส่งเรื่องให้หน่วย"] || "-"}</p>
          <p><strong>ผลพิจารณา:</strong> ${note3["ผลพิจารณา"] || "-"}</p>
        </div>
      </div>
      `;

    const cardHtml = `
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="text-primary">📥 วันที่รับเรื่อง: ${field["วันที่หนังสือเข้า"] || "-"}</h5>
          <p><strong>หน่วยเจ้าของเรื่อง:</strong> ${field["หน่วยเจ้าของเรื่อง"] || "-"}</p>
          <p><strong>เลขหนังสือเข้า:</strong> ${field["เลขหนังสือเข้า"] || "-"}</p>
          <p><strong>สถานะ:</strong> รับเรื่องแล้ว</p>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-body">
          <h5 class="text-success">📤 วันที่หนังสือออก: ${field["วันที่หนังสือออก"] || "-"}</h5>
          <p><strong>เลขหนังสือ:</strong> ${field["เลขหนังสือ"] || "-"}</p>
          <p><strong>ส่งเรื่องให้หน่วย:</strong> ${field["ส่งเรื่องให้หน่วย"] || "-"}</p>
          <p><strong>ผลพิจารณา:</strong> ${field["ผลพิจารณา"] || "-"}</p>
        </div>
      </div>
    `;
    container.innerHTML += html;
  });
}
