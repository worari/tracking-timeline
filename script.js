function loadData() {
    const id = document.getElementById("trackId").value.trim();
    if (!id) {
      alert("กรุณากรอกหมายเลขติดตาม");
      return;
    }
  
    // ตัวอย่างข้อมูลในระบบ
    const data = [
      { id: '001', title: 'เอกสารรออนุมัติ', status: 'รออนุมัติ', date: '2025-04-01', note: 'รอเจ้าหน้าที่ตรวจสอบ' },
      { id: '001', title: 'เอกสารได้รับการอนุมัติ', status: 'อนุมัติแล้ว', date: '2025-04-02', note: 'เจ้าหน้าที่อนุมัติเอกสาร' },
      { id: '002', title: 'ใบเบิกค่าใช้จ่าย', status: 'อยู่ระหว่างดำเนินการ', date: '2025-04-01', note: 'รอการตรวจสอบ' }
    ];
  
    const filteredData = data.filter(entry => entry.id === id);
  
    if (filteredData.length === 0) {
      document.getElementById("timeline").innerHTML = "<p style='color:red;'>ไม่พบข้อมูล</p>";
      return;
    }
  
    drawTimeline(filteredData);
  }
  
  function drawTimeline(data) {
    const container = document.getElementById("timeline");
    container.innerHTML = ""; // เคลียร์ข้อมูลเก่า
  
    data.forEach(entry => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <div class="date">${entry.date}</div>
        <div class="status">${entry.status}</div>
        <div class="note">${entry.note}</div>
        <div class="line"></div>
      `;
      container.appendChild(div);
    });
  }
  