const sheetId = '1-1CvXEzgeU6iO_NoQpL0lWmTI3DSEGaC2KOILsvetnU';
const apiKey = 'AIzaSyCPRT9U_a8PTWEzYqTc56ZadodxNaSYDds';
const range = 'Sheet1!A1:U1000'; // ดึงข้อมูลพร้อมหัวตาราง

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
      if (!data.values || data.values.length < 2) {
        document.getElementById("timeline").innerHTML = "<p class='text-danger text-center'>ไม่พบข้อมูล</p>";
        return;
      }

      const headers = data.values[0];  // หัวตาราง
      const rows = data.values.slice(1); // ข้อมูลทั้งหมด

      const filtered = rows.filter(row => (row[1] || "").trim() === trackId); // สมมุติว่า column 1 คือเลข ปชช.
      if (filtered.length === 0) {
        document.getElementById("timeline").innerHTML = "<p class='text-danger text-center'>ไม่พบข้อมูลของหมายเลขบัตร ปชช. นี้</p>";
        return;
      }

      drawTimeline(filtered, headers);
    })
    .catch(error => {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      document.getElementById("timeline").innerHTML = "<p class='text-danger text-center'>เกิดข้อผิดพลาดในการโหลดข้อมูล</p>";
    });
}

function drawTimeline(data, headers) {
  const container = document.getElementById("timeline");
  container.innerHTML = "";

  data.forEach(row => {
    const field = {};
    headers.forEach((key, i) => {
      field[key.trim()] = row[i] || "";
    });

    const html = `
      <div class="card mb-3">
        <div class="card-body">
          <h5 class="text-primary">📥 วันที่รับเรื่อง: ${field["วันที่หนังสือเข้า"] || "-"}</h5>
          <p><strong>หน่วยเจ้าของเรื่อง:</strong> ${field["หน่วยเจ้าของเรื่อง"] || "-"}</p>
          <p><strong>เลขหนังสือเข้า:</strong> ${field["เลขหนังสือเข้า"] || "-"}</p>
          <p><strong>ชื่อ - สกุล:</strong> ${field["คำนำหน้าหรือยศ"+"ชื่อ"+"สกุล"] || "-"}</p>
          <p><strong>สถานะ:</strong> ${field["สถานะ"] || "-"}</p>
        </div>
      </div>

      <div class="card mb-3">
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
