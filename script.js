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
      if (!data.values) {
        document.getElementById("timeline").innerHTML = "<p class='text-danger text-center'>ไม่พบข้อมูลจาก Google Sheets</p>";
        return;
      }

      const values = data.values;
      const filtered = values.filter(row => (row[1] || "").trim() === trackId);
      if (filtered.length === 0) {
        document.getElementById("timeline").innerHTML = "<p class='text-danger text-center'>ไม่พบข้อมูล</p>";
        return;
      }

      drawTimeline(filtered);
    })
    .catch(error => {
      console.error("เกิดข้อผิดพลาด:", error);
      document.getElementById("timeline").innerHTML = "<p class='text-danger text-center'>เกิดข้อผิดพลาดในการดึงข้อมูล</p>";
    });
}

function drawTimeline(data) {
  const container = document.getElementById("timeline");
  container.innerHTML = "";

  data.forEach(entry => {
    const dateIn = entry[7] || "ไม่ระบุ";
    const dept = entry[5] || "ไม่ระบุ";
    const docNoIn = entry[6] || "ไม่ระบุ";
    const status = entry[8] || "รอดำเนินการ";  // ตรวจสอบสถานะ
    const dateOut = entry[11] || "ไม่ระบุ";
    const docNoOut = entry[10] || "ไม่ระบุ";
    const toDept = entry[9] || "ไม่ระบุ";
    const result = entry[12] || "ไม่ระบุ";
    const ranks = entry[2] || "ไม่ทราบชื่อ";
    const fname = entry[3] || "รอดำเนินการ";
    const lname = entry[4] || "ไม่ระบุ";
    const seq = entry[13] || "ไม่ระบุ";
    const ativedate = entry[14] || "ไม่ระบุ";
    const ative1 = entry[15] || "ไม่ระบุ";
    const release = entry[16] || "ไม่ระบุ";
    const release1 = entry[17] || "ไม่ทราบชื่อ";
    const guarantee = entry[18] || "ไม่ระบุ";
    const note = entry[19] || "ไม่ทราบชื่อ";

    // ถ้าสถานะเป็น "รอดำเนินการ" จะให้แสดงข้อความแจ้งเตือน
    if (status === "รอดำเนินการ") {
      const html = `
        <div class="alert alert-warning mb-4" role="alert">
          <div class="d-flex align-items-center">
            <span class="material-icons me-3" style="font-size: 40px;"></span>
            <div>
              <h4 class="alert-heading">📅 วันที่รับเรื่อง: ${dateIn}</h4>
              <p class="mb-2"><strong>หน่วยเจ้าของเรื่อง:</strong> ${dept}</p>
              <p class="mb-2"><strong>เลขที่หนังสือเข้า:</strong> ${docNoIn}</p>
              <p class="mb-2"><strong>สถานะ:</strong> <span class="badge bg-warning text-dark">กำลังตรวจสอบข้อมูล</span></p>
              <h5 class="text-primary">เพื่อรับรองเวลาราชการตอนเป็นทหารของ: ${ranks} ${fname} ${lname}</h5>
            </div>
          </div>
        </div>
      `;
      container.innerHTML += html;
      return; // ข้ามการแสดงผลส่วนอื่นๆ ของสถานะที่รอดำเนินการ
    }

    // ถ้าสถานะเป็นอย่างอื่นที่ไม่ใช่ "รอดดำเนินการ" ให้แสดงผลเป็น Timeline
    const html = `
      <div class="card mb-4 shadow-sm">
        <div class="card-body">
          <h5 class="card-title text-primary">📥 วันที่รับเรื่อง: ${dateIn}</h5>
          <p class="card-text"><strong>หน่วยเจ้าของเรื่อง:</strong> ${dept}</p>
          <p class="card-text"><strong>เลขที่หนังสือเข้า:</strong> ${docNoIn}</p>
          <p class="card-text"><strong>สถานะ:</strong> ${status}</p>
          <hr>
          <h5 class="card-title text-secondary">📤 วันที่ตอบหนังสือออก: ${dateOut}</h5>
          <p class="card-text"><strong>เลขที่หนังสือออก:</strong> ${docNoOut}</p>
          <p class="card-text"><strong>ส่งเรื่องให้หน่วย:</strong> ${toDept}</p>
          <p class="card-text"><strong>ผลพิจารณา:</strong> ${result}</p>
          <hr>
          <h5 class="card-title text-success">📤 ได้ตรวจสอบเวลาราชการแล้วขอรับรองว่า: ${ranks} ${fname} ${lname}</h5>
          <p class="card-text"><strong>ขึ้นทะเบียนทหารกองประจำการเมื่อ:</strong> ${ativedate}</p>
          <p class="card-text"><strong>เข้ารับราชการเมื่อ:</strong> ${ative1}</p>
          <p class="card-text"><strong>ออกจากราชการเมื่อ:</strong> ${release}</p>
          <p class="card-text"><strong>ปลดเป็นกองหนุนชั้นที่ 1 เมื่อ:</strong> ${release1}</p>
          <p class="card-text"><strong>รับราชการ:</strong> ${guarantee}</p>
          <p class="card-text"><strong>หมายเหตุ:</strong> ${note}</p>
          <p class="card-text"><strong>ลำดับในแฟ้ม:</strong> ${seq}</p>
        </div>
      </div>
    `;
    container.innerHTML += html;

    // เรียกเสียงพูดชื่อผู้ใช้ (ภาษาไทย)
    speakThai("ชื่อผู้ติดตามคือ " + fname + " " + lname);
  });
}




function speakThai(text) {
  const synth = window.speechSynthesis;
  const utterThis = new SpeechSynthesisUtterance(text);

  const voices = synth.getVoices();
  const thaiVoice = voices.find(voice => voice.lang.startsWith("th"));

  if (thaiVoice) {
    utterThis.voice = thaiVoice;
  }
  synth.speak(utterThis);
}

// บางเบราว์เซอร์ต้องรอโหลด voice
window.speechSynthesis.onvoiceschanged = () => {};
