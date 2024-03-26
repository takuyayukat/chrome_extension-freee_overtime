(function () {
  var a, b, c, d = document.getElementsByClassName('item');
  if (d.length === 0) return;

  for (var e = 0; e < d.length; e++) {
    var f = d[e].getElementsByClassName('label');
    if (f.length > 0) {
      if (f[0].textContent == '労働日数労働日数は有給を含む日数です。') {
        var g = d[e].getElementsByClassName('body')[0];
        a = parseInt(g?.textContent, 10);
        b = a * 8
      } else if (f[0].textContent == '総勤務時間') {
        var h = d[e].getElementsByClassName('hour-min__value')[0], i = d[e].getElementsByClassName('hour-min__value')[1];
        c = parseInt(h?.textContent, 10) + parseInt(i?.textContent, 10) / 60
      }
    }
  };
  var j = document.createElement('div');
  j.className = d[0].parentNode.className;
  var k = document.createElement('div');
  k.className = 'item';
  var l = document.createElement('div');
  l.className = 'label';
  l.textContent = '労働日数x8h';
  k.appendChild(l);
  var m = document.createElement('div');
  m.className = 'body';
  m.textContent = b.toString();
  var n = document.createElement('span');
  n.className = 'unit';
  n.textContent = 'h';
  m.appendChild(n);
  k.appendChild(m);
  j.appendChild(k);
  var o = c - b, p = document.createElement('div');
  p.className = 'item';
  var q = document.createElement('div');
  q.className = 'label';
  q.textContent = o > 0 ? '残業時間' : '不足時間';
  p.appendChild(q);
  var r = document.createElement('div');
  r.className = 'body';
  r.textContent = Math.abs(o || null).toFixed(1);
  var s = document.createElement('span');
  s.className = 'unit';
  s.textContent = 'h';
  r.appendChild(s);
  p.appendChild(r);
  if (o < 0) p.style.color = '#AA0000';
  j.appendChild(p);
  var t = document.createElement('hr');
  d[0].parentNode.parentNode.insertBefore(t, d[0].parentNode.nextSibling);
  d[0].parentNode.parentNode.insertBefore(j, t.nextSibling);
})();
