const overlay = document.getElementById('drop-overlay');
const dropBox  = document.getElementById('drop-box');

document.getElementById('import-btn').addEventListener('click', () => overlay.classList.add('active'));
document.getElementById('close-drop').addEventListener('click', () => overlay.classList.remove('active'));
overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('active'); });

dropBox.addEventListener('dragover', e => { e.preventDefault(); dropBox.classList.add('dragover'); });
dropBox.addEventListener('dragleave', () => dropBox.classList.remove('dragover'));
dropBox.addEventListener('drop', e => {
  e.preventDefault(); dropBox.classList.remove('dragover');
  if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
});

// Allow drag anywhere on the window
window.addEventListener('dragover', e => e.preventDefault());
window.addEventListener('drop', e => {
  e.preventDefault();
  if (e.dataTransfer.files[0]) { overlay.classList.remove('active'); processFile(e.dataTransfer.files[0]); }
});

document.getElementById('file-input').addEventListener('change', e => {
  if (e.target.files[0]) processFile(e.target.files[0]);
  e.target.value = '';
});

function showImportToast(msg, type) {
  const el = document.createElement('div');
  el.className = 'import-toast ' + type;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

function processFile(file) {
  overlay.classList.remove('active');
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const text = e.target.result;
      const parsed = file.name.endsWith('.json')
        ? parseJSON(text)
        : parseCSV(text, file.name.endsWith('.tsv') ? '\t' : ',');
      if (parsed) showParsePanel(file.name, parsed);
      else throw new Error('No metrics detected');
    } catch (err) {
      showImportToast('⚠ ' + err.message, 'err');
    }
  };
  reader.readAsText(file);
}

// Column name aliases
const KEY_MAP = {
  revenue:   ['revenue','sales','turnover','income','grossrevenue','totalrevenue','rev'],
  customers: ['customers','users','clients','subscribers','customer','activeusers','customercount'],
  margin:    ['margin','profitmargin','grossmargin','netmargin','profit','profitpct','marginpct'],
  expenses:  ['expenses','costs','expenditure','opex','overhead','totalcosts','monthlycosts','exp'],
};

function nk(k) { return k.toLowerCase().replace(/[^a-z]/g, ''); }

function findValues(obj) {
  const result = {};
  Object.keys(obj).forEach(k => {
    const n = nk(k);
    for (const [metric, aliases] of Object.entries(KEY_MAP)) {
      if (aliases.includes(n) && result[metric] === undefined) {
        const v = parseFloat(String(obj[k]).replace(/[$,%\s]/g, ''));
        if (!isNaN(v)) result[metric] = v;
      }
    }
  });
  return result;
}

function parseJSON(text) {
  const data = JSON.parse(text);
  if (Array.isArray(data)) {
    if (!data.length) throw new Error('Empty array');
    const agg = {};
    data.forEach(row => Object.entries(row).forEach(([k, v]) => { if (!agg[k]) agg[k] = []; agg[k].push(v); }));
    const avg = {};
    Object.entries(agg).forEach(([k, arr]) => {
      const nums = arr.map(v => parseFloat(String(v).replace(/[$,%\s]/g, ''))).filter(n => !isNaN(n));
      if (nums.length) avg[k] = nums.reduce((a, b) => a + b, 0) / nums.length;
    });
    return toRaw(findValues(avg));
  }
  return toRaw(findValues(data));
}

function parseCSV(text, sep = ',') {
  const lines = text.trim().split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) throw new Error('Need a header row and at least one data row');
  const headers = lines[0].split(sep).map(h => h.trim().replace(/^"|"$/g, ''));
  const rows = lines.slice(1).map(l => l.split(sep).map(v => v.trim().replace(/^"|"$/g, '')));

  // Column-based (standard spreadsheet export)
  const colData = {};
  headers.forEach((h, i) => {
    const nums = rows.map(r => parseFloat(String(r[i] || '').replace(/[$,%\s]/g, ''))).filter(n => !isNaN(n));
    if (nums.length) colData[h] = nums.reduce((a, b) => a + b, 0) / nums.length;
  });
  const colResult = findValues(colData);
  if (Object.keys(colResult).length >= 2) return toRaw(colResult);

  // Row-based key:value pairs
  const rowData = {};
  lines.forEach(l => { const p = l.split(sep).map(v => v.trim().replace(/^"|"$/g, '')); if (p.length >= 2) rowData[p[0]] = p[1]; });
  const rowResult = findValues(rowData);
  if (Object.keys(rowResult).length >= 1) return toRaw(rowResult);

  throw new Error('No recognisable column names found');
}

function toRaw(r) {
  const out = {};
  if (r.revenue   !== undefined) out.rawRev    = r.revenue;
  if (r.customers !== undefined) out.rawCust   = r.customers;
  if (r.margin    !== undefined) out.rawMargin = r.margin <= 1 ? Math.round(r.margin * 100) : Math.round(r.margin);
  if (r.expenses  !== undefined) out.rawExp    = r.expenses;
  return out;
}

function showParsePanel(filename, parsed) {
  document.getElementById('pp-filename').textContent = filename;
  document.getElementById('pp-rev').value    = parsed.rawRev    != null ? Math.round(parsed.rawRev)    : '';
  document.getElementById('pp-cust').value   = parsed.rawCust   != null ? Math.round(parsed.rawCust)   : '';
  document.getElementById('pp-margin').value = parsed.rawMargin != null ? Math.round(parsed.rawMargin) : '';
  document.getElementById('pp-exp').value    = parsed.rawExp    != null ? Math.round(parsed.rawExp)    : '';
  document.getElementById('parse-panel').classList.add('open');
}

document.getElementById('pp-apply').addEventListener('click', () => {
  const rawRev    = parseFloat(document.getElementById('pp-rev').value)    || 0;
  const rawCust   = parseFloat(document.getElementById('pp-cust').value)   || 0;
  const rawMargin = parseFloat(document.getElementById('pp-margin').value) || 0;
  const rawExp    = parseFloat(document.getElementById('pp-exp').value)    || 0;

  // Convert real values → 0-100 slider scale (rev: max $500k, cust: max 5000, exp: max $250k)
  if (rawRev)    { state.rev    = Math.min(100, Math.max(0, Math.round(rawRev    / 5000))); document.getElementById('sr').value = state.rev; }
  if (rawCust)   { state.cust   = Math.min(100, Math.max(0, Math.round(rawCust   / 50)));   document.getElementById('sc').value = state.cust; }
  if (rawMargin) { state.margin = Math.min(100, Math.max(0, Math.round(rawMargin)));         document.getElementById('sm').value = state.margin; }
  if (rawExp)    { state.exp    = Math.min(100, Math.max(0, Math.round(rawExp    / 2500))); document.getElementById('se').value = state.exp; }

  document.getElementById('parse-panel').classList.remove('open');
  buildCity();
  showImportToast('📊 City updated from your data!', 'ok');
});

document.getElementById('pp-cancel').addEventListener('click', () => {
  document.getElementById('parse-panel').classList.remove('open');
});
