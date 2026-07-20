import React, { useState, useEffect } from 'react';
import './CertificateSection.css'; // Create this CSS file for styles

const CertificateSection = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('qf');
  
  // State for each stage
  const [qfState, setQfState] = useState({ team: '', email: '', message: '', isError: false, showResult: false });
  const [sfState, setSfState] = useState({ team: '', email: '', message: '', isError: false, showResult: false });
  const [frState, setFrState] = useState({ team: '', email: '', message: '', isError: false, showResult: false });
  
  // Certificate data
  const CERT_DATA = {
    qf: {
      teams: {
        "Golden Pharaoh": { emails: ["omar.2225033@stemsharkya.moe.edu.eg", "mohamedhemdanmado@gmail.com", "ahmedelkhalafawy2010@gmail.com"], members: ["omar mostafa", "Mohamed Ahmed", "Ahmed Mohamed"] },
        "Engineers": { emails: ["alisheira18@gmail.com", "nsr85628@gmail.com", "abdo8975432@gmail.com"], members: ["Ali Ezat", "Ahmed Mohamed", "Abdelwahab Ebrahim"] },
        "Baraamo1": { emails: ["baraatv2006@gmail.com"], members: ["Baraa Mohammed"] },
        "Athera": { emails: ["janagamal366@gmail.com", "r78397109@gmail.com", "moaaz.2524052@stemelsadat.moe.edu.eg"], members: ["Jana gamal", "Ratal ahmed", "Moaz ataf"] },
        "Badawey": { emails: ["neigarbadawey@gmail.com"], members: ["Neigar Badawy"] },
        "Brilliant team": { emails: ["wtnd347ff55877366m@gmail.com", "hnynla344@gmail.com", "asmamohamedq55@gmail.com"], members: ["Jannat Mohamed", "Haneen Alaa", "Jana Mohammed"] },
        "Big Bang Bros": { emails: ["gaser.1825017@stemksheikh.moe.edu.eg", "mohamed956888ali@gmail.com", "mohammed.1425039@stemksheikh.moe.edu.eg"], members: ["Gasser Mahmoud", "Mohamed Ali", "Mohamed Ahmed"] },
        "Dark Aura": { emails: ["zeinabshapana@gmail.com", "nooralhodasaad658@gmail.com"], members: ["Remas Yousry", "Nour al"] },
        "Blood code": { emails: ["ahmed.3215001@stembehera.moe.edu.eg", "ahmed.3125018@stembehera.moe.edu.eg", "mazen.3125017@stembehera.moe.edu.eg"], members: ["Ahmed Hamdy", "Ahmed Sabry", "Mazen Sameh"] },
        "Cleoquarks": { emails: ["toqa.1525516@stemluxor.moe.edu.eg", "s06377385@gmail.com", "sndsahmd490@gmail.com"], members: ["Toqa Mohamad", "Shahd Mahmoud", "Sondos Ahmed"] },
        "Ĉoefficients": { emails: ["hamza.1025074@stemoctober.moe.edu.eg", "abdelrahman.1025019@stemoctober.moe.edu.eg", "mhamedabubakerawed82@gmail.com"], members: ["Hamza hesham", "Abdelrahman ahmed", "Mohamed Adham"] },
        "Cosmic trio": { emails: ["nourahmed2352009@gmail.com", "he30403@gmail.com", "saraaya7000000@gmail.com"], members: ["Nour Ahmed", "حبيبة عماد", "سارة رشاد"] },
        "Egyphiscs": { emails: ["ahmed.1825011@stemksheikh.moe.edu.eg", "adham.1825013@stemksheikh.moe.edu.eg"], members: ["Ahmed mohamed", "Adham mohamed"] },
        "Electro Pharaohs": { emails: ["radwadode231@gmail.com", "mohammedsameh.m1.999@gmail.com", "ahmed.m.aly110@gmail.com"], members: ["Radwa Mohamed", "Mohammed sameh", "Yasmin ahmed"] },
        "Faster Than Light (FTL)": { emails: ["adhamfaied14@gmail.com", "mohammedmostafa122008@gmail.com", "mazoonelwakeel@gmail.com"], members: ["Adham Mohamed", "Mohamed Mostafa", "Mazen Hesham"] },
        "Infinity Force": { emails: ["hamzabakr70188@gmail.com", "amrkamaltaher2010@gmail.com", "mostlyosman103@gmail.com"], members: ["Hamza Bakr", "Amr Kamal", "Mostafa Ahmed"] },
        "Lords of cinder": { emails: ["kerlos.1624025@stemredsea.moe.edu.eg", "youssef.16240458@stemredsea.moe.edu.eg", "abdelrahman.1624003@stemredsea.moe.edu.eg"], members: ["Kerlos joseph", "Youssef Gerges", "Abdelrahman hatem"] },
        "Modern Pharaohs": { emails: ["nsalama838@gmail.com", "basmala010ahmed@gmail.com", "reemhythem@gmail.com"], members: ["Nour Elsaid", "Basmala Ahmed", "Reem Hythem"] },
        "MID equilibrium": { emails: ["nabildavid017@gmail.com", "himamohammedelmongy@gmail.com", "mostafa1722009a@gmail.com"], members: ["David Nabil", "Ibrahim Mohamed", "Mostafa Ashraf"] },
        "SuperNova": { emails: ["janamakhaloufelagrody@gmail.com", "fatmawaleed644@gamil.com", "hafsaahmedokasha@gmail.com"], members: ["Jana makhalouf", "fatma waleed", "Hafsa ahmed"] },
        "Physics Team": { emails: ["soliman.talaat.24057@gmail.com", "hager.mohamed.24144@gmail.com", "elozairy.2002@gmail.com"], members: ["Soliman Talaat", "Hager Mohamed", "Ebrahim Elozairy"] },
        "Nuclear Legends ☢️": { emails: ["f2550881@gmail.com", "mahmoudaklql@gmail.com", "eng.hossamashraf.abuzahra@gmail.com"], members: ["Fares Mohammed", "Mahmoud Ahmed", "Hossam Ashraf"] },
        "Organic Physics": { emails: ["meromaro2010hamodi@gmail.com", "marwansakr232@gmail.com", "mohamedkhaled25693@gmail.com"], members: ["Omar Ibrahim", "Marawan Mahmoud", "Mohamed Khaled"] },
        "Pharaoh’s Force": { emails: ["yasmin3zvb@gmail.com", "emaryradwa@gmail.com", "janaramy932009@gmail.com"], members: ["Yasmin Azab", "Radwa Samy", "Jana Ramy"] },
        "Physics 3": { emails: ["amirayasserh865@gmail.com", "r78512736@gmail.com", "sara.shawky.24053@gmail.com"], members: ["Amira yasser", "Rahma Mohammed", "Sara Shawky"] },
        "Physics Divas": { emails: ["mayada.3125505@stembehera.moe.edu.eg", "jana.3125510@stembehera.moe.edu.eg", "malak.3125526@stembehera.moe.edu.eg"], members: ["Mayada Ibrahim", "Jana Sherif", "Malak Sameh"] },
        "physics masters": { emails: ["yusuf2711aa@gmail.com", "abdelmalik.2925041@stemoctober2.moe.edu.eg", "seifeldinnmohamed12@gmail.com"], members: ["Abdelmalik Ashraf", "Abdelmalik Ashraf", "Seifeldinn Mohammed"] },
        "Physics Minds": { emails: ["odays4621@gmail.com", "elabasym700@gmail.com", "hayahahmed933@gmail.com"], members: ["Adi Salah", "Radwa Mohamed", "Hayat Ahmed"] },
        "Pizza Chicken Ranch": { emails: ["saifehab145@gmail.com", "moscor195@gmail.com", "yousefalqalla3@gmail.com"], members: ["سيف إيهاب", "مهند محمد", "يوسف محمد"] },
        "Pyramox": { emails: ["mariam.3025536@stemnewcairo.moe.edu.eg", "hana.3025513@stemnewcairo.moe.edu.eg", "fatma.3025509@stemnewcairo.moe.edu.eg"], members: ["Mariam Mohammed", "Hana Ahmed", "Fatma Ayman"] },
        "Quantum Queens": { emails: ["salmahadhouda@gmail.com", "asmaalatefsharaf2010@gmail.com", "hanaezzat105@gmail.com"], members: ["Salma Mohamed", "Asmaa Abdelatif", "Hana Ezzat"] },
        "Ryo": { emails: ["mralbakk@gmail.com", "youssefabdelhaby@gmail.com", "ramyramadan0120@gmail.com"], members: ["Omar Hesham", "Youssef Ahmed", "Ramy Ramadan"] },
        "Shabab El-Fakha": { emails: ["m.kamel2009.metwally@gmail.com", "shanshorymarhoom@gmail.com", "saeednafea0@gmail.com"], members: ["Mostafa Mohamed", "Mohamed Mohamed", "Saeed Ahmed"] },
        "Synapse X": { emails: ["noor.1824553@stemksheikh.moe.edu.eg", "abdullah.3025005@stemnewcairo.moe.edu.eg", "yahiamustafa277@outlook.com"], members: ["Noor Mustafa", "Abdullah Amr", "Malak Mohamed"] },
        "The Singularity": { emails: ["elsayedwaleed567@gmail.com", "mostafa.3024045@stemnewcairo.moe.edu.eg", "afhamwtalam@gmail.com"], members: ["Elsayed Waleed", "Mostafa Mahmoud", "Youseff samir"] },
        "The Team Who": { emails: ["abdulrahmaneltahhan28@gmail.com", "ahmedtamer.6223@gmail.com", "mohamedalsebaey25@gmail.com"], members: ["Abdelrhman Ahmed", "Ahmed Tamer", "Mohamed Elsebaey"] },
        "The Vectors": { emails: ["saraahmedsalah6653@gmail.com", "jragab717@gmail.com", "malokamagdy657@gmail.com"], members: ["Sara Ahmed", "Jana Ragab", "Malak magdy"] },
        "Three idiots": { emails: ["stemfayoum1234@gmail.com", "ahmedsabra612@gmail.com", "fr6261348@gmail.com"], members: ["Ahmed Ramadan", "Ahmed Hassan", "Fares Mohamed"] },
        "Vortex": { emails: ["moaazswork@gmail.com", "adhamosama685@gmail.com", "omaryoussefmohamed6090@gmail.com"], members: ["Moaaz Mohamed", "Adham Osama", "Omar Youssef"] },
        "Watt Za Team": { emails: ["basmala2husien@gmail.com", "ezzomar123ahmed@gmail.com", "s-doha.mostafa@zewailcity.edu.eg"], members: ["Basmala Hussien", "Omar Ahmed", "Doha Mohamed"] }
      }
    },
    sf: { teams: {} },
    fr: { teams: {} }
  };

  // Get stage state
  const getStageState = (stage) => {
    switch(stage) {
      case 'qf': return qfState;
      case 'sf': return sfState;
      case 'fr': return frState;
      default: return qfState;
    }
  };

  // Set stage state
  const setStageState = (stage, newState) => {
    switch(stage) {
      case 'qf': setQfState(newState); break;
      case 'sf': setSfState(newState); break;
      case 'fr': setFrState(newState); break;
      default: break;
    }
  };

  // Get teams for dropdown
  const getTeams = (stage) => {
    const stageData = CERT_DATA[stage];
    if (stageData && stageData.teams) {
      return Object.keys(stageData.teams).sort();
    }
    return [];
  };

  // Handle tab switch
  const handleTabSwitch = (stage) => {
    setActiveTab(stage);
  };

  // Handle certificate search
  const handleCertSearch = (stage) => {
    const state = getStageState(stage);
    const team = state.team;
    const email = state.email.trim().toLowerCase();
    
    // Reset message and result
    setStageState(stage, { ...state, message: '', isError: false, showResult: false });

    if (!team) {
      setStageState(stage, { ...state, message: 'يرجى اختيار اسم الفريق.', isError: true });
      return;
    }
    if (!email) {
      setStageState(stage, { ...state, message: 'يرجى إدخال البريد الإلكتروني.', isError: true });
      return;
    }

    const teamInfo = CERT_DATA[stage].teams[team];
    if (!teamInfo || !teamInfo.emails.map(e => e.toLowerCase()).includes(email)) {
      setStageState(stage, { ...state, message: 'البريد الإلكتروني غير مطابق لأعضاء هذا الفريق.', isError: true });
      return;
    }

    // Render certificate
    renderCertificate(stage, team, teamInfo.members);
    setStageState(stage, { ...state, showResult: true, message: '', isError: false });
  };

  // Render certificate on canvas
  const renderCertificate = (stage, teamName, members) => {
    const canvasId = `certCanvas${stage.toUpperCase()}`;
    const canvas = document.getElementById(canvasId);
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
  };

  // Download certificate
  const downloadCert = (stage) => {
    const canvasId = `certCanvas${stage.toUpperCase()}`;
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `Pharaohs_Fragments_Certificate_${stage.toUpperCase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Handle input changes
  const handleInputChange = (stage, field, value) => {
    const state = getStageState(stage);
    setStageState(stage, { ...state, [field]: value });
  };

  // Render panel
  const renderPanel = (stage) => {
    const state = getStageState(stage);
    const teams = getTeams(stage);
    const isActive = activeTab === stage;
    const stageLabels = {
      qf: 'ربع النهائي',
      sf: 'نصف النهائي',
      fr: 'النهائي'
    };
    const stageDescriptions = {
      qf: 'اختر اسم فريقك من القائمة، واكتب بريدك الإلكتروني أو بريد أي عضو في الفريق لاستخراج شهادة التأهل لربع النهائي.',
      sf: 'اختر اسم فريقك من القائمة، واكتب بريدك الإلكتروني أو بريد أي عضو في الفريق لاستخراج شهادة التأهل لنصف النهائي.',
      fr: 'اختر اسم فريقك من القائمة، واكتب بريدك الإلكتروني أو بريد أي عضو في الفريق لاستخراج شهادة النهائي.'
    };

    return (
      <div style={{ display: isActive ? 'block' : 'none' }}>
        <p className="cert-lead">{stageDescriptions[stage]}</p>

        <div className="cert-form-group">
          <label className="cert-label" htmlFor={`teamSelect${stage.toUpperCase()}`}>اسم الفريق</label>
          <select 
            id={`teamSelect${stage.toUpperCase()}`} 
            className="cert-select"
            value={state.team}
            onChange={(e) => handleInputChange(stage, 'team', e.target.value)}
          >
            <option value="">— اختر الفريق —</option>
            {teams.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>

        <div className="cert-form-group">
          <label className="cert-label" htmlFor={`emailInput${stage.toUpperCase()}`}>البريد الإلكتروني</label>
          <input 
            type="text" 
            id={`emailInput${stage.toUpperCase()}`} 
            className="cert-input" 
            placeholder="example@email.com" 
            autoComplete="off"
            value={state.email}
            onChange={(e) => handleInputChange(stage, 'email', e.target.value)}
          />
        </div>

        <button className="btn-cert-submit" onClick={() => handleCertSearch(stage)}>
          🔍 استخراج الشهادة
        </button>

        {state.message && (
          <div className={`cert-msg show ${state.isError ? 'err' : ''}`}>
            {state.message}
          </div>
        )}

        {state.showResult && (
          <div className="cert-result-box show">
            <span className="cert-result-badge">🏆 شهادة التأهل {stageLabels[stage]}</span>
            <canvas id={`certCanvas${stage.toUpperCase()}`} className="cert-canvas" width="1001" height="707"></canvas>
            <div className="cert-dl-row">
              <button className="btn-cert-submit" onClick={() => downloadCert(stage)}>
                ⬇ تنزيل الشهادة
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="certificates" dir="rtl">
      <div className="cert-card">
        <div className="cert-brand">
          <div className="badge">Pharaohs'<br />Fragments</div>
          <h2 className="cert-title">احصل على شهادتك — Get Your Certificate</h2>
        </div>

        <div className="cert-tabs">
          <button 
            className={`cert-tab-btn ${activeTab === 'qf' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('qf')}
          >
            ربع النهائي
          </button>
          <button 
            className={`cert-tab-btn ${activeTab === 'sf' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('sf')}
          >
            نصف النهائي
          </button>
          <button 
            className={`cert-tab-btn ${activeTab === 'fr' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('fr')}
          >
            النهائي
          </button>
        </div>

        {/* Panels */}
        {renderPanel('qf')}
        {renderPanel('sf')}
        {renderPanel('fr')}

        <div className="cert-footer-note">معالجة فورية داخل المتصفح — بياناتك آمنة ولا يتم رفعها لأي خادم</div>
      </div>
    </section>
  );
};

export default CertificateSection;
