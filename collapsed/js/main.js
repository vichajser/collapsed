/*
	*collapsed form element && tabbed page
	*@author : zwq
	*@update : 2014-03-07
	*@finish : false 
*/
var collapsed = function(){
	//public main methods

	function _getId(elem){
		return document.getElementById(elem);
	};

	//by Ruby 
	function _getClassName(searchClass,node,tag) {
    	if(document.getElementsByClassName){
        	return  document.getElementsByClassName(searchClass)
    	}else{    
        	node = node || document;
        	tag = tag || '*';
        	var returnElements = []
        	var els =  (tag === "*" && node.all)? node.all : node.getElementsByTagName(tag);
        	var i = els.length;
        	searchClass = searchClass.replace(/\-/g, "\\-");
        	var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
       	 	while(--i >= 0){
            	if (pattern.test(els[i].className) ) {
                	returnElements.push(els[i]);
            	}
        	}
        	return returnElements;
    	}
	};

	//foreach
	function _each(arr,callback,thisp){
		if(arr.forEach){
			arr.forEach(callBack,thisp);
		}else{
			for(var i = 0;i < arr.length;i++){
				callback.call(thisp,arr[i],i,arr);
			}
		}
	};

	//currentStyle：获取计算后的样式，也叫当前样式、最终样式。
	function _currentStyle(elem,style){
		return elem.currentStyle ? elem.currentStyle : window.getComputedStyle(elem,null)
	};

	//get elements rect
	function _getrect(elem){
		var rect = elem.getBoundingClientRect();
		if(arguments < 1) return;
		return {
			width:rect.width,
			height:rect.height,
			left:rect.left,
			top : rect.top
		}
	};

	//add event listener
	function _addEvent(el,type,fn){
		if(el.addEventListener){
			el.addEventListener(type,fn,false);
		}else if(el.attachEvent){
			el.attachEvent("on" + type,fn);
		}
	};

	//remove event
	function _removeEvent(el,type,fn){
		if(el.removeEventListener){
			el.removeEventListener(type,fn,false);
		}else if(el.detachEvent){
			el.detachEvent("on" + type,fn);
		}
	};

	//is Array
	function isArray(node){
		if(Array.isArray){
			return Array.isArray(node);
		}else if(Array.isArray === "undefined"){
			Array.isArray = function(arg){
				return Object.prototype.toString.call(arg) === "[object Array]";
			}
		}
	};

	var collaps = function(elem1,elem2){
		if(arguments < 2){throw new Error ("参数不得少于2个")};
		var that = this;
		if(!(that instanceof collaps)){
			return new collaps(elem1,elem2);
		};
		that.coll = _getId(elem1) || window.document.body;
		that.con = _getClassName(elem2);
	};

	collaps.prototype = {
		constructor : collaps,

		//show main content
		show : function(elem){
			//max-height
			var num = 200;
			var height = _getrect(elem).height;
			var show = function(){
				var newNum = height;

				if(newNum > num || newNum < 40){
					clearInterval(show);
					return false;
				}else{
					newNum += 1;
					elem.style.height = newNum + "px";	
					height = newNum;	
				}
				return height;
			};
			return show;
		},

		//hidden all content
		hidden : function(elem){
			var num = 200;
			var height = parseInt(_currentStyle(elem).height);

			var hidden = function(){
				var newNum = height;
				if(height > 40 && height <= 201){
					newNum =newNum - 1;
					elem.style.height = newNum + "px";
					height = newNum;
				}else{
					clearInterval(hidden);
					return false;
				}
				return height;
			};
			return hidden;
		}
	};

	var tab = function(elem1,elem2){
		var self = this;
		if(!(self instanceof tab)){
			return new tab(elem1,elem2);
		}
		self.tabTit = _getClassName(elem1);
		self.tabMain = _getClassName(elem2);
	};

	tab.prototype = {
		constructor: tab,

		//node2 is the elment that display
		showMain : function(node1,node2){
			node1.className = "tabbed_tit on"
			node2.className = "tabbed_main on"
			node2.style.display = "block";
		},
		hiddenMain : function(nodeArr1,nodeArr2){
			// if(!(isArray(nodeArr1)||(isArray(nodeArr2)))){
			// 	throw new Error("please enter an Array");
			// }
			_each(nodeArr1,function(value,index,arr){
				arr[index].className = "tabbed_tit";
			});
			_each(nodeArr2,function(value,index,arr){
				arr[index].className = "tabbed_main";
				arr[index].style.display = "none";
			})
		}
	}

	return {
		coll : function (elem1,elem2){
			//use main class
			var colls = new collaps(elem1,elem2);
			_each(colls.con,function(val,index,arr){
				_addEvent(arr[index],"click",function(){ 
					_each(colls.con,function(val,index,arr){
						var hidden = setInterval(colls.hidden(arr[index]),5);
					},colls);
					var show = setInterval(colls.show(arr[index]),5);
				})
			},colls);
		},
		tab : function(elem1,elem2){
			// use main class
			var t = new tab(elem1,elem2);
			_each(t.tabTit,function(val,i,arr){
				_addEvent(arr[i],"click",function(){
					t.hiddenMain(t.tabTit,t.tabMain);
					t.showMain(arr[i],t.tabMain[i]);
				});
			},t);
		}
	}
}
