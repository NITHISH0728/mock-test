const parseTextToQuestions = (text) => {
    // Basic regex-based parser
    const questionBlocks = text.split(/(?=\n*\d+\.\s+)/).filter(b => b.trim() !== '');
    const newQuestions = [];

    questionBlocks.forEach(block => {
        let question_text = '';
        let option_a = '';
        let option_b = '';
        let option_c = '';
        let option_d = '';
        let correct_option = 'A';

        const lines = block.split('\n').map(l => l.trim()).filter(l => l);
        
        lines.forEach(line => {
             if (/^\d+\.\s*(.+)/.test(line) && !question_text) {
                 question_text = line.replace(/^\d+\.\s*/, '').trim();
             } else if (/^[A][)\.]\s*(.+)/i.test(line)) {
                 option_a = line.replace(/^[A][)\.]\s*/i, '').trim();
             } else if (/^[B][)\.]\s*(.+)/i.test(line)) {
                 option_b = line.replace(/^[B][)\.]\s*/i, '').trim();
             } else if (/^[C][)\.]\s*(.+)/i.test(line)) {
                 option_c = line.replace(/^[C][)\.]\s*/i, '').trim();
             } else if (/^[D][)\.]\s*(.+)/i.test(line)) {
                 option_d = line.replace(/^[D][)\.]\s*/i, '').trim();
             } else if (/^Ans(wer)?:\s*([A-D])/i.test(line)) {
                 const match = line.match(/^Ans(wer)?:\s*([A-D])/i);
                 if (match) correct_option = match[2].toUpperCase();
             } else if (question_text && !option_a && !/^[ABCD][)\.]\s*/i.test(line) && !/^Ans(wer)?/i.test(line)) {
                 question_text += " " + line;
             }
        });

        if (question_text && option_a && option_b && option_c && option_d) {
            newQuestions.push({
                question_text,
                option_a,
                option_b,
                option_c,
                option_d,
                correct_option,
                marks: 1
            });
        }
    });

    return newQuestions;
};

const sampleText = `
1. What is the capital of France?
A) Berlin
B) Madrid
C) Paris
D) Rome
Answer: C

2. What is 2 + 2?
A) 3
B) 4
C) 5
D) 6
Ans: B
`;

console.log(parseTextToQuestions(sampleText));
