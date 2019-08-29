import QSelect from '@qymh/q-select/src/index';
import City from './lib/city';
import './style/demo.css';
import axios from 'axios/dist/axios';
import { deepClone } from '@qymh/q-select/src/uitls';

function normalizeCity(data) {
  data.map(v => {
    v.value = v.name;
    v.key = v.code;
    if (v.children) {
      v.children = normalizeCity(v.children);
    }
  });
  return data;
}

normalizeCity(City);

// 一层非联动
const data1 = [];
const newData1 = [
  {
    value: '外部1',
    children: [
      '内部1',
      '内部2',
      '内部3',
      {
        value: '内部4',
        children: ['终极内部1', '终极内部2']
      }
    ]
  },
  {
    value: '外部2'
  }
];
const $show1 = document.querySelector('.cell__title--1');
for (let i = 1; i <= 40; i++) {
  data1.push(i);
}
const qSelect1 = new QSelect({
  title: '一层非联动',
  data: [data1],
  index: [2],
  ready(data) {
    $show1.textContent = `数据:${data.join(',')}`;
  },
  show() {
    // eslint-disable-next-line
    console.log('1-show');
  },
  hide() {
    // eslint-disable-next-line
    console.log('1-hide');
  },
  cancel() {
    // eslint-disable-next-line
    console.log('1-cancel');
  },
  change(weight, data) {
    // eslint-disable-next-line
    console.log(`1-change:${data.join(',')}`);
  },
  confirm(data) {
    $show1.textContent = `数据:${data.join(',')}`;
  }
});
const $setBtn1 = document.querySelectorAll('.settings__btn--1');
$setBtn1.forEach((v, i) => {
  v.addEventListener('click', () => {
    switch (i) {
      case 0:
        qSelect1.setData(newData1, [0, 3, 1]).then(([data]) => {
          $show1.textContent = `数据:${data.join(',')}`;
        });
        break;
      case 1:
        qSelect1.setData(data1, [10]).then(([data]) => {
          $show1.textContent = `数据:${data.join(',')}`;
        });
        break;
      case 2:
        // eslint-disable-next-line
        console.log(qSelect1.getData());
        break;
      case 3:
        // eslint-disable-next-line
        console.log(qSelect1.getIndex());
        break;
    }
  });
});
const $click1 = document.querySelector('.cell__details--1');
$click1.addEventListener('click', () => {
  qSelect1.show();
});
// 非联动内联展示异步设置值
const data2 = [];
const $show2 = document.querySelector('.cell__title--2');
for (let i = 1; i <= 40; i++) {
  data2.push({
    value: i,
    key: i + 'somekey'
  });
}
const qSelect2 = new QSelect({
  title: '非联动内联展示异步设置值',
  data: [],
  loading: true,
  target: '.inline2',
  ready(data, key) {
    $show2.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
  },
  show() {
    // eslint-disable-next-line
    console.log('2-show');
  },
  hide() {
    // eslint-disable-next-line
    console.log('2-hide');
  },
  cancel() {
    // eslint-disable-next-line
    console.log('2-cancel');
  },
  change(weight, data, key) {
    $show2.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
  },
  confirm(data, key) {
    $show2.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
  }
});
const $setBtn2 = document.querySelectorAll('.settings__btn--2');
$setBtn2.forEach((v, i) => {
  v.addEventListener('click', () => {
    switch (i) {
      case 0:
        qSelect2.setData(data2).then(([data, key]) => {
          qSelect2.cancelLoading();
          $show2.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
        });
        break;
      case 1:
        // eslint-disable-next-line
        console.log(qSelect2.getData());
        break;
      case 2:
        // eslint-disable-next-line
        console.log(qSelect2.getIndex());
        break;
    }
  });
});

