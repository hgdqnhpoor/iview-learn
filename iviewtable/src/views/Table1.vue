<template>
    <div style="padding: 32px 64px">
         <h1>服务端分页及自定义序号</h1>
         <!-- 做服务端分页我们首先需要首先写两个组件,一个是Table.一个是Page组件,Table是表格,Page是分页 -->
         <!-- 我们请求数据的时候,要让表格处于加载中的状态,所以要加一个loading属性;加border会让数据看着更清晰些;因为数据比较多,我们加一个小的尺寸就可以了;data数据是个数组,是从服务端请求过来的 -->
         <Table :columns="columns" :data="data" :loading="loading"></Table>
         <div style="text-align: center;margin: 16px 0">
             <!-- 我们进行分页,要知道服务端数据有多少,我们要用到total,:total="total",后面的total是服务器返给我们的;当前第几页是第几页数据,我们用current表示;show-sizer是iviewPage的一个属性,show-sizer会显示数据有多少条;iview里面监听事件,@on-change页码改变的回调，返回改变后的页码,例如我在当前页,跳到第二页,这时候会触发on-change事件,这时我们就要去请求数据,叫getData;通过show-sizer显示多少条切换触发@on-change-size-change事件去把页码置为第一页,并且去请求数据-->
             <!-- Page写好,我们接下来要请求数据放到Table里面 -->
             <Page 
             :total="total" 
             :current="current" 
             show-sizer 
             @on-change='getData'
             @on-change-size-change="handleChangeSize"
             >
             </Page>
         </div>
    </div>
</template>
<script>
import { totalmem } from 'os';
// 我们把$简单写,随便起的名字
import $ from '../libs/utils'// 在Table1.vue中以$形式引入的
import { setTimeout } from 'timers';
   export default{
       data(){
           return {
              columns: [// 给table写列的数据,第一列是索引
                   {
                     // 要修改自定义的index,必须要升级到iview3.0以上,iview3.0以下是无法实现的;indexMethod在type为index的时候可用
                     type: 'index',
                     width: 60,// 给一个60的宽度
                     align: 'center',// 给一个居中对齐
                     // 此处我们用iview自带的indexMethod,传进来当行的数据,序号返回几,需要自己去定义
                     indexMethod: (row) =>{
                         console.log(row._index);
                         return (row._index+1)+(this.size*this.current)-this.size;// return了以后才能让table正常,js计数是从0开始的,根据当前是第几页,然后数据会显示多少条,我就能很轻松的计算出来,我对应的要显示几,row._index+1开始计数,加this.size*this.current表示第几页减去初始的this.size；就可以把正常的序列号算好
                     }
                   },
                   {// 下面要写自定义序号,我们先给它渲染出来再写
                     title: '姓名',// title是表头要显示的内容
                     key: 'name',// 字段名叫name，key对应我们data里面的数据
                   }  
              ],
              // data数据是默认从服务端请求过来的,默认是空的
              data: [

              ],
              // loading就是默认处于加载中的状态,默认是false
              loading: false,
              // total初始化默认是0
              total: 0,
              // current默认在第一页,我们赋值赋值个1,current默认组件是单向的,并没有实现双向绑定,例如input的value是v-model的一个双向绑定,current我们没有置为v-model,因为不是表单控件,所以我们使用vue的修饰符,current.sync加了sync就变成双向数据绑定
              current: 1,
              size: 10,// size给多少条数
           };
       },
       methods: {
              getData(){// getData是从服务端请求数据的方法
                     if(this.loading) return;// 如果data里面的loading为true的时候,就return,如果点的快,页面还没有请求到数据,有个延时的,不可能直接把数据给到,如果你再去点第二次第三次网络会触发好几次,如果是true我们就不再执行这个方法

                     this.loading = true;// 我们告诉这时候loading为true了,我们要去请求数据了
                     $.ajax({
                         method: 'get',
                         // 服务端在收到current,和size服务端就知道给你传什么样子的数据了;我们current在data中默认给的是第一页,size也在data里面定义,当我changesize的时候,
                         url: `/data/list/${this.current}/${this.size}`
                     }).then( res => {
                           // 我们用定时器做个延时,一秒以后再写入数据
                           setTimeout(()=>{
                           // console.log(res.data)// 这是检查后台有多少条数据
                           // 有了this.data和this.total后台表格就有数据了
                           // 给this.data赋值
                           this.data = res.data.data.list;
                           // 给this.total赋值
                           this.total = res.data.data.total;
                           // 请求完成,this.loading=false
                           this.loading = false;//加了this.loading = false;Table上的loading效果就没了,下次分页的时候就会再去请求新的数据了
                           },1000)
                         }) 
              },
              // 预先用handleChangeSize占了个位置,修改了值,当iview进行切换展示了条数之后,返回的多少条数据val赋值给this.size
              handleChangeSize(val){// 如果val是20我们就把20赋值给this.size
                           this.size = val;
                           // 切换完条数,然后我们在这里重新请求数据,用this.getData()
                           // 直接调用this.getData()是同步的,60行,current是同步的,我点20条的时候,current没有置于这个东西之前修改,所以我们要等到vue帮current修改之后再去请求数据,所以我们把这个方法放到this.$nextTick(() => {})这个方法中,当我的vue的一个数据队列(有个队列不会一次一次执行,只会执行最后一个)处理完成之后,给了一个回调,如果在this.$nextTick(()=>{this.getData})写this.getData的话,然后我们的current就已经回到第一页了
                           this.getData();
              },
              // mounted初始化的时候请求一下数据
              mounted(){
                  // 在mounted中调用这个方法
                  this.getData();
              }
       }
   }
</script>

