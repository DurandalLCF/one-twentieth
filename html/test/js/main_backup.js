var myalert;
var realip='';
var rank=0;
var nextflag=false;
var uploadsucc=false;
var pro_pic_url='';
var picturenum=-1;
var inputname='';
var combine = false;

function preview(file) {
	var prevDiv = document.getElementById('preview');
	var filetype = ['jpg','jpeg','png'];
	//myalert($('.current-dot').index());

	if (file.files && file.files[0]) {
		var picture = file.files[0];
		var picname = picture.name.split('.');
		
		if(filetype.indexOf(picname[1].toLowerCase()) == -1){
			myalert('文件格式不支持','');
			return ;
		}
		
		//document.getElementById("myform").action = "Uploadspicture.php?filename="+realip;
		//document.getElementById("myform").submit();

		nextflag=true;
		var fd = new FormData();
		fd.append("uploadImg", document.getElementById("uploadImg").files[0]);
		fd.append("filename",realip);
		$.ajax({
  			url:'Uploadspicture.php',
			type: 'POST',
			data: fd,
                   	dataType: "json",
                   	cache: false,//上传文件无需缓存
                   	processData: false,//用于对data参数进行序列化处理 这里必须false
                   	contentType: false, //必须
			success:function(data){
				if(data.succ){uploadsucc=true; myalert('图片上传成功，点击下一步进行处理！','');}
				else{nextflag=false;uploadsucc=true;}
			}
 		})
		document.getElementById('myform').reset();
	}
} 

