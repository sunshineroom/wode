$(function () {

	var itemIndex = 0;
	var tabScrollTopArray = [0, 0];
	var tabLoadEndArray = [false, false];

	var dropload = $('.khfxWarp').dropload({
		scrollArea: window,
		domDown: {
			domClass: 'dropload-down',
			domRefresh: '<div class="dropload-refresh">上拉加载更多</div>',
			domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
			domNoData: '<div class="dropload-noData">没有更多数据了</div>'
		},
		loadDownFn: function (me) {
			setTimeout(function () {
				if(itemIndex == 0){
					loadNowData(me);
				}else{
					loadHistoryData(me);
				}
			}, 500);
		}
	});

	$('.tabHead div').on('tap', function () {
		tabScrollTopArray[itemIndex] = $(window).scrollTop();
		var $this = $(this);
		itemIndex = $this.index();
		$(window).scrollTop(tabLoadEndArray[itemIndex]);

		$(this).addClass('tab_active').siblings('.tabHead div').removeClass('tab_active');
		$('.tabHead .border').css('left', $(this).offset().left + 'px');
		$('.khfxPane').eq(itemIndex).show().siblings('.khfxPane').hide();

		if (!tabLoadEndArray[itemIndex]) {
			dropload.unlock();
			dropload.noData(false);
		} else {
			dropload.lock('down');
			dropload.noData();
		}
		dropload.resetload();
	});
});