// 多级非联动实测
const data4 = [];
const $show4 = document.querySelector('.cell__title--4');
for (let i = 1; i <= 40; i++) {
  data4.push({
    value: i,
    key: i + 'k'
  });
}
const qSelect4 = new QSelect({
  title: '多级非联动实测',
  data: [data4, data4, data4, data4, data4],
  count: 9,
  ready(data, key) {
    $show4.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
  },
  show() {
    // eslint-disable-next-line
    console.log('4-show');
  },
  hide() {
    // eslint-disable-next-line
    console.log('4-hide');
  },
  cancel() {
    // eslint-disable-next-line
    console.log('4-cancel');
  },
  change(weight, data) {
    // eslint-disable-next-line
    console.log(`4-change:${data.join(',')}`);
  },
  confirm(data, key) {
    $show4.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
  }
});
const $click4 = document.querySelector('.cell__details--4');
const $setBtn4 = document.querySelectorAll('.settings__btn--4');
$setBtn4.forEach((v, i) => {
  v.addEventListener('click', () => {
    switch (i) {
      case 0:
        qSelect4.setIndex([10, 10, 10, 10, 10]).then(([data, key]) => {
          $show4.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
        });
        break;
      case 1:
        qSelect4.setValue([10, 10, 10, 10, 10]).then(([data, key]) => {
          $show4.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
        });
        break;
      case 2:
        qSelect4
          .setKey(['20k', '20k', '20k', '20k', '20k'])
          .then(([data, key]) => {
            $show4.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
          });
        break;
      case 3:
        // eslint-disable-next-line
        console.log(qSelect4.getData());
        break;
      case 4:
        // eslint-disable-next-line
        console.log(qSelect4.getIndex());
        break;
    }
  });
});
$click4.addEventListener('click', () => {
  qSelect4.show();
});

// 简单联动
const data5 = [
  {
    value: '水果',
    children: [
      {
        value: '西瓜',
        children: [
          {
            value: '无子瓜',
            children: [
              {
                value: '3块'
              },
              {
                value: '5块',
                children: [
                  '一斤',
                  '两斤',
                  {
                    key: '3',
                    value: '三斤'
                  },
                  '四斤'
                ]
              },
              {
                value: '7块'
              }
            ]
          },
          {
            value: '口口脆'
          }
        ]
      },
      {
        value: '梨子'
      },
      {
        value: '香蕉'
      }
    ]
  },
  {
    value: '蔬菜',
    children: [
      {
        value: '胡萝卜'
      },
      {
        value: '大白菜'
      },
      {
        value: '茄子',
        children: [
          {
            value: '大茄子'
          },
          {
            value: '中茄子'
          },
          {
            value: '小茄子'
          }
        ]
      }
    ]
  },
  {
    value: '肉类',
    children: [
      {
        value: '猪肉',
        children: [
          {
            value: '前腿肉'
          },
          {
            value: '后腿肉'
          }
        ]
      },
      {
        value: '羊肉'
      },
      {
        value: '牛肉'
      }
    ]
  }
];
const $show5 = document.querySelector('.cell__title--5');

const qSelect5 = new QSelect({
  title: '简单联动',
  data: data5,
  ready(data, key) {
    $show5.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
  },
  change(weight, data) {
    // eslint-disable-next-line
    console.log(`5-change:${data.join(',')}`);
  },
  confirm(data, key) {
    $show5.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
  }
});
const $setBtn5 = document.querySelectorAll('.settings__btn--5');
$setBtn5.forEach((v, i) => {
  v.addEventListener('click', () => {
    switch (i) {
      case 0:
        qSelect5
          .setValue(['水果', '西瓜', '无子瓜', '5块', '两斤'])
          .then(([data, key]) => {
            $show5.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
          });
        break;
      case 1:
        qSelect5.setIndex([2, 0, 3]).then(([data, key]) => {
          $show5.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
        });
        break;
      case 2:
        qSelect5.scrollTo(0, 2).then(([data, key]) => {
          $show5.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
        });
        break;
      case 3:
        // eslint-disable-next-line
        console.log(qSelect5.getData());
        break;
      case 4:
        // eslint-disable-next-line
        console.log(qSelect5.getIndex());
        break;
    }
  });
});
const $click5 = document.querySelector('.cell__details--5');
$click5.addEventListener('click', () => {
  qSelect5.show();
});

