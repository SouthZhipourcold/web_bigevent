$(function() {
    const { form, layer } = layui;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称不能大于6位!';
            }
        }
    });

    initUserInfo();

    function initUserInfo() {
        // 获取用户基本信息
        $.ajax({
            type: 'GET',
            url: '/my/userinfo',
            success(res) {

                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！');
                }

                console.log(res);
                // 调用form.val()快速为表单赋值
                form.val('formUserInfo', res.data);
            }
        })
    }

    $('#btnReset').on('click', function(e) {
        //    阻止默认提交行为
        e.preventDefault();
        initUserInfo();
    })

    // jianting表单的提交事
    $('.layui-form').on('click', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败!')

                }
                window.parent.getUserInfo()
            }
        })

    })
});