<template>
    <dev-article>
        <Row :gutter="16">
            <i-col span="6">
                <Card shadow title="访问量">
                    <!--Tag文档里面slot填上extra就会显示在Card的右上角  -->
                   <Tag color="green" slot="extra">周</Tag>
                   <div class="count">123,000</div>
                   <Divider></Divider>
                   日访问量 1,230
                </Card>
            </i-col>
            <i-col span="6">
                <Card shadow title="总销售额">
                    <!-- Tooltip是气泡提示,里面包的是notification的通知的提示Icon,transfer不受父级影响,因为header有定位层级比较高,然后把样式会放到body里面不受父级影响 -->
                    <Tooltip content="这里是指标说明" slot="extra" placement="top" transfer>
                        <Icon type="ios-alert-outline" size="18" ></Icon>  
                    </Tooltip>
                    <div class="count">￥880,000</div>
                    <Divider></Divider>
                    周同比 12% <Icon type="md-arrow-dropup" size="22" color="#ed4014"/>
                    日环比 10% <Icon type="md-arrow-dropdown" size="22" color="#19be6b" />
                </Card>
            </i-col>
            <i-col span="6">
                <Card shadow title="运营活动效果">
                    <Tooltip content="这里是指标说明" slot="extra" placement="top" transfer>
                        <Icon type="ios-alert-outline" size="18"></Icon>
                    </Tooltip>
                    <div class="count">75%</div>
                    <Divider></Divider>
                    <!-- status可以改颜色,success是绿色,hide-info会隐藏绿色的图标 -->
                    <Progress :percent="75" status="success" hide-info/>
                </Card>
            </i-col>
            <i-col span="6">
                <Card shadow title="快捷操作">
                    <Row>
                        <!-- 用户事先不知道有多少col,是后配置出来的,所以col位置我们用个循环 -->
                        <i-col v-for="item in shortcuts" :key="item.title" span="8">
                            <Button :to="item.action">{{ item.title }}</Button>
                        </i-col>
                    </Row> 
                    <Divider></Divider>
                    <!-- long是Button的一个属性,加了long属性按钮的长度为100%;Button有icon属性,给Button加一个加号+;@on-ok点击按钮的时候就会往shortcuts里面加一组数据 -->
                    <Button type="primary" long icon="md-add" @click="newShortcut.status = true">添加</Button>
                </Card>
            </i-col>
        </Row>
        <Card shadow style="margin-top:16px">
            <Tabs value="sell">
                <!-- 我们想做定位又不想多写css和js,我们用Tabs的具名slot的extra去定位 -->
                <!-- 为什么写template不清楚 -->
                <template slot="extra">
                    <!-- slot包含的内容较多时,可使用Vue内置的template标签包裹,它也经常用于v-if指令,然后给template标签加slot="extra"属性,就定位在右侧了; -->
                    <!-- 点击handlesetDate的时候,会触发label,会通过点击的handlesetDate触发Radio的label标签,能拿到label的值 -->
                    <RadioGroup v-model="dataType" @on-change="handleSetDate">
                          <!-- label对应的数据里面的dataType里面的数据,v-model的dataType就会切换对应的label值,然后对DatePick的v-model的countDate赋值-->
                          <Radio label="day">今日</Radio>
                          <Radio label="week">本周</Radio>
                          <Radio label="month">本月</Radio>
                          <Radio label="year">本年</Radio>   
                    </RadioGroup>
                    <!-- daterange可以跨越选择,所以v-model绑定的是个数组;Card默认有个overflow:hidden属性,给DatePicker加一个transfer就好了 -->
                    <DatePicker type="daterange" v-model="countDate" style="width: 250px" transfer></DatePicker>
                </template>
                <!-- label和name都是TabPane的属性;TabPane的name属性值对应Tabs的value得属性值,label是选项卡头显示文字 -->
                <TabPane label="销售额" name="sell">
                    <Row>
                        <!-- 初始化echarts是需要设置宽高的 -->
                        <i-col span="18">
                            <div style="width: 100%;height: 400px;" ref="chart"></div>
                        </i-col>
                        <i-col span="6">
                            <!-- columns表格列的配置描述 -->
                            <Table :columns="tableColumns" :data="tableData"></Table> 
                        </i-col>
                    </Row>
                </TabPane>
                <TabPane label="访问量" name="visit"></TabPane>
            </Tabs>
        </Card>

        <!-- Modal没有层级,是自动加在body里面的,所以放在哪个位置不重要,Modal有title属性,对话框标题，如果使用 slot 自定义了页头，则 title 无效;用来双向绑定值,和输入框的状态,在newShortcut里面 -->
        <Modal title="添加快捷操作" v-model="newShortcut.status"  @on-ok="handleAddNewShortcut">
            <Input v-model="newShortcut.title"  placeholder="快捷操作标题..." />
            <Input v-model="newShortcut.action"  placeholder="快捷操作链接..." />
        </Modal> 
    </dev-article>     
