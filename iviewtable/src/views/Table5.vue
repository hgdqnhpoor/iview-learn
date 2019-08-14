<template>
   <div style="padding: 32px 64px">
        <h1>可编辑行</h1>    

        <Table :columns="columns" :data="data"></Table>
   </div> 
</template>
<script>
   export default {
       data () {
           return {
               // 可编辑单元格的原理和可编辑行的原理类型,要先定义editIndex,和editValue
               // 我们把editIndex,和三个值放到数据里面
               editIndex: -1,
               // 三个输入框,需要三个editName, editAge,editAddress,对应的value去绑定
               editName: '',
               editAge: '',
               editAddress: '',
               columns: [
                   {
                       title: '姓名',
                       key: 'name',
                       render: (h, { row, index}) => {
                              let edit;// 一种是可编辑,另一种是不可编辑状态,没有说右边提交,定义一个edit就可以,右边的提交统一在操作里进行
                              // 如果我点击的编辑按钮的索引和这一行的索引一样的话进行一种操作
                              if(this.editIndex === index){
                                 // edit是个数组,最终render函数去return的h接收的第三个参数,即使edit只有一项,也需要有个数组 
                                 edit = [h('Input', {
                                        props: {
                                            value: row.name,
                                        },
                                        on: {
                                            input : (val) => {
                                                this.editName = val;
                                            }
                                        }
                                 })]
                              }else{// 如果不是this.editIndex === index的情况
                                 edit = row.name
                              }
                              // 用div包裹,把edit包裹起来
                              return h('div', [edit]);
                       }
                   },
                    {
                       title: '年龄',
                       key: 'age',
                       render: (h, { row, index}) => {
                              let edit;// 一种是可编辑,另一种是不可编辑状态,没有说右边提交,定义一个edit就可以,右边的提交统一在操作里进行
                              // 如果我点击的编辑按钮的索引和这一行的索引一样的话进行一种操作
                              if(this.editIndex === index){
                                 // edit是个数组,最终render函数去return的h接收的第三个参数,即使edit只有一项,也需要有个数组 
                                 edit = [h('Input', {
                                        props: {
                                            value: row.age,
                                        },
                                        on: {
                                            input : (val) => {
                                                this.editAge = val;
                                            }
                                        }
                                 })]
                              }else{// 如果不是this.editIndex === index的情况
                                 edit = row.age
                              }
                              // 用div包裹,把edit包裹起来
                              return h('div', [edit]);
                       }
                   },
                    {
                       title: '地址',
                       key: 'address',
                       render: (h, { row, index}) => {
                              let edit;// 一种是可编辑,另一种是不可编辑状态,没有说右边提交,定义一个edit就可以,右边的提交统一在操作里进行
                              // 如果我点击的编辑按钮的索引和这一行的索引一样的话进行一种操作
                              if(this.editIndex === index){
                                 // edit是个数组,最终render函数去return的h接收的第三个参数,即使edit只有一项,也需要有个数组 
                                 edit = [h('Input', {
                                        props: {
                                            value: row.address,
                                        },
                                        on: {
                                            input : (val) => {
                                                this.editAddress = val;
                                            }
                                        }
                                 })]
                              }else{// 如果不是this.editIndex === index的情况
                                 edit = row.address;
                              }
                              // 用div包裹,把edit包裹起来
                              return h('div', [edit]);
                       }
                   },
                   {   // 操作类不需要数据,所以不用写key,如果某一列用了render的话,key也是不用写的,因为自己去渲染内容了,操作是开启这一行边的行为,点修改,会出现保存和取消,一个是对号,一个是叉的图标
                       title: '操作',
                       render: (h, {row, index}) => {
                           if(this.editIndex === index ){
                             // 如果是开启状态的话,就需要开启两个按钮,一个是保存,一个是取消
                             // 需要两个按钮,我们return个数组
                             return [
                                 h('Button',{
                                   props: {
                                       type: 'success'
                                   },
                                   on: {
                                       click: () => {
                                           this.data[index].name = this.editName;
                                           this.data[index].age = this.editAge;
                                           this.data[index].address = this.editAddress;
                                           this.editIndex = -1;// 就是保存非编辑的状态
                                       }
                                   }   
                                 }, '保存'),
                                 h('Button',{
                                   props: {
                                       type: 'error'
                                   },  
                                   style: {
                                       marginLeft: '6px',
                                   },
                                   on: {
                                       click: () => {
                                       // 此处是取消的操作,直接给this.editIndex = -1;
                                       this.editIndex = -1;
                                       }
                                   }  
                                 }, '取消')
                             ]
                           }else{
                             // 如果这一行是普通的状态的话,这个按钮就要渲染成一个修改的单一的按钮
                             return h('Button', {
                                 on: {
                                     click: () => {
                                         // 我们点修改的时候,就是把值初始化
                                         this.editName = row.name;
                                         this.editAge = row.age;
                                         this.eidtAddress = row.address;
                                         // 把编辑的索引写成我们当前行的索引,状态发生变化以后,操作就会刷新到判断逻辑里面去了
                                         this.editIndex = index;
                                     }
                                 }
                             }, '修改')// 把按钮写为修改的文案
                           }
                       }
                   }
               ],
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
               ]
           }
       }
   }
</script>
