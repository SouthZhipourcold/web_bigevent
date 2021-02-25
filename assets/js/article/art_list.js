$(function() {

    const form = layui.form;
    const layer = layui.layer;
    const laypage = layui.laypage;

    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    const q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    };
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)
        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())
        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    };
    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    };

    initTable();
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: q,
            success(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 使用模板引擎渲染页面的数据
                const htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);

                // 调用渲染分页的方法
                renderPrage(res.total);
            }
        });
    };

    initCate();
    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！');
                }
                // 调用模板引擎渲染分类的可选项
                const htmlStr = template('tpl-cate', res);
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr);
                //渲染表单区域的UI结构
                form.render();
            }
        });
    };


    // 为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        // 获取表单中选中项的值
        let cate_id = $('[name=cate_id]').val();
        let state = $('[name=state]').val();
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable();
    });


    // 定义渲染分页的方法
    function renderPrage(total) {
        // console.log(total);
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ["count", "limit", "prev", "page", "next", "skip"],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发 jump 回调
            jump: function(obj, first) {
                // console.log(first);
                // console.log(obj.curr);
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr;
                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit;
                // 根据最新的 q 获取对应的数据列表，并渲染表格
                // initTable()
                if (!first) {
                    initTable();
                };
            }
        });
    };


})