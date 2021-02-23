$(function() {
    // 点击"去注册账户"的链接
    $("#link_reg").on("click", function() {
        $(".login-box").hide();
        $(".reg-box").show();
    });
    // 点击"去登录"的链接
    $("#link_login").on("click", function() {
        $(".login-box").show();
        $(".reg-box").hide();
    });

    // 从layui中获取form对象
    const form = layui.form;
    const layer = layui.layer;
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义用户名校验规则
        username: function(value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }
            //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
            if (value === 'xxx') {
                alert('用户名不能为敏感词');
                return true;
            }
        },
        // 自定义了一个叫pass校验规则
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致
        repasswd: function(value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行比较是否一致
            // 如果判断失败，则return一个提示消息
            let password = $(".reg-box [name=password]").val();
            if (password != value) {
                return '两次密码不一致';
            }
        }
    });

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        //1. 阻止默认提交行为
        e.preventDefault();
        // 2.发起Ajxs的POST请求
        let data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        };
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg('注册失败！');
            }
            layer.msg('注册成功！');
            // 模拟点击行为 自动跳转登录页面
            $('#link_login').click();
        })
    });




    // 监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        // 阻止默认行为
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('登录失败！');
                }
                layer.msg('登录成功！');
                // console.log(res.token);
                localStorage.setItem('token', res.token);
                // 跳转到后台页面
                location.href = '/index.html';
            },

        });
    });

});