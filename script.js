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
    const dept = entry[3] || "ไม่ระบุ";
    const docNoIn = entry[4] || "ไม่ระบุ";
    const status = entry[5] || "รอดำเนินการ";
    const dateOut = entry[10] || "ไม่ระบุ";
    const docNoOut = entry[11] || "ไม่ระบุ";
    const toDept = entry[12] || "ไม่ระบุ";
    const result = entry[13] || "ไม่ระบุ";
    const name = entry[2] || "ไม่ทราบชื่อ";

    const html = `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title text-primary">📥 วันที่รับเรื่อง: ${dateIn}</h5>
          <p class="card-text">หน่วยงาน: ${dept}</p>
          <p class="card-text">เลขหนังสือเข้า: ${docNoIn}</p>
          <p class="card-text">สถานะ: ${status}</p>
          <hr>
          <h5 class="card-title text-success">📤 วันที่หนังสือออก: ${dateOut}</h5>
          <p class="card-text">เลขหนังสือออก: ${docNoOut}</p>
          <p class="card-text">ส่งเรื่องให้หน่วย: ${toDept}</p>
          <p class="card-text">ผลพิจารณา: ${result}</p>
        </div>
      </div>
    `;

    container.innerHTML += html;

    // เรียกเสียงพูดชื่อผู้ใช้ (ภาษาไทย)
    speakThai("ชื่อผู้ติดตามคือ " + name);
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
