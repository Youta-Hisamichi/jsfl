const BGM_SONGS = {
  battle14: {
    bpm: 160,
    tracks: [
      { type: 'vrc6pulse25', gain: 0.03, notes: 'E5 = = B4 E5 = G5 = | F#5 = = E5 D5 = A4 = | G5 = = F#5 E5 = C5 = | D5 = = = F#5 = A5 = | B5 = = A5 G5 = E5 = | F#5 = = G5 A5 = D6 = | E6 = D6 C6 B5 = G5 = | F#5 = = = D#5 = B4 = | F#5 = = C#5 F#5 = A5 = | G#5 = = F#5 E5 = B4 = | A5 = = G#5 F#5 = D5 = | E5 = = = G#5 = B5 = | C#6 = = B5 A5 = F#5 = | G#5 = = A5 B5 = E6 = | F#6 = E6 D6 C#6 = A5 = | G#5 = = = F5 = C#5 =' },
      { type: 'vrc6pulse12', gain: 0.026, notes: 'E4+B4 - - E4+B4 - - E4+B4 - | D4+A4 - - D4+A4 - - D4+A4 - | C4+G4 - - C4+G4 - - C4+G4 - | D4+A4 - - D4+A4 - - D4+A4 - | E4+B4 - - E4+B4 - - E4+B4 - | D4+A4 - - D4+A4 - - D4+A4 - | C4+G4 - - C4+G4 - - C4+G4 - | B3+F#4 - - B3+F#4 - - B3+D#4 -  | F#4+C#5 - - F#4+C#5 - - F#4+C#5 - | E4+B4 - - E4+B4 - - E4+B4 - | D4+A4 - - D4+A4 - - D4+A4 - | E4+B4 - - E4+B4 - - E4+B4 - | F#4+C#5 - - F#4+C#5 - - F#4+C#5 - | E4+B4 - - E4+B4 - - E4+B4 - | D4+A4 - - D4+A4 - - D4+A4 - | C#4+G#4 - - C#4+G#4 - - C#4+F4 -' },
      { type: 'vrc6saw', gain: 0.05, notes: 'E2 = = E2 = = E3 = | D2 = = D2 = = D3 = | C2 = = C2 = = C3 = | D2 = = D2 = = D3 = | E2 = = E2 = = E3 = | D2 = = D2 = = D3 = | C2 = = C2 = = C3 = | B1 = = B1 = = B2 = | F#2 = = F#2 = = F#3 = | E2 = = E2 = = E3 = | D2 = = D2 = = D3 = | E2 = = E2 = = E3 = | F#2 = = F#2 = = F#3 = | E2 = = E2 = = E3 = | D2 = = D2 = = D3 = | C#2 = = C#2 = = C#3 =' },
    ],
    kickBoost: 1.4, // 太鼓のように重く
    drums: 'k h h k h h s h | k h h k h h s h | k h h k h h s h | k h h k h h s h | k h h k h h s h | k h h k h h s h | k h h k h h s h | k k k k s s ks ks | k h h k h h s h | k h h k h h s h | k h h k h h s h | k h h k h h s h | k h h k h h s h | k h h k h h s h | k h h k h h s h | k k k k s s ks ks',
  },
  battle3: { // 後半は1音上げて転調する2部構成（長さ2倍）
    bpm: 158,
    tracks: [
      { type: 'sawtooth', gain: 0.03, notes: 'B4 = E5 = - G5 = F#5 | E5 = B4 = - D5 E5 = | G5 = - E5 = C5 D5 E5 | F#5 = = = A5 = F#5 D5 | E5 = G5 = B5 = - A5 | G5 F#5 E5 = D5 = B4 = | C5 = E5 = G5 = C6 = | B5 = = = D#5 = F#5 = | C#5 = F#5 = - A5 = G#5 | F#5 = C#5 = - E5 F#5 = | A5 = - F#5 = D5 E5 F#5 | G#5 = = = B5 = G#5 E5 | F#5 = A5 = C#6 = - B5 | A5 G#5 F#5 = E5 = C#5 = | D5 = F#5 = A5 = D6 = | C#6 = = = F5 = G#5 =' },
      { type: 'square', gain: 0.05, notes: 'E2 = E3 E2 = E3 D3 E3 | E2 = E3 E2 = E3 D3 E3 | C3 = C4 C3 = C4 B2 C3 | D3 = D4 D3 = D4 F#3 D4 | E2 = E3 E2 = E3 D3 E3 | E2 = E3 E2 = E3 G3 E3 | C3 = C4 C3 = C4 B2 C3 | B2 = B3 B2 = B3 D#3 F#3 | F#2 = F#3 F#2 = F#3 E3 F#3 | F#2 = F#3 F#2 = F#3 E3 F#3 | D3 = D4 D3 = D4 C#3 D3 | E3 = E4 E3 = E4 G#3 E4 | F#2 = F#3 F#2 = F#3 E3 F#3 | F#2 = F#3 F#2 = F#3 A3 F#3 | D3 = D4 D3 = D4 C#3 D3 | C#3 = C#4 C#3 = C#4 F3 G#3' },
      { type: 'triangle', gain: 0.02, notes: 'E4+G4+B4 = = = = = = = | E4+G4+B4 = = = = = = = | C4+E4+G4 = = = = = = = | D4+F#4+A4 = = = = = = = | E4+G4+B4 = = = = = = = | E4+G4+B4 = = = = = = = | C4+E4+G4 = = = = = = = | B3+D#4+F#4 = = = = = = = | F#4+A4+C#5 = = = = = = = | F#4+A4+C#5 = = = = = = = | D4+F#4+A4 = = = = = = = | E4+G#4+B4 = = = = = = = | F#4+A4+C#5 = = = = = = = | F#4+A4+C#5 = = = = = = = | D4+F#4+A4 = = = = = = = | C#4+F4+G#4 = = = = = = =' },
    ],
    drums: 'k h s k h k s h | k h s k h k s h | k h s k h k s h | k h s k h k s s | k h s k h k s h | k h s k h k s h | k h s k h k s h | k s k s k s s s | k h s k h k s h | k h s k h k s h | k h s k h k s h | k h s k h k s s | k h s k h k s h | k h s k h k s h | k h s k h k s h | k s k s k s s s',
  },
  battle4: {
    bpm: 168,
    tracks: [
      { type: 'vrc6pulse25', gain: 0.03, notes: 'G5 = - G5 A#5 = D6 = | C6 A#5 A5 = G5 = D5 = | D#5 = G5 = A#5 = D6 C6 | A5 = = = F5 = C6 = | A#5 = - A#5 C6 = D6 = | F6 = D6 = C6 A#5 G5 = | D#6 = D6 C6 A#5 = G5 = | F#5 = A5 = C6 = D6 = | A5 = - A5 C6 = E6 = | D6 C6 B5 = A5 = E5 = | F5 = A5 = C6 = E6 D6 | B5 = = = G5 = D6 = | C6 = - C6 D6 = E6 = | G6 = E6 = D6 C6 A5 = | F6 = E6 D6 C6 = A5 = | G#5 = B5 = D6 = E6 =' },
      { type: 'vrc6pulse12', gain: 0.024, notes: 'G4+A#4+D5 - - G4+A#4+D5 - - G4+A#4+D5 - | G4+A#4+D5 - - G4+A#4+D5 - - G4+A#4+D5 - | D#4+G4+A#4 - - D#4+G4+A#4 - - D#4+G4+A#4 - | F4+A4+C5 - - F4+A4+C5 - - F4+A4+C5 - | G4+A#4+D5 - - G4+A#4+D5 - - G4+A#4+D5 - | G4+A#4+D5 - - G4+A#4+D5 - - G4+A#4+D5 - | C4+D#4+A#4 - - C4+D#4+A#4 - - C4+D#4+A#4 - | D4+F#4+C5 - - D4+F#4+C5 - - D4+F#4+C5 - | A4+C5+E5 - - A4+C5+E5 - - A4+C5+E5 - | A4+C5+E5 - - A4+C5+E5 - - A4+C5+E5 - | F4+A4+C5 - - F4+A4+C5 - - F4+A4+C5 - | G4+B4+D5 - - G4+B4+D5 - - G4+B4+D5 - | A4+C5+E5 - - A4+C5+E5 - - A4+C5+E5 - | A4+C5+E5 - - A4+C5+E5 - - A4+C5+E5 - | D4+F4+C5 - - D4+F4+C5 - - D4+F4+C5 - | E4+G#4+D5 - - E4+G#4+D5 - - E4+G#4+D5 -' },
      { type: 'vrc6saw', gain: 0.05, notes: 'G2 = G2 G3 - G2 F3 G3 | G2 = G2 G3 - G2 F3 G3 | D#2 = D#2 D#3 - D#2 D3 D#3 | F2 = F2 F3 - F2 D#3 F3 | G2 = G2 G3 - G2 F3 G3 | G2 = G2 G3 - G2 F3 G3 | C2 = C2 C3 - C2 A#2 C3 | D2 = D2 D3 - D2 F#2 A2 | A2 = A2 A3 - A2 G3 A3 | A2 = A2 A3 - A2 G3 A3 | F2 = F2 F3 - F2 E3 F3 | G2 = G2 G3 - G2 F3 G3 | A2 = A2 A3 - A2 G3 A3 | A2 = A2 A3 - A2 G3 A3 | D2 = D2 D3 - D2 C3 D3 | E2 = E2 E3 - E2 G#2 B2' },
    ],
    drums: 'k h s k h k s h | k h s k h k s h | k h s k h k s h | k h s k h k s h | k h s k h k s h | k h s k h k s h | k h s k h k s h | k k s s ks s ks ks | k h s k h k s h | k h s k h k s h | k h s k h k s h | k h s k h k s h | k h s k h k s h | k h s k h k s h | k h s k h k s h | k k s s ks s ks ks',
  },
  battle5: {
    bpm: 150,
    tracks: [
      { type: 'square', gain: 0.045, notes: 'A4 C5 E5 = D5 C5 B4 = | G#4 B4 E5 = D5 C5 B4 = | A4 C5 E5 A5 G5 E5 C5 = | D5 F5 A5 = G#5 = E5 = | C5 E5 A5 = B5 = C6 = | B5 G5 D5 = G5 = B5 = | A5 F5 C5 = G#5 E5 B4 = | A4 = = = E5 = A5 = | B4 D5 F#5 = E5 D5 C#5 = | A#4 C#5 F#5 = E5 D5 C#5 = | B4 D5 F#5 B5 A5 F#5 D5 = | E5 G5 B5 = A#5 = F#5 = | D5 F#5 B5 = C#6 = D6 = | C#6 A5 E5 = A5 = C#6 = | B5 G5 D5 = A#5 F#5 C#5 = | B4 = = = F#5 = B5 =' },
      { type: 'triangle', gain: 0.11, notes: 'A2 E3 A2 E3 A2 E3 A2 E3 | E2 B2 E2 B2 E2 B2 G#2 B2 | A2 E3 A2 E3 A2 E3 A2 E3 | D3 A3 D3 A3 E2 B2 E2 B2 | A2 E3 A2 E3 A2 E3 A2 E3 | G2 D3 G2 D3 G2 D3 G2 D3 | F2 C3 F2 C3 E2 B2 E2 B2 | A2 E3 A2 E3 A2 = - - | B2 F#3 B2 F#3 B2 F#3 B2 F#3 | F#2 C#3 F#2 C#3 F#2 C#3 A#2 C#3 | B2 F#3 B2 F#3 B2 F#3 B2 F#3 | E3 B3 E3 B3 F#2 C#3 F#2 C#3 | B2 F#3 B2 F#3 B2 F#3 B2 F#3 | A2 E3 A2 E3 A2 E3 A2 E3 | G2 D3 G2 D3 F#2 C#3 F#2 C#3 | B2 F#3 B2 F#3 B2 = - -' },
      { type: 'triangle', gain: 0.02, notes: 'A3+C4+E4 = = = = = = = | E3+G#3+B3 = = = = = = = | A3+C4+E4 = = = = = = = | D4+F4+A4 = = = E3+G#3+B3 = = = | A3+C4+E4 = = = = = = = | G3+B3+D4 = = = = = = = | F3+A3+C4 = = = E3+G#3+B3 = = = | A3+C4+E4 = = = = = = = | B3+D4+F#4 = = = = = = = | F#3+A#3+C#4 = = = = = = = | B3+D4+F#4 = = = = = = = | E4+G4+B4 = = = F#3+A#3+C#4 = = = | B3+D4+F#4 = = = = = = = | A3+C#4+E4 = = = = = = = | G3+B3+D4 = = = F#3+A#3+C#4 = = = | B3+D4+F#4 = = = = = = =' },
    ],
    drums: 'k h s h k h s h | k h s h k h s h | k h s h k h s h | k h s h k h s h | k h s h k h s h | k h s h k h s h | k h s h k h s h | k h s h s s s s | k h s h k h s h | k h s h k h s h | k h s h k h s h | k h s h k h s h | k h s h k h s h | k h s h k h s h | k h s h k h s h | k h s h s s s s',
  },
  battle7: {
    bpm: 152,
    tracks: [
      { type: 'vrc6pulse25', gain: 0.03, notes: 'D5 = F5 = A5 = G5 A5 | C6 = A5 = G5 F5 = D5 | F5 = = D5 F5 = A#5 = | A5 G5 = E5 = C5 E5 G5 | A5 = D6 = C6 = A5 C6 | D6 = = C6 A5 = G5 F5 | F5 = G5 = A5 = C6 = | C#6 = = = E6 = A5 = | E5 = G5 = B5 = A5 B5 | D6 = B5 = A5 G5 = E5 | G5 = = E5 G5 = C6 = | B5 A5 = F#5 = D5 F#5 A5 | B5 = E6 = D6 = B5 D6 | E6 = = D6 B5 = A5 G5 | G5 = A5 = B5 = D6 = | D#6 = = = F#6 = B5 =' },
      { type: 'vrc6pulse12', gain: 0.024, notes: '- - D4+F4+A4 - - D4+F4+A4 - - | - - D4+F4+A4 - - D4+F4+A4 - - | - - D4+F4+A#4 - - D4+F4+A#4 - - | - - E4+G4+C5 - - E4+G4+C5 - - | - - D4+F4+A4 - - D4+F4+A4 - - | - - D4+F4+A4 - - D4+F4+A4 - - | - - D4+F4+A#4 - - E4+G4+C5 - - | - - C#4+E4+A4 - - C#4+E4+A4 - - | - - E4+G4+B4 - - E4+G4+B4 - - | - - E4+G4+B4 - - E4+G4+B4 - - | - - E4+G4+C5 - - E4+G4+C5 - - | - - F#4+A4+D5 - - F#4+A4+D5 - - | - - E4+G4+B4 - - E4+G4+B4 - - | - - E4+G4+B4 - - E4+G4+B4 - - | - - E4+G4+C5 - - F#4+A4+D5 - - | - - D#4+F#4+B4 - - D#4+F#4+B4 - -' },
      { type: 'vrc6saw', gain: 0.05, notes: 'D2 D3 - D2 D3 - D2 D3 | D2 D3 - D2 D3 - D2 D3 | A#1 A#2 - A#1 A#2 - A#1 A#2 | C2 C3 - C2 C3 - C2 C3 | D2 D3 - D2 D3 - D2 D3 | D2 D3 - D2 D3 - D2 D3 | A#1 A#2 - A#1 C2 C3 - C3 | A1 A2 - A1 A2 - C#2 E2 | E2 E3 - E2 E3 - E2 E3 | E2 E3 - E2 E3 - E2 E3 | C2 C3 - C2 C3 - C2 C3 | D2 D3 - D2 D3 - D2 D3 | E2 E3 - E2 E3 - E2 E3 | E2 E3 - E2 E3 - E2 E3 | C2 C3 - C2 D2 D3 - D3 | B1 B2 - B1 B2 - D#2 F#2' },
    ],
    drums: 'k h s h - k s k | k h s h - k s k | k h s h - k s k | k h s h - k s k | k h s h - k s k | k h s h - k s k | k h s h - k s k | k s s s ks ks ks ks | k h s h - k s k | k h s h - k s k | k h s h - k s k | k h s h - k s k | k h s h - k s k | k h s h - k s k | k h s h - k s k | k s s s ks ks ks ks',
  },
  battle12: {
    bpm: 164,
    tracks: [
      { type: 'pcelead', gain: 0.03, notes: 'E5 = G5 A5 B5 = A5 G5 | E5 = G5 A5 C6 = B5 A5 | F#5 = A5 B5 D6 = C6 B5 | D#6 = = = B5 = F#5 = | E6 = D6 B5 = G5 A5 B5 | C6 = B5 G5 = E5 G5 A5 | A5 = G5 E5 F#5 = A5 D6 | D#6 = = = F#6 = = = | F#5 = A5 B5 C#6 = B5 A5 | F#5 = A5 B5 D6 = C#6 B5 | G#5 = B5 C#6 E6 = D6 C#6 | F6 = = = C#6 = G#5 = | F#6 = E6 C#6 = A5 B5 C#6 | D6 = C#6 A5 = F#5 A5 B5 | B5 = A5 F#5 G#5 = B5 E6 | F6 = = = G#6 = = =' },
      { type: 'pcebass', gain: 0.06, notes: 'E2 E2 E3 E2 E2 E2 D3 E2 | C2 C2 C3 C2 C2 C2 B2 C2 | D2 D2 D3 D2 D2 D2 C3 D2 | B1 B1 B2 B1 B1 B1 A2 B1 | E2 E2 E3 E2 E2 E2 D3 E2 | C2 C2 C3 C2 C2 C2 B2 C2 | A1 A1 A2 A1 D2 D2 D3 D2 | B1 B1 B2 B1 B1 B1 A2 B1 | F#2 F#2 F#3 F#2 F#2 F#2 E3 F#2 | D2 D2 D3 D2 D2 D2 C#3 D2 | E2 E2 E3 E2 E2 E2 D3 E2 | C#2 C#2 C#3 C#2 C#2 C#2 B2 C#2 | F#2 F#2 F#3 F#2 F#2 F#2 E3 F#2 | D2 D2 D3 D2 D2 D2 C#3 D2 | B1 B1 B2 B1 E2 E2 E3 E2 | C#2 C#2 C#3 C#2 C#2 C#2 B2 C#2' },
      { type: 'pcebrass', gain: 0.03, notes: 'E3+B3 - E3+B3 E3+B3 - E3+B3 - E3+B3 | C3+G3 - C3+G3 C3+G3 - C3+G3 - C3+G3 | D3+A3 - D3+A3 D3+A3 - D3+A3 - D3+A3 | B2+F#3 - B2+F#3 B2+F#3 - B2+F#3 - B2+F#3 | E3+B3 - E3+B3 E3+B3 - E3+B3 - E3+B3 | C3+G3 - C3+G3 C3+G3 - C3+G3 - C3+G3 | A2+E3 - A2+E3 A2+E3 - D3+A3 - D3+A3 | B2+F#3 - B2+F#3 B2+F#3 - B2+F#3 - B2+F#3 | F#3+C#4 - F#3+C#4 F#3+C#4 - F#3+C#4 - F#3+C#4 | D3+A3 - D3+A3 D3+A3 - D3+A3 - D3+A3 | E3+B3 - E3+B3 E3+B3 - E3+B3 - E3+B3 | C#3+G#3 - C#3+G#3 C#3+G#3 - C#3+G#3 - C#3+G#3 | F#3+C#4 - F#3+C#4 F#3+C#4 - F#3+C#4 - F#3+C#4 | D3+A3 - D3+A3 D3+A3 - D3+A3 - D3+A3 | B2+F#3 - B2+F#3 B2+F#3 - E3+B3 - E3+B3 | C#3+G#3 - C#3+G#3 C#3+G#3 - C#3+G#3 - C#3+G#3' },
    ],
    drums: 'k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k s k s ks ks ks ks | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k s k s ks ks ks ks',
  },
  continue: { // ボス戦のコンテニュー画面：レトロなゲーセンのコンテニュー待ちのような、焦りをあおる短調の疾走曲（ハ短調・BPM150）
    bpm: 150,
    tracks: [
      { type: 'vrc6pulse25', gain: 0.024, notes: 'C5 = D#5 G5 C6 = G5 D#5 | C6 = = G#5 D#5 = C5 = | D6 = A#5 F5 D5 = F5 A#5 | B5 = = = D6 = G5 = | G5 C6 D#6 = D6 C6 G5 = | G#5 = C6 = D#6 = D6 C6 | C6 = G#5 F5 C5 = F5 G#5 | B5 = D6 = G6 = = =' },
      { type: 'vrc6pulse12', gain: 0.012, notes: 'C4 G4 D#4 G4 C4 G4 D#4 G4 | G#3 D#4 C4 D#4 G#3 D#4 C4 D#4 | A#3 F4 D4 F4 A#3 F4 D4 F4 | G3 D4 B3 D4 G3 D4 B3 D4 | C4 G4 D#4 G4 C4 G4 D#4 G4 | G#3 D#4 C4 D#4 G#3 D#4 C4 D#4 | F3 C4 G#3 C4 F3 C4 G#3 C4 | G3 D4 B3 D4 G3 D4 B3 D4' },
      { type: 'vrc6saw', gain: 0.04, notes: 'C2 C3 C2 C3 C2 C3 C2 C3 | G#1 G#2 G#1 G#2 G#1 G#2 G#1 G#2 | A#1 A#2 A#1 A#2 A#1 A#2 A#1 A#2 | G1 G2 G1 G2 G1 G2 G1 G2 | C2 C3 C2 C3 C2 C3 C2 C3 | G#1 G#2 G#1 G#2 G#1 G#2 G#1 G#2 | F1 F2 F1 F2 F1 F2 F1 F2 | G1 G2 G1 G2 G1 G2 G1 G2' },
    ],
    drums: 'k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k k s s ks ks ks ks',
  },
  gameover: {
    bpm: 126,
    tracks: [
      { type: 'square', gain: 0.036, notes: 'A5 = = = E5 = A5 = | C6 = B5 = A5 = G5 = | A5 = = = F5 = C5 = | D5 = = = G5 = B5 = | A5 = = = E5 = A5 = | C6 = D6 = E6 = = = | F6 = E6 = D6 = B5 = | G#5 = = = = = - -' },
      { type: 'square', gain: 0.045, notes: 'A2 A3 - A2 A3 - G3 A3 | A2 A3 - A2 A3 - C4 A3 | F2 F3 - F2 F3 - E3 F3 | G2 G3 - G2 G3 - F#3 G3 | A2 A3 - A2 A3 - G3 A3 | A2 A3 - A2 A3 - C4 A3 | F2 F3 F2 F3 E2 E3 E2 E3 | E2 E3 - E2 E3 - G#3 B3' },
      { type: 'triangle', gain: 0.026, notes: 'A3+C4+E4 = = = = = = = | A3+C4+E4 = = = = = = = | F3+A3+C4 = = = = = = = | G3+B3+D4 = = = = = = = | A3+C4+E4 = = = = = = = | A3+C4+E4 = = = = = = = | F3+A3+C4 = = = E3+G#3+B3 = = = | E3+G#3+B3 = = = = = = =' },
      { type: 'triangle', gain: 0.2, notes: 'A1 = = A1 = = A1 = | A1 = = A1 = = A1 = | F1 = = F1 = = F1 = | G1 = = G1 = = G1 = | A1 = = A1 = = A1 = | A1 = = A1 = = A1 = | F1 = = = E1 = = = | E1 = = E1 = = E1 =' },
      { type: 'sawtooth', gain: 0.022, notes: 'A1 = = A1 = = A1 = | A1 = = A1 = = A1 = | F1 = = F1 = = F1 = | G1 = = G1 = = G1 = | A1 = = A1 = = A1 = | A1 = = A1 = = A1 = | F1 = = = E1 = = = | E1 = = E1 = = E1 =' },
    ],
    kickBoost: 1.7, // キックを太く長く
    drums: 'k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s s | k h s h k k s h | k h s h k k s h | k h s h k h s h | k - s - ks ks ks ks',
  },
  battle15: {
    bpm: 160,
    tracks: [
      { type: 'vrc6pulse25', gain: 0.03, notes: 'A5 = = E5 A5 B5 C6 = | B5 = G5 = D6 = B5 = | C6 = = A5 F5 = A5 C6 | B5 = G#5 = E5 = G#5 B5 | E6 = D6 C6 B5 = A5 = | B5 = C6 D6 = B5 G5 = | A5 = C6 = B5 = D6 = | E6 = = = = = D#6 E6 | B5 = = F#5 B5 C#6 D6 = | C#6 = A5 = E6 = C#6 = | D6 = = B5 G5 = B5 D6 | C#6 = A#5 = F#5 = A#5 C#6 | F#6 = E6 D6 C#6 = B5 = | C#6 = D6 E6 = C#6 A5 = | B5 = D6 = C#6 = E6 = | F#6 = = = = = F6 F#6' },
      { type: 'vrc6pulse12', gain: 0.024, notes: 'A3+E4 A3+E4 - A3+E4 - A3+E4 A3+E4 - | G3+D4 G3+D4 - G3+D4 - G3+D4 G3+D4 - | F3+C4 F3+C4 - F3+C4 - F3+C4 F3+C4 - | E3+B3 E3+B3 - E3+B3 - E3+B3 E3+B3 - | A3+E4 A3+E4 - A3+E4 - A3+E4 A3+E4 - | G3+D4 G3+D4 - G3+D4 - G3+D4 G3+D4 - | F3+C4 F3+C4 - F3+C4 G3+D4 G3+D4 - G3+D4 | E3+B3 E3+B3 - E3+B3 - E3+B3 E3+B3 - | B3+F#4 B3+F#4 - B3+F#4 - B3+F#4 B3+F#4 - | A3+E4 A3+E4 - A3+E4 - A3+E4 A3+E4 - | G3+D4 G3+D4 - G3+D4 - G3+D4 G3+D4 - | F#3+C#4 F#3+C#4 - F#3+C#4 - F#3+C#4 F#3+C#4 - | B3+F#4 B3+F#4 - B3+F#4 - B3+F#4 B3+F#4 - | A3+E4 A3+E4 - A3+E4 - A3+E4 A3+E4 - | G3+D4 G3+D4 - G3+D4 A3+E4 A3+E4 - A3+E4 | F#3+C#4 F#3+C#4 - F#3+C#4 - F#3+C#4 F#3+C#4 -' },
      { type: 'vrc6saw', gain: 0.05, notes: 'A2 A2 A3 A2 A2 A2 G2 A2 | G2 G2 G3 G2 G2 G2 F2 G2 | F2 F2 F3 F2 F2 F2 E2 F2 | E2 E2 E3 E2 E2 E2 D2 E2 | A2 A2 A3 A2 A2 A2 G2 A2 | G2 G2 G3 G2 G2 G2 F2 G2 | F2 F2 F3 F2 G2 G2 G3 G2 | E2 E2 E3 E2 G#2 G#2 B2 D3 | B2 B2 B3 B2 B2 B2 A2 B2 | A2 A2 A3 A2 A2 A2 G2 A2 | G2 G2 G3 G2 G2 G2 F#2 G2 | F#2 F#2 F#3 F#2 F#2 F#2 E2 F#2 | B2 B2 B3 B2 B2 B2 A2 B2 | A2 A2 A3 A2 A2 A2 G2 A2 | G2 G2 G3 G2 A2 A2 A3 A2 | F#2 F#2 F#3 F#2 A#2 A#2 C#3 E3' },
    ],
    kickBoost: 1.2,
    drums: 'k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k s k s s s ks ks | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k s k s s s ks ks',
  },
  battle20: {
    bpm: 160,
    tracks: [
      { type: 'vrc6pulse25', gain: 0.03, notes: 'D5 = F5 A5 = G5 F5 E5 | G5 = = E5 C5 = D5 E5 | F5 = D5 F5 A#5 = A5 G5 | A5 = G5 = E5 = C5 = | D6 = C6 A5 = C6 D6 = | C6 = A5 F5 = G5 A5 C6 | B5 = D6 = G5 = B5 D6 | C#6 = E6 = A5 = = = | E5 = G5 B5 = A5 G5 F#5 | A5 = = F#5 D5 = E5 F#5 | G5 = E5 G5 C6 = B5 A5 | B5 = A5 = F#5 = D5 = | E6 = D6 B5 = D6 E6 = | D6 = B5 G5 = A5 B5 D6 | C#6 = E6 = A5 = C#6 E6 | D#6 = F#6 = B5 = = =' },
      { type: 'vrc6pulse12', gain: 0.019, notes: 'D4 A4 D5 A4 F4 A4 D5 A4 | C4 G4 C5 G4 E4 G4 C5 G4 | A#3 F4 A#4 F4 D4 F4 A#4 F4 | C4 G4 C5 G4 E4 G4 C5 G4 | D4 A4 D5 A4 F4 A4 D5 A4 | F4 C5 F5 C5 A4 C5 F5 C5 | G4 D5 G5 D5 B4 D5 G5 D5 | A4 E5 A5 E5 C#5 E5 A5 E5 | E4 B4 E5 B4 G4 B4 E5 B4 | D4 A4 D5 A4 F#4 A4 D5 A4 | C4 G4 C5 G4 E4 G4 C5 G4 | D4 A4 D5 A4 F#4 A4 D5 A4 | E4 B4 E5 B4 G4 B4 E5 B4 | G4 D5 G5 D5 B4 D5 G5 D5 | A4 E5 A5 E5 C#5 E5 A5 E5 | B4 F#5 B5 F#5 D#5 F#5 B5 F#5' },
      { type: 'vrc6saw', gain: 0.05, notes: 'D2 = D3 D2 = D2 C3 D2 | C2 = C3 C2 = C2 A#2 C2 | A#1 = A#2 A#1 = A#1 A2 A#1 | C2 = C3 C2 = C2 E2 G2 | D2 = D3 D2 = D2 C3 D2 | F1 = F2 F1 = F1 D#2 F1 | G1 = G2 G1 = G1 F2 G1 | A1 = A2 A1 = A1 C#2 E2 | E2 = E3 E2 = E2 D3 E2 | D2 = D3 D2 = D2 C3 D2 | C2 = C3 C2 = C2 B2 C2 | D2 = D3 D2 = D2 F#2 A2 | E2 = E3 E2 = E2 D3 E2 | G1 = G2 G1 = G1 F2 G1 | A1 = A2 A1 = A1 G2 A1 | B1 = B2 B1 = B1 D#2 F#2' },
    ],
    drums: 'k - h s - k s h | k - h s - k s h | k - h s - k s h | k - h s - k s s | k - h s - k s h | k - h s - k s h | k - h s - k s h | k s s k s s ks ks | k - h s - k s h | k - h s - k s h | k - h s - k s h | k - h s - k s s | k - h s - k s h | k - h s - k s h | k - h s - k s h | k s s k s s ks ks',
  },

  battle22: {
    bpm: 148,
    tracks: [
      { type: 'vrc6pulse25', gain: 0.028, notes: 'E5 - B5 E5 - D6 B5 G5 | E5 - C6 E5 - B5 G5 E5 | F#5 - D6 F#5 - C6 A5 F#5 | B5 = A5 = F#5 = D5 = | E5 - B5 E5 - D6 B5 G5 | E5 - C6 E5 - B5 G5 E5 | F#5 - D6 F#5 - C6 A5 F#5 | B5 D6 F#6 = E6 D6 B5 F#5 | G6 = E6 = C6 = E6 G6 | A6 = F#6 = D6 = F#6 A6 | B6 = = A6 F#6 = D6 = | E6 = = = B5 = E6 = | G6 = E6 = C6 = E6 G6 | A6 = F#6 = D6 = F#6 A6 | B6 = A6 = G6 = F#6 = | D#6 = F#6 = A6 = B6 = | F#5 - C#6 F#5 - E6 C#6 A5 | F#5 - D6 F#5 - C#6 A5 F#5 | G#5 - E6 G#5 - D6 B5 G#5 | C#6 = B5 = G#5 = E5 = | F#5 - C#6 F#5 - E6 C#6 A5 | F#5 - D6 F#5 - C#6 A5 F#5 | G#5 - E6 G#5 - D6 B5 G#5 | C#6 E6 G#6 = F#6 E6 C#6 G#5 | A6 = F#6 = D6 = F#6 A6 | B6 = G#6 = E6 = G#6 B6 | C#7 = = B6 G#6 = E6 = | F#6 = = = C#6 = F#6 = | A6 = F#6 = D6 = F#6 A6 | B6 = G#6 = E6 = G#6 B6 | C#7 = B6 = A6 = G#6 = | F6 = G#6 = B6 = C#7 =' },
      { type: 'vrc6pulse12', gain: 0.012, notes: '- E4+G4+B4 - E4+G4+B4 - E4+G4+B4 - E4+G4+B4 | - C4+E4+G4 - C4+E4+G4 - C4+E4+G4 - C4+E4+G4 | - D4+F#4+A4 - D4+F#4+A4 - D4+F#4+A4 - D4+F#4+A4 | - D4+F#4+B4 - D4+F#4+B4 - D4+F#4+B4 - D4+F#4+B4 | - E4+G4+B4 - E4+G4+B4 - E4+G4+B4 - E4+G4+B4 | - C4+E4+G4 - C4+E4+G4 - C4+E4+G4 - C4+E4+G4 | - D4+F#4+A4 - D4+F#4+A4 - D4+F#4+A4 - D4+F#4+A4 | - D4+F#4+B4 - D4+F#4+B4 - D4+F#4+B4 - D4+F#4+B4 | - C4+E4+G4 - C4+E4+G4 - C4+E4+G4 - C4+E4+G4 | - D4+F#4+A4 - D4+F#4+A4 - D4+F#4+A4 - D4+F#4+A4 | - D4+F#4+B4 - D4+F#4+B4 - D4+F#4+B4 - D4+F#4+B4 | - E4+G4+B4 - E4+G4+B4 - E4+G4+B4 - E4+G4+B4 | - C4+E4+G4 - C4+E4+G4 - C4+E4+G4 - C4+E4+G4 | - D4+F#4+A4 - D4+F#4+A4 - D4+F#4+A4 - D4+F#4+A4 | - D#4+F#4+B4 - D#4+F#4+B4 - D#4+F#4+B4 - D#4+F#4+B4 | - D#4+F#4+B4 - D#4+F#4+B4 - D#4+F#4+B4 - D#4+F#4+B4 | - F#4+A4+C#5 - F#4+A4+C#5 - F#4+A4+C#5 - F#4+A4+C#5 | - D4+F#4+A4 - D4+F#4+A4 - D4+F#4+A4 - D4+F#4+A4 | - E4+G#4+B4 - E4+G#4+B4 - E4+G#4+B4 - E4+G#4+B4 | - E4+G#4+C#5 - E4+G#4+C#5 - E4+G#4+C#5 - E4+G#4+C#5 | - F#4+A4+C#5 - F#4+A4+C#5 - F#4+A4+C#5 - F#4+A4+C#5 | - D4+F#4+A4 - D4+F#4+A4 - D4+F#4+A4 - D4+F#4+A4 | - E4+G#4+B4 - E4+G#4+B4 - E4+G#4+B4 - E4+G#4+B4 | - E4+G#4+C#5 - E4+G#4+C#5 - E4+G#4+C#5 - E4+G#4+C#5 | - D4+F#4+A4 - D4+F#4+A4 - D4+F#4+A4 - D4+F#4+A4 | - E4+G#4+B4 - E4+G#4+B4 - E4+G#4+B4 - E4+G#4+B4 | - E4+G#4+C#5 - E4+G#4+C#5 - E4+G#4+C#5 - E4+G#4+C#5 | - F#4+A4+C#5 - F#4+A4+C#5 - F#4+A4+C#5 - F#4+A4+C#5 | - D4+F#4+A4 - D4+F#4+A4 - D4+F#4+A4 - D4+F#4+A4 | - E4+G#4+B4 - E4+G#4+B4 - E4+G#4+B4 - E4+G#4+B4 | - F4+G#4+C#5 - F4+G#4+C#5 - F4+G#4+C#5 - F4+G#4+C#5 | - F4+G#4+C#5 - F4+G#4+C#5 - F4+G#4+C#5 - F4+G#4+C#5' },
      { type: 'vrc6saw', gain: 0.05, notes: 'E2 E3 E2 E3 E2 E3 E2 E3 | C2 C3 C2 C3 C2 C3 C2 C3 | D2 D3 D2 D3 D2 D3 D2 D3 | B1 B2 B1 B2 B1 B2 B1 B2 | E2 E3 E2 E3 E2 E3 E2 E3 | C2 C3 C2 C3 C2 C3 C2 C3 | D2 D3 D2 D3 D2 D3 D2 D3 | B1 B2 B1 B2 B1 B2 B1 B2 | C2 C3 C2 C3 C2 C3 C2 C3 | D2 D3 D2 D3 D2 D3 D2 D3 | B1 B2 B1 B2 B1 B2 B1 B2 | E2 E3 E2 E3 E2 E3 E2 E3 | C2 C3 C2 C3 C2 C3 C2 C3 | D2 D3 D2 D3 D2 D3 D2 D3 | B1 B2 B1 B2 B1 B2 B1 B2 | B1 B2 B1 B2 B1 B2 B1 B2 | F#2 F#3 F#2 F#3 F#2 F#3 F#2 F#3 | D2 D3 D2 D3 D2 D3 D2 D3 | E2 E3 E2 E3 E2 E3 E2 E3 | C#2 C#3 C#2 C#3 C#2 C#3 C#2 C#3 | F#2 F#3 F#2 F#3 F#2 F#3 F#2 F#3 | D2 D3 D2 D3 D2 D3 D2 D3 | E2 E3 E2 E3 E2 E3 E2 E3 | C#2 C#3 C#2 C#3 C#2 C#3 C#2 C#3 | D2 D3 D2 D3 D2 D3 D2 D3 | E2 E3 E2 E3 E2 E3 E2 E3 | C#2 C#3 C#2 C#3 C#2 C#3 C#2 C#3 | F#2 F#3 F#2 F#3 F#2 F#3 F#2 F#3 | D2 D3 D2 D3 D2 D3 D2 D3 | E2 E3 E2 E3 E2 E3 E2 E3 | C#2 C#3 C#2 C#3 C#2 C#3 C#2 C#3 | C#2 C#3 C#2 C#3 C#2 C#3 C#2 C#3' },
    ],
    kickBoost: 1.3,
    drums: 'k h ks h k h ks h | k h ks h k h ks h | k h ks h k h ks h | k h ks h k h ks h | k h ks h k h ks h | k h ks h k h ks h | k h ks h k h ks h | k h ks h ks ks ks ks | k h ks h k h ks h | k h ks h k h ks h | k h ks h k h ks h | k h ks h k h ks h | k h ks h k h ks h | k h ks h k h ks h | k h ks h k h ks h | ks ks ks ks ks ks ks ks | k h ks h k h ks h | k h ks h k h ks h | k h ks h k h ks h | k h ks h k h ks h | k h ks h k h ks h | k h ks h k h ks h | k h ks h k h ks h | k h ks h ks ks ks ks | k h ks h k h ks h | k h ks h k h ks h | k h ks h k h ks h | k h ks h k h ks h | k h ks h k h ks h | k h ks h k h ks h | k h ks h k h ks h | ks ks ks ks ks ks ks ks',
  },
  battle24: {
    bpm: 156,
    tracks: [
      { type: 'vrc6pulse25', gain: 0.03, notes: 'A5 = = C6 - A5 G5 A5 | E6 = D6 C6 - A5 = = | F5 = A5 C6 - D6 C6 A5 | B5 = G5 = D6 = B5 = | A5 = = C6 - A5 G5 A5 | E6 = G6 E6 - D6 C6 D6 | C6 = A5 = F6 = E6 D6 | E6 = = = G#5 = B5 = | D6 = F6 = A6 = G6 F6 | E6 = D6 = A5 = = = | C6 = E6 = A6 = G6 E6 | D#6 E6 D6 C6 A5 = = = | F6 = E6 F6 - E6 C6 A5 | G6 = F6 G6 - F6 D6 B5 | A6 = E6 = C6 = A5 = | B5 = G#5 = E5 = B5 = | B5 = = D6 - B5 A5 B5 | F#6 = E6 D6 - B5 = = | G5 = B5 D6 - E6 D6 B5 | C#6 = A5 = E6 = C#6 = | B5 = = D6 - B5 A5 B5 | F#6 = A6 F#6 - E6 D6 E6 | D6 = B5 = G6 = F#6 E6 | F#6 = = = A#5 = C#6 = | E6 = G6 = B6 = A6 G6 | F#6 = E6 = B5 = = = | D6 = F#6 = B6 = A6 F#6 | F6 F#6 E6 D6 B5 = = = | G6 = F#6 G6 - F#6 D6 B5 | A6 = G6 A6 - G6 E6 C#6 | B6 = F#6 = D6 = B5 = | C#6 = A#5 = F#5 = C#6 =' },
      { type: 'vrc6pulse12', gain: 0.016, notes: 'A4+E5 - A4+E5 A4+E5 - A4+E5 - A4+E5 | A4+E5 - A4+E5 A4+E5 - A4+E5 - A4+E5 | F4+C5 - F4+C5 F4+C5 - F4+C5 - F4+C5 | G4+D5 - G4+D5 G4+D5 - G4+D5 - G4+D5 | A4+E5 - A4+E5 A4+E5 - A4+E5 - A4+E5 | A4+E5 - A4+E5 A4+E5 - A4+E5 - A4+E5 | F4+C5 - F4+C5 F4+C5 - F4+C5 - F4+C5 | E4+B4 - E4+B4 E4+B4 - E4+B4 - E4+B4 | D4+A4 - D4+A4 D4+A4 - D4+A4 - D4+A4 | D4+A4 - D4+A4 D4+A4 - D4+A4 - D4+A4 | A4+E5 - A4+E5 A4+E5 - A4+E5 - A4+E5 | A4+E5 - A4+E5 A4+E5 - A4+E5 - A4+E5 | F4+C5 - F4+C5 F4+C5 - F4+C5 - F4+C5 | G4+D5 - G4+D5 G4+D5 - G4+D5 - G4+D5 | A4+E5 - A4+E5 A4+E5 - A4+E5 - A4+E5 | E4+B4 - E4+B4 E4+B4 - E4+B4 - E4+B4 | B4+F#5 - B4+F#5 B4+F#5 - B4+F#5 - B4+F#5 | B4+F#5 - B4+F#5 B4+F#5 - B4+F#5 - B4+F#5 | G4+D5 - G4+D5 G4+D5 - G4+D5 - G4+D5 | A4+E5 - A4+E5 A4+E5 - A4+E5 - A4+E5 | B4+F#5 - B4+F#5 B4+F#5 - B4+F#5 - B4+F#5 | B4+F#5 - B4+F#5 B4+F#5 - B4+F#5 - B4+F#5 | G4+D5 - G4+D5 G4+D5 - G4+D5 - G4+D5 | F#4+C#5 - F#4+C#5 F#4+C#5 - F#4+C#5 - F#4+C#5 | E4+B4 - E4+B4 E4+B4 - E4+B4 - E4+B4 | E4+B4 - E4+B4 E4+B4 - E4+B4 - E4+B4 | B4+F#5 - B4+F#5 B4+F#5 - B4+F#5 - B4+F#5 | B4+F#5 - B4+F#5 B4+F#5 - B4+F#5 - B4+F#5 | G4+D5 - G4+D5 G4+D5 - G4+D5 - G4+D5 | A4+E5 - A4+E5 A4+E5 - A4+E5 - A4+E5 | B4+F#5 - B4+F#5 B4+F#5 - B4+F#5 - B4+F#5 | F#4+C#5 - F#4+C#5 F#4+C#5 - F#4+C#5 - F#4+C#5' },
      { type: 'vrc6saw', gain: 0.05, notes: 'A1 A1 A2 A1 A1 A1 A2 A1 | A1 A1 A2 A1 A1 A1 A2 A1 | F1 F1 F2 F1 F1 F1 F2 F1 | G1 G1 G2 G1 G1 G1 G2 G#1 | A1 A1 A2 A1 A1 A1 A2 A1 | A1 A1 A2 A1 A1 A1 A2 A1 | F1 F1 F2 F1 F1 F1 F2 F1 | E2 E2 E3 E2 E2 E2 E3 E2 | D2 D2 D3 D2 D2 D2 D3 D2 | D2 D2 D3 D2 D2 D2 D3 D2 | A1 A1 A2 A1 A1 A1 A2 A1 | A1 A1 A2 A1 A1 A1 A2 A1 | F1 F1 F2 F1 F1 F1 F2 F1 | G1 G1 G2 G1 G1 G1 G2 G1 | A1 A1 A2 A1 A1 A1 A2 A1 | E2 E2 E3 E2 E2 E2 E3 G#1 | B1 B1 B2 B1 B1 B1 B2 B1 | B1 B1 B2 B1 B1 B1 B2 B1 | G1 G1 G2 G1 G1 G1 G2 G1 | A1 A1 A2 A1 A1 A1 A2 A#1 | B1 B1 B2 B1 B1 B1 B2 B1 | B1 B1 B2 B1 B1 B1 B2 B1 | G1 G1 G2 G1 G1 G1 G2 G1 | F#2 F#2 F#3 F#2 F#2 F#2 F#3 F#2 | E2 E2 E3 E2 E2 E2 E3 E2 | E2 E2 E3 E2 E2 E2 E3 E2 | B1 B1 B2 B1 B1 B1 B2 B1 | B1 B1 B2 B1 B1 B1 B2 B1 | G1 G1 G2 G1 G1 G1 G2 G1 | A1 A1 A2 A1 A1 A1 A2 A1 | B1 B1 B2 B1 B1 B1 B2 B1 | F#2 F#2 F#3 F#2 F#2 F#2 F#3 A#1' },
    ],
    kickBoost: 1.3,
    drums: 'k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h s s ks ks | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | ks s s s ks ks ks ks | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h s s ks ks | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | ks s s s ks ks ks ks',
  },
  battle27: {
    bpm: 170,
    tracks: [
      { type: 'vrc6pulse25', gain: 0.03, notes: 'D6 = A5 = D6 E6 F6 = | F6 = E6 D6 = C6 D6 = | E6 = C6 = G5 = C6 E6 | D6 = = = A5 = = = | A5 D6 F6 A6 = G6 F6 E6 | F6 = D6 = A#5 = D6 F6 | G6 = E6 = C6 = E6 G6 | A6 = = = C#6 = E6 = | G6 = A#6 = A6 G6 F6 = | F6 = A6 = G6 F6 E6 = | D6 = F6 = E6 D6 C6 = | C#6 = E6 = A5 = = = | A#5 = D6 = G6 = F6 = | E6 = G6 = C7 = A#6 = | A6 = F6 = D6 = F6 = | E6 = C#6 = A5 = G5 = | E6 = B5 = E6 F#6 G6 = | G6 = F#6 E6 = D6 E6 = | F#6 = D6 = A5 = D6 F#6 | E6 = = = B5 = = = | B5 E6 G6 B6 = A6 G6 F#6 | G6 = E6 = C6 = E6 G6 | A6 = F#6 = D6 = F#6 A6 | B6 = = = D#6 = F#6 = | A6 = C7 = B6 A6 G6 = | G6 = B6 = A6 G6 F#6 = | E6 = G6 = F#6 E6 D6 = | D#6 = F#6 = B5 = = = | C6 = E6 = A6 = G6 = | F#6 = A6 = D7 = C7 = | B6 = G6 = E6 = G6 = | F#6 = D#6 = B5 = A5 =' },
      { type: 'vrc6pulse12', gain: 0.013, notes: 'D4 F4 A4 D5 A4 F4 D4 F4 | A#3 D4 F4 A#4 F4 D4 A#3 D4 | C4 E4 G4 C5 G4 E4 C4 E4 | D4 F4 A4 D5 A4 F4 D4 F4 | D4 F4 A4 D5 A4 F4 D4 F4 | A#3 D4 F4 A#4 F4 D4 A#3 D4 | C4 E4 G4 C5 G4 E4 C4 E4 | A3 C#4 E4 A4 E4 C#4 A3 C#4 | G3 A#3 D4 G4 D4 A#3 G3 A#3 | D4 F4 A4 D5 A4 F4 D4 F4 | A#3 D4 F4 A#4 F4 D4 A#3 D4 | A3 C#4 E4 A4 E4 C#4 A3 C#4 | G3 A#3 D4 G4 D4 A#3 G3 A#3 | C4 E4 G4 C5 G4 E4 C4 E4 | D4 F4 A4 D5 A4 F4 D4 F4 | A3 C#4 G4 A4 G4 C#4 A3 C#4 | E4 G4 B4 E5 B4 G4 E4 G4 | C4 E4 G4 C5 G4 E4 C4 E4 | D4 F#4 A4 D5 A4 F#4 D4 F#4 | E4 G4 B4 E5 B4 G4 E4 G4 | E4 G4 B4 E5 B4 G4 E4 G4 | C4 E4 G4 C5 G4 E4 C4 E4 | D4 F#4 A4 D5 A4 F#4 D4 F#4 | B3 D#4 F#4 B4 F#4 D#4 B3 D#4 | A3 C4 E4 A4 E4 C4 A3 C4 | E4 G4 B4 E5 B4 G4 E4 G4 | C4 E4 G4 C5 G4 E4 C4 E4 | B3 D#4 F#4 B4 F#4 D#4 B3 D#4 | A3 C4 E4 A4 E4 C4 A3 C4 | D4 F#4 A4 D5 A4 F#4 D4 F#4 | E4 G4 B4 E5 B4 G4 E4 G4 | B3 D#4 A4 B4 A4 D#4 B3 D#4' },
      { type: 'vrc6saw', gain: 0.05, notes: 'D2 D3 D2 D3 D2 D3 D2 D3 | A#1 A#2 A#1 A#2 A#1 A#2 A#1 A#2 | C2 C3 C2 C3 C2 C3 C2 C3 | D2 D3 D2 D3 D2 D3 D3 D2 | D2 D3 D2 D3 D2 D3 D2 D3 | A#1 A#2 A#1 A#2 A#1 A#2 A#1 A#2 | C2 C3 C2 C3 C2 C3 C2 C3 | A1 A2 A1 A2 A1 A2 A2 A1 | G1 G2 G1 G2 G1 G2 G1 G2 | D2 D3 D2 D3 D2 D3 D2 D3 | A#1 A#2 A#1 A#2 A#1 A#2 A#1 A#2 | A1 A2 A1 A2 A1 A2 A2 A1 | G1 G2 G1 G2 G1 G2 G1 G2 | C2 C3 C2 C3 C2 C3 C2 C3 | D2 D3 D2 D3 D2 D3 D2 D3 | A1 A2 A1 A2 A1 A2 A2 A1 | E2 E3 E2 E3 E2 E3 E2 E3 | C2 C3 C2 C3 C2 C3 C2 C3 | D2 D3 D2 D3 D2 D3 D2 D3 | E2 E3 E2 E3 E2 E3 E3 E2 | E2 E3 E2 E3 E2 E3 E2 E3 | C2 C3 C2 C3 C2 C3 C2 C3 | D2 D3 D2 D3 D2 D3 D2 D3 | B1 B2 B1 B2 B1 B2 B2 B1 | A1 A2 A1 A2 A1 A2 A1 A2 | E2 E3 E2 E3 E2 E3 E2 E3 | C2 C3 C2 C3 C2 C3 C2 C3 | B1 B2 B1 B2 B1 B2 B2 B1 | A1 A2 A1 A2 A1 A2 A1 A2 | D2 D3 D2 D3 D2 D3 D2 D3 | E2 E3 E2 E3 E2 E3 E2 E3 | B1 B2 B1 B2 B1 B2 B2 B1' },
    ],
    kickBoost: 1.2,
    drums: 'k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k s s s ks s ks ks | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | ks ks s s ks ks ks ks | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k s s s ks s ks ks | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | ks ks s s ks ks ks ks',
  },
  battle28: {
    bpm: 164,
    tracks: [
      { type: 'vrc6pulse25', gain: 0.03, notes: 'E5 = G5 = B5 = A5 G5 | E5 = = G5 = C6 B5 A5 | F#5 = A5 = D6 = C6 B5 | D#6 = = = B5 = F#5 = | E6 = D6 = B5 = G5 A5 | B5 = A5 G5 E5 = G5 = | A5 = F#5 = D5 = F#5 A5 | D6 = = = C6 = A5 = | G5 = C6 = E6 = D6 C6 | F#6 = E6 D6 A5 = D6 = | F#6 = = D6 B5 = F#5 = | G6 = F#6 E6 B5 = E6 = | E6 = G6 = C7 = B6 A6 | A6 = F#6 = D7 = C7 = | B6 = = = A6 G6 F#6 = | D#6 = F#6 = A6 = B6 = | F#5 = A5 = C#6 = B5 A5 | F#5 = = A5 = D6 C#6 B5 | G#5 = B5 = E6 = D6 C#6 | F6 = = = C#6 = G#5 = | F#6 = E6 = C#6 = A5 B5 | C#6 = B5 A5 F#5 = A5 = | B5 = G#5 = E5 = G#5 B5 | E6 = = = D6 = B5 = | A5 = D6 = F#6 = E6 D6 | G#6 = F#6 E6 B5 = E6 = | G#6 = = E6 C#6 = G#5 = | A6 = G#6 F#6 C#6 = F#6 = | F#6 = A6 = D7 = C#7 B6 | B6 = G#6 = E7 = D7 = | C#7 = = = B6 A6 G#6 = | F6 = G#6 = B6 = C#7 =' },
      { type: 'vrc6pulse12', gain: 0.013, notes: 'E4 B4 G4 B4 E5 B4 G4 B4 | C4 G4 E4 G4 C5 G4 E4 G4 | D4 A4 F#4 A4 D5 A4 F#4 A4 | B3 F#4 D#4 F#4 B4 F#4 D#4 F#4 | E4 B4 G4 B4 E5 B4 G4 B4 | C4 G4 E4 G4 C5 G4 E4 G4 | D4 A4 F#4 A4 D5 A4 F#4 A4 | D4 A4 F#4 A4 D5 A4 F#4 A4 | C4 G4 E4 G4 C5 G4 E4 G4 | D4 A4 F#4 A4 D5 A4 F#4 A4 | B3 F#4 D4 F#4 B4 F#4 D4 F#4 | E4 B4 G4 B4 E5 B4 G4 B4 | C4 G4 E4 G4 C5 G4 E4 G4 | D4 A4 F#4 A4 D5 A4 F#4 A4 | B3 F#4 D#4 F#4 B4 F#4 D#4 F#4 | B3 A4 D#4 A4 B4 A4 D#4 A4 | F#4 C#5 A4 C#5 F#5 C#5 A4 C#5 | D4 A4 F#4 A4 D5 A4 F#4 A4 | E4 B4 G#4 B4 E5 B4 G#4 B4 | C#4 G#4 F4 G#4 C#5 G#4 F4 G#4 | F#4 C#5 A4 C#5 F#5 C#5 A4 C#5 | D4 A4 F#4 A4 D5 A4 F#4 A4 | E4 B4 G#4 B4 E5 B4 G#4 B4 | E4 B4 G#4 B4 E5 B4 G#4 B4 | D4 A4 F#4 A4 D5 A4 F#4 A4 | E4 B4 G#4 B4 E5 B4 G#4 B4 | C#4 G#4 E4 G#4 C#5 G#4 E4 G#4 | F#4 C#5 A4 C#5 F#5 C#5 A4 C#5 | D4 A4 F#4 A4 D5 A4 F#4 A4 | E4 B4 G#4 B4 E5 B4 G#4 B4 | C#4 G#4 F4 G#4 C#5 G#4 F4 G#4 | C#4 B4 F4 B4 C#5 B4 F4 B4' },
      { type: 'vrc6saw', gain: 0.05, notes: 'E2 E2 E3 E2 E2 E3 E2 E3 | C2 C2 C3 C2 C2 C3 C2 C3 | D2 D2 D3 D2 D2 D3 D2 D3 | B1 B2 B1 B2 B2 B1 B2 B3 | E2 E2 E3 E2 E2 E3 E2 E3 | C2 C2 C3 C2 C2 C3 C2 C3 | D2 D2 D3 D2 D2 D3 D2 D3 | D2 D3 D2 D3 D3 D2 D3 D4 | C2 C2 C3 C2 C2 C3 C2 C3 | D2 D2 D3 D2 D2 D3 D2 D3 | B1 B1 B2 B1 B1 B2 B1 B2 | E2 E3 E2 E3 E3 E2 E3 E4 | C2 C2 C3 C2 C2 C3 C2 C3 | D2 D2 D3 D2 D2 D3 D2 D3 | B1 B1 B2 B1 B1 B2 B1 B2 | B1 B2 B1 B2 B2 B1 B2 B3 | F#2 F#2 F#3 F#2 F#2 F#3 F#2 F#3 | D2 D2 D3 D2 D2 D3 D2 D3 | E2 E2 E3 E2 E2 E3 E2 E3 | C#2 C#3 C#2 C#3 C#3 C#2 C#3 C#4 | F#2 F#2 F#3 F#2 F#2 F#3 F#2 F#3 | D2 D2 D3 D2 D2 D3 D2 D3 | E2 E2 E3 E2 E2 E3 E2 E3 | E2 E3 E2 E3 E3 E2 E3 E4 | D2 D2 D3 D2 D2 D3 D2 D3 | E2 E2 E3 E2 E2 E3 E2 E3 | C#2 C#2 C#3 C#2 C#2 C#3 C#2 C#3 | F#2 F#3 F#2 F#3 F#3 F#2 F#3 F#4 | D2 D2 D3 D2 D2 D3 D2 D3 | E2 E2 E3 E2 E2 E3 E2 E3 | C#2 C#2 C#3 C#2 C#2 C#3 C#2 C#3 | C#2 C#3 C#2 C#3 C#3 C#2 C#3 C#4' },
    ],
    kickBoost: 1.2,
    drums: 'k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k s s s | k h s h k k s h | k h s h k k s h | k h s h k k s h | k k s s ks s ks s | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k s s s | k h s h k k s h | k h s h k k s h | k h s h k k s h | ks s ks s ks ks ks ks | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k s s s | k h s h k k s h | k h s h k k s h | k h s h k k s h | k k s s ks s ks s | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k s s s | k h s h k k s h | k h s h k k s h | k h s h k k s h | ks s ks s ks ks ks ks',
  },
  levelup: {
    bpm: 152,
    tracks: [
      { type: 'vrc6pulse25', gain: 0.029, notes: 'E6 = - E6 D6 C6 - A5 | C6 = D6 = E6 = - = | F6 = - F6 E6 D6 - C6 | D6 = E6 = G6 = - = | A6 = - G6 E6 = G6 = | A6 = C7 = B6 A6 G6 = | F6 = A6 = D6 = F6 = | E6 = G#6 = B6 = E7 =' },
      { type: 'vrc6pulse12', gain: 0.015, notes: 'A3+E4+A4 = - A3+E4+A4 - - A3+E4+A4 - | A3+E4+A4 = - A3+E4+A4 - - A3+E4+A4 - | F3+C4+F4 = - F3+C4+F4 - - F3+C4+F4 - | G3+D4+G4 = - G3+D4+G4 - - G3+D4+G4 - | A3+E4+A4 = - A3+E4+A4 - - A3+E4+A4 - | A3+E4+A4 = - A3+E4+A4 - - A3+E4+A4 - | D4+A4+D5 = - D4+A4+D5 - - D4+A4+D5 - | E3+B3+E4 = - E3+B3+E4 - - E3+B3+E4 -' },
      { type: 'vrc6saw', gain: 0.054, notes: 'A1 A1 A2 A1 - E2 A2 A1 | A1 A1 A2 A1 - E2 A2 A1 | F1 F1 F2 F1 - C2 F2 F1 | G1 G1 G2 G1 - D2 G2 G1 | A1 A1 A2 A1 - E2 A2 A1 | A1 A1 A2 A1 - E2 A2 A1 | D2 D2 D3 D2 - A1 D3 D2 | E1 E1 E2 E1 - B1 E2 E1' },
    ],
    kickBoost: 1.4,
    drums: 'k h s k - k s h | k h s k - k s h | k h s k - k s h | k h s k s s ks s | k h s k - k s h | k h s k - k s h | k h s k - k s h | ks s ks s ks ks ks ks',
  },
  boss: { // ボス1：高速アクションのボス戦のような、シンコペーションの連打メロディとうねるオクターブベースで疾走するハ短調の曲
    bpm: 168,
    kickBoost: 1.3,
    tracks: [
      { type: 'vrc6pulse25', gain: 0.03, notes: 'C5 C5 - C5 D#5 - C5 F5 | - F#5 G5 - F#5 F5 D#5 C5 | A#4 A#4 - A#4 C5 - A#4 D#5 | - D5 D#5 - D5 C5 A#4 G4 | C5 C5 - C5 D#5 - G5 A#5 | - B5 C6 - A#5 G5 F5 D#5 | F5 = D#5 = D5 = D#5 F5 | G5 - G5 - G5 G5 B5 D6' },
      { type: 'vrc6saw', gain: 0.016, notes: 'C4+D#4+G4 - - C4+D#4+G4 - - C4+D#4+G4 - | C4+D#4+G4 - - C4+D#4+G4 - - C4+D#4+G4 - | A#3+D4+F4 - - A#3+D4+F4 - - A#3+D4+F4 - | A#3+D4+F4 - - A#3+D4+F4 - - A#3+D4+F4 - | C4+D#4+G4 - - C4+D#4+G4 - - C4+D#4+G4 - | G#3+C4+D#4 - - G#3+C4+D#4 - - G#3+C4+D#4 - | A#3+D4+F4 - - A#3+D4+F4 - - A#3+D4+F4 - | G3+B3+D4 - - G3+B3+D4 - - G3+B3+D4 -' },
      { type: 'vrc6saw', gain: 0.045, notes: 'C2 C3 C2 C3 C2 C3 C2 C3 | C2 C3 C2 C3 C2 C3 C2 C3 | A#1 A#2 A#1 A#2 A#1 A#2 A#1 A#2 | A#1 A#2 A#1 A#2 A#1 A#2 A#1 A#2 | C2 C3 C2 C3 C2 C3 C2 C3 | G#1 G#2 G#1 G#2 G#1 G#2 G#1 G#2 | A#1 A#2 A#1 A#2 A#1 A#2 A#1 A#2 | G1 G2 G1 G2 G1 G2 F2 D2' },
    ],
    drums: 'k h s k k h s h | k h s k k h s h | k h s k k h s h | k h s k k h s h | k h s k k h s h | k h s k k h s h | k h s k k h s h | s s s s ks ks ks ks',
  },

  boss9: { // ボス9 刑事の追及：弾むピチカートのベースとブラスの合いの手、ずる賢く忍び寄る旋律が後半で劇的に盛り上がる（古畑任三郎系のサスペンス劇伴）
    bpm: 136,
    echo: { time: 0.22, feedback: 0.18, wet: 0.13 },
    tracks: [
      { type: 'vrc7lead', gain: 0.046, notes: 'D5 - F5 - A5 = G5 F5 | E5 - F5 - D5 = = - | D5 - F5 - A#5 = A5 G5 | A5 = G5 = F5 = E5 C#5 | D5 - A5 - D6 = C6 A#5 | A5 - G5 - D5 = = - | G#5 = B5 = D6 = C6 B5 | C#6 = = = A5 - - - | A#5 = = = A5 = G5 = | F5 = = = A5 = D6 = | D6 = = = C6 = A#5 = | A5 = = = E6 = C#6 = | G6 = = = F6 = E6 = | F6 = = = D6 = A5 = | G5 = A#5 = D#6 = G6 = | E6 = C#6 = A5 = - -' },
      { type: 'vrc6pulse12', gain: 0.011, notes: 'D5 F5 A5 D6 A5 F5 D5 F5 | D5 F5 A5 D6 A5 F5 D5 F5 | A#4 D5 F5 A#5 F5 D5 A#4 D5 | A4 C#5 E5 G5 E5 C#5 A4 C#5 | D5 F5 A5 D6 A5 F5 D5 F5 | G4 A#4 D5 G5 D5 A#4 G4 A#4 | E5 G#5 B5 D6 B5 G#5 E5 G#5 | A4 C#5 E5 A5 E5 C#5 A4 C#5 | G4 A#4 D5 G5 D5 A#4 G4 A#4 | D5 F5 A5 D6 A5 F5 D5 F5 | A#4 D5 F5 A#5 F5 D5 A#4 D5 | A4 C#5 E5 A5 E5 C#5 A4 C#5 | G4 A#4 D5 G5 D5 A#4 G4 A#4 | D5 F5 A5 D6 A5 F5 D5 F5 | D#5 G5 A#5 D#6 A#5 G5 D#5 G5 | A4 C#5 E5 A5 E5 C#5 A4 C#5' },
      { type: 'vrc7brass', gain: 0.034, notes: 'D4+F4+A4 - - D4+F4+A4 - - - - | D4+F4+A4 - - D4+F4+A4 - - - - | A#3+D4+F4 - - A#3+D4+F4 - - - - | A3+C#4+E4 - - A3+C#4+E4 - A3+C#4+E4 A3+C#4+E4 - | D4+F4+A4 - - D4+F4+A4 - - - - | G3+A#3+D4 - - G3+A#3+D4 - - - - | E4+G#4+B4 - - E4+G#4+B4 - - - - | A3+C#4+E4 - - A3+C#4+E4 - A3+C#4+E4 A3+C#4+E4 - | G3+A#3+D4 - - G3+A#3+D4 - - - - | D4+F4+A4 - - D4+F4+A4 - - - - | A#3+D4+F4 - - A#3+D4+F4 - - - - | A3+C#4+E4 - - A3+C#4+E4 - A3+C#4+E4 A3+C#4+E4 - | G3+A#3+D4 - - G3+A#3+D4 - - - - | D4+F4+A4 - - D4+F4+A4 - - - - | D#4+G4+A#4 - - D#4+G4+A#4 - - - - | A3+C#4+E4 - - A3+C#4+E4 - A3+C#4+E4 A3+C#4+E4 -' },
      { type: 'vrc7bass', gain: 0.075, notes: 'D2 - A2 - D3 - A2 - | D2 - A2 - D3 - A2 - | A#2 - F3 - A#3 - F3 - | A2 - E3 - A3 - E3 - | D2 - A2 - D3 - A2 - | G2 - D3 - G3 - D3 - | E2 - B2 - E3 - B2 - | A2 - E3 - A3 - E3 - | G2 - D3 - G3 - D3 - | D2 - A2 - D3 - A2 - | A#2 - F3 - A#3 - F3 - | A2 - E3 - A3 - E3 - | G2 - D3 - G3 - D3 - | D2 - A2 - D3 - A2 - | D#2 - A#2 - D#3 - A#2 - | A2 - E3 - A3 - E3 -' },
    ],
    kickBoost: 1.1,
    drums: 'k - s - k k s - | k - s - k k s - | k - s - k k s - | k - s - k s s s | k - s - k k s - | k - s - k k s - | k - s - k k s - | s s s s ks - ks - | k - s - k k s - | k - s - k k s - | k - s - k k s - | k - s - k s s s | k - s - k k s - | k - s - k k s - | k - s - k k s - | ks s s s ks ks ks ks'
  },
  boss11: { // ボス10 世紀末の死闘：刻むパワーコードと唸るベースに、熱く歌い上げる旋律（80年代アニメのヒーローロック）
    bpm: 158,
    tracks: [
      { type: 'vrc6pulse25', gain: 0.032, notes: 'E5 = = G5 F#5 = E5 D5 | E5 = = = - - B4 D5 | F#5 = = A5 G5 = F#5 E5 | E5 = = = = = - - | B5 = = A5 G5 = A5 B5 | C6 = B5 A5 G5 = E5 G5 | A5 = = B5 A5 = F#5 D5 | D#5 = F#5 = B5 = A5 F#5 | G5 = = G5 A5 = B5 = | A5 = = F#5 D5 = E5 F#5 | B5 = = A5 F#5 = D5 F#5 | G5 = = = E5 = = = | E6 = = D6 C6 = B5 C6 | D6 = = C6 B5 = A5 F#5 | G#5 = = B5 E6 = = = | D6 = C6 = B5 = G#5 B5' },
      { type: 'vrc6pulse12', gain: 0.012, notes: 'E4+G4+B4 = = = = = = - | C4+E4+G4 = = = = = = - | D4+F#4+A4 = = = = = = - | E4+G4+B4 = = = = = = - | E4+G4+B4 = = = = = = - | C4+E4+G4 = = = = = = - | D4+F#4+A4 = = = = = = - | D#4+F#4+B4 = = = = = = - | C4+E4+G4 = = = = = = - | D4+F#4+A4 = = = = = = - | D4+F#4+B4 = = = = = = - | E4+G4+B4 = = = = = = - | C4+E4+G4 = = = = = = - | D4+F#4+A4 = = = = = = - | E4+G#4+B4 = = = = = = - | E4+G#4+B4 = = = = = = -' },
      { type: 'pcebrass', gain: 0.03, notes: 'E3+B3 E3+B3 - E3+B3 E3+B3 - E3+B3 E3+B3 | C3+G3 C3+G3 - C3+G3 C3+G3 - C3+G3 C3+G3 | D3+A3 D3+A3 - D3+A3 D3+A3 - D3+A3 D3+A3 | E3+B3 E3+B3 - E3+B3 E3+B3 - E3+B3 E3+B3 | E3+B3 E3+B3 - E3+B3 E3+B3 - E3+B3 E3+B3 | C3+G3 C3+G3 - C3+G3 C3+G3 - C3+G3 C3+G3 | D3+A3 D3+A3 - D3+A3 D3+A3 - D3+A3 D3+A3 | B2+F#3 = B2+F#3 = B2+F#3 B2+F#3 B2+F#3 B2+F#3 | C3+G3 C3+G3 - C3+G3 C3+G3 - C3+G3 C3+G3 | D3+A3 D3+A3 - D3+A3 D3+A3 - D3+A3 D3+A3 | B2+F#3 B2+F#3 - B2+F#3 B2+F#3 - B2+F#3 B2+F#3 | E3+B3 E3+B3 - E3+B3 E3+B3 - E3+B3 E3+B3 | C3+G3 C3+G3 - C3+G3 C3+G3 - C3+G3 C3+G3 | D3+A3 D3+A3 - D3+A3 D3+A3 - D3+A3 D3+A3 | E3+B3 E3+B3 - E3+B3 E3+B3 - E3+B3 E3+B3 | E3+B3 = E3+B3 = E3+B3 E3+B3 E3+B3 E3+B3' },
      { type: 'vrc6saw', gain: 0.05, notes: 'E2 E2 E3 E2 E2 E2 E3 E2 | C2 C2 C3 C2 C2 C2 C3 C2 | D2 D2 D3 D2 D2 D2 D3 D2 | E2 E2 E3 E2 E2 E2 E3 E2 | E2 E2 E3 E2 E2 E2 E3 E2 | C2 C2 C3 C2 C2 C2 C3 C2 | D2 D2 D3 D2 D2 D2 D3 D2 | B1 B1 B2 B1 B1 B1 B2 B1 | C2 C2 C3 C2 C2 C2 C3 C2 | D2 D2 D3 D2 D2 D2 D3 D2 | B1 B1 B2 B1 B1 B1 B2 B1 | E2 E2 E3 E2 E2 E2 E3 E2 | C2 C2 C3 C2 C2 C2 C3 C2 | D2 D2 D3 D2 D2 D2 D3 D2 | E2 E2 E3 E2 E2 E2 E3 E2 | E2 E2 E3 E2 E2 E2 E3 E2' },
    ],
    kickBoost: 1.4,
    drums: 'k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k s s s ks ks ks ks | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k s s s ks ks ks ks'
  },
  boss8: {
    bpm: 178,
    tracks: [
      { type: 'vrc6pulse25', gain: 0.03, notes: 'A5 = C6 = E6 = D6 C6 | B5 = = = E5 = G#5 = | A5 = C6 = E6 = A6 G6 | F#6 = = = D#6 = C6 = | C6 = F6 = A6 = G6 F6 | E6 = = = G#5 = B5 = | A5 B5 C6 D6 E6 = C6 = | B5 = G#5 = E5 = D6 = | D6 = F6 = A6 = G6 F6 | E6 = C6 = A5 = = = | F6 = D6 = A#5 = D6 F6 | E6 = G#6 = B6 = = = | A6 = G6 F6 D6 = F6 = | E6 = D6 C6 A5 = C6 = | D6 = A#5 = F5 = A#5 D6 | E6 = = = G#6 = B6 =' },
      { type: 'vrc6pulse12', gain: 0.013, notes: 'A3 C4 E4 A4 E4 C4 A3 C4 | G#3 C4 E4 G#4 E4 C4 G#3 C4 | G3 C4 E4 G4 E4 C4 G3 C4 | F#3 A3 D#4 F#4 D#4 A3 F#3 A3 | F3 A3 C4 F4 C4 A3 F3 A3 | E3 G#3 B3 E4 B3 G#3 E3 G#3 | A3 C4 E4 A4 E4 C4 A3 C4 | E3 G#3 D4 E4 D4 G#3 E3 G#3 | D4 F4 A4 D5 A4 F4 D4 F4 | A3 C4 E4 A4 E4 C4 A3 C4 | A#3 D4 F4 A#4 F4 D4 A#3 D4 | E3 G#3 B3 E4 B3 G#3 E3 G#3 | D4 F4 A4 D5 A4 F4 D4 F4 | A3 C4 E4 A4 E4 C4 A3 C4 | A#3 D4 F4 A#4 F4 D4 A#3 D4 | E3 G#3 B3 E4 B3 G#3 E3 G#3' },
      { type: 'vrc6saw', gain: 0.052, notes: 'A1 A2 A1 A2 A1 A2 A1 A2 | G#1 G#2 G#1 G#2 G#1 G#2 G#1 G#2 | G1 G2 G1 G2 G1 G2 G1 G2 | F#1 F#2 F#1 F#2 F#1 F#2 F#1 F#2 | F1 F2 F1 F2 F1 F2 F1 F2 | E1 E2 E1 E2 E1 E2 E1 E2 | A1 A2 A1 A2 A1 A2 A1 A2 | E1 E2 E1 E2 E1 E2 E1 E2 | D2 D3 D2 D3 D2 D3 D2 D3 | A1 A2 A1 A2 A1 A2 A1 A2 | A#1 A#2 A#1 A#2 A#1 A#2 A#1 A#2 | E1 E2 E1 E2 E1 E2 E1 E2 | D2 D3 D2 D3 D2 D3 D2 D3 | A1 A2 A1 A2 A1 A2 A1 A2 | A#1 A#2 A#1 A#2 A#1 A#2 A#1 A#2 | E1 E2 F1 F2 F#1 F#2 G#1 G#2' },
    ],
    kickBoost: 1.4,
    drums: 'k k s h k k s k | k k s h k k s k | k k s h k k s k | k k s h k k s k | k k s h k k s k | k k s h k k s k | k k s h k k s k | k s k s ks s ks ks | k k s h k k s k | k k s h k k s k | k k s h k k s k | k k s h k k s k | k k s h k k s k | k k s h k k s k | k k s h k k s k | ks ks ks ks s s s s',
  },

  tboss1: {
    bpm: 168,
    tracks: [
      { type: 'vrc6pulse25', gain: 0.032, notes: 'D6 = A5 = F5 = D5 = | C#6 = E6 = G6 = = = | F6 = E6 D6 C#6 D6 E6 F6 | E6 = = = A5 = = = | D6 = F6 = A#6 = A6 G6 | G6 = D6 = A#5 = G5 = | G#5 = B5 = D6 = E6 = | C#6 = D6 = E6 = A5 =' },
      { type: 'vrc6pulse12', gain: 0.02, notes: 'D5 A4 F4 A4 D5 A4 F4 A4 | C#5 G4 E4 G4 C#5 G4 E4 G4 | D5 A4 F4 A4 D5 A4 F4 A4 | C#5 A4 E4 A4 C#5 A4 E4 A4 | D5 A#4 F4 A#4 D5 A#4 F4 A#4 | D5 A#4 G4 A#4 D5 A#4 G4 A#4 | D5 B4 G#4 B4 D5 B4 G#4 B4 | C#5 A4 E4 A4 C#5 E5 G5 A5' },
      { type: 'vrc6saw', gain: 0.05, notes: 'D2 D3 D2 D3 D2 D3 D2 D3 | C#2 C#3 C#2 C#3 C#2 C#3 C#2 C#3 | D2 D3 D2 D3 C2 C3 C2 C3 | A1 A2 A1 A2 A1 A2 A1 A2 | A#1 A#2 A#1 A#2 A#1 A#2 A#1 A#2 | G1 G2 G1 G2 G1 G2 G1 G2 | E2 E3 E2 E3 E2 E3 E2 E3 | A1 A2 A1 A2 A1 A2 C#2 E2' },
    ],
    kickBoost: 1.3,
    drums: 'k h s h k h s h | k h s h k h s h | k h s h k h s h | k h s h k k s s | k h s h k h s h | k h s h k h s h | k h s h k h s h | k k s s ks ks ks ks',
  },
  tboss3: {
    bpm: 176,
    tracks: [
      { type: 'vrc6pulse25', gain: 0.03, notes: 'E5 = G5 = B5 = E6 = | D6 = C6 = B5 = G5 = | A5 = = C6 = B5 A5 G5 | F#5 = D#5 = B4 = = = | E6 = D6 = B5 = G5 A5 | G5 = E5 = C6 = E6 = | F#6 = E6 = D6 = A5 = | B5 = A5 G5 F#5 = D#5 =' },
      { type: 'vrc6pulse12', gain: 0.019, notes: 'E4 B4 E5 B4 G4 B4 E5 B4 | C4 G4 C5 G4 E4 G4 C5 G4 | A3 E4 A4 E4 C4 E4 A4 E4 | B3 F#4 B4 F#4 D#4 F#4 B4 F#4 | E4 B4 E5 B4 G4 B4 E5 B4 | C4 G4 C5 G4 E4 G4 C5 G4 | D4 A4 D5 A4 F#4 A4 D5 A4 | B3 F#4 B4 F#4 D#4 F#4 A4 B4' },
      { type: 'vrc6saw', gain: 0.05, notes: 'E2 E2 E3 E2 E2 E2 E3 E2 | C2 C2 C3 C2 C2 C2 C3 C2 | A1 A1 A2 A1 A1 A1 A2 A1 | B1 B1 B2 B1 B1 B1 B2 B1 | E2 E2 E3 E2 E2 E2 E3 E2 | C2 C2 C3 C2 C2 C2 C3 C2 | D2 D2 D3 D2 D2 D2 D3 D2 | B1 B1 B2 B1 D#2 F#2 A2 B2' },
    ],
    kickBoost: 1.2,
    drums: 'k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s s | k h s h k k s h | k h s h k k s h | k h s h k k s h | k k s s ks ks ks ks',
  },
  boss2: {
    bpm: 170,
    tracks: [
      { type: 'sawtooth', gain: 0.032, notes: 'C5 = D#5 = G5 = - F5 | D#5 = D5 = C5 = G4 = | G#4 = C5 = D#5 = G#5 = | A#5 = = G5 F5 = D5 = | C6 = = A#5 G5 = D#5 = | F5 D#5 D5 = C5 = G4 = | C#5 = F5 = G#5 = C#6 = | B5 = = = G5 = D5 =' },
      { type: 'square', gain: 0.05, notes: 'C2 = C3 C2 = C3 A#2 C3 | C2 = C3 C2 = C3 D#3 G2 | G#2 = G#3 G#2 = G#3 G2 G#2 | A#2 = A#3 A#2 = A#3 D3 F3 | C2 = C3 C2 = C3 A#2 C3 | C2 = C3 C2 = C3 D#3 G2 | C#3 = C#4 C#3 = C#4 C3 C#3 | G2 = G3 G2 = G3 B2 D3' },
      { type: 'triangle', gain: 0.022, notes: 'C4+D#4+G4 = = = = = = = | C4+D#4+G4 = = = = = = = | G#3+C4+D#4 = = = = = = = | A#3+D4+F4 = = = = = = = | C4+D#4+G4 = = = = = = = | C4+D#4+G4 = = = = = = = | C#4+F4+G#4 = = = = = = = | G3+B3+D4 = = = = = = =' },
    ],
    drums: 'k h s k h k s h | k h s k h k s h | k h s k h k s h | k h s k h k s s | k h s k h k s h | k h s k h k s h | k h s k h k s h | k s k s ks ks ks ks',
  },
  boss3: {
    bpm: 184,
    tracks: [
      { type: 'square', gain: 0.04, notes: 'E5 = B4 = E5 F5 G5 = | F5 = = E5 C5 = A4 = | B4 = E5 = G5 A5 B5 = | A5 = F#5 = D5 = A4 = | E5 = G5 = B5 = E6 = | F6 = E6 = C6 = A5 = | B5 = D6 = G5 = B5 = | D#6 = = = B5 = F#5 =' },
      { type: 'triangle', gain: 0.11, notes: 'E2 E3 E2 E3 E2 E3 D3 E3 | F2 F3 F2 F3 F2 F3 E3 F3 | E2 E3 E2 E3 E2 E3 G3 E3 | D3 D4 D3 D4 D3 D4 C4 A3 | E2 E3 E2 E3 E2 E3 D3 E3 | F2 F3 F2 F3 F2 F3 E3 F3 | G2 G3 G2 G3 G2 G3 A3 B3 | B2 B3 B2 B3 D#3 F#3 A3 B3' },
      { type: 'triangle', gain: 0.02, notes: 'E4+G4+B4 = = = = = = = | F4+A4+C5 = = = = = = = | E4+G4+B4 = = = = = = = | D4+F#4+A4 = = = = = = = | E4+G4+B4 = = = = = = = | F4+A4+C5 = = = = = = = | G3+B3+D4 = = = = = = = | B3+D#4+F#4 = = = = = = =' },
    ],
    drums: 'kh h s h kh h s h | kh h s h kh h s h | kh h s h kh h s h | kh h s h kh kh s s | kh h s h kh h s h | kh h s h kh h s h | kh h s h kh h s h | s s s s ks ks ks ks',
  },
  boss5: {
    bpm: 176,
    tracks: [
      { type: 'square', gain: 0.042, notes: 'F#5 = = B5 A5 = F#5 = | G5 = D5 = B4 = D5 = | E5 = A5 = C#6 = A5 = | A#5 = = = F#5 = C#5 = | D5 = F#5 = B5 = D6 = | D6 = C#6 B5 = G5 = D5 | E5 = G5 = F#5 = A#5 = | B5 = = = F#5 = B4 =' },
      { type: 'triangle', gain: 0.11, notes: 'B2 B3 B2 B3 B2 B3 A3 B3 | G2 G3 G2 G3 G2 G3 F#3 G3 | A2 A3 A2 A3 A2 A3 G3 A3 | F#2 F#3 F#2 F#3 A#2 A#3 C#3 C#4 | B2 B3 B2 B3 B2 B3 D3 F#3 | G2 G3 G2 G3 B2 B3 D3 G3 | E2 E3 E2 E3 F#2 F#3 F#2 F#3 | B2 B3 B2 B3 F#2 F#3 A#2 A#3' },
      { type: 'triangle', gain: 0.02, notes: 'B3+D4+F#4 = = = = = = = | B3+D4+G4 = = = = = = = | A3+C#4+E4 = = = = = = = | F#3+A#3+C#4 = = = = = = = | B3+D4+F#4 = = = = = = = | B3+D4+G4 = = = = = = = | E4+G4+B4 = = = F#3+A#3+C#4 = = = | B3+D4+F#4 = = = = = = =' },
    ],
    drums: 'kh h sh h kh kh sh h | kh h sh h kh kh sh h | kh h sh h kh kh sh h | kh h sh h kh kh sh sh | kh h sh h kh kh sh h | kh h sh h kh kh sh h | kh h sh h kh kh sh h | s s s s ks ks ks ks',
  },
  boss6: {
    bpm: 188,
    tracks: [
      { type: 'sawtooth', gain: 0.032, notes: 'E5 = B4 = G5 = F#5 E5 | D#5 = E5 = F#5 = G5 A5 | G5 = E5 = C5 = E5 G5 | F#5 = = = D#5 = B4 = | A5 = C6 = B5 A5 G5 = | B5 = G5 = E5 = G5 B5 | C6 = A5 = F5 = A5 C6 | B5 = A5 = G5 = F#5 D#5' },
      { type: 'square', gain: 0.048, notes: 'E2 E3 E2 E3 E2 E3 E2 E3 | E2 E3 E2 E3 D#2 D#3 D#2 D#3 | C2 C3 C2 C3 C2 C3 C2 C3 | B2 B3 B2 B3 B2 B3 B2 B3 | A2 A3 A2 A3 A2 A3 A2 A3 | E2 E3 E2 E3 G2 G3 E2 E3 | F2 F3 F2 F3 F2 F3 F2 F3 | B2 B3 A2 A3 G2 G3 F#2 F#3' },
      { type: 'triangle', gain: 0.024, notes: 'E4+G4+B4 = = = = = = = | E4+G4+B4 = = = D#4+F#4+B4 = = = | C4+E4+G4 = = = = = = = | B3+D#4+F#4 = = = = = = = | A3+C4+E4 = = = = = = = | E4+G4+B4 = = = = = = = | F4+A4+C5 = = = = = = = | B3+D#4+F#4+A4 = = = = = = =' },
    ],
    drums: 'kh h s h kh h s h | kh h s h kh h s h | kh h s h kh h s h | kh h s h kh kh s s | kh h s h kh h s h | kh h s h kh h s h | kh h s h kh h s h | s s s s ks ks ks ks',
  },
  upgrade: { // 古典RPG（ダンジョン探索）のバロック風旋律を音ゲー風にアレンジ：チェンバロ調の分散和音の主旋律＋対旋律、五度圏の進行、四つ打ちのビート（ニ短調）
    bpm: 140,
    tracks: [
      { type: 'vrc6pulse25', gain: 0.03, notes: 'D5 E5 F5 D5 A5 F5 D5 A4 | G5 A5 A#5 G5 D6 A#5 G5 D5 | E5 F5 G5 E5 C6 G5 E5 C5 | F5 G5 A5 F5 C6 A5 F5 C5 | D6 C6 A#5 A5 G5 F5 E5 D5 | E5 F5 G5 A#5 A5 G5 F5 E5 | C#5 D5 E5 G5 F5 E5 D5 C#5 | D5 = A4 = D5 = = =' },
      { type: 'vrc6pulse12', gain: 0.02, notes: 'A4 = F4 = D4 = F4 = | A#4 = G4 = D4 = G4 = | C5 = G4 = E4 = G4 = | C5 = A4 = F4 = A4 = | A#4 = F4 = D4 = F4 = | A#4 = G4 = D4 = G4 = | A4 = E4 = C#4 = E4 = | F4 = D4 = A3 = D4 =' },
      { type: 'vrc6saw', gain: 0.05, notes: 'D2 D3 D2 D3 D2 D3 C2 C3 | G1 G2 G1 G2 G1 G2 A1 A2 | C2 C3 C2 C3 C2 C3 B1 B2 | F1 F2 F1 F2 F1 F2 E1 E2 | A#1 A#2 A#1 A#2 A#1 A#2 A1 A2 | G1 G2 G1 G2 G1 G2 G1 G2 | A1 A2 A1 A2 A1 A2 C#2 E2 | D2 D3 D2 D3 A1 A2 D2 =' },
    ],
    drums: 'k h s h k h s h | k h s h k h s h | k h s h k h s h | k h s h k h s s | k h s h k h s h | k h s h k h s h | k h s h k h s h | k k s s ks ks ks ks',
  },
  companion: {
    bpm: 140,
    tracks: [
      { type: 'vrc6pulse25', gain: 0.03, notes: 'B5 = A5 B5 D6 = B5 = | C#6 = B5 A5 E5 = A5 = | A5 = G5 F#5 C#6 = A5 = | B5 = = = F#5 = D6 = | D6 = C#6 B5 G5 = B5 D6 | E6 = D6 C#6 A5 = C#6 E6 | F#6 = E6 D6 A5 = F#5 A5 | E6 = = = C#6 = A5 =' },
      { type: 'vrc6pulse12', gain: 0.022, notes: 'G4 B4 D5 B4 G4 B4 D5 B4 | A4 C#5 E5 C#5 A4 C#5 E5 C#5 | F#4 A4 C#5 A4 F#4 A4 C#5 A4 | F#4 B4 D5 B4 F#4 B4 D5 B4 | G4 B4 D5 B4 G4 B4 D5 B4 | A4 C#5 E5 C#5 A4 C#5 E5 C#5 | F#4 A4 D5 A4 F#4 A4 D5 A4 | E4 A4 C#5 A4 E4 A4 C#5 A4' },
      { type: 'vrc6saw', gain: 0.05, notes: 'G2 = G3 = G2 G2 G3 = | A2 = A3 = A2 A2 A3 = | F#2 = F#3 = F#2 F#2 F#3 = | B1 = B2 = B1 B1 B2 = | G2 = G3 = G2 G2 G3 = | A2 = A3 = A2 A2 A3 = | D2 = D3 = D2 D2 D3 = | A2 = A3 = G2 = E2 =' },
    ],
    drums: 'k h s h k h s h | k h s h k h s h | k h s h k h s h | k h s h k h s h | k h s h k h s h | k h s h k h s h | k h s h k h s h | k h s h s s ks ks',
  },
  coinshop: { // スキル画面：シューティングの装備選択画面のような、出撃前の高揚感あふれるSF風チップチューン（ホ短調・BPM152）
    bpm: 152,
    tracks: [
      { type: 'vrc6pulse25', gain: 0.028, notes: 'E5 = B5 = A5 = G5 F#5 | G5 = = = E5 = D5 = | E5 = B5 = C6 = D6 C6 | B5 = = = = = - - | C6 = B5 = A5 = G5 A5 | B5 = G5 = E5 = D5 E5 | F#5 = A5 = D6 = C6 A5 | B5 = D#6 = F#6 = B5 =' },
      { type: 'vrc6pulse12', gain: 0.013, notes: 'E4+G4+B4 - E4+G4+B4 E4+G4+B4 - E4+G4+B4 - E4+G4+B4 | E4+G4+B4 - E4+G4+B4 E4+G4+B4 - E4+G4+B4 - E4+G4+B4 | C4+E4+G4 - C4+E4+G4 C4+E4+G4 - C4+E4+G4 - C4+E4+G4 | D4+F#4+A4 - D4+F#4+A4 D4+F#4+A4 - D4+F#4+A4 - D4+F#4+A4 | A3+C4+E4 - A3+C4+E4 A3+C4+E4 - A3+C4+E4 - A3+C4+E4 | E4+G4+B4 - E4+G4+B4 E4+G4+B4 - E4+G4+B4 - E4+G4+B4 | D4+F#4+A4 - D4+F#4+A4 D4+F#4+A4 - D4+F#4+A4 - D4+F#4+A4 | B3+D#4+F#4 - B3+D#4+F#4 B3+D#4+F#4 - B3+D#4+F#4 - B3+D#4+F#4' },
      { type: 'vrc6saw', gain: 0.042, notes: 'E2 E2 E3 E2 E2 E3 E2 E3 | E2 E2 E3 E2 E2 E3 E2 E3 | C2 C2 C3 C2 C2 C3 C2 C3 | D2 D2 D3 D2 D2 D3 D2 D3 | A1 A1 A2 A1 A1 A2 A1 A2 | E2 E2 E3 E2 E2 E3 E2 E3 | D2 D2 D3 D2 D2 D3 D2 D3 | B1 B1 B2 B1 B1 B2 B1 B2' },
    ],
    drums: 'k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k k s k s s ks ks',
  },


  artifact: {
    bpm: 126,
    tracks: [
      { type: 'vrc6pulse25', gain: 0.03, notes: 'A5 - F5 - D5 = E5 F5 | G5 - A#5 - D6 = C6 A#5 | A5 - G5 - E5 = F5 G5 | A5 = = = C5 = = = | D5 - F5 - A#5 = A5 G5 | G5 - F5 - D5 = E5 F5 | E5 - G5 - A#5 = A5 G5 | C#5 = = = E5 = A4 =' },
      { type: 'vrc6pulse12', gain: 0.02, notes: 'D4 F4 A4 F4 D4 F4 A4 F4 | D4 G4 A#4 G4 D4 G4 A#4 G4 | E4 G4 C5 G4 E4 G4 C5 G4 | F4 A4 C5 A4 F4 A4 C5 A4 | D4 F4 A#4 F4 D4 F4 A#4 F4 | D4 G4 A#4 G4 D4 G4 A#4 G4 | E4 G4 A#4 G4 E4 G4 A#4 G4 | C#4 E4 G4 E4 C#4 E4 G4 E4' },
      { type: 'vrc6saw', gain: 0.05, notes: 'D2 - A2 - D2 - A2 - | G2 - D3 - G2 - D3 - | C2 - G2 - C2 - G2 - | F2 - C3 - F2 - C3 - | A#1 - F2 - A#1 - F2 - | G2 - D3 - G2 - D3 - | A1 - E2 - G2 - A#2 - | A1 - C#2 - E2 - G2 -' },
    ],
    drums: 'k - h - - - h - | k - h - - - h - | k - h - - - h - | k - h - - - h - | k - h - - - h - | k - h - - - h - | k - h - - - h - | k - h - s - h h',
  },
  gemshop: { // ショップ画面：冒険者が集う酒場のような、跳ねるシャッフルのリズムとウォーキングベースに、アコーディオン風の陽気で懐かしい旋律が乗る曲（ヘ長調・1小節12ステップ＝3連のシャッフル）
    bpm: 168,
    echo: { time: 0.22, feedback: 0.18, wet: 0.16 },
    tracks: [
      { type: 'vrc6pulse25', gain: 0.026, notes: 'A4 = C5 F5 = A5 G5 = F5 E5 = F5 | D5 = = = = = - - D5 F5 = A5 | A#5 = A5 G5 = F5 D5 = = F5 = G5 | E5 = = = = = - - C5 E5 = G5 | A5 = = C6 = A5 G5 = F5 A5 = C6 | D#6 = = D6 = C6 A5 = = - - - | D6 = = = = C6 A#5 = A5 G5 = F5 | F5 = = C#5 = = A#4 = = - - - | C5 = E5 A5 = = G5 = E5 C5 = E5 | F#5 = = = = = A5 = = C6 = = | A#5 = = A5 = G5 F5 = D5 F5 = A#5 | A5 = = G5 = = E5 = = C5 = = | D5 = F5 A#5 = = A5 = F5 D5 = = | E5 = G5 C6 = = A#5 = G5 E5 = = | F5 = = = = = A5 = = C6 = = | A#5 = = G5 = = E5 = = C5 = =' },
      { type: 'vrc6pulse12', gain: 0.012, notes: 'A3 = C4 F4 = A4 G4 = F4 E4 = F4 | D4 = = = = = - - D4 F4 = A4 | A#4 = A4 G4 = F4 D4 = = F4 = G4 | E4 = = = = = - - C4 E4 = G4 | A4 = = C5 = A4 G4 = F4 A4 = C5 | D#5 = = D5 = C5 A4 = = - - - | D5 = = = = C5 A#4 = A4 G4 = F4 | F4 = = C#4 = = A#3 = = - - - | C4 = E4 A4 = = G4 = E4 C4 = E4 | F#4 = = = = = A4 = = C5 = = | A#4 = = A4 = G4 F4 = D4 F4 = A#4 | A4 = = G4 = = E4 = = C4 = = | D4 = F4 A#4 = = A4 = F4 D4 = = | E4 = G4 C5 = = A#4 = G4 E4 = = | F4 = = = = = A4 = = C5 = = | A#4 = = G4 = = E4 = = C4 = =' },
      { type: 'fmep', gain: 0.016, notes: '- - - A3+C4+F4 = - - - - A3+C4+F4 = A3+C4+F4 | - - - A3+D4+F4 = - - - - A3+D4+F4 = A3+D4+F4 | - - - A#3+D4+F4 = - - - - A#3+D4+F4 = A#3+D4+F4 | - - - A#3+E4+G4 = - - - - A#3+E4+G4 = A#3+E4+G4 | - - - A3+C4+F4 = - - - - A3+C4+F4 = A3+C4+F4 | - - - A3+C4+D#4 = - - - - A3+C4+D#4 = A3+C4+D#4 | - - - A#3+D4+F4 = - - - - A#3+D4+F4 = A#3+D4+F4 | - - - A#3+C#4+F4 = - - - - A#3+C#4+F4 = A#3+C#4+F4 | - - - A3+C4+E4 = - - - - A3+C4+E4 = A3+C4+E4 | - - - A3+C4+F#4 = - - - - A3+C4+F#4 = A3+C4+F#4 | - - - A#3+D4+F4 = - - - - A#3+D4+F4 = A#3+D4+F4 | - - - A#3+E4+G4 = - - - - A#3+E4+G4 = A#3+E4+G4 | - - - A#3+D4+F4 = - - - - A#3+D4+F4 = A#3+D4+F4 | - - - A#3+E4+G4 = - - - - A#3+E4+G4 = A#3+E4+G4 | - - - A3+C4+F4 = - - - - A3+C4+F4 = A3+C4+F4 | - - - A#3+E4+G4 = - - - - A#3+E4+G4 = A#3+E4+G4' },
      { type: 'triangle', gain: 0.11, notes: 'F2 = - A2 = - C3 = - C#3 = - | D2 = - F2 = - A2 = - F#2 = - | G2 = - A#2 = - D3 = - B2 = - | C2 = - E2 = - G2 = - E2 = - | F2 = - A2 = - C3 = - A2 = - | F2 = - A2 = - C3 = - D#3 = - | A#1 = - D2 = - F2 = - D2 = - | A#1 = - C#2 = - F2 = - E2 = - | A1 = - C2 = - E2 = - C#2 = - | D2 = - F#2 = - A2 = - F#2 = - | G1 = - A#1 = - D2 = - B1 = - | C2 = - E2 = - G2 = - E2 = - | A#1 = - D2 = - F2 = - D2 = - | C2 = - E2 = - G2 = - E2 = - | F2 = - A2 = - C3 = - A2 = - | C2 = - E2 = - G2 = - E2 = -' },
    ],
    drums: 'k - h s - h k - h s - h | k - h s - h k - h s - h | k - h s - h k - h s - h | k - h s - h k - h s - h | k - h s - h k - h s - h | k - h s - h k - h s - h | k - h s - h k - h s - h | k - h s - h k - h s s s | k - h s - h k - h s - h | k - h s - h k - h s - h | k - h s - h k - h s - h | k - h s - h k - h s - h | k - h s - h k - h s - h | k - h s - h k - h s - h | k - h s - h k - h s - h | k - h s - h k s s s s s',
  },
  tower: {
    bpm: 140,
    tracks: [
      { type: 'vrc6pulse25', gain: 0.03, notes: 'A4 = C5 = E5 = D#5 E5 | F5 = E5 = C5 = A4 = | D5 = F5 = A5 = G#5 A5 | B5 = G#5 = E5 = = = | C6 = B5 = A5 = E5 = | F5 = A5 = C6 = D6 C6 | B5 = D6 = G5 = B5 D6 | E6 = D6 = B5 = G#5 =' },
      { type: 'vrc6pulse12', gain: 0.019, notes: 'A4 C5 E5 C5 A4 C5 E5 C5 | F4 A4 C5 A4 F4 A4 C5 A4 | D4 F4 A4 F4 D4 F4 A4 F4 | E4 G#4 B4 G#4 E4 G#4 B4 D5 | A4 C5 E5 C5 A4 C5 E5 C5 | F4 A4 C5 A4 F4 A4 C5 A4 | G4 B4 D5 B4 G4 B4 D5 B4 | E4 G#4 B4 D5 E5 D5 B4 G#4' },
      { type: 'vrc6saw', gain: 0.05, notes: 'A1 A1 A2 A1 A1 A1 A2 A1 | F1 F1 F2 F1 F1 F1 F2 F1 | D2 D2 D3 D2 D2 D2 D3 D2 | E2 E2 E3 E2 E2 E2 E3 E2 | A1 A1 A2 A1 A1 A1 A2 A1 | F1 F1 F2 F1 F1 F1 F2 F1 | G1 G1 G2 G1 G1 G1 G2 G1 | E2 E2 E3 E2 E2 E3 G#2 B2' },
    ],
    kickBoost: 1.1,
    drums: 'k - s - k k s - | k - s - k k s - | k - s - k k s - | k - s - k k s s | k - s - k k s - | k - s - k k s - | k - s - k k s - | k k s s ks ks ks ks',
  },
  gacha: {
    bpm: 144,
    tracks: [
      { type: 'square', gain: 0.03, notes: 'B4 = D5 = F#5 = B5 = | B5 = A5 = G5 = D5 = | E5 = A5 = C#6 = A5 = | A#5 = = = F#5 = C#5 = | D5 = F#5 = B5 = D6 = | D6 = C#6 = B5 = G5 = | G5 = B5 = E6 = D6 C#6 | C#6 = = = A#5 = F#5 =' },
      { type: 'square', gain: 0.04, notes: 'B2 = B3 B2 = B3 A3 B3 | G2 = G3 G2 = G3 F#3 G3 | A2 = A3 A2 = A3 G3 A3 | F#2 = F#3 F#2 = F#3 E3 F#3 | B2 = B3 B2 = B3 A3 B3 | G2 = G3 G2 = G3 F#3 G3 | E2 = E3 E2 = E3 D3 E3 | F#2 = F#3 F#2 = F#3 A#2 C#3' },
      { type: 'triangle', gain: 0.022, notes: 'B3+D4+F#4 = = = = = = = | G3+B3+D4 = = = = = = = | A3+C#4+E4 = = = = = = = | F#3+A#3+C#4 = = = = = = = | B3+D4+F#4 = = = = = = = | G3+B3+D4 = = = = = = = | E3+G3+B3 = = = = = = = | F#3+A#3+C#4 = = = = = = =' },
    ],
    drums: 'k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k k s s ks ks ks ks',
  },
  rebirth: { // 転生：BPM180で突き進むハードコアテクノ。4つ打ちのキックと転がるオクターブベースに、鋭いシンセのリフが畳みかける（イ短調・1小節16ステップ）
    bpm: 360,
    kickBoost: 1.2,
    tracks: [
      { type: 'vrc6saw', gain: 0.03, notes: 'A5 - A5 C6 - A5 E6 - D6 - C6 - B5 - G5 - | A5 - A5 C6 - A5 E6 - D6 - C6 - B5 - G5 - | F5 - F5 A5 - F5 C6 - A#5 - A5 - G5 - E5 - | G5 - G5 B5 - G5 D6 - C6 - B5 - A5 - F#5 - | A5 - A5 C6 - A5 E6 - D6 - C6 - B5 - G5 - | A5 - A5 C6 - A5 E6 - D6 - C6 - B5 - G5 - | F5 - F5 A5 - F5 C6 - A#5 - A5 - G5 - E5 - | G5 - G5 B5 - G5 D6 - C6 - B5 - A5 - F#5 - | D6 - A5 - D6 - F6 E6 D6 - A5 - C6 - D6 - | D6 - A5 - D6 - F6 E6 D6 - A5 - C6 - D6 - | A6 - E6 - A6 - C7 B6 A6 - E6 - G6 - A6 - | A6 - E6 - A6 - C7 B6 A6 - E6 - G6 - A6 - | F6 - C6 - F6 - A6 G6 F6 - C6 - E6 - F6 - | G6 - D6 - G6 - B6 A6 G6 - D6 - F#6 - G6 - | E6 - B5 - E6 - G#6 F#6 E6 - B5 - D#6 - E6 - | E6 - B5 - E6 - G#6 F#6 E6 - B5 - D#6 - E6 -' },
      { type: 'vrc6pulse12', gain: 0.012, notes: 'A3 C4 E4 A4 A3 C4 E4 A4 A3 C4 E4 A4 A3 C4 E4 A4 | A3 C4 E4 A4 A3 C4 E4 A4 A3 C4 E4 A4 A3 C4 E4 A4 | F4 A4 C5 F5 F4 A4 C5 F5 F4 A4 C5 F5 F4 A4 C5 F5 | G4 B4 D5 G5 G4 B4 D5 G5 G4 B4 D5 G5 G4 B4 D5 G5 | A3 C4 E4 A4 A3 C4 E4 A4 A3 C4 E4 A4 A3 C4 E4 A4 | A3 C4 E4 A4 A3 C4 E4 A4 A3 C4 E4 A4 A3 C4 E4 A4 | F4 A4 C5 F5 F4 A4 C5 F5 F4 A4 C5 F5 F4 A4 C5 F5 | G4 B4 D5 G5 G4 B4 D5 G5 G4 B4 D5 G5 G4 B4 D5 G5 | D4 F4 A4 D5 D4 F4 A4 D5 D4 F4 A4 D5 D4 F4 A4 D5 | D4 F4 A4 D5 D4 F4 A4 D5 D4 F4 A4 D5 D4 F4 A4 D5 | A3 C4 E4 A4 A3 C4 E4 A4 A3 C4 E4 A4 A3 C4 E4 A4 | A3 C4 E4 A4 A3 C4 E4 A4 A3 C4 E4 A4 A3 C4 E4 A4 | F4 A4 C5 F5 F4 A4 C5 F5 F4 A4 C5 F5 F4 A4 C5 F5 | G4 B4 D5 G5 G4 B4 D5 G5 G4 B4 D5 G5 G4 B4 D5 G5 | E4 G#4 B4 E5 E4 G#4 B4 E5 E4 G#4 B4 E5 E4 G#4 B4 E5 | E4 G#4 B4 E5 E4 G#4 B4 E5 E4 G#4 B4 E5 E4 G#4 B4 E5' },
      { type: 'vrc6pulse25', gain: 0.014, notes: '- - A3+C4+E4 - - - A3+C4+E4 - - - A3+C4+E4 - - - A3+C4+E4 - | - - A3+C4+E4 - - - A3+C4+E4 - - - A3+C4+E4 - - - A3+C4+E4 - | - - F4+A4+C5 - - - F4+A4+C5 - - - F4+A4+C5 - - - F4+A4+C5 - | - - G4+B4+D5 - - - G4+B4+D5 - - - G4+B4+D5 - - - G4+B4+D5 - | - - A3+C4+E4 - - - A3+C4+E4 - - - A3+C4+E4 - - - A3+C4+E4 - | - - A3+C4+E4 - - - A3+C4+E4 - - - A3+C4+E4 - - - A3+C4+E4 - | - - F4+A4+C5 - - - F4+A4+C5 - - - F4+A4+C5 - - - F4+A4+C5 - | - - G4+B4+D5 - - - G4+B4+D5 - - - G4+B4+D5 - - - G4+B4+D5 - | - - D4+F4+A4 - - - D4+F4+A4 - - - D4+F4+A4 - - - D4+F4+A4 - | - - D4+F4+A4 - - - D4+F4+A4 - - - D4+F4+A4 - - - D4+F4+A4 - | - - A3+C4+E4 - - - A3+C4+E4 - - - A3+C4+E4 - - - A3+C4+E4 - | - - A3+C4+E4 - - - A3+C4+E4 - - - A3+C4+E4 - - - A3+C4+E4 - | - - F4+A4+C5 - - - F4+A4+C5 - - - F4+A4+C5 - - - F4+A4+C5 - | - - G4+B4+D5 - - - G4+B4+D5 - - - G4+B4+D5 - - - G4+B4+D5 - | - - E4+G#4+B4 - - - E4+G#4+B4 - - - E4+G#4+B4 - - - E4+G#4+B4 - | - - E4+G#4+B4 - - - E4+G#4+B4 - - - E4+G#4+B4 - - - E4+G#4+B4 -' },
      { type: 'triangle', gain: 0.12, notes: 'A1 A2 A1 A2 A1 A2 A1 A2 A1 A2 A1 A2 A1 A2 A1 A2 | A1 A2 A1 A2 A1 A2 A1 A2 A1 A2 A1 A2 A1 A2 A1 A2 | F2 F3 F2 F3 F2 F3 F2 F3 F2 F3 F2 F3 F2 F3 F2 F3 | G2 G3 G2 G3 G2 G3 G2 G3 G2 G3 G2 G3 G2 G3 G2 G3 | A1 A2 A1 A2 A1 A2 A1 A2 A1 A2 A1 A2 A1 A2 A1 A2 | A1 A2 A1 A2 A1 A2 A1 A2 A1 A2 A1 A2 A1 A2 A1 A2 | F2 F3 F2 F3 F2 F3 F2 F3 F2 F3 F2 F3 F2 F3 F2 F3 | G2 G3 G2 G3 G2 G3 G2 G3 G2 G3 G2 G3 G2 G3 G2 G3 | D2 D3 D2 D3 D2 D3 D2 D3 D2 D3 D2 D3 D2 D3 D2 D3 | D2 D3 D2 D3 D2 D3 D2 D3 D2 D3 D2 D3 D2 D3 D2 D3 | A1 A2 A1 A2 A1 A2 A1 A2 A1 A2 A1 A2 A1 A2 A1 A2 | A1 A2 A1 A2 A1 A2 A1 A2 A1 A2 A1 A2 A1 A2 A1 A2 | F2 F3 F2 F3 F2 F3 F2 F3 F2 F3 F2 F3 F2 F3 F2 F3 | G2 G3 G2 G3 G2 G3 G2 G3 G2 G3 G2 G3 G2 G3 G2 G3 | E2 E3 E2 E3 E2 E3 E2 E3 E2 E3 E2 E3 E2 E3 E2 E3 | E2 E3 E2 E3 E2 E3 E2 E3 E2 E3 E2 E3 E2 E3 E2 E3' },
    ],
    drums: 'k - h - ks - h - k - h - ks - h - | k - h - ks - h - k - h - ks - h - | k - h - ks - h - k - h - ks - h - | k - h - ks - h - k - h - ks - h - | k - h - ks - h - k - h - ks - h - | k - h - ks - h - k - h - ks - h - | k - h - ks - h - k - h - ks - h - | k - h - ks - h - s s s s ks ks ks ks | k - h - ks - h - k - h - ks - h - | k - h - ks - h - k - h - ks - h - | k - h - ks - h - k - h - ks - h - | k - h - ks - h - k - h - ks - h - | k - h - ks - h - k - h - ks - h - | k - h - ks - h - k - h - ks - h - | k - h - ks - h - k - h - ks - h - | k - h - ks - h - s s s s ks ks ks ks',
  },
  records: {
    bpm: 132,
    tracks: [
      { type: 'vrc6pulse25', gain: 0.03, notes: 'C5 = = = G5 = = = | G#5 = = = D#6 = C6 = | A#5 = = = G5 = D#5 = | F5 = = = = = = = | G#5 = = = C6 = F6 = | D#6 = = = D6 = C6 = | B5 = = = D6 = F6 = | G6 = = = F6 = D6 B5' },
      { type: 'vrc6pulse12', gain: 0.02, notes: 'C4 D#4 G4 C5 G4 D#4 C4 D#4 | G#3 C4 D#4 G#4 D#4 C4 G#3 C4 | D#4 G4 A#4 D#5 A#4 G4 D#4 G4 | A#3 D4 F4 A#4 F4 D4 A#3 D4 | F3 G#3 C4 F4 C4 G#3 F3 G#3 | C4 D#4 G4 C5 G4 D#4 C4 D#4 | G3 B3 D4 G4 D4 B3 G3 B3 | G3 B3 D4 F4 G4 B4 D5 F5' },
      { type: 'vrc6saw', gain: 0.05, notes: 'C2 C2 C3 C2 C2 C2 C3 C2 | G#1 G#1 G#2 G#1 G#1 G#1 G#2 G#1 | D#2 D#2 D#3 D#2 D#2 D#2 D#3 D#2 | A#1 A#1 A#2 A#1 A#1 A#1 A#2 A#1 | F1 F1 F2 F1 F1 F1 F2 F1 | C2 C2 C3 C2 C2 C2 C3 C2 | G1 G1 G2 G1 G1 G1 G2 G1 | G1 G1 G2 G1 B1 D2 F2 G2' },
    ],
    kickBoost: 1.2, // ティンパニのように重く
    drums: 'k - s k k - s - | k - s k k - s - | k - s k k - s - | k - s k k s s s | k - s k k - s - | k - s k k - s - | k - s k k - s - | k k s s ks ks ks ks',
  },
  ranking: {
    bpm: 140,
    tracks: [
      { type: 'vrc6pulse25', gain: 0.03, notes: 'E5 = A5 B5 C#6 = = E6 | D#6 = = C#6 B5 = F#5 = | D#6 = = = E6 = D#6 B5 | C#6 = = = G#5 = = = | A5 = B5 C#6 E6 = = F#6 | E6 = = = C6 = A5 = | F#5 = A5 C#6 D#6 = F#6 = | E6 = = = G#5 = B5 =' },
      { type: 'vrc6pulse12', gain: 0.02, notes: 'A3 C#4 E4 A4 C#5 A4 E4 C#4 | B3 D#4 F#4 B4 D#5 B4 F#4 D#4 | G#3 B3 D#4 G#4 B4 G#4 D#4 B3 | C#4 E4 G#4 C#5 E5 C#5 G#4 E4 | A3 C#4 E4 A4 C#5 A4 E4 C#4 | A3 C4 E4 A4 C5 A4 E4 C4 | F#3 A3 C#4 F#4 B3 D#4 F#4 B4 | E4 G#4 B4 E5 G#5 E5 B4 G#4' },
      { type: 'vrc6saw', gain: 0.05, notes: 'A1 A1 A2 A1 A1 A1 A2 A1 | B1 B1 B2 B1 B1 B1 B2 B1 | G#1 G#1 G#2 G#1 G#1 G#1 G#2 G#1 | C#2 C#2 C#3 C#2 C#2 C#2 C#3 C#2 | A1 A1 A2 A1 A1 A1 A2 A1 | A1 A1 A2 A1 A1 A1 A2 A1 | F#1 F#1 F#2 F#1 B1 B1 B2 B1 | E2 E2 E3 E2 E2 E2 E3 E2' },
    ],
    drums: 'k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k h s h k k s h | k k s s ks ks ks ks',
  },
  settings: { // 設定画面：格闘ゲーム風RPGのキャラ設定画面のような、重低音のベースリフが響くクールな曲（ホ短調）
    bpm: 118,
    tracks: [
      { type: 'vrc6pulse25', gain: 0.022, notes: 'E5 = = = G5 = A5 = | B5 = = = A5 G5 = = | C6 = = = B5 = G5 = | A5 = = = F#5 = D5 = | E5 = = = G5 = B5 = | E6 = = = D6 B5 = = | C6 = = = E6 = D6 C6 | B5 = = = D#5 = F#5 =' },
      { type: 'vrc6pulse12', gain: 0.012, notes: '- E4+G4+B4 - E4+G4+B4 - - E4+G4+B4 - | - E4+G4+B4 - E4+G4+B4 - - E4+G4+B4 - | - C4+E4+G4 - C4+E4+G4 - - C4+E4+G4 - | - D4+F#4+A4 - D4+F#4+A4 - - D4+F#4+A4 - | - E4+G4+B4 - E4+G4+B4 - - E4+G4+B4 - | - E4+G4+B4 - E4+G4+B4 - - E4+G4+B4 - | - C4+E4+G4 - C4+E4+G4 - - C4+E4+G4 - | - B3+D#4+F#4 - B3+D#4+F#4 - - B3+D#4+F#4 -' },
      { type: 'vrc6saw', gain: 0.05, notes: 'E1 E1 E2 E1 - E1 E2 E1 | E1 E1 E2 E1 - E1 E2 E1 | C1 C1 C2 C1 - C1 C2 C1 | D1 D1 D2 D1 - D1 D2 D1 | E1 E1 E2 E1 - E1 E2 E1 | E1 E1 E2 E1 - E1 E2 E1 | C1 C1 C2 C1 - C1 C2 C1 | B1 B1 B2 B1 - B1 B2 B1' },
      { type: 'triangle', gain: 0.07, notes: 'E1 = = = = = = = | E1 = = = = = = = | C1 = = = = = = = | D1 = = = = = = = | E1 = = = = = = = | E1 = = = = = = = | C1 = = = = = = = | B1 = = = = = = =' },
    ],
    drums: 'k - s - k k s - | k - s - k k s - | k - s - k k s - | k - s - k k s - | k - s - k k s - | k - s - k k s - | k - s - k k s - | k k s k s s ks ks',
    kickBoost: 1.6, // 低音を響かせる
  },
};
function parseSongTrack(str) {
  const tokens = str.split(/\s+/).filter(t => t && t !== '|');
  const events = [];
  tokens.forEach((tok, i) => {
    if (tok === '=') { if (events.length) events[events.length - 1].len++; return; }
    if (tok === '-') return;
    events.push({ step: i, len: 1, freqs: tok.split('+').map(n => NOTE_FREQ[n]).filter(Boolean) });
  });
  return { events, length: tokens.length };
}
function prepareSong(song) {
  if (song.byStep) return song;
  song.parsed = song.tracks.map(t => ({ ...t, ...parseSongTrack(t.notes) }));
  song.drumSteps = song.drums.split(/\s+/).filter(t => t && t !== '|');
  song.length = Math.max(song.drumSteps.length, ...song.parsed.map(t => t.length));
  song.byStep = Array.from({ length: song.length }, () => []);
  song.parsed.forEach(t => t.events.forEach(ev => song.byStep[ev.step].push({ ...ev, type: t.type, gain: t.gain })));
  return song;
}
function bgmVol() { return game.bgmVolume ?? 0.7; }
const FM_PRESETS = {
  fm:     { ratio: 1, index: 3, indexEnd: 1, decay: 0.3 },     // ブラス寄りのリード
  fmbass: { ratio: 1, index: 5, indexEnd: 0.6, decay: 0.08 },  // ベチッとしたスラップベース
  fmep:   { ratio: 1, index: 1.8, indexEnd: 0.3, decay: 0.25 }, // エレピ風の和音
  fmbell: { ratio: 3.5, index: 2.5, indexEnd: 0, decay: 0.4 },  // 鉄琴・ベル
  vrc7lead:  { ratio: 1, index: 2.2, indexEnd: 1.2, decay: 0.2 },  // 伸びるシンセリード
  vrc7brass: { ratio: 1, index: 0.8, indexEnd: 2.6, decay: 0.12 }, // だんだん明るくなるシンセブラス
  vrc7bass:  { ratio: 1, index: 4.5, indexEnd: 0.8, decay: 0.06 }, // はじくようなシンセベース
};
const PCE_WAVETABLES = {
  pceorgan: i => Math.round(15.5 + 9 * Math.sin(Math.PI * 2 * i / 32) + 4.5 * Math.sin(Math.PI * 4 * i / 32) + 2 * Math.sin(Math.PI * 8 * i / 32)), // 倍音を重ねたパイプオルガン
  pcelead:  i => i < 10 ? 31 : i < 18 ? 20 : i < 24 ? 8 : 0,          // 段々の矩形：鼻にかかった明るいリード
  pcebass:  i => Math.round(15.5 + 15.5 * Math.sin(Math.PI * 2 * i / 32) + 6 * Math.sin(Math.PI * 4 * i / 32)), // 太いベース
  pcebrass: i => 31 - i,                                               // のこぎり波：ギターのパワーコード代わり
  vrc6pulse25: i => i < 8 ? 31 : 0,                                     // デューティ4/16
  vrc6pulse12: i => i < 4 ? 31 : 0,                                     // デューティ2/16：細く鋭い音
  vrc6saw:     i => Math.floor(i * 7 / 32) * 5,                         // 7段の階段のこぎり波：太いベース
};
const pceWaveCache = new WeakMap();
function getPceWave(type) {
  let m = pceWaveCache.get(audioCtx);
  if (!m) { m = {}; pceWaveCache.set(audioCtx, m); }
  if (!m[type]) {
    const N = 64, H = 32, samples = Array.from({ length: N }, (_, i) => Math.max(0, Math.min(31, PCE_WAVETABLES[type](i >> 1))) / 15.5 - 1); // 32段の波形を2倍で標本化（倍音を多めに）
    const real = new Float32Array(H + 1), imag = new Float32Array(H + 1);
    for (let h = 1; h <= H; h++) for (let n = 0; n < N; n++) { const a = Math.PI * 2 * h * n / N; real[h] += samples[n] * Math.cos(a) * 2 / N; imag[h] += samples[n] * Math.sin(a) * 2 / N; }
    m[type] = audioCtx.createPeriodicWave(real, imag, { disableNormalization: true });
  }
  return m[type];
}
function playSongNote(time, freq, dur, type, gain, dest) {
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  const fm = FM_PRESETS[type];
  if (PCE_WAVETABLES[type]) osc.setPeriodicWave(getPceWave(type));
  else osc.type = fm ? 'sine' : type;
  osc.frequency.setValueAtTime(freq, time);
  if (fm) {
    const mod = audioCtx.createOscillator(), mg = audioCtx.createGain();
    const mf = freq * fm.ratio;
    mod.frequency.setValueAtTime(mf, time);
    mg.gain.setValueAtTime(fm.index * mf, time);
    mg.gain.exponentialRampToValueAtTime(Math.max(0.01, fm.indexEnd * mf), time + Math.min(dur, fm.decay));
    mod.connect(mg); mg.connect(osc.frequency);
    mod.start(time); mod.stop(time + dur);
  }
  const vol = Math.max(0.0001, gain * bgmVol());
  g.gain.setValueAtTime(0.0001, time);
  g.gain.linearRampToValueAtTime(vol, time + 0.008);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0001, vol * 0.55), time + Math.min(dur * 0.5, 0.18));
  g.gain.exponentialRampToValueAtTime(0.0001, time + dur * 0.97);
  osc.connect(g); g.connect(dest || audioCtx.destination);
  osc.start(time); osc.stop(time + dur);
}
// 曲ごとのエコー（残響）：song.echo = { time: 秒, feedback: 0〜1, wet: 0〜1 }
function makeSongEchoBus(echo) {
  const input = audioCtx.createGain(), delay = audioCtx.createDelay(2), fb = audioCtx.createGain(), wet = audioCtx.createGain(), tone = audioCtx.createBiquadFilter();
  delay.delayTime.value = echo.time; fb.gain.value = echo.feedback; wet.gain.value = echo.wet;
  tone.type = 'lowpass'; tone.frequency.value = 2600; // 跳ね返りはこもらせて奥行きを出す
  input.connect(audioCtx.destination);
  input.connect(delay); delay.connect(tone); tone.connect(fb); fb.connect(delay); tone.connect(wet); wet.connect(audioCtx.destination);
  return input;
}
function playSongDrum(time, kind, boost = 1) {
  const v = bgmVol();
  if (v <= 0) return;
  if (kind === 'k') { // キック：低い音が急に下がる「ドン」（boost で太く長く）
    const osc = audioCtx.createOscillator(), g = audioCtx.createGain();
    const len = 0.16 * Math.sqrt(boost);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, time); osc.frequency.exponentialRampToValueAtTime(boost > 1 ? 34 : 42, time + 0.12 * boost);
    g.gain.setValueAtTime(Math.min(0.5, 0.28 * boost) * v, time); g.gain.exponentialRampToValueAtTime(0.0001, time + len);
    osc.connect(g); g.connect(audioCtx.destination); osc.start(time); osc.stop(time + len + 0.01);
    return;
  }
  const dur = kind === 's' ? 0.12 : 0.035;
  const size = Math.max(1, Math.floor(audioCtx.sampleRate * dur));
  const buf = audioCtx.createBuffer(1, size, audioCtx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < size; i++) d[i] = Math.random() * 2 - 1;
  const src = audioCtx.createBufferSource(); src.buffer = buf;
  const f = audioCtx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = kind === 's' ? 1400 : 7000;
  const g = audioCtx.createGain();
  g.gain.setValueAtTime((kind === 's' ? 0.13 : 0.045) * v, time); g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
  src.connect(f); f.connect(g); g.connect(audioCtx.destination); src.start(time);
}
let songTimer = null, songState = null;
function startSong(type, startStep = 0) {
  const song = prepareSong(BGM_SONGS[type]);
  stopSong();
  songState = { song, step: startStep % song.length, next: audioCtx.currentTime + 0.05, stepDur: 60 / song.bpm / 2, bus: song.echo ? makeSongEchoBus(song.echo) : null };
  const tick = () => {
    const s = songState;
    if (!s) return;
    while (s.next < audioCtx.currentTime + 0.15) {
      for (const ev of s.song.byStep[s.step]) ev.freqs.forEach(fq => playSongNote(s.next, fq, ev.len * s.stepDur, ev.type, ev.gain, s.bus));
      const dr = s.song.drumSteps[s.step];
      if (dr && dr !== '-') for (const ch of dr) playSongDrum(s.next, ch, s.song.kickBoost);
      s.next += s.stepDur;
      s.step = (s.step + 1) % s.song.length;
    }
  };
  tick();
  songTimer = setInterval(tick, 30);
}
function stopSong() { clearInterval(songTimer); songTimer = null; songState = null; }
let bgmTimer = null;
let bgmToken = 0;
let bgmResume = null; // { type, step }：3択パワーアップで中断した戦闘曲の位置
let currentBgmType = null;
let battleBgmType = 'normal'; // 戦闘中に流すBGM（通常／ボス）
const NORMAL_BATTLE_SONGS = ['battle3', 'battle4', 'battle5', 'battle7', 'battle12', 'battle14', 'battle15', 'battle20', 'battle22', 'battle24', 'battle27', 'battle28'];
let normalBgmOrder = [], normalBgmIndex = 0;
function shuffleNormalBgm(avoidFirst) {
  normalBgmOrder = NORMAL_BATTLE_SONGS.slice();
  for (let i = normalBgmOrder.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [normalBgmOrder[i], normalBgmOrder[j]] = [normalBgmOrder[j], normalBgmOrder[i]]; }
  if (avoidFirst && normalBgmOrder[0] === avoidFirst) normalBgmOrder.push(normalBgmOrder.shift()); // 直前と同じ曲が続かないように
  normalBgmIndex = 0;
}
shuffleNormalBgm();
let normalBgmChangedAt = Date.now();
const NORMAL_BGM_ROTATE_MS = 2 * 60 * 1000; // 自動再戦オフでループ中は、この時間ごとに雑魚戦の曲を変える
function maybeRotateNormalBgm() { // 階をクリアした区切りで呼ぶ
  if (game.autoBossRetry !== false || battleBgmType !== 'normal') return;
  if (Date.now() - normalBgmChangedAt < NORMAL_BGM_ROTATE_MS) return;
  nextNormalBgm(); refreshBgm();
}
function nextNormalBgm() {
  normalBgmChangedAt = Date.now();
  const prev = normalBgmOrder[normalBgmIndex];
  normalBgmIndex++;
  if (normalBgmIndex >= normalBgmOrder.length) shuffleNormalBgm(prev);
}
const BOSS_BATTLE_SONGS = ['boss', 'boss2', 'boss3', 'boss5', 'boss6', 'boss8', 'boss9', 'boss11'];
let bossBgmOrder = [], bossBgmIndex = 0;
function shuffleBossBgm(avoidFirst) {
  bossBgmOrder = BOSS_BATTLE_SONGS.slice().sort(() => Math.random() - 0.5);
  if (avoidFirst && bossBgmOrder[0] === avoidFirst) bossBgmOrder.push(bossBgmOrder.shift());
  bossBgmIndex = 0;
}
shuffleBossBgm();
function nextBossBgm() {
  const prev = bossBgmOrder[bossBgmIndex];
  if (++bossBgmIndex >= bossBgmOrder.length) shuffleBossBgm(prev);
}
const TOWER_BOSS_SONGS = ['tboss1', 'tboss3']; // 試練の塔のボス専用（挑戦ごとに順番に切り替え）
function resolveBgmType(type) {
  if (type === 'boss' && game.skipChallenge) return TOWER_BOSS_SONGS[(game.skipChallenge.bgm || 0) % TOWER_BOSS_SONGS.length];
  return type === 'normal' ? normalBgmOrder[normalBgmIndex] : type === 'boss' ? bossBgmOrder[bossBgmIndex] : type;
}
const BGM_INFO = [
  { key: 'battle3', name: '戦闘3 ロック', desc: 'シンコペーションのプログレ風ロック。ホ短調（サガ系の作風）・BPM158' },
  { key: 'battle4', name: '戦闘4 時を駆ける戦い', desc: 'シンコペーションするベースとブラスの合いの手のジャズロック風。VRC6風チップチューン。ト短調（時間旅行RPG系の作風）・BPM168' },
  { key: 'battle5', name: '戦闘5 落ち物', desc: 'イ短調の民謡っぽい中毒ループ（落ち物パズル系の作風）・BPM150' },
  { key: 'battle7', name: '戦闘7 ストリートの挑戦者', desc: 'ファンキーなオクターブベースとブラスの合いの手、熱いメロディ。VRC6風チップチューン。ニ短調（対戦格闘ゲーム系の作風）・BPM152' },
  { key: 'battle12', name: '戦闘12 疾風ロック', desc: '2小節のリフを繰り返す中毒性のあるロック。PCエンジン風の波形メモリ音源。ホ短調・BPM164' },
  { key: 'battle14', name: '戦闘14 狩猟の鼓動', desc: '勇壮なファンファーレと3-3-2の民族調リズム。VRC6風チップチューン。ホ短調（ハンティングアクション系の作風）・BPM160' },
  { key: 'battle15', name: '戦闘15 狼の咆哮', desc: 'ギターリフ風のパワーコードと疾走するベース。VRC6風チップチューン。イ短調（対戦格闘ゲームの格闘伝説系の作風）・BPM160' },
  { key: 'battle20', name: '戦闘20 マナの森の激闘', desc: 'はずむシンコペーションのベースと打楽器、ドリア調で明るさと切迫感が入り混じる旋律。VRC6風チップチューン。ニ・ドリア（アクションRPG系の作風）・BPM160' },
  { key: 'battle22', name: '戦闘22 ビートの迷宮', desc: '四つ打ちのキックと裏拍で弾むオクターブベース、裏打ちのコードスタブに乗る中毒性のあるリフ。VRC6風チップチューン。ホ短調（音楽ゲーム系のハウスの作風）・BPM148' },
  { key: 'battle24', name: '戦闘24 裏通りの拳', desc: '刻むロックベースとパワーコードのリフ、ブルージーな音を混ぜた熱い旋律の街の殴り合い。VRC6風チップチューン。イ短調（ベルトスクロールアクション系の作風）・BPM156' },
  { key: 'battle27', name: '戦闘27 影の疾走', desc: '休みなく刻むオクターブベースと駆け回る分散和音、悲壮で勇ましい旋律が疾走する忍びの戦い。VRC6風チップチューン。ニ短調（ファミコンの忍者アクション系の作風）・BPM170' },
  { key: 'battle28', name: '戦闘28 鋼の疾風', desc: '刻み続けるベースと跳ねる分散和音、駆け上がって高く抜ける英雄的な旋律。VRC6風チップチューン。ホ短調→ト長調の明るい展開（ファミコンのロボットアクション系の作風）・BPM164' },
  { key: 'levelup', name: 'レベルアップ 闘士の選択', desc: '3択パワーアップを選んでいる間に流れる、うねるシンコペーションのロックベースとパワーコードの刻み、熱く挑発的な旋律のループ。VRC6風チップチューン。イ短調（90年代対戦格闘チーム戦のキャラクター選択の作風）・BPM152' },
  { key: 'boss', name: 'ボス1 ソニック・ブラスト', desc: '同じ音を叩きつけるシンコペーションのメロディと、うねるオクターブベースで疾走する、高速アクションゲームのボス戦のような曲。VRC6風チップチューン。ハ短調・BPM168' },
  { key: 'boss2', name: 'ボス2 変拍子', desc: '裏拍で刻むプログレ。ハ短調の半音進行（サガ系の作風）・BPM170' },
  { key: 'boss3', name: 'ボス3 死闘', desc: '疾走するうねりベースと高音の叫び。ホ短調（サガ系の作風）・BPM184' },
  { key: 'boss5', name: 'ボス5 決戦', desc: '駆け上がる最終決戦の高揚感。ロ短調（FF系の作風）・BPM176' },
  { key: 'boss6', name: 'ボス6 血の月', desc: 'ナポリの和音で不気味に転じるゴシックな死闘。ホ短調（悪魔城系の作風）・BPM188' },
  { key: 'boss9', name: 'ボス9 刑事の追及', desc: '弾むピチカートのベースとブラスの合いの手に乗って、ずる賢く忍び寄る旋律が後半で劇的に舞い上がる。犯人を追い詰める謎解きサスペンスの劇伴。ニ短調（古畑任三郎系の作風）・BPM136' },
  { key: 'boss11', name: 'ボス10 世紀末の死闘', desc: '刻むパワーコードと唸るオクターブベースに、熱く歌い上げる旋律。宿敵を打ち倒すクライマックスのヒーローロック。ホ短調（北斗の拳系の作風）・BPM158' },
  { key: 'boss8', name: 'ボス8 破滅の螺旋', desc: '半音ずつ沈んでいくベースと悲鳴のような旋律、最後に駆け上がって頭に戻る緊迫の死闘。VRC6風チップチューン。イ短調（ファミコンのゴシックアクション系の作風）・BPM178' },
  { key: 'tboss1', name: '試練の塔ボス1 闇の大魔王', desc: '駆け下りるバロック風の分散和音と打ち鳴らすティンパニ、悲壮で勇壮な旋律。VRC6風チップチューン。ニ短調（大魔王との最終決戦系の作風）・BPM168' },
  { key: 'tboss3', name: '試練の塔ボス3 混沌の決戦', desc: '休みなく刻むベースと渦巻くアルペジオ、畳みかける旋律の疾走感。VRC6風チップチューン。ホ短調（すべてを無に還す混沌との最終決戦系の作風）・BPM176' },
  { key: 'upgrade', name: 'ページ 強化 迷宮のパルティータ', desc: '古典RPGのダンジョン曲のような、チェンバロ調の分散和音が五度圏を巡るバロック風の旋律を、四つ打ちビートで音ゲー風にアレンジ。VRC6風チップチューン。ニ短調・BPM140' },
  { key: 'companion', name: 'ページ 仲間 なかまとホーム', desc: '王道進行G-A-F#m-Bmの明るくキャッチーな曲。VRC6風チップチューン。ニ長調（スマホゲームのホーム画面系の作風）・BPM140' },
  { key: 'coinshop', name: 'ページ スキル 出撃前の兵装選択', desc: 'シンコペーションの和音の刻みと疾走するベースに、勇ましい旋律が乗る、シューティングの装備選択画面のような出撃前の高揚感あふれる曲。VRC6風チップチューン。ホ短調・BPM152' },
  { key: 'artifact', name: 'ページ 遺物 古の書庫', desc: '忍び足のようなピチカート風ベースと好奇心をくすぐる旋律。VRC6風チップチューン。ニ短調（ファンタジーRPGの古代図書館系の作風）・BPM126' },
  { key: 'gemshop', name: 'ページ ショップ 旅人たちの酒場', desc: '冒険者が集う酒場のような、跳ねるシャッフルのリズムとジャズ風のウォーキングベースに、アコーディオン風の陽気で少し懐かしい旋律が乗る曲。VRC6風チップチューン。ヘ長調（国民的RPGの酒場系の作風）・シャッフルBPM112' },
  { key: 'tower', name: 'ページ 試練の塔 螺旋の階段', desc: '刻み続ける分散和音とうねるベースの不安感に、階段を登るように上がっていく旋律の高揚感を重ねた曲。VRC6風チップチューン。イ短調・BPM140' },
  { key: 'gacha', name: 'ページ 進化 覚醒の儀式', desc: 'サガ系の作風。ロ短調の高揚する儀式ループ・BPM144' },
  { key: 'records', name: 'ページ 戦績 英雄の軌跡', desc: '重く刻むベースとティンパニ風のキック、ブラスのように伸びる旋律の荘厳な行進曲。VRC6風チップチューン。ハ短調・BPM132' },
  { key: 'ranking', name: 'ページ ランキング 栄光の頂', desc: '王道進行で駆け上がる爽快感と表彰の高揚感に、切なさと郷愁をひとさじ。VRC6風チップチューン。ホ長調・BPM140' },
  { key: 'settings', name: 'ページ 設定 ファイターズ・ロッカー', desc: '重低音のベースリフと太いキックが響く、格闘ゲーム風RPGのキャラ設定画面のようなクールな曲。VRC6風チップチューン。ホ短調・BPM118' },
  { key: 'rebirth', name: '転生 リバース・パラドックス', desc: '転生の演出中に流れる。4つ打ちのキックと転がるオクターブベースに、鋭いシンセのリフと16分の分散和音が畳みかけるハードコアテクノ。後半は1オクターブ上で叫ぶように盛り上がる。VRC6風チップチューン。イ短調（音楽ゲームの超高難度ボス曲系の作風）・BPM180' },
  { key: 'continue', name: 'コンテニュー インサートコイン', desc: 'カウントダウンに急かされる、レトロなゲーセンのコンテニュー待ちのような焦りをあおる短調の疾走曲。VRC6風チップチューン。ハ短調・BPM150' },
  { key: 'gameover', name: 'コンテニュー ラストチャンス', desc: 'ゲームオーバー時に流れる。ファンキーなオクターブベースと劇的な高音リードのチップチューンロック。イ短調（ベルトスクロール格闘アクション系の作風）・BPM126' },
];
let gameOverBgm = false;      // コンテニュー確認中
let bgmBookPreview = null;    // 図鑑で試聴中の曲
const BATTLE_BGM_KEYS = {};   // 戦闘の曲（ステージをクリアして登録）
[...NORMAL_BATTLE_SONGS, ...BOSS_BATTLE_SONGS, ...TOWER_BOSS_SONGS].forEach(k => BATTLE_BGM_KEYS[k] = true);
function unlockBgmBook(key) {
  if (!BGM_INFO.some(b => b.key === key)) return;
  if (!game.bgmBook) game.bgmBook = {};
  if (game.bgmBook[key]) return;
  game.bgmBook[key] = game.stage;
  if (BATTLE_BGM_KEYS[key]) { const info = BGM_INFO.find(b => b.key === key); showNotice(`🎵 BGM図鑑に登録：${info.name}`, false, 2500); }
  if (getActiveTab() === 'records') renderBgmBook();
}
function renderBgmBook() {
  const list = document.getElementById('bgmBookList');
  if (!list) return;
  const book = game.bgmBook || {};
  document.getElementById('bgmBookCount').textContent = `${BGM_INFO.filter(b => book[b.key]).length} / ${BGM_INFO.length}`;
  list.innerHTML = BGM_INFO.map(b => {
    const got = book[b.key];
    if (!got) return `<div class="bgm-book-row locked"><div class="bb-info"><div class="bb-name">？？？</div><div class="bb-desc">${BATTLE_BGM_KEYS[b.key] ? 'この曲が流れる階をクリアすると登録' : 'このページを開いて聴くと登録'}</div></div></div>`;
    const playing = bgmBookPreview === b.key;
    return `<div class="bgm-book-row ${playing ? 'playing' : ''}"><button class="bb-play" data-bgm-book="${b.key}">${playing ? '■' : '▶'}</button><div class="bb-info"><div class="bb-name">${b.name}</div><div class="bb-desc">${b.desc}</div></div></div>`;
  }).join('');
}
document.getElementById('bgmBookList').addEventListener('click', ev => {
  const btn = ev.target.closest('[data-bgm-book]');
  if (!btn) return;
  ensureAudio();
  bgmBookPreview = bgmBookPreview === btn.dataset.bgmBook ? null : btn.dataset.bgmBook;
  refreshBgm();
  renderBgmBook();
});
let rebirthFlow = false;      // 転生演出〜転生ショップを閉じるまで
let rebirthRewardBgm = false; // 転生報酬（宝箱演出〜結果表示）中
function updateSkipBtnVisibility() {
  const hide = gameOverBgm || rebirthFlow;
  stageSkipBtn.style.display = hide ? 'none' : '';
  if (hide) rebornBtn.style.display = 'none'; // 転生するボタンもゲームオーバー・転生中は出さない
  else rebornBtn.style.display = game.stage >= 3 ? 'block' : 'none';
  document.body.classList.toggle('gameover-lock', gameOverBgm);
  if (typeof updateBossRetryBtn === 'function') updateBossRetryBtn();
}
function refreshBgm() {
  if (!audioCtx) return;
  let type = battleBgmType;
  if (typeof bossContModal !== 'undefined' && bossContModal.classList.contains('show')) type = 'continue'; // ボス戦のコンテニュー画面
  else if (document.getElementById('creditsModal').classList.contains('show') || settingsModal.classList.contains('show')) type = 'settings'; // 設定画面・スタッフロール中（スタッフロールも設定画面の曲）
  else if (gameOverBgm) type = 'gameover';
  else if (stageSkipModal.classList.contains('show')) type = 'tower'; // 試練の塔の画面
  else if (document.getElementById('powerUpModal').classList.contains('show')) type = 'levelup'; // レベルアップ3択中
  else if (rebirthRewardBgm) type = 'rebirth'; // 転生の演出中は荘厳な曲
  else if (bgmBookPreview && getActiveTab() === 'records') type = bgmBookPreview; // BGM図鑑で試聴中
  else {
    const tab = getActiveTab();
    if (tab !== 'game' && (BGM_SONGS[tab] || BGM_PATTERNS[tab])) type = tab; // 各ページ専用の曲
  }
  playBgmTrack(resolveBgmType(type));
}

