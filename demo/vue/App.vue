<template>
  <div>
    <div>
      <cell force title="一层非联动" />
      <cell :title="title1" @click="doClick1" />
      <btn v-for="(item, index) in btn1" :key="index" @click="doSet1(index)">
        {{ item }}
      </btn>
      <q-select
        ref="select1"
        v-model="show1"
        title="一层非联动"
        :data="data1"
        @ready="doReady1"
        @show="doShow1"
        @hide="doHide1"
        @change="doChange1"
        @confirm="doConfirm1"
      />
    </div>
    <div>
      <cell force title="一层非联动异步" />
      <cell hideDetails :title="title2" @click="doClick2" />
      <q-select
        ref="select2"
        v-model="show2"
        title="一层非联动异步"
        inline
        :loading="loading2"
        :data="data2"
        @ready="doReady2"
        @show="doShow2"
        @hide="doHide2"
        @change="doChange2"
        @confirm="doConfirm2"
      />
      <btn v-for="(item, index) in btn2" :key="index" @click="doSet2(index)">
        {{ item }}
      </btn>
    </div>
    <div>
      <cell force title="多层非联动实测" />
      <cell :title="title3" @click="doClick3" />
      <btn v-for="(item, index) in btn3" :key="index" @click="doSet3(index)">
        {{ item }}
      </btn>
      <q-select
        ref="select3"
        v-model="show3"
        title="多层非联动实测"
        :count="9"
        :data="data3"
        @ready="doReady3"
        @show="doShow3"
        @hide="doHide3"
        @change="doChange3"
        @confirm="doConfirm3"
      />
    </div>
    <div>
      <cell force title="简单联动" />
      <cell :title="title4" @click="doClick4" />
      <btn v-for="(item, index) in btn4" :key="index" @click="doSet4(index)">
        {{ item }}
      </btn>
      <q-select
        ref="select4"
        v-model="show4"
        title="简单联动"
        :data="data4"
        @ready="doReady4"
        @show="doShow4"
        @hide="doHide4"
        @change="doChange4"
        @confirm="doConfirm4"
      />
    </div>
    <div>
      <cell force title="省市区联动实测" />
      <cell :title="title5" @click="doClick5" />
      <btn v-for="(item, index) in btn5" :key="index" @click="doSet5(index)">
        {{ item }}
      </btn>
      <q-select
        ref="select5"
        v-model="show5"
        title="省市区联动实测"
        :data="data5"
        :defaultKey="defaultKey5"
        :defaultValue="defaultValue5"
        @ready="doReady5"
        @show="doShow5"
        @hide="doHide5"
        @change="doChange5"
        @confirm="doConfirm5"
      />
    </div>
    <div>
      <cell force title="省市区非联动异步实测" />
      <cell :title="title6" @click="doClick6" />
      <q-select
        ref="select6"
        v-model="show6"
        title="省市区非联动异步实测"
        cancelBtn="重置"
        :data="data6"
        :loading="loading6"
        @ready="doReady6"
        @show="doShow6"
        @hide="doHide6"
        @change="doChange6"
        @confirm="doConfirm6"
        @cancel="doCancel6"
      />
      <btn v-for="(item, index) in btn6" :key="index" @click="doSet6(index)">
        {{ item }}
      </btn>
    </div>
  </div>
</template>

<script>
import cell from './components/cell.vue';
import btn from './components/btn.vue';
import city from './lib/city';
import axios from 'axios/dist/axios';
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
normalizeCity(city);

const ax = axios.create();

