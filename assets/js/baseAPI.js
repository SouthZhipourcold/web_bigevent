$.ajaxPrefilter(function(options) {
    // 发送Ajxs请求前,统一拼接请求的根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    // console.log(options.url);

    // 统一为有权限的接口,设置headers请求
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.token || '',
        };
    }
})