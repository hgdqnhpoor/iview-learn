<template>
    <dev-article>
        <!-- Card默认有16像素的padding间距 -->
        <Card shadow :padding="0">
              <!-- 下面的列小于992的时候,Tabs页出来 -->
              <Row>
                  <!-- 小于992的时候占满一行,为24,宽屏的时候就等于0,sm是窄屏,md是宽屏 -->
                  <!-- label选项卡头显示文字;name,用于标识当前面板，对应 value，默认为其索引值 -->
                  <i-col :sm="24" :md="0">
                      <Tabs value="option1">
                          <TabPane label="设置 1" name="option1"></TabPane>
                          <TabPane label="设置 2" name="option2"></TabPane>
                          <TabPane label="设置 3" name="option3"></TabPane>
                      </Tabs>   
                  </i-col>
              </Row>
              <!-- 我们给Card设置了padding为0,如果不给CellGroup的Row设置padding16,那我们的form就该顶格写了 -->
              <Row>
                  <!--i-col,md的最小临界是992,当小于992的时候,小于992的时候触发sm,然后这一列就没了,就不存在了;如果>=992的时候就是4列的布局;此处i-col列消失后的话,我们在上面写个Tabs选项卡 -->
                  <i-col :sm="0" :md="4">
                    <CellGroup>  
                      <!-- Cell左侧标题, -->
                      <Cell title="设置 1" to="/manage" selected></Cell>
                      <Cell title="设置 2" to="/manage"></Cell>
                      <Cell title="设置 3" to="/manage"></Cell>
                    </CellGroup>  
                  </i-col>
                  <!-- 如果是窄屏的话,我们就设置24,如果是宽屏的话,我们就设置20,因为左边CellGroup设置了4列 -->
                  <i-col :sm="24" :md="20">
                      <!-- 左边是列表,右边是上传图片 -->
                      <Row style="padding:16px" :gutter="64">
                          <i-col span="12">
                              <!-- label-position,表单域标签的位置，可选值为 left、right、top -->
                              <Form label-position="top">
                                  <FormItem label="邮箱">
                                      <Input v-model="form.mail" />
                                  </FormItem>
                                    <FormItem label="昵称">
                                      <Input v-model="form.name" />
                                  </FormItem>
                                    <!-- 表单域元素,type给个textarea,默认的行数是4行:rows="4"-->
                                    <FormItem label="个人介绍">
                                      <Input v-model="form.desc" type="textarea" rows="4"/>
                                  </FormItem>
                                    <FormItem label="国家">
                                      <Select v-model="form.country" transfer>
                                              <Option value="中国">中国</Option>
                                              <Option value="美国">美国</Option>
                                      </Select>
                                  </FormItem>
                                    <FormItem label="电话">
                                      <Row :gutter="16">
                                          <!-- 区号比较少,给个6就可以 -->
                                          <i-col span="6">
                                             <Input v-model="form.zone"/>
                                          </i-col>
                                           <i-col span="18">
                                              <Input v-model="form.phone"/>
                                          </i-col>
                                      </Row>
                                  </FormItem>
                              </Form>
                              <Button type="primary" size="large">更新信息</Button>
                          </i-col>
                          <i-col span="12">
                             <Avatar icon="ios-person" size="large"></Avatar>
                              <Upload action="//jsonplaceholder.typicode.com/posts/">
                                     <Button icon="ios-cloud-upload-outline">上传头像</Button>
                              </Upload>    
                          </i-col>
                      </Row>
                  </i-col>
              </Row>
        </Card>
    </dev-article>
</template>
<script>
export default {
       data(){
           return {
               form: {
                   mail: '',
                   name: '',
                   desc: '',
                   country: '中国',
                   zone: '010',
                   phone: '1000000'
               }
           }
       }
}
</script>
<style>

</style>


