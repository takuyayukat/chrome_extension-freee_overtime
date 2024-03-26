"use strict";

const exElmId = 'ex-items';

let oldUrl = '';

// DOM の変更を監視し、勤怠記録ページのローディングが完了したら残業時間を計算・表示
const observer = new MutationObserver(() => {
  const currentUrl = location.href;

  if (!location.hash.startsWith('#work_records/')) {
    oldUrl = ''; // 該当ページから別ページへ遷移後に戻ったときにも実行されるように oldUrl をリセット
    return;
  }
  if (document.querySelector('body > .vb-loading')) return; // ローディング中なら中断
  if (oldUrl === currentUrl) return; // 表示中のURLが処理済みなら中断

  showOvertimeDetails()
  oldUrl = currentUrl; // 計算・表示後にURLを記録
});

window.addEventListener('load', () => {
  // ローディング中に document.body 直下に追加されるローディング表示の要素を監視
  observer.observe(document.body, { childList: true });
});

// DOM要素を生成
const createElement = ({ tagName, children, ...props }) => {
  const element = document.createElement(tagName || 'div');
  Object.entries(props).forEach(([key, value]) => element[key] = value);
  if (children) children.forEach(child => element.appendChild(child));;
  return element;
}

// 勤怠記録ページの残業時間を計算・表示
const showOvertimeDetails = () => {
  const summaryElm = document.querySelector('.employee-work-record-summary');
  const items = document.querySelectorAll('.items:not(.ex-items) .item');

  // 勤怠記録のまとめ欄が見つからない場合終了
  if (!summaryElm || items.length === 0) return;

  // 勤怠記録のまとめ欄から労働日数と総勤務時間を取得
  let days, totalWorkHours;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const labelElm = item.getElementsByClassName('label');
    if (labelElm.length === 0) continue;

    if (labelElm[0].textContent.startsWith('労働日数')) {
      const valueElm = item.getElementsByClassName('body')[0];
      days = parseInt(valueElm?.textContent || '0', 10);
    } else if (labelElm[0].textContent == '総勤務時間') {
      const hourMin = item.getElementsByClassName('hour-min__value');
      totalWorkHours =
        parseInt(hourMin[0]?.textContent || '0', 10) +
        parseInt(hourMin[1]?.textContent || '0', 10) / 60;
    }
  };

  // 勤務日数x8h、残業時間、残労働日数を計算
  const baseWorkingHours = days * 8;
  const overtime = totalWorkHours - baseWorkingHours;
  const workDayElements = document.querySelectorAll(
    '.employee-work-record-calendar tbody td.day' +
    ':not(.work):not(.paid-holiday):not(.out-of-range):not(.legal-holiday):not(.prescribed-holiday)'
  );

  // 残業時間を時間と分に分ける
  const absoluteOvertime = Math.round(Math.abs(overtime) * 100) / 100;
  const overtimeHours = Math.trunc(absoluteOvertime);
  const overtimeMinutes = Math.round((absoluteOvertime * 60) % 60);

  // 残業時間表示の DOM ツリーを生成
  const fragment = document.createDocumentFragment();
  fragment.appendChild(
    createElement({
      id: exElmId, children: [
        createElement({ tagName: 'hr' }),
        createElement({
          className: 'items sub-items ex-items', children: [
            createElement({
              className: 'item', children: [
                createElement({ className: 'label', textContent: '労働日数x8h' }),
                createElement({
                  className: 'body',
                  style: `color: ${overtime < 0 ? '#A00' : 'inherit'}`,
                  children: [
                    createElement({ tagName: 'span', textContent: baseWorkingHours.toString() }),
                    createElement({ tagName: 'span', className: 'unit', textContent: '時間' }),
                  ]
                })]
            }),
            createElement({
              className: 'item', children: [
                createElement({ className: 'label', textContent: (overtime < 0 ? '不足' : '残業') + '時間' }),
                createElement({
                  className: 'body',
                  style: `color: ${overtime < 0 ? '#A00' : 'inherit'}`,
                  children: [
                    createElement({ tagName: 'span', textContent: overtimeHours.toString() }),
                    createElement({ tagName: 'span', className: 'unit', textContent: '時間' }),
                    createElement({ tagName: 'span', textContent: overtimeMinutes.toString() }),
                    createElement({ tagName: 'span', className: 'unit', textContent: '分' })
                  ]
                })]
            }),
            createElement({
              className: 'item', children: [
                createElement({ className: 'label', textContent: '残労働日数' }),
                createElement({
                  className: 'body', children: [
                    createElement({ tagName: 'span', textContent: workDayElements.length.toString() }),
                    createElement({ tagName: 'span', className: 'unit', textContent: '日' })
                  ]
                })]
            })]
        })]
    })
  );

  // 既存の残業時間表示を削除
  document.getElementById(exElmId)?.remove();
  // 残業時間表示を挿入
  summaryElm.appendChild(fragment);
}
