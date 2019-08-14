<template>
    <div style="padding: 32px 64px">
         <h1>在外部进行表格的搜索、过滤、新建、隐藏某列等操作</h1>
         <br>
          <!--因为是行内的,所以要加个inline属性-->
          <Form inline :label-width="80">
              <FormItem label="主机名称:">
                  <i-Input v-model="form.name" placeholder="请输入" style="width: 200px"></i-Input>
              </FormItem>
              <FormItem label="使用状态:">
                  <!-- 下拉组件用Select组件 -->
                  <Select v-model="form.status" placehloder="请选择" style="with: 200px">
                        <Option :value="1">运行中</Option>
                        <Option :value="2">异常</Option>
                  </Select>
              </FormItem>
              <!-- 点击的时候就去请求数据,点击的时候,筛选条件会变,url要动态的设置 -->
              <Button type="primary" @click="getData" style="margin-right: 8px">查询</Button>
              <!--重置 -->
              <Button @click="handleReset">重置</Button>
          </Form>
          <!-- 复选框 -->
          <CheckboxGroup v-model="showColumns">
                 <Checkbox :label="0">主机名称</Checkbox>
                 <Checkbox :label="1">IP 地址</Checkbox>
                 <Checkbox :label="2">使用状态</Checkbox>
                 <Checkbox :label="3">最后修改时间</Checkbox>
          </CheckboxGroup>
          <Button type="primary" icon="md-add" @click="openCreate">新建</Button> 

          <br>

         <Table :columns="filterColumns" :data="data" :loading="loading" size="small"></Table>
         <!-- Modal框双向绑定的就是openCreate -->
         <Modal v-model="openCreate" title="新建主机">
                <Form>
                   <FormItem>
                       <i-input v-model="create.name" placeholder="主机名称"></i-input>
                   </FormItem> 
                   <FormItem>
                       <i-input v-model="create.ip" placeholder="IP 地址"></i-input>
                   </FormItem>   
                   <!-- 下拉选择项 -->
                   <FormItem>
                       <Select v-model="create.status" placeholder="使用状态">
                           <Option :value="1">运行中</Option>
                           <Option :value="2">异常</Option>
                       </Select>
                   </FormItem>
                   <!-- 日期选择器 -->
                   <FormItem>
                       <!-- 给Datepicker设置正常的年月日时分秒就给标签加type="datetime",因为前三个组件默认就是100%，所以这里也要给Datepicker设置100% -->
                       <DatePicker v-model="create.date" type="datetime" placeholder="最后更新时间" style="100%"></DatePicker>
                   </FormItem>
                </Form>  
                <!-- Button自定义一个slot,具名slot不用Modal自带的提交 -->
                <Button slot="footer" type="primary" @click="handleCreate">创建</Button>
         </Modal>
        
    </div>
