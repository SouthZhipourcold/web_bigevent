// $.Ajxs(),$.post(),$.get()
$.ajaxPrefilter(function(options) {
    // 发送Ajxs请求前,统一拼接请求的根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    // console.log(options.url);

    // 统一为有权限的接口,设置headers请求
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.token || '',
        };
    };
    // 统一为有权限的接口
    options.complete = function(res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            // 1.强制清空token
            localStorage.removeItem('token');
            // 2.跳转到login.html页面
            location.href = '/login.html';
        }
    }
})