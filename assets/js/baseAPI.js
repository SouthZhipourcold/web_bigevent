$.ajaxPrefilter(function(options) {
    // 发送Ajxs请求前,统一拼接请求的根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    console.log(options.url);
})