function playBgmNote(note) {
  if (!audioCtx) return;
  const t0 = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = note.type;
  osc.frequency.setValueAtTime(note.freq, t0);
  const vol = Math.max(0.0001, note.gain * (game.bgmVolume ?? 0.7));
  gain.gain.setValueAtTime(vol, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + note.dur * 0.95);
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.start(t0); osc.stop(t0 + note.dur);
}
function scheduleBgmStep(type, index, token) {
  if (token !== bgmToken || currentBgmType !== type) return;
  const pattern = BGM_PATTERNS[type];
  if (!pattern) return; // 曲が用意されていない場面（転生ショップ・ゲームオーバーなど）は無音
  const note = pattern[index % pattern.length];
  if (note.freq) playBgmNote(note);
  bgmTimer = setTimeout(() => scheduleBgmStep(type, index + 1, token), note.dur * 1000);
}
function startBgm(type) {
  battleBgmType = type;
  refreshBgm();
}
function playBgmTrack(type) {
  if (currentBgmType === type) return;
  if (type && !BATTLE_BGM_KEYS[type]) unlockBgmBook(type); // ページ・コンテニューの曲は聴いたら図鑑に登録
  bgmToken++;
  if (type === 'levelup' && songState && currentBgmType) bgmResume = { type: currentBgmType, step: songState.step }; // 3択の後に戦闘曲を続きから再開するため覚えておく
  const resumeStep = bgmResume && bgmResume.type === type ? bgmResume.step : 0;
  if (type !== 'levelup') bgmResume = null;
  currentBgmType = type;
  clearTimeout(bgmTimer);
  stopSong();
  if (BGM_SONGS[type]) startSong(type, resumeStep); // 通常戦闘・ボス戦は多重トラックの曲（3択の後は続きから）
  else scheduleBgmStep(type, 0, bgmToken);
  updateDebugNowBgm();
}
function updateDebugNowBgm() { // デバッグパネル上部に今の曲名を常に表示
  const el = document.getElementById('dbgNowBgm'); if (!el) return;
  const info = BGM_INFO.find(b => b.key === currentBgmType);
  el.textContent = '🎶 再生中：' + (!audioCtx || !currentBgmType ? '（まだ鳴っていません）' : info ? info.name : currentBgmType) + '　ⓘ';
  const d = document.getElementById('dbgNowDesc');
  if (d && d.style.display !== 'none') d.textContent = info ? info.desc : '（この曲の概要はありません）';
}
document.getElementById('dbgNowBgm').addEventListener('click', () => { // 押すと今の曲の概要を開閉
  const d = document.getElementById('dbgNowDesc');
  d.style.display = d.style.display === 'none' ? '' : 'none';
  updateDebugNowBgm();
});
function stopBgm() {
  bgmToken++;
  currentBgmType = null;
  clearTimeout(bgmTimer);
  stopSong();
  updateDebugNowBgm();
}
function playUiTapSound() { playTone(880, 0.045, 'triangle', 0.08, 1320); }
function playTabSound() { playTone(660, 0.04, 'square', 0.035, 880); setTimeout(() => playTone(1320, 0.05, 'square', 0.03), 35); }
function playModalOpenSound() { playTone(520, 0.1, 'triangle', 0.07, 1040); }
function playModalCloseSound() { playTone(760, 0.08, 'triangle', 0.05, 420); }
function playTone(freq, duration, type, startGain, glideTo) {
  if (!audioCtx || isBattleSfxMuted()) return;
  const t0 = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type || 'sine';
  osc.frequency.setValueAtTime(freq, t0);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + duration);
  gain.gain.setValueAtTime((startGain || 0.2) * game.sfxVolume, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.start(t0); osc.stop(t0 + duration);
}
function playNoiseBurst(duration, startGain) {
  if (!audioCtx || isBattleSfxMuted()) return;
  const bufferSize = Math.max(1, Math.floor(audioCtx.sampleRate * duration));
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  const gain = audioCtx.createGain();
  const t0 = audioCtx.currentTime;
  gain.gain.setValueAtTime((startGain || 0.3) * game.sfxVolume, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
  noise.connect(gain); gain.connect(audioCtx.destination);
  noise.start(t0);
}
function playFootstep(pitch, gainAmt) {
  if (!audioCtx || isBattleSfxMuted()) return;
  const dur = 0.05;
  const size = Math.max(1, Math.floor(audioCtx.sampleRate * dur));
  const buf = audioCtx.createBuffer(1, size, audioCtx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < size; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / size, 2);
  const src = audioCtx.createBufferSource(); src.buffer = buf;
  const filter = audioCtx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 500 + pitch * 900;
  const gain = audioCtx.createGain(); gain.gain.value = gainAmt * game.sfxVolume;
  src.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination);
  src.start();
}
function playTapDashSound(mult) {
  const level = Math.max(0, Math.min(1, (mult - 1) / (TAP_ACCEL_MAX - 1)));
  const steps = 1 + Math.round(level * 2);
  const gap = 70 - level * 30;
  for (let i = 0; i < steps; i++) setTimeout(() => playFootstep(level + i * 0.15, 0.22 + level * 0.18), i * gap);
  playTone(180 + level * 360, 0.12, 'sine', 0.05 + level * 0.06, 360 + level * 900); // 加速の「ヒュッ」
}
function noiseSweep(dur, f0, f1, filterType, q, gainAmt, delay = 0) {
  if (!audioCtx || isBattleSfxMuted()) return;
  const t0 = audioCtx.currentTime + delay;
  const size = Math.max(1, Math.floor(audioCtx.sampleRate * dur));
  const buf = audioCtx.createBuffer(1, size, audioCtx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
  const src = audioCtx.createBufferSource(); src.buffer = buf;
  const filter = audioCtx.createBiquadFilter(); filter.type = filterType; filter.Q.value = q;
  filter.frequency.setValueAtTime(f0, t0);
  filter.frequency.exponentialRampToValueAtTime(Math.max(40, f1), t0 + dur);
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, gainAmt * game.sfxVolume), t0 + dur * 0.15); // 効果音の音量0でも落ちないように
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination);
  src.start(t0); src.stop(t0 + dur + 0.02);
}
function filteredNoise(delay, dur, gainAmt, freq, q = 1, type = 'bandpass') {
  if (!audioCtx || isBattleSfxMuted()) return;
  const t0 = audioCtx.currentTime + delay, n = Math.floor(audioCtx.sampleRate * dur);
  const buf = audioCtx.createBuffer(1, n, audioCtx.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  const src = audioCtx.createBufferSource(); src.buffer = buf;
  const f = audioCtx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
  const g = audioCtx.createGain();
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(gainAmt * game.sfxVolume, t0 + Math.min(0.01, dur / 4));
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(f); f.connect(g); g.connect(audioCtx.destination);
  src.start(t0); src.stop(t0 + dur + 0.02);
}
function playThunderStrike() { // 雷の杖：ファミコンのノイズ音源風の軽い「バリバリッ」（重低音なし）
  if (!audioCtx || isBattleSfxMuted()) return;
  const now = Date.now(); if (now - (playThunderStrike.last || 0) < 150) return; playThunderStrike.last = now; // 何本落ちても重ねすぎない
  const ac = audioCtx, sr = ac.sampleRate, dur = 0.45, n = Math.floor(sr * dur);
  const buf = ac.createBuffer(1, n, sr), x = buf.getChannelData(0);
  let lfsr = 1, hold = 0, val = 1;
  for (let i = 0; i < n; i++) {
    const t = i / sr;
    const period = t < 0.05 ? 6 : t < 0.15 ? 14 : 28; // 細かいノイズのまま少しだけ粗く（低い成分は出さない）
    if (--hold <= 0) { hold = period * sr / 44100; const bit = (lfsr ^ (lfsr >> 1)) & 1; lfsr = (lfsr >> 1) | (bit << 14); val = lfsr & 1 ? 1 : -1; }
    let env = t < 0.008 ? 1 : Math.max(0, 1 - (t - 0.008) / (dur - 0.008)) ** 1.5; // 16段階で階段状に減衰
    if (t > 0.07 && t < 0.1) env = Math.max(env, 0.6); // もう一度バリッと光る
    x[i] = val * Math.round(env * 15) / 15;
  }
  const src = ac.createBufferSource(); src.buffer = buf;
  const hp = ac.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 900; // 重低音をカット
  const g = ac.createGain(); g.gain.value = 0.09 * game.sfxVolume;
  src.connect(hp); hp.connect(g); g.connect(ac.destination); src.start(ac.currentTime);
}
function playHolyWaterBreak() { // 聖水：ガラス瓶がパリンと割れて、ボワッと炎が燃え上がり、パチパチ燃える
  if (!audioCtx || isBattleSfxMuted()) return;
  const now = Date.now(); if (now - (playHolyWaterBreak.last || 0) < 140) return; playHolyWaterBreak.last = now; // 同時に何本割れても重ねすぎない
  const v = game.sfxVolume, ac = audioCtx, t0 = ac.currentTime;
  filteredNoise(0, 0.07, 0.32, 5200, 0.8, 'highpass'); // 割れる瞬間の「パキッ」
  thump(1800, 900, 0.05, 0.10, 'triangle');
  for (let i = 0; i < 9; i++) { // 破片が散る「チリンチリン」
    const d = 0.01 + Math.random() * 0.16, f = 2600 + Math.random() * 4200, len = 0.05 + Math.random() * 0.12;
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(f, t0 + d);
    g.gain.setValueAtTime(0.0001, t0 + d); g.gain.exponentialRampToValueAtTime(0.07 * v, t0 + d + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t0 + d + len);
    o.connect(g); g.connect(ac.destination); o.start(t0 + d); o.stop(t0 + d + len + 0.02);
  }
  { // 炎が燃え上がる「ボワッ」：こもった音から明るく開くノイズ
    const d = 0.06, dur = 0.75, n = Math.floor(ac.sampleRate * dur);
    const buf = ac.createBuffer(1, n, ac.sampleRate), x = buf.getChannelData(0);
    for (let i = 0; i < n; i++) x[i] = Math.random() * 2 - 1;
    const src = ac.createBufferSource(); src.buffer = buf;
    const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.Q.value = 2.5;
    f.frequency.setValueAtTime(220, t0 + d); f.frequency.exponentialRampToValueAtTime(2600, t0 + d + 0.22); f.frequency.exponentialRampToValueAtTime(700, t0 + d + dur);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t0 + d); g.gain.exponentialRampToValueAtTime(0.42 * v, t0 + d + 0.08); g.gain.exponentialRampToValueAtTime(0.0001, t0 + d + dur);
    src.connect(f); f.connect(g); g.connect(ac.destination); src.start(t0 + d); src.stop(t0 + d + dur + 0.02);
  }
  thump(140, 55, 0.35, 0.16, 'sine', 0.05); // 燃え上がりの重み
  for (let i = 0; i < 10; i++) filteredNoise(0.25 + Math.random() * 0.9, 0.012 + Math.random() * 0.02, 0.09 + Math.random() * 0.08, 2200 + Math.random() * 3000, 1.5, 'bandpass'); // パチパチ
}
function playHolyWaterThrow() { // 瓶を放り投げる「ヒュッ」
  filteredNoise(0, 0.16, 0.08, 1400, 2, 'bandpass');
}
function playEnemyBarrierSound() { // 敵のバリア展開：低いうなりから立ち上がる光の膜
  thump(220, 440, 0.4, 0.12, 'sine');
  thump(660, 1320, 0.35, 0.05, 'triangle', 0.04);
  thump(990, 1980, 0.3, 0.03, 'sine', 0.08);
  filteredNoise(0.05, 0.35, 0.05, 7000, 0.8, 'highpass');
}
function playEnemyBarrierBlockSound() { // バリアで弾く：ブォン
  thump(520, 380, 0.16, 0.12, 'sine');
  thump(1560, 1100, 0.12, 0.04, 'triangle');
  filteredNoise(0, 0.1, 0.04, 5000, 1, 'highpass');
}
function playTowerGateSound() { // ドアノブを回す「ガチャ」
  filteredNoise(0, 0.035, 0.35, 3200, 2.5);
  thump(1900, 1200, 0.03, 0.08, 'square');
  filteredNoise(0.07, 0.05, 0.4, 2200, 2);
  thump(900, 500, 0.05, 0.12, 'square', 0.07);
  thump(180, 90, 0.06, 0.2, 'sine', 0.07);
}
// 挑戦開始：石段をザッ、ザッ、ザッと踏みしめて登る
function playTowerStepsSound() {
  for (let i = 0; i < 4; i++) {
    const d = i * 0.2;
    filteredNoise(d, 0.11, 0.3, 1400 + i * 120, 1.2);
    thump(140, 60, 0.09, 0.22, 'sine', d);
  }
}
// 飛躍の専用効果音：tier 1＝飛躍（キラッと上がる和音）、2＝超飛躍（さらに高く鳴り響くファンファーレ）
function playLeapSound(tier = 1, vol = 1) { // vol：オート強化をほかのページで聞くときは小さく
  if (!audioCtx) return;
  const notes = tier >= 2 ? [523.3, 659.3, 784, 1046.5, 1318.5, 1568, 2093] : [659.3, 784, 987.8, 1318.5];
  notes.forEach((f, i) => setTimeout(() => playTone(f, tier >= 2 ? 0.22 : 0.16, 'square', 0.07 * vol, f * 1.01), i * (tier >= 2 ? 70 : 60)));
  const end = notes.length * (tier >= 2 ? 70 : 60);
  setTimeout(() => { playTone(notes[notes.length - 1], 0.5, 'triangle', 0.1 * vol, notes[notes.length - 1] * 1.5); if (tier >= 2) { playTone(notes[notes.length - 3], 0.6, 'square', 0.05 * vol); playNoiseBurst(0.25, 0.08 * vol); } }, end);
}
// コンテニューのカウントダウン：レトロなゲーセン風に、数字ごとに太い「ポーン」を鳴らす（残り3以下は高く強く・2連打）
function playContinueTick(n) {
  if (!audioCtx) return;
  const urgent = n <= 3, f = urgent ? 1046.5 : 784;
  const hit = (delay, freq, g) => setTimeout(() => {
    playTone(freq, 0.26, 'square', g, freq * 0.98);
    playTone(freq / 2, 0.3, 'triangle', g * 1.3);
    playTone(freq * 1.5, 0.12, 'square', g * 0.4);
  }, delay);
  hit(0, f, urgent ? 0.11 : 0.085);
  if (urgent) hit(140, f * 1.26, 0.08); // 終盤は「ポポーン」と2連打で焦らせる
  thump(160, 55, 0.18, urgent ? 0.22 : 0.16);
}
// 宝箱の中身が並ぶときの「ポンポン」連鎖音：カードが出るたびに少しずつ高くなる。レア度が高いカードはキラッと重ねる
function playLootPopChain(rarities, stepMs = 60) {
  if (!audioCtx) return;
  const scale = [523.3, 587.3, 659.3, 784, 880, 1046.5, 1174.7, 1318.5, 1568, 1760, 2093];
  rarities.slice(0, 21).forEach((rar, i) => setTimeout(() => {
    const f = scale[Math.min(scale.length - 1, i % 11)] * (i >= 11 ? 1.5 : 1);
    playTone(f, 0.09, 'square', 0.06, f * 1.5); // ポン
    playTone(f / 2, 0.07, 'triangle', 0.05);
    if (rar === 'epic' || rar === 'legendary' || rar === 'mythic') setTimeout(() => playTone(f * 2, rar === 'mythic' ? 0.35 : 0.22, 'triangle', 0.06, f * 3), 40); // キラッ
  }, i * stepMs));
}
// 震える障害物にぶつかったときの「ブルン」：低い音をビブラートで揺らしながら少し下げる（amt 0〜1 で大きさ）
function playWobbleSound(amt = 1) {
  if (!audioCtx || isBattleSfxMuted()) return;
  const t0 = audioCtx.currentTime, dur = 0.22 + amt * 0.12;
  const osc = audioCtx.createOscillator(), lfo = audioCtx.createOscillator(), depth = audioCtx.createGain(), g = audioCtx.createGain();
  osc.type = 'triangle'; osc.frequency.setValueAtTime(190, t0); osc.frequency.exponentialRampToValueAtTime(95, t0 + dur);
  lfo.frequency.setValueAtTime(22, t0); lfo.frequency.linearRampToValueAtTime(9, t0 + dur); // だんだんゆっくり揺れる
  depth.gain.setValueAtTime(45, t0); depth.gain.exponentialRampToValueAtTime(4, t0 + dur);
  lfo.connect(depth); depth.connect(osc.frequency);
  g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime((0.1 + amt * 0.08) * game.sfxVolume, t0 + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g); g.connect(audioCtx.destination);
  osc.start(t0); lfo.start(t0); osc.stop(t0 + dur + 0.02); lfo.stop(t0 + dur + 0.02);
}
function thump(f0, f1, dur, gainAmt, type = 'sine', delay = 0) {
  if (!audioCtx || isBattleSfxMuted()) return;
  const t0 = audioCtx.currentTime + delay;
  const osc = audioCtx.createOscillator(); osc.type = type;
  osc.frequency.setValueAtTime(f0, t0);
  osc.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t0 + dur);
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(gainAmt * game.sfxVolume, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.start(t0); osc.stop(t0 + dur + 0.02);
}
const SNES_RATE = 32000; // スーファミの音源と同じサンプリング周波数
const SNES_SLASHES = [ // 斬撃：高い「シュッ」と風を切ってから「ザシュ」と斬る（低い打撃音は控えめに）
  { dur: 0.22, parts: [{ t: 0, noise: [7000, 2600], q: 1.2, len: 0.07, amp: 0.55 }, { t: 0.05, noise: [3800, 900], q: 0.9, len: 0.13, amp: 1.0 }, { t: 0.05, thump: [230, 90], len: 0.08, amp: 0.28 }] },
  { dur: 0.24, parts: [{ t: 0, noise: [6200, 2200], q: 1.1, len: 0.08, amp: 0.5 }, { t: 0.06, noise: [3200, 700], q: 0.8, len: 0.15, amp: 1.0 }, { t: 0.06, thump: [200, 80], len: 0.09, amp: 0.3 }] },
  { dur: 0.2, parts: [{ t: 0, noise: [8000, 3200], q: 1.4, len: 0.05, amp: 0.5 }, { t: 0.035, noise: [4200, 1200], q: 1.0, len: 0.12, amp: 0.95 }, { t: 0.035, thump: [260, 110], len: 0.06, amp: 0.25 }] },
  { dur: 0.3, parts: [{ t: 0, noise: [6800, 2400], q: 1.2, len: 0.06, amp: 0.5 }, { t: 0.04, noise: [3600, 900], q: 0.9, len: 0.1, amp: 0.9 }, { t: 0.13, noise: [4000, 1000], q: 0.9, len: 0.12, amp: 0.8 }, { t: 0.04, thump: [220, 90], len: 0.07, amp: 0.25 }] },
];
let snesSlashBufs = null, snesEcho = null;
function renderSnesSlash(def) {
  const n = Math.floor(SNES_RATE * def.dur), out = new Float32Array(n);
  for (const p of def.parts) {
    const s0 = Math.floor(p.t * SNES_RATE), len = Math.floor(p.len * SNES_RATE);
    let ic1 = 0, ic2 = 0, phase = 0;
    for (let i = 0; i < len && s0 + i < n; i++) {
      const k = i / len;
      const env = Math.min(1, i / (SNES_RATE * 0.004)) * Math.pow(1 - k, p.ring ? 1.6 : 2.2);
      let v = 0;
      if (p.noise) { // 周波数がスイープするバンドパス（高い周波数でも発散しない形のステートバリアブルフィルター）
        const f = Math.min(p.noise[0] * Math.pow(p.noise[1] / p.noise[0], k), SNES_RATE * 0.45);
        const g = Math.tan(Math.PI * f / SNES_RATE), kk = 1 / p.q;
        const a1 = 1 / (1 + g * (g + kk)), a2 = g * a1, a3 = g * a2;
        const x = Math.random() * 2 - 1;
        const v3 = x - ic2, v1 = a1 * ic1 + a2 * v3, v2 = ic2 + a2 * ic1 + a3 * v3;
        ic1 = 2 * v1 - ic1; ic2 = 2 * v2 - ic2;
        v = v1 * 1.5;
      } else if (p.ring) { // 金属の響き：倍音をずらした3つの正弦波
        const tt = i / SNES_RATE;
        v = Math.sin(2 * Math.PI * p.ring * tt) * 0.6 + Math.sin(2 * Math.PI * p.ring * 2.76 * tt) * 0.3 + Math.sin(2 * Math.PI * p.ring * 5.4 * tt) * 0.15;
      } else if (p.thump) {
        const f = p.thump[0] * Math.pow(p.thump[1] / p.thump[0], k);
        phase += 2 * Math.PI * f / SNES_RATE; v = Math.sin(phase);
      }
      out[s0 + i] += v * env * p.amp;
    }
  }
  let peak = 0;
  for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(out[i]));
  const norm = peak > 0 ? 0.9 / peak : 1;
  for (let i = 0; i < n; i++) out[i] = Math.round(out[i] * norm * 64) / 64;
  const buf = audioCtx.createBuffer(1, n, SNES_RATE);
  buf.getChannelData(0).set(out);
  return buf;
}
function getSnesEcho() { // SPC風の短いエコー（こもった残響が数回返ってくる）
  if (snesEcho && snesEcho.ctx === audioCtx) return snesEcho;
  const input = audioCtx.createGain();
  const delay = audioCtx.createDelay(0.5); delay.delayTime.value = 0.085;
  const fb = audioCtx.createGain(); fb.gain.value = 0.32;
  const lp = audioCtx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1600;
  const wet = audioCtx.createGain(); wet.gain.value = 0.35;
  input.connect(delay); delay.connect(lp); lp.connect(fb); fb.connect(delay); lp.connect(wet); wet.connect(audioCtx.destination);
  snesEcho = { ctx: audioCtx, input };
  return snesEcho;
}
function playSnesSlash(i, rate) { // rate：再生の高さ（指定なしは少しだけ揺らす）
  if (!audioCtx || isBattleSfxMuted()) return;
  if (!snesSlashBufs || snesSlashBufs.ctx !== audioCtx) snesSlashBufs = { ctx: audioCtx, list: SNES_SLASHES.map(renderSnesSlash) };
  const src = audioCtx.createBufferSource(); src.buffer = snesSlashBufs.list[i];
  src.playbackRate.value = rate || 0.9 + Math.random() * 0.08; // 毎回少しだけ高さを揺らす（高くなりすぎないよう下寄り）
  const gain = audioCtx.createGain(); gain.gain.value = 0.55 * (game.sfxVolume ?? 0.7);
  src.connect(gain); gain.connect(audioCtx.destination); gain.connect(getSnesEcho().input);
  src.start();
}
const ATTACK_SOUNDS = SNES_SLASHES.map((_, i) => () => playSnesSlash(i));
let lastAttackSound = -1;
function playPlayerAttackSound() { if (rushingNow) playRushHitSound(); else playEnemyHitSound(); } // 自キャラの攻撃：体当たりは打撃音、接近戦は斬撃音
function playEnemyHitSound() {
  let i = Math.floor(Math.random() * ATTACK_SOUNDS.length);
  if (i === lastAttackSound) i = (i + 1) % ATTACK_SOUNDS.length; // 同じ音が続かないように
  lastAttackSound = i;
  ATTACK_SOUNDS[i]();
}
// 体当たり（引っぱり攻撃）が当たった音：剣の斬撃とは違う、体ごとぶつかる重い「ドゴッ」
function playRushHitSound() {
  if (!audioCtx || isBattleSfxMuted()) return;
  const t0 = audioCtx.currentTime, v = game.sfxVolume ?? 0.7;
  const len = Math.floor(audioCtx.sampleRate * 0.16), buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
  const n = audioCtx.createBufferSource(); n.buffer = buf;
  const lp = audioCtx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(2400, t0); lp.frequency.exponentialRampToValueAtTime(300, t0 + 0.14);
  const g = audioCtx.createGain(); g.gain.setValueAtTime(0.5 * v, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.16);
  n.connect(lp); lp.connect(g); g.connect(audioCtx.destination); n.start(t0);
  thump(170, 42, 0.26, 0.55); // 腹に響く低音
  thump(95, 60, 0.07, 0.18, 'square'); // ゴツッという芯
}
function playPlayerHitSound() { playNoiseBurst(0.1, 0.28); playTone(150, 0.16, 'sawtooth', 0.22, 70); }
function playPlayerWallSound() { playTone(560, 0.07, 'sine', 0.07, 760); }
function playEnemyWallSound() { playTone(320, 0.07, 'triangle', 0.07, 200); }
const CHAIN_SCALE = [0, 2, 4, 7, 9];
// 落ちものパズルの連鎖音：叩くたびに「ピロン↑」と音階が上がり、段が進むと和音ときらめきが重なる
const PUZZLE_CHAIN_SEMIS = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24];
function playPuzzleChain(n) {
  if (!audioCtx || isBattleSfxMuted()) return;
  const i = Math.min(n - 1, PUZZLE_CHAIN_SEMIS.length - 1), heat = Math.min(1, (n - 1) / 14);
  const f = 196 * Math.pow(2, PUZZLE_CHAIN_SEMIS[i] / 12); // G3から上がっていく
  const v = (game.sfxVolume ?? 0.7) * 1.4, t0 = audioCtx.currentTime;
  const note = (freq, at, len, type, gain) => {
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t0 + at);
    g.gain.setValueAtTime(0.0001, t0 + at); g.gain.exponentialRampToValueAtTime(gain * v, t0 + at + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t0 + at + len);
    o.connect(g); g.connect(audioCtx.destination); o.start(t0 + at); o.stop(t0 + at + len + 0.02);
  };
  note(f / 2, 0, 0.22, 'sine', 0.16 * (1 - heat * 0.6)); // ズン（さらに1オクターブ下の重低音）
  note(f, 0, 0.09, 'square', 0.06);            // ピ
  note(f * 1.5, 0.055, 0.16, 'square', 0.055); // ロン（5度上）
  note(f * 2, 0.055, 0.2, 'sine', 0.05 + heat * 0.04); // 澄んだ倍音
  if (n >= 5) note(f * 1.26, 0.055, 0.16, 'triangle', 0.05); // 長3度を重ねて和音に
  if (n >= 10) [2.5, 3, 4].forEach((m, k) => note(f * m, 0.11 + k * 0.035, 0.12, 'sine', 0.03)); // キラキラ
}
// オート強化の1レベルアップ音：短い「ピロリン↑」のパワーアップ音（毎回同じ高さ）
function playPowerUpBlip() {
  if (!audioCtx || isBattleSfxMuted()) return;
  const v = game.sfxVolume ?? 0.7, t0 = audioCtx.currentTime;
  [523.3, 659.3, 784, 1046.5].forEach((f, i) => {
    const at = t0 + i * 0.045, o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = i === 3 ? 'triangle' : 'square'; o.frequency.setValueAtTime(f, at);
    if (i === 3) o.frequency.exponentialRampToValueAtTime(f * 1.06, at + 0.14);
    const len = i === 3 ? 0.18 : 0.06, peak = (i === 3 ? 0.14 : 0.05) * v;
    g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(peak, at + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, at + len);
    o.connect(g); g.connect(audioCtx.destination); o.start(at); o.stop(at + len + 0.02);
  });
}
function playChainSound(n) {
  const step = Math.min(n - 2, 14); // 2コンボ目から始めて最大15段
  const semis = Math.floor(step / CHAIN_SCALE.length) * 12 + CHAIN_SCALE[step % CHAIN_SCALE.length];
  const freq = 523.25 * Math.pow(2, semis / 12); // C5 から上昇
  const heat = Math.min(1, step / 14);
  playTone(freq, 0.08 + heat * 0.06, 'triangle', 0.12 + heat * 0.08, freq * 1.06);
  if (step >= 4) playTone(freq * 1.5, 0.07 + heat * 0.05, 'sine', 0.05 + heat * 0.05);           // 5度上の和音
  if (step >= 9) setTimeout(() => playTone(freq * 2, 0.06, 'square', 0.04 + heat * 0.03), 40); // きらめき
}
function playStageClearSound() {
  if (activeTabCache !== 'game') return; // ゲーム画面以外ではクリア音を鳴らさない
  // 軽い連鎖音：ポポポポン♪と駆け上がる（連鎖音と同じ音色を小さめに）
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((f, i) => setTimeout(() => {
    playTone(f, 0.07, 'triangle', 0.09, f * 1.05);
    if (i === notes.length - 1) { playTone(f * 1.5, 0.12, 'sine', 0.05); setTimeout(() => playTone(f * 2, 0.08, 'square', 0.025), 40); } // 最後だけ和音ときらめき
  }, i * 55));
}
const WARNING_BEEPS = 3, WARNING_BEEP_GAP_MS = 420;
function playWarningSound() {
  for (let i = 0; i < WARNING_BEEPS; i++) setTimeout(() => { playTone(200, 0.14, 'square', 0.22); setTimeout(() => playTone(160, 0.14, 'square', 0.22), 150); }, i * WARNING_BEEP_GAP_MS); // 「ビーボー」を3回鳴らしたらボス出現
}
// やられボイス：のこぎり波の声帯音をフォルマント（母音の共鳴）フィルタに通して「ぐわぁっ」などをしゃべらせる
const VOWEL_F = { a: [800, 1200, 2600], i: [300, 2300, 3000], u: [350, 1300, 2500], e: [500, 1800, 2500], o: [500, 850, 2500] };
const DEATH_VOICES = [ // 若めでコミカルなやられ声（高めの声で語尾がへなへなと下がる）
  { seg: [['u', 0.07], ['a', 0.34]], p: [430, 530, 290], noise: [] },                                   // うわぁ〜っ
  { seg: [['i', 0.06], ['a', 0.13], ['u', 0.14]], p: [470, 540, 360], noise: [[0.19, 0.05, 1300]] },     // ぎゃふん
  { seg: [['i', 0.4]], p: [590, 650, 360], noise: [[0, 0.06, 3600]] },                                  // ひぃ〜ん
  { seg: [['a', 0.1], ['i', 0.08], ['a', 0.28]], p: [420, 480, 310], noise: [] },                       // あいた〜
];
const DEATH_VOICE_FORMANT = 1.18; // 声道を短くして若い声に
function playDeathVoice() {
  if (!audioCtx || isBattleSfxMuted()) return;
  const v = DEATH_VOICES[Math.floor(Math.random() * DEATH_VOICES.length)];
  const t0 = audioCtx.currentTime + 0.04 + (v.gap || 0), dur = v.seg.reduce((n, x) => n + x[1], 0), vol = 0.32 * game.sfxVolume;
  const src = audioCtx.createOscillator(); src.type = 'sawtooth';
  src.frequency.setValueAtTime(v.p[0], t0); src.frequency.linearRampToValueAtTime(v.p[1], t0 + dur * 0.25); src.frequency.exponentialRampToValueAtTime(v.p[2], t0 + dur);
  const lfo = audioCtx.createOscillator(), lg = audioCtx.createGain(); lfo.frequency.value = 9; lg.gain.value = 14; // 震え声で情けなく lfo.connect(lg); lg.connect(src.frequency);
  const env = audioCtx.createGain();
  env.gain.setValueAtTime(0.0001, t0); env.gain.exponentialRampToValueAtTime(vol, t0 + 0.03);
  env.gain.setValueAtTime(vol, t0 + dur * (v.cut ? 0.85 : 0.5)); env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur + (v.cut ? 0.02 : 0.15));
  [1, 0.5, 0.25].forEach((amp, k) => {
    const f = audioCtx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 9 - k * 2;
    let t = t0; f.frequency.setValueAtTime(VOWEL_F[v.seg[0][0]][k] * DEATH_VOICE_FORMANT, t);
    v.seg.forEach(([vw, d]) => { f.frequency.linearRampToValueAtTime(VOWEL_F[vw][k] * DEATH_VOICE_FORMANT, t + Math.min(0.05, d)); t += d; });
    const g = audioCtx.createGain(); g.gain.value = amp * 3; src.connect(f); f.connect(g); g.connect(env);
  });
  env.connect(audioCtx.destination);
  src.start(t0); lfo.start(t0); src.stop(t0 + dur + 0.2); lfo.stop(t0 + dur + 0.2);
  v.noise.forEach(([d, len, fq]) => filteredNoise(0.04 + d, len, 0.25, fq, 1.5));
}
function playDeathSound() {
  // 悲鳴の代わりに、レトロゲームのやられ音：「ピロロロ…」と半音ずつ転げ落ちて、最後に「ポォン」と力尽きる
  if (audioCtx && !isBattleSfxMuted()) {
    [880, 830.6, 784, 740, 698.5, 659.3, 622.3, 587.3, 554.4, 523.3, 493.9, 466.2].forEach((f, i) => setTimeout(() => playTone(f, 0.07, 'square', 0.07, f * 0.94), 120 + i * 45));
    setTimeout(() => playTone(196, 0.5, 'triangle', 0.14, 98), 120 + 12 * 45 + 20);
  }
  thump(110, 28, 0.55, 0.85);                                  // 重い衝撃
  noiseSweep(0.45, 2600, 90, 'lowpass', 0.8, 0.7);              // 砕けるノイズ
  noiseSweep(0.12, 5000, 1500, 'bandpass', 1.2, 0.35);          // 打撃の破裂音
  playTone(330, 0.7, 'sawtooth', 0.16, 45);                     // 力が抜けて落ちる音
  setTimeout(() => thump(70, 30, 0.35, 0.5, 'triangle'), 180);  // 地面に落ちる
}
function playCountdownTick(sec) {
  const urgent = sec <= 3;
  playTone(urgent ? 1320 : 880, urgent ? 0.14 : 0.09, 'square', urgent ? 0.13 : 0.08);
  if (urgent) setTimeout(() => playTone(1760, 0.06, 'square', 0.06), 70);
}
function playBossClearSound() {
  if (activeTabCache !== 'game') return;
  thump(110, 40, 0.5, 0.7);
  noiseSweep(1.1, 9000, 2500, 'highpass', 0.6, 0.35);                 // シンバル
  [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98].forEach((f, i) => setTimeout(() => playTone(f, 0.18, 'square', 0.1), i * 70));
  setTimeout(() => {
    [523.25, 659.25, 783.99, 1046.5].forEach(f => playTone(f, 1.1, 'triangle', 0.1));   // ジャーン（和音）
    playTone(261.63, 1.1, 'sawtooth', 0.06);
    noiseSweep(0.8, 7000, 2000, 'highpass', 0.6, 0.25);
  }, 460);
  [1046.5, 1318.5, 1567.98, 2093].forEach((f, i) => setTimeout(() => playTone(f, 0.12, 'sine', 0.07), 1000 + i * 90)); // キラキラ
  playBossFanfare(1350);
}
function playBossFanfare(delay) {
  const N = { G4: 392, C5: 523.25, E5: 659.25, G5: 783.99, A5: 880, B5: 987.77, C6: 1046.5, D6: 1174.66, E6: 1318.5 };
  const melody = [['G4', 0.13], ['C5', 0.13], ['E5', 0.13], ['G5', 0.38], ['E5', 0.13], ['G5', 0.38], ['A5', 0.13], ['B5', 0.13], ['C6', 0.13], ['E6', 1.3]];
  let t = delay;
  melody.forEach(([n, d]) => {
    setTimeout(() => { playTone(N[n], d * 1.05, 'square', 0.09); playTone(N[n] / 2, d * 1.05, 'triangle', 0.08); }, t);
    t += d * 1000;
  });
  const last = t - 1300;
  setTimeout(() => { [523.25, 659.25, 783.99, 1046.5].forEach(f => playTone(f, 1.4, 'sawtooth', 0.035)); playTone(130.81, 1.4, 'triangle', 0.14); noiseSweep(1.2, 9000, 2500, 'highpass', 0.6, 0.3); }, last);
}
function showBossClearFx(stage) {
  const wrapEl = document.querySelector('.arena-wrap');
  if (!wrapEl) return;
  const fx = document.createElement('div');
  fx.className = 'boss-clear-fx';
  const cols = ['#ffd76b', '#ff5c8a', '#64e8ff', '#7ee787', '#c792ea', '#ffffff'];
  let conf = '';
  for (let i = 0; i < 46; i++) conf += `<i style="left:${Math.random() * 100}%;background:${cols[i % cols.length]};--dx:${(Math.random() - 0.5) * 140}px;--rot:${Math.random() * 900 - 450}deg;animation-duration:${1.8 + Math.random() * 1.4}s;animation-delay:${0.2 + Math.random() * 0.5}s"></i>`;
  fx.innerHTML = `<div class="bcf-rays"></div><div class="bcf-text"><div class="bcf-main"><img class="bcf-banner" src="assets/img/ui/questClear.webp" alt="BOSS DEFEATED!"></div><div class="bcf-sub">🎉 おめでとう！ ${stage}階 突破 🎉</div></div><div class="bcf-confetti">${conf}</div>`;
  wrapEl.appendChild(fx);
  setTimeout(() => fx.classList.add('out'), 3000);
  setTimeout(() => fx.remove(), 3600);
}
function playSwarmSound() {
  if (activeTabCache !== 'game') return;
  const note = (f, dur, delay, g) => setTimeout(() => { playTone(f, dur, 'square', g); playTone(f / 2, dur, 'sawtooth', g * 0.6); }, delay);
  note(196, 0.16, 0, 0.14);      // デ
  note(185, 0.16, 190, 0.14);    // デ
  note(131, 0.9, 400, 0.18);     // ドーン
  setTimeout(() => { thump(80, 35, 0.8, 0.6); noiseSweep(0.5, 800, 80, 'lowpass', 0.7, 0.3); }, 400);
}
function playCoinGainSound() { playTone(1046.5, 0.08, 'square', 0.12, 1318.5); }
function playLoginBonusSound() {
  [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => setTimeout(() => playTone(f, 0.2, 'sine', 0.16, f * 1.1), i * 100));
}
function playSlotTickSound() { playTone(1600, 0.04, 'square', 0.08); }
function playSlotSettleSound() { playTone(880, 0.12, 'triangle', 0.18, 1320); playNoiseBurst(0.15, 0.1); }
function playRebirthSound() {
  [261.63, 329.63, 392, 523.25, 659.25].forEach((f, i) => setTimeout(() => playTone(f, 0.45, 'sine', 0.12, f * 1.12), i * 130));
}
function playRunStartSound() {
  playNoiseBurst(0.35, 0.12);
  playTone(180, 0.4, 'sawtooth', 0.12, 720);
  [392, 523.25, 659.25].forEach((f, i) => setTimeout(() => playTone(f, 0.14, 'square', 0.12), 380 + i * 110));
  setTimeout(() => {
    [523.25, 659.25, 783.99, 1046.5].forEach(f => playTone(f, 0.6, 'triangle', 0.1));
    playNoiseBurst(0.2, 0.08);
  }, 380 + 3 * 110);
}
function playErrorSound() {
  playTone(220, 0.09, 'square', 0.16, 160);
  setTimeout(() => playTone(160, 0.13, 'square', 0.16, 100), 90);
}
function playCloneSound() {
  playNoiseBurst(0.04, 0.05);
  playTone(520, 0.05, 'sine', 0.09, 760);
  setTimeout(() => playTone(920, 0.08, 'sine', 0.1, 1200), 35);
}
let lastRegisterAt = 0;
function playRegisterSound() {
  const now = performance.now(), rapid = now - lastRegisterAt < 150; // 長押しの連続購入中はベルだけ
  lastRegisterAt = now;
  if (!rapid) {
    thump(110, 55, 0.12, 0.25);                                   // ほんのり下支えする低音
    playTone(2637, 0.04, 'square', 0.05);                         // 小銭「チャ」
    setTimeout(() => playTone(3520, 0.04, 'square', 0.05), 35);   // 「ッ」
  }
  setTimeout(() => { // 「チーン♪」：高く澄んだベルを2音で駆け上がり、長めに響かせる
    playTone(2093, 0.18, 'sine', 0.1);
    setTimeout(() => {
      playTone(3136, 0.7, 'sine', 0.14);
      playTone(3136 * 2, 0.4, 'sine', 0.03);
      playTone(3136 * 2.76, 0.25, 'sine', 0.02);
      playTone(1568, 0.5, 'triangle', 0.06);
    }, 60);
  }, rapid ? 0 : 70);
}
function playUpgradeSound() {
  playTone(660, 0.08, 'triangle', 0.12, 880);
  setTimeout(() => playTone(990, 0.12, 'triangle', 0.14), 70);
}
function playSpecialSound() {
  playTone(130, 0.35, 'sawtooth', 0.2, 700);
  setTimeout(() => playTone(880, 0.25, 'square', 0.16), 90);
}
function playMeteorImpactSound() {
  playNoiseBurst(0.6, 0.45);
  playTone(140, 0.7, 'sawtooth', 0.32, 30);
  playTone(90, 0.9, 'square', 0.22, 25);
  playTone(1800, 0.12, 'square', 0.14, 300);
  setTimeout(() => { playNoiseBurst(0.5, 0.25); playTone(60, 0.8, 'triangle', 0.25, 28); }, 120);
  setTimeout(() => playNoiseBurst(0.7, 0.12), 320);
}
function playAccelSound() {
  playTone(220, 0.25, 'sawtooth', 0.18, 900);
  playNoiseBurst(0.15, 0.12);
}
function playHealSound() {
  [523.25, 659.25, 880].forEach((f, i) => setTimeout(() => playTone(f, 0.2, 'sine', 0.14), i * 70));
}
function playBarrierSound() {
  playTone(220, 0.3, 'sine', 0.16, 660);
  [440, 554.37, 659.25].forEach((f, i) => setTimeout(() => playTone(f, 0.15, 'triangle', 0.1), i * 50));
}
function playBarrierHitSound() { playTone(1200, 0.05, 'sine', 0.1, 800); }
function playMissSound() { playTone(900, 0.08, 'sine', 0.08, 1500); }
// クリティカル専用：こちらの会心は「ズバァン！＋キィィン」と鋭い斬撃と金属の響きが駆け上がる
function playCritSound() { // 会心の一撃：一瞬ためてから「ズバァン！」と炸裂し、レトロな「ピロリン↑」で決める
  if (!audioCtx || isBattleSfxMuted()) return;
  filteredNoise(0, 0.05, 0.4, 5000, 0.6, 'highpass');                  // パシッ（閃光のような鋭い一撃）
  filteredNoise(0.02, 0.18, 0.35, 1800, 0.9, 'bandpass');              // ズバァッ（大きく切り裂く）
  thump(220, 38, 0.32, 0.6);                                           // ドンッ（腹に響く重い手応え）
  thump(120, 55, 0.12, 0.2, 'square', 0.01);                           // ガツッという芯
  [1047, 1319, 1568, 2093].forEach((f, i) => thump(f, f, 0.06, 0.05, 'square', 0.05 + i * 0.035)); // ピロリン↑（会心のファンファーレ）
  [3136, 4186].forEach((f, i) => thump(f, f * 0.995, 0.4, 0.03, 'sine', 0.19 + i * 0.03)); // キラーン（余韻）
}
// 敵の会心を受けた時：鈍く重い「ドゴォッ」と下がるうなり
function playEnemyCritSound() {
  if (!audioCtx || isBattleSfxMuted()) return;
  thump(110, 32, 0.35, 0.6);
  filteredNoise(0, 0.14, 0.3, 700, 0.8, 'lowpass');
  thump(330, 70, 0.3, 0.09, 'sawtooth', 0.02);
}
function playHomingLaunchSound() {
  for (let i = 0; i < HOMING_MISSILE_COUNT; i++) setTimeout(() => { playTone(700 + i * 60, 0.12, 'sawtooth', 0.07, 1400); playNoiseBurst(0.05, 0.05); }, i * 60);
}
function playPoisonActivateSound() {
  [220, 185, 247, 196].forEach((f, i) => setTimeout(() => playTone(f, 0.18, 'sine', 0.14, f * 0.7), i * 70));
  playNoiseBurst(0.25, 0.06);
}
function playParalyzeSound() {
  playNoiseBurst(0.35, 0.3);
  playTone(1800, 0.25, 'sawtooth', 0.14, 120);
  [0, 50, 110, 170].forEach(d => setTimeout(() => playTone(900 + Math.random() * 900, 0.05, 'square', 0.08), d));
}
function playAtkUpSound() {
  playTone(150, 0.35, 'sawtooth', 0.18, 420);
  [392, 523.25, 659.25, 783.99].forEach((f, i) => setTimeout(() => playTone(f, 0.12, 'square', 0.1), 120 + i * 70));
}
function playSleepSound() {
  [659.25, 523.25, 392, 329.63].forEach((f, i) => setTimeout(() => playTone(f, 0.35, 'sine', 0.1, f * 0.98), i * 160));
}
function playWakeHitSound() { playNoiseBurst(0.18, 0.25); playTone(520, 0.2, 'square', 0.16, 1400); }
function playPoisonTickSound() { playTone(330, 0.08, 'sine', 0.07, 200); }
const COUNTER_DMG_MULT = 1.2; // カウンターのダメージは攻撃力の1.2倍
function playCounterSound() { playTone(1200, 0.08, 'square', 0.14, 600); setTimeout(() => playTone(700, 0.12, 'sawtooth', 0.12, 1400), 60); }
function playHomingHitSound() { playNoiseBurst(0.1, 0.18); playTone(260, 0.12, 'square', 0.12, 120); }
function playBarrierBreakSound() { playNoiseBurst(0.18, 0.2); playTone(900, 0.25, 'square', 0.14, 180); }

