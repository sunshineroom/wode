/* mobile editor */
;(function($) {
	"use strict";
	
	//设置编辑器
	$.fn.aqmeditor = function(option){
		//拼合配置
		var defaults = $.extend(true, {
			"submit_handler" : null //提交处理函数
		}, option);
		
		//设置变量
		var self      = this;         //JQuery节点
		var self_node = this[0];      //原始JS节点
		var is_focus  = false;        //是否焦点
		var is_blank  = true;         //是否空白
		var range     = null;         //光标变量
		var id        = self_node.id; //id
        
		//--- 函数列表 ---
		//设置光标
		var setRange = function(){
			var selection = window.getSelection();
			range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
		};
		
		//恢复光标
		var recRange = function(){
			var range_old = range;
			var selection = null;
			try {
	            selection = document.getSelection();
	            selection.removeAllRanges();
	            selection.addRange(range_old);
	        } catch (ex) {
	            console.log(ex);
	        }
		};
		
		//执行命令
		var execCommand = function(command, bool, text){
			//恢复光标
			recRange();
			//插入内容
			document.execCommand(command, bool, text);
			//设置光标
			setRange();
		};
				
		//外部插入图片
		this.insertImage = function(src, type, width, height){
			//获取图片节点
			var html = '<p><img src="'+src+'" width="'+width+'" height="'+height+'"/></p>';
			//插入内容
			execCommand("insertParagraph",false);
			execCommand("insertHTML",false,html);
			execCommand("insertParagraph",false);
		};

		
		//外部获取格式化内容
		this.getHtml = function(){
			var rawHtml = $.trim(self.html()).replace(/<p><br><\/p>/g, '');
			var formatedMessage = [];
			var tmpMsg = '';
			
			//获取节点函数
			var handleMsg = function(elem){
				if (!elem || !elem.nodeType || !elem.nodeName) {
	                return;
	            }
				
	            var nodeName = elem.nodeName.toLowerCase();
	            var nodeType = elem.nodeType;
	            var children, length, i;
	
	            // 只处理文本标签和node标签
	            if (nodeType !== 3 && nodeType !== 1) {
	                return;
	            }
	
	            // 图片节点
	            if (nodeName === 'img' && elem.src) {
	                if (tmpMsg != '') {
                        formatedMessage.push(tmpMsg);
                    }
                    tmpMsg = 'img://' + elem.src;
                    formatedMessage.push(tmpMsg);
                    tmpMsg = '';
	                return;
	            }
	
	            // 文本标签，span节点
	            if (nodeType === 3 || nodeName === 'span') {
	                if (tmpMsg == '') {
	                    tmpMsg = 'txt://';
	                }
	                tmpMsg += elem.textContent || elem.innerHTML || $(elem).text() || $(elem).html();
	                tmpMsg = tmpMsg.replace(/<script[\s\S]*?<\/script>/ig, '');
	                return;
	            }
	
	            // div节点 p节点
	            if (nodeName === 'div' || nodeName === 'p') {
	                children = elem.childNodes;
	                length = children.length;
	                if (!length) {
	                    // 无子元素，则忽略
	                    return;
	                }
	                // 有子元素，则继续递归
	                for (i = 0; i < length; i++) {
	                    handleMsg(children[i]);
	                }
	            }
			};
			
	        if (rawHtml != '') {
	            // 创建dom
	            var elem = $('<div>' + rawHtml + '</div>').get(0);
	            handleMsg(elem);
	            if (tmpMsg != '') {
	                formatedMessage.push(tmpMsg);
	            }
	        }

	        return formatedMessage;
		};
		
		//获取全部内容
		this.getContent = function(){
			return $.trim(self.html());
		};
		
		//编辑器为空的处理
		var setEditorEmpty = function(){
			//如果内容为空的情况，设置<p><br/></p>
			var html = $.trim(self.html());
			if(html == ""){
				self.html("<p><br/></p>");
			}
		};
		
		//插入图片信息
		
		//--- 事件列表 ---
		//设置事件
		self_node.addEventListener("blur", function(){
            is_focus = false;
			console.log("onblur" + is_focus);
		});

		self_node.addEventListener("focus", function(){
            is_focus = true;
			console.log("onfocus" + is_focus);
		});
		
		//--- 初始化过程 ---
		setInterval(function(){
			//选中状态 & 设置光标 & 如果为空自动添加上<p><br/></p>
			console.log("interval" + is_focus);
			if(is_focus == true){
				setRange();
				//setEditorEmpty();
			}
		},100);
		
		//初始化光标范围
		range = document.createRange();
		range.setStart(self_node.firstChild, 0);

		return self;
	};
})(jQuery);