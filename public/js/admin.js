$(function() {
    $('.del').on('click', function() {
        var id = $(this).data('id');
        var tr = $('.item-id-' + id);

        $.ajax({
                type: 'DELETE',
                url: '/admin/list?id=' + id
            })
            .done(function(result) {
                console.log(result)
                if (result.success === 1) {
                    if (tr.length > 0) {
                        tr.remove();
                    }
                }
            })
    })
});