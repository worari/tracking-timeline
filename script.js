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
        document.getElementById("timeline").innerHTML = "<p class='text-danger'>ไม่พบข้อมูล</p>";
        return;
      }

      const headers = data.values[0];
      const rows = data.values.slice(1);
      const matched = rows.filter(row => (row[1] || "").trim() === trackId);

      if (matched.length === 0) {
        document.getElementById("timeline").innerHTML = "<p class='text-danger'>ไม่พบข้อมูล</p>";
        return;
      }

      drawTimeline(matched);
    })
    .catch(error => {
      console.error("Error:", error);
      document.getElementById("timeline").innerHTML = "<p class='text-danger'>เกิดข้อผิดพลาดในการดึงข้อมูล</p>";
    });
}

function drawTimeline(data) {
  const container = document.getElementById("timeline");
  container.innerHTML = '<div class="timeline"></div>';
  const timeline = container.querySelector(".timeline");

  data.forEach(entry => {
    const inDate = entry[4] || "ไม่ระบุ";
    const inDept = entry[2] || "ไม่ระบุ";
    const inLetter = entry[3] || "-";
    const status = entry[5] || "รอดำเนินการ";

    const outDate = entry[6] || null;
    const outLetter = entry[7] || null;
    const outTo = entry[8] || null;
    const result = entry[9] || null;

    const html = `
      <div class="timeline-item">
        <div class="timeline-icon"><i class="bi bi-upload"></i></div>
        <div class="timeline-content">
          <h5 class="fw-bold">📥 วันที่รับเรื่อง: ${inDate}</h5>
          <p>หน่วยงาน: ${inDept}<br>เลขหนังสือเข้า: ${inLetter}</p>
          <span class="badge bg-info">สถานะ: ${status}</span>
        </div>
      </div>
      ${outDate ? `
      <div class="timeline-item">
        <div class="timeline-icon bg-success"><i class="bi bi-send-check"></i></div>
        <div class="timeline-content">
          <h5 class="fw-bold">📤 วันที่หนังสือออก: ${outDate}</h5>
          <p>เลขหนังสือออก: ${outLetter}<br>ส่งให้หน่วย: ${outTo}</p>
          <span class="badge bg-success">ผลพิจารณา: ${result}</span>
        </div>
      </div>
      ` : ''}
    `;
    timeline.innerHTML += html;
  });
}

function speak(text) {
  const synth = window.speechSynthesis;
  if (synth) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'th-TH'; // ภาษาไทย
    synth.speak(utter);
  }
}

function drawTimeline(data) {
  const container = document.getElementById("timeline");
  container.innerHTML = '<div class="timeline" id="timelineContent"></div>';
  const timeline = container.querySelector(".timeline");

  data.forEach(entry => {
    const inDate = entry[4] || "ไม่ระบุ";
    const inDept = entry[2] || "ไม่ระบุ";
    const inLetter = entry[3] || "-";
    const status = entry[5] || "รอดำเนินการ";

    const outDate = entry[6] || null;
    const outLetter = entry[7] || null;
    const outTo = entry[8] || null;
    const result = entry[9] || null;

    const html = `
      <div class="timeline-item">
        <div class="timeline-icon"><i class="bi bi-upload"></i></div>
        <div class="timeline-content">
          <h5 class="fw-bold">📥 วันที่รับเรื่อง: ${inDate}</h5>
          <p>หน่วยงาน: ${inDept}<br>เลขหนังสือเข้า: ${inLetter}</p>
          <span class="badge bg-info">สถานะ: ${status}</span>
        </div>
      </div>
      ${outDate ? `
      <div class="timeline-item">
        <div class="timeline-icon bg-success"><i class="bi bi-send-check"></i></div>
        <div class="timeline-content">
          <h5 class="fw-bold">📤 วันที่หนังสือออก: ${outDate}</h5>
          <p>เลขหนังสือออก: ${outLetter}<br>ส่งให้หน่วย: ${outTo}</p>
          <span class="badge bg-success">ผลพิจารณา: ${result}</span>
        </div>
      </div>
      ` : ''}
    `;
    timeline.innerHTML += html;
  });

  // 🔊 พูดเมื่อโหลดสำเร็จ
  speak("พบข้อมูลแล้ว กรุณาตรวจสอบ");
}

