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

function drawTimeline(data) {
  const container = document.getElementById("timeline");
  container.innerHTML = ""; // เคลียร์ข้อมูลเก่า

  const timeline = document.createElement("div");
  timeline.className = "timeline";

  data.forEach((entry, index) => {
    const dateIn = entry[7] || "ไม่ระบุ";
    const office = entry[4] || "ไม่ระบุหน่วยงาน";
    const bookNoIn = entry[5] || "ไม่ระบุเลขหนังสือ";
    const status = entry[8] || "สถานะไม่ระบุ";
    const result = entry[10] || "-";
    const bookOutDate = entry[12] || "-";
    const bookOutNo = entry[13] || "-";
    const sendTo = entry[14] || "-";

    const item = `
      <div class="timeline-item mb-4">
        <div class="d-flex align-items-center mb-2">
          <div class="timeline-icon bg-primary text-white rounded-circle me-3">
            <i class="bi bi-file-earmark-arrow-down-fill"></i>
          </div>
          <h5 class="mb-0">📥 วันที่รับเรื่อง: ${dateIn}</h5>
        </div>
        <p class="mb-1">หน่วยงาน: ${office}</p>
        <p class="mb-1">เลขหนังสือเข้า: ${bookNoIn}</p>
        <p class="mb-1"><strong>สถานะ:</strong> ${status}</p>

        <div class="d-flex align-items-center mt-3 mb-2">
          <div class="timeline-icon bg-success text-white rounded-circle me-3">
            <i class="bi bi-check2-circle"></i>
          </div>
          <h5 class="mb-0">📤 วันที่หนังสือออก: ${bookOutDate}</h5>
        </div>
        <p class="mb-1">เลขหนังสือออก: ${bookOutNo}</p>
        <p class="mb-1">ส่งให้หน่วย: ${sendTo}</p>
        <p class="mb-2"><strong>ผลพิจารณา:</strong> ${result}</p>

        <hr>
      </div>
    `;

    timeline.innerHTML += item;
  });

  container.appendChild(timeline);
}

