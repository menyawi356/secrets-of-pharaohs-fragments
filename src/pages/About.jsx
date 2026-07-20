import { useLang } from '../context/LanguageContext.jsx';

function T({ en, ar }) {
  const { lang } = useLang();
  return lang === 'ar' ? ar : en;
}

export default function About() {
  return (
    <>
      <div className="glass-card">
        <h2 className="card-title">
          <T en="About Pharaohs' Fragments" ar="عن شظايا الفراعنة" />
        </h2>
        <div className="card-content">
          <p>
            <T
              en="Pharaohs' Fragments is an innovative international science League created and organized by students in Egypt. Open to middle school students, high school students, and bachelor's degree students from around the world, our mission is to make STEM education engaging and accessible by combining physics with the rich narrative of ancient Egyptian adventure."
              ar="شظايا الفراعنة هو دوري علوم دولي مبتكر أنشأه ونظمه طلاب في مصر. يستهدف الدوري طلاب المرحلة الإعدادية والثانوية وطلاب البكالوريوس من جميع أنحاء العالم، وتتمحور رسالتنا حول جعل تعليم العلوم والتكنولوجيا والهندسة والرياضيات تجربةً شيّقة ومتاحة للجميع، وذلك بدمج الفيزياء مع إرث مصر الحضاري العريق في قالب مغامرة درامية آسرة."
            />
          </p>
          <p>
            <T
              en="Participants form teams of up to three and work together to solve story-driven physics challenges, all integrated into an immersive Egyptian mythology narrative. As teams progress through four rounds of the League, they collect six ancient fragments: powerful artifacts said to hold the key to understanding the universe's fundamental forces."
              ar="يُكوّن المشاركون فرقاً من ثلاثة أعضاء أو أقل، ويتعاونون معاً لحل تحديات الفيزياء ذات الطابع القصصي المدمجة في سردية غامرة من الأساطير المصرية القديمة. وكلما تقدمت الفرق في الجولات الأربع للدوري، جمعوا ستة شظايا أثرية قديمة يُقال إنها تحمل مفتاح فهم القوى الأساسية للكون."
            />
          </p>
          <p>
            <T
              en="This competition is designed to challenge students across all levels in physics, while fostering teamwork, problem-solving, and cultural appreciation. International students from every country are warmly welcome. By blending education with an epic adventure, we aim to inspire the next generation of scientists, engineers, and thinkers."
              ar="صُمِّمت هذه المسابقة لتحدي الطلاب في جميع مستوياتهم في الفيزياء، مع تعزيز روح العمل الجماعي وتنمية مهارات حل المشكلات والتقدير الثقافي. نرحب بحرارة بالطلاب الدوليين من كل بلدان العالم. ومن خلال الجمع بين التعليم والمغامرة الملحمية، نسعى إلى إلهام الجيل القادم من العلماء والمهندسين والمفكرين."
            />
          </p>
        </div>
      </div>

      <div className="glass-card">
        <h2 className="card-title">
          <T en="Competition Format" ar="شكل المسابقة" />
        </h2>
        <div className="card-content">
          <p>
            <T
              en="The competition is structured across four exciting rounds, each advancing teams deeper into the Egyptian adventure:"
              ar="تتكون المسابقة من أربع جولات مثيرة، تأخذ الفرق في رحلة أعمق إلى المغامرة المصرية في كل مرحلة:"
            />
          </p>
          <ul>
            {[
              {
                en: <><strong>Round 1 – First Round (June 20):</strong> The opening qualification round. All registered teams compete in science challenges spanning all areas of physics to earn their place in the next stage.</>,
                ar: <><strong>الجولة الأولى (20 يونيو):</strong> جولة التصفية الافتتاحية المفتوحة لجميع الفرق المسجلة، تتنافس فيها الفرق في تحديات علمية تغطي جميع مجالات الفيزياء لضمان مكانها في المرحلة التالية.</>,
              },
              {
                en: <><strong>Round 2 – Second Round (June 22):</strong> The field narrows. Qualifying teams face more demanding physics challenges, testing deeper understanding and team coordination.</>,
                ar: <><strong>الجولة الثانية (22 يونيو):</strong> تضيق دائرة المتنافسين. تواجه الفرق المتأهلة تحديات فيزيائية أكثر تعمقاً وصعوبة، تختبر مستوى الفهم المفاهيمي والتنسيق بين أعضاء الفريق.</>,
              },
              {
                en: <><strong>Round 3 – Semi-Final (June 24):</strong> Only the strongest teams remain. High-intensity physics problems push participants to their full potential.</>,
                ar: <><strong>الجولة الثالثة: نصف النهائي (24 يونيو):</strong> لا تبقى إلا الفرق الأقوى. مسائل فيزيائية عالية الكثافة تدفع المشاركين إلى بلوغ أقصى طاقاتهم وإمكاناتهم.</>,
              },
              {
                en: <><strong>Round 4 – Final Round (June 27):</strong> The ultimate showdown. The top three finalist teams battle for glory and incredible prizes in the grand finale.</>,
                ar: <><strong>الجولة الرابعة: النهائي الكبير (27 يونيو):</strong> المواجهة الكبرى الحاسمة. تتنافس أفضل ثلاث فرق على اللقب والجوائز الاستثنائية في حفل الختام الكبير.</>,
              },
            ].map((item, i) => (
              <li key={i}>
                <T en={item.en} ar={item.ar} />
              </li>
            ))}
          </ul>
          <p>
            <T
              en="All rounds are held online, making the competition fully accessible to international students regardless of location."
              ar="تُعقد جميع الجولات عبر الإنترنت، مما يجعل المسابقة متاحة بالكامل للطلاب الدوليين بغض النظر عن موقعهم."
            />
          </p>
        </div>
      </div>

      <div className="glass-card">
        <h2 className="card-title">
          <T en="International Eligibility" ar="الأهلية الدولية" />
        </h2>
        <div className="card-content">
          <p>
            <T
              en="Pharaohs' Fragments League is fully open to international students. We proudly welcome participants from every country across the globe."
              ar="دوري شظايا الفراعنة مفتوح بالكامل للطلاب الدوليين. نرحب بفخر بالمشاركين من كل دولة حول العالم."
            />
          </p>
          <p><strong><T en="Who can participate:" ar="من يمكنه المشاركة:" /></strong></p>
          <ul>
            {[
              { en: <><strong>Middle School Students:</strong> Grade 6 to Grade 9 (or equivalent)</>, ar: <><strong>طلاب المرحلة الإعدادية:</strong> الصف 6 إلى 9 (أو ما يعادله)</> },
              { en: <><strong>High School Students:</strong> Grade 10 to Grade 12 (or equivalent)</>, ar: <><strong>طلاب المرحلة الثانوية:</strong> الصف 10 إلى 12 (أو ما يعادله)</> },
              { en: <><strong>Bachelor's Students:</strong> Undergraduate university students in any field</>, ar: <><strong>طلاب البكالوريوس:</strong> طلاب الجامعة في أي مجال</> },
            ].map((item, i) => (
              <li key={i}><T en={item.en} ar={item.ar} /></li>
            ))}
          </ul>
          <p>
            <T
              en="All rounds are held entirely online — no travel required. Students from any country may register individually or as a team of up to three participants."
              ar="تُعقد جميع الجولات عبر الإنترنت بالكامل — لا يلزم السفر. يمكن للطلاب من أي دولة التسجيل بشكل فردي أو كفريق من ثلاثة مشاركين."
            />
          </p>
        </div>
      </div>

      <div className="glass-card">
        <h2 className="card-title">
          <T en="About Us" ar="عن المنظمين" />
        </h2>
        <div className="card-content">
          <p>
            <T
              en="We are a group of passionate students from Egypt who share a love for science and our country's rich history, working under the supervision of Dr. Mohamed Ali. Our team came together with the vision of creating a unique educational experience that would inspire students worldwide to explore the wonders of physics."
              ar="نحن مجموعة من الطلاب المتحمسين في مصر، نعمل تحت إشراف الدكتور محمد علي، وتجمعنا شغف مشترك بالعلوم وحب عميق لتاريخ وطننا الغني. التقى فريقنا بدافع الرغبة في خلق تجربة تعليمية استثنائية تُلهم الطلاب في أرجاء العالم كافة لاستكشاف عجائب الفيزياء."
            />
          </p>
          <p>
            <T
              en="Our organizing committee includes students specializing in physics, computer science, and history, allowing us to create a truly interdisciplinary competition that bridges ancient wisdom with modern scientific knowledge."
              ar="تضم لجنتنا التنظيمية طلاباً متخصصين في الفيزياء وعلوم الحاسب والتاريخ، مما يُمكّننا من تصميم مسابقة متعددة التخصصات بامتياز، تجسر الهوة بين الحكمة القديمة والمعرفة العلمية الحديثة."
            />
          </p>
        </div>
      </div>
    </>
  );
}