export default {
  name: 'App',
  components: {
    cell,
    btn
  },
  data() {
    return {
      defaultKey5: [],
      defaultValue5: [],
      title1: '',
      title2: '',
      title3: '',
      title4: '',
      title5: '',
      title6: '',
      title7: '',
      baseArr2: [],
      show1: false,
      show2: false,
      show3: false,
      show4: false,
      show5: false,
      show6: false,
      show7: false,
      loading2: true,
      loading6: true,
      data1: [],
      data2: [],
      data3: [],
      data4: [
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
      ],
      data5: city,
      data6: [],
      data7: [],
      btn1: [
        '重新初始化数据(转联动)',
        '重新初始化数据(转非联动)',
        '获取当前data(console查看)',
        '获取当前index(console查看)'
      ],
      btn2: [
        '点击异步设置值',
        '获取当前data(console查看)',
        '获取当前index(console查看)'
      ],
      btn3: [
        '点击设置索引为10 10 10 10 10',
        '点击设置值为10 10 10 10 10',
        '点击设置key为20k 20k 20k 20k 20k',
        '获取当前data(console查看)',
        '获取当前index(console查看)'
      ],
      btn4: [
        '点击设置值为水果 西瓜 无子瓜 5块 两斤',
        '点击设置索引为2 0 1',
        '点击将第一栏滚动到索引2',
        '获取当前data(console查看)',
        '获取当前index(console查看)'
      ],
      btn5: [
        '点击设置索引为3 1 2',
        '点击设置值为 四川省 成都市 武侯区',
        '点击设置key为 32 3201 320102',
        '获取当前data(console查看)',
        '获取当前index(console查看)'
      ],
      btn6: ['获取当前data(console查看)', '获取当前index(console查看)'],
      btn7: [],
      newData1: [
        {
          value: '外部1',
          children: ['内部1', '内部2', '内部3', '内部4']
        },
        {
          value: '外部2'
        }
      ]
    };
  },
  created() {
    const baseArr1 = [];
    const baseArr2 = [];
    for (let i = 1; i <= 40; i++) {
      baseArr1.push(i);
      baseArr2.push({
        key: i + 'k',
        value: i
      });
    }
    this.data1 = [baseArr1];
    this.baseArr2 = [baseArr2];
    this.data3 = [baseArr2, baseArr2, baseArr2, baseArr2, baseArr2];
    ax.get('https://g46tw.sse.codesandbox.io/init').then(res => {
      this.data6 = res.data;
      this.loading6 = false;
    });
  },
  methods: {
    doReady1(data) {
      this.title1 = `数据:${data.join(',')}`;
    },
    doClick1() {
      this.show1 = true;
    },
    doSet1(i) {
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
      switch (i) {
        case 0:
          this.$refs.select1.setData(newData1, [0, 3]).then(([data, key]) => {
            this.title1 = `数据:${data.join(',')}`;
          });
          break;
        case 1:
          this.$refs.select1.setData(this.data1, [10]).then(([data, key]) => {
            this.title1 = `数据:${data.join(',')}`;
          });
          break;
        case 2:
          // eslint-disable-next-line
          console.log(this.$refs.select1.getData());
          break;
        case 3:
          // eslint-disable-next-line
          console.log(this.$refs.select1.getIndex());
          break;
      }
    },
    doShow1() {
      // eslint-disable-next-line
      console.log('1-show');
    },
    doHide1() {
      // eslint-disable-next-line
     console.log('1-hide');
    },
    doConfirm1(data) {
      this.title1 = `数据:${data.join(',')}`;
    },
    doChange1(weight, data) {
      // eslint-disable-next-line
      console.log(`1-change:${data.join(',')}`);
    },
    doReady2(data, key) {
      this.title2 = `数据:${data.join(',')},key:${key.join(',')}`;
    },
    doClick2() {
      this.show2 = true;
    },
    doSet2(i) {
      switch (i) {
        case 0:
          this.$refs.select2.setData(this.baseArr2, [5]).then(([data, key]) => {
            this.title2 = `数据:${data.join(',')},key:${key.join(',')}`;
            this.loading2 = false;
          });
          break;
        case 1:
          // eslint-disable-next-line
          console.log(this.$refs.select2.getData());
          break;
        case 2:
          // eslint-disable-next-line
          console.log(this.$refs.select2.getIndex());
          break;
      }
    },
    doShow2() {
      // eslint-disable-next-line
      console.log('2-show');
    },
    doHide2() {
      // eslint-disable-next-line
     console.log('2-hide');
    },
    doConfirm2(data) {
      this.title2 = `数据:${data.join(',')}`;
    },
    doChange2(weight, data, key) {
      // eslint-disable-next-line
      console.log(`2-change:${data.join(',')}`);
      this.title2 = `数据:${data.join(',')},key:${key.join(',')}`;
    },
    doReady3(data, key) {
      this.title3 = `数据:${data.join(',')},key:${key.join(',')}`;
    },
    doClick3() {
      this.show3 = true;
    },
    doSet3(i) {
      switch (i) {
        case 0:
          this.$refs.select3
            .setIndex([10, 10, 10, 10, 10])
            .then(([data, key]) => {
              this.title3 = `数据:${data.join(',')},key:${key.join(',')}`;
            });
          break;
        case 1:
          this.$refs.select3
            .setValue([10, 10, 10, 10, 10])
            .then(([data, key]) => {
              this.title3 = `数据:${data.join(',')},key:${key.join(',')}`;
            });
          break;
        case 2:
          this.$refs.select3
            .setKey(['20k', '20k', '20k', '20k', '20k'])
            .then(([data, key]) => {
              this.title3 = `数据:${data.join(',')},key:${key.join(',')}`;
            });
          break;
        case 3:
          // eslint-disable-next-line
        console.log(this.$refs.select3.getData());
          break;
        case 4:
          // eslint-disable-next-line
        console.log(this.$refs.select3.getIndex());
          break;
      }
    },
    doShow3() {
      // eslint-disable-next-line
      console.log('3-show');
    },
    doHide3() {
      // eslint-disable-next-line
     console.log('3-hide');
    },
    doConfirm3(data, key) {
      this.title3 = `数据:${data.join(',')},key:${key.join(',')}`;
    },
    doChange3(weight, data) {
      // eslint-disable-next-line
      console.log(`3-change:${data.join(',')}`);
    },
    doReady4(data, key) {
      this.title4 = `数据:${data.join(',')},key:${key.join(',')}`;
    },
    doClick4() {
      this.show4 = true;
    },
    doSet4(i) {
      switch (i) {
        case 0:
          this.$refs.select4
            .setValue(['水果', '西瓜', '无子瓜', '5块', '两斤'])
            .then(([data, key]) => {
              this.title4 = `数据:${data.join(',')},key:${key.join(',')}`;
            });
          break;
        case 1:
          this.$refs.select4.setIndex([2, 0, 1]).then(([data, key]) => {
            this.title4 = `数据:${data.join(',')},key:${key.join(',')}`;
          });
          break;
        case 2:
          this.$refs.select4.scrollTo(0, 2).then(([data, key]) => {
            this.title4 = `数据:${data.join(',')},key:${key.join(',')}`;
          });
          break;
        case 3:
          // eslint-disable-next-line
        console.log(this.$refs.select4.getData());
          break;
        case 4:
          // eslint-disable-next-line
        console.log(this.$refs.select4.getIndex());
          break;
      }
    },
    doShow4() {
      // eslint-disable-next-line
      console.log('4-show');
    },
    doHide4() {
      // eslint-disable-next-line
     console.log('4-hide');
    },
    doConfirm4(data, key) {
      this.title4 = `数据:${data.join(',')},key:${key.join(',')}`;
    },
    doChange4(weight, data) {
      // eslint-disable-next-line
      console.log(`4-change:${data.join(',')}`);
    },
    doReady5(data, key) {
      this.title5 = `数据:${data.join(',')},key:${key.join(',')}`;
    },
    doClick5() {
      this.show5 = true;
    },
    doSet5(i) {
      switch (i) {
        case 0:
          this.$refs.select5.setIndex([3, 1, 2]).then(([data, key]) => {
            this.title5 = `数据:${data.join(',')},key:${key.join(',')}`;
          });
          break;
        case 1:
          this.defaultValue5 = ['四川省', '成都市', '武侯区'];
          break;
        case 2:
          this.defaultKey5 = ['32', '3201', '320104'];
          break;
        case 3:
          // eslint-disable-next-line
        console.log(this.$refs.select5.getData());
          break;
        case 4:
          // eslint-disable-next-line
        console.log(this.$refs.select5.getIndex());
          break;
      }
    },
    doShow5() {
      // eslint-disable-next-line
      console.log('5-show');
    },
    doHide5() {
      // eslint-disable-next-line
     console.log('5-hide');
    },
    async get(code) {
      if (!code) {
        return [];
      }
      const data = await ax.get('https://g46tw.sse.codesandbox.io/area', {
        params: {
          key: code
        }
      });
      return data.data;
    },
    doConfirm5(data, key) {
      this.title5 = `数据:${data.join(',')},key:${key.join(',')}`;
    },
    doChange5(weight, data) {
      // eslint-disable-next-line
      console.log(`5-change:${data.join(',')}`);
    },
    doReady6(data, key) {
      this.title6 = `数据:${data.join(',')},key:${key.join(',')}`;
    },
    doClick6() {
      this.show6 = true;
    },
    doShow6() {
      // eslint-disable-next-line
      console.log('6-show');
    },
    doHide6() {
      // eslint-disable-next-line
     console.log('6-hide');
    },
    doConfirm6(data, key) {
      this.title6 = `数据:${data.join(',')},key:${key.join(',')}`;
    },
    async doChange6(weight, data, key) {
      const curKey = key[weight];
      let res;
      try {
        this.loading6 = true;
        switch (weight) {
          case 0:
            res = await this.get(curKey);
            if (res.length) {
              const inner = await this.get(res[0].key);
              this.$refs.select6
                .setColumnData([1, 2], [res, inner])
                .then(([data, key]) => {
                  this.loading6 = false;
                });
            } else {
              this.$refs.select6.setColumnData(1, res).then(([data, key]) => {
                this.loading6 = false;
              });
            }
            break;
          case 1:
            res = await this.get(curKey);
            this.$refs.select6.setColumnData(2, res).then(([data, key]) => {
              this.loading6 = false;
            });
            break;
          case 2:
            this.loading6 = false;
            break;
        }
      } catch (error) {
        this.$refs.select6.setData(this.data6).then(([data, key]) => {
          this.title6 = `数据:${data.join(',')},key:${key.join(',')}`;
          this.loading6 = false;
          // eslint-disable-next-line
          alert('接口出错,重新选择');
        });
      }
    },
    doSet6(i) {
      switch (i) {
        case 0:
          // eslint-disable-next-line
          console.log(this.$refs.select6.getData());
          break;
        case 1:
          // eslint-disable-next-line
          console.log(this.$refs.select6.getIndex());
          break;
      }
    },
    doCancel6() {
      this.$refs.select6.setData(this.data6).then(([data, key]) => {
        this.title6 = `数据:${data.join(',')},key:${key.join(',')}`;
        this.loading6 = false;
      });
    }
  }
};
</script>
