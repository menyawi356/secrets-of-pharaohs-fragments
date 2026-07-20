<!-- ================================================================= -->
<!-- PHARAOHS' FRAGMENTS - CERTIFICATE SECTION MODULE                 -->
<!-- ================================================================= -->

<style>
  /* Scoped Styles for Integrated Certificate Section */
  #certificates {
    padding: 80px 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .cert-card {
    width: 100%;
    max-width: 680px;
    background: var(--panel, #16140f);
    border: 1px solid var(--line, #33301f);
    border-radius: 16px;
    padding: 30px 26px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  }

  .cert-brand {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 12px;
  }

  .cert-brand .badge {
    width: 46px;
    height: 46px;
    border-radius: 8px;
    background: linear-gradient(145deg, var(--gold-bright, #e7c675), #8f6f22);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    color: #141005;
    font-size: 13px;
    line-height: 1.2;
    text-align: center;
    flex-shrink: 0;
  }

  .cert-title {
    font-size: 22px;
    margin: 0;
    font-weight: 700;
    color: var(--text, #ece6d6);
  }

  .cert-lead {
    color: var(--text-dim, #a49d86);
    font-size: 14px;
    margin: 10px 0 24px;
    line-height: 1.7;
  }

  .cert-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
  }

  .cert-tab-btn {
    flex: 1;
    padding: 10px 12px;
    border-radius: 9px;
    border: 1px solid var(--line, #33301f);
    background: #0f0d08;
    color: var(--text-dim, #a49d86);
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }

  .cert-tab-btn:hover {
    border-color: var(--gold, #c8a24a);
    color: var(--text, #ece6d6);
  }

  .cert-tab-btn.active {
    background: var(--gold-bright, #e7c675);
    color: #141005;
    border-color: var(--gold-bright, #e7c675);
  }

  .cert-form-group {
    margin-bottom: 16px;
  }

  .cert-label {
    display: block;
    font-size: 13px;
    color: var(--text-dim, #a49d86);
    margin-bottom: 6px;
    font-weight: 600;
  }

  .cert-input,
  .cert-select {
    width: 100%;
    padding: 12px 14px;
    border-radius: 9px;
    border: 1px solid var(--line, #33301f);
    background: #0f0d08;
    color: var(--text, #ece6d6);
    font-family: inherit;
    font-size: 14px;
    transition: border-color 0.2s ease;
  }

  .cert-input:focus,
  .cert-select:focus {
    outline: none;
    border-color: var(--gold-bright, #e7c675);
    box-shadow: 0 0 0 2px rgba(231, 198, 117, 0.2);
  }

  .btn-cert-submit {
    width: 100%;
    padding: 13px 16px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-family: inherit;
    font-weight: 700;
    font-size: 15px;
    background: var(--gold-bright, #e7c675);
    color: #141005;
    transition: background 0.2s ease;
  }

  .btn-cert-submit:hover {
    background: #f2d68e;
  }

  .cert-msg {
    font-size: 13.5px;
    margin-top: 14px;
    line-height: 1.6;
    display: none;
    padding: 10px 14px;
    border-radius: 8px;
  }

  .cert-msg.show {
    display: block;
  }

  .cert-msg.err {
    color: #c96a56;
    background: rgba(201, 106, 86, 0.1);
    border: 1px solid rgba(201, 106, 86, 0.3);
  }

  .cert-result-box {
    display: none;
    margin-top: 24px;
  }

  .cert-result-box.show {
    display: block;
  }

  .cert-result-badge {
    display: inline-block;
    font-size: 12px;
    font-weight: 700;
    color: #141005;
    background: var(--gold-bright, #e7c675);
    padding: 5px 12px;
    border-radius: 999px;
    margin-bottom: 14px;
  }

  .cert-canvas {
    width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 12px 34px rgba(0, 0, 0, 0.55);
    display: block;
  }

  .cert-dl-row {
    display: flex;
    gap: 10px;
    margin-top: 16px;
  }

  .cert-footer-note {
    text-align: center;
    color: var(--text-dim, #a49d86);
    font-size: 12px;
    margin-top: 24px;
  }
</style>

<section id="certificates" dir="rtl">
  <div class="cert-card">
    <div class="brand">
      <div class="badge">Pharaohs'<br>Fragments</div>
      <h2 class="cert-title" id="pageTitle">احصل على شهادتك — Get Your Certificate</h2>
    </div>

    <div class="cert-tabs">
      <button class="cert-tab-btn active" id="tabQF" onclick="switchCertTab('qf')">ربع النهائي</button>
      <button class="cert-tab-btn" id="tabSF" onclick="switchCertTab('sf')">نصف النهائي</button>
      <button class="cert-tab-btn" id="tabFR" onclick="switchCertTab('fr')">النهائي</button>
    </div>

    <!-- ===== QUARTER-FINALS PANEL ===== -->
    <div id="panelQF" class="cert-panel">
      <p class="cert-lead">اختر اسم فريقك من القائمة، واكتب بريدك الإلكتروني أو بريد أي عضو في الفريق لاستخراج شهادة التأهل لربع النهائي.</p>

      <div class="cert-form-group">
        <label class="cert-label" for="teamSelectQF">اسم الفريق</label>
        <select id="teamSelectQF" class="cert-select">
          <option value="">— اختر الفريق —</option>
        </select>
      </div>

      <div class="cert-form-group">
        <label class="cert-label" for="emailInputQF">البريد الإلكتروني</label>
        <input type="text" id="emailInputQF" class="cert-input" placeholder="example@email.com" autocomplete="off">
      </div>

      <button class="btn-cert-submit" id="searchBtnQF" onclick="handleCertSearch('qf')">🔍 استخراج الشهادة</button>

      <div class="cert-msg" id="msgBoxQF"></div>

      <div id="resultBoxQF" class="cert-result-box">
        <span class="cert-result-badge">🏆 شهادة التأهل لربع النهائي</span>
        <canvas id="certCanvasQF" class="cert-canvas" width="1001" height="707"></canvas>
        <div class="cert-dl-row">
          <button class="btn-cert-submit" onclick="downloadCert('qf')">⬇ تنزيل الشهادة</button>
        </div>
      </div>
    </div>

    <!-- ===== SEMI-FINAL PANEL ===== -->
    <div id="panelSF" class="cert-panel" style="display:none;">
      <p class="cert-lead">اختر اسم فريقك من القائمة، واكتب بريدك الإلكتروني أو بريد أي عضو في الفريق لاستخراج شهادة التأهل لنصف النهائي.</p>

      <div class="cert-form-group">
        <label class="cert-label" for="teamSelectSF">اسم الفريق</label>
        <select id="teamSelectSF" class="cert-select">
          <option value="">— اختر الفريق —</option>
        </select>
      </div>

      <div class="cert-form-group">
        <label class="cert-label" for="emailInputSF">البريد الإلكتروني</label>
        <input type="text" id="emailInputSF" class="cert-input" placeholder="example@email.com" autocomplete="off">
      </div>

      <button class="btn-cert-submit" id="searchBtnSF" onclick="handleCertSearch('sf')">🔍 استخراج الشهادة</button>

      <div class="cert-msg" id="msgBoxSF"></div>

      <div id="resultBoxSF" class="cert-result-box">
        <span class="cert-result-badge">🏆 شهادة التأهل لنصف النهائي</span>
        <canvas id="certCanvasSF" class="cert-canvas" width="1001" height="707"></canvas>
        <div class="cert-dl-row">
          <button class="btn-cert-submit" onclick="downloadCert('sf')">⬇ تنزيل الشهادة</button>
        </div>
      </div>
    </div>

    <!-- ===== FINAL ROUND PANEL ===== -->
    <div id="panelFR" class="cert-panel" style="display:none;">
      <p class="cert-lead">اختر اسم فريقك من القائمة، واكتب بريدك الإلكتروني أو بريد أي عضو في الفريق لاستخراج شهادة النهائي.</p>

      <div class="cert-form-group">
        <label class="cert-label" for="teamSelectFR">اسم الفريق</label>
        <select id="teamSelectFR" class="cert-select">
          <option value="">— اختر الفريق —</option>
        </select>
      </div>

      <div class="cert-form-group">
        <label class="cert-label" for="emailInputFR">البريد الإلكتروني</label>
        <input type="text" id="emailInputFR" class="cert-input" placeholder="example@email.com" autocomplete="off">
      </div>

      <button class="btn-cert-submit" id="searchBtnFR" onclick="handleCertSearch('fr')">🔍 استخراج الشهادة</button>

      <div class="cert-msg" id="msgBoxFR"></div>

      <div id="resultBoxFR" class="cert-result-box">
        <span class="cert-result-badge">🏆 شهادة النهائي</span>
        <canvas id="certCanvasFR" class="cert-canvas" width="1001" height="707"></canvas>
        <div class="cert-dl-row">
          <button class="btn-cert-submit" onclick="downloadCert('fr')">⬇ تنزيل الشهادة</button>
        </div>
      </div>
    </div>

    <div class="cert-footer-note">معالجة فورية داخل المتصفح — بياناتك آمنة ولا يتم رفعها لأي خادم</div>
  </div>
</section>

<script>
  /* =========== CERTIFICATE DATA & SYSTEM =========== */
  const CERT_DATA = {
    qf: { 
      teams: {
        "Golden Pharaoh":{"emails":["omar.2225033@stemsharkya.moe.edu.eg","mohamedhemdanmado@gmail.com","ahmedelkhalafawy2010@gmail.com"],"members":["omar mostafa","Mohamed Ahmed","Ahmed Mohamed"]},
        "Engineers":{"emails":["alisheira18@gmail.com","nsr85628@gmail.com","abdo8975432@gmail.com"],"members":["Ali Ezat","Ahmed Mohamed","Abdelwahab Ebrahim"]},
        "Baraamo1":{"emails":["baraatv2006@gmail.com"],"members":["Baraa Mohammed"]},
        "Athera":{"emails":["janagamal366@gmail.com","r78397109@gmail.com","moaaz.2524052@stemelsadat.moe.edu.eg"],"members":["Jana gamal","Ratal ahmed","Moaz ataf"]},
        "Badawey":{"emails":["neigarbadawey@gmail.com"],"members":["Neigar Badawy"]},
        "Brilliant team":{"emails":["wtnd347ff55877366m@gmail.com","hnynla344@gmail.com","asmamohamedq55@gmail.com"],"members":["Jannat Mohamed","Haneen Alaa","Jana Mohammed"]},
        "Big Bang Bros":{"emails":["gaser.1825017@stemksheikh.moe.edu.eg","mohamed956888ali@gmail.com","mohammed.1425039@stemksheikh.moe.edu.eg"],"members":["Gasser Mahmoud","Mohamed Ali","Mohamed Ahmed"]},
        "Dark Aura":{"emails":["zeinabshapana@gmail.com","nooralhodasaad658@gmail.com"],"members":["Remas Yousry","Nour al"]},
        "Blood code":{"emails":["ahmed.3215001@stembehera.moe.edu.eg","ahmed.3125018@stembehera.moe.edu.eg","mazen.3125017@stembehera.moe.edu.eg"],"members":["Ahmed Hamdy","Ahmed Sabry","Mazen Sameh"]},
        "Cleoquarks":{"emails":["toqa.1525516@stemluxor.moe.edu.eg","s06377385@gmail.com","sndsahmd490@gmail.com"],"members":["Toqa Mohamad","Shahd Mahmoud","Sondos Ahmed"]},"Ĉoefficients":{"emails":["hamza.1025074@stemoctober.moe.edu.eg","abdelrahman.1025019@stemoctober.moe.edu.eg","mhamedabubakerawed82@gmail.com"],"members":["Hamza hesham","Abdelrahman ahmed","Mohamed Adham"]},
        "Cosmic trio":{"emails":["nourahmed2352009@gmail.com","he30403@gmail.com","saraaya7000000@gmail.com"],"members":["Nour Ahmed","حبيبة عماد","سارة رشاد"]},
        "Egyphiscs":{"emails":["ahmed.1825011@stemksheikh.moe.edu.eg","adham.1825013@stemksheikh.moe.edu.eg"],"members":["Ahmed mohamed","Adham mohamed"]},
        "Electro Pharaohs":{"emails":["radwadode231@gmail.com","mohammedsameh.m1.999@gmail.com","ahmed.m.aly110@gmail.com"],"members":["Radwa Mohamed","Mohammed sameh","Yasmin ahmed"]},
        "Faster Than Light (FTL)":{"emails":["adhamfaied14@gmail.com","mohammedmostafa122008@gmail.com","mazoonelwakeel@gmail.com"],"members":["Adham Mohamed","Mohamed Mostafa","Mazen Hesham"]},"Infinity Force":{"emails":["hamzabakr70188@gmail.com","amrkamaltaher2010@gmail.com","mostlyosman103@gmail.com"],"members":["Hamza Bakr","Amr Kamal","Mostafa Ahmed"]},
        "Lords of cinder":{"emails":["kerlos.1624025@stemredsea.moe.edu.eg","youssef.16240458@stemredsea.moe.edu.eg","abdelrahman.1624003@stemredsea.moe.edu.eg"],"members":["Kerlos joseph","Youssef Gerges","Abdelrahman hatem"]},
        "Modern Pharaohs":{"emails":["nsalama838@gmail.com","basmala010ahmed@gmail.com","reemhythem@gmail.com"],"members":["Nour Elsaid","Basmala Ahmed","Reem Hythem"]},
        "MID equilibrium":{"emails":["nabildavid017@gmail.com","himamohammedelmongy@gmail.com","mostafa1722009a@gmail.com"],"members":["David Nabil","Ibrahim Mohamed","Mostafa Ashraf"]},
        "SuperNova":{"emails":["janamakhaloufelagrody@gmail.com","fatmawaleed644@gamil.com","hafsaahmedokasha@gmail.com"],"members":["Jana makhalouf","fatma waleed","Hafsa ahmed"]},
        "Physics Team":{"emails":["soliman.talaat.24057@gmail.com","hager.mohamed.24144@gmail.com","elozairy.2002@gmail.com"],"members":["Soliman Talaat","Hager Mohamed","Ebrahim Elozairy"]},
        "Nuclear Legends ☢️":{"emails":["f2550881@gmail.com","mahmoudaklql@gmail.com","eng.hossamashraf.abuzahra@gmail.com"],"members":["Fares Mohammed","Mahmoud Ahmed","Hossam Ashraf"]},
        "Organic Physics":{"emails":["meromaro2010hamodi@gmail.com","marwansakr232@gmail.com","mohamedkhaled25693@gmail.com"],"members":["Omar Ibrahim","Marawan Mahmoud","Mohamed Khaled"]},
        "Pharaoh’s Force":{"emails":["yasmin3zvb@gmail.com","emaryradwa@gmail.com","janaramy932009@gmail.com"],"members":["Yasmin Azab","Radwa Samy","Jana Ramy"]},
        "Physics 3":{"emails":["amirayasserh865@gmail.com","r78512736@gmail.com","sara.shawky.24053@gmail.com"],"members":["Amira yasser","Rahma Mohammed","Sara Shawky"]},
        "Physics Divas":{"emails":["mayada.3125505@stembehera.moe.edu.eg","jana.3125510@stembehera.moe.edu.eg","malak.3125526@stembehera.moe.edu.eg"],"members":["Mayada Ibrahim","Jana Sherif","Malak Sameh"]},
        "physics masters":{"emails":["yusuf2711aa@gmail.com","abdelmalik.2925041@stemoctober2.moe.edu.eg","seifeldinnmohamed12@gmail.com"],"members":["Abdelmalik Ashraf","Abdelmalik Ashraf","Seifeldinn Mohammed"]},
        "Physics Minds":{"emails":["odays4621@gmail.com","elabasym700@gmail.com","hayahahmed933@gmail.com"],"members":["Adi Salah","Radwa Mohamed","Hayat Ahmed"]},
        "Pizza Chicken Ranch":{"emails":["saifehab145@gmail.com","moscor195@gmail.com","yousefalqalla3@gmail.com"],"members":["سيف إيهاب","مهند محمد","يوسف محمد"]},
        "Pyramox":{"emails":["mariam.3025536@stemnewcairo.moe.edu.eg","hana.3025513@stemnewcairo.moe.edu.eg","fatma.3025509@stemnewcairo.moe.edu.eg"],"members":["Mariam Mohammed","Hana Ahmed","Fatma Ayman"]},
        "Quantum Queens":{"emails":["salmahadhouda@gmail.com","asmaalatefsharaf2010@gmail.com","hanaezzat105@gmail.com"],"members":["Salma Mohamed","Asmaa Abdelatif","Hana Ezzat"]},
        "Ryo":{"emails":["mralbakk@gmail.com","youssefabdelhaby@gmail.com","ramyramadan0120@gmail.com"],"members":["Omar Hesham","Youssef Ahmed","Ramy Ramadan"]},"Shabab El-Fakha":{"emails":["m.kamel2009.metwally@gmail.com","shanshorymarhoom@gmail.com","saeednafea0@gmail.com"],"members":["Mostafa Mohamed","Mohamed Mohamed","Saeed Ahmed"]},
        "Synapse X":{"emails":["noor.1824553@stemksheikh.moe.edu.eg","abdullah.3025005@stemnewcairo.moe.edu.eg","yahiamustafa277@outlook.com"],"members":["Noor Mustafa","Abdullah Amr","Malak Mohamed"]},
        "The Singularity":{"emails":["elsayedwaleed567@gmail.com","mostafa.3024045@stemnewcairo.moe.edu.eg","afhamwtalam@gmail.com"],"members":["Elsayed Waleed","Mostafa Mahmoud","Youseff samir"]},
        "The Team Who":{"emails":["abdulrahmaneltahhan28@gmail.com","ahmedtamer.6223@gmail.com","mohamedalsebaey25@gmail.com"],"members":["Abdelrhman Ahmed","Ahmed Tamer","Mohamed Elsebaey"]},
        "The Vectors":{"emails":["saraahmedsalah6653@gmail.com","jragab717@gmail.com","malokamagdy657@gmail.com"],"members":["Sara Ahmed","Jana Ragab","Malak magdy"]},
        "Three idiots":{"emails":["stemfayoum1234@gmail.com","ahmedsabra612@gmail.com","fr6261348@gmail.com"],"members":["Ahmed Ramadan","Ahmed Hassan","Fares Mohamed"]},
        "Vortex":{"emails":["moaazswork@gmail.com","adhamosama685@gmail.com","omaryoussefmohamed6090@gmail.com"],"members":["Moaaz Mohamed","Adham Osama","Omar Youssef"]},
        "Watt Za Team":{"emails":["basmala2husien@gmail.com","ezzomar123ahmed@gmail.com","s-doha.mostafa@zewailcity.edu.eg"],"members":["Basmala Hussien","Omar Ahmed","Doha Mohamed"]}
      }
    },
    sf: { teams: {} },
    fr: { teams: {} }
  };

  function initCertSystem() {
    populateTeamDropdowns();
  }

  function populateTeamDropdowns() {
    ['qf', 'sf', 'fr'].forEach(stage => {
      const select = document.getElementById(`teamSelect${stage.toUpperCase()}`);
      if (!select) return;
      select.innerHTML = '<option value="">— اختر الفريق —</option>';
      const stageData = CERT_DATA[stage];
      if (stageData && stageData.teams) {
        Object.keys(stageData.teams).sort().forEach(team => {
          const opt = document.createElement('option');
          opt.value = team;
          opt.textContent = team;
          select.appendChild(opt);
        });
      }
    });
  }

  function switchCertTab(stage) {
    ['qf', 'sf', 'fr'].forEach(s => {
      const btn = document.getElementById(`tab${s.toUpperCase()}`);
      const panel = document.getElementById(`panel${s.toUpperCase()}`);
      if (btn) btn.classList.remove('active');
      if (panel) panel.style.display = 'none';
    });

    const activeBtn = document.getElementById(`tab${stage.toUpperCase()}`);
    const activePanel = document.getElementById(`panel${stage.toUpperCase()}`);
    if (activeBtn) activeBtn.classList.add('active');
    if (activePanel) activePanel.style.display = 'block';
  }

  function handleCertSearch(stage) {
    const stageUpper = stage.toUpperCase();
    const team = document.getElementById(`teamSelect${stageUpper}`).value;
    const email = document.getElementById(`emailInput${stageUpper}`).value.trim().toLowerCase();
    const msgBox = document.getElementById(`msgBox${stageUpper}`);
    const resultBox = document.getElementById(`resultBox${stageUpper}`);

    msgBox.className = 'cert-msg';
    msgBox.style.display = 'none';
    resultBox.classList.remove('show');

    if (!team) {
      showCertMessage(msgBox, 'يرجى اختيار اسم الفريق.', true);
      return;
    }
    if (!email) {
      showCertMessage(msgBox, 'يرجى إدخال البريد الإلكتروني.', true);
      return;
    }

    const teamInfo = CERT_DATA[stage].teams[team];
    if (!teamInfo || !teamInfo.emails.map(e => e.toLowerCase()).includes(email)) {
      showCertMessage(msgBox, 'البريد الإلكتروني غير مطابق لأعضاء هذا الفريق.', true);
      return;
    }

    renderCertificate(stage, team, teamInfo.members);
    resultBox.classList.add('show');
  }

  function showCertMessage(box, text, isError) {
    box.textContent = text;
    box.className = `cert-msg show ${isError ? 'err' : ''}`;
  }

  function renderCertificate(stage, teamName, members) {
    const canvas = document.getElementById(`certCanvas${stage.toUpperCase()}`);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Background Fill
    ctx.fillStyle = '#16140f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative Gold Border
    ctx.strokeStyle = '#c8a24a';
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Header Text
    ctx.fillStyle = '#e7c675';
    ctx.font = 'bold 36px Cairo, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText("PHARAOHS' FRAGMENTS COMPETITION", canvas.width / 2, 120);

    ctx.fillStyle = '#ece6d6';
    ctx.font = '24px Cairo, sans-serif';
    ctx.fillText('شهادة تأهل رسمية', canvas.width / 2, 180);

    // Team Name
    ctx.fillStyle = '#e7c675';
    ctx.font = 'bold 32px Cairo, sans-serif';
    ctx.fillText(`فريق: ${teamName}`, canvas.width / 2, 270);

    // Members List
    ctx.fillStyle = '#a49d86';
    ctx.font = '20px Cairo, sans-serif';
    ctx.fillText('أعضاء الفريق:', canvas.width / 2, 340);

    ctx.fillStyle = '#ece6d6';
    ctx.font = '22px Cairo, sans-serif';
    let startY = 395;
    members.forEach(member => {
      ctx.fillText(member, canvas.width / 2, startY);
      startY += 42;
    });

    // Verification Footer
    ctx.fillStyle = '#a49d86';
    ctx.font = '14px Cairo, sans-serif';
    ctx.fillText('تم التوثيق إلكترونياً عبر المنصة الرسمية لـ Pharaohs\' Fragments', canvas.width / 2, canvas.height - 60);
  }

  function downloadCert(stage) {
    const canvas = document.getElementById(`certCanvas${stage.toUpperCase()}`);
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `Pharaohs_Fragments_Certificate_${stage.toUpperCase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  document.addEventListener('DOMContentLoaded', initCertSystem);
</script>
