$(function() {

    initArtCateList();
    const layer = layui.layer;
    const form = layui.form;

    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                const htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    };

    // 为添加类别按钮绑定点击事件
    let indexAdd = null;
    $('#btnAddCate').on('click', function() {
        // layer.open() 展示弹出层
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $("#dialog-add").html(),
        })
    });


    // 通过代理的形式，为 form-add 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function(e) {
        // 阻止默认提交行为
        e.preventDefault();
        // 发起Ajax请求
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！');
                }

                initArtCateList();
                layer.msg('新增分类成功！')
                    // 根据索引，关闭对应的弹出层
                layer.close(indexAdd);
            }
        });
    });




    //通过代理的形式，为 btn-edit 按钮绑定点击事件
    let editIndexAdd = null;
    $('tbody').on('click', '.btn-edit', function() {
        editIndexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '编辑类别',
            content: $('#dialog-edit').html()
        });

        let id = $(this).attr('data-id');
        // console.log(id);
        // 发起请求获取对应分类的数据
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res);
                // 获取已有信息的加载
                form.val('form-edit', res.data);
            }
        });
    });

    //通过代理的形式，为 修改分类的表单绑定 submit 事件
    $('body').on('submit', '#form-edit', function(e) {
        // 阻止默认提交行为
        e.preventDefault();
        // 发起Ajxs请求
        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类信息失败!')
                }
                layer.msg('更新分类信息成功!')
                    // 根据索引，关闭对应的弹出层
                layer.close(editIndexAdd);
                initArtCateList();
            }
        });
    });

    //通过代理的形式，为删除按钮绑定点击 事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
            // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    initArtCateList()
                }
            });
        });
    });
})