MEDICINALIQ XIMIYA QUIZ - classroom version (Kahoot style)

WHAT YOU NEED
  Node.js (free, https://nodejs.org). No other installs.

HOW TO RUN IN CLASS
  1. Put the two files (server.js, index.html) in one folder.
  2. Open a terminal in that folder and run:   node server.js
  3. It prints two addresses:
       Teacher (board):  http://localhost:3000
       Students:         http://192.168.x.x:3000   (your computer's Wi-Fi address)
  4. Connect the computer to the projector and open the teacher address.
     Click "Oqitiwshi - taxta". A PIN is shown on the board.
  5. Students connect their phones to the SAME Wi-Fi, open the student address,
     click "Oyinshi - telefon", type the PIN and their name.
  6. Press "Oyindi baslaw". Questions appear on the board, answers are tapped on phones.
  7. At the end the board shows the podium and the full results table.

EDIT THE QUESTIONS
  Open index.html in a text editor, find "const Q = [" and change the text.
  Each question: {q:'question', a:['option1','option2',...], c:index_of_correct_answer}
  c starts from 0. Questions with 2 options use a:TF and c:0 (Durıs) or c:1 (Qáte).
  Time per question: TL4 (4 options) and TL2 (2 options) at the top of the script.

NOTES
  - All phones and the computer must be on the same network (guest/"client isolation" Wi-Fi can block it;
    a phone hotspot from the teacher works well).
  - Scoring: up to 1000 points per correct answer (faster = more), plus a streak bonus.
