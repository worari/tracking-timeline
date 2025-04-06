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

  let timelineContent = '';

  data.forEach(entry => {
    const dateIn = entry[7] || "ไม่ระบุ";
    const dept = entry[5] || "ไม่ระบุ";
    const docNoIn = entry[6] || "ไม่ระบุ";
    const status = entry[8] || "รอดำเนินการ";
    const dateOut = entry[11] || "ไม่ระบุ";
    const docNoOut = entry[10] || "ไม่ระบุ";
    const toDept = entry[9] || "ไม่ระบุ";
    const result = entry[12] || "ไม่ระบุ";
    const ranks = entry[2] || "ไม่ทราบชื่อ";
    const fname = entry[3] || "รอดำเนินการ";
    const lname = entry[4] || "ไม่ระบุ";

    const html = `
      <div class="card mb-4 shadow-sm">
        <div class="card-body">
          <h5 class="card-title text-primary">📥 วันที่รับเรื่อง: ${dateIn}</h5>
          <p class="card-text"><strong>หน่วยเจ้าของเรื่อง:</strong> ${dept}</p>
          <p class="card-text"><strong>เลขที่หนังสือเข้า:</strong> ${docNoIn}</p>
          <p class="card-text"><strong>สถานะ:</strong> ${status}</p>
          <hr>
          <h5 class="card-title text-success">📤 วันที่ตอบหนังสือออก: ${dateOut}</h5>
          <p class="card-text"><strong>เลขที่หนังสือออก:</strong> ${docNoOut}</p>
          <p class="card-text"><strong>ส่งเรื่องให้หน่วย:</strong> ${toDept}</p>
          <p class="card-text"><strong>ผลพิจารณา:</strong> ${result}</p>
          <hr>
        </div>
      </div>
    `;
    timelineContent += html;

    // Build Word Document Content
    const wordContent = `
      วันที่รับเรื่อง: ${dateIn}
      หน่วยเจ้าของเรื่อง: ${dept}
      เลขที่หนังสือเข้า: ${docNoIn}
      สถานะ: ${status}
      วันที่ตอบหนังสือออก: ${dateOut}
      เลขที่หนังสือออก: ${docNoOut}
      ส่งเรื่องให้หน่วย: ${toDept}
      ผลพิจารณา: ${result}
      ------------------------------
    `;
  });

  container.innerHTML = timelineContent;

  // Add the export to Word button
  const exportButton = `<button class="btn btn-primary mt-4" onclick="exportToWord('${timelineContent}')">พิมพ์เอกสาร (Word)</button>`;
  container.innerHTML += exportButton;
}

function exportToWord(timelineContent) {
  const doc = new Docxtemplater();
  const zip = new JSZip();

  // Set up the Word document template and data
  const docTemplate = `
    <html xmlns:w="urn:schemas-microsoft-com:office:word">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      </head>
      <body>
        <h1>ข้อมูลการติดตามผล</h1>
        <p>${timelineContent}</p>
      </body>
    </html>
  `;

  zip.file("document.xml", docTemplate);
  zip.generateAsync({ type: "blob" }).then(function(content) {
    saveAs(content, "timeline_report.docx");
  });
}

// Function to speak the name (as per original code)
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

// For some browsers, wait for the voices to be loaded
window.speechSynthesis.onvoiceschanged = () => {};
