<template>
     <div style="padding: 32px 64px">
          <h1>前端分页并排序、过滤</h1>
          <Table 
          :data="dataWithPage" 
          :columns="column" 
          :loading="loading"
          @on-sort-change="handleSortChange"
          @on-filter-change="handleFilterChange"
          >
          </Table>

          <div style="text-align:center;margin:16px 0">
              <Page :total="limitData.length" :current="current">

              </Page>
          </div>
     </div>
</template>
<script>
import $ from '../libs/utils'
import { setTimeout } from 'timers';
    export default{
        data(){
            return {
                total: 0,// 数据总数,服务端返给我们的数据10也还是多少,返回10页,每页100,但是我们并不需要100,我们需要分页,晒选总数是一百,可能不足一百,可能是50-60个,所以limitData是我们晒选后的结果
                current: 1,
                loading: false,// 此处loading由于是服务端一次给前端,所以loading可能闪动一次就不会再闪动了,第一次闪动也是很重要的
                // 剩下的参数和Table2的参数比较像
                sortType: 'normal',// sortType有三种,一种是normal,第二种是asc,第三种是desc;当我们去调handleSortChange的时候,会调handleSortChange
               // 同sortType,我们也会有一个filterType,因为我们的效果分等级一,等级二,全部,然后我们默认就给一个undefined，iview需要一个数据就是undefined
                filterType: undefined,// filterType可以的值就是undefined,1,2
                column: [
                      {
                       title: '号码',// column里面第一列我们给的是号码
                       key: 'number',// key我们给的是number
                       // sortable设置为true时,会直接对当前数据本地排序;设置为custom,则为自定义排序(或远程排序),就是说我们会通过@on-sort-change去排序
                       sortable: 'custom',// 写为custom就是服务端排序,如果只是服务端排序的话,sortable直接为true就可以了
                      },
                      // 第二列就是等级
                      {
                        title: '等级',
                        key: 'status',// 对应列内容的字段名,status是对应内容的字段名字
                        // 此处要自定义渲染列就是render
                        // render里面接收两个参数,一个是h,是vue里面createElement的方法,h是渲染window的一组节点;第二个参数是row，对象里面{里面可以传多个参数},params里面可以有多个参数,我们可以简写把params简写为{params}
                        render: (h, { row, index } ) =>{// {row}大括号{row}直接就相当于params.row了,如果有别的参数,index直接就写在括号里面了,不用再params.row了' const row = params.row'
                        // 如果row.status===1的话,我们直接return;如果row.status===1,我们显示一个绿色的标签,内容就是等级1
                        // if和else if这段代码能看出来,标签已经渲染出来了,等级的标签的筛选功能还没有;
                             if(row.status === 1){
                                return h('Tag', {
                                    props: {
                                        color: 'green'
                                    }
                                },'等级 1');// 就return一个Tag标签
                             }else if(row.status === 2){
                                return h('Tag',{
                                    props: {
                                        color: 'red'
                                    }
                                }, '等级 2')
                            }
                         },
                         // 要使用服务端过滤功能,我们要在这里配置这一列的参数,filters要告诉我们排序的表格里面的项都有什么,第一个是全部,第二个是等级一和等级二,全部iview已经帮忙内置了,一个filters里面就两项,一个是label,一个是value,这时候我们切换filter的时候就知道哪一个是单选项了,我们
                         filters: [
                             {
                                 label: '级别 1',
                                 value: 1,// 级别1对应的值是1
                             },
                             {
                                 label: '级别 2',
                                 value: 2,
                             }
                         ],
                         // 因为我们是单选,所以给filterMultiple设置为false
                         filterMultiple: false,// 这样设置就是单选了
                         // 写个方法filterMethod，就是根据我写了条件点了之后呢,后来处理我要做什么事儿,然后我们return了row.status===1,其实此方法我们在这里并用不到,我们是在服务端渲染的,此处属于前端渲染,我们只需要把filterType传给服务端就好了,此处只是介绍,注释掉就可以
                         filterMethod(value,row){
                                 if (value === 1) {
                                     return row.status ===1;
                                 }else if(value === 2){
                                     return row.status === 2;
                                 }
                         },
                         // 这个方法我们是在服务端排序的,所以要用filterRemote这个方法来排序,所以是远程排序
                         filterRemote(value){
                               // 此处把filterType设置为value的第0个，console.log(value)我们就知道为什么是第0个了
                               // console.log(value);// 打印一下看显示什么,就知道为什么是value[0]了
                               this.filterType = value[0];  
                         }
                        
                      },
               ],
                data:[],// 我们先把data填充进去,再去写我们的列,再去写其他的东西
            }
        },
        computed: {
                // limitData用来动态的计算我们的排序类型和过滤类型,通过这样的计算后把我们需要的数据返回过来，limitData就是排序和筛选完的数据
                limitData () {
                // 首先我们要用到数据,要赋值一下数据
                let data = [...this.data];// es6语法,扩展运算符,对数组进行了复制,复制一个数组,就不会影响原数组了
                // 动态的计算排序类型
                if(this.sortType === 'asc'){// asc是升序
                   data = data.sort((a,b) => {
                      return a.number > b.number ?1:-1;//加个1:-1岁所有浏览器都支持
                  })
                }
                // 写降序的部分
                if (this.sortType === 'desc'){
                    data = data.sort((a,b)=>{
                        return a.number < b.number ?1:-1;
                    })
                }
                if(this.filterType === 1){
                    data = data.filter(item => {
                        return item.status === 1;
                    })
                }else if(this.filterType === 2){
                    data = data.filter(item => {
                        return item.status === 2;
                    })
                }
                // data压根就没去改变,直接return data;
                return data;
                // 不可以直接把limitData赋值到Table里
                },
                dataWithPage(){// dataWithPage是最终要赋值给Table的数据
                    // 当我分页的时候去操作
                    const data = this.limitData;
                    // start开始时的起点,当前页*10再减去每页10个,是指开始的序号是多少
                    const start = this.current*10 -10;
                    // 结束序号
                    const end = start + 10;

                    return [...data].slice(start,end);//把开始结束这段数据返回来
                }
        },
        methods:{
            getData(){
                if(this.loading) return;
                this.loading = true;
                $.ajax({
                    method:'get',
                    url: '/data/list'// 后面就不带参数了,后台把所有数据返回
                }).then(res => {
                    // 此处用setTimeout去模拟能看到loading的效果
                    setTimeout(() => {
                        this.data = res.data.data.list;
                        this.total = res.data.data.total;
                        this.loading = false;
                    },1000)
                })
            },
            // 在初始化的时候请求数据
            mounted(){
                this.getData();
            },
              // handleSortChange()小括号中可以传{columns,key,order}，此处我们只要order
           handleSortChange ({columns,key,order}) {// 我们此处的order就是sortType,是否是normal,asc,desc
               this.sortType=order;
               // 在当前第一页,重新获取数据
               this.current=1;   

               // 我改了sortType,改了current当前页码,重新请求数据，此处的this.getData()是不需要的
               // this.getData();
           },
           handleFilterChange () {
               // handleFilterChange和handleSortChange稍微不一样的地方是站在filterRemote里面定义了我们的filterType
               // filterType已经在filterRemote里面改了,现在只要改current就行了
               this.current=1;//当前在第一页
               // 此处所有的数据都拿到了,this.getData不需要了
               // this.getData();//请求数据

           },
        }
    }
</script>