function appStart(){
	if(!window.app || !window.$){ return; console.log('Error: 资源加载错误'); }
	
	/*定义事件*/
	app.evtDown = app.isTOUCH ? 'touchstart' : 'mousedown';
	app.evtUp = app.isTOUCH ? 'touchend' : 'mouseup';
	app.evtClick = app.isTOUCH ? 'tap' : 'click';
	$.event.special.tap = {
        setup: function () {
            $(this).on('touchstart.tap', function (e) {
                $(this).data('@tap_startTime', e.timeStamp);
            });
            $(this).on('touchmove.tap', function (e) {
                $(this).removeData('@tap_startTime');
            });
            $(this).on('touchend.tap', function (e) {
                if($(this).data('@tap_startTime') && e.timeStamp-$(this).data('@tap_startTime')<800){
                	$(this).removeData('@tap_startTime');
                	var myevt=$.Event("tap");
                	myevt.originalEvent=e.originalEvent;
                	setTimeout(function(){ $.event.trigger(myevt, null, e.target); }, 100);
                } 
            });
        },
        teardown: function () {
        	$(this).off('touchstart.tap').off('touchmove.tap').off('touchend.tap');
            $.event.remove(this, 'tap');
            $.removeData(this, '@tap_startTime');
        }
	};
	$.event.special.slide = {
        setup: function () {
            $(this).on(app.evtDown+'.slide', function (e) {
                $(this).data('@slide_startTime', e.timeStamp);
                $(this).data('@slide_startX', e.pageX || e.originalEvent.changedTouches[0].pageX );
                $(this).data('@slide_startY', e.pageY || e.originalEvent.changedTouches[0].pageY );
            });
            $(this).on(app.evtUp+'.slide', function (e) {
            	var sx = $(this).data('@slide_startX');
            	var sy = $(this).data('@slide_startY');
            	var ex = e.pageX || e.originalEvent.changedTouches[0].pageX;
            	var ey = e.pageY || e.originalEvent.changedTouches[0].pageY;
            	var startTime = $(this).data('@slide_startTime');
            	var type, myevt, limit=30;
            	$(this).removeData('@slide_startX').removeData('@slide_startY').removeData('@slide_startTime');
            	if(typeof(startTime)!='number' || e.timeStamp-startTime>1000){ return;}
            	if(typeof(sx)!='number' || typeof(ex)!='number' || typeof(sy)!='number' || typeof(ey)!='number'){ return; }
            	ex = ex - sx;
            	ey = ey - sy;
            	if(Math.abs(ex)>Math.abs(ey)){
            		if(ex>limit){ type = 'right'; }else if(ex<-limit){ type = 'left'; };
            	}else{
            		if(ey>limit){ type = 'down'; }else if(ey<-limit){ type = 'up'; };
            	}
            	if(type){
	            	myevt=$.Event("slide");
	            	myevt.slideType = type;
	            	$.event.trigger(myevt, null, e.target);
            	}
            });
        },
        teardown: function () {
        	$.event.remove(this, 'slide');
        	$(this).off(app.evtDown+'.slide').off(app.evtUp+'.slide');
            $(this).removeData('@slide_startX').removeData('@slide_startTime');
        }
	};
	
	
	/*提示弹窗*/
	function myAlert(info, callback){
		var html = '';
		if(info===undefined){ info = ''; }
		if(info===null){ info = 'null'; }
		if(typeof(info)==='boolean'){ info = info?'true':'false'; }
		html += '<div class="alert"><article>';
		html += '<header>'+info+'</header>';
		html += '<footer><a>确定</a></footer>';
		html += '</article></div>';
		html = $(html);
		html.find('footer').one(app.evtClick, function(){
			var div = $(this).closest('.alert');
			div.addClass('alert_out').one('webkitAnimationEnd', function(){
				$(this).remove();
				if(typeof(callback)=='function'){ callback(); }
			});
		});
		$('.app').append(html);
	};
	window.myalert = myAlert;
	
	
	/*loading提示*/
	function loadingShow(callback){
		var html = $(".loading");
		if(html.length){ html.removeClass('loading_out').off('webkitAnimationEnd'); return; }
		html = $('<div class="loading"><center><i></i></center></div>');
		$(".app").append(html);
		if(typeof(callback)!='function'){ return; }
		html.one('webkitAnimationEnd', function(){ callback(); });
	};
	function loadingHide(callback){
		var html = $(".loading");
		if(!html.length){ return; }
		html.addClass('loading_out').one('webkitAnimationEnd', function(){
			$(this).remove();
			if(typeof(callback)!='function'){ return; }
			setTimeout(callback, 100);
		});
	};
	
	
	/*切屏*/
	function slideTo(el, isBack, callback){
		var curr = $(".app>section:visible");
		var next = $(el);
		if(next.is(curr)){ return; }
		curr.length && curr.addClass('no_animation').transit({y: isBack?'100%':'-100%'}, 300, function(){
			$(this).removeClass('no_animation').removeAttr('style');
		});
		next.css({display:'block', y:isBack?'-100%':'100%'}).addClass('no_animation').transit({y: 0}, 300, function(){ 
			$(this).removeClass('no_animation');
			typeof(callback)=='function' && callback();
		});
	};



	function CombineFinallyPicture(canvasid,imgid,exapicurl,mainpicurl,rulesurl,titleurl,logalurl,qcordurl,saveurl,tipsurl,bgurl){
		var c = document.getElementById(canvasid);
		var cxt = c.getContext("2d");

		var a = document.getElementById('ss5img').width/676;
		var mainwidth = 750*a,mainheight = 1207*a;
		document.getElementById(canvasid).width = mainwidth;
		document.getElementById(canvasid).height = mainheight;

		var picwidth = 676*a;
		var picheight = 841*a;

		var bg = new Image();
		bg.setAttribute("crossOrigin",'anonymous');
		bg.src = bgurl;
		bg.onload = function(){
			cxt.drawImage(bg,0,0,mainwidth,mainheight);//背景

			var exapic = new Image();
			exapic.setAttribute("crossOrigin",'anonymous');
			exapic.src = exapicurl;
			exapic.onload = function(){
				var mainpic = new Image();
				mainpic.setAttribute("crossOrigin",'anonymous');
				mainpic.src = mainpicurl;
				mainpic.onload = function(){
					var rules = new Image();
					rules.setAttribute("crossOrigin",'anonymous');
					rules.src = rulesurl;
					rules.onload = function(){

						for(var i=0;i<4;i++)
							for(var j=0;j<5;j++){
								if (i==1 && j==2){
									cxt.drawImage(mainpic,a*38+j*picwidth/5,a*175+i*picheight/4,picwidth/5,picheight/4);
									cxt.drawImage(rules,a*38+j*picwidth/5,a*175+i*picheight/4,picwidth/5,picheight/4);
									continue;
								}
								cxt.drawImage(exapic,a*38+j*picwidth/5,a*175+i*picheight/4,picwidth/5,picheight/4);
								cxt.drawImage(rules,a*38+j*picwidth/5,a*175+i*picheight/4,picwidth/5,picheight/4);
							}

						var logal = new Image();
						logal.setAttribute("crossOrigin",'anonymous');
						logal.src = logalurl;
						logal.onload = function(){
								cxt.drawImage(logal,572*a,927*a,122*a,60*a);
								var myimg = c.toDataURL('image/png');
                                                        	document.getElementById(imgid).src = myimg;
								
								slideTo('.ss5', true);
								setTimeout("myalert('长按保存图片','')",1000);
						}
					}
				};
			};

			var title = new Image();
			title.setAttribute("crossOrigin",'anonymous');
			title.src = titleurl;
			title.onload = function(){
				cxt.drawImage(title,39*a,46*a,392*a,103*a);//标题

				var qcord = new Image();
				qcord.setAttribute("crossOrigin",'anonymous');
				qcord.src = qcordurl;
				qcord.onload = function(){
					cxt.drawImage(qcord,586*a,1056*a,103*a,103*a);//二维码

					var size = 24*a;
					var tmp_size = 0*a;

					cxt.fillStyle="#ffffff";
					cxt.font = "bold "+size+"px arial";
					cxt.fillText("“",25*a,1074*a+tmp_size);

					cxt.fillStyle="#ffffff";
					cxt.font = "bold "+size+"px arial";
					var mess = "我是"+window.inputname+"，";
					cxt.fillText(mess,45*a,1080*a+tmp_size);

					cxt.fillStyle="#ffffff";
                                        cxt.font = "bold "+size+"px arial";
                                        mess = "我是第";
                                        cxt.fillText(mess,45*a,1120*a+tmp_size);

					cxt.fillStyle="#ffffff";
                                        cxt.font = "italic bold "+37*a+"px arial";
                                        mess = window.rank;
                                        cxt.fillText(mess,130*a,1120*a+tmp_size);

					cxt.fillStyle="#ffffff";
                                        cxt.font = "bold "+size+"px arial";
                                        mess = "个，";
                                        cxt.fillText(mess,210*a,1120*a+tmp_size);


                                        cxt.fillStyle="#ffffff";
                                        cxt.font = "bold "+size+"px arial";
                                        mess = '了解与包容性别多元化的发声者。”';
                                        cxt.fillText(mess,45*a,1160*a+tmp_size);


						var tips = new Image();
						tips.setAttribute("crossOrigin",'anonymous');
						tips.src = tipsurl;
						tips.onload = function(){
							cxt.drawImage(tips,557*a,1056*a,25*a,103*a);//二维码提示
							var myimg = c.toDataURL('image/png');
                                                        document.getElementById(imgid).src = myimg;
						}
				}
			}
		}
	}



	function CombineOnePicture(canvasid,imgid,mainpictureurl,rulesurl,logourl,titleurl,qcordurl,width,att,tipsurl) {
		var c = document.getElementById(canvasid);
		var context = c.getContext("2d");

		var alphe = width/669;
		var borderwidth = 0,borderheight = 0;
		var mainwidth = 669*alphe,mainheight = 1037*alphe;

		document.getElementById(canvasid).width = 669*alphe;
		document.getElementById(canvasid).height = 1037*alphe;

		// 添加图片
		var main = new Image();
		main.setAttribute("crossOrigin",'anonymous');
		main.src = mainpictureurl;
		main.onload = function(){
			context.drawImage(main,borderwidth,borderheight,mainwidth,mainheight);

			// 添加标尺
			var rules = new Image();
			rules.setAttribute("crossOrigin",'anonymous');
			rules.src = rulesurl;
			rules.onload = function(){
				context.drawImage(rules,borderwidth,borderheight,mainwidth,mainheight);

				// 添加logo
				var logo = new Image();
				logo.setAttribute("crossOrigin",'anonymous');
				logo.src = logourl;
				logo.onload = function(){
					context.drawImage(logo,borderwidth+479*alphe,borderheight+933*alphe,141*alphe,70*alphe);

					// 添加文字表述
					var title = new Image();
					title.setAttribute("crossOrigin",'anonymous');
					title.src = titleurl;
					title.onload = function(){
						context.drawImage(title,borderwidth+38*alphe,borderheight+41*alphe,392*alphe,103*alphe);

						// 添加二维码
						var qrcode = new Image();
						qrcode.setAttribute("crossOrigin",'anonymous');
						qrcode.src = qcordurl;
						qrcode.onload = function(){
							context.drawImage(qrcode,borderwidth+50*alphe,borderheight+909*alphe,93*alphe,93*alphe);
							
							//二维码提示
							var tips = new Image();
							tips.setAttribute("crossOrigin",'anonymous');
							tips.src = tipsurl;
							tips.onload = function(){
								context.drawImage(tips,149*alphe,909*alphe,25*alphe,93*alphe);
								
								var myimg = c.toDataURL('image/png');
								document.getElementById(imgid).src = myimg;
								slideTo(att, true);
								setTimeout("myalert('长按保存图片','')",1000);
							}		
						};
					};
				};
			};
		};
	}

	/*
	 *  获取ip地址以及访问排名
	 */
	function GetIPandRank(){
		$.ajax({
			type:"GET",
			url:"GetIP.php",
			dataType:"JSON",
			success: function(s){
				window.realip = s.ip;
				window.rank = s.rank;
			}
		});
	}
        /* 上传图片 */
    /*$(".ss3 button.bt1").on(app.evtClick, function(){
        var flag = true;
        var countIsExits = 0;
        while(flag){
        	setTimeout($.ajax({
            	type: "GET",
            	url: "IsExists.php",
            	data: "userip="+window.realip,
            	dataType:"JSON",
            	success: function(s){
            		if (s.succ) {
            			myAlert("上传成功!点击下一步操作");
            			flag = false;
            		}
            		else {
            			countIsExits = countIsExits + 1;
            			if (countIsExits === 1) {
            				myAlert("上传超时!请重新上传图片!");
            				flag = false;
            			}

            		}
            	}
            }),5000);
        }
      
    });*/
	/* 页面切换 */
	$(".ss3 button.bt2").on(app.evtClick, function(){
		if(!window.nextflag && !window.uploadsucc){myalert("请上传图片！","");return;}
		if(!window.nextflag && window.uploadsucc){myalert("上传图片失败！","");window,uploadsucc=false;return;}
		if(window.nextflag && (!window.uploadsucc)){myalert('照片上传中，请稍等……','');return;}
		if(window.combine){myalert('图片合成中，成功后将自动跳转！','');return;}
		
		$.ajax({
					type:"GET",
					url:"Dealt.php",
					data:"filename="+realip+"&bgnum="+$('.current-dot').index(),
					dataType:"JSON",
					success: function(s){
							if(s.succ){
								window.pro_pic_url=s.path;
								window.picturenum = parseInt($('.current-dot').index());
								CombineOnePicture("canvasss4","ss4img",window.pro_pic_url,'img/rules.png','img/logo1.png'
									,'img/标题.png','img/xiuxiu.jpeg',document.getElementById("ss4img").width,'.ss4',"img/2.jpeg");
							}
							else{
								myAlert("图片分析不成功，请上传含有清晰人脸的图片。","");
								window.nextflag=false;
								window.combine=false;
							}
					}
			});
		window.combine=true;
		myalert('开始合成图片，请稍等……','');
		
	});
	$(".ss4 button.bt3").on(app.evtClick, function(){
		window.nextflag	= false;
		window.uploadsucc = false;
		window.combine = false;
		slideTo('.ss3', true);
	});
	$(".ss4 button.bt5").on(app.evtClick, function(){
		$(".ss4>center-hid").show();
	});
	$(".ss4>center-hid a").on(app.evtClick, function(){
		window.inputname=document.getElementById("ss4input").value;
		if(!window.inputname){ 
			myAlert('请填写您的名字！'); return; 
		};
		
		$(".ss4>center-hid").hide();

		CombineFinallyPicture("canvasss5","ss5show",'img/bg/'+window.picturenum+'.jpg',window.pro_pic_url
		,'img/rules.png',"img/标题.png","img/logo1.png","img/xiuxiu.jpeg",
		"img/长按保存.png","img/1.jpeg","img/bg.png");
	});
          
        /* share_test*/
        $(function(){
        if(navigator.userAgent.match(/MicroMessenger/i)){
             var weixinShareLogo='img/load1.png' ;
             $('body').prepend('<div style="overflow:hidden;width:0px;height:0;margin:0 auto;position:absolute;top:-800px;"><img src="'+weixinShareLogo+'"></div>');
       }

        }); 
	/*app开始*/
	$(".load").addClass('no_animation').transit({opacity:0}, 400, 'linear', function(){
		GetIPandRank();
		$(this).remove();
		$(".ss1").css({display:'block', opacity:0}).transit({opacity:1}, 400, 'linear');

		/*CombineFinallyPicture("canvasss5","ss5show",'img/bg/'+window.picturenum+'.jpg',window.pro_pic_url
                ,'img/rules.png',"img/标题.png","img/logo1.png","img/xiuxiu.jpeg",
                "img/长按保存.png","img/1.jpeg","img/bg.png");*/

		setTimeout(function(){slideTo('.ss2', true);}, 5000);
		setTimeout(function(){slideTo('.ss3', true);}, 10000);
	});
};
