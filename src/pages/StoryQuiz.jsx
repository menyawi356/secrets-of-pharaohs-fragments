import { useState } from 'react';
import storyData from '../data/storyData.json';
import { useLang, t } from '../context/LanguageContext';

function getHint(answer, lang) {
  // Extract unit from answer (e.g., "30 metres" -> "metres")
  const parts = answer.split(' ');
  if (parts.length > 1) {
    return lang === 'ar' ? `الوحدة هي ${parts.slice(1).join(' ')}` : `The unit is ${parts.slice(1).join(' ')}`;
  }
  return lang === 'ar' ? `تبدأ الإجابة بـ '${answer.charAt(0)}'` : `The answer starts with '${answer.charAt(0)}'`;
}

export default function StoryQuiz({ onScoreChange }) {
  const { lang } = useLang();

  // State for tracking user answers: { [id]: { answer: string, status: 'correct' | 'wrong', attempts: number } }
  const [answers, setAnswers] = useState({});

  const handleAnswerSubmit = (e, id, correctAnswer) => {
    e.preventDefault();
    const form = e.target;

    const normalize = (str) => str.replace(/[−–]/g, '-').trim().toLowerCase();
    const userAnswer = normalize(form.answer.value);
    const correctLower = normalize(correctAnswer);

    const prevAttempts = answers[id]?.attempts || 0;

    // Extract the numerical part (handling negative numbers and decimals)
    const correctNumMatch = correctLower.match(/^([+-]?\d*\.?\d+)/);
    const correctNum = correctNumMatch ? correctNumMatch[1] : null;

    // Match exact string or just the extracted number (without unit)
    const isCorrect = userAnswer === correctLower || (correctNum !== null && userAnswer === correctNum);

    if (isCorrect) {
      if (!answers[id] || answers[id].status !== 'correct') {
          onScoreChange(prev => prev + 10);
      }
      setAnswers(prev => ({ ...prev, [id]: { answer: form.answer.value.trim(), status: 'correct', attempts: prevAttempts + 1 } }));
    } else {
      setAnswers(prev => ({ ...prev, [id]: { answer: form.answer.value.trim(), status: 'wrong', attempts: prevAttempts + 1 } }));
      form.answer.value = ''; // clear input for next try
    }
  };

  return (
    <div className="story-quiz-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--gold)', fontFamily: "'Cinzel', serif", fontSize: '2rem', marginBottom: '1rem', textShadow: '0 0 10px rgba(255,215,0,0.3)' }}>
                {t('The Hidden Laws of Amun', 'القوانين الخفية لآمون', lang)}
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>
                {t('Follow the story of the four friends and solve the physics mysteries along the way.', 'اتبع قصة الأصدقاء الأربعة وحل ألغاز الفيزياء في طريقك.', lang)}
            </p>
        </div>

        {storyData.map((item, index) => {
            if (item.type === 'story') {
                return (
                    <div key={`story-${index}`} className="story-paragraph" style={{ 
                        marginBottom: '1.5rem', 
                        color: 'var(--text)', 
                        lineHeight: 1.8, 
                        fontSize: '1.15rem', 
                        whiteSpace: 'pre-line',
                        background: 'rgba(255,255,255,0.03)',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                    }}>
                        {item.text}
                    </div>
                );
            } else if (item.type === 'question') {
                const ansData = answers[item.id];
                const attempts = ansData?.attempts || 0;

                // Build display answer: "30 metres"
                const displayAnswer = item.answer;

                return (
                    <div key={`question-${item.id}`} className="question-card" style={{ 
                        margin: '2rem 0', 
                        padding: '2rem', 
                        background: 'rgba(0,0,0,0.6)', 
                        borderRadius: '12px', 
                        borderLeft: '5px solid #2ecc71', 
                        boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
                        position: 'relative'
                    }}>
                        <div style={{ position: 'absolute', top: '-15px', left: '20px', background: '#2ecc71', color: '#000', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem', boxShadow: '0 2px 8px rgba(46, 204, 113, 0.4)' }}>
                            {t('Question', 'سؤال', lang)} {item.id}
                        </div>

                        <p style={{ color: 'var(--gold)', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '1.2rem', marginTop: '0.5rem', fontWeight: '500' }}>
                            {item.text}
                        </p>

                        <form onSubmit={(e) => handleAnswerSubmit(e, item.id, item.answer)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <input 
                                    name="answer"
                                    type="text" 
                                    disabled={ansData?.status === 'correct'}
                                    defaultValue={ansData?.answer || ''}
                                    style={{ 
                                        flex: '1 1 200px', 
                                        padding: '1rem', 
                                        borderRadius: '6px', 
                                        border: '1px solid rgba(46, 204, 113, 0.4)', 
                                        background: 'rgba(0,0,0,0.8)', 
                                        color: 'var(--text)', 
                                        fontSize: '1.05rem',
                                        outline: 'none',
                                        transition: 'border-color 0.3s ease'
                                    }}
                                    placeholder={t("Enter the number (e.g. '30')...", "أدخل الرقم (مثال: '30')...", lang)}
                                    required
                                    onFocus={(e) => e.target.style.borderColor = '#2ecc71'}
                                    onBlur={(e) => e.target.style.borderColor = 'rgba(46, 204, 113, 0.4)'}
                                />
                                <button type="submit" disabled={ansData?.status === 'correct'} style={{ 
                                    padding: '1rem 2rem', 
                                    background: ansData?.status === 'correct' ? '#27ae60' : '#2ecc71', 
                                    color: '#000', 
                                    fontWeight: 'bold', 
                                    fontSize: '1.05rem',
                                    border: 'none', 
                                    borderRadius: '6px', 
                                    cursor: ansData?.status === 'correct' ? 'default' : 'pointer',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                    boxShadow: ansData?.status === 'correct' ? 'none' : '0 4px 12px rgba(46, 204, 113, 0.3)'
                                }}
                                onMouseOver={(e) => { if (ansData?.status !== 'correct') e.target.style.transform = 'translateY(-2px)' }}
                                onMouseOut={(e) => { if (ansData?.status !== 'correct') e.target.style.transform = 'translateY(0)' }}
                                >
                                    {ansData?.status === 'correct' ? t('Solved', 'تم الحل', lang) : t('Submit', 'إرسال', lang)}
                                </button>
                            </div>

                            {ansData?.status === 'correct' && (
                                <div style={{ color: '#2ecc71', fontWeight: 'bold', marginTop: '0.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '1.4rem' }}>✓</span> {t('Correct! (+10 points)', 'إجابة صحيحة! (+10 نقاط)', lang)}
                                </div>
                            )}

                            {ansData?.status === 'wrong' && (
                                <div style={{ 
                                    color: '#e74c3c', 
                                    marginTop: '0.8rem', 
                                    background: 'rgba(231, 76, 60, 0.1)', 
                                    padding: '1rem', 
                                    borderRadius: '6px', 
                                    border: '1px solid rgba(231, 76, 60, 0.3)',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '10px'
                                }}>
                                    <span style={{ fontSize: '1.4rem', lineHeight: '1' }}>✗</span>
                                    <div>
                                        {attempts === 1 && (
                                            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                                {t('Wrong!', 'إجابة خاطئة!', lang)}
                                            </div>
                                        )}
                                        {attempts === 2 && (
                                            <>
                                                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                                    {t('Wrong!', 'إجابة خاطئة!', lang)}
                                                </div>
                                                <div>
                                                    <span style={{ color: '#f39c12' }}>{t('Hint:', 'تلميح:', lang)} {getHint(item.answer, lang)}</span>
                                                </div>
                                            </>
                                        )}
                                        {attempts >= 3 && (
                                            <>
                                                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                                    {t('Wrong!', 'إجابة خاطئة!', lang)}
                                                </div>
                                                <div>
                                                    {t('The right answer is:', 'الإجابة الصحيحة هي:', lang)} <span style={{ color: '#fff', fontWeight: 'bold', letterSpacing: '1px' }}>{displayAnswer}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                );
            }
            return null;
        })}
    </div>
  );
}