</template>
<script>
import echarts from 'echarts';
export default {
       data () {
           return {
               shortcuts: [
                   {
                    title: '操作一',
                    action: '/manage'
                   },
                   {
                    title: '操作二',
                    action: '/push'   
                   },
               ],
               newShortcut: {
                    // 给个status属性
                    status: false,
                    title: '',
                    action: '',
               },
               // 默认会绑定一个值
               dataType: 'day',// day, week, month, year
               countDate:[new Date(), new Date()],
               tableColumns: [
                   {
                       type: 'index'
                   },
                   {
                       title: '名称',
                       key: 'name'
                   },
                   {
                       title: '销售额',
                       key: 'sell'
                   }
               ],
               tableData: [
                   {
                       name: '门店 1',
                       sell: '123,000'
                   },
                   {
                       name: '门店 2',
                       sell: '123,000'
                   },
                   {
                       name: '门店 3',
                       sell: '123,000'
                   },
                   {
                       name: '门店 4',
                       sell: '123,000'
                   },
                    {
                       name: '门店 5',
                       sell: '123,000'
                   },
               ]

           }
       },
       methods: {
          handleAddNewShortcut(){
                this.shortcuts.push({
                    title:this.newShortcut.title,
                    action:this.newShortcut.action,
                })
           },
          handleSetDate(type){
              // 为了计算日期简便,我们把日期都转换成时间戳
              // 获取到今天的毫秒时间戳
              const today = (new Date()).getTime();
              let date;

              switch(type){
                  case 'day': date = today;break;
                  // JS的Date无法直接加减,转换为时间戳方便计算,一天是86400秒换成毫秒是86400000,7天需要再乘以7
                  case 'week': date = today - 86400000*7;break;
                  case 'month': date = today -86400000*30;break;
                  case 'year': date = today -86400000*365;break;
                  // DatePicker的v-model的countDate不能写时间戳,要写date类型
                  // new Date(date)把时间戳转日期 new Date(today)把时间戳转换为当日当星期当月当年的具体日期 
              }
              this.countDate = [(new Date(date)), (new Date(today))]
          },
          initChart(){
              // Vue的ref如果用在组件上,得到的是组件实例,用在普通节点(如div)上则得到DOM对象
              const myChart = echarts.init(this.$refs.chart);
              
              const option = {
                    title: {
                        text: '销售额'
                    },
                    tooltip: {},
                    legend: {
                        data:['销量']
                    },
                    xAxis: {
                        data: ['衬衫',"羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
                    },
                    yAxis: {},
                    series: [{
                        name: '销量',
                        type: 'bar',
                        data: [5, 20, 36, 10, 10, 20]
                  }]         
              };
              myChart.setOption(option);
          }  
       },
       mounted(){
              this.initChart();
       }
}
</script>
<style>
    .count{
        font-size: 24px;
    }
</style>


