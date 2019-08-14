<template>
   <div style="padding: 32px 64px">
        <h1>服务端分页并排序过滤、过滤</h1>
        <!-- 需要Table组件和Page组件联动 -->
        <Table 
        :columns="columns" 
        :data="data" 
        :loading="loading" 
        border 
        size="small"
        @on-sort-change="handleSortChange"
        @on-filter-change="handleFilterChange"
        >
        </Table>
        <div style="text-align: center;margin:16px 0">
        <!--total是需要多少条数据,current是显示当前第几页,:current.sync="current"是同步的,第三个是当我请求分页的时候去请求数据@on-change="getData"-->
        <Page :total="total" :current.sync="current" @on-change="getData"></Page>
        </div>
   </div>
</template>
<script>
// 我们为了请求服务端数据,要先把ajax引进来
import $ from '../libs/utils'
// 说用到了服务端的排序了,就不用iview内置的排序了,当我点击了排序按钮的时候iview的@on-sort-change,要自己去服务端请求数据了,然后会写个handleSortChange方法占位,on-sort-change排序时有效，当点击排序时触发
// 过滤也是服务端过滤,当点击过滤的时候iview也会触发@on-filter-change这个方法
export default {
       data () {
           return {
               total: 0,// 总页默认是0
               current: 1,// 当前页默认给1
               loading: false,// 表格的loading默认是false，默认没有loading状态
               // 排序有三种: 一种是默认排序,一种是升序,一种是降序
               sortType: 'normal',// sortType有三种,一种是normal,第二种是asc,第三种是desc;当我们去调handleSortChange的时候,会调handleSortChange
               // 同sortType,我们也会有一个filterType,因为我们的效果分等级一,等级二,全部,然后我们默认就给一个undefined，iview需要一个数据就是undefined
               filterType: undefined,// filterType可以的值就是undefined,1,2
               columns: [
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
                         // 写个方法filterMethod，就是根据我写了条件点了之后呢,后来处理我要做什么事儿,然后我们return了row.status===1,其实此方法我们在这里并用不到,我们是在服务端渲染的,此处属于前端渲染,我们只需要把filterType传给服务端就好了,此处只是介绍,注释掉就可以,前端才用
                        //  filterMethod(value,row){
                        //          if (value === 1) {
                        //              return row.status ===1;
                        //          }else if(value === 2){
                        //              return row.status === 2;
                        //          }
                        //  },
                         // 这个方法我们是在服务端排序的,所以要用filterRemote这个方法来排序,所以是远程排序
                         filterRemote(value){
                               // 此处把filterType设置为value的第0个，console.log(value)我们就知道为什么是第0个了
                               // console.log(value);// 打印一下看显示什么,就知道为什么是value[0]了
                               this.filterType = value[0];  
                         }
                        
                      },
               ],
               data:[],// 我们先把data填充进去,再去写我们的列,再去写其他的东西
           };
       },
       methods: {
           // handleSortChange()小括号中可以传{columns,key,order}，此处我们只要order
           handleSortChange ({columns,key,order}) {// 我们此处的order就是sortType,是否是normal,asc,desc
               this.sortType=order;
               // 在当前第一页,重新获取数据
               this.current=1;   

               // 我改了sortType,改了current当前页码,重新请求数据
               this.getData();
           },
           handleFilterChange () {
               // handleFilterChange和handleSortChange稍微不一样的地方是站在filterRemote里面定义了我们的filterType
               // filterType已经在filterRemote里面改了,现在只要改current就行了
               this.current=1;//当前在第一页

               this.getData();//请求数据

           },
           // getData写到这里占位
           getData () {
                // 先判断我是否是加载中的状态,如果是加载中的状态就return，然后就给this.loading设置为true
                if(this.loading) return;
                // 给this.loading设置为true,让this.loading处于加载中
                this.loading = true;
                // 然后通过$.ajax这个方法让axios去请求数据
                $.ajax({
                    method: 'get',
                    // ${this.current}表示当前第几页,第二个参数是sortType是升序降序还是默认
                    url: `/data/list/${this.current}/${this.sortType}/${this.filterType}`
                }).then(res => {
                   // 为了实现loading的效果,我们加一个setTimeout定时器,实际开发中是不需要这个的,实际开发中当然是越快越好,纯属是为了显示loading的 
                   setTimeout(() => {
                       // 然后我们给data赋值,data.list是预先在mock中加好的数据
                       this.data = res.data.data.list;
                       this.total = res.data.data.total;
                       // 赋值完,有数据之后,给this.loading=false
                       this.loading=false
                   },1000);
                })
           }
       },
       // 而且我们在页面初始化的时候也请求数据,在mounted的时候this.getData()请求数据，现在数据没有问题了,剩下的就是我们把表格的列写好之后呢,这个数据就会过来了
       mounted () {
           this.getData ();
       }
}
</script>