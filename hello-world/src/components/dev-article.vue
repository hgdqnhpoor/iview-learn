<template>
   <!-- 此处Layout不需要div作为根节点,Layout就是根节点 -->
   <Layout>
       <Header class="header">
          <Row>
             <i-Col span="4">
                <img src="../assets/logo.png" alt="logo" class="logo">
             </i-Col>
             <i-Col span="14">
                <Menu mode="horizontal" :active-name="activeName">
                    <MenuItem name="/app" to="/app">
                         应用分析
                    </MenuItem>
                    <MenuItem name="/push" to="/push">
                         推送营销
                    </MenuItem> 
                    <MenuItem name="/dev" to="/dev">
                         开发助手
                    </MenuItem>
                    <MenuItem name="/manage" to="/manage">
                         应用管理
                    </MenuItem>
                </Menu> 
             </i-Col>
             <i-Col span="4">
                    <Row>
                       <i-col span="8">
                          <Dropdown>
                               <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" />
                               <DropdownMenu slot="list">
                                     <DropdownItem>我的主页</DropdownItem>
                                     <DropdownItem>我的收藏</DropdownItem>
                                     <DropdownItem>
                                          设置
                                       <Badge status="error"></Badge>
                                     </DropdownItem>
                                     <DropdownItem>退出登录</DropdownItem>
                                     <DropdownItem divided>北京烤鸭</DropdownItem>
                               </DropdownMenu>
                          </Dropdown>  
                       </i-col>
                       <i-col span="8">
                           <Dropdown>
                                 <!-- offset=“[距上的位移,距右的位移]” -->
                                 <Badge :count="2" :offset="[20,4]">
                                      <a href="#" class="demo-badge">
                                        <Icon type="md-notifications-outline" size="24"></Icon>
                                      </a>
                                 </Badge>
                                 <DropdownMenu slot="list">
                                         <!-- notification给了tabs的value,这样就是默认通知项了 -->
                                         <Tabs value="notification">
                                             <TabPane label="通知" name="notification">
                                                  <div class="notification">通知内容</div>
                                             </TabPane>
                                             <TabPane label="关注" name="follow">
                                                  <div class="notification">关注内容</div>     
                                             </TabPane>
                                             <TabPane label="系统" name="system">
                                                  <div class="notification">系统内容</div>
                                             </TabPane>
                                         </Tabs>                                     
                                 </DropdownMenu>
                           </Dropdown>  
                       </i-col>
                       <i-col span="8">
                                 <Icon type="md-color-palette" size="24" @click="openTheme = true"></Icon>     
                       </i-col>
                    </Row>
             </i-Col>
          </Row>
       </Header>
       <Layout>
           <!-- :class="{'sider-hide': isCollapsed},此处isCollapsed如果为true的话,出发side-hide,通过Menu的class名称sider-menu定位到MenuItem里面的span,让它隐藏 -->
           <Sider class="sider" width="240" collapsible v-model="isCollapsed" :class="{'sider-hide': isCollapsed}">
                  <!--默认把option2高亮,给active-name了option2  -->
                  <Menu theme="dark" active-name="option2" class="sider-menu">
                     <MenuItem name="option1">
                          <Icon type="ios-search"></Icon>
                          <span>option 1</span>
                     </MenuItem>
                     <MenuItem name="option2">
                          <Icon type="ios-apps"></Icon>
                          <span>option 2</span>
                     </MenuItem>
                     <MenuItem name="option3">
                          <Icon type="ios-bookmark"></Icon>
                          <span>option 3</span>
                     </MenuItem>
                  </Menu>
           </Sider>
           <Content class="content" :class="{'content-expand': isCollapsed}">
                     <!-- slot是掌控着每一个页面的内容,App.vue、Push.vue、Dev.vue、Manage.vue都会映射到slot里面显示内容 -->
                     <slot></slot>
           </Content>   
       </Layout>   
       <!-- 打开还是关闭,我们用一个openTheme -->
       <Drawer title="选择配色" v-model="openTheme" :closable="false"></Drawer>
   </Layout> 
</template>
<script>
export default {
     data(){
        return {
           activeName: this.$route.path,
           count: 2,
           openTheme: false,
           isCollapsed: false,   
        }
     },
     created () {
        this.activeName = this.$route.path
     }
}
</script>
<style>
    .header{
       width: 100%;
       height: 60px;
       position: fixed;
       left: 0;
       top: 0;
       background: #fff;
       box-shadow: 0 1px 1px rgba(0,0,0,.05);
       z-index: 2;
    }
    .logo{
       height: 50px;
       margin-top: 5px;
    }
    .notification{
       text-align: center;
       height: 200px;
    }
    .ivu-menu-horizontal.ivu-menu-light:after{
       display: none;
    }
    .sider{
       position: fixed;
       height: 100%;
       left: 0;
       /* 超过整一个一屏的时候让它自动滚动overflow: auto */
       overflow: auto;
       /* .header的z-index给的是2,.sider的z-index给1 */
       z-index: 1;
    }
    .sider-menu{
       /* 距顶部菜单栏60px,所以给margin-top：60px */
       margin-top: 60px;
    }
    .sider-hide .ivu-menu-item span{
       display: none;
    }
    .content{
       margin-left: 240px;
       margin-top: 60px;
       padding: 16px;
       transition: all .2s ease-in-out;
    }
    .content-expand{
       margin-left: 64px;
    }
</style>