</template>
<script>
import $ from '../libs/utils'
export default{
       data(){
        return {
          columns: [
              {
                title: '主机名称',
                key: 'name',// key是column对应列内容的字段名
              },
              {
                  title: 'IP 地址',
                  key: 'ip',
              },
              {
                   title: '使用状态',
                   key: 'status',
                   // 文字旁边有有小红,小蓝点,是Badge组件,用render函数渲染
                   render: (h, {row}) =>{
                       if(row.status === 1){// row.status === 1是进行中的状态
                          return h('Badge',{
                              props: {
                                   status: 'processing',
                                   text: '运行中',
                              }
                          })
                       }else if(row.status === 2){// row.status === 2是异常状态
                          return h('Badge',{
                              props: {
                                   status: 'error',
                                   text: '异常'
                              }
                          })
                       }
                   }
              },
              {
                  title: '最后修改时间',
                  key: 'date',
                  // iview3.0新出了Time,不用再去Data之类的去转了,直接用Time组件渲染就可以了,依然使用render函数
                  render: (h, {row}) => {
                        return h('Time', {
                            // row.date是个时间戳
                            props: {
                                time: parseInt(row.date),// 强制的转换为数字类型
                                // 渲染一个完整日期格式,如果不给个type,默认Time组件是相对时间,加了type就转换成年月日时分秒的正常结构了
                                type: 'datetime',

                            }
                        })
                  }
              }
          ],
          data: [],
          loading: false,      
          // 定义数据
          form: {
              name: '',//主机的name,用来做搜索用的
              status: '',// 状态的值分为运行中,异常状态,或者是不选,不选就是默认全部了;默认status是空,默认值运行中和异常都不选中,代表是全亮的状态
          },
          openCreate: false,// 当我点击的时候,让openCreate为true
          // create用来保存数据
          create: {
              name: '',
              ip: '',
              status: '',
              date: '',
          },
          isCreate: false,// 是否点了提交按钮正在提交中,否则避免你重复的多点几下
          showColumns: [0,1,2,3],// 默认显示1,2,3,4列都显示,把0,1,2,3都写进数组里去了，checkbox是多选,需要对应column里的每一列,对应哪个就操作哪个
        }
       },
       computed: {// 复选框和Table组件进行联动,要用到computed计算属性
              filterColumns(){// 这里就是要根据showColumns里面的项来动态的筛选出来对应的columns应该有哪几项
              const columns = [...this.columns];
              // 定义一个filterColumns为空、
              const filterColumns = [];
              // 把showColumns这个数据遍历
              this.showColumns.sort().forEach(item => {
                   filterColumns.push(columns[item]);
              })
              return filterColumns;//把filterColumns替换columns
              }
       },
       methods: {
           getData () {
            // 判断是不是loading中,如果是loading中,直接就return 
            if(this.loading) return;
            this.loading = true;
            // 此处要判断如果搜索了有内容给url加一个前缀,name是为了搜索用的
            let url = url;
            // 如果有选择,有搜索就是下面的if判断了
            if(this.form.name) url +=`/name/${this.form.name}`//在url上追加/name让我们搜索具体的参数
            if(this.form.status) url +=`/status/${this.form.status}`
            $.axjax({
                method: 'get',
                url: '/host/list',// 如果没选择也没搜索,路径是不变的,把url提取到外面
            }).then(res=>{
                // 用setTimeout来模拟延时,以便loading效果可以展示出来
                setTimeout(()=>{
                // 给data赋值我们的数据
                this.data = res.data.data.list;// 数据请求出来的话,就给loading设置为false
                this.loading = false;
                },1000)
            })
           },
           handleReset(){
               // 重置的话,先把搜索词置空,路径就是/host/list
               this.form.name = '';
               this.form.status='';
               // 重置以后再获取一下数据
               this.getData();
           },
           handleCreate(){
               // 我们点击创建按钮的时候,我们期望对form表格里的数据进行校验,因为这四项都是必填的;校验的方式有很多,使用iview内部的Form校验,主动对create进行校验
               if(this.isCreate) return;
               // 数据校验成功了才能到下面,否则还是要return出去的
               const name = this.create.name;
               const ip = this.create.ip;
               const status = this.create.status;
               let date = this.create.date;// date我们最终要给它转成时间戳,iview绑定完date是js的date类型,所以要用let
               // 非空校验
               if (name === ''){
                  this.$Message.error('请输入主机名称');
                  return;
               }  
               if(ip === ''){
                  this.$Message.error('请输入IP地址'); 
                  return;
               }
               if(status === ''){
                  this.$Message.error('请选择使用状态');
                  return;
               }
               if(date === ''){
                  this.$Message.error('请选择最后的修改日期')
               }else{// date类型要进行转换
                  date = (new Date(date)).getTime();// 能拿到毫秒级的时间戳,这样date传到服务器就是时间戳的格式了   
               }
               // 否则给this.isCreate设置为true
               this.isCreate = true;
               // 创建的话也需要请求数据,去服务端去取创建记录
               $.axjax({
                   method: 'post',
                   url: '/host/create',// 预先在mock里面已经声明好了api
                   data: {
                       name,
                       ip,
                       status,
                       date
                   }
               }).then(res => {
                   if(res.data.data.status === 'success'){// 如果等于success就成功了,成功之后就要追加到data里面
                     const newData = {
                         name,
                         ip,
                         status,
                         date
                     }
                     this.data = [newData].concat(this.data);
                     // 创建成功了以后我们就把this.isCreate置为false
                     this.isCreate = false;
                     this.openCreate = false;// 创建成功后模态框关闭
                   }
               })
           }
       },
       mounted(){
           // 在mounted的时候请求数据,请求数据需要把ajax导入进来
           this.getData();
       }
}
</script>