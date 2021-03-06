$(function() {
    const form = layui.form;
    const layer = layui.layer;
    // 校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        rePwd: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！'
            }
        }
    });

    $('.layui-form').on('submit', function(e) {
        // 阻止默认提交行为
        e.preventDefault();

        // 发起Ajxs请求
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            // success:function (res)  {
            success: (res) => {
                if (res.status !== 0) {
                    return layer.msg('更新密码失败!')
                }
                layer.msg('更新密码成功!')

                // 重置表单(清空表单)
                // $('.layui-form')[0].reset();
                this.reset();
            }
        });
    });
})