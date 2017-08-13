$(function() {
    $('.movie_list_del').on('click', function() {
        var id = $(this).data('id');
        var tr = $('.item-id-' + id);

        $.ajax({
                type: 'DELETE',
                url: '/admin/movie/list?id=' + id
            })
            .done(function(result) {
                console.log(result)
                if (result.success === 1) {
                    if (tr.length > 0) {
                        tr.remove();
                    }
                }
            });
    });

    // 删除用户
    $('.user_list_del').on('click', function() {
        var id = $(this).data('id');
        var tr = $('.item-id-' + id);

        $.ajax({
                type: 'DELETE',
                url: '/admin/user/list?id=' + id
            })
            .done(function(result) {
                console.log(result)
                if (result.success === 1) {
                    if (tr.length > 0) {
                        tr.remove();
                    }
                }
            });
    });
});