// 省市区联动实测
const $show6 = document.querySelector('.cell__title--6');
const qSelect6 = new QSelect({
  title: '省市区联动实测',
  data: City,
  ready(data, key) {
    $show6.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
  },
  change(weight, data) {
    // eslint-disable-next-line
    console.log(`6-change:${data.join(',')}`);
  },
  confirm(data, key) {
    $show6.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
  }
});
const $click6 = document.querySelector('.cell__details--6');
$click6.addEventListener('click', () => {
  qSelect6.show();
});
const $setBtn6 = document.querySelectorAll('.settings__btn--6');
$setBtn6.forEach((v, i) => {
  v.addEventListener('click', () => {
    switch (i) {
      case 0:
        qSelect6.setIndex([3, 1, 2]).then(([data, key]) => {
          $show6.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
        });
        break;
      case 1:
        qSelect6
          .setValue(['四川省', '成都市', '武侯区'])
          .then(([data, key]) => {
            $show6.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
          });
        break;
      case 2:
        qSelect6.setKey(['32', '3201', '320104']).then(([data, key]) => {
          $show6.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
        });
        break;
      case 3:
        // eslint-disable-next-line
        console.log(qSelect6.getData());
        break;
      case 4:
        // eslint-disable-next-line
        console.log(qSelect6.getIndex());
        break;
    }
  });
});

// 省市区非联动异步实测
const $show7 = document.querySelector('.cell__title--7');
const $click7 = document.querySelector('.cell__details--7');
const ax = axios.create();
async function get(code) {
  if (!code) {
    return [];
  }
  const data = await ax.get('https://g46tw.sse.codesandbox.io/area', {
    params: {
      key: code
    }
  });
  return data.data;
}

let qSelect7;

$click7.addEventListener('click', () => {
  qSelect7.show();
});

ax.get('https://g46tw.sse.codesandbox.io/init').then(res => {
  const baseData = res.data;
  qSelect7 = new QSelect({
    title: '省市区非联动异步实测',
    data: baseData,
    cancelBtn: '重置',
    ready(data, key) {
      $show7.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
    },
    async change(weight, data, key) {
      const curKey = key[weight];
      let res;
      try {
        switch (weight) {
          case 0:
            qSelect7.setLoading();
            res = await get(curKey);
            if (res.length) {
              const inner = await get(res[0].key);
              qSelect7
                .setColumnData([1, 2], [res, inner])
                .then(([data, key]) => {
                  $show7.textContent = `数据:${data.join(',')},key:${key.join(
                    ','
                  )}`;
                  qSelect7.cancelLoading();
                });
            } else {
              qSelect7.setColumnData(1, res).then(([data, key]) => {
                $show7.textContent = `数据:${data.join(',')},key:${key.join(
                  ','
                )}`;
                qSelect7.cancelLoading();
              });
            }
            break;
          case 1:
            qSelect7.setLoading();
            res = await get(curKey);
            qSelect7.setColumnData(2, res).then(([data, key]) => {
              $show7.textContent = `数据:${data.join(',')},key:${key.join(
                ','
              )}`;
              qSelect7.cancelLoading();
            });
            break;
          case 2:
            $show7.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
            break;
        }
      } catch (error) {
        qSelect7.setData(deepClone(baseData)).then(([data, key]) => {
          $show7.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
          qSelect7.cancelLoading();
          // eslint-disable-next-line
          alert('接口出错,重新选择');
        });
      }
    },
    confirm(data, key) {
      $show7.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
    },
    cancel() {
      qSelect7.setData(baseData).then(([data, key]) => {
        $show7.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
        qSelect7.cancelLoading();
      });
    }
  });
});

const $setBtn7 = document.querySelectorAll('.settings__btn--7');
$setBtn7.forEach((v, i) => {
  v.addEventListener('click', () => {
    switch (i) {
      case 0:
        // eslint-disable-next-line
        console.log(qSelect7.getData());
        break;
      case 1:
        // eslint-disable-next-line
        console.log(qSelect7.getIndex());
        break;
    }
  });
});