function getEffectiveSpeed() {
  return Date.now() < accelEndAt ? 2.5 : gameSpeed;
}

const EMOJI_ENEMIES = ['👺', '💀', '👻', '🎃', '🐉', '🦂', '🦇', '👾', '🧟', '🦖', '🐲', '👑', '🐧', '🪼', '🛢️', '🌕', '⚡', '🥬', '🧙', '🪖', '🔪', '🌑', '⚫', '🩶', '🩷', '🔷', '🦕', '🪙', '🟩', '🐟', '🦒', '🥒', '🦎', '🦀', '🥈', '🌈', '🟨', '🦋', '🔥', '🛡️', '🗡️', '🪲', '🐻', '🦞', '🦫', 'm_flameY', 'm_dropSlime', 'm_shadowFlame', 'm_sproutling', 'm_rockling', 'm_stumpling', 'm_crystalElem', 'm_redMush', 'm_blueMush', 'm_seedling', 'm_treeling', 'm_leafling', 'm_fireKid', 'm_blueFireKid', 'm_darkKid', 'm_treeGuard', 'm_maneater', 'm_cactusKid', 'm_dinoPlant', 'm_redMush2', 'm_greenMush', 'm_ghostMush', 'm_acorn', 'm_greenSprout', 'm_goblinSpear', 'm_redGoblin', 'm_blueGoblin', 'm_skelSword', 'm_skelShield', 'm_skelDagger', 'm_orcKnight', 'm_ghoul', 'm_mummy', 'm_sheetGhost', 'm_shade', 'm_willWisp', 'm_candle', 'm_purpleBat', 'm_redBat', 'm_direWolf', 'm_whiteWolf', 'm_boar', 'm_redBoar', 'm_rat', 'm_whiteRat', 'm_squirrel', 'm_chick', 'm_owl', 'm_hippoChick', 'm_bigBat', 'm_vampBat', 'm_hornet', 'm_bee', 'm_blueButterfly', 'm_moth', 'm_dragonfly', 'm_spider', 'm_scorpionS', 'm_crab', 'm_hermit', 'm_blueHermit', 'm_jelly', 'm_squid', 'm_octopus', 'm_woodSpirit', 'm_mossMonk', 'm_rose', 'm_maneater2', 'm_maneater3', 'm_sproutSlime', 'm_cactusFlower', 'm_jackO', 'm_scarecrow', 'm_scarecrow2', 'm_bookEye', 'm_mimicS', 'm_chestKid', 'm_clayGolem', 'm_crystalSoldier', 'm_mudGolem', 'm_snowGolem', 'm_crystalBeast', 'm_magmaKid', 'm_tornado', 'm_cloud', 'm_frostCloud', 'm_darkBall', 'm_voidBall', 'm_starKid', 'm_blackHole', 'm_ironMask', 'm_redArmor', 'm_axeArmor', 'm_spearArmor', 'm_assassin', 'm_shinobi', 'm_witchKid', 'm_cultist', 'm_plagueDoc', 'm_blackMage', 'm_archer', 'm_cannoneer', 'm_automaton', 'm_redDrake', 'm_blueDrake', 'm_greenDrake', 'm_griffon', 'm_eagle', 'm_hawk', 'm_tortoise', 'm_crystalTortoise', 'm_spikeBeast', 'm_serpent', 'm_worm', 'm_blackSpider', 'm_purpleSpider', 'm_crystalSlime', 'm_holySlime'];
const BOSS_EMOJIS = ['⚔️', '👹', '💀', '🦖', '🐲', '🦔', '⚰️', '🦍', '💪', '🫧', '🌋', '🧊', '🗿', '🩸', '😇', '👀', '🐙', '☠️', '🐺', '🌳', '🧜', '🪓', '🔮', '🖤', '📦', '🏮', '🪨', '🪶', '❄️', '🌊', '🌌', '🧸', '⚜️', '☄️', '🧿', '💘', '🐋', '🕯️', '🦑', '🎎', '🐍', '🥇', '🏇', '🛕', '🌺', '🪐', '🔆', '🟥', '🐴', '☀️', '🐚', '🦚', '⌛', '🎙️', '🦉', '🎒', '🐶', '🌞', '🟪', '🍫', '🏁', '🥀', '🎍', '⚱️', '🛐', '🪑', '🌲', '🦴', '💙', '🦜', '🐊', '🫠'];
const TACKLE_TRADE_BOSS = '🦔';
let forcedBossEmoji = null; // デバッグ：次に出すボスを指定
let forcedEnemyKey = null;  // デバッグ：次に出す雑魚を図鑑キー（'shape:slimeBlood' など）で指定
const GIANT_BOSS_EVERY = 100;    // 激デカボスは100の倍数の階だけ
const GIANT_BOSS_RADIUS = 60;
const GIANT_BOSS_HP_MULT = 3;
const GIANT_BOSS_ATK_MULT = 1.4;
const GIANT_BOSS_REWARD_MULT = 3; // 撃破コイン・ジェムの倍率
let forcedGiantBoss = false;      // デバッグ：次のボスを激デカに
const TACKLE_TRADE_CHANCE = 0.4;
const TACKLE_TRADE_DMG_MULT = 1.5; // 相打ち時に自機が受けるダメージ（ボスの攻撃力比）
const SHAPE_ENEMY_NAMES = { spike: 'スライム', slimeOrange: 'オレンジスライム', slimeGreen: 'グリーンスライム', slimeBlood: 'ブラッドスライム', slimeChibi: 'チビスライム', slimeJumbo: 'ジャンボスライム', slimeSnowman: '雪だるまスライム', slimeDango: '三色団子スライム', slimeIce: 'ユキスライム', slimePink: 'サクラスライム', slimeMatcha: 'マッチャスライム', diamond: 'フレイムウィスプ', square: 'ワーム' };
const SHAPE_ENEMY_COLORS = { spike: '#ff5c6c', slimeOrange: '#ff9a2e', slimeGreen: '#4fd35a', slimeBlood: '#c8102e', slimeChibi: '#5cc8ff', slimeJumbo: '#b46cff', slimeSnowman: '#dff3ff', slimeDango: '#ff9ec4', slimeIce: '#dff3ff', slimePink: '#ff9ec4', slimeMatcha: '#9fd67a', diamond: '#ff9d4f', square: '#f46bd4' };
const EMOJI_ENEMY_NAMES = { 'm_crystalSlime': 'クリスタルスライム', 'm_holySlime': 'ホーリースライム', 'm_flameY': 'ひのたま', 'm_dropSlime': 'ドロップスライム', 'm_shadowFlame': 'かげぼうし', 'm_sproutling': 'めばえっこ', 'm_rockling': 'いわっころ', 'm_stumpling': 'こかぶ', 'm_crystalElem': 'クリスタルン', 'm_redMush': 'ベニテングン', 'm_blueMush': 'アオキノコ', 'm_seedling': 'ふたばっこ', 'm_treeling': 'きりかぶ兵', 'm_leafling': 'はっぱ小僧', 'm_fireKid': 'ほのおの子', 'm_blueFireKid': 'あおびの子', 'm_darkKid': 'やみの子', 'm_treeGuard': 'もりの番人', 'm_maneater': 'くいしんぼ花', 'm_cactusKid': 'サボテンくん', 'm_dinoPlant': 'ワニソウ', 'm_redMush2': 'あかキノコ', 'm_greenMush': 'みどりキノコ', 'm_ghostMush': 'おばけキノコ', 'm_acorn': 'どんぐり兵', 'm_greenSprout': 'みどりっこ', 'm_goblinSpear': 'ゴブリン兵', 'm_redGoblin': 'レッドゴブリン', 'm_blueGoblin': 'ブルーゴブリン', 'm_skelSword': 'がいこつ剣士', 'm_skelShield': 'がいこつ盾兵', 'm_skelDagger': 'がいこつ盗賊', 'm_orcKnight': 'オーク騎士', 'm_ghoul': 'グール', 'm_mummy': 'ミイラ男', 'm_sheetGhost': 'シーツおばけ', 'm_shade': 'くらやみ', 'm_willWisp': 'おにび', 'm_candle': 'しょくだい', 'm_purpleBat': 'むらさきコウモリ', 'm_redBat': 'あかコウモリ', 'm_direWolf': 'ダイアウルフ', 'm_whiteWolf': 'しろおおかみ', 'm_boar': 'いのしし', 'm_redBoar': 'あばれいのしし', 'm_rat': 'ドブネズミ', 'm_whiteRat': 'しろねずみ', 'm_squirrel': 'もふもふリス', 'm_chick': 'ひよこ兵', 'm_owl': 'みみずく', 'm_hippoChick': 'ヒポグリフの子', 'm_bigBat': 'おおコウモリ', 'm_vampBat': 'ちすいコウモリ', 'm_hornet': 'すずめばち', 'm_bee': 'ミツバチ兵', 'm_blueButterfly': 'あおちょう', 'm_moth': 'どくが', 'm_dragonfly': 'やんま', 'm_spider': 'ドクグモ', 'm_scorpionS': 'さそり', 'm_crab': 'あかガニ', 'm_hermit': 'やどかり', 'm_blueHermit': 'あおやどかり', 'm_jelly': 'クラゲ', 'm_squid': 'イカ', 'm_octopus': 'タコ', 'm_woodSpirit': 'もりのせい', 'm_mossMonk': 'こけぼうず', 'm_rose': 'ローズ', 'm_maneater2': 'ひとくい草', 'm_maneater3': 'どくくい草', 'm_sproutSlime': 'ふたばスライム', 'm_cactusFlower': 'はなサボテン', 'm_jackO': 'ジャックランタン', 'm_scarecrow': 'かかし', 'm_scarecrow2': 'かかし魔', 'm_bookEye': 'まどうしょ', 'm_mimicS': 'ひとくい箱', 'm_chestKid': 'たからばこ兵', 'm_clayGolem': 'つちにんぎょう', 'm_crystalSoldier': 'すいしょう兵', 'm_mudGolem': 'どろにんぎょう', 'm_snowGolem': 'ゆきだるま兵', 'm_crystalBeast': 'クリスタルビースト', 'm_magmaKid': 'ようがん魔人', 'm_tornado': 'つむじかぜ', 'm_cloud': 'くもっこ', 'm_frostCloud': 'しもぐも', 'm_darkBall': 'やみだま', 'm_voidBall': 'うずだま', 'm_starKid': 'ほしっこ', 'm_blackHole': 'ブラックホール', 'm_ironMask': 'てっかめん', 'm_redArmor': 'あかよろい', 'm_axeArmor': 'おのよろい', 'm_spearArmor': 'やりよろい', 'm_assassin': 'あんさつしゃ', 'm_shinobi': 'しのび', 'm_witchKid': 'みならい魔女', 'm_cultist': 'じゃきょう徒', 'm_plagueDoc': 'ペストいしゃ', 'm_blackMage': 'くろまどうし', 'm_archer': 'ゆみへい', 'm_cannoneer': 'ほうへい', 'm_automaton': 'からくり兵', 'm_redDrake': 'レッドドレイク', 'm_blueDrake': 'ブルードレイク', 'm_greenDrake': 'グリーンドレイク', 'm_griffon': 'グリフォン', 'm_eagle': 'おおわし', 'm_hawk': 'あかはやぶさ', 'm_tortoise': 'こうらガメ', 'm_crystalTortoise': 'すいしょうガメ', 'm_spikeBeast': 'トゲトゲ獣', 'm_serpent': 'へび', 'm_worm': 'ミミズ', 'm_blackSpider': 'くろグモ', 'm_purpleSpider': 'むらさきグモ', '🥬': 'ゴブリンスライム', '🧙': '魔女スライム', '🪖': 'バイキングスライム', '🔪': 'ナイフゴブリン', '🌑': '闇の魔導士', '⚫': 'ダークサイドスライム', '🩶': 'グレースライム', '🩷': 'ピンクスライム', '🔷': 'アオスライム', '🦕': 'チビドラゴン', '🪙': 'ゴールドスライム', '🟩': 'ミドリスライム', '🐟': '魚人', '🦒': 'ノビスライム', '🥒': 'キュウリ兵', '🦎': 'ソードリザード', '🦀': 'カニ娘', '🥈': 'シルバースライム', '🌈': 'レインボースライム', '🟨': 'キイロスライム', '🦋': 'ブルーバット', '🔥': 'ほのおの精', '💋': 'サキュバス', '🛡️': '鉄騎士', '🗡️': '狼剣士', '🪲': 'クワガタナイト', '🐻': 'フレイムベア', '🦞': 'レッドスコーピオン', '🦫': 'マーモット', '🧛': 'ヴァンパイア', '🌕': 'ワーウルフ', '⚡': 'フランケン', '💧': 'スライム娘', '👑': 'スライムキング', '🐧': 'ペンギン魔導士', '🪼': 'クラゲの歌姫', '🛢️': 'タルねこ', '👺': 'ゴブリン', '💀': 'スケルトン', '👻': 'ゴースト', '🎃': 'カボチャヘッド', '🐉': 'ドラゴン', '🦂': 'コブラ', '🦇': 'コウモリ', '👾': 'メタルスライム', '🧟': 'ゾンビ', '🦖': 'サラマンダー', '🐲': 'ワイバーン' };
const BOSS_ENEMY_NAMES = { '🌋': '煉獄竜', '🧊': '氷晶竜', '🗿': '古代ゴーレム', '🩸': '血塗れの覇王', '😇': '熾天の守護者', '👀': '万眼の魔球', '🐙': '深淵のクラーケン', '☠️': '骸骨王', '🐺': '地獄の番犬', '🌳': '古樹の守り神', '🧜': '海の魔女セイレーン', '🪓': 'オーガキング', '🔮': '闇の魔女王', '🖤': '冥府の黒騎士', '📦': 'ミミック', '🏮': '雪女', '🪨': '苔むした巨人', '🪶': '不死鳥', '❄️': '氷の女王', '🌊': '嵐の龍神', '🌌': '虚空の大食らい', '🧸': '呪いのぬいぐるみ', '⚜️': '天秤の聖騎士', '☄️': '溶岩魔人', '🧿': '晶石の集合体', '💘': '小悪魔の姫', '🐋': '天空の鯨', '🕯️': '冥府の刈り手', '🦑': '深きものの王', '🎎': '桜祭りの剣姫', '🐍': '砂漠の蛇女王', '🥇': '黄金竜', '🏇': '竜騎の二人', '🛕': '城塞ゴーレム', '🌺': '食花のドリアード', '🪐': '四元の魔女王', '🔆': '聖剣の戦乙女', '🟥': '紅蓮の女騎士', '🐴': '黒馬のヴァルキリー', '☀️': '太陽の巫女', '🐚': '海神の人魚姫', '🦚': '黒翼の竜女帝', '⌛': '時の魔女', '🎙️': '配信勇者', '🦉': '戦女神アテナ', '🎒': '新入生番長', '🐶': '柴犬ルーン戦士', '🌞': '黄金竜翼の熾天使', '🟪': '紫焔の魔剣姫', '🍫': 'ショコラ魔王女', '🏁': '暴走ジョッキー騎士', '🥀': '黒翼の血剣女帝', '🎍': '迎春の姫騎士', '⚱️': '終焉の聖女', '🛐': '聖十字の天使騎士', '🪑': '玉座の女騎士団長', '🌲': '翼竜熊ドラグベア', '🦴': '腐竜ネクロドラゴン', '💙': '蒼炎の剣姫', '🦜': '炎翼のハーピー女王', '🐊': '蛇魔女ラミア', '🫠': 'ボススライム', '⚔️': '漆黒の騎士', '🫧': '超ジャンボスライム', '💪': 'マッチョスライム', '👁️': '百目の少女', '🕸️': '絡新婦', '🪦': '井戸の怨霊', '🦍': 'ゴリタウロス', '⚰️': '死神', '😈': '魔王', '👹': 'デーモンロード', '💀': '死霊王リッチ', '🦖': '暗黒竜', '🐲': '蒼き竜帝', '🦔': '針鎧の王' };
