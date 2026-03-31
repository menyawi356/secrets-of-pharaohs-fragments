import { useState } from 'react';
import { useLang } from '../context/LanguageContext.jsx';

function T({ en, ar }) {
  const { lang } = useLang();
  return lang === 'ar' ? ar : en;
}

const FAQS = [
  {
    en_q: 'Who can participate in the competition?',
    ar_q: 'من يمكنه المشاركة في المسابقة؟',
    en_a: "The competition is open to middle school students, high school students, and bachelor's degree students from anywhere in the world. International students from every country are eligible. Participants must form teams of 1–3 students.",
    ar_a: 'المسابقة مفتوحة لطلاب المرحلة الإعدادية والثانوية وطلاب البكالوريوس من أي مكان في العالم. جميع الطلاب الدوليون من كافة الدول مؤهلون للمشاركة. يجب على المشاركين تشكيل فرق تتراوح بين 1 و3 طلاب.',
  },
  {
    en_q: 'Is there a registration fee?',
    ar_q: 'هل هناك رسوم تسجيل؟',
    en_a: 'No, the competition is completely free to ensure equal opportunity for all students regardless of their financial background.',
    ar_a: 'لا، المسابقة مجانية تمامًا لضمان تكافؤ الفرص لجميع الطلاب بصرف النظر عن خلفياتهم المادية.',
  },
  {
    en_q: 'What science background do I need?',
    ar_q: 'ما هي الخلفية العلمية التي أحتاجها؟',
    en_a: 'The competition covers physics exclusively: mechanics, waves, thermodynamics, electricity, magnetism, optics, and modern physics. The difficulty scales across four rounds — from F=ma-level substitution all the way up to calculus-based and olympiad-level problems.',
    ar_a: 'تغطي المسابقة الفيزياء حصريًا، وتشمل: الميكانيكا والموجات والديناميكا الحرارية والكهرباء والمغناطيسية والبصريات والفيزياء الحديثة. تتصاعد درجة الصعوبة تدريجيًا عبر الجولات الأربع، بدءًا من مستوى التعويض في القوانين (F=ma) وصولاً إلى مسائل تعتمد على حساب التفاضل والتكامل ومستوى الأولمبياد.',
  },
  {
    en_q: 'How are the competition questions structured?',
    ar_q: 'كيف يتم تنظيم أسئلة المسابقة؟',
    en_a: 'The competition features story-driven physics challenges integrated into an immersive Egyptian adventure narrative. The competition runs across four rounds: First Round (June 20), Second Round (June 22), Semi-Final (June 24), and Final Round (June 27).',
    ar_a: 'تتميز المسابقة بتحديات فيزيائية قصصية مُدمجة في سردية مغامرة مصرية غامرة. تتكون المسابقة من أربع جولات: الجولة الأولى (20 يونيو)، الجولة الثانية (22 يونيو)، نصف النهائي (24 يونيو)، والنهائي الكبير (27 يونيو).',
  },
  {
    en_q: 'What technology do I need to participate?',
    ar_q: 'ما هي التكنولوجيا التي أحتاجها للمشاركة؟',
    en_a: "You'll need a computer with internet access to participate in the virtual competition. Specific technical requirements will be provided to registered teams.",
    ar_a: 'ستحتاج إلى جهاز حاسب متصل بالإنترنت للمشاركة في المسابقة الافتراضية. سيتم إبلاغ الفرق المسجلة بالمتطلبات التقنية التفصيلية في الوقت المناسب.',
  },
  {
    en_q: 'How are winners determined?',
    ar_q: 'كيف يتم تحديد الفائزين؟',
    en_a: 'Winners are determined based on performance across all four rounds, with points awarded for correct physics solutions. The top three teams in the Final Round are crowned champions.',
    ar_a: 'يُحدَّد الفائزون بناءً على أدائهم عبر الجولات الأربع، حيث تُمنح النقاط مقابل الحلول الفيزيائية الصحيحة. تُتوَّج أفضل ثلاث فرق في الجولة النهائية بلقب الأبطال.',
  },
  {
    en_q: 'Can I register as an individual (not a team)?',
    ar_q: 'هل يمكنني التسجيل بشكل فردي (وليس كفريق)؟',
    en_a: 'Yes! Teams can consist of 1 to 3 participants. You are welcome to register as a solo competitor.',
    ar_a: 'نعم! يمكن أن تتكون الفرق من مشارك واحد وحتى ثلاثة مشاركين. يمكنك التسجيل كمتسابق فردي بكل ترحيب.',
  },
  {
    en_q: 'Are all rounds held online?',
    ar_q: 'هل تُعقد جميع الجولات عبر الإنترنت؟',
    en_a: 'Yes, all rounds are held entirely online. No travel is required. Students from any country can participate from anywhere in the world.',
    ar_a: 'نعم، تُعقد جميع الجولات عبر الإنترنت بالكامل، ولا يستلزم ذلك أي سفر. يمكن للطلاب من أي دولة المشاركة من أي مكان في العالم.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);
  const { lang } = useLang();

  return (
    <div className="glass-card">
      <h2 className="card-title">
        <T en="Frequently Asked Questions" ar="الأسئلة الشائعة" />
      </h2>
      {FAQS.map((faq, i) => (
        <div
          className={`faq-item${open === i ? ' open' : ''}`}
          key={i}
          onClick={() => setOpen(open === i ? null : i)}
        >
          <div className="faq-question">
            <span>{lang === 'ar' ? faq.ar_q : faq.en_q}</span>
            <span className="faq-toggle">▼</span>
          </div>
          <div className="faq-answer">
            <p>{lang === 'ar' ? faq.ar_a : faq.en_a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
