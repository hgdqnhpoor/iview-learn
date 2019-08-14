// 把axios导入进来
import axios from 'axios';
// 我们声明一个util方法,里面可以无限扩充
let util = {};
// 对axios进行一个简单的封装
util.axjax = axios.create({
    // 封装了之后,我们就不用写一长串http加上路径,写相对路径就可以了,预先在mock上做了一些模拟数据,
    baseURL: ' http://localhost:8080/',
    timeout: 3000,// 如果超时的话,ajax就会中断,报一个错误
})

// 我们默认把util导出,方法库我们简单的就写好了
export default util;
