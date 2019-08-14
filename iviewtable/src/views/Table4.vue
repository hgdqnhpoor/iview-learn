<template>
   <div style="padding: 32px 64px">
        <h1>可编辑单元格</h1>

        <Table :columns="columns" :data="data" border></Table>
   </div>
</template>
<script>
   export default {
         data () {
             return {
                 editIndex: -1,// 给负一就证明现在哪一行都还没有,如果我点击了哪个编辑按钮之后呢,再把editIndex设置为对应的行的索引值
                 // 为了避免重绘,我们单独写个数据
                 editValue: '',
                 columns: [
                     {
                         title: '姓名',
                         key: 'name',
                         // 会用到iview里面的render属性,接收一个row行接收一个index索引,通过row我能拿到某一行的数据,和某一行的索引值
                         render: (h, { row, index })=> {
                               // edit和control最终会渲染出vdom的节点,点击某一行某一行就会变成输入框
                               // 左边是一个纯文本
                               let edit;
                               // 右边是一个按钮,右边有两个control按钮,一个对号一个叉,contorl是两个Icon组件
                               let control;
                               // 如果我点击了this.editIndex这个编辑按钮如果等于这一行的索引
                               if(this.editIndex === index){// 此处的index正好对应上render的index
                                 // edit就会渲染成一个iview的input的输入框
                                 // iview,h(Input)组件有个方法叫v-model方法绑定数据,在render函数是没法写v-model语法糖的,但是v-model是由props:value和自定义事件on:input组成的语法糖，on监听了input事件,在此处我们把实时监听的数据保存起来,但是我们不能把数据直接保存到Table的data中,因为Table中的data是很复杂的数据监听,当我里面的任意一项修改了,整个Table是重绘的,如果直接修改data的数据的话,那Table就会进行一个闪动,输入框也会失焦
                                 edit = [h('Input', {
                                     props:{
                                         value: row.name,// 就是从我们这个行把姓名和name读取出来就可以了
                                     },
                                     // 此处是一个事件,input事件
                                     on: {
                                         // input事件
                                         input: (val) =>{// 在输入框里面我们实时输入的数据暂时保存在editValue里面就可以了,val是返回的值,input双向绑定我们就实现了,这只是对iview的h('Input')进行的双向绑定,我们还没有点击提交按钮保存到数据中
                                         this.editValue = val;
                                         }
                                     }
                                 })];
                                 control = [
                                     h('Icon',{
                                         style: {
                                             cursor: 'pointer',// 小手的样式
                                             margin: '8px',
                                         },
                                         props: {
                                             type: 'md-checkmark',
                                             size: 16,
                                             // 保存按钮给个绿色
                                             color: '#19be6b'
                                         },
                                         // 此处我们要给绑定自定义的click事件;如果此处用原生的Naiveon监听也是一样的,里面的代码也是一样的
                                         on: {
                                             // iview对Icon默认代理了click事件,因为这个事件是比较常用的,Button也是代理了这个事件,如果其他组件iview没有代理的话,那就使用nativeOn绑定@click.native，我们可能在html的template中写,@click.native的修饰符
                                             click: () => {
                                                  // 点击了保存就要修改表格的data,修改了当行的数据,把当行的name,把name改成双向绑定的39行的editValue
                                                  this.data[index].name = this.editValue;
                                                  this.editIndex = -1;// 恢复到没点的状态,如果那个条件失效就会转到else这个条件,就保存成功了
                                             }
                                         }
                                     }),
                                     // 取消按钮
                                     h('Icon', {
                                         style: {
                                             cursor: 'pointer',
                                             margin: '8px'
                                         },
                                         props: {
                                             type: 'md-close',
                                             size: 16,
                                             color: '#ed4014'
                                         },
                                         // 点击取消
                                         on: {
                                             click: () => {
                                                 // 点击到取消的时候就让它恢复到原来的状态,this.editIndex=-1
                                                 this.editIndex = -1;
                                             }
                                         }
                                     })
                                 ]
                               }else {// 如果当前行不是editIndex这一行的话,是一个普通行的话
                                     edit = row.name;
                                     // 点按钮的时候,给control一个赋值,直接写iview的Icon属性就行了
                                     control = [h('Icon', {
                                         // 给图标加一些基本的样式
                                       style:{ 
                                         cursor: 'pointer',//可点击,变成手的形状
                                       },
                                       props: {
                                           // type加的是可输入的图标
                                           type: 'ios-create-outline',
                                           size: 16,// 文档上是default,large,small
                                       },
                                       on: {// 此处的on绑定的是自定义事件,而不是原生的事件nativeOn
                                           click : () => {
                                            // 此处我们点击某一个按钮的时候,然后把一行变成可输入状态,所以我们要把editIndex指定我们当前行的索引,所以就把this.editIndex=index指定为我们当前行的索引值
                                            this.editIndex = index;
                                            // 把this.editValue初始化;如果你输入了一半,没继续输了,点取消了,我们希望下次打开了重新复制一个row.name,不保存临时数据了
                                            this.editIndex = row.name;
                                           }
                                       }
                                     })] 

                               }
                               // 要把数据return出去
                               return h('Row', [
                                   h('Col', {
                                       props: {
                                           span: 18,// 18列
                                       }
                                   },edit), 
                                   h('Col', {
                                       props: {
                                           span: 6,// 6列
                                       }
                                   }, control)
                               ])
                         }
                     },
                     {
                         title: '年龄',
                         key: 'age'
                     },
                     {
                         title: '地址',
                         key: 'address'
                     }
                 ],
                 // 本节课主要讲的主要是render的写法,所以对数据不是很大的要求
                 data: [
                      {
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park',
                        date: '2016-10-03'
                    },
                    {
                        name: 'Jim Green',
                        age: 24,
                        address: 'London No. 1 Lake Park',
                        date: '2016-10-01'
                    },
                    {
                        name: 'Joe Black',
                        age: 30,
                        address: 'Sydney No. 1 Lake Park',
                        date: '2016-10-02'
                    },
                    {
                        name: 'Jon Snow',
                        age: 26,
                        address: 'Ottawa No. 2 Lake Park',
                        date: '2016-10-04'
                    }
                 ],
             }
         } 
   }
</script>