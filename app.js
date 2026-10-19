const fileInput = document.querySelector('#audioFile');
const audio = document.querySelector('#audio');
const fileName = document.querySelector('#fileName');
const lyricsInput = document.querySelector('#lyricsInput');
const lyricsView = document.querySelector('#lyricsView');
const timeReadout = document.querySelector('#timeReadout');
let objectUrl = null;
let lines = [];

const fmt = (s) => {
  s = Math.max(0, Number(s) || 0);
  return `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(Math.floor(s % 60)).padStart(2,'0')}`;
};

fileInput.addEventListener('change', () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  if (objectUrl) URL.revokeObjectURL(objectUrl);
  objectUrl = URL.createObjectURL(file);
  audio.src = objectUrl;
  fileName.textContent = `${file.name} · ${(file.size / 1048576).toFixed(1)} MB`;
});

document.querySelector('#buildBtn').addEventListener('click', () => {
  const text = lyricsInput.value.trim();
  if (!audio.src) return alert('Choose an audio file first.');
  if (!text) return alert('Paste lyrics first. Automatic transcription is not connected in this starter yet.');
  const lyricLines = text.split(/\r?\n/).map(x => x.trim()).filter(Boolean);
  const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : lyricLines.length * 4;
  const spacing = duration / lyricLines.length;
  lines = lyricLines.map((text, i) => ({text, start: i * spacing, end: Math.min(duration, (i + 1) * spacing)}));
  renderLines();
});

document.querySelector('#clearBtn').addEventListener('click', () => {
  lyricsInput.value = '';
  lines = [];
  renderLines();
});

function renderLines() {
  lyricsView.innerHTML = '';
  if (!lines.length) {
    lyricsView.innerHTML = '<p class="empty">Choose a song and add lyrics to begin.</p>';
    return;
  }
  lines.forEach((line, i) => {
    const row = document.createElement('div');
    row.className = 'lyric-line';
    row.dataset.index = i;
    const stamp = document.createElement('span');
    stamp.className = 'timestamp';
    stamp.textContent = fmt(line.start);
    const lyric = document.createElement('span');
    lyric.className = 'lyric-text';
    lyric.textContent = line.text;
    const input = document.createElement('input');
    input.className = 'line-time';
    input.type = 'number';
    input.min = '0';
    input.step = '0.1';
    input.value = line.start.toFixed(1);
    input.title = 'Edit line start time in seconds';
    input.setAttribute('aria-label', `Start time for line ${i + 1}, in seconds`);
    input.addEventListener('change', () => {
      line.start = Math.max(0, Number(input.value) || 0);
      line.start = Math.min(line.start, Number.isFinite(audio.duration) ? audio.duration : line.start);
      line.start = Number(line.start.toFixed(2));
      stamp.textContent = fmt(line.start);
      input.value = line.start;
      lines.sort((a,b) => a.start - b.start);
      renderLines();
    });
    row.append(stamp, lyric, input);
    row.addEventListener('click', (e) => {
      if (e.target === input) return;
      audio.currentTime = line.start;
      audio.play().catch(() => {});
    });
    lyricsView.append(row);
  });
}

audio.addEventListener('timeupdate', () => {
  timeReadout.textContent = fmt(audio.currentTime);
  let active = -1;
  for (let i = 0; i < lines.length; i++) {
    if (audio.currentTime >= lines[i].start) active = i;
    else break;
  }
  document.querySelectorAll('.lyric-line').forEach((el, i) => {
    el.classList.toggle('active', i === active);
    if (i === active) el.scrollIntoView({block:'nearest', behavior:'smooth'});
  